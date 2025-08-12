export interface MarketDataPoint {
    periodStartUnix: number;
    outcomeIndex?: number;
    price?: number;
    synthetic?: boolean;
}

export interface MarketImage {
    cidMarket?: string;
    cidOutcomes?: string[];
}

export interface Market {
    id: string;
    image?: MarketImage[];
    openingTs?: string;
    finalizeTs?: string;
    // Add other market properties as needed
}

export interface ChartDataset {
    label: string;
    data: (number | null)[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    borderWidth: number;
    pointRadius: number;
    pointHoverRadius: number;
    pointHoverBorderWidth: number;
    pointBackgroundColor: string;
    pointBorderColor: string;
    pointBorderWidth: number;
    pointHoverBackgroundColor: string;
    pointHoverBorderColor: string;
    fill: boolean;
    cubicInterpolationMode: 'monotone';
    order: number;
    spanGaps: boolean;
    hidden?: boolean;
}

export interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
}