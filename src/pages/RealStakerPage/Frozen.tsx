import React, {useEffect, useMemo, useState} from 'react'
import styled from "styled-components/macro"
import {formatUnits} from "ethers/lib/utils"
import {BigNumber} from "@ethersproject/bignumber"
import {getCountdownTime} from "../../utils/time"
import Loader from "../../components/Loader"

const FrozenWrapper = styled.div`
  width: 100%;
  background-color: ${({theme}) => theme.winterDisabledButton};
  height: 190px;
  position: absolute;
  top: 40px;
  z-index: 100;
  border-radius: 16px;
  padding: 25px 30px;
  overflow-y: auto;
  ${({theme}) => theme.mediaWidth.upToSmall`
     padding: 1rem;
    `}
`

const FrozenTransaction = styled.div`
  display: flex;
  color: white;
  justify-content: space-between;

  p {
    color: white !important;
    font-size: 16px !important;
    margin: 5px 0 !important;
    font-weight: 600;
  }

  ${({theme}) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    background-color: #202635;
    padding: 5px 7px;
    border-radius: 10px;
  `}
`
const Time = styled.p`
  min-width: 90px;
  text-align: center;
`
const TimeWrapper = styled.div`
  display: flex;
  color: white !important;
  font-size: 16px !important;
  margin: 7px 0 !important;
  font-weight: 600;
  align-items: center;
  p {
    margin: 0!important;
  }
`
const LoaderStyled = styled(Loader)`
  margin: auto;
`


const FrozenTrans = ({el, earnedFreeze, now, index}: { el: any; earnedFreeze: BigNumber[]; now: Date, index: number}) => {
    const [time, setTime] = useState('00:00:00')

    const tick = () => {
        setTime(getCountdownTime(el.timestamp, now()))
    }

    useEffect(() => {
        const interval = setInterval(() => {
            tick()
        }, 1000)
        return () => clearInterval(interval)
    })

    if (!el?.stakedALGBAmount || !earnedFreeze) return null

    return (
        <>
            {!(time < '00:00:00') &&
                <FrozenTransaction>
                    <p>{(+formatUnits(el?.stakedALGBAmount)).toFixed(2) < 0.01 ? '<' : ''}{(+formatUnits(el?.stakedALGBAmount)).toFixed(2)} ALGB
                        staked</p>
                    {+formatUnits(earnedFreeze[index + 1]) < 0.01 ? null :
                        <p>{(+formatUnits(earnedFreeze[index + 1])).toFixed(2)} ALGB earned</p>}
                    <TimeWrapper>Frozen for<Time>{(time <= '00:00:00') ? <LoaderStyled stroke={'white'} size={'16px'}/> : time}</Time></TimeWrapper>
                </FrozenTransaction>
            }
        </>
    )
}

const Frozen = ({data, earnedFreeze, now}: { data: any[]; earnedFreeze: BigNumber[], now: Date }) => {
    return (
        <FrozenWrapper>
            {data && earnedFreeze ? data.map((el, i) => {
                return <FrozenTrans key={i} el={el} earnedFreeze={earnedFreeze} now={now} index={i}/>
            }) : <LoaderStyled size={'35px'} stroke={'white'}/>}
        </FrozenWrapper>
    )
}

export default Frozen