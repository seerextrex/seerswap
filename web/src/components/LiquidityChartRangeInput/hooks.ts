import { useCallback, useMemo } from 'react'
import { Currency } from '@uniswap/sdk-core'
import { FeeAmount } from 'lib/src'
import { usePoolActiveLiquidity } from 'hooks/usePoolTickData'
import { ChartEntry } from './types'
import JSBI from 'jsbi'
import { PriceFormats } from 'pages/NewAddLiquidity/components/PriceFomatToggler'
import useUSDCPrice from 'hooks/useUSDCPrice'
import { DEFAULT_LISTENER_OPTIONS } from "state/multicall/hooks"

export interface TickProcessed {
    liquidityActive: JSBI
    price0: string
}

export function useDensityChartData({
    currencyA,
    currencyB,
    feeAmount,
    priceFormat
}: {
    currencyA: Currency | undefined
    currencyB: Currency | undefined
    feeAmount: FeeAmount | undefined
    priceFormat: PriceFormats
}) {
    const {
        isLoading,
        isUninitialized,
        isError,
        error,
        data
    } = usePoolActiveLiquidity(currencyA, currencyB, feeAmount)

    const currencyAUsdPrice = useUSDCPrice(currencyA, undefined, DEFAULT_LISTENER_OPTIONS)
    const currencyBUsdPrice = useUSDCPrice(currencyB, undefined, DEFAULT_LISTENER_OPTIONS)

    const formatData = useCallback(() => {
        if (!data?.length) {
            return undefined
        }

        if (priceFormat === PriceFormats.USD && !currencyBUsdPrice) return

        const newData: ChartEntry[] = []

        for (let i = 0; i < data.length; i++) {
            const t: TickProcessed = data[i]

            const formattedPrice = priceFormat === PriceFormats.USD && currencyBUsdPrice ? (parseFloat(t.price0) * +currencyBUsdPrice.toSignificant(5)) : parseFloat(t.price0)

            const chartEntry = {
                activeLiquidity: parseFloat(t.liquidityActive.toString()),
                price0: formattedPrice
            }

            if (chartEntry.activeLiquidity > 0) {
                newData.push(chartEntry)
            }
        }

        return newData
    }, [data, currencyBUsdPrice, priceFormat])

    return useMemo(() => {
        return {
            isLoading,
            isUninitialized,
            isError,
            error,
            formattedData: !isLoading && !isUninitialized ? formatData() : undefined
        }
    }, [isLoading, isUninitialized, isError, error, formatData, priceFormat])
}
