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
import Web3Provider from "./components/Web3Provider";

type __window = Window & { ethereum: any };

const _window = window as unknown as __window;

if (_window.ethereum) {
    _window.ethereum.autoRefreshOnNetworkChange = false;
}

const client = new ApolloClient({
    uri: AlgebraConfig.SUBGRAPH.infoURL,
    cache: new InMemoryCache(),
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

ReactDOM.render(
    <StrictMode>
        <ApolloProvider client={client}>
            <Provider store={store}>
                <HashRouter>
                    <LanguageProvider>
                        <Web3Provider>
                            <Blocklist>
                                <Updaters />
                                <ThemeProvider>
                                    <ThemedGlobalStyle />
                                    <App />
                                </ThemeProvider>
                            </Blocklist>
                        </Web3Provider>
                    </LanguageProvider>
                </HashRouter>
            </Provider>
        </ApolloProvider>
    </StrictMode>,
    document.getElementById("root")
);
