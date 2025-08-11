import { FC, useMemo, useState } from "react";
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
}

// Premium color palette inspired by Apple and modern fintech
const OUTCOME_COLORS = [
    { main: "#00C896", gradient: "rgba(0, 200, 150, 0.1)" }, // Teal
    { main: "#FF6B6B", gradient: "rgba(255, 107, 107, 0.1)" }, // Coral
    { main: "#4ECDC4", gradient: "rgba(78, 205, 196, 0.1)" }, // Mint
    { main: "#FFD93D", gradient: "rgba(255, 217, 61, 0.1)" }, // Gold
    { main: "#6C5CE7", gradient: "rgba(108, 92, 231, 0.1)" }, // Purple
    { main: "#00B4D8", gradient: "rgba(0, 180, 216, 0.1)" }, // Sky Blue
    { main: "#F72585", gradient: "rgba(247, 37, 133, 0.1)" }, // Pink
    { main: "#20BF55", gradient: "rgba(32, 191, 85, 0.1)" }, // Green
];

export const EnhancedMarketChart: FC<EnhancedMarketChartProps> = ({
    market,
    outcomes,
    data,
    loading,
    span,
    type,
}) => {
    const [hoveredOutcome, setHoveredOutcome] = useState<number | null>(null);
    
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
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBorderWidth: 3,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: colorSet.main,
                    fill: 'origin',
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
            
            const dataPoints = hasData ? sortedEntries.map(([_, groupData]) => {
                // Simply return the price, gaps should already be filled by the hook
                return groupData.outcomes[index]?.price || null;
            }) : [];

            const colorSet = OUTCOME_COLORS[index % OUTCOME_COLORS.length];
            const isHovered = hoveredOutcome === index;

            return {
                label: outcome,
                data: dataPoints,
                borderColor: colorSet.main,
                backgroundColor: colorSet.gradient,
                tension: 0.4,
                borderWidth: isHovered ? 3 : 2,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBorderWidth: 3,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: colorSet.main,
                fill: 'origin', // Always fill for probability charts
                order: isHovered ? 0 : index + 1,
                spanGaps: true, // Connect line across null/undefined values
                hidden: false, // Always show in legend even if no data
            };
        });

        return {
            labels,
            datasets,
        };
    }, [data, outcomes, type, span, hoveredOutcome]);

    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
                align: 'start',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: {
                        size: 13,
                        weight: 500 as const,
                        family: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
                    },
                    color: 'rgba(255, 255, 255, 0.9)',
                },
                onHover: (event, legendItem, legend) => {
                    if (legendItem && typeof legendItem.datasetIndex === 'number') {
                        setHoveredOutcome(legendItem.datasetIndex);
                    }
                },
                onLeave: () => {
                    setHoveredOutcome(null);
                },
            },
            title: {
                display: false,
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(13, 17, 28, 0.95)',
                titleColor: 'rgba(255, 255, 255, 0.9)',
                bodyColor: 'rgba(255, 255, 255, 0.8)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                bodySpacing: 8,
                titleFont: {
                    size: 13,
                    weight: 600 as const,
                },
                bodyFont: {
                    size: 12,
                    weight: 400 as const,
                },
                cornerRadius: 12,
                displayColors: true,
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
                        let label = context.dataset.label || "";
                        if (label) {
                            label += ": ";
                        }
                        // Show as percentage probability
                        const percentage = (context.parsed.y * 100).toFixed(2);
                        const collateralValue = context.parsed.y.toFixed(4);
                        label += `${percentage}% (${collateralValue} ${market?.collateralToken?.symbol || 'collateral'})`;
                        return label;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
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
                    color: 'rgba(255, 255, 255, 0.05)',
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
                        // Always show as percentage for probability
                        return `${(Number(value) * 100).toFixed(0)}%`;
                    },
                },
                beginAtZero: true,
                max: 1,
                min: 0,
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
            <div className="chart-container">
                <Line data={chartData} options={options} />
            </div>
            <div className="chart-legend">
                <div className="legend-item">
                    <span className="legend-icon">💡</span>
                    <span className="legend-text">
                        <Trans>
                            Probability represents the market's expectation of each outcome
                        </Trans>
                    </span>
                </div>
            </div>
        </div>
    );
};