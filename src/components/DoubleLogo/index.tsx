import { Currency } from '@uniswap/sdk-core'
import styled from 'styled-components/macro'
import CurrencyLogo from '../CurrencyLogo'
import { WrappedCurrency } from '../../models/types'

const Wrapper = styled.div<{ margin: boolean; sizeraw: number }>`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-left: ${({ sizeraw, margin }) => margin && (sizeraw / 3 + 8).toString() + 'px'};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin: 0;
  `}
`

interface DoubleCurrencyLogoProps {
    margin?: boolean
    size?: number
    currency0?: Currency
    currency1?: Currency
}

const HigherLogo = styled(CurrencyLogo)`
`
const CoveredLogo = styled(CurrencyLogo)<{ sizeraw: number }>`
  position: absolute;
  left: ${({ sizeraw }) => '-' + (sizeraw / 1.5).toString() + 'px'} !important;
`

export default function DoubleCurrencyLogo({ currency0, currency1, size = 16, margin = false }: DoubleCurrencyLogoProps) {
    return (
        <Wrapper sizeraw={size} margin={margin}>
            {currency0 && <HigherLogo currency={currency0 as WrappedCurrency} size={size.toString() + 'px'} />}
            {currency1 && <CoveredLogo currency={currency1 as WrappedCurrency} size={size.toString() + 'px'} sizeraw={size} />}
        </Wrapper>
    )
}
