import { Currency } from '@uniswap/sdk-core'
import { Pool } from 'lib/src'
import { useMemo } from 'react'
import { useAllCurrencyCombinations } from './useAllCurrencyCombinations'
import { PoolState, usePools } from './usePools'
import { ListenerOptions } from 'state/multicall/hooks'

/**
 * Returns all the existing pools that should be considered for swapping between an input currency and an output currency
 * @param currencyIn the input currency
 * @param currencyOut the output currency
 */

export function useV3SwapPools(
    currencyIn?: Currency,
    currencyOut?: Currency,
    listenerOptions?: ListenerOptions
): {
    pools: Pool[]
    loading: boolean
} {
    // Ensure allCurrencyCombinations is an empty array if currencies are not provided,
    // rather than conditionally calling the hook.
    const allCurrencyCombinations = useAllCurrencyCombinations(
        currencyIn,
        currencyOut
    );

    const pools = usePools(allCurrencyCombinations, listenerOptions)

    return useMemo(() => {
        // If currencyIn or currencyOut are undefined, allCurrencyCombinations will be empty,
        // leading to pools being empty, and this will correctly return { pools: [], loading: false }
        if (!currencyIn || !currencyOut) {
            return { pools: [], loading: false };
        }
        return {
            pools: pools
                .filter((tuple): tuple is [PoolState.EXISTS, Pool] => {
                    return tuple[0] === PoolState.EXISTS && tuple[1] !== null
                })
                .map(([, pool]) => pool),
            loading: pools.some(([state]) => state === PoolState.LOADING)
        }
    }, [pools, currencyIn, currencyOut]); // Added currencyIn, currencyOut to dependency array
}
