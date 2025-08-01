import INJECTED_ICON_URL from "../assets/images/arrow-right.svg";
import METAMASK_ICON_URL from "../assets/svg/metamask-logo.svg";
// import COINBASE_ICON_URL from "../assets/svg/coinbaseWalletIcon.svg"; // Not used currently, can be re-added if Coinbase Wallet is explicitly supported via wagmi
import WALLET_CONNECT_URL from "../assets/images/walletConnectionIcon.svg";
// import { Wallet, injected, walletConnect, coinbaseWallet } from "../connectors"; // Remove old connectors
// import { Connector } from "@web3-react/types"; // Remove old connector type

export interface WalletInfo {
    // connector?: Connector; // Remove old connector field
    // wallet?: Wallet; // Remove old wallet enum field
    connectorId: string; // Add connectorId for wagmi
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
    // Note: The keys like 'INJECTED', 'METAMASK' are for internal lookup.
    // The `connectorId` should match the `id` provided by wagmi's connectors.
    // For standard injected provider (MetaMask, Brave, etc.):
    INJECTED: { // This can be a generic fallback for any injected provider
        connectorId: "injected", // Default wagmi id for browser wallets
        name: "Browser Wallet", // Generic name
        iconURL: INJECTED_ICON_URL, // Generic icon
        description: "Connect using your browser wallet (e.g., MetaMask, Brave).",
        href: null,
        color: "#010101",
        primary: true,
    },
    METAMASK: {
        connectorId: "metaMask", // Wagmi's specific ID for MetaMask if available directly, or often just 'injected'
        name: "MetaMask",
        iconURL: METAMASK_ICON_URL,
        description: "Connect with MetaMask.",
        href: null,
        color: "#E8831D",
    },
    WALLET_CONNECT: {
        connectorId: "walletConnect", // Wagmi's ID for WalletConnect
        name: "WalletConnect",
        iconURL: WALLET_CONNECT_URL,
        description: "Connect using WalletConnect (e.g., Trust Wallet, Rainbow).",
        href: null,
        color: "#4196FC",
        mobile: true,
    },
    // COINBASE: { // Example if you add Coinbase Wallet SDK connector via wagmi
    //     connectorId: "coinbaseWalletSDK", // or whatever wagmi id is for coinbase wallet sdk
    //     name: "Coinbase Wallet",
    //     iconURL: COINBASE_ICON_URL,
    //     description: "Connect with Coinbase Wallet.",
    //     href: null,
    //     color: "#0052FF",
    // },
};
