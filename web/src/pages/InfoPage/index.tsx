import React from "react";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router";
import { useInfoSubgraph } from "../../hooks/subgraph/useInfoSubgraph";
import { InfoPools } from "../../components/InfoPools";
import { InfoTokens } from "../../components/InfoTokens";
import PoolInfoPage from "../PoolInfoPage";
import { InfoTotalStats } from "../../components/InfoTotalStats";
import MarketPoolsView from "../../components/MarketPoolsView";
import Card from "../../shared/components/Card/Card";
import Menu from "../../components/Menu";
import { Grid, RefreshCw, StopCircle, TrendingUp } from "react-feather";
import "./index.scss";

import { t, Trans } from "@lingui/macro";

function InfoPage() {
    const { path } = useRouteMatch();
    const MARKET_MIN_TVL = 100; // Hardcoded $100 threshold
    const [hideMarketLowValue, setHideMarketLowValue] = React.useState(false);
    const [hideResolvedMarkets, setHideResolvedMarkets] = React.useState(true);
    
    const {
        fetchInfoPools: { poolsLoading, fetchInfoPoolsFn, poolsResult },
        fetchInfoTokens: { tokensLoading, fetchInfoTokensFn, tokensResult },
        fetchTotalStats: { totalStats, fetchTotalStatsFn, totalStatsLoading },
        blocksFetched,
    } = useInfoSubgraph() || {};

    const infoMenuList = [
        {
            title: t`Markets`,
            icon: <TrendingUp size={18} />,
            link: "/info/markets",
        },
        {
            title: t`Pools`,
            icon: <Grid size={18} />,
            link: "/info/pools",
        },
        {
            title: t`Tokens`,
            icon: <StopCircle size={18} />,
            link: "/info/tokens",
        },
    ];

    return (
        <>
            <Helmet>
                <title>{t`SeerSwap — Info`}</title>
            </Helmet>
            <div className={"w-100 maw-1180"}>
                <Switch>
                    <Route exact path={`${path}`}>
                        <Redirect to={`${path}/markets`} />
                    </Route>
                    <Route exact path={`${path}/markets`}>
                        <Helmet>
                            <title>{t`SeerSwap — Info • Markets`}</title>
                        </Helmet>
                        <Card classes={"br-24 pa-2 mb-1 w-100 mxs_p-1"}>
                            <div className={"info-page-menu mb-1"}>
                                <Menu items={infoMenuList} refreshHandler={() => undefined} isLoading={false} classes={"fs-125"} size={"17px"} />
                            </div>
                            <InfoTotalStats
                                data={totalStats}
                                refreshHandler={() => {
                                    fetchTotalStatsFn();
                                    fetchInfoPoolsFn();
                                }}
                                isLoading={totalStatsLoading}
                                blocksFetched={blocksFetched}
                                poolsStat={poolsResult}
                            />
                        </Card>
                        <Card classes={"card-gradient-shadow br-24 pa-2"}>
                            <div className="market-view-header">
                                <div className="market-view-filters">
                                    <label className="filter-checkbox">
                                        <input 
                                            type="checkbox" 
                                            checked={hideResolvedMarkets} 
                                            onChange={(e) => setHideResolvedMarkets(e.target.checked)}
                                        />
                                        <span className="filter-label">
                                            <Trans>Hide resolved markets</Trans>
                                        </span>
                                    </label>
                                    <label className="filter-checkbox">
                                        <input 
                                            type="checkbox" 
                                            checked={hideMarketLowValue} 
                                            onChange={(e) => setHideMarketLowValue(e.target.checked)}
                                        />
                                        <span className="filter-label">
                                            <Trans>Hide markets &lt; $100 TVL</Trans>
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <MarketPoolsView 
                                minTVL={MARKET_MIN_TVL} 
                                hideLowValue={hideMarketLowValue}
                                hideResolved={hideResolvedMarkets}
                            />
                        </Card>
                    </Route>
                    <Route exact path={`${path}/pools`}>
                        <Helmet>
                            <title>{t`SeerSwap — Info • Pools`}</title>
                        </Helmet>
                        <Card classes={"br-24 pa-2 mb-1 w-100 mxs_p-1"}>
                            <div className={"info-page-menu mb-1"}>
                                <Menu items={infoMenuList} refreshHandler={() => (blocksFetched ? fetchInfoPoolsFn() : undefined)} isLoading={poolsLoading} classes={"fs-125"} size={"17px"} />
                            </div>
                            <InfoTotalStats
                                data={totalStats}
                                refreshHandler={() => {
                                    fetchTotalStatsFn();
                                    fetchInfoPoolsFn();
                                }}
                                isLoading={totalStatsLoading}
                                blocksFetched={blocksFetched}
                                poolsStat={poolsResult}
                            />
                        </Card>
                        <Card classes={"card-gradient-shadow br-24 pa-2"}>
                            <InfoPools data={poolsResult} refreshing={Boolean(poolsLoading)} fetchHandler={() => fetchInfoPoolsFn()} blocksFetched={blocksFetched} />
                        </Card>
                    </Route>
                    <Route
                        exact
                        path={`${path}/pools/:id`}
                        render={(e) => (
                            <PoolInfoPage
                                {...e}
                                fetchTotalStatsFn={fetchTotalStatsFn}
                                fetchInfoPoolsFn={fetchInfoPoolsFn}
                                blocksFetched={blocksFetched}
                                totalStatsLoading={totalStatsLoading}
                                poolsResult={poolsResult}
                                totalStats={totalStats}
                            />
                        )}
                    />
                    <Route exact path={`${path}/tokens`}>
                        <Helmet>
                            <title>{t`SeerSwap — Info • Tokens`}</title>
                        </Helmet>
                        <Card classes={"br-24 pa-2 mb-1 mxs_p-1"}>
                            <div className={"info-page-menu mb-1"}>
                                <Menu items={infoMenuList} refreshHandler={() => (blocksFetched ? fetchInfoTokensFn() : undefined)} isLoading={tokensLoading} classes={"fs-125"} size={"17px"} />
                            </div>
                            <InfoTotalStats
                                data={totalStats}
                                refreshHandler={() => {
                                    fetchTotalStatsFn();
                                    fetchInfoPoolsFn();
                                }}
                                isLoading={totalStatsLoading}
                                blocksFetched={blocksFetched}
                                poolsStat={poolsResult}
                            />
                        </Card>
                        <Card classes={"br-24 pa-2 mb-3"}>
                            <InfoTokens data={tokensResult} refreshing={Boolean(tokensLoading)} fetchHandler={() => fetchInfoTokensFn()} blocksFetched={blocksFetched} />
                        </Card>
                    </Route>
                </Switch>
            </div>
        </>
    );
}

export default InfoPage;
