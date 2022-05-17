import { Web3Provider } from '@ethersproject/providers'
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from '../constants/chains'
import getLibrary from '../utils/getLibrary'
import { NetworkConnector } from './NetworkConnector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { OntoWindow } from '../models/types/global'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { ConnectorUpdate } from '@web3-react/types'
import { getAddress } from 'ethers/lib/utils'

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY
const NETWORK_URLS: { [key in SupportedChainId]: string } = {
    [SupportedChainId.POLYGON]: `https://polygon-rpc.com`
}

export const network = new NetworkConnector({
    urls: NETWORK_URLS,
    defaultChainId: 137
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
    rpc: { 137: 'https://rpc-mainnet.matic.network' },
    supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
    qrcode: true,
    chainId: 137
})

interface OntoWalletConfig {
    supportedChainIds: number[]
}

export class OntoWalletConnector extends AbstractConnector {

    constructor(config: OntoWalletConfig) {
        super({ supportedChainIds: config.supportedChainIds })
    }

    async activate(): Promise<ConnectorUpdate> {
        const ethAgent = this.getAgent()

        if (!(await this.isAvalible())) {
            throw new Error('Wallet is not available')
        }

        const accounts: string[] = await ethAgent.request({
            method: 'eth_requestAccounts'
        })

        const account = getAddress(accounts[0])

        const provider = new Web3Provider(ethAgent)

        const { chainId } = await provider.getNetwork()

        // @ts-ignore
        provider.provider.on('accountsChanged', (accounts: string[]): void => {
            //@ts-ignore
            if (account !== accounts[0]) {
                window.location.reload()
            }
        })

        //@ts-ignore
        provider.provider.on('chainChanged', (chain) => {
            //@ts-ignore
            if (chain !== chainId) {
                window.location.reload()
            }
        })


        return Promise.resolve({ provider: provider.provider, chainId, account })
    }

    deactivate(): void {
    }

    protected getAgent(): any {
        return (
            (window as any).onto ??
            ((window as any).ethereum?.isONTO && (window as any).ethereum)
        )
    }

    async getAccount(): Promise<string | null> {
        const { account } = await this.activate()
        return Promise.resolve(account ?? null)
    }

    async getChainId(): Promise<number | string> {
        const { chainId } = await this.activate()
        if (!chainId) {
            throw new Error('Error chainId')
        }
        return Promise.resolve(chainId)
    }

    async getProvider(): Promise<any> {
        const { provider } = await this.activate()
        return Promise.resolve(provider)
    }

    protected async isAvalible(): Promise<boolean> {
        return !!this.getAgent()
    }

    async close(): Promise<void> {
        this.deactivate()
        // const { provider, account } = await this.activate()
        try {


        } catch (e) {
            console.error(e)
        }
    }

    parseSendReturn(sendReturn: any) {
        return sendReturn.hasOwnProperty('result') ? sendReturn.result : sendReturn
    }


    async isAuthorized(): Promise<boolean> {

        const _window = window as unknown as OntoWindow

        if (!_window.onto) {
            return false
        }

        try {
            return await _window.onto.send('eth_accounts').then((sendReturn: any) => {
                if (this.parseSendReturn(sendReturn).length > 0) {
                    return true
                } else {
                    return false
                }
            })
        } catch {
            return false
        }
    }

}

export const ontoconnector = new OntoWalletConnector({
    supportedChainIds: [137]
})