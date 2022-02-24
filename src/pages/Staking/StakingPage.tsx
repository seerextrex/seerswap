import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import { useEffect, useMemo, useState } from 'react'
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
import { StakerMyRewards } from '../../components/StakerMyRewards'
import { BodyWrapper, ConnectWalletButton, InnerWrapper, MainContentWrapper, MenuWrapper, MockScreen, PageWrapper } from './styled'
import { FormattedRewardInterface, Reward } from '../../models/interfaces'

export default function StakingPage() {
    const { account } = useActiveWeb3React()
    const { path } = useRouteMatch()
    const toggleWalletModal = useWalletModalToggle()

    const {
        fetchRewards: { rewardsResult, fetchRewardsFn, rewardsLoading },
        fetchAllEvents: { fetchAllEventsFn, allEvents, allEventsLoading },
        fetchTransferredPositions: { fetchTransferredPositionsFn, transferredPositions, transferredPositionsLoading },
        fetchEternalFarms: { fetchEternalFarmsFn, eternalFarms, eternalFarmsLoading }
    } = useIncentiveSubgraph() || {}

    const [now, setNow] = useState(Date.now())

    const formattedData = useMemo(() => {
        if (typeof rewardsResult === 'string') return []

        return rewardsResult.filter((el) => Boolean(+el.trueAmount))
    }, [rewardsResult])

    useEffect(() => {
        const timeNow = setInterval(() => setNow(Date.now()), 1000)
        return () => {
            clearInterval(timeNow)
        }
    }, [])

    // useEffect(() => console.log(transferredPositions), [transferredPositions])

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
                                            <title>Algebra — Farming • My Farms</title>
                                        </Helmet>
                                        <PageTitle
                                            title={'My Farms'}
                                            refreshHandler={() =>
                                                account ? fetchTransferredPositionsFn(true) : undefined
                                            }
                                            isLoading={transferredPositionsLoading}
                                        />
                                        {account ? (
                                            <>
                                                <StakerMyRewards
                                                    data={formattedData as Reward[] & FormattedRewardInterface[]}
                                                    refreshing={rewardsLoading}
                                                    fetchHandler={() => fetchRewardsFn(true)}
                                                />
                                                <StakerMyStakes
                                                    data={transferredPositions}
                                                    refreshing={transferredPositionsLoading}
                                                    fetchHandler={() => {
                                                        fetchTransferredPositionsFn(true)
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
                                    <Route exact path={`${path}/limit-farms`}>
                                        <Helmet>
                                            <title>Algebra — Farming • Limit Farms</title>
                                        </Helmet>
                                        <PageTitle
                                            title={'Limit Farms'}
                                            refreshHandler={() => fetchAllEventsFn(true)}
                                            isLoading={allEventsLoading}
                                        />
                                        <FarmingEventsPage
                                            data={allEvents}
                                            refreshing={allEventsLoading}
                                            fetchHandler={() => fetchAllEventsFn(true)}
                                            now={now}
                                        />
                                    </Route>
                                    <Route exact path={`${path}/infinite-farms`}>
                                        <Helmet>
                                            <title>Algebra — Farming • Infinite Farms</title>
                                        </Helmet>
                                        <PageTitle
                                            title={'Infinite Farms'}
                                            refreshHandler={() => fetchEternalFarmsFn(true)}
                                            isLoading={eternalFarmsLoading}
                                        />
                                        <EternalFarmsPage
                                            data={eternalFarms}
                                            refreshing={eternalFarmsLoading}
                                            fetchHandler={() => fetchEternalFarmsFn(true)}
                                        />
                                    </Route>
                                    <Route exact strict path={`${path}/farms-history`}>
                                        <Helmet>
                                            <title>Algebra — Farming • Farms History
                                                history</title>
                                        </Helmet>
                                        <PageTitle title={'Limit Farms History'} />
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
