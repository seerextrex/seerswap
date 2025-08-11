import { useCallback, useEffect, useMemo, useState } from "react";
import { RouteComponentProps } from "react-router";
import { useAccount } from "wagmi";
import { ArrowLeft } from "react-feather";
import { NavLink } from "react-router-dom";
import { t, Trans } from "@lingui/macro";
import dayjs from "dayjs";
import Card from "../../shared/components/Card/Card";
import Loader from "../../components/Loader";
import { ChartSpan, ChartType } from "../../models/enums";
import { useMarketData } from "../../hooks/useMarketData";
import { MarketInfoHeader } from "./MarketInfoHeader";
import { EnhancedMarketChart } from "./EnhancedMarketChart";
import { MarketInfoStats } from "./MarketInfoStats";
import "./index.scss";

interface MarketInfoPageProps {
    match: {
        params: { id?: string };
    };
}

export default function MarketInfoPage({
    match: {
        params: { id },
    },
}: MarketInfoPageProps & RouteComponentProps<{ id?: string }>) {
    const { address: account } = useAccount();
    
    const [span, setSpan] = useState(ChartSpan.DAY);
    const [type, setType] = useState(ChartType.PRICE);
    
    const { 
        market, 
        marketLoading,
        marketError, 
        fetchMarket,
        outcomesPriceData,
        fetchOutcomesPriceData,
        priceDataLoading,
        priceDataError
    } = useMarketData(id);

    const startTimestamp = useMemo(() => {
        const now = dayjs();

        switch (span) {
            case ChartSpan.DAY:
                // Past 24 hours
                return now.subtract(24, "hour").unix();
            case ChartSpan.WEEK:
                // Past 7 days
                return now.subtract(7, "day").unix();
            case ChartSpan.MONTH:
                // Past 30 days
                return now.subtract(30, "day").unix();
        }
    }, [span]);

    // Only show price chart for market view - most relevant for prediction markets
    const chartTypes = [
        {
            type: ChartType.PRICE,
            title: t`Probability`,
        },
    ];

    const chartSpans = [
        {
            type: ChartSpan.DAY,
            title: t`Day`,
        },
        {
            type: ChartSpan.WEEK,
            title: t`Week`,
        },
        {
            type: ChartSpan.MONTH,
            title: t`Month`,
        },
    ];

    useEffect(() => {
        if (!id) return;
        fetchMarket(id);
    }, [id]);

    useEffect(() => {
        if (!id || !market) return;
        const endTimestamp = Math.floor(Date.now() / 1000); // Current time in unix
        fetchOutcomesPriceData(
            id, 
            startTimestamp, 
            endTimestamp,
            type,
            span,
            market
        );
    }, [id, market, span, type, startTimestamp, fetchOutcomesPriceData]);

    const validOutcomes = useMemo(() => {
        if (!market?.outcomes) return [];
        // Filter out invalid outcome (typically the last one)
        return market.outcomes.slice(0, -1);
    }, [market]);

    return (
        <div className="market-info-page mb-3">
            <NavLink className="f mb-1 c-p hover-op trans-op w-fc" to="/info/markets">
                <ArrowLeft className="mr-05" size="1rem" />
                <span>
                    <Trans>Back to markets</Trans>
                </span>
            </NavLink>
            
            {marketError ? (
                <Card classes="p-2 br-24 mxs_p-1">
                    <div className="error-message">
                        <div className="error-icon">⚠️</div>
                        <h3><Trans>Failed to load market</Trans></h3>
                        <p>{marketError}</p>
                        <button 
                            className="retry-button"
                            onClick={() => fetchMarket(id!)}
                        >
                            <Trans>Try Again</Trans>
                        </button>
                    </div>
                </Card>
            ) : market ? (
                <Card classes="p-2 br-24 mxs_p-1">
                    <MarketInfoHeader 
                        market={market}
                        validOutcomes={validOutcomes}
                    />
                    
                    <MarketInfoStats
                        market={market}
                        refreshHandler={() => {
                            fetchMarket(id!);
                        }}
                        isLoading={false}
                    />
                    
                    <div className="market-chart-wrapper br-12 ph-1 pb-1 mt-1">
                        <div className="market-chart__toolbar">
                            <div className="chart-header">
                                <h3 className="chart-title">{t`Outcome Probabilities`}</h3>
                            </div>
                            <div className="chart-span-selector">
                                {chartSpans.map((chartSpan) => (
                                    <button
                                        key={chartSpan.type}
                                        className={`chart-span-btn ${span === chartSpan.type ? 'active' : ''}`}
                                        onClick={() => setSpan(chartSpan.type)}
                                    >
                                        {chartSpan.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {priceDataError ? (
                            <div className="chart-error">
                                <div className="error-icon">📊</div>
                                <p><Trans>Failed to load chart data</Trans></p>
                                <p className="error-detail">{priceDataError}</p>
                                <button 
                                    className="retry-button"
                                    onClick={() => {
                                        const endTimestamp = Math.floor(Date.now() / 1000);
                                        fetchOutcomesPriceData(
                                            id!, 
                                            startTimestamp, 
                                            endTimestamp,
                                            type,
                                            span,
                                            market
                                        );
                                    }}
                                >
                                    <Trans>Retry</Trans>
                                </button>
                            </div>
                        ) : (
                            <EnhancedMarketChart
                                market={market}
                                outcomes={validOutcomes}
                                data={outcomesPriceData}
                                loading={priceDataLoading}
                                span={span}
                                type={type}
                            />
                        )}
                    </div>
                </Card>
            ) : marketLoading ? (
                <Card classes="p-2 br-24 mxs_p-1">
                    <div className="mock-loader">
                        <Loader stroke="white" size="30px" />
                        <p className="loading-text">
                            <Trans>Loading market data...</Trans>
                        </p>
                    </div>
                </Card>
            ) : null}
        </div>
    );
}