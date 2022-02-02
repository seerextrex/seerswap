import 'inter-ui'
import '@reach/dialog/styles.css'
import './components/analytics'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import Blocklist from './components/Blocklist'
import { NetworkContextName } from './constants/misc'
import { LanguageProvider } from './i18n'
import App from './pages/App'
import store from './state'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import LogsUpdater from './state/logs/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
import ThemeProvider, { ThemedGlobalStyle } from './theme'
import RadialGradientByChainUpdater from './theme/RadialGradientByChainUpdater'
import getLibrary from './utils/getLibrary'
import '@fontsource/montserrat'
import GasUpdater from './state/application/gasUpdater'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/cryptoalgebra/algebra',
  cache: new InMemoryCache(),
})

function Updaters() {
  return (
    <>
      <RadialGradientByChainUpdater />
      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
      <LogsUpdater />
      <GasUpdater />
    </>
  )
}

ReactDOM.render(
  <StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <HashRouter>
          <LanguageProvider>
            <Web3ReactProvider getLibrary={getLibrary}>
              <Web3ProviderNetwork getLibrary={getLibrary}>
                <Blocklist>
                  <Updaters />
                  <ThemeProvider>
                    <ThemedGlobalStyle />
                    <App />
                  </ThemeProvider>
                </Blocklist>
              </Web3ProviderNetwork>
            </Web3ReactProvider>
          </LanguageProvider>
        </HashRouter>
      </Provider>
    </ApolloProvider>
  </StrictMode>,
  document.getElementById('root')
)

serviceWorkerRegistration.unregister()
