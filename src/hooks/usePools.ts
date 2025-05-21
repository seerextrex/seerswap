import { POOL_DEPLOYER_ADDRESS } from "../constants/addresses";
import { Currency, Token } from "@uniswap/sdk-core";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { ListenerOptions, useMultipleContractSingleData } from "../state/multicall/hooks";

import { Pool } from "lib/src";
import { Interface } from "ethers";
import abi from "../abis/pool.json";
import { computePoolAddress } from "./computePoolAddress";
import { useInternet } from "./useInternet";
import { useToken } from "./Tokens";
import { usePreviousNonEmptyArray, usePreviousNonErroredArray } from "./usePrevious";

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

    console.log('[usePools] Input poolKeys:', poolKeys);
    console.log('[usePools] chainId:', chainId);

    const transformed: ([Token, Token] | null)[] = useMemo(() => {
        const result = poolKeys.map(([currencyA, currencyB]): [Token, Token] | null => {
            if (!chainId || !currencyA || !currencyB) return null;

            const tokenA = currencyA?.wrapped;
            const tokenB = currencyB?.wrapped;
            if (!tokenA || !tokenB || tokenA.equals(tokenB)) return null;
            const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
            return [token0, token1];
        });
        console.log('[usePools] transformed tokens:', result);
        return result;
    }, [chainId, poolKeys]);

    const poolAddresses: (string | undefined)[] = useMemo(() => {
        const poolDeployerAddress = chainId && POOL_DEPLOYER_ADDRESS[chainId];
        console.log('[usePools] poolDeployerAddress:', poolDeployerAddress);

        const result = transformed.map((value) => {
            if (!poolDeployerAddress || !value) return undefined;
            try {
                return computePoolAddress({
                    poolDeployer: poolDeployerAddress,
                    tokenA: value[0],
                    tokenB: value[1],
                });
            } catch (error) {
                console.error('[usePools] Error in computePoolAddress:', error, 'for tokens:', value);
                return undefined;
            }
        });
        console.log('[usePools] computed poolAddresses:', result);
        return result;
    }, [chainId, transformed]);

    const globalState0s = useMultipleContractSingleData(poolAddresses, POOL_STATE_INTERFACE, "globalState", undefined, listenerOptions);
    // console.log('[usePools] Raw globalState0s results:', JSON.stringify(globalState0s));
    const prevGlobalState0s = usePreviousNonErroredArray(globalState0s);

    const _globalState0s = useMemo(() => {
        if (!prevGlobalState0s || !globalState0s || globalState0s.length === 1) return globalState0s;
        if (globalState0s.every((el) => el.error) && !prevGlobalState0s.every((el) => el.error)) return prevGlobalState0s;
        return globalState0s;
    }, [poolAddresses, globalState0s, prevGlobalState0s]); // Added prevGlobalState0s to dependency
    console.log('[usePools] Effective _globalState0s results:', JSON.stringify(_globalState0s, (key, value) => typeof value === 'bigint' ? value.toString() : value));


    const liquidities = useMultipleContractSingleData(poolAddresses, POOL_STATE_INTERFACE, "liquidity", undefined, listenerOptions);
    // console.log('[usePools] Raw liquidities results:', JSON.stringify(liquidities));
    const prevLiquidities = usePreviousNonErroredArray(liquidities);

    const _liquidities = useMemo(() => {
        if (!prevLiquidities || !liquidities || liquidities.length === 1) return liquidities;
        if (liquidities.every((el) => el.error) && !prevLiquidities.every((el) => el.error)) return prevLiquidities;
        return liquidities;
    }, [poolAddresses, liquidities, prevLiquidities]); // Added prevLiquidities to dependency
    console.log('[usePools] Effective _liquidities results:', JSON.stringify(_liquidities, (key, value) => typeof value === 'bigint' ? value.toString() : value));


    return useMemo(() => {
        const finalResult: [PoolState, Pool | null][] = poolKeys.map((_key, index) => {
            const [token0, token1] = transformed[index] ?? [];
            console.log(`[usePools] Processing index ${index}: token0:`, token0?.symbol, 'token1:', token1?.symbol);

            if (!token0 || !token1) {
                console.log(`[usePools] index ${index}: Invalid token pair.`);
                return [PoolState.INVALID, null];
            }

            const globalStateResult = _globalState0s[index];
            const liquidityResult = _liquidities[index];

            console.log(`[usePools] index ${index}: globalStateResult:`, JSON.stringify(globalStateResult, (key, value) => typeof value === 'bigint' ? value.toString() : value));
            console.log(`[usePools] index ${index}: liquidityResult:`, JSON.stringify(liquidityResult, (key, value) => typeof value === 'bigint' ? value.toString() : value));


            if (!globalStateResult || !liquidityResult) {
                console.log(`[usePools] index ${index}: globalStateResult or liquidityResult is undefined`);
                return [PoolState.INVALID, null]; // Should ideally not happen if arrays are same length
            }

            const { result: globalState, loading: globalStateLoading, valid: globalStateValid } = globalStateResult;
            const { result: liquidity, loading: liquidityLoading, valid: liquidityValid } = liquidityResult;

            if (!globalStateValid || !liquidityValid) {
                console.log(`[usePools] index ${index}: globalState or liquidity not valid. globalStateValid: ${globalStateValid}, liquidityValid: ${liquidityValid}`);
                return [PoolState.INVALID, null];
            }
            if (globalStateLoading || liquidityLoading) {
                console.log(`[usePools] index ${index}: globalState or liquidity loading. globalStateLoading: ${globalStateLoading}, liquidityLoading: ${liquidityLoading}`);
                return [PoolState.LOADING, null];
            }

            // Ensure results themselves are present
            if (!globalState || !liquidity) {
                console.log(`[usePools] index ${index}: globalState or liquidity result array is null/undefined.`);
                // It's possible globalState or liquidity is an empty object if the contract call failed softly with valid=true but no result array.
                // Or, if the result from useMultipleContractSingleData was not an array as expected.
                // This log helps catch that. The primary check for loading/valid is above.
                return [PoolState.NOT_EXISTS, null];
            }

            // globalState.price is uint160, liquidity[0] is uint128. Both are BigInts from Ethers v6.
            // A pool must have a non-zero price to be valid.
            if (!globalState.price || globalState.price === 0n) {
                console.log(`[usePools] index ${index}: globalState.price is null, undefined, or zero. Price:`, globalState.price);
                return [PoolState.NOT_EXISTS, null];
            }
            // Liquidity being 0 (i.e., liquidity[0] === 0n) is a valid state for an empty pool.
            // The Pool constructor can handle this. No specific check to return NOT_EXISTS for 0 liquidity.

            try {
                // Convert globalState.fee (BigInt) to Number for the Pool constructor
                const feeAsNumber = Number(globalState.fee);
                const tickAsNumber = Number(globalState.tick); // Convert tick to number
                const priceAsString = globalState.price.toString(); // Convert price to string for JSBI
                console.log(`[usePools] CHECKING TICK: value is '${globalState.tick}' (original type: ${typeof globalState.tick}), Converted tick value is '${tickAsNumber}' (type: ${typeof tickAsNumber})`);
                console.log(`[usePools] CHECKING PRICE: value is '${globalState.price}' (original type: ${typeof globalState.price}), Converted price value is '${priceAsString}' (type: ${typeof priceAsString})`);
                console.log(`[usePools] index ${index}: Attempting to create Pool with: token0: ${token0.symbol}, token1: ${token1.symbol}, fee (original): ${globalState.fee}, fee (as number): ${feeAsNumber}, price (original): ${globalState.price}, price (as string): ${priceAsString}, liquidity: ${liquidity[0].toString()}, tick (original): ${globalState.tick}, tick (as number): ${tickAsNumber}`);
                const poolInstance = new Pool(token0, token1, feeAsNumber, priceAsString, liquidity[0].toString(), tickAsNumber);
                console.log(`[usePools] index ${index}: Pool created successfully:`, poolInstance);
                return [PoolState.EXISTS, poolInstance];
            } catch (error) {
                console.error(`[usePools] index ${index}: Error constructing pool for ${token0.symbol}/${token1.symbol}:`, error);
                return [PoolState.NOT_EXISTS, null];
            }
        });
        console.log('[usePools] Final results for all poolKeys:', finalResult.map(r => ([r[0], r[1] ? 'Pool Instance' : null])));
        return finalResult;
    }, [_liquidities, poolKeys, _globalState0s, transformed]);
}

export function usePool(
    currencyA: Currency | undefined,
    currencyB: Currency | undefined,
    listenerOptions?: ListenerOptions
    // feeAmount: FeeAmount | undefined
): [PoolState, Pool | null] {
    const poolKeys: [Currency | undefined, Currency | undefined][] = useMemo(() => [[currencyA, currencyB]], [currencyA, currencyB]);

    return usePools(poolKeys, listenerOptions)[0];
}

export function useTokensSymbols(token0: string, token1: string) {
    const internet = useInternet();
    const _token0 = useToken(token0);
    const _token1 = useToken(token1);

    return useMemo(() => [_token0, _token1], [_token0, _token1, internet]);
}
