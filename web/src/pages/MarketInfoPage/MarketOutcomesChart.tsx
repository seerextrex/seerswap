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
                tension: 0,
                borderWidth: 2.5,
                pointRadius: 2,
                pointHoverRadius: 6,
                pointBackgroundColor: OUTCOME_COLORS[index % OUTCOME_COLORS.length],
                pointBorderColor: "#fff",
                pointBorderWidth: 1,
                pointHoverBackgroundColor: OUTCOME_COLORS[index % OUTCOME_COLORS.length],
                pointHoverBorderColor: "#fff",
                pointHoverBorderWidth: 2,
                cubicInterpolationMode: "monotone" as const,
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
                        weight: 600,
                    },
                    color: "#fff",
                },
            },
            title: {
                display: false,
            },
            tooltip: {
                mode: "index",
                intersect: false,
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    label: (context) => {
                        let label = context.dataset.label || "";
                        if (label) {
                            label += ": ";
                        }
                        if (type === ChartType.PRICE) {
                            const value = context.parsed.y * 100;
                            const prevDataPoint = context.parsed.x > 0 ? 
                                context.dataset.data[context.parsed.x - 1] : null;
                            const change = prevDataPoint ? 
                                ((context.parsed.y - Number(prevDataPoint)) * 100).toFixed(2) : null;
                            
                            label += `${value.toFixed(3)}%`;
                            if (change !== null && change !== "0.00") {
                                const arrow = Number(change) > 0 ? "↑" : "↓";
                                const color = Number(change) > 0 ? "+" : "";
                                label += ` (${color}${change}% ${arrow})`;
                            }
                        } else {
                            label += `$${context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        }
                        return label;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: "rgba(255, 255, 255, 0.03)",
                    lineWidth: 1,
                },
                ticks: {
                    maxTicksLimit: 12,
                    maxRotation: 45,
                    minRotation: 0,
                    autoSkip: true,
                    color: "rgba(255, 255, 255, 0.7)",
                    font: {
                        size: 11,
                    },
                },
            },
            y: {
                grid: {
                    color: "rgba(255, 255, 255, 0.08)",
                    lineWidth: 1,
                },
                ticks: {
                    callback: function (value) {
                        if (type === ChartType.PRICE) {
                            return `${(Number(value) * 100).toFixed(1)}%`;
                        }
                        return `$${Number(value).toLocaleString()}`;
                    },
                    color: "rgba(255, 255, 255, 0.7)",
                    font: {
                        size: 11,
                    },
                    precision: type === ChartType.PRICE ? 3 : 2,
                },
                beginAtZero: true,
                ...(type === ChartType.PRICE && {
                    max: 1,
                    min: 0,
                    suggestedMax: 1,
                    suggestedMin: 0,
                }),
            },
        },
        interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
        },
        elements: {
            line: {
                borderJoinStyle: "round",
            },
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
                            Values range from 0% to 100% chance.
                        </Trans>
                    </p>
                </div>
            )}
        </div>
    );
};