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
import { ScalarMarketChart } from "./ScalarMarketChart";
import { SwapModule } from "./SwapModule";
import { ScalarMarketInterface } from "./ScalarMarketInterface";
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

    const [fetchAllTime, setFetchAllTime] = useState(false);
    
    const startTimestamp = useMemo(() => {
        const now = dayjs();

        // If fetching all time data, go back as far as possible
        if (fetchAllTime) {
            // Go back 5 years to capture all possible market data
            // Most prediction markets won't be older than this
            return now.subtract(5, "year").unix();
        }

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
    }, [span, fetchAllTime]);

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
    
    // Calculate weekly volume from pools data using pre-calculated values
    const marketWithWeeklyVolume = useMemo(() => {
        if (!market || !pools) return market;
        
        // Sum up pre-calculated weekly volume from all pools
        const volumeWeekly = pools.reduce((total: number, pool: any) => {
            return total + (pool.volumeWeekly || 0);
        }, 0);
        
        return {
            ...market,
            volumeWeekly
        };
    }, [market, pools]);
    
    // Check if this is a scalar UP/DOWN market
    const isScalarMarket = useMemo(() => {
        if (!market?.outcomes) return false;
        
        // Filter out Invalid result outcome
        const validOutcomes = market.outcomes.filter(o => !o.toLowerCase().includes('invalid'));
        const outcomesLower = validOutcomes.map(o => o.toLowerCase());
        
        // Check if we have exactly UP and DOWN (after filtering Invalid)
        const hasUpDown = outcomesLower.includes('up') && outcomesLower.includes('down') && validOutcomes.length === 2;
        
        if (!hasUpDown || !market.lowerBound || !market.upperBound) return false;
        
        // Check if bounds exist and are valid
        const rawLower = market.lowerBound;
        const rawUpper = market.upperBound;
        
        // Parse bounds - they might be BigInt strings or decimal strings
        const lower = rawLower ? parseFloat(rawLower) : null;
        const upper = rawUpper ? parseFloat(rawUpper) : null;
        
        // Only scale if the values are actually in wei format (very large integers)
        const looksLikeWei = (value: string | null | undefined): boolean => {
            if (!value) return false;
            return !value.includes('.') && value.length > 15;
        };
        
        const needsScaling = looksLikeWei(rawLower) || looksLikeWei(rawUpper);
        const scaledLower = needsScaling && lower !== null ? lower / 1e18 : lower;
        const scaledUpper = needsScaling && upper !== null ? upper / 1e18 : upper;
        
        const hasBounds = scaledLower !== null && scaledUpper !== null && 
                          (scaledLower !== 0 || scaledUpper !== 0) && 
                          scaledUpper > scaledLower;
        
        return hasUpDown && hasBounds;
    }, [market?.outcomes, market?.lowerBound, market?.upperBound]);

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
            ) : marketWithWeeklyVolume ? (
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
                                {marketWithWeeklyVolume.image?.[0]?.cidMarket && (
                                    <img 
                                        src={`https://ipfs.io${marketWithWeeklyVolume.image[0].cidMarket}`}
                                        alt={marketWithWeeklyVolume.marketName}
                                        className="market-hero-image"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                )}
                                <div className="market-title-block">
                                    <h1 className="market-title">{marketWithWeeklyVolume.marketName || marketWithWeeklyVolume.title}</h1>
                                    <div className="market-meta">
                                        {marketWithWeeklyVolume.category && (
                                            <span className="market-category">{marketWithWeeklyVolume.category}</span>
                                        )}
                                        <span className={`market-status ${marketWithWeeklyVolume.closed ? 'closed' : 'active'}`}>
                                            {marketWithWeeklyVolume.closed ? t`Closed` : t`Active`}
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
                                                    marketWithWeeklyVolume
                                                );
                                            }}
                                        >
                                            <Trans>Retry</Trans>
                                        </button>
                                    </div>
                                ) : isScalarMarket ? (
                                    <ScalarMarketChart
                                        market={marketWithWeeklyVolume}
                                        pools={pools || []}
                                        priceData={outcomesPriceData}
                                        loading={priceDataLoading}
                                        onTimeSpanChange={(span) => {
                                            if (span === 'all') {
                                                // For 'all', keep month span but set flag to fetch all data
                                                setFetchAllTime(true);
                                                setSpan(ChartSpan.MONTH);
                                            } else {
                                                setFetchAllTime(false);
                                                // Map to ChartSpan enum for data fetching
                                                const spanMap = {
                                                    'day': ChartSpan.DAY,
                                                    'week': ChartSpan.WEEK,
                                                    'month': ChartSpan.MONTH,
                                                };
                                                setSpan(spanMap[span as keyof typeof spanMap]);
                                            }
                                        }}
                                    />
                                ) : (
                                    <EnhancedMarketChart
                                        market={marketWithWeeklyVolume}
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
                                {isScalarMarket ? (
                                    <ScalarMarketInterface
                                        market={marketWithWeeklyVolume}
                                        pools={pools || []}
                                    />
                                ) : (
                                    <SwapModule
                                        market={marketWithWeeklyVolume}
                                        outcomes={validOutcomes}
                                        selectedOutcome={selectedOutcome}
                                        onOutcomeSelect={setSelectedOutcome}
                                        pools={pools}
                                    />
                                )}
                            </div>
                        </div>
                        
                        <div className="market-info-section">
                            <MarketInfoHeader 
                                market={marketWithWeeklyVolume}
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