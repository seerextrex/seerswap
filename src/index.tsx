import "inter-ui";
import "@reach/dialog/styles.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { StrictMode } from "react";
import ReactDOM from "react-dom";
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
    connectors: [
        injected(),
        walletConnect({
            projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || "YOUR_WALLETCONNECT_PROJECT_ID",
            metadata: {
                name: 'Algebra Interface',
                description: 'Algebra DEX Interface',
                url: 'https://algebra.finance',
                icons: ['/logo.png']
            },
        }),
    ],
    transports: {
        [gnosisChainCustom.id]: http(AlgebraConfig.CHAIN_PARAMS.rpcURL),
    },
});

// React Query client
const queryClient = new QueryClient();

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

ReactDOM.render(
    <StrictMode>
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider options={{ truncateLongENSAddress: false }}>
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
    </StrictMode>,
    document.getElementById("root")
);
