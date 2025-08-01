// import { BigNumber } from 'ethers' // Removed
import { useSingleCallResult } from '../state/multicall/hooks'
import { useMulticall2Contract } from './useContract'

// gets the current timestamp from the blockchain
export default function useCurrentBlockTimestamp(): bigint | undefined {
    const multicall = useMulticall2Contract()
    const result = useSingleCallResult(multicall, 'getCurrentBlockTimestamp')?.result?.[0]
    // Assuming result is already a bigint or can be cast to one. 
    // If it's a string or number from an old multicall, it needs BigInt(result)
    // For now, let's assume it's directly compatible or useSingleCallResult handles it.
    return typeof result === 'bigint' ? result : (result ? BigInt(String(result)) : undefined);
}
