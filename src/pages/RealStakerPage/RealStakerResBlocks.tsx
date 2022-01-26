import {formatEther} from 'ethers/lib/utils'
import {useCallback, useState} from 'react'
import {ResPageWrapper, TitleWrapper, ResButton, AmountTitle, InfoStyled, EarnedBadge} from './styled'

interface ResBloksProps {
    title: string
    amount: number
    currency: any
    action: string
    handler?: any
    algbCourse: any
}

export default function RealStakerResBlocks({title, amount, currency, action, handler, algbCourse = 0}: ResBloksProps) {

    const [isFull, setIsFull] = useState(false)
    const [show, setShow] = useState(false)
    const open = useCallback(() => setShow(true), [setShow])
    const close = useCallback(() => setShow(false), [setShow])

    return (
        <ResPageWrapper>
            <TitleWrapper>
                <h2>{title}</h2>
                {action === 'Claim' &&
                    <div onMouseEnter={open} onMouseLeave={close} style={{position: 'relative', zIndex: 5}}>
                        <InfoStyled size={'16px'} stroke={'white'}/>
                    </div>}
                {(action === 'Claim' && show) &&
                    <EarnedBadge>
                        Any rewards you earned will be automatically restaked (compounded) for you.
                    </EarnedBadge>}
            </TitleWrapper>
            {isFull && !(formatEther(amount) < formatEther(algbCourse)) ?
                <AmountTitle title={`${formatEther(amount)}`}>{formatEther(amount)}</AmountTitle> : null}
            <h3 onMouseEnter={() => { setIsFull(true) }}
                onMouseLeave={() => { setIsFull(false) }}>
                {(formatEther(amount) < formatEther(algbCourse)) ? '0.00' : parseFloat(formatEther(amount)).toFixed(2)} ALGB
            </h3>
            <p>
                $ {currency === null || formatEther(amount) < formatEther(algbCourse) ? '0' : currency?.toSignificant(6, {groupSeparator: ','})}
            </p>
            <ResButton disabled={amount == 0 || (formatEther(amount) < formatEther(algbCourse))} onClick={handler}>
                {action}
            </ResButton>
        </ResPageWrapper>
    )
}