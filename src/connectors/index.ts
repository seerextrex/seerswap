import { Web3Provider } from '@ethersproject/providers'
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from '../constants/chains'
import getLibrary from '../utils/getLibrary'
import { NetworkConnector } from './NetworkConnector'

const NETWORK_URLS: { [key in SupportedChainId]: string } = {
    [SupportedChainId.POLYGON]: 'https://polygon-mainnet.infura.io/v3/a4f8e4693b7a465da0848c3f82732f23'
}

export const network = new NetworkConnector({
    urls: NETWORK_URLS,
    defaultChainId: 940
})

let networkLibrary: Web3Provider | undefined

export function getNetworkLibrary(): Web3Provider {
    return (networkLibrary = networkLibrary ?? getLibrary(network.provider))
}

export const injected = new InjectedConnector({
    supportedChainIds: ALL_SUPPORTED_CHAIN_IDS
})

export const gnosisSafe = new SafeAppConnector()
