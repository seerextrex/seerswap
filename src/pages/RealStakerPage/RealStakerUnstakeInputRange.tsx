import { CurrencyDropdown } from '../AddLiquidity/styled'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useCurrency } from '../../hooks/Tokens'
import { useMemo } from 'react'
import { UnstakeCurrencyInputPanelWrapper, UnstakeTitle } from './styled'
import { WrappedCurrency } from '../../models/types'

interface StakerInputRangeProps {
    baseCurrency?: any
    amountValue: string
    setAmountValue: any
    fiatValue: any
}

export default function RealStakerUnstakeInputRange({
    baseCurrency,
    amountValue,
    setAmountValue,
    fiatValue
}: StakerInputRangeProps) {

    const ALGBCurrency = useCurrency('0x0169eC1f8f639B32Eec6D923e24C2A2ff45B9DD6')
    const rightBalance = useMemo(() => {
        const splited = baseCurrency.split('.')
        return splited[0] + '.' + splited[1].slice(0, 3)
    }, [baseCurrency])

    return (
        <UnstakeCurrencyInputPanelWrapper>
            <UnstakeTitle>
                <CurrencyLogo
                    currency={ALGBCurrency as WrappedCurrency} />
                {rightBalance} ALGB
            </UnstakeTitle>
            <CurrencyDropdown
                style={{ width: '100%' }}
                onUserInput={(e) => {
                    setAmountValue(e)
                }}
                currency={ALGBCurrency as WrappedCurrency}
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
                swap={false}
                showMaxButton={false} />
        </UnstakeCurrencyInputPanelWrapper>
    )
}
