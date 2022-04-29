import { Web3Provider } from '@ethersproject/providers'
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from '../constants/chains'
import getLibrary from '../utils/getLibrary'
import { NetworkConnector } from './NetworkConnector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY
const NETWORK_URLS: { [key in SupportedChainId]: string } = {
    [SupportedChainId.POLYGON]: `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`
}

export const network = new NetworkConnector({
    urls: NETWORK_URLS,
    defaultChainId: 80001
})

let networkLibrary: Web3Provider | undefined

export function getNetworkLibrary(): Web3Provider {
    return (networkLibrary = networkLibrary ?? getLibrary(network.provider))
}

export const injected = new InjectedConnector({
    supportedChainIds: ALL_SUPPORTED_CHAIN_IDS
})

export const gnosisSafe = new SafeAppConnector()

export const walletconnector = new WalletConnectConnector({
    rpc : {137: 'https://rpc-mainnet.matic.network'},
    supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
    qrcode: true,
    chainId: 137
})

