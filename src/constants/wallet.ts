import { AbstractConnector } from '@web3-react/abstract-connector'
// @ts-ignore
import INJECTED_ICON_URL from '../assets/images/arrow-right.svg'
// @ts-ignore
import METAMASK_ICON_URL from '../assets/svg/metamask-logo.svg'
import WALLET_CONNECT_URL from '../assets/images/walletConnectionIcon.svg'
import { injected, walletconnector } from '../connectors'

interface WalletInfo {
    connector?: AbstractConnector
    name: string
    iconURL: string
    description: string
    href: string | null
    color: string
    primary?: true
    mobile?: true
    mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
    INJECTED: {
        connector: injected,
        name: 'Injected',
        iconURL: INJECTED_ICON_URL,
        description: 'Injected web3 provider.',
        href: null,
        color: '#010101',
        primary: true
    },
    METAMASK: {
        connector: injected,
        name: 'MetaMask',
        iconURL: METAMASK_ICON_URL,
        description: 'Easy-to-use browser extension.',
        href: null,
        color: '#E8831D'
    },
    WALLET_CONNECT: {
        connector: walletconnector,
        name: "Wallet Connect",
        iconURL: WALLET_CONNECT_URL,
        description: "",
        href: null,
        color: '#2797FFFF',
        mobile: true
    }
}
