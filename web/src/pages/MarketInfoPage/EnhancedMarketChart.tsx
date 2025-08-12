import { FC, useMemo, useState, useCallback, useRef, useEffect } from "react";
import { t, Trans } from "@lingui/macro";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    Filler,
    TooltipItem,
    LegendItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ChartType, ChartSpan } from "../../models/enums";
import Loader from "../../components/Loader";
import { Market, MarketDataPoint, ChartData } from "./types";
import { processChartData, OUTCOME_COLORS } from "./chartHelpers";
import "./EnhancedMarketChart.scss";

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

interface EnhancedMarketChartProps {
    market: Market;
    outcomes: string[];
    data: MarketDataPoint[];
    loading: boolean;
    error?: Error | null;
    span: number;
    type: ChartType;
    selectedOutcome?: number;
    onOutcomeSelect?: (index: number) => void;
    onTimeSpanChange?: (span: number) => void;
}

export const EnhancedMarketChart: FC<EnhancedMarketChartProps> = ({
    market,
    outcomes,
    data,
    loading,
    error,
    span,
    type,
    selectedOutcome,
    onOutcomeSelect,
    onTimeSpanChange,
}) => {
    const [hoveredOutcome, setHoveredOutcome] = useState<number | null>(null);
    const [outcomeImageErrors, setOutcomeImageErrors] = useState<{ [key: number]: boolean }>({});
    const [hoveredDataPoint, setHoveredDataPoint] = useState<{x: number, y: number, value: number, label: string, dataIndex: number} | null>(null);
    const [liveOutcomePrices, setLiveOutcomePrices] = useState<{ [key: number]: number | null }>({});
    const chartRef = useRef<ChartJS<"line", number[], string>>(null);
    const hoverUpdateRef = useRef<number>();
    
    // Cleanup RAF on unmount
    useEffect(() => {
        return () => {
            if (hoverUpdateRef.current) {
                cancelAnimationFrame(hoverUpdateRef.current);
            }
        };
    }, []);

    const handleOutcomeImageError = useCallback((index: number) => {
        setOutcomeImageErrors(prev => ({ ...prev, [index]: true }));
    }, []);

    const handleOutcomeClick = useCallback((index: number, hasData: boolean) => {
        if (hasData && onOutcomeSelect) {
            onOutcomeSelect(index);
        }
    }, [onOutcomeSelect]);

    const outcomeImages = useMemo(() => {
        if (!market?.image?.[0]?.cidOutcomes) return [];
        return outcomes.map((_, index) => {
            const imageUrl = market.image![0].cidOutcomes![index];
            return imageUrl ? `https://ipfs.io${imageUrl}` : null;
        });
    }, [market, outcomes]);

    const chartData = useMemo(() => 
        processChartData(data, outcomes, span, selectedOutcome),
        [data, outcomes, span, selectedOutcome]
    );

    // Get dynamic title content
    const getDynamicTitle = () => {
        if (hoveredDataPoint && data[hoveredDataPoint.dataIndex]) {
            const dataPoint = data[hoveredDataPoint.dataIndex];
            const date = new Date(dataPoint.periodStartUnix * 1000);
            const formattedDate = date.toLocaleString([], { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            return {
                title: formattedDate,
                subtitle: 'Market prices at this time',
                prices: Object.keys(liveOutcomePrices).map(idx => ({
                    name: outcomes[parseInt(idx)],
                    price: liveOutcomePrices[parseInt(idx)],
                    color: OUTCOME_COLORS[parseInt(idx) % OUTCOME_COLORS.length].main
                }))
            };
        }
        
        if (selectedOutcome !== undefined) {
            const dataset = chartData?.datasets[selectedOutcome];
            if (dataset) {
                const lastPrice = dataset.data.filter(d => d !== null).slice(-1)[0];
                return {
                    title: outcomes[selectedOutcome],
                    subtitle: lastPrice ? `${(lastPrice * 100).toFixed(1)}% probability` : 'No recent data',
                    prices: []
                };
            }
        }
        
        return {
            title: "Market History",
            subtitle: "Real-time prediction market data",
            prices: []
        };
    };
    
    const dynamicContent = getDynamicTitle();

    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
            axis: 'x',
        },
        animation: {
            duration: 800,
            easing: 'easeInOutQuart',
            delay: (context) => {
                let delay = 0;
                if (context.type === 'data' && context.mode === 'default') {
                    delay = context.dataIndex * 15 + context.datasetIndex * 100;
                }
                return delay;
            },
        },
        plugins: {
            legend: {
                display: false, // We'll create a custom legend
            },
            title: {
                display: false,
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(10, 10, 15, 0.95)',
                titleColor: 'rgba(255, 255, 255, 0.9)',
                bodyColor: 'rgba(255, 255, 255, 0.85)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 20,
                bodySpacing: 16,
                titleFont: {
                    size: 13,
                    weight: 600 as const,
                    family: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
                },
                bodyFont: {
                    size: 14,
                    weight: 500 as const,
                    family: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Mono", monospace',
                },
                cornerRadius: 20,
                displayColors: true,
                boxPadding: 8,
                caretSize: 0,
                caretPadding: 16,
                callbacks: {
                    title: (items) => {
                        if (!items.length) return '';
                        const date = new Date(data[items[0].dataIndex]?.periodStartUnix * 1000);
                        const now = new Date();
                        const diffHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
                        
                        if (diffHours < 1) {
                            const diffMinutes = Math.floor(diffHours * 60);
                            return `${diffMinutes} minutes ago`;
                        } else if (diffHours < 24) {
                            return `${Math.floor(diffHours)} hours ago`;
                        }
                        
                        return date.toLocaleString([], { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        });
                    },
                    label: (context) => {
                        const label = context.dataset.label || "";
                        const currentValue = context.parsed.y;
                        const percentage = (currentValue * 100).toFixed(2);
                        
                        // Calculate change from previous point
                        const dataIndex = context.dataIndex;
                        const dataset = context.dataset;
                        let changeInfo = '';
                        let trendEmoji = '';
                        
                        if (dataIndex > 0 && dataset.data) {
                            const prevValue = dataset.data[dataIndex - 1] as number;
                            if (prevValue !== null && prevValue !== undefined) {
                                const change = (currentValue - prevValue) * 100;
                                const changeAbs = Math.abs(change);
                                
                                if (changeAbs >= 0.01) {
                                    const changeStr = changeAbs.toFixed(2);
                                    if (change > 0) {
                                        changeInfo = `+${changeStr}%`;
                                        trendEmoji = '📈';
                                    } else {
                                        changeInfo = `-${changeStr}%`;
                                        trendEmoji = '📉';
                                    }
                                } else {
                                    trendEmoji = '➡️';
                                }
                            }
                        }
                        
                        return [
                            `${trendEmoji} ${label}`,
                            `${percentage}%`,
                            changeInfo
                        ].filter(Boolean);
                    },
                    afterLabel: () => {
                        // Add visual separator between outcomes
                        return '';
                    },
                },
                animation: {
                    duration: 200,
                    easing: 'easeOutQuart',
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: 'rgba(255, 255, 255, 0.03)',
                    lineWidth: 1,
                    drawTicks: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    maxTicksLimit: 6,
                    maxRotation: 0,
                    autoSkip: true,
                    color: 'rgba(255, 255, 255, 0.4)',
                    padding: 12,
                    font: {
                        size: 11,
                        weight: 500 as const,
                        family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                    },
                },
            },
            y: {
                position: 'right',
                grid: {
                    color: (context) => {
                        if (context.tick.value === 0.5) {
                            return 'rgba(255, 255, 255, 0.08)';
                        }
                        return 'rgba(255, 255, 255, 0.04)';
                    },
                    lineWidth: (context) => {
                        if (context.tick.value === 0.5) {
                            return 2;
                        }
                        return 1;
                    },
                    drawTicks: false,
                },
                border: {
                    display: false,
                    dash: [5, 5],
                },
                ticks: {
                    padding: 12,
                    color: 'rgba(255, 255, 255, 0.4)',
                    font: {
                        size: 11,
                        weight: 500 as const,
                        family: '-apple-system, BlinkMacSystemFont, "SF Mono", monospace',
                    },
                    callback: function (value) {
                        const percent = Number(value) * 100;
                        if (percent === 50) {
                            return '50%';
                        }
                        return `${percent.toFixed(0)}%`;
                    },
                    count: 5,
                },
                beginAtZero: true,
                max: 1,
                min: 0,
            },
        },
        elements: {
            line: {
                borderJoinStyle: 'round' as const,
                borderCapStyle: 'round' as const,
                tension: 0.35,
            },
            point: {
                hitRadius: 10,
                hoverRadius: 6,
                radius: 0,
                hoverBorderWidth: 3,
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 0,
            },
        },
        onHover: (event, activeElements) => {
            // Use RAF for smooth hover updates
            if (hoverUpdateRef.current) {
                cancelAnimationFrame(hoverUpdateRef.current);
            }
            
            hoverUpdateRef.current = requestAnimationFrame(() => {
                if (activeElements.length > 0) {
                    const element = activeElements[0];
                    const datasetIndex = element.datasetIndex;
                    const dataIndex = element.index;
                    const dataset = chartData?.datasets[datasetIndex];
                    
                    if (dataset && chartData?.datasets) {
                        const value = dataset.data[dataIndex] as number;
                        const label = dataset.label || '';
                        
                        // Update hovered data point
                        setHoveredDataPoint({
                            x: element.element.x,
                            y: element.element.y,
                            value,
                            label,
                            dataIndex
                        });
                        
                        // Update live prices for all outcomes at this data point
                        const newPrices: { [key: number]: number | null } = {};
                        chartData.datasets.forEach((ds, idx) => {
                            const priceAtPoint = ds.data[dataIndex] as number | null;
                            newPrices[idx] = priceAtPoint;
                        });
                        setLiveOutcomePrices(newPrices);
                    }
                } else {
                    setHoveredDataPoint(null);
                    setLiveOutcomePrices({});
                }
            });
        },
    };

    if (loading) {
        return (
            <div className="enhanced-chart-loading">
                <Loader stroke="white" size="30px" />
                <span className="loading-text">
                    <Trans>Loading chart data...</Trans>
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="enhanced-chart-error">
                <div className="error-icon">⚠️</div>
                <div className="error-message">
                    <Trans>Failed to load chart data</Trans>
                </div>
                <div className="error-details">
                    {error.message || t`Please try again later`}
                </div>
            </div>
        );
    }

    if (!chartData) {
        return (
            <div className="enhanced-chart-empty">
                <div className="empty-icon">📊</div>
                <Trans>No chart data available</Trans>
            </div>
        );
    }

    return (
        <div className="enhanced-market-chart">
            {/* Time Range Selector */}
            <div className="chart-time-selector">
                <button 
                    className={`time-btn ${span === ChartSpan.DAY ? 'active' : ''}`}
                    onClick={() => onTimeSpanChange?.(ChartSpan.DAY)}
                    aria-label="Show 1 day of data"
                >
                    1D
                </button>
                <button 
                    className={`time-btn ${span === ChartSpan.WEEK ? 'active' : ''}`}
                    onClick={() => onTimeSpanChange?.(ChartSpan.WEEK)}
                    aria-label="Show 1 week of data"
                >
                    1W
                </button>
                <button 
                    className={`time-btn ${span === ChartSpan.MONTH ? 'active' : ''}`}
                    onClick={() => onTimeSpanChange?.(ChartSpan.MONTH)}
                    aria-label="Show 1 month of data"
                >
                    1M
                </button>
                <button className="time-btn" disabled aria-label="3 months - coming soon">3M</button>
                <button className="time-btn" disabled aria-label="1 year - coming soon">1Y</button>
                <button className="time-btn" disabled aria-label="All data - coming soon">ALL</button>
            </div>
            
            {/* Outcome Legend */}
            <div className="outcome-legend" role="group" aria-label={t`Market outcome selection`}>
                {outcomes.map((outcome, index) => {
                    const colorSet = OUTCOME_COLORS[index % OUTCOME_COLORS.length];
                    const isHovered = hoveredOutcome === index;
                    const isSelected = selectedOutcome === index;
                    const hasData = chartData?.datasets[index]?.data.some(d => d !== null);
                    const imageUrl = outcomeImages[index];
                    
                    return (
                        <button
                            key={index}
                            className={`legend-item ${isSelected ? 'selected' : ''} ${!hasData ? 'no-data' : ''}`}
                            onClick={() => handleOutcomeClick(index, hasData || false)}
                            disabled={!hasData}
                            aria-pressed={isSelected}
                            aria-label={`${outcome} - ${chartData?.datasets[index] ? (() => {
                                const dataset = chartData.datasets[index];
                                const lastPrice = dataset.data.filter(d => d !== null).slice(-1)[0];
                                return lastPrice !== undefined ? `${(lastPrice * 100).toFixed(1)}%` : 'No data';
                            })() : 'No data'}`}
                        >
                            <span className="legend-color" style={{ backgroundColor: colorSet.main }} />
                            <span className="legend-name">{outcome}</span>
                            {chartData?.datasets[index] && (() => {
                                const dataset = chartData.datasets[index];
                                const lastPrice = dataset.data.filter(d => d !== null).slice(-1)[0];
                                if (lastPrice === undefined) return null;
                                return (
                                    <span className="legend-price">
                                        {`${(lastPrice * 100).toFixed(1)}%`}
                                    </span>
                                );
                            })()}
                        </button>
                    );
                })}
            </div>
            
            {/* Chart Container with Dynamic Info */}
            <div className="chart-wrapper">
                {/* Dynamic Info Display */}
                {hoveredDataPoint && dynamicContent.prices.length > 0 && (
                    <div className="chart-info-overlay">
                        <div className="info-timestamp">
                            {dynamicContent.subtitle}
                        </div>
                        <div className="info-prices">
                            {dynamicContent.prices.map((priceData, idx) => (
                                <div key={idx} className="price-item">
                                    <span className="price-dot" style={{ backgroundColor: priceData.color }} />
                                    <span className="price-name">{priceData.name}:</span>
                                    <span className="price-value">
                                        {priceData.price !== null ? `${(priceData.price * 100).toFixed(1)}%` : '--'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="chart-container" role="img" aria-label={t`Line chart showing market outcome probabilities`}>
                    <Line ref={chartRef} data={chartData} options={options} />
                </div>
            </div>
        </div>
    );
};