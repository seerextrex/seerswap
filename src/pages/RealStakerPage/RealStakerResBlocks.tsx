import styled, { keyframes } from 'styled-components/macro'
import { ButtonConfirmed } from '../../components/Button'
import { formatEther, parseUnits } from 'ethers/lib/utils'
import { useState } from 'react'
import {ArrowDown, ArrowUp, RefreshCw} from 'react-feather'
import { PageTitle } from '../../components/PageTitle'
import Frozen from "./Frozen"

const PageWrapper = styled.div`
  min-width: ${props => props.width};
  background-color: #111621;
  border-radius: 16px;
  position: relative;
  padding: 1.5rem 1rem 1rem;

  h2 {
    color: #687086;
    font-size: 16px;
    margin: 0;
  }

  h3 {
    font-size: 19px;
    font-weight: 600;
    margin: 10px 0 4px 0;
    cursor: default;
    width: fit-content;
  }

  p {
    color: #B1BAD3;
    font-size: 14px;
    margin: 0;
    cursor: default;
    margin-bottom: 10px;
  }
  
  ${({theme}) => theme.mediaWidth.upToSmall`
    min-width: 80%;
    &:first-child {
    margin-bottom: 1rem;
  }
  `}
`
const StakeButton = styled(ButtonConfirmed)`
  border-radius: 8px !important;
  width: 100%;
  padding: 12px;
`
const AmountTitle = styled.div`
  display: block;
  background-color: white;
  color: black;
  position: absolute;
  font-size: 14px;
  padding: 3px 7px;
  top: 12%;
  left: 30%;
  border-radius: 5px;
`

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

interface ResBloksProps {
  title: string
  amount: number
  currency: any
  action: string
  handler?: any
  algbCourse: any
}

export default function RealStakerResBlocks(
  {
    title, amount, currency, action, handler, algbCourse = 0}: ResBloksProps) {
  const [isFull, setIsFull] = useState(false)

  return (
    <PageWrapper width={'337px'}>
      <TitleWrapper>
        <h2>{title}</h2>
      </TitleWrapper>
      {isFull && !(formatEther(amount) < formatEther(algbCourse)) ?
        <AmountTitle title={`${formatEther(amount)}`}>{formatEther(amount)}</AmountTitle> : null}
      <h3 onMouseEnter={() => {
        setIsFull(true)
      }}
          onMouseLeave={() => {
            setIsFull(false)
          }}
      >{(formatEther(amount) < formatEther(algbCourse)) ? '0.00' : parseFloat(formatEther(amount)).toFixed(2)} ALGB</h3>
      <p>$ {currency === null || formatEther(amount) < formatEther(algbCourse) ? '0' : currency?.toSignificant(6, { groupSeparator: ',' })}</p>
      <StakeButton disabled={amount == 0 || (formatEther(amount) < formatEther(algbCourse))}
                   onClick={handler}>{action}</StakeButton>
    </PageWrapper>
  )
}