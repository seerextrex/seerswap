import { Currency } from '@uniswap/sdk-core'
import { Trans } from '@lingui/macro'
import { Pool } from '@uniswap/v3-sdk'
import Card from '../../shared/components/Card/Card'
import AutoColumn from '../../shared/components/AutoColumn'

interface CurrentPriceCardProps {
    inverted?: boolean
    pool: Pool | null
    currencyQuote?: Currency
    currencyBase?: Currency
}

export function CurrentPriceCard({ inverted, pool, currencyQuote, currencyBase }: CurrentPriceCardProps) {
    if (!pool || !currencyQuote || !currencyBase) return null

    return (
        <Card isDark classes={'p-1 br-12'}>
            <AutoColumn gap='1'>
                <span className={'c-lg fs-095 ta-c'}>
                    <Trans>Current price</Trans>
                </span>
                <span className={'fs-125 ta-c'}>
                    {(inverted ? pool.token1Price : pool.token0Price).toSignificant(6)}{' '}
                </span>
                <span className={'c-lg fs-085 ta-c'}>
                    <Trans>{currencyQuote?.symbol} per {currencyBase?.symbol}</Trans>
                </span>
            </AutoColumn>
        </Card>
    )
}
