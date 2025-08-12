// Market-related TypeScript interfaces

export interface TokenMetadata {
    id: string;
    symbol: string;
    name: string;
    decimals: number;
}

export interface CollateralToken extends TokenMetadata {}

export interface MarketQuestion {
    question: {
        id: string;
        best_answer: string | null;
        is_pending_arbitration: boolean;
        finalize_ts: number;
    };
}

export interface MarketImage {
    cidMarket: string;
    cidOutcomes: string[];
}

export interface Market {
    id: string;
    marketName: string;
    outcomes: string[];
    openingTs: number;
    finalizeTs: number;
    totalValueLockedUSD: string;
    volumeUSD: string;
    collateralToken: CollateralToken;
    questions: MarketQuestion[];
    image: MarketImage | null;
    wrappedTokensString?: string;
    wrappedTokens?: (TokenMetadata | string)[];
}

export interface Pool {
    id: string;
    token0: {
        id: string;
        symbol: string;
        name: string;
    };
    token1: {
        id: string;
        symbol: string;
        name: string;
    };
    token0Price: string;
    token1Price: string;
    volumeUSD: string;
    totalValueLockedUSD: string;
    market0?: {
        id: string;
        outcomes: string[];
        collateralToken: CollateralToken;
        wrappedTokensString: string;
    };
    market1?: {
        id: string;
        outcomes: string[];
        collateralToken: CollateralToken;
        wrappedTokensString: string;
    };
}

export interface PriceDataPoint {
    periodStartUnix: number;
    outcomeIndex: number;
    price: number;
    synthetic?: boolean;
}

export interface OutcomePriceInfo {
    outcomeIndex: number;
    currentPrice: number;
    token: string;
}