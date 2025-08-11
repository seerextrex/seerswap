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
import { MarketOutcomesChart } from "./MarketOutcomesChart";
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
        fetchMarket,
        outcomesPriceData,
        fetchOutcomesPriceData,
        priceDataLoading
    } = useMarketData(id);

    const startTimestamp = useMemo(() => {
        const day = dayjs();

        switch (span) {
            case ChartSpan.DAY:
                return day.subtract(1, "day").unix();
            case ChartSpan.WEEK:
                return day.subtract(168 + day.hour(), "hour").unix();
            case ChartSpan.MONTH:
                if (day.month() === 2) {
                    return day.subtract(31, "day").unix();
                }
                return day.subtract(30 * 24 + day.hour(), "hour").unix();
        }
    }, [span]);

    const chartTypes = [
        {
            type: ChartType.PRICE,
            title: t`Price`,
        },
        {
            type: ChartType.VOLUME,
            title: t`Volume`,
        },
        {
            type: ChartType.TVL,
            title: t`TVL`,
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
        fetchOutcomesPriceData(
            id, 
            startTimestamp, 
            Math.floor(new Date().getTime() / 1000),
            type
        );
    }, [id, market, span, type]);

    const validOutcomes = useMemo(() => {
        if (!market?.outcomes) return [];
        // Filter out invalid outcome (typically the last one)
        return market.outcomes.slice(0, -1);
    }, [market]);

    return (
        <div className="market-info-page mb-3">
            <NavLink className="f mb-1 c-p hover-op trans-op w-fc" to="/markets">
                <ArrowLeft className="mr-05" size="1rem" />
                <span>
                    <Trans>Back to markets</Trans>
                </span>
            </NavLink>
            
            {market ? (
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
                        isLoading={marketLoading}
                    />
                    
                    <div className="market-chart-wrapper br-12 ph-1 pb-1 mt-1">
                        <div className="market-chart__toolbar">
                            <div className="chart-type-selector">
                                {chartTypes.map((chartType) => (
                                    <button
                                        key={chartType.type}
                                        className={`chart-type-btn ${type === chartType.type ? 'active' : ''}`}
                                        onClick={() => setType(chartType.type)}
                                    >
                                        {chartType.title}
                                    </button>
                                ))}
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
                        
                        <MarketOutcomesChart
                            market={market}
                            outcomes={validOutcomes}
                            data={outcomesPriceData}
                            loading={priceDataLoading}
                            span={span}
                            type={type}
                        />
                    </div>
                </Card>
            ) : (
                <div className="mock-loader">
                    <Loader stroke="white" size="30px" />
                </div>
            )}
        </div>
    );
}