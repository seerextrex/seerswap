import { namehash } from 'ethers'
import { useMemo } from 'react'
import { useSingleCallResult, NEVER_RELOAD } from '../state/multicall/hooks'
import isZero from '../utils/isZero'
import { useENSRegistrarContract, useENSResolverContract } from './useContract'

/**
 * Does a lookup for an ENS name to find its contenthash.
 */
export default function useENSContentHash(ensName?: string | null): { loading: boolean; contenthash: string | null } {
    const ensNodeArgument = useMemo(() => {
        if (!ensName) return [undefined]
        try {
            return [namehash(ensName)]
        } catch (error) {
            return [undefined]
        }
    }, [ensName])
    const registrarContract = useENSRegistrarContract(false)
    const resolverAddressResult = useSingleCallResult(registrarContract, 'resolver', ensNodeArgument, NEVER_RELOAD)
    const resolverAddress = resolverAddressResult.result?.[0]
    const resolverContract = useENSResolverContract(
        resolverAddress && !isZero(resolverAddress) ? resolverAddress : undefined,
        false
    )
    const contenthash = useSingleCallResult(resolverContract, 'contenthash', ensNodeArgument, NEVER_RELOAD)

    return {
        contenthash: contenthash.result?.[0] ?? null,
        loading: resolverAddressResult.loading || contenthash.loading
    }
}
