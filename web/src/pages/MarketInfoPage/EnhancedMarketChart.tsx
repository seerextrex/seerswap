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
    market: any;
    outcomes: string[];
    data: any[];
    loading: boolean;
    span: number;
    type: ChartType;
    selectedOutcome?: number;
    onOutcomeSelect?: (index: number) => void;
}

// Premium color palette inspired by Apple and modern fintech
const OUTCOME_COLORS = [
    { 
        main: "#00C896", 
        gradient: "rgba(0, 200, 150, 0.1)",
        glow: "rgba(0, 200, 150, 0.4)",
        hover: "#00E5A8"
    }, // Teal
    { 
        main: "#FF6B6B", 
        gradient: "rgba(255, 107, 107, 0.1)",
        glow: "rgba(255, 107, 107, 0.4)",
        hover: "#FF8585"
    }, // Coral
    { 
        main: "#4ECDC4", 
        gradient: "rgba(78, 205, 196, 0.1)",
        glow: "rgba(78, 205, 196, 0.4)",
        hover: "#6EDDD5"
    }, // Mint
    { 
        main: "#FFD93D", 
        gradient: "rgba(255, 217, 61, 0.1)",
        glow: "rgba(255, 217, 61, 0.4)",
        hover: "#FFE366"
    }, // Gold
    { 
        main: "#6C5CE7", 
        gradient: "rgba(108, 92, 231, 0.1)",
        glow: "rgba(108, 92, 231, 0.4)",
        hover: "#8577FF"
    }, // Purple
    { 
        main: "#00B4D8", 
        gradient: "rgba(0, 180, 216, 0.1)",
        glow: "rgba(0, 180, 216, 0.4)",
        hover: "#00D4FF"
    }, // Sky Blue
    { 
        main: "#F72585", 
        gradient: "rgba(247, 37, 133, 0.1)",
        glow: "rgba(247, 37, 133, 0.4)",
        hover: "#FF4D9A"
    }, // Pink
    { 
        main: "#20BF55", 
        gradient: "rgba(32, 191, 85, 0.1)",
        glow: "rgba(32, 191, 85, 0.4)",
        hover: "#3DDB72"
    }, // Green
];

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

    const outcomeImages = useMemo(() => {
        if (!market?.image?.[0]?.cidOutcomes) return [];
        return outcomes.map((_, index) => {
            const imageUrl = market.image[0].cidOutcomes[index];
            return imageUrl ? `https://ipfs.io${imageUrl}` : null;
        });
    }, [market, outcomes]);
    const chartData = useMemo(() => {
        // Even if no data, we should still show all outcomes in the legend
        if (!outcomes || outcomes.length === 0) {
            return null;
        }
        
        // If no data yet, create empty datasets for all outcomes
        if (!data || data.length === 0) {
            const emptyDatasets = outcomes.map((outcome, index) => {
                const colorSet = OUTCOME_COLORS[index % OUTCOME_COLORS.length];
                return {
                    label: outcome,
                    data: [],
                    borderColor: colorSet.main,
                    backgroundColor: colorSet.gradient,
                    tension: 0.1,
                    borderWidth: 3,
                    pointRadius: 3,
                    pointHoverRadius: 3,
                    pointHoverBorderWidth: 2,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: colorSet.main,
                    pointBorderWidth: 2,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: colorSet.main,
                    fill: false,
                    cubicInterpolationMode: 'monotone' as const,
                    order: index + 1,
                    spanGaps: true,
                };
            });
            return {
                labels: [],
                datasets: emptyDatasets,
            };
        }

        // Group data by timestamp and round to nearest hour for day view
        const groupedData: { [key: string]: any } = {};
        const roundToHour = span === 0; // Round to hour for day view
        
        data.forEach((item) => {
            let timestamp = item.periodStartUnix * 1000;
            
            // Round to nearest hour for day view to group nearby data points
            if (roundToHour) {
                timestamp = Math.floor(timestamp / 3600000) * 3600000;
            }
            
            const dateKey = new Date(timestamp).toISOString();
            
            if (!groupedData[dateKey]) {
                groupedData[dateKey] = {
                    timestamp,
                    outcomes: {},
                };
            }
            
            if (item.outcomeIndex !== undefined) {
                // Keep the most recent price for each outcome at this timestamp
                // Prefer non-synthetic data over synthetic
                const existing = groupedData[dateKey].outcomes[item.outcomeIndex];
                const shouldUpdate = !existing || 
                    (!item.synthetic && existing.synthetic) || 
                    (item.synthetic === existing.synthetic && item.periodStartUnix > existing.originalTimestamp);
                    
                if (shouldUpdate) {
                    groupedData[dateKey].outcomes[item.outcomeIndex] = {
                        price: item.price || 0,
                        originalTimestamp: item.periodStartUnix,
                        synthetic: item.synthetic
                    };
                }
            }
        });

        // Sort timestamps
        const sortedEntries = Object.entries(groupedData).sort(
            ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
        );

        const labels = sortedEntries.map(([_, data]) => {
            const date = new Date(data.timestamp);
            if (span === 0) { // Day
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else if (span === 1) { // Week
                return date.toLocaleDateString([], { weekday: 'short', day: 'numeric' });
            } else { // Month
                return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
            }
        });

        // Check which outcomes have data
        const outcomesWithData = new Set<number>();
        data.forEach(item => {
            if (item.outcomeIndex !== undefined) {
                outcomesWithData.add(item.outcomeIndex);
            }
        });
        
        console.log('Creating datasets for outcomes:', outcomes);
        console.log('Outcomes with data:', Array.from(outcomesWithData));
        
        const datasets = outcomes.map((outcome, index) => {
            // Data should already be complete from the hook
            const hasData = outcomesWithData.has(index);
            const isSelected = selectedOutcome === index;
            
            const dataPoints = hasData ? sortedEntries.map(([_, groupData]) => {
                // Simply return the price, gaps should already be filled by the hook
                return groupData.outcomes[index]?.price || null;
            }) : [];

            const colorSet = OUTCOME_COLORS[index % OUTCOME_COLORS.length];

            return {
                label: outcome,
                data: dataPoints,
                borderColor: isSelected ? colorSet.hover : colorSet.main,
                backgroundColor: isSelected ? colorSet.glow : colorSet.gradient,
                tension: 0.1,
                borderWidth: isSelected ? 4 : 2,
                pointRadius: isSelected ? 4 : 2,
                pointHoverRadius: isSelected ? 6 : 4,
                pointHoverBorderWidth: 2,
                pointBackgroundColor: '#fff',
                pointBorderColor: isSelected ? colorSet.hover : colorSet.main,
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: isSelected ? colorSet.hover : colorSet.main,
                fill: isSelected, // Fill only the selected outcome
                cubicInterpolationMode: 'monotone' as const,
                order: isSelected ? 0 : index + 1, // Bring selected to front
                spanGaps: true, // Connect line across null/undefined values
                hidden: false, // Always show in legend even if no data
            };
        });

        return {
            labels,
            datasets,
        };
    }, [data, outcomes, type, span, selectedOutcome]);

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
                                    const changeColor = change > 0 ? '🟢' : '🔴';
                                    changeInfo = `  ${changeColor} ${arrow} ${changeStr}%`;
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
            <div className="custom-legend">
                {outcomes.map((outcome, index) => {
                    const colorSet = OUTCOME_COLORS[index % OUTCOME_COLORS.length];
                    const isHovered = hoveredOutcome === index;
                    const isSelected = selectedOutcome === index;
                    const hasData = chartData?.datasets[index]?.data.some(d => d !== null);
                    const imageUrl = outcomeImages[index];
                    
                    return (
                        <div
                            key={index}
                            className={`legend-outcome ${
                                isSelected ? 'selected' : ''
                            } ${isHovered ? 'hovered' : ''} ${
                                !hasData ? 'no-data' : ''
                            }`}
                            onMouseEnter={() => setHoveredOutcome(index)}
                            onMouseLeave={() => setHoveredOutcome(null)}
                            onClick={() => onOutcomeSelect?.(index)}
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
                                <div className="outcome-indicator" />
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
                                            return lastPrice !== undefined
                                                ? `${(lastPrice * 100).toFixed(1)}%`
                                                : '--';
                                        })()}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="chart-container">
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