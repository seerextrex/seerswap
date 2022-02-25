import { Currency } from '@uniswap/sdk-core'
import { ExtentsText } from './styleds'
import { Trans } from '@lingui/macro'
import { Pool } from '@uniswap/v3-sdk'
import { LightCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import { TYPE } from 'theme'

interface CurrentPriceCardProps {
    inverted?: boolean
    pool: Pool | null
    currencyQuote?: Currency
    currencyBase?: Currency
}

export function CurrentPriceCard({
    inverted,
    pool,
    currencyQuote,
    currencyBase
}: CurrentPriceCardProps) {
    if (!pool || !currencyQuote || !currencyBase) return null

    return (
        <LightCard padding='12px '>
            <AutoColumn gap='8px' justify='center'>
                <ExtentsText>
                    <Trans>Current price</Trans>
                </ExtentsText>
                <TYPE.mediumHeader textAlign='center'>
                    {(inverted ? pool.token1Price : pool.token0Price).toSignificant(6)}{' '}
                </TYPE.mediumHeader>
                <ExtentsText>
                    <Trans>
                        {currencyQuote?.symbol} per {currencyBase?.symbol}
                    </Trans>
                </ExtentsText>
            </AutoColumn>
        </LightCard>
    )
}
