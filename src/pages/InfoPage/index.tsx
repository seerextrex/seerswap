import { Helmet } from 'react-helmet'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router'
import { useInfoSubgraph } from '../../hooks/subgraph/useInfoSubgraph'
import { InfoPools } from '../../components/InfoPools'
import { InfoTokens } from '../../components/InfoTokens'
import PoolInfoPage from '../PoolInfoPage'
import { InfoTotalStats } from '../../components/InfoTotalStats'
import Card from '../../shared/components/Card/Card'
import Menu from '../../components/Menu'
import { Grid, RefreshCw, StopCircle } from 'react-feather'
import './index.scss'

function InfoPage() {
    const { path } = useRouteMatch()
    const {
        fetchInfoPools: { poolsLoading, fetchInfoPoolsFn, poolsResult },
        fetchInfoTokens: { tokensLoading, fetchInfoTokensFn, tokensResult },
        fetchTotalStats: { totalStats, fetchTotalStatsFn, totalStatsLoading },
        blocksFetched
    } = useInfoSubgraph() || {}

    const infoMenuList = [
        {
            title: 'Pools',
            icon: <Grid size={18} />,
            link: '/info/pools'
        },
        {
            title: 'Tokens',
            icon: <StopCircle size={18} />,
            link: '/info/tokens'
        }
    ]

    return (
        <>
            <Helmet>
                <title>Algebra — Info</title>
            </Helmet>
            <div className={'w-100 maw-1180'}>
                    <Switch>
                        <Route exact path={`${path}`}>
                            <Redirect to={`${path}/pools`} />
                        </Route>
                        <Route exact path={`${path}/pools`}>
                            <Helmet>
                                <title>Algebra — Info • Pools</title>
                            </Helmet>
                            <Card isDark classes={'br-24 pa-2 mb-1'}>
                                <div className={'info-page-menu mb-1'}>
                                    <Menu items={infoMenuList} />
                                    <RefreshCw
                                        size={21}
                                        color={'var(--primary)'}
                                        onClick={() => (blocksFetched ? fetchInfoPoolsFn() : undefined)} />
                                </div>
                                <InfoTotalStats
                                    data={totalStats}
                                    refreshHandler={() => {
                                        fetchTotalStatsFn()
                                        fetchInfoPoolsFn()
                                    }}
                                    isLoading={totalStatsLoading}
                                    blocksFetched={blocksFetched}
                                    poolsStat={poolsResult}
                                />
                            </Card>
                            <Card isDark classes={'br-24 pa-2 mb-3'}>
                                <InfoPools
                                    data={poolsResult}
                                    refreshing={Boolean(poolsLoading)}
                                    fetchHandler={() => fetchInfoPoolsFn()}
                                    blocksFetched={blocksFetched}
                                />
                            </Card>
                        </Route>
                        <Route exact path={`${path}/pools/:id`} render={(e) =>
                            <PoolInfoPage
                            {...e}
                            fetchTotalStatsFn={fetchInfoPoolsFn}
                            fetchInfoPoolsFn={fetchInfoPoolsFn}
                            blocksFetched={blocksFetched}
                            totalStatsLoading={totalStatsLoading}
                            poolsResult={poolsResult}
                            totalStats={totalStats}
                        /> }>
                        </Route>
                        <Route exact path={`${path}/tokens`}>
                            <Helmet>
                                <title>Algebra — Info • Tokens</title>
                            </Helmet>
                            <Card isDark classes={'br-24 pa-2 mb-1'}>
                                <div className={'info-page-menu mb-1'}>
                                    <Menu items={infoMenuList} />
                                    <RefreshCw
                                        size={21}
                                        color={'var(--primary)'}
                                        onClick={() => (blocksFetched ? fetchInfoPoolsFn() : undefined)} />
                                </div>
                                <InfoTotalStats
                                    data={totalStats}
                                    refreshHandler={() => {
                                        fetchTotalStatsFn()
                                        fetchInfoPoolsFn()
                                    }}
                                    isLoading={totalStatsLoading}
                                    blocksFetched={blocksFetched}
                                    poolsStat={poolsResult}
                                />
                            </Card>
                            <Card isDark classes={'br-24 pa-2 mb-3'}>
                            <InfoTokens
                                data={tokensResult}
                                refreshing={Boolean(tokensLoading)}
                                fetchHandler={() => fetchInfoTokensFn()}
                                blocksFetched={blocksFetched}
                            />
                            </Card>
                        </Route>
                    </Switch>

            </div>
        </>
    )
}

export default InfoPage
