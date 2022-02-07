import React, { useEffect, useState } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { BigNumber } from '@ethersproject/bignumber'
import { getCountdownTime } from '../../utils/time'
import { FrozenTransaction, FrozenWrapper, LoaderStyled, Time, TimeWrapper } from './styled'
import { Frozen } from '../../models/interfaces'

const FrozenTrans = ({
    el,
    earnedFreeze,
    now,
    index
}: { el: Frozen; earnedFreeze: BigNumber[]; now: any, index: number }) => {
    const [time, setTime] = useState<string>('00:00:00')

    const tick = () => {
        setTime(getCountdownTime(+el.timestamp, now()))
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
                    <TimeWrapper>Frozen for<Time>{(time <= '00:00:00') ?
                        <LoaderStyled stroke={'white'} size={'16px'} /> : time}</Time></TimeWrapper>
                </FrozenTransaction>
            }
        </>
    )
}

const FrozenModal = ({
    data,
    earnedFreeze,
    now
}: { data: Frozen[] | string; earnedFreeze: BigNumber[] | undefined, now: any }) => {
    if (typeof data === 'string') return null
    return (
        <FrozenWrapper>
            {data && earnedFreeze ? data.map((el, i) => {
                return <FrozenTrans key={i} el={el} earnedFreeze={earnedFreeze} now={now}
                                    index={i} />
            }) : <LoaderStyled size={'35px'} stroke={'white'} />}
        </FrozenWrapper>
    )
}
export default FrozenModal
