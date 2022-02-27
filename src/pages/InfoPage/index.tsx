import { InfoMenu } from '../../components/InfoMenu'
import { Helmet } from 'react-helmet'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router'
import { useInfoSubgraph } from '../../hooks/subgraph/useInfoSubgraph'
import { InfoPools } from '../../components/InfoPools'
import { InfoTokens } from '../../components/InfoTokens'
import { PageTitle } from '../../components/PageTitle'
import PoolInfoPage from '../PoolInfoPage'
import { InfoTotalStats } from '../../components/InfoTotalStats'
import { BodyWrapper, InnerWrapper, MainContentWrapper, MenuWrapper, PageWrapper } from './styled'
import Card from '../../shared/components/Card/Card'

function InfoPage() {
    const { path } = useRouteMatch()
    const {
        fetchInfoPools: { poolsLoading, fetchInfoPoolsFn, poolsResult },
        fetchInfoTokens: { tokensLoading, fetchInfoTokensFn, tokensResult },
        fetchTotalStats: { totalStats, fetchTotalStatsFn, totalStatsLoading },
        blocksFetched
    } = useInfoSubgraph() || {}

    return (
        <>
            <Helmet>
                <title>Algebra — Info</title>
            </Helmet>
            <PageWrapper>
                <InnerWrapper gap='lg' justify='center'>
                    <InnerWrapper gap='lg' style={{ width: '100%', gridRowGap: '0' }}>
                        <MainContentWrapper>
                            <Card isDark classes={'br-24 pa-2 mb-1'}>
                                <MenuWrapper>
                                    <InfoMenu />
                                </MenuWrapper>
                                <InfoTotalStats
                                    data={totalStats}
                                    refreshHandler={() => {
                                        fetchTotalStatsFn()
                                        fetchInfoPoolsFn()
                                    }}
                                    isLoading={Boolean(totalStatsLoading)}
                                    blocksFetched={blocksFetched}
                                    poolsStat={poolsResult}
                                />
                            </Card>
                            <BodyWrapper>
                                <Switch>
                                    <Route exact path={`${path}`}>
                                        <Redirect to={`${path}/pools`} />
                                    </Route>
                                    <Route exact path={`${path}/pools`}>
                                        <Helmet>
                                            <title>Algebra — Info • Pools</title>
                                        </Helmet>
                                        <PageTitle
                                            title={'Pools'}
                                            refreshHandler={() => (blocksFetched ? fetchInfoPoolsFn() : undefined)}
                                            isLoading={Boolean(poolsLoading)}
                                        />
                                        <InfoPools
                                            data={poolsResult}
                                            refreshing={Boolean(poolsLoading)}
                                            fetchHandler={() => fetchInfoPoolsFn()}
                                            blocksFetched={blocksFetched}
                                        />
                                    </Route>
                                    <Route exact path={`${path}/pools/:id`}
                                           component={PoolInfoPage} />
                                    <Route exact path={`${path}/tokens`}>
                                        <Helmet>
                                            <title>Algebra — Info • Tokens</title>
                                        </Helmet>
                                        <PageTitle
                                            title={'Tokens'}
                                            refreshHandler={() => (blocksFetched ? fetchInfoTokensFn() : undefined)}
                                            isLoading={Boolean(tokensLoading)}
                                        />
                                        <InfoTokens
                                            data={tokensResult}
                                            refreshing={Boolean(tokensLoading)}
                                            fetchHandler={() => fetchInfoTokensFn()}
                                            blocksFetched={blocksFetched}
                                        />
                                    </Route>
                                </Switch>
                            </BodyWrapper>
                        </MainContentWrapper>
                    </InnerWrapper>
                </InnerWrapper>
            </PageWrapper>
        </>
    )
}

export default InfoPage
