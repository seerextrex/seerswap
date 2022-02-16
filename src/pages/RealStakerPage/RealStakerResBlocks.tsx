import { formatEther } from 'ethers/lib/utils'
import { useCallback, useState } from 'react'
import { AmountTitle, EarnedBadge, InfoStyled, ResButton, ResPageWrapper, TitleWrapper } from './styled'
import { BigNumber } from '@ethersproject/bignumber'
import { CurrencyAmount, Token } from '@uniswap/sdk-core'

interface ResBloksProps {
    title: string
    amount: BigNumber
    currency: CurrencyAmount<Token> | null
    action: string
    handler?: any
    algbCourse: BigNumber
}

export default function RealStakerResBlocks({
    title,
    amount,
    currency,
    action,
    handler,
    algbCourse
}: ResBloksProps) {

    const [isFull, setIsFull] = useState(false)
    const [show, setShow] = useState(false)
    const open = useCallback(() => setShow(true), [setShow])
    const close = useCallback(() => setShow(false), [setShow])

    return (
        <ResPageWrapper>
            <TitleWrapper>
                <h2>{title}</h2>
                {action === 'Claim' &&
                    <div onMouseEnter={open} onMouseLeave={close}
                         style={{ position: 'relative', zIndex: 5 }}>
                        <InfoStyled size={'16px'} stroke={'white'} />
                    </div>}
                {(action === 'Claim' && show) &&
                    <EarnedBadge>
                        Any rewards you earned will be automatically restaked (compounded) for you.
                    </EarnedBadge>}
            </TitleWrapper>
            {isFull && !(formatEther(amount) < formatEther(algbCourse)) ?
                <AmountTitle
                    title={`${formatEther(amount)}`}>{formatEther(amount)}</AmountTitle> : null}
            <h3 onMouseEnter={() => {
                setIsFull(true)
            }}
                onMouseLeave={() => {
                    setIsFull(false)
                }}>
                {(formatEther(amount) < formatEther(algbCourse)) ? '0.00' : parseFloat(formatEther(amount)).toFixed(2)} ALGB
            </h3>
            <p>
                $ {currency === null || formatEther(amount) < formatEther(algbCourse) ? '0' : currency?.toSignificant(6, { groupSeparator: ',' })}
            </p>
            <ResButton
                disabled={+formatEther(amount) === 0 || (formatEther(amount) < formatEther(algbCourse))}
                onClick={handler}>
                {action}
            </ResButton>
        </ResPageWrapper>
    )
}
