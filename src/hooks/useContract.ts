import { Contract } from "ethers";
import IUniswapV2PairABI from "@uniswap/v2-core/build/IUniswapV2Pair.json";
import V2MigratorABI from "abis/migrator.json";
import IUniswapV2Router02ABI from "@uniswap/v2-periphery/build/IUniswapV2Router02.json";
import NFTPosMan from "../pages/AddLiquidity/abi2.json";
import ENS_PUBLIC_RESOLVER_ABI from "abis/ens-public-resolver.json";
import ENS_ABI from "abis/ens-registrar.json";
import ERC20_ABI from "abis/erc20.json";
import ERC20_BYTES32_ABI from "abis/erc20_bytes32.json";
import WETH_ABI from "abis/weth.json";
import EIP_2612 from "abis/eip_2612.json";
import MULTICALL_ABI from "abis/multicall.json";
import { ENS_REGISTRAR_ADDRESSES, MULTICALL_ADDRESS, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, QUOTER_ADDRESSES, V2_ROUTER_ADDRESS, V3_MIGRATOR_ADDRESSES } from "constants/addresses";
import { useMemo } from "react";
import { getContract } from "utils";
import { WXDAI_EXTENDED } from "../constants/tokens";
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { publicClientToProvider, walletClientToSigner } from '../utils/ethersAdapters';
import NewQuoterABI from "../abis/quoter.json";

// returns null on errors
export function useContract<T extends Contract = Contract>(addressOrAddressMap: string | { [chainId: number]: string } | undefined, ABI: any, withSignerIfPossible = true): T | null {
    const { address: accountAddress, chain } = useAccount();
    const currentChainId = chain?.id; // Renamed to avoid conflict in useMemo deps if chainId was passed in

    // Pass currentChainId to ensure client is for the correct network
    const publicClient = usePublicClient({ chainId: currentChainId });
    const { data: walletClient } = useWalletClient({ chainId: currentChainId });

    return useMemo(() => {
        if (!addressOrAddressMap || !ABI || !currentChainId) return null;

        let contractAddress: string | undefined;
        if (typeof addressOrAddressMap === "string") contractAddress = addressOrAddressMap;
        else contractAddress = addressOrAddressMap[currentChainId];
        if (!contractAddress) return null;

        if (!publicClient) {
            // console.warn("Public client not available yet in useContract."); // For debugging
            return null;
        }

        try {
            const ethersProvider = publicClientToProvider(publicClient);

            if (withSignerIfPossible && accountAddress && walletClient) {
                // The getContract utility in utils/index.ts will internally create a signer 
                // if an accountAddress is provided with the ethersProvider.
                return getContract(contractAddress, ABI, ethersProvider, accountAddress) as T;
            } else {
                return getContract(contractAddress, ABI, ethersProvider) as T;
            }
        } catch (error) {
            console.error("Failed to get contract in useContract", error);
            return null;
        }
    }, [addressOrAddressMap, ABI, currentChainId, publicClient, walletClient, accountAddress, withSignerIfPossible]) as T;
}

export function useV2MigratorContract() {
    return useContract(V3_MIGRATOR_ADDRESSES, V2MigratorABI, true);
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
    return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useWETHContract(withSignerIfPossible?: boolean) {
    const { chain } = useAccount();
    const currentChainId = chain?.id;
    return useContract(currentChainId ? WXDAI_EXTENDED[currentChainId]?.address : undefined, WETH_ABI, withSignerIfPossible);
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean) {
    return useContract(ENS_REGISTRAR_ADDRESSES, ENS_ABI, withSignerIfPossible);
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean) {
    return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function useEIP2612Contract(tokenAddress?: string): Contract | null {
    return useContract(tokenAddress, EIP_2612, false);
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(pairAddress, IUniswapV2PairABI.abi, withSignerIfPossible);
}

export function useV2RouterContract(): Contract | null {
    return useContract(V2_ROUTER_ADDRESS, IUniswapV2Router02ABI.abi, true);
}

export function useMulticall2Contract() {
    // Note: This Multicall contract might be for an ethers v5 based multicall system.
    // If migrating to wagmi's multicall, this specific contract instance might not be used directly in the same way.
    return useContract(MULTICALL_ADDRESS, MULTICALL_ABI, false);
}

export function useV3NFTPositionManagerContract(withSignerIfPossible?: boolean) {
    return useContract(NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, NFTPosMan, withSignerIfPossible);
}

export function useV3Quoter() {
    return useContract(QUOTER_ADDRESSES, NewQuoterABI);
}
