import "inter-ui";
import "@reach/dialog/styles.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import Blocklist from "./components/Blocklist";
import { LanguageProvider } from "./i18n";
import App from "./pages/App";
import store from "./state";
import ApplicationUpdater from "./state/application/updater";
import ListsUpdater from "./state/lists/updater";
import MulticallUpdater from "./state/multicall/updater";
import LogsUpdater from "./state/logs/updater";
import TransactionUpdater from "./state/transactions/updater";
import UserUpdater from "./state/user/updater";
import ThemeProvider, { ThemedGlobalStyle } from "./theme";
import "@fontsource/montserrat";
import GasUpdater from "./state/application/gasUpdater";
import "./assets/styles/index.scss";

import AlgebraConfig from "algebra.config";
import { WagmiProvider, createConfig, http } from 'wagmi';
import { gnosis as wagmiGnosisChain } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected } from 'wagmi/connectors';
import { walletConnect } from 'wagmi/connectors';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

type __window = Window & { ethereum: any };

const _window = window as unknown as __window;

if (_window.ethereum) {
    _window.ethereum.autoRefreshOnNetworkChange = false;
}

const apolloClient = new ApolloClient({
    uri: AlgebraConfig.SUBGRAPH.infoURL,
    cache: new InMemoryCache(),
});

// Create a custom Gnosis chain definition
const gnosisChainCustom = {
    ...wagmiGnosisChain,
    contracts: {
        ...wagmiGnosisChain.contracts,
        ensRegistry: undefined,
        ensUniversalResolver: undefined,
    },
};

// Wagmi config - Manually creating config instead of getDefaultConfig
const wagmiConfig = createConfig({
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
            // Set event listeners limits higher to prevent warnings
            qrModalOptions: {
                themeMode: 'light',
                themeVariables: {
                    '--wcm-z-index': '9999', // Make sure it's highest z-index
                },
                // Simplify the UI to reduce complexity
                explorerRecommendedWalletIds: [],
                enableExplorer: false,
            },
        }),
    ],
    transports: {
        [gnosisChainCustom.id]: http(AlgebraConfig.CHAIN_PARAMS.rpcURL),
    },
});

// React Query client with optimized settings
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 30000, // 30 seconds
            refetchOnWindowFocus: false,
            refetchOnMount: true,
        },
    },
});

function Updaters() {
    return (
        <>
            <ListsUpdater />
            <UserUpdater />
            <ApplicationUpdater />
            <TransactionUpdater />
            <MulticallUpdater />
            <LogsUpdater />
            <GasUpdater />
        </>
    );
}

const container = document.getElementById("root");
if (container) {
    const root = createRoot(container);
    root.render(
        <StrictMode>
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    <ConnectKitProvider
                        options={{
                            truncateLongENSAddress: false,
                            hideNoWalletCTA: true,
                            hideQuestionMarkCTA: true,
                            walletConnectCTA: 'modal',
                            hideTooltips: true,
                            initialChainId: AlgebraConfig.CHAIN_PARAMS.chainId
                        }}
                        mode="light"
                        customTheme={{
                            "--ck-overlay-background": "rgba(0, 0, 0, 0.8)",
                            "--ck-overlay-z-index": "9990",
                            "--ck-modal-z-index": "9991",
                        }}
                    >
                        <ApolloProvider client={apolloClient}>
                            <Provider store={store}>
                                <HashRouter>
                                    <LanguageProvider>
                                        <Blocklist>
                                            <Updaters />
                                            <ThemeProvider>
                                                <ThemedGlobalStyle />
                                                <App />
                                            </ThemeProvider>
                                        </Blocklist>
                                    </LanguageProvider>
                                </HashRouter>
                            </Provider>
                        </ApolloProvider>
                    </ConnectKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </StrictMode>
    );
}
