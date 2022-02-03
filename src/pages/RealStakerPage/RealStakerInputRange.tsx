import {CurrencyInputPanelWrapper, CurrencyTop, CurrencyBottom} from './styled'
import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core'

interface StakerInputRangeProps {
  baseCurrency? : Currency | null
  amountValue: string
  setAmountValue: any
  fiatValue: CurrencyAmount<Token> | null
}

export default function RealStakerInputRange ({baseCurrency, amountValue, setAmountValue, fiatValue}: StakerInputRangeProps) {

  return (
    <CurrencyInputPanelWrapper>
      <CurrencyTop
          style={{width: '100%'}}
        currency={baseCurrency}
        hideInput={true}
        showCommonBases
        showBalance={true}
        disabled={false}
        shallow={true}
      />
      <CurrencyBottom
          style={{width: '100%'}}
        onUserInput={(e) => {setAmountValue(e)}}
        currency={baseCurrency}
        value={amountValue}
        hideInput={false}
        hideCurrency={true}
        locked={false}
        showCommonBases
        showBalance={true}
        disabled={false}
        shallow={true}
        fiatValue={fiatValue}
      />
    </CurrencyInputPanelWrapper>
  )
}