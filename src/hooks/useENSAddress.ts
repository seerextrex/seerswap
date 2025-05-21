import { namehash } from 'ethers'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { gnosis } from 'wagmi/chains'
import { useSingleCallResult, NEVER_RELOAD } from '../state/multicall/hooks'
import isZero from '../utils/isZero'
import { useENSRegistrarContract, useENSResolverContract } from './useContract'
import useDebounce from './useDebounce'

/**
 * Does a lookup for an ENS name to find its address.
 */
export default function useENSAddress(ensName?: string | null): { loading: boolean; address: string | null } {
    const { chainId } = useAccount()
    const isGnosis = chainId === gnosis.id

    const debouncedName = useDebounce(ensName, 200)

    const ensNodeArgument = useMemo(() => {
        if (!debouncedName) return [undefined]
        try {
            return debouncedName ? [namehash(debouncedName)] : [undefined]
        } catch (error) {
            return [undefined]
        }
    }, [debouncedName])

    const registrarContract = useENSRegistrarContract(false)
    const resolverAddress = useSingleCallResult(
        isGnosis ? undefined : registrarContract, // Pass undefined contract if Gnosis
        'resolver',
        ensNodeArgument,
        NEVER_RELOAD
    )
    const resolverAddressResult = resolverAddress.result?.[0]

    const resolverContract = useENSResolverContract(
        isGnosis ? undefined : (resolverAddressResult && !isZero(resolverAddressResult) ? resolverAddressResult : undefined),
        false
    )

    const addr = useSingleCallResult(
        isGnosis ? undefined : resolverContract, // Pass undefined contract if Gnosis
        'addr',
        ensNodeArgument,
        NEVER_RELOAD
    )

    const changed = debouncedName !== ensName

    if (isGnosis) {
        return { address: null, loading: false }
    }

    return {
        address: changed ? null : addr.result?.[0] ?? null,
        loading: changed || resolverAddress.loading || addr.loading
    }
}
