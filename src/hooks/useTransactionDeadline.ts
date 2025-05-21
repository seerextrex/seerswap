// import { BigNumber } from 'ethers' // Removed
import { useMemo } from 'react'
import { useAppSelector } from 'state/hooks'
import useCurrentBlockTimestamp from './useCurrentBlockTimestamp'

// combines the block timestamp with the user setting to give the deadline that should be used for any submitted transaction
export default function useTransactionDeadline(): bigint | undefined { // Return type changed to bigint
    const ttl = useAppSelector((state) => state.user.userDeadline) // ttl is a number
    const blockTimestamp = useCurrentBlockTimestamp() // This now returns bigint | undefined
    return useMemo(() => {
        if (blockTimestamp && ttl) return blockTimestamp + BigInt(ttl) // Changed .add() to + and BigInt(ttl)
        return undefined
    }, [blockTimestamp, ttl])
}
