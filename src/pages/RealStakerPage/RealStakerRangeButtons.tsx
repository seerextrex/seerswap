import { Trans } from '@lingui/macro'
import styled from 'styled-components/macro'
import { SmallMaxButton } from '../RemoveLiquidity/styled'
import {darken} from "polished"

const StakerSmallMaxButton = styled(SmallMaxButton)`
  background: #4A5982;
  border: 1px solid transparent;
  box-sizing: border-box;
`
const ButtonsWrapper = styled.div`
  margin: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({theme}) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: start;
    margin-bottom: 20px;
  `}
 p {
    cursor: pointer;
    
    &:hover {
      color: rgb(222,222,222);
    }
  }
`

export default function RealStakerRangeButtons ({onPercentSelect, showCalculate} : {onPercentSelect: any, showCalculate?: boolean}) {
  return(
    <ButtonsWrapper>
      <div>
        <StakerSmallMaxButton onClick={() => onPercentSelect(25)} style={{marginLeft: 0}}>
          <Trans>25%</Trans>
        </StakerSmallMaxButton>
        <StakerSmallMaxButton onClick={() => onPercentSelect(50)}>
          <Trans>50%</Trans>
        </StakerSmallMaxButton>
        <StakerSmallMaxButton onClick={() => onPercentSelect(75)}>
          <Trans>75%</Trans>
        </StakerSmallMaxButton>
        <StakerSmallMaxButton onClick={() => onPercentSelect(100)}>
          <Trans>MAX</Trans>
        </StakerSmallMaxButton>
      </div>
      {showCalculate ? <p onClick={() => {window.open('Calculator:///')}}>Calculate profits →</p> : null}
    </ButtonsWrapper>
  )
}