import styled, {keyframes, useTheme} from 'styled-components/macro'
import {ButtonConfirmed} from '../../components/Button'
import {formatEther, parseUnits} from 'ethers/lib/utils'
import {useCallback, useEffect, useState} from 'react'
import {ArrowDown, ArrowUp, Info, RefreshCw} from 'react-feather'
import {PageTitle} from '../../components/PageTitle'
import Frozen from "./Frozen"
import Badge from "../../components/Badge"

const PageWrapper = styled.div`
  width: 100%;
  background-color: rgba(60, 97, 126, 0.5);
  border-radius: 16px;
  position: relative;
  padding: 1.5rem 1rem 1rem;

  &:first-child {
    margin-right: 1rem;
  }

  &:last-child {
    margin-left: 1rem;
  }

  ${({theme}) => theme.mediaWidth.upToSmall`
      
  &:first-child {
    margin-right: unset;
  }
  &:last-child {
    margin-left: unset;
  }
  `}
  h2 {
    color: white;
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
const InfoStyled = styled(Info)`
  cursor: pointer;
`

const EarnedBadge = styled(Badge)`
  position: absolute;
  font-size: 13px;
  top: -4rem;
  right: 0;
  max-width: 210px;
  text-align: left;
  padding: .5rem 1rem;
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
        title, amount, currency, action, handler, algbCourse = 0
    }: ResBloksProps) {
    const [isFull, setIsFull] = useState(false)
    const [show, setShow] = useState(false)
    const open = useCallback(() => setShow(true), [setShow])
    const close = useCallback(() => setShow(false), [setShow])
    const theme = useTheme()

    return (
        <PageWrapper>
            <TitleWrapper>
                <h2>{title}</h2>
                { action === 'Claim' &&
                    <div onMouseEnter={open} onMouseLeave={close} style={{position: 'relative', zIndex: 5}}>
                        <InfoStyled size={'16px'} stroke={'white'}/>
                    </div> }
                {(action === 'Claim' && show) &&
                    <EarnedBadge>
                        Any rewards you earned will be automatically restaked (compounded) for you.
                </EarnedBadge> }
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
            <p>$ {currency === null || formatEther(amount) < formatEther(algbCourse) ? '0' : currency?.toSignificant(6, {groupSeparator: ','})}</p>
            <StakeButton disabled={amount == 0 || (formatEther(amount) < formatEther(algbCourse))}
                         onClick={handler}>{action}</StakeButton>
        </PageWrapper>
    )
}