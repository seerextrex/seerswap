import { FC, useMemo, useState, useCallback } from "react";
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
import { ChartType } from "../../models/enums";
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
    span: number;
    type: ChartType;
    selectedOutcome?: number;
    onOutcomeSelect?: (index: number) => void;
}

export const EnhancedMarketChart: FC<EnhancedMarketChartProps> = ({
    market,
    outcomes,
    data,
    loading,
    span,
    type,
    selectedOutcome,
    onOutcomeSelect,
}) => {
    const [hoveredOutcome, setHoveredOutcome] = useState<number | null>(null);
    const [outcomeImageErrors, setOutcomeImageErrors] = useState<{ [key: number]: boolean }>({});

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

    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
            axis: 'x',
        },
        animation: false,
        plugins: {
            legend: {
                display: false, // We'll create a custom legend
            },
            title: {
                display: false,
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleColor: '#fff',
                bodyColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                padding: 16,
                bodySpacing: 12,
                titleFont: {
                    size: 14,
                    weight: 600 as const,
                    family: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                },
                bodyFont: {
                    size: 13,
                    weight: 500 as const,
                    family: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                },
                cornerRadius: 16,
                displayColors: true,
                boxPadding: 6,
                caretSize: 8,
                caretPadding: 10,
                callbacks: {
                    title: (items) => {
                        if (!items.length) return '';
                        const date = new Date(data[items[0].dataIndex]?.periodStartUnix * 1000);
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
                        
                        if (dataIndex > 0 && dataset.data) {
                            const prevValue = dataset.data[dataIndex - 1] as number;
                            if (prevValue !== null && prevValue !== undefined) {
                                const change = (currentValue - prevValue) * 100;
                                const changeAbs = Math.abs(change);
                                
                                if (changeAbs >= 0.01) { // Only show if change is meaningful
                                    const arrow = change > 0 ? '↑' : '↓';
                                    const changeStr = changeAbs.toFixed(2);
                                    changeInfo = `  ${arrow} ${changeStr}%`;
                                }
                            }
                        }
                        
                        return [
                            `${label}`,
                            `${percentage}%${changeInfo}`
                        ];
                    },
                    afterLabel: () => {
                        // Add visual separator between outcomes
                        return '';
                    },
                },
                animation: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: 'rgba(255, 255, 255, 0.02)',
                    lineWidth: 0.5,
                },
                border: {
                    display: false,
                },
                ticks: {
                    maxTicksLimit: 8,
                    maxRotation: 0,
                    autoSkip: true,
                    color: 'rgba(255, 255, 255, 0.5)',
                    font: {
                        size: 11,
                        weight: 400 as const,
                    },
                },
            },
            y: {
                position: 'right',
                grid: {
                    color: 'rgba(255, 255, 255, 0.08)',
                    lineWidth: 1,
                },
                border: {
                    display: false,
                },
                ticks: {
                    padding: 8,
                    color: 'rgba(255, 255, 255, 0.5)',
                    font: {
                        size: 11,
                        weight: 400 as const,
                    },
                    callback: function (value) {
                        // Show with more precision for small changes
                        return `${(Number(value) * 100).toFixed(1)}%`;
                    },
                },
                beginAtZero: true,
                max: 1,
                min: 0,
                suggestedMin: 0,
                suggestedMax: 1,
            },
        },
        elements: {
            line: {
                borderJoinStyle: 'round' as const,
                borderCapStyle: 'round' as const,
            },
            point: {
                hitRadius: 8,
                hoverRadius: 3,
                radius: 3,
                rotation: 0,
            },
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
            {/* Custom Legend with Outcome Images */}
            <div className="custom-legend" role="group" aria-label={t`Market outcome selection`}>
                {outcomes.map((outcome, index) => {
                    const colorSet = OUTCOME_COLORS[index % OUTCOME_COLORS.length];
                    const isHovered = hoveredOutcome === index;
                    const isSelected = selectedOutcome === index;
                    const hasData = chartData?.datasets[index]?.data.some(d => d !== null);
                    const imageUrl = outcomeImages[index];
                    
                    return (
                        <button
                            key={index}
                            className={`legend-outcome ${
                                isSelected ? 'selected' : ''
                            } ${isHovered ? 'hovered' : ''} ${
                                !hasData ? 'no-data' : ''
                            }`}
                            onMouseEnter={() => setHoveredOutcome(index)}
                            onMouseLeave={() => setHoveredOutcome(null)}
                            onClick={() => handleOutcomeClick(index, hasData || false)}
                            disabled={!hasData}
                            aria-pressed={isSelected}
                            aria-label={`${outcome} - ${
                                chartData && chartData.datasets[index] 
                                    ? (() => {
                                        const dataset = chartData.datasets[index];
                                        const lastPrice = dataset.data
                                            .filter(d => d !== null)
                                            .slice(-1)[0];
                                        return lastPrice !== undefined
                                            ? `${(lastPrice * 100).toFixed(1)}%`
                                            : 'No data';
                                    })()
                                    : 'No data'
                            }`}
                            style={{
                                '--outcome-color': colorSet.main,
                                '--outcome-hover': colorSet.hover,
                                '--outcome-glow': colorSet.glow,
                            } as any}
                        >
                            <div className="outcome-image-wrapper">
                                {imageUrl && !outcomeImageErrors[index] ? (
                                    <img
                                        src={imageUrl}
                                        alt={outcome}
                                        className="outcome-image"
                                        onError={() => handleOutcomeImageError(index)}
                                    />
                                ) : (
                                    <div className="outcome-image-placeholder">
                                        <span>{outcome.charAt(0).toUpperCase()}</span>
                                    </div>
                                )}
                                <div className="outcome-indicator" aria-hidden="true" />
                            </div>
                            <div className="outcome-info">
                                <span className="outcome-name">{outcome}</span>
                                {chartData && chartData.datasets[index] && (
                                    <span className="outcome-price">
                                        {(() => {
                                            const dataset = chartData.datasets[index];
                                            const lastPrice = dataset.data
                                                .filter(d => d !== null)
                                                .slice(-1)[0];
                                            if (lastPrice === undefined) return '--';
                                            
                                            // Calculate change indicator
                                            const prices = dataset.data.filter(d => d !== null) as number[];
                                            if (prices.length > 1) {
                                                const prevPrice = prices[prices.length - 2];
                                                const change = lastPrice - prevPrice;
                                                const changeSymbol = change > 0 ? (
                                                    <span className="price-change up" aria-label="increasing">↑</span>
                                                ) : change < 0 ? (
                                                    <span className="price-change down" aria-label="decreasing">↓</span>
                                                ) : null;
                                                
                                                return (
                                                    <>
                                                        {`${(lastPrice * 100).toFixed(1)}%`}
                                                        {changeSymbol}
                                                    </>
                                                );
                                            }
                                            
                                            return `${(lastPrice * 100).toFixed(1)}%`;
                                        })()}
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
            
            <div className="chart-container" role="img" aria-label={t`Line chart showing the price history of market outcomes`}>
                <Line data={chartData} options={options} />
            </div>
            
            <div className="chart-insight">
                <div className="insight-text">
                    <Trans>
                        Market sentiment visualization • Hover over data points for detailed price movements
                    </Trans>
                </div>
            </div>
        </div>
    );
};