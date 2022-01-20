import { CurrencyDropdown } from '../AddLiquidity/styled'
import styled from 'styled-components/macro'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useCurrency } from '../../hooks/Tokens'
import {useMemo} from "react"

const CurrencyInputPanelWrapper = styled.div`
  width: 100%;
  background-color: ${({theme}) => theme.winterDisabledButton};
  margin: 26px 0 32px;
  border-radius: 16px;
  padding: 21px 0 20px 24px;
  min-height: 150px;

  img {
    width: 36px;
    height: 36px;
  }

  span {
    color: #C3C5CB;
    cursor: default;
    &:hover{
      cursor: default;
      color: #C3C5CB;
    }
  }
  ${({theme}) => theme.mediaWidth.upToSmall`
    padding: 20px 0 10px 12px;
    margin: 15px 0 10px;
  `}
`
const UnstakeTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  color: white;
  img {
    margin-right: 10px;
  }
`

interface StakerInputRangeProps {
  baseCurrency? : any
  amountValue: string
  setAmountValue: any
  fiatValue: any
}

export default function RealStakerUnstakeInputRange ({baseCurrency, amountValue, setAmountValue, fiatValue}: StakerInputRangeProps) {

    const ALGBCurrency = useCurrency('0x0169eC1f8f639B32Eec6D923e24C2A2ff45B9DD6')

    const rightBalance = useMemo(() => {
        const splited = baseCurrency.split('.')
        return splited[0] + '.' + splited[1].slice(0,3)
    }, [baseCurrency])

  return (
    <CurrencyInputPanelWrapper>
      <UnstakeTitle>
        <CurrencyLogo
        currency={ALGBCurrency}/>
        {rightBalance} ALGB
      </UnstakeTitle>
      <CurrencyDropdown
          style={{width: '100%'}}
        onUserInput={(e) => {setAmountValue(e)}}
        currency={ALGBCurrency}
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