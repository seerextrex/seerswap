import { FC, useMemo } from "react";
import { t, Trans } from "@lingui/macro";
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
    ChartOptions,
} from "chart.js";
import { ChartType } from "../../models/enums";
import Loader from "../../components/Loader";
import "./MarketOutcomesChart.scss";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface MarketOutcomesChartProps {
    market: any;
    outcomes: string[];
    data: any[];
    loading: boolean;
    span: number;
    type: ChartType;
}

const OUTCOME_COLORS = [
    "#4CAF50", // Green
    "#F44336", // Red
    "#2196F3", // Blue
    "#FF9800", // Orange
    "#9C27B0", // Purple
    "#00BCD4", // Cyan
    "#FFEB3B", // Yellow
    "#795548", // Brown
];

export const MarketOutcomesChart: FC<MarketOutcomesChartProps> = ({
    market,
    outcomes,
    data,
    loading,
    span,
    type,
}) => {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) {
            return null;
        }

        // Group data by timestamp
        const groupedData: { [key: string]: any } = {};
        data.forEach((item) => {
            const timestamp = new Date(item.periodStartUnix * 1000).toLocaleString();
            if (!groupedData[timestamp]) {
                groupedData[timestamp] = {
                    timestamp,
                    outcomes: {},
                };
            }
            // Store price data for each outcome
            if (item.outcomeIndex !== undefined) {
                groupedData[timestamp].outcomes[item.outcomeIndex] = {
                    price: item.price || 0,
                    volume: item.volumeUSD || 0,
                    tvl: item.tvlUSD || 0,
                };
            }
        });

        const labels = Object.keys(groupedData);
        const datasets = outcomes.map((outcome, index) => {
            let dataPoints: number[] = [];
            
            if (type === ChartType.PRICE) {
                dataPoints = labels.map((label) =>
                    groupedData[label].outcomes[index]?.price || 0
                );
            } else if (type === ChartType.VOLUME) {
                dataPoints = labels.map((label) =>
                    groupedData[label].outcomes[index]?.volume || 0
                );
            } else if (type === ChartType.TVL) {
                dataPoints = labels.map((label) =>
                    groupedData[label].outcomes[index]?.tvl || 0
                );
            }

            return {
                label: outcome,
                data: dataPoints,
                borderColor: OUTCOME_COLORS[index % OUTCOME_COLORS.length],
                backgroundColor: `${OUTCOME_COLORS[index % OUTCOME_COLORS.length]}20`,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
            };
        });

        return {
            labels,
            datasets,
        };
    }, [data, outcomes, type]);

    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                    },
                },
            },
            title: {
                display: false,
            },
            tooltip: {
                mode: "index",
                intersect: false,
                callbacks: {
                    label: (context) => {
                        let label = context.dataset.label || "";
                        if (label) {
                            label += ": ";
                        }
                        if (type === ChartType.PRICE) {
                            label += `$${context.parsed.y.toFixed(4)}`;
                        } else {
                            label += `$${context.parsed.y.toLocaleString()}`;
                        }
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
                ticks: {
                    maxTicksLimit: 8,
                    maxRotation: 0,
                    autoSkip: true,
                },
            },
            y: {
                grid: {
                    color: "rgba(255, 255, 255, 0.05)",
                },
                ticks: {
                    callback: function (value) {
                        if (type === ChartType.PRICE) {
                            return `$${Number(value).toFixed(2)}`;
                        }
                        return `$${Number(value).toLocaleString()}`;
                    },
                },
                beginAtZero: true,
                ...(type === ChartType.PRICE && {
                    max: 1,
                }),
            },
        },
        interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
        },
    };

    if (loading) {
        return (
            <div className="market-chart-loading">
                <Loader stroke="white" size="30px" />
                <span>
                    <Trans>Loading chart data...</Trans>
                </span>
            </div>
        );
    }

    if (!chartData) {
        return (
            <div className="market-chart-empty">
                <Trans>No chart data available</Trans>
            </div>
        );
    }

    return (
        <div className="market-outcomes-chart">
            <div className="chart-container">
                <Line data={chartData} options={options} />
            </div>
            {type === ChartType.PRICE && (
                <div className="chart-info">
                    <p className="info-text">
                        <Trans>
                            Prices represent the probability of each outcome. 
                            Values range from $0 (0% chance) to $1 (100% chance).
                        </Trans>
                    </p>
                </div>
            )}
        </div>
    );
};