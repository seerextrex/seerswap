import { CurrencyBottom, CurrencyInputPanelWrapper, CurrencyTop } from './styled'
import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core'
import { WrappedCurrency } from '../../models/types'

interface StakerInputRangeProps {
    baseCurrency?: Currency | null
    amountValue: string
    setAmountValue: any
    fiatValue: CurrencyAmount<Token> | null
}

export default function RealStakerInputRange({ baseCurrency, amountValue, setAmountValue, fiatValue }: StakerInputRangeProps) {
    return (
        <CurrencyInputPanelWrapper>
            <CurrencyTop
                style={{ width: '100%' }}
                currency={baseCurrency as WrappedCurrency}
                hideInput={true}
                showCommonBases
                showBalance={true}
                disabled={false}
                shallow={true}
                id={''}
                onUserInput={() => {
                }}
                showMaxButton={false}
                swap={false}
                value={''} />
            <CurrencyBottom
                style={{ width: '100%' }}
                onUserInput={(e) => {
                    setAmountValue(e)
                }}
                currency={baseCurrency as WrappedCurrency}
                value={amountValue}
                hideInput={false}
                hideCurrency={true}
                locked={false}
                showCommonBases
                showBalance={true}
                disabled={false}
                shallow={true}
                fiatValue={fiatValue}
                id={''}
                showMaxButton={false}
                swap={false} />
        </CurrencyInputPanelWrapper>
    )
}
