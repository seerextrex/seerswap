import React, { FC, useMemo, useState, useEffect, useRef } from "react";
import { Trans, t } from "@lingui/macro";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartOptions,
} from "chart.js";
import { Market, Pool } from "../../utils/market";
import { calculateScalarMarketEstimate } from "../../utils/marketPrices";
import { MarketDataPoint } from "./types";
import { 
    processPriceHistory, 
    splitDataByInterpolation, 
    formatChartTimestamp 
} from "../../utils/chartDataProcessing";
import "./ScalarMarketChart.scss";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface ScalarMarketChartProps {
    market: Market;
    pools: Pool[];
    priceData: MarketDataPoint[];
    loading?: boolean;
    onTimeSpanChange?: (span: 'day' | 'week' | 'month' | 'all') => void;
}

type TimeSpan = 'day' | 'week' | 'month' | 'all';

export const ScalarMarketChart: FC<ScalarMarketChartProps> = ({
    market,
    pools,
    priceData,
    loading,
    onTimeSpanChange
}) => {
    const [selectedTimeSpan, setSelectedTimeSpan] = useState<TimeSpan>('month');
    const [allTimeData, setAllTimeData] = useState<MarketDataPoint[] | null>(null);
    
    // Get current market estimate for reference
    const currentEstimate = useMemo(() => {
        return calculateScalarMarketEstimate(pools, market);
    }, [pools, market]);

    // Cache all-time data when it's loaded
    useEffect(() => {
        if (selectedTimeSpan === 'all' && priceData && priceData.length > 0) {
            setAllTimeData(priceData);
        }
    }, [selectedTimeSpan, priceData]);

    // Handle timespan change
    // Strategy: Fetch all-time data once, then filter client-side for better performance
    // Only trigger new fetch when switching to 'all' for the first time
    const handleTimeSpanChange = (span: TimeSpan) => {
        setSelectedTimeSpan(span);
        
        // Only fetch new data when switching to 'all' and we don't have it cached
        if (onTimeSpanChange && span === 'all' && !allTimeData) {
            onTimeSpanChange(span);
        }
    };

    // Filter data based on selected timespan
    // Using client-side filtering for instant updates without server round-trips
    // This provides better UX as users can quickly switch between timescales
    const filteredPriceData = useMemo(() => {
        // Prefer cached all-time data if available for complete dataset
        const dataToFilter = allTimeData || priceData;
        
        if (!dataToFilter) return null;
        
        // For 'all', use complete dataset without filtering
        if (selectedTimeSpan === 'all') {
            return dataToFilter;
        }
        
        // Apply client-side time filtering for day/week/month views
        const now = Date.now() / 1000; // Current time in seconds
        let cutoffTime = now;
        
        switch (selectedTimeSpan) {
            case 'day':
                cutoffTime = now - (24 * 60 * 60); // 24 hours ago
                break;
            case 'week':
                cutoffTime = now - (7 * 24 * 60 * 60); // 7 days ago
                break;
            case 'month':
                cutoffTime = now - (30 * 24 * 60 * 60); // 30 days ago
                break;
        }
        
        return dataToFilter.filter(point => point.periodStartUnix >= cutoffTime);
    }, [priceData, allTimeData, selectedTimeSpan]);

    // Keep previous chart data to prevent flashing
    const previousChartDataRef = useRef<any>(null);
    
    // Transform price data to market estimates over time
    const chartData = useMemo(() => {
        if (!filteredPriceData || !currentEstimate || filteredPriceData.length === 0) {
            // Return previous data instead of null to prevent chart disappearing
            return previousChartDataRef.current;
        }

        // Use utility function to process price history with forward-filling
        const estimates = processPriceHistory(filteredPriceData, currentEstimate);

        if (estimates.length === 0) return null;
        
        // Split data into real and interpolated datasets for different styling
        const { realData, interpolatedData } = splitDataByInterpolation(estimates);

        const newChartData = {
            labels: estimates.map(p => formatChartTimestamp(p.timestamp)),
            datasets: [
                {
                    label: 'Market Estimate',
                    data: realData,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'transparent',
                    borderWidth: 2.5,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointBackgroundColor: '#8b5cf6',
                    pointBorderColor: '#1a1b3a',
                    pointBorderWidth: 2,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#8b5cf6',
                    tension: 0.4,
                    fill: {
                        target: 'origin',
                        above: 'rgba(139, 92, 246, 0.08)',
                    },
                    spanGaps: false,
                },
                {
                    label: 'Interpolated',
                    data: interpolatedData,
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [8, 6],
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    pointHitRadius: 0,
                    tension: 0.4,
                    fill: false,
                    spanGaps: true,
                }
            ]
        };
        
        // Store this chart data for next time
        previousChartDataRef.current = newChartData;
        return newChartData;
    }, [filteredPriceData, currentEstimate]);

    const chartOptions: ChartOptions<'line'> = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        animation: false, // Completely disable all animations
        animations: {
            colors: false,
            x: false,
            y: false,
        },
        transitions: {
            active: {
                animation: {
                    duration: 0
                }
            },
            resize: {
                animation: {
                    duration: 0
                }
            },
            show: {
                animations: {
                    colors: false,
                    x: false,
                    y: false,
                }
            },
            hide: {
                animations: {
                    colors: false,
                    x: false,
                    y: false,
                }
            }
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        elements: {
            point: {
                radius: 0,
                hoverRadius: 5,
            },
            line: {
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
            }
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(26, 27, 58, 0.95)',
                titleColor: 'rgba(255, 255, 255, 0.9)',
                bodyColor: 'rgba(255, 255, 255, 0.8)',
                borderColor: 'rgba(139, 92, 246, 0.2)',
                borderWidth: 1,
                padding: 14,
                cornerRadius: 12,
                displayColors: false,
                titleFont: {
                    size: 12,
                    weight: 500 as const,
                },
                bodyFont: {
                    size: 14,
                    weight: 600 as const,
                },
                callbacks: {
                    title: (tooltipItems) => {
                        return tooltipItems[0].label || '';
                    },
                    label: (context) => {
                        const value = context.parsed.y;
                        return value.toFixed(2);
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.4)',
                    font: {
                        size: 11,
                        family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
                    },
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 5,
                    padding: 8,
                },
            },
            y: {
                min: currentEstimate?.lower || 0,
                max: currentEstimate?.upper || 100,
                grid: {
                    color: 'rgba(255, 255, 255, 0.03)',
                    drawBorder: false,
                    lineWidth: 1,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.4)',
                    font: {
                        size: 11,
                        family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
                    },
                    padding: 12,
                    callback: function(value) {
                        return (value as number).toFixed(0);
                    },
                },
            },
        },
    }), [currentEstimate]);

    // Only show loading on initial load, not when switching timescales
    if (loading && !previousChartDataRef.current) {
        return (
            <div className="scalar-market-chart loading">
                <div className="chart-header">
                    <h3><Trans>Market Estimate History</Trans></h3>
                </div>
                <div className="loading-skeleton">
                    <div className="skeleton-pulse" />
                </div>
            </div>
        );
    }

    if ((!chartData && !previousChartDataRef.current) || !currentEstimate) {
        return (
            <div className="scalar-market-chart empty">
                <div className="chart-header">
                    <h3><Trans>Market Estimate History</Trans></h3>
                </div>
                <div className="empty-state">
                    <Trans>No price data available</Trans>
                </div>
            </div>
        );
    }

    const timeSpans: { value: TimeSpan; label: string }[] = [
        { value: 'day', label: t`1D` },
        { value: 'week', label: t`1W` },
        { value: 'month', label: t`1M` },
        { value: 'all', label: t`All` }
    ];

    return (
        <div className="scalar-market-chart">
            <div className="chart-header">
                <div className="header-top">
                    <div className="header-content">
                        <h3><Trans>Market Estimate History</Trans></h3>
                        <div className="current-value">
                            <span className="label"><Trans>Current:</Trans></span>
                            <span className="value">{currentEstimate.current.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="timespan-selector">
                        {timeSpans.map(({ value, label }) => (
                            <button
                                key={value}
                                className={`timespan-button ${selectedTimeSpan === value ? 'active' : ''}`}
                                onClick={() => handleTimeSpanChange(value)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="chart-range">
                    <span className="range-label"><Trans>Range:</Trans></span>
                    <span className="range-values">
                        {currentEstimate.lower} - {currentEstimate.upper}
                    </span>
                </div>
            </div>
            
            <div className="chart-container">
                {chartData && (
                    <Line 
                        key="market-estimate-chart" // Stable key
                        data={chartData} 
                        options={chartOptions}
                        updateMode="none" // Prevent any animations or transitions
                        datasetIdKey="label" // Use label as dataset key for stability
                    />
                )}
            </div>

        </div>
    );
};