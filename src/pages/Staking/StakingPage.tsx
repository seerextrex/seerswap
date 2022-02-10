import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import { useEffect, useState } from 'react'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'
import { useIncentiveSubgraph } from '../../hooks/useIncentiveSubgraph'
import { AlignJustify } from 'react-feather'
import { useActiveWeb3React } from '../../hooks/web3'
import { StakingMenu } from '../../components/StakingMenu'
import { StakerMyStakes } from '../../components/StakerMyStakes'
import { FarmingEventsPage } from '../FarmingEventsPage'
import { PageTitle } from '../../components/PageTitle'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Helmet } from 'react-helmet'
import EternalFarmsPage from '../EternalFarmsPage'
import EventsHistory from '../EventsHistory'
import {
    BodyWrapper,
    ConnectWalletButton,
    InnerWrapper,
    MainContentWrapper,
    MenuWrapper,
    MockScreen,
    PageWrapper
} from './styled'
import { StakerMyRewards } from '../../components/StakerMyRewards'

export default function StakingPage() {
    const { account } = useActiveWeb3React()

    const {
        fetchRewards,
        fetchAllEvents,
        fetchFutureEvents,
        fetchTransferredPositions,
        fetchEternalFarms,
        fetchPositionsOnEternalFarmings
    } = useIncentiveSubgraph() || {}

    const [now, setNow] = useState(Date.now())

    useEffect(() => {
        const timeNow = setInterval(() => setNow(Date.now()), 1000)
        return () => {
            clearInterval(timeNow)
        }
    }, [])

    const { path } = useRouteMatch()

    const toggleWalletModal = useWalletModalToggle()

    return (
        <>
            <Helmet>
                <title>Algebra — Farming</title>
            </Helmet>
            <PageWrapper>
                <InnerWrapper gap='lg' justify='center'>
                    <InnerWrapper gap='lg' style={{ width: '100%', gridRowGap: '0' }}>
                        <MainContentWrapper>
                            <MenuWrapper>
                                <StakingMenu />
                            </MenuWrapper>
                            <BodyWrapper>
                                <Switch>
                                    <Route exact path={`${path}`}>
                                        <Redirect
                                            to={`${path}/${account ? 'farms' : 'infinite-farms'}`} />
                                    </Route>
                                    <Route exact path={`${path}/farms`}>
                                        <Helmet>
                                            <title>Algebra — Farming • My farms</title>
                                        </Helmet>
                                        <PageTitle
                                            title={'My farms'}
                                            refreshHandler={() =>
                                                account ? fetchTransferredPositions?.fetchTransferredPositionsFn(true) : undefined
                                            }
                                            isLoading={fetchTransferredPositions?.transferredPositionsLoading}
                                        />
                                        {account ? (
                                            <>
                                                <StakerMyRewards
                                                    data={fetchRewards?.rewardsResult}
                                                    refreshing={fetchRewards?.rewardsLoading}
                                                    fetchHandler={() => fetchRewards?.fetchRewardsFn(true)}
                                                />
                                                <StakerMyStakes
                                                    data={fetchTransferredPositions?.transferredPositions}
                                                    refreshing={fetchTransferredPositions?.transferredPositionsLoading}
                                                    fetchHandler={() => {
                                                        fetchTransferredPositions?.fetchTransferredPositionsFn(true)
                                                        // fetchPositionsOnEternalFarmings?.fetchPositionsOnEternalFarmingFn(true)
                                                    }}
                                                    now={now}
                                                />
                                            </>
                                        ) : (
                                            <MockScreen>
                                                <AlignJustify size={40} stroke={'white'} />
                                                <p>Connect your account to view farms</p>
                                                <ConnectWalletButton onClick={toggleWalletModal}>Connect
                                                    Wallet</ConnectWalletButton>
                                            </MockScreen>
                                        )}
                                    </Route>
                                    <Route exact path={`${path}/farming-events`}>
                                        <Helmet>
                                            <title>Algebra — Farming • Famring events</title>
                                        </Helmet>
                                        <PageTitle
                                            title={'Farming events'}
                                            refreshHandler={() => fetchAllEvents?.fetchAllEventsFn(true)}
                                            isLoading={fetchAllEvents?.allEventsLoading}
                                        />
                                        <FarmingEventsPage
                                            data={fetchAllEvents?.allEvents}
                                            refreshing={fetchAllEvents?.allEventsLoading}
                                            fetchHandler={() => fetchAllEvents?.fetchAllEventsFn(true)}
                                            now={now}
                                        />
                                    </Route>
                                    <Route exact path={`${path}/infinite-farms`}>
                                        <Helmet>
                                            <title>Algebra — Farming • Infinite farms</title>
                                        </Helmet>
                                        <PageTitle
                                            title={'Infinite farms'}
                                            refreshHandler={() => fetchEternalFarms?.fetchEternalFarmsFn(true)}
                                            isLoading={fetchEternalFarms?.eternalFarmsLoading}
                                        />
                                        <EternalFarmsPage
                                            data={fetchEternalFarms?.eternalFarms}
                                            refreshing={fetchEternalFarms?.eternalFarmsLoading}
                                            fetchHandler={() => fetchEternalFarms.fetchEternalFarmsFn(true)}
                                        />
                                    </Route>
                                    <Route exact strict path={`${path}/events-history`}>
                                        <Helmet>
                                            <title>Algebra — Farming • Farming events
                                                history</title>
                                        </Helmet>
                                        <PageTitle title={'Farming events history'} />
                                        <EventsHistory />
                                    </Route>
                                </Switch>
                            </BodyWrapper>
                        </MainContentWrapper>
                    </InnerWrapper>
                </InnerWrapper>
            </PageWrapper>
            <SwitchLocaleLink />
        </>
    )
}
