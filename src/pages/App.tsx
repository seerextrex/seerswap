import ApeModeQueryParamReader from 'hooks/useApeModeQueryParamReader'
import { Route, Switch } from 'react-router-dom'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import { RedirectDuplicateTokenIds } from './AddLiquidity/redirects'
import PoolPage from './Pool'
import { PositionPage } from './Pool/PositionPage'
import RemoveLiquidityV3 from './RemoveLiquidity/V3'
import Swap from './Swap'
import StakingPage from './Staking/StakingPage'
import { RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
import { Pool } from 'lib/src'
import MigrateV2Pair from './MigrateV2/MigrateV2Pair'
import MigrateV2 from './MigrateV2'
import { InfoPage } from './InfoPage'
import { ExternalLink } from 'react-feather'
import { useEffect } from 'react'
import CautionModal from '../components/CautionModal'
import PoolFinder from './PoolFinder'
import StakingAnalyticsPage from './StakingAnalyticsPage'
import { useInternet } from '../hooks/useInternet'
import { useIsNetworkFailed } from '../hooks/useIsNetworkFailed'
import Loader from '../components/Loader'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { Offline as OfflineIntegration, CaptureConsole as CaptureConsoleIntegration } from '@sentry/integrations'
import { GasPrice } from '../components/Header/GasPrice'
import { useFarmingActionsHandlers } from '../state/farming/hooks'
import { useActiveWeb3React } from '../hooks/web3'
import RealStakerPage from './RealStakerPage'
import {
  AppWrapper,
  AppBodyWrapper,
  HeaderWrapper,
  Marginer,
  BugReportLink,
  NetworkFailedCard,
  InternetError,
  GlobalStyle
} from './styled'

Sentry.init({
  dsn: 'https://fbf2161b766648b58456a3501f72e21a@o1085550.ingest.sentry.io/6096418',
  integrations: [
    new Integrations.BrowserTracing(),
    new OfflineIntegration({
      maxStoredEvents: 30
    }),
    new CaptureConsoleIntegration({
      levels: ['error']
    })
  ],
  tracesSampleRate: 1.0,
  attachStacktrace: true
})

export default function App() {
  Object.defineProperty(Pool.prototype, 'tickSpacing', {
    get() {
      return 60
    }
  })
  const internet = useInternet()

  const { account } = useActiveWeb3React()

  const { onIsFarming } = useFarmingActionsHandlers()

  const networkFailed = useIsNetworkFailed()

  useEffect(() => {
    onIsFarming()
  }, [])

  useEffect(() => {
    if (!account) return

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'userId',
      user_id: account
    })

  }, [account])

  return (
    <Sentry.ErrorBoundary>
      <GlobalStyle />
      <Route component={DarkModeQueryParamReader} />
      <Route component={ApeModeQueryParamReader} />
      <Route component={GoogleAnalyticsReporter} />
      <Web3ReactManager>
        <AppWrapper>
          <CautionModal />
          <HeaderWrapper style={{ zIndex: 3 }}>
            <Header />
          </HeaderWrapper>
          {!internet && <InternetError>
            <h2>
              Network ERROR
            </h2>
          </InternetError>}
          <AppBodyWrapper style={{ zIndex: 2 }}>
            {networkFailed && (
              <NetworkFailedCard>
                <div style={{ marginBottom: '1rem', fontWeight: 600 }}>Polygon network failed</div>
                <div style={{ display: 'flex' }}>
                  <span>Reconnecting...</span>
                  <Loader
                    style={{ display: 'inline-block', marginLeft: 'auto', marginRight: 'auto' }}
                    stroke={'white'}
                  />
                </div>
              </NetworkFailedCard>
            )}
            <BugReportLink
              target='_blank'
              rel='noopener noreferrer'
              href='https://docs.google.com/forms/d/e/1FAIpQLSdcixQ6rmXSSLhuEzzirladoTD5TXv3q_H9IouGM0CyIGcLBA/viewform'
            >
              <span>Report a bug</span>
              <span>
                {' '}
                <ExternalLink size={16} stroke={'#36f'} />{' '}
              </span>
            </BugReportLink>
            <Popups />
            <Polling />
            <GasPrice />
            <Switch>
              <Route strict path='/farming' component={StakingPage} />

              <Route strict path='/info' component={InfoPage} />

              <Route exact strict path='/send' component={RedirectPathToSwapOnly} />
              <Route exact strict path='/swap/:outputCurrency' component={RedirectToSwap} />
              <Route exact strict path='/swap' component={Swap} />

              <Route exact strict path='/pool/find' component={PoolFinder} />
              <Route exact strict path='/pool' component={PoolPage} />
              <Route exact strict path='/pool/:tokenId' component={PositionPage} />

              <Route
                exact
                strict
                path='/add/:currencyIdA?/:currencyIdB?/:feeAmount?'
                component={RedirectDuplicateTokenIds}
              />

              <Route exact strict path='/increase/:currencyIdA?/:currencyIdB?/:tokenId?' component={AddLiquidity} />

              <Route exact strict path='/remove/:tokenId' component={RemoveLiquidityV3} />

              <Route exact strict path='/migrate' component={MigrateV2} />
              <Route exact strict path='/migrate/:address' component={MigrateV2Pair} />

              <Route exact strict path='/staking' component={RealStakerPage} />
              <Route exact strict path='/staking/analytics' component={StakingAnalyticsPage} />


              <Route component={RedirectPathToSwapOnly} />
            </Switch>
            <Marginer />
          </AppBodyWrapper>
        </AppWrapper>
      </Web3ReactManager>
    </Sentry.ErrorBoundary>
  )
}
