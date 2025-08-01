import { useSingleCallResult, NEVER_RELOAD } from 'state/multicall/hooks'
import { useEffect, useState, useMemo } from 'react'
import { useV3NFTPositionManagerContract } from './useContract'
import { Pool } from 'lib/src'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { useBlockNumber } from 'state/application/hooks'
import { unwrappedToken } from 'utils/unwrappedToken'

const MAX_UINT128 = (1n << 128n) - 1n

// compute current + counterfactual fees for a v3 position
export function useV3PositionFees(
    pool?: Pool,
    tokenId?: bigint,
    asWETH = false
): [CurrencyAmount<Currency>, CurrencyAmount<Currency>] | [undefined, undefined] {
    const positionManager = useV3NFTPositionManagerContract(false)
    const owner: string | undefined = useSingleCallResult(tokenId !== undefined ? positionManager : null, 'ownerOf', [tokenId?.toString()], NEVER_RELOAD)
        .result?.[0]

    const tokenIdString = tokenId?.toString()

    const [amounts, setAmounts] = useState<[bigint, bigint]>()
    useEffect(() => {
        let stale = false

        if (positionManager && tokenIdString && owner) {
            positionManager.collect.staticCall(
                {
                    tokenId: tokenIdString,
                    recipient: owner,
                    amount0Max: MAX_UINT128,
                    amount1Max: MAX_UINT128
                },
                { from: owner }
            )
                .then((results: { amount0: bigint; amount1: bigint }) => {
                    if (!stale) setAmounts([results.amount0, results.amount1])
                })
        }

        return () => {
            stale = true
        }
    }, [positionManager, tokenIdString, owner])

    if (pool && amounts) {
        return [
            CurrencyAmount.fromRawAmount(!asWETH ? unwrappedToken(pool.token0) : pool.token0, amounts[0].toString()),
            CurrencyAmount.fromRawAmount(!asWETH ? unwrappedToken(pool.token1) : pool.token1, amounts[1].toString())
        ]
    } else {
        return [undefined, undefined]
    }
}
