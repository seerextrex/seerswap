import React, {useEffect, useState} from 'react'
import {formatUnits} from "ethers/lib/utils"
import {BigNumber} from "@ethersproject/bignumber"
import {getCountdownTime} from "../../utils/time"
import {FrozenTransaction, FrozenWrapper, TimeWrapper, Time, LoaderStyled} from './styled'

const FrozenTrans = ({el, earnedFreeze, now, index}: { el: any; earnedFreeze: BigNumber[]; now: any, index: number}) => {
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
                    <p>{(+(+formatUnits(el?.stakedALGBAmount)).toFixed(2)) < 0.01 ? '<' : ''}{(+formatUnits(el?.stakedALGBAmount)).toFixed(2)} ALGB
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