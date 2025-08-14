import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useInfoSubgraph } from "../../hooks/subgraph/useInfoSubgraph";
import { InfoPools } from "../../components/InfoPools";
import { InfoTokens } from "../../components/InfoTokens";
import { InfoTotalStats } from "../../components/InfoTotalStats";
import Card from "../../shared/components/Card/Card";
import { t, Trans } from "@lingui/macro";
import "./index.scss";

export default function Explore() {
    const [activeTab, setActiveTab] = useState<"pools" | "tokens">("pools");
    
    const {
        fetchInfoPools: { poolsLoading, fetchInfoPoolsFn, poolsResult },
        fetchInfoTokens: { tokensLoading, fetchInfoTokensFn, tokensResult },
        fetchTotalStats: { totalStats, fetchTotalStatsFn, totalStatsLoading },
        blocksFetched,
    } = useInfoSubgraph() || {};

    return (
        <>
            <Helmet>
                <title>{t`Explore • SeerSwap`}</title>
            </Helmet>
            
            <div className="explore-page">
                <Card classes={"br-24 pa-2 mb-1 w-100 mxs_p-1"}>
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

                <Card classes={"br-24 pa-2 w-100"}>
                    <div className="explore-tabs" role="tablist">
                        <button 
                            className={`explore-tab ${activeTab === "pools" ? "active" : ""}`}
                            onClick={() => setActiveTab("pools")}
                            role="tab"
                            aria-selected={activeTab === "pools"}
                            aria-controls="pools-panel"
                            id="pools-tab"
                        >
                            <Trans>Pools</Trans>
                        </button>
                        <button 
                            className={`explore-tab ${activeTab === "tokens" ? "active" : ""}`}
                            onClick={() => setActiveTab("tokens")}
                            role="tab"
                            aria-selected={activeTab === "tokens"}
                            aria-controls="tokens-panel"
                            id="tokens-tab"
                        >
                            <Trans>Tokens</Trans>
                        </button>
                    </div>

                    <div 
                        className="explore-content"
                        role="tabpanel"
                        id={activeTab === "pools" ? "pools-panel" : "tokens-panel"}
                        aria-labelledby={activeTab === "pools" ? "pools-tab" : "tokens-tab"}
                    >
                        {activeTab === "pools" ? (
                            <InfoPools 
                                data={poolsResult} 
                                refreshing={Boolean(poolsLoading)} 
                                fetchHandler={() => fetchInfoPoolsFn()} 
                                blocksFetched={blocksFetched} 
                            />
                        ) : (
                            <InfoTokens 
                                data={tokensResult} 
                                refreshing={Boolean(tokensLoading)} 
                                fetchHandler={() => fetchInfoTokensFn()} 
                                blocksFetched={blocksFetched} 
                            />
                        )}
                    </div>
                </Card>
            </div>
        </>
    );
}