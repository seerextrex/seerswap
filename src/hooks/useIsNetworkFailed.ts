import { useBlockNumber } from '../state/application/hooks'
import { useActiveWeb3React } from './web3'

import useInterval from './useInterval'
import { useState } from 'react'
import useCurrentBlockTimestamp from './useCurrentBlockTimestamp'
import ms from 'ms.macro'

const DEFAULT_MS_BEFORE_WARNING = ms`10m`
const NETWORK_HEALTH_CHECK_MS = ms`10s`

const useMachineTimeMs = (updateInterval: number): number => {
    const [now, setNow] = useState(Date.now())

    useInterval(() => {
        setNow(Date.now())
    }, updateInterval)
    return now
}

export function useIsNetworkFailed() {

    const { chainId } = useActiveWeb3React()
    const blockNumber = useBlockNumber()
    const machineTime = useMachineTimeMs(NETWORK_HEALTH_CHECK_MS)
    const blockTime = useCurrentBlockTimestamp()

    const warning = Boolean(!!blockTime && machineTime - blockTime.mul(1000).toNumber() > DEFAULT_MS_BEFORE_WARNING)

    return warning
}
