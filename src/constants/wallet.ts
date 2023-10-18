import INJECTED_ICON_URL from "../assets/images/arrow-right.svg";
import METAMASK_ICON_URL from "../assets/svg/metamask-logo.svg";
import COINBASE_ICON_URL from "../assets/svg/coinbaseWalletIcon.svg";
import WALLET_CONNECT_URL from "../assets/images/walletConnectionIcon.svg";
import { Wallet, injected, walletConnect, coinbaseWallet } from "../connectors";
import { Connector } from "@web3-react/types";

interface WalletInfo {
    connector?: Connector;
    wallet?: Wallet;
    name: string;
    iconURL: string;
    description: string;
    href: string | null;
    color: string;
    primary?: true;
    mobile?: true;
    mobileOnly?: true;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
    INJECTED: {
        connector: injected,
        wallet: Wallet.INJECTED,
        name: "Injected",
        iconURL: INJECTED_ICON_URL,
        description: "Injected web3 provider.",
        href: null,
        color: "#010101",
        primary: true,
    },
    METAMASK: {
        connector: injected,
        wallet: Wallet.INJECTED,
        name: "MetaMask",
        iconURL: METAMASK_ICON_URL,
        description: "Easy-to-use browser extension.",
        href: null,
        color: "#E8831D",
    },
    WALLET_CONNECT: {
        connector: walletConnect,
        wallet: Wallet.WALLET_CONNECT,
        name: "WalletConnect",
        iconURL: WALLET_CONNECT_URL,
        description: "Connect to Trust Wallet, Rainbow Wallet and more...",
        href: null,
        color: "#4196FC",
        mobile: true,
    },
};
