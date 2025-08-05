import AlgebraConfig from "algebra.config";
import { createConfig, http } from 'wagmi';
import { gnosis as wagmiGnosisChain } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Create a custom Gnosis chain definition
const gnosisChainCustom = {
    ...wagmiGnosisChain,
    contracts: {
        ...wagmiGnosisChain.contracts,
        ensRegistry: undefined,
        ensUniversalResolver: undefined,
    },
};

// Wagmi config for use with @wagmi/core functions
export const wagmiConfig = createConfig({
    chains: [gnosisChainCustom],
    pollingInterval: 12000, // Poll every 12 seconds
    connectors: [
        injected({
            shimDisconnect: true,
        }),
        walletConnect({
            projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || "YOUR_WALLETCONNECT_PROJECT_ID",
            metadata: {
                name: 'SeerSwap',
                description: 'SeerSwap DEX Interface',
                url: 'localhost:3000',
                icons: ['/logo.png']
            },
            showQrModal: false,
            qrModalOptions: {
                themeMode: 'light',
                themeVariables: {
                    '--wcm-z-index': '9999',
                },
                explorerRecommendedWalletIds: [],
                enableExplorer: false,
            },
        }),
    ],
    transports: {
        [gnosisChainCustom.id]: http(AlgebraConfig.CHAIN_PARAMS.rpcURL),
    },
});