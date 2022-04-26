import { Contract } from '@ethersproject/contracts'
//@ts-ignore
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import V2MigratorABI from 'abis/migrator.json'
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import NFTPosMan from '../pages/AddLiquidity/abi2.json'
import ENS_PUBLIC_RESOLVER_ABI from 'abis/ens-public-resolver.json'
import ENS_ABI from 'abis/ens-registrar.json'
import ERC20_ABI from 'abis/erc20.json'
import ERC20_BYTES32_ABI from 'abis/erc20_bytes32.json'
import WETH_ABI from 'abis/weth.json'
import EIP_2612 from 'abis/eip_2612.json'
import STAKER_ABI from 'abis/staker.json'
import MULTICALL_ABI from 'abis/multicall.json'
import REAL_STAKER_ABI from 'abis/real-staker.json'
import {
    ENS_REGISTRAR_ADDRESSES,
    MULTICALL_ADDRESS,
    NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
    QUOTER_ADDRESSES,
    REAL_STAKER_ADDRESS,
    V2_ROUTER_ADDRESS,
    V3_MIGRATOR_ADDRESSES
} from 'constants/addresses'
import { useMemo } from 'react'
import { getContract } from 'utils'
import { EnsPublicResolver, EnsRegistrar, Erc20, Weth } from '../abis/types'
import { WMATIC_EXTENDED } from '../constants/tokens'
import { useActiveWeb3React } from './web3'
import { V3Migrator } from '@uniswap/v3-periphery/typechain/V3Migrator'
import NewQuoterABI from '../abis/quoter.json'
import { FINITE_FARMING } from '../constants/addresses'
import { UniswapInterfaceMulticall } from '@uniswap/v3-periphery/typechain/UniswapInterfaceMulticall'
import { NonfungiblePositionManager } from '@uniswap/v3-periphery/typechain/NonfungiblePositionManager'
import { Quoter } from '@uniswap/v3-periphery/typechain/Quoter'

// returns null on errors
export function useContract<T extends Contract = Contract>(
    addressOrAddressMap: string | { [chainId: number]: string } | undefined,
    ABI: any,
    withSignerIfPossible = true
): T | null {
    const { library, account, chainId } = useActiveWeb3React()

    return useMemo(() => {
        if (!addressOrAddressMap || !ABI || !library || !chainId) return null
        let address: string | undefined
        if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
        else address = addressOrAddressMap[chainId]
        if (!address) return null
        try {
            return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [addressOrAddressMap, ABI, library, chainId, withSignerIfPossible, account]) as T
}

export function useV2MigratorContract() {
    return useContract<V3Migrator>(V3_MIGRATOR_ADDRESSES, V2MigratorABI, true)
}

export function useRealStaker() {
    return useContract(REAL_STAKER_ADDRESS, REAL_STAKER_ABI, true)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
    return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean) {
    const { chainId } = useActiveWeb3React()
    return useContract<Weth>(chainId ? WMATIC_EXTENDED[chainId]?.address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean) {
    return useContract<EnsRegistrar>(ENS_REGISTRAR_ADDRESSES, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean) {
    return useContract<EnsPublicResolver>(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useEIP2612Contract(tokenAddress?: string): Contract | null {
    return useContract(tokenAddress, EIP_2612, false)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useV2RouterContract(): Contract | null {
    return useContract(V2_ROUTER_ADDRESS, IUniswapV2Router02ABI, true)
}

export function useMulticall2Contract() {
    return useContract<UniswapInterfaceMulticall>(MULTICALL_ADDRESS, MULTICALL_ABI, false) as UniswapInterfaceMulticall
}

export function useV3NFTPositionManagerContract(withSignerIfPossible?: boolean): NonfungiblePositionManager | null {
    return useContract<NonfungiblePositionManager>(
        NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
        NFTPosMan,
        withSignerIfPossible
    )
}

export function useStaker() {
    return useContract(FINITE_FARMING, STAKER_ABI)
}

export function useV3Quoter() {
    return useContract<Quoter>(QUOTER_ADDRESSES, NewQuoterABI)
}
