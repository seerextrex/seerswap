import { useEffect, useRef } from 'react'
import { useActiveWeb3React } from '../../hooks/web3'
import Jazzicon from '@metamask/jazzicon'
import { StyledIdenticonContainer } from './styled'

export default function Identicon() {
    const ref = useRef<HTMLDivElement>()

    const { account } = useActiveWeb3React()

    useEffect(() => {
        if (account && ref.current) {
            ref.current.innerHTML = ''
            ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)))
        }
    }, [account])

    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    return <StyledIdenticonContainer ref={ref as any} />
}
