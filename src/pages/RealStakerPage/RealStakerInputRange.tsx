import { CurrencyDropdown } from '../AddLiquidity/styled'
import styled from 'styled-components/macro'

const CurrencyInputPanelWrapper = styled.div`
  width: 100%;
  background-color: #111621;
  margin: 26px 0 32px 0;
  border-radius: 16px;
  padding: 20px 24px;
  min-height: 150px;

  img {
    width: 36px;
    height: 36px;
  }
`
const CurrencyTop = styled(CurrencyDropdown)`
  span {
    font-size: 21px;
  }
`

const CurrencyBottom = styled(CurrencyDropdown)`

  span {
    color: #8c909c;
    cursor: default;
    &:hover {
      cursor: default;
    }
  }
`

interface StakerInputRangeProps {
  baseCurrency? : any
  amountValue: string
  setAmountValue: any
  fiatValue: any
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