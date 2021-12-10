import ApeModeQueryParamReader from 'hooks/useApeModeQueryParamReader'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components/macro'
import ErrorBoundary from '../components/ErrorBoundary'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import { ApplicationModal } from '../state/application/actions'
import { useModalOpen, useToggleModal } from '../state/application/hooks'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import { RedirectDuplicateTokenIds } from './AddLiquidity/redirects'
import PoolPage from './Pool'
import { PositionPage } from './Pool/PositionPage'
import RemoveLiquidityV3 from './RemoveLiquidity/V3'
import Swap from './Swap'
import StakingPage from './Staking/StakingPage'
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
import { Pool } from 'lib/src'
import StakingPoolPage from './Staking/StakingPoolPage'
// import { NewIncentivePage } from './Staking/NewIncentivePage'
import { RedirectDuplicateTokenStakingIds } from './Staking/redirects'
import { CurrentEventsPage } from './CurrentEventsPage'
import { FutureEventsPage } from './FutureEventsPage'
import { StakerMyRewards } from '../components/StakerMyRewards'
import { STAKER_ADDRESS } from '../constants/addresses'
import { createGlobalStyle } from 'styled-components/macro'
import MigrateV2Pair from './MigrateV2/MigrateV2Pair'
import MigrateV2 from './MigrateV2'
import { InfoPage } from './InfoPage'
import { ExternalLink } from 'react-feather'
import Modal from '../components/Modal'
import { useCallback, useEffect, useState } from 'react'
import CautionModal from '../components/CautionModal'
import PoolFinder from './PoolFinder'

import { BigNumber } from '@ethersproject/bignumber'
import { parseUnits } from '@ethersproject/units'
import { useIsNetworkFailed } from '../hooks/useIsNetworkFailed'
import Loader from '../components/Loader'
        
import { useInfoSubgraph } from '../hooks/subgraph/useInfoSubgraph'
import FeeChartRangeInput from '../components/FeeChartRangeInput'
import PoolInfoPage from './PoolInfoPage'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'

import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import { Offline as OfflineIntegration, CaptureConsole as CaptureConsoleIntegration } from '@sentry/integrations'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 120px 16px 0px 16px;
  align-items: center;
  flex: 1;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 5rem 16px 16px 16px;
  `};
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 2;
`
const Marginer = styled.div`
  margin-top: 5rem;
`

const BugReportLink = styled.a`
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  color: #36f;
  text-decoration: none;
`

const NetworkFailedCard = styled.div`
  position: fixed;
  bottom: 3rem;
  right: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: #390909;
  border: 1px solid #852020;
`

const GlobalStyle = createGlobalStyle`
  button {
    cursor: pointer;
  }
`

Sentry.init({
  dsn: 'https://fbf2161b766648b58456a3501f72e21a@o1085550.ingest.sentry.io/6096418',
  integrations: [
    new Integrations.BrowserTracing(),
    new OfflineIntegration({
      maxStoredEvents: 30,
    }),
    new CaptureConsoleIntegration({
      levels: ['error'],
    }),
  ],
  tracesSampleRate: 1.0,
  attachStacktrace: true,
})

export default function App() {
  Object.defineProperty(Pool.prototype, 'tickSpacing', {
    get() {
      return 60
    },
  })

  const networkFailed = useIsNetworkFailed()

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
          <BodyWrapper style={{ zIndex: 2 }}>
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#702498',
                borderRadius: '8px',
                marginTop: '-2rem',
                marginBottom: '2rem',
              }}
            >
              <span>⚠️</span> <span>Contracts are being audited. Please use with caution.</span> <span>⚠️</span>
            </div>
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
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.google.com/forms/d/e/1FAIpQLSdcixQ6rmXSSLhuEzzirladoTD5TXv3q_H9IouGM0CyIGcLBA/viewform"
            >
              <span>Report a bug</span>
              <span>
                {' '}
                <ExternalLink size={16} stroke={'#36f'} />{' '}
              </span>
            </BugReportLink>
            <Popups />
            <Polling />
            <Switch>
              <Route strict path="/farming" component={StakingPage} />

              <Route strict path="/info" component={InfoPage} />

              <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact strict path="/swap" component={Swap} />

              <Route exact strict path="/pool/find" component={PoolFinder} />
              <Route exact strict path="/pool" component={PoolPage} />
              <Route exact strict path="/pool/:tokenId" component={PositionPage} />

              <Route
                exact
                strict
                path="/add/:currencyIdA?/:currencyIdB?/:feeAmount?"
                component={RedirectDuplicateTokenIds}
              />

              <Route exact strict path="/increase/:currencyIdA?/:currencyIdB?/:tokenId?" component={AddLiquidity} />

              <Route exact strict path="/remove/:tokenId" component={RemoveLiquidityV3} />

              <Route exact strict path="/migrate" component={MigrateV2} />
              <Route exact strict path="/migrate/:address" component={MigrateV2Pair} />

              <Route component={RedirectPathToSwapOnly} />
            </Switch>
            <Marginer />
          </BodyWrapper>
        </AppWrapper>
      </Web3ReactManager>
    </Sentry.ErrorBoundary>
  )
}
