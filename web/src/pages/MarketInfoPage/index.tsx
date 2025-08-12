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
import { SwapModule } from "./SwapModule";
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
    
    const [span, setSpan] = useState(ChartSpan.MONTH);
    const [type, setType] = useState(ChartType.PRICE);
    const [selectedOutcome, setSelectedOutcome] = useState<number>(0);
    
    const { 
        market,
        pools,
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
            {marketError ? (
                <Card classes="p-2 br-24 mxs_p-1">
                    <div className="error-message">
                        <div className="error-icon">⚠️</div>
                        <h3><Trans>Failed to load market</Trans></h3>
                        <p>{marketError}</p>
                        <button 
                            className="retry-button"
                            onClick={() => fetchMarket(id!)}
                            aria-label="Retry loading market data"
                        >
                            <Trans>Try Again</Trans>
                        </button>
                    </div>
                </Card>
            ) : market ? (
                <>
                    <div className="market-hero-section">
                        <div className="market-hero-header">
                            <NavLink 
                                className="back-button" 
                                to="/info/markets"
                                aria-label="Navigate back to markets list"
                            >
                                <ArrowLeft size="20" />
                            </NavLink>
                            <div className="market-identity">
                                {market.image?.[0]?.cidMarket && (
                                    <img 
                                        src={`https://ipfs.io${market.image[0].cidMarket}`}
                                        alt={market.marketName}
                                        className="market-hero-image"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                )}
                                <div className="market-title-block">
                                    <h1 className="market-title">{market.marketName || market.title}</h1>
                                    <div className="market-meta">
                                        {market.category && (
                                            <span className="market-category">{market.category}</span>
                                        )}
                                        <span className={`market-status ${market.closed ? 'closed' : 'active'}`}>
                                            {market.closed ? t`Closed` : t`Active`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="market-main-content">
                        <div className="market-trading-section">
                            <div className="chart-container">
                                {priceDataError ? (
                                    <div className="chart-error-state">
                                        <p><Trans>Unable to load chart</Trans></p>
                                        <button 
                                            className="retry-btn"
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
                                        selectedOutcome={selectedOutcome}
                                        onOutcomeSelect={setSelectedOutcome}
                                        onTimeSpanChange={setSpan}
                                    />
                                )}
                            </div>
                            
                            <div className="swap-container">
                                <SwapModule
                                    market={market}
                                    outcomes={validOutcomes}
                                    selectedOutcome={selectedOutcome}
                                    onOutcomeSelect={setSelectedOutcome}
                                    pools={pools}
                                />
                            </div>
                        </div>
                        
                        <div className="market-info-section">
                            <MarketInfoHeader 
                                market={market}
                                validOutcomes={validOutcomes}
                                compact={true}
                            />
                        </div>
                    </div>
                </>
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