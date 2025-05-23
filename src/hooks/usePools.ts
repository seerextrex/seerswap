import { POOL_DEPLOYER_ADDRESS } from "../constants/addresses";
import { Currency, Token } from "@uniswap/sdk-core";
import { useMemo, useCallback, useRef, useEffect } from "react";
import { useAccount } from "wagmi";
import { ListenerOptions, useMultipleContractSingleData } from "../state/multicall/hooks";

import { Pool } from "lib/src";
import { Interface } from "ethers";
import abi from "../abis/pool.json";
import { computePoolAddress } from "./computePoolAddress";
import { useInternet } from "./useInternet";
import { useToken } from "./Tokens";
import { usePreviousNonEmptyArray, usePreviousNonErroredArray } from "./usePrevious";
import { safeConvertToBigInt, deepEqual } from "../utils/bigintUtils";

// Production-mode logger that only logs in development
const logger = {
    debug: (process.env.NODE_ENV === 'development')
        ? (...args: any[]) => console.debug(...args)
        : () => { /* no-op in production */ },
    warn: (...args: any[]) => console.warn(...args),
    error: (...args: any[]) => console.error(...args),
};

const POOL_STATE_INTERFACE = new Interface(abi);

export enum PoolState {
    LOADING,
    NOT_EXISTS,
    EXISTS,
    INVALID,
}

// Global pool cache to prevent duplicate calls
// This exists across component renders and hook instances
const poolCache = new Map<string, { state: PoolState, pool: Pool | null, timestamp: number }>();

// Cache expiration time - 2 minutes
const CACHE_EXPIRY_MS = 2 * 60 * 1000;

// Helper to generate a stable, unique key for a currency pair
function getPoolCacheKey(chainId: number | undefined, currencyA: Currency | undefined, currencyB: Currency | undefined): string | null {
    if (!chainId || !currencyA || !currencyB) return null;

    const tokenA = currencyA.wrapped;
    const tokenB = currencyB.wrapped;

    if (!tokenA || !tokenB || tokenA.equals(tokenB)) return null;

    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
    return `${chainId}:${token0.address.toLowerCase()}:${token1.address.toLowerCase()}`;
}

// Helper to check if currencies are valid for pool lookup
function areCurrenciesValid(chainId: number | undefined, currencyA: Currency | undefined, currencyB: Currency | undefined): boolean {
    if (!chainId || !currencyA || !currencyB) return false;

    const tokenA = currencyA.wrapped;
    const tokenB = currencyB.wrapped;

    return Boolean(tokenA && tokenB && !tokenA.equals(tokenB));
}

export function usePools(poolKeys: [Currency | undefined, Currency | undefined][], listenerOptions?: ListenerOptions): [PoolState, Pool | null][] {
    const { chain } = useAccount();
    const chainId = chain?.id;

    // Reduce logging in production
    const logOnce = useRef(false);
    if (process.env.NODE_ENV === 'development' && !logOnce.current) {
        logger.debug('usePools: Input poolKeys:', poolKeys);
        logger.debug('usePools: chainId:', chainId);
        logOnce.current = true;
    }

    // Get or create pool deployer address
    const poolDeployerAddress = useMemo(() => {
        if (!chainId) return undefined;
        return POOL_DEPLOYER_ADDRESS[chainId];
    }, [chainId]);

    // Transform currencies to tokens with stability check
    const transformed: ([Token, Token] | null)[] = useMemo(() => {
        return poolKeys.map(([currencyA, currencyB]): [Token, Token] | null => {
            if (!chainId || !currencyA || !currencyB) return null;

            const tokenA = currencyA?.wrapped;
            const tokenB = currencyB?.wrapped;
            if (!tokenA || !tokenB || tokenA.equals(tokenB)) return null;
            const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
            return [token0, token1];
        });
    }, [chainId, poolKeys]);

    // Cache pool addresses to prevent address recalculation
    const poolAddressesCache = useRef<Map<string, string>>(new Map());

    // Check for cached pools and generate pool addresses for non-cached pairs
    const {
        poolAddresses,
        shouldFetchData,
        cachedResults
    } = useMemo(() => {
        const addresses: (string | undefined)[] = [];
        const shouldFetch: boolean[] = [];
        const cachedResults: [PoolState, Pool | null][] = [];

        if (!poolDeployerAddress) {
            return {
                poolAddresses: Array(transformed.length).fill(undefined),
                shouldFetchData: Array(transformed.length).fill(false),
                cachedResults: Array(transformed.length).fill([PoolState.INVALID, null])
            };
        }

        for (let i = 0; i < transformed.length; i++) {
            const tokenPair = transformed[i];

            if (!tokenPair) {
                addresses.push(undefined);
                shouldFetch.push(false);
                cachedResults.push([PoolState.INVALID, null]);
                continue;
            }

            const [token0, token1] = tokenPair;
            const cacheKey = `${chainId}:${token0.address.toLowerCase()}:${token1.address.toLowerCase()}`;

            // Check if we have a cached result
            const cachedPool = poolCache.get(cacheKey);
            if (cachedPool && Date.now() - cachedPool.timestamp < CACHE_EXPIRY_MS) {
                addresses.push(undefined);
                shouldFetch.push(false);
                cachedResults.push([cachedPool.state, cachedPool.pool]);
                continue;
            }

            // Check if we've already computed this pool address
            let poolAddress = poolAddressesCache.current.get(cacheKey);

            if (!poolAddress) {
                // Compute the pool address if we haven't already
                try {
                    poolAddress = computePoolAddress({
                        poolDeployer: poolDeployerAddress,
                        tokenA: token0,
                        tokenB: token1,
                    });
                    poolAddressesCache.current.set(cacheKey, poolAddress);
                } catch (error) {
                    logger.error('usePools: Error in computePoolAddress:', error);
                    addresses.push(undefined);
                    shouldFetch.push(false);
                    cachedResults.push([PoolState.INVALID, null]);
                    continue;
                }
            }

            addresses.push(poolAddress);
            shouldFetch.push(true);
            cachedResults.push([PoolState.LOADING, null]);
        }

        return {
            poolAddresses: addresses,
            shouldFetchData: shouldFetch,
            cachedResults
        };
    }, [chainId, poolDeployerAddress, transformed]);

    // Get only the addresses that need fetching
    const fetchAddresses = useMemo(() => {
        return poolAddresses.filter((addr, i) => shouldFetchData[i] && addr !== undefined) as string[];
    }, [poolAddresses, shouldFetchData]);

    // Add custom listener options to reduce fetch frequency
    const customListenerOptions = useMemo(() => ({
        ...listenerOptions,
        blocksPerFetch: 10, // Reduce fetch frequency
    }), [listenerOptions]);

    // Fetch global states only for addresses that need fetching
    const globalState0s = useMultipleContractSingleData(
        fetchAddresses,
        POOL_STATE_INTERFACE,
        "globalState",
        undefined,
        customListenerOptions
    );

    const prevGlobalState0s = usePreviousNonErroredArray(globalState0s);

    // Optimize globalState0s to avoid unnecessary re-renders
    const _globalState0s = useMemo(() => {
        if (!globalState0s) return globalState0s;
        if (globalState0s.every((el) => !el.valid || el.loading)) return globalState0s;

        if (prevGlobalState0s && prevGlobalState0s.length === globalState0s.length &&
            globalState0s.every((el, i) => {
                const prevEl = prevGlobalState0s[i];
                if (!el.valid || el.loading || !prevEl || !prevEl.valid || prevEl.loading) {
                    return false;
                }

                try {
                    // Compare prices, ticks, and fees without JSON.stringify
                    const currentResult = el.result as { price: bigint, tick: bigint, fee: bigint } | undefined;
                    const prevResult = prevEl.result as { price: bigint, tick: bigint, fee: bigint } | undefined;

                    if (!currentResult || !prevResult) return false;

                    return currentResult.price === prevResult.price &&
                        currentResult.tick === prevResult.tick &&
                        currentResult.fee === prevResult.fee;
                } catch (e) {
                    return false;
                }
            })
        ) {
            return prevGlobalState0s;
        }

        return globalState0s;
    }, [globalState0s, prevGlobalState0s]);

    // Fetch liquidities only for addresses that need fetching
    const liquidities = useMultipleContractSingleData(
        fetchAddresses,
        POOL_STATE_INTERFACE,
        "liquidity",
        undefined,
        customListenerOptions
    );

    const prevLiquidities = usePreviousNonErroredArray(liquidities);

    // Optimize liquidities to avoid unnecessary re-renders
    const _liquidities = useMemo(() => {
        if (!liquidities) return liquidities;
        if (liquidities.every((el) => !el.valid || el.loading)) return liquidities;

        if (prevLiquidities && prevLiquidities.length === liquidities.length &&
            liquidities.every((el, i) => {
                const prevEl = prevLiquidities[i];
                if (!el.valid || el.loading || !prevEl || !prevEl.valid || prevEl.loading) {
                    return false;
                }

                try {
                    // Compare liquidity values directly
                    const currentResult = el.result as [bigint] | undefined;
                    const prevResult = prevEl.result as [bigint] | undefined;

                    if (!currentResult || !prevResult) return false;

                    return currentResult[0] === prevResult[0];
                } catch (e) {
                    return false;
                }
            })
        ) {
            return prevLiquidities;
        }

        return liquidities;
    }, [liquidities, prevLiquidities]);

    // Create a map to associate fetched results with their original indices
    const fetchResultsMap = useMemo(() => {
        const resultMap = new Map<string, { globalState: any, liquidity: any }>();

        let fetchIndex = 0;
        for (let i = 0; i < poolAddresses.length; i++) {
            const address = poolAddresses[i];
            if (!shouldFetchData[i] || !address) continue;

            resultMap.set(address, {
                globalState: _globalState0s[fetchIndex],
                liquidity: _liquidities[fetchIndex]
            });

            fetchIndex++;
        }

        return resultMap;
    }, [poolAddresses, shouldFetchData, _globalState0s, _liquidities]);

    // Process pool data and create Pool instances
    return useMemo(() => {
        const results: [PoolState, Pool | null][] = [];

        for (let i = 0; i < poolKeys.length; i++) {
            // Use cached result if available
            if (!shouldFetchData[i]) {
                results.push(cachedResults[i]);
                continue;
            }

            const [currencyA, currencyB] = poolKeys[i];
            const [token0, token1] = transformed[i] ?? [];
            const poolAddress = poolAddresses[i];

            // Skip if tokens or pool address are invalid
            if (!token0 || !token1 || !poolAddress) {
                results.push([PoolState.INVALID, null]);
                continue;
            }

            const cacheKey = `${chainId}:${token0.address.toLowerCase()}:${token1.address.toLowerCase()}`;
            const fetchedResults = fetchResultsMap.get(poolAddress);

            if (!fetchedResults) {
                results.push([PoolState.INVALID, null]);
                continue;
            }

            const { globalState: globalStateResult, liquidity: liquidityResult } = fetchedResults;

            // Skip if results are invalid
            if (!globalStateResult || !liquidityResult) {
                results.push([PoolState.INVALID, null]);
                continue;
            }

            const { result: globalState, loading: globalStateLoading, valid: globalStateValid } = globalStateResult;
            const { result: liquidity, loading: liquidityLoading, valid: liquidityValid } = liquidityResult;

            // Return appropriate state based on result validity and loading state
            if (!globalStateValid || !liquidityValid) {
                const result: [PoolState, Pool | null] = [PoolState.INVALID, null];
                results.push(result);
                poolCache.set(cacheKey, { state: result[0], pool: result[1], timestamp: Date.now() });
                continue;
            }

            if (globalStateLoading || liquidityLoading) {
                const result: [PoolState, Pool | null] = [PoolState.LOADING, null];
                results.push(result);
                continue;
            }

            // Ensure results are present
            if (!globalState || !liquidity) {
                const result: [PoolState, Pool | null] = [PoolState.NOT_EXISTS, null];
                results.push(result);
                poolCache.set(cacheKey, { state: result[0], pool: result[1], timestamp: Date.now() });
                continue;
            }

            // A pool must have a non-zero price to be valid
            if (!globalState.price || globalState.price === 0n) {
                const result: [PoolState, Pool | null] = [PoolState.NOT_EXISTS, null];
                results.push(result);
                poolCache.set(cacheKey, { state: result[0], pool: result[1], timestamp: Date.now() });
                continue;
            }

            try {
                // Create Pool instance with properly converted values
                const feeAsNumber = Number(globalState.fee);
                const tickAsNumber = Number(globalState.tick);
                const priceAsString = globalState.price.toString();
                const liquidityAsString = liquidity[0].toString();

                const poolInstance = new Pool(
                    token0,
                    token1,
                    feeAsNumber,
                    priceAsString,
                    liquidityAsString,
                    tickAsNumber
                );

                const result: [PoolState, Pool | null] = [PoolState.EXISTS, poolInstance];
                results.push(result);
                poolCache.set(cacheKey, { state: result[0], pool: result[1], timestamp: Date.now() });
                continue;
            } catch (error) {
                logger.error(`usePools index ${i}: Error constructing pool:`, error);
                const result: [PoolState, Pool | null] = [PoolState.NOT_EXISTS, null];
                results.push(result);
                poolCache.set(cacheKey, { state: result[0], pool: result[1], timestamp: Date.now() });
                continue;
            }
        }

        return results;
    }, [poolKeys, transformed, poolAddresses, shouldFetchData, fetchResultsMap, cachedResults, chainId]);
}

export function usePool(
    currencyA: Currency | undefined,
    currencyB: Currency | undefined,
    listenerOptions?: ListenerOptions
): [PoolState, Pool | null] {
    const { chain } = useAccount();
    const chainId = chain?.id;

    // IMPORTANT: Always call hooks at the top level - unconditionally
    // Call usePools first to follow React's rules of hooks
    const pools = usePools([[currencyA, currencyB]], listenerOptions);

    // Then handle early returns with cached or invalid data
    const cacheKey = getPoolCacheKey(chainId, currencyA, currencyB);
    const cachedPool = cacheKey ? poolCache.get(cacheKey) : null;

    // For undefined inputs, return INVALID 
    if (!areCurrenciesValid(chainId, currencyA, currencyB)) {
        return [PoolState.INVALID, null];
    }

    // Use cache if available and not expired
    if (cachedPool && Date.now() - cachedPool.timestamp < CACHE_EXPIRY_MS) {
        return [cachedPool.state, cachedPool.pool];
    }

    // Otherwise use the result from the usePools call
    return pools[0];
}

export function useTokensSymbols(token0: string, token1: string) {
    const _token0 = useToken(token0);
    const _token1 = useToken(token1);

    return useMemo(() => {
        return {
            token0Symbol: _token0?.symbol,
            token1Symbol: _token1?.symbol,
        };
    }, [_token0, _token1]);
}
