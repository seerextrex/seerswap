import { Currency, CurrencyAmount, Price, Token } from '@uniswap/sdk-core'
import { useMemo } from 'react'
import { SupportedChainId } from '../constants/chains'
import { USDC_POLYGON } from '../constants/tokens'
import { useBestV3TradeExactOut } from './useBestV3Trade'
import { useActiveWeb3React } from './web3'

// Stablecoin amounts used when calculating spot price for a given currency.
// The amount is large enough to filter low liquidity pairs.
const STABLECOIN_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
    //TODO
    // [SupportedChainId.BINANCE]: CurrencyAmount.fromRawAmount(USDC_BINANCE, 100_000e6),
    [SupportedChainId.POLYGON]: CurrencyAmount.fromRawAmount(USDC_POLYGON, 1)
}

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useUSDCPrice(currency?: Currency): Price<Currency, Token> | undefined {
    const { chainId } = useActiveWeb3React()

    const amountOut = chainId ? STABLECOIN_AMOUNT_OUT[chainId] : undefined
    const stablecoin = amountOut?.currency

    const v3USDCTrade = useBestV3TradeExactOut(currency, amountOut)

    return useMemo(() => {

        if (!currency || !stablecoin) {
            return undefined
        }

        // handle usdc
        if (currency?.wrapped.equals(stablecoin)) {
            return new Price(stablecoin, stablecoin, '1', '1')
        }

        if (v3USDCTrade.trade) {
            const { numerator, denominator } = v3USDCTrade.trade.route.midPrice
            return new Price(currency, stablecoin, denominator, numerator)
        }

        return undefined
    }, [currency, stablecoin, v3USDCTrade.trade])
}

export function useUSDCValue(currencyAmount: CurrencyAmount<Currency> | undefined | null) {
    const price = useUSDCPrice(currencyAmount?.currency)

    return useMemo(() => {
        if (!price || !currencyAmount) return null
        try {
            return price.quote(currencyAmount)
        } catch (error) {
            return null
        }
    }, [currencyAmount, price])
}
