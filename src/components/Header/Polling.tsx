import { useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks/web3'
import { useBlockNumber } from '../../state/application/hooks'
import { ExternalLink } from '../../theme'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import { Spinner, StyledPolling, StyledPollingDot, StyledPollingNumber } from './styled'

export default function Polling() {
    const { chainId } = useActiveWeb3React()

    const blockNumber = useBlockNumber()

    const [isMounting, setIsMounting] = useState(false)
    const [isHover, setIsHover] = useState(false)

    useEffect(
        () => {
            if (!blockNumber) {
                return
            }

            setIsMounting(true)
            const mountingTimer = setTimeout(() => setIsMounting(false), 1000)

            // this will clear Timeout when component unmount like in willComponentUnmount
            return () => {
                clearTimeout(mountingTimer)
            }
        },
        [blockNumber] //useEffect will run only one time
        //if you pass a value to array, like this [data] than clearTimeout will run every time this value changes (useEffect re-run)
    )

    return (
        <ExternalLink
            href={chainId && blockNumber ? getExplorerLink(chainId, blockNumber.toString(), ExplorerDataType.BLOCK) : ''}
        >
            <StyledPolling onMouseEnter={() => setIsHover(true)}
                           onMouseLeave={() => setIsHover(false)}>
                <StyledPollingNumber breathe={isMounting} hovering={isHover}>
                    {blockNumber}
                </StyledPollingNumber>
                <StyledPollingDot>{isMounting && <Spinner />}</StyledPollingDot>
            </StyledPolling>
        </ExternalLink>
    )
}
