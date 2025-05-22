import { POOL_DEPLOYER_ADDRESS } from "../constants/addresses";
import { Currency, Token } from "@uniswap/sdk-core";
import { useMemo, useCallback } from "react";
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
        : () => { },
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

export function usePools(poolKeys: [Currency | undefined, Currency | undefined][], listenerOptions?: ListenerOptions): [PoolState, Pool | null][] {
    const { chain } = useAccount();
    const chainId = chain?.id;

    logger.debug('usePools: Input poolKeys:', poolKeys);
    logger.debug('usePools: chainId:', chainId);

    // Transform currencies to tokens
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

    // Compute pool addresses from token pairs
    const poolAddresses: (string | undefined)[] = useMemo(() => {
        const poolDeployerAddress = chainId && POOL_DEPLOYER_ADDRESS[chainId];
        logger.debug('usePools: poolDeployerAddress:', poolDeployerAddress);

        return transformed.map((value) => {
            if (!poolDeployerAddress || !value) return undefined;
            try {
                return computePoolAddress({
                    poolDeployer: poolDeployerAddress,
                    tokenA: value[0],
                    tokenB: value[1],
                });
            } catch (error) {
                logger.error('usePools: Error in computePoolAddress:', error);
                return undefined;
            }
        });
    }, [chainId, transformed]);

    // Fetch global states
    const globalState0s = useMultipleContractSingleData(
        poolAddresses,
        POOL_STATE_INTERFACE,
        "globalState",
        undefined,
        listenerOptions
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

    // Fetch liquidities
    const liquidities = useMultipleContractSingleData(
        poolAddresses,
        POOL_STATE_INTERFACE,
        "liquidity",
        undefined,
        listenerOptions
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

    // Process pool data and create Pool instances
    return useMemo(() => {
        return poolKeys.map((_key, index) => {
            const [token0, token1] = transformed[index] ?? [];

            // Skip if tokens are invalid
            if (!token0 || !token1) {
                logger.debug(`usePools index ${index}: Invalid token pair.`);
                return [PoolState.INVALID, null];
            }

            const globalStateResult = _globalState0s[index];
            const liquidityResult = _liquidities[index];

            // Skip if results are invalid
            if (!globalStateResult || !liquidityResult) {
                logger.debug(`usePools index ${index}: Missing results`);
                return [PoolState.INVALID, null];
            }

            const { result: globalState, loading: globalStateLoading, valid: globalStateValid } = globalStateResult;
            const { result: liquidity, loading: liquidityLoading, valid: liquidityValid } = liquidityResult;

            // Return appropriate state based on result validity and loading state
            if (!globalStateValid || !liquidityValid) {
                return [PoolState.INVALID, null];
            }

            if (globalStateLoading || liquidityLoading) {
                return [PoolState.LOADING, null];
            }

            // Ensure results are present
            if (!globalState || !liquidity) {
                return [PoolState.NOT_EXISTS, null];
            }

            // A pool must have a non-zero price to be valid
            if (!globalState.price || globalState.price === 0n) {
                return [PoolState.NOT_EXISTS, null];
            }

            try {
                // Create Pool instance with properly converted values
                const feeAsNumber = Number(globalState.fee);
                const tickAsNumber = Number(globalState.tick);
                const priceAsString = globalState.price.toString();
                const liquidityAsString = liquidity[0].toString();

                logger.debug(`usePools index ${index}: Creating Pool with: token0: ${token0.symbol}, token1: ${token1.symbol}, fee: ${feeAsNumber}, tick: ${tickAsNumber}`);

                const poolInstance = new Pool(
                    token0,
                    token1,
                    feeAsNumber,
                    priceAsString,
                    liquidityAsString,
                    tickAsNumber
                );

                return [PoolState.EXISTS, poolInstance];
            } catch (error) {
                logger.error(`usePools index ${index}: Error constructing pool:`, error);
                return [PoolState.NOT_EXISTS, null];
            }
        });
    }, [_globalState0s, _liquidities, poolKeys, transformed]);
}

export function usePool(
    currencyA: Currency | undefined,
    currencyB: Currency | undefined,
    listenerOptions?: ListenerOptions
): [PoolState, Pool | null] {
    const pools = usePools([[currencyA, currencyB]], listenerOptions);
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
