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
    
    // Calculate 24h volume from pools data using pre-calculated values
    const marketWith24hVolume = useMemo(() => {
        if (!market || !pools) return market;
        
        // Sum up pre-calculated 24h volume from all pools
        const volume24h = pools.reduce((total: number, pool: any) => {
            return total + (pool.volume24h || 0);
        }, 0);
        
        return {
            ...market,
            volume24h
        };
    }, [market, pools]);

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
            ) : marketWith24hVolume ? (
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
                                {marketWith24hVolume.image?.[0]?.cidMarket && (
                                    <img 
                                        src={`https://ipfs.io${marketWith24hVolume.image[0].cidMarket}`}
                                        alt={marketWith24hVolume.marketName}
                                        className="market-hero-image"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                )}
                                <div className="market-title-block">
                                    <h1 className="market-title">{marketWith24hVolume.marketName || marketWith24hVolume.title}</h1>
                                    <div className="market-meta">
                                        {marketWith24hVolume.category && (
                                            <span className="market-category">{marketWith24hVolume.category}</span>
                                        )}
                                        <span className={`market-status ${marketWith24hVolume.closed ? 'closed' : 'active'}`}>
                                            {marketWith24hVolume.closed ? t`Closed` : t`Active`}
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
                                                    marketWith24hVolume
                                                );
                                            }}
                                        >
                                            <Trans>Retry</Trans>
                                        </button>
                                    </div>
                                ) : (
                                    <EnhancedMarketChart
                                        market={marketWith24hVolume}
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
                                    market={marketWith24hVolume}
                                    outcomes={validOutcomes}
                                    selectedOutcome={selectedOutcome}
                                    onOutcomeSelect={setSelectedOutcome}
                                    pools={pools}
                                />
                            </div>
                        </div>
                        
                        <div className="market-info-section">
                            <MarketInfoHeader 
                                market={marketWith24hVolume}
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