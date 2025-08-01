import { namehash } from 'ethers'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { gnosis } from 'wagmi/chains'
import { useSingleCallResult, NEVER_RELOAD } from '../state/multicall/hooks'
import { isAddress } from '../utils'
import isZero from '../utils/isZero'
import { useENSRegistrarContract, useENSResolverContract } from './useContract'
import useDebounce from './useDebounce'

/**
 * Does a reverse lookup for an address to find its ENS name.
 * Note this is not the same as looking up an ENS name to find an address.
 */
export default function useENSName(address?: string): { ENSName: string | null; loading: boolean } {
    const { chainId } = useAccount()
    const isGnosis = chainId === gnosis.id

    const debouncedAddress = useDebounce(address, 200)

    const ensNodeArgument = useMemo(() => {
        if (!debouncedAddress || !isAddress(debouncedAddress)) return [undefined]
        try {
            return debouncedAddress ? [namehash(`${debouncedAddress.toLowerCase().substr(2)}.addr.reverse`)] : [undefined]
        } catch (error) {
            return [undefined]
        }
    }, [debouncedAddress])

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

    const name = useSingleCallResult(
        isGnosis ? undefined : resolverContract, // Pass undefined contract if Gnosis
        'name',
        ensNodeArgument,
        NEVER_RELOAD
    )

    const changed = debouncedAddress !== address

    if (isGnosis) {
        return { ENSName: null, loading: false }
    }

    return {
        ENSName: changed ? null : name.result?.[0] ?? null,
        loading: changed || resolverAddress.loading || name.loading
    }
}
