import { L1_CHAIN_IDS } from '../constants/chains'

export function constructSameAddressMap<T extends string>(
    address: T,
    additionalNetworks: number[] = []
): { [chainId: number]: T } {
    return (L1_CHAIN_IDS as readonly number[])
        .concat(additionalNetworks)
        .reduce<{ [chainId: number]: T }>((memo, chainId) => {
            memo[chainId] = address
            return memo
        }, {})
}
