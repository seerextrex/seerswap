import ApeModeQueryParamReader from 'hooks/useApeModeQueryParamReader'
import { Route, Switch } from 'react-router-dom'
import styled, { createGlobalStyle } from 'styled-components/macro'
import ErrorBoundary from '../components/ErrorBoundary'
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
import InfoPage from './InfoPage'
import { ExternalLink } from 'react-feather'
import { useEffect } from 'react'
import CautionModal from '../components/CautionModal'
import PoolFinder from './PoolFinder'

import StakingAnalyticsPage from './StakingAnalyticsPage'
import { useInternet } from '../hooks/useInternet'
import { useIsNetworkFailed } from '../hooks/useIsNetworkFailed'
import Loader from '../components/Loader'

import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'

import BG from '../assets/images/bg.png'

import { GasPrice } from '../components/Header/GasPrice'
import { useFarmingActionsHandlers } from '../state/farming/hooks'
import { useActiveWeb3React } from '../hooks/web3'
import RealStakerPage from './RealStakerPage'

const AppWrapper = styled.div`
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    height: 100%;
`

const Background = styled.div`
    background-image: url(${BG});
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-repeat: no-repeat, repeat;
    background-size: cover, auto;
    background-origin: padding-box, padding-box;
    background-clip: border-box, border-box;
    background-attachment: fixed;
    background-position: 100% center, 0% 0%;
`

const BodyWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 16px 0px 16px;
    align-items: center;
    flex: 1;
    z-index: 1;

    ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 16px 16px 16px;
  `};
`

const HeaderWrapper = styled.div`
    ${({ theme }) => theme.flexRowNoWrap};
    width: 100%;
    justify-content: space-between;
    top: 0;
    z-index: 2;
`
const Marginer = styled.div`
    // margin-top: 5rem;
`

const BugReportLink = styled.a`
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    color: #36f;
    text-decoration: none;

    ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `}
`

const NetworkFailedCard = styled.div`
    position: fixed;
    bottom: 3rem;
    right: 1rem;
    padding: 1rem;
    border-radius: 8px;
    background-color: #f65c5c;
    border: 1px solid #852020;

    ${({ theme }) => theme.mediaWidth.upToSmall`
    position: unset;
    width: calc(100% - 2rem);
    left: unset;
    right: unset;
    margin-bottom: 0;
    margin-top: 0.5rem;
  `}
`

const InternetError = styled.div`
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;

    h2 {
        color: white;
        font-size: 40px;
        text-align: center;
    }
`

const GlobalStyle = createGlobalStyle`
    button {
        cursor: pointer;
    }
`

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
        <ErrorBoundary>
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
                    {!internet && (
                        <InternetError>
                            <h2>Network ERROR</h2>
                        </InternetError>
                    )}
                    <BodyWrapper style={{ zIndex: 2 }}>
                        {networkFailed && (
                            <NetworkFailedCard>
                                <div style={{ marginBottom: '1rem', fontWeight: 600 }}>Polygon
                                    network failed
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <span>Reconnecting...</span>
                                    <Loader
                                        style={{
                                            display: 'inline-block',
                                            marginLeft: 'auto',
                                            marginRight: 'auto'
                                        }}
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
                            <Route exact strict path='/swap/:outputCurrency'
                                   component={RedirectToSwap} />
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

                            <Route exact strict
                                   path='/increase/:currencyIdA?/:currencyIdB?/:tokenId?'
                                   component={AddLiquidity} />

                            <Route exact strict path='/remove/:tokenId'
                                   component={RemoveLiquidityV3} />

                            <Route exact strict path='/migrate' component={MigrateV2} />
                            <Route exact strict path='/migrate/:address'
                                   component={MigrateV2Pair} />

                            <Route exact strict path='/staking' component={RealStakerPage} />
                            <Route exact strict path='/staking/analytics'
                                   component={StakingAnalyticsPage} />

                            <Route component={RedirectPathToSwapOnly} />
                        </Switch>
                        <Marginer />
                    </BodyWrapper>
                </AppWrapper>
            </Web3ReactManager>
        </ErrorBoundary>
    )
}
