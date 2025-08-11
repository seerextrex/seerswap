import { useState, useCallback } from "react";
import { gql } from "@apollo/client";
import { client } from "../apollo/client";
import { ChartType } from "../models/enums";

const MARKET_QUERY = gql`
    query Market($id: ID!) {
        market(id: $id) {
            id
            marketName
            outcomes
            openingTs
            finalizeTs
            totalValueLockedUSD
            volumeUSD
            collateralToken {
                id
                symbol
                name
                decimals
            }
            questions {
                question {
                    id
                    best_answer
                    is_pending_arbitration
                    finalize_ts
                }
            }
            image {
                cidMarket
                cidOutcomes
            }
        }
    }
`;

const MARKET_POOLS_QUERY = gql`
    query MarketPools($marketId: String!) {
        pools(
            where: { 
                or: [
                    { market0: $marketId },
                    { market1: $marketId }
                ]
            }
            first: 100
            orderBy: totalValueLockedUSD
            orderDirection: desc
        ) {
            id
            token0 {
                id
                symbol
                name
            }
            token1 {
                id
                symbol
                name
            }
            token0Price
            token1Price
            volumeUSD
            totalValueLockedUSD
            market0 {
                id
                outcomes
                collateralToken {
                    id
                    symbol
                }
                wrappedTokensString
            }
            market1 {
                id
                outcomes
                collateralToken {
                    id
                    symbol
                }
                wrappedTokensString
            }
        }
    }
`;

const MARKET_POOL_HOUR_DATA_QUERY = gql`
    query MarketPoolHourData($pool: ID!, $startTimestamp: Int!, $endTimestamp: Int!) {
        poolHourDatas(
            first: 1000
            where: { 
                pool_: { id: $pool }, 
                periodStartUnix_gte: $startTimestamp, 
                periodStartUnix_lte: $endTimestamp 
            }
            orderBy: periodStartUnix
            orderDirection: asc
        ) {
            periodStartUnix
            volumeUSD
            tvlUSD
            token0Price
            token1Price
        }
    }
`;

export const useMarketData = (marketId?: string) => {
    const [market, setMarket] = useState<any>(null);
    const [marketLoading, setMarketLoading] = useState(false);
    const [marketError, setMarketError] = useState<string | null>(null);
    const [outcomesPriceData, setOutcomesPriceData] = useState<any[]>([]);
    const [priceDataLoading, setPriceDataLoading] = useState(false);
    const [priceDataError, setPriceDataError] = useState<string | null>(null);

    const fetchMarket = useCallback(async (id: string) => {
        setMarketLoading(true);
        setMarketError(null);
        try {
            const { data } = await client.query({
                query: MARKET_QUERY,
                variables: { id },
                fetchPolicy: "network-only",
            });
            if (!data.market) {
                throw new Error("Market not found");
            }
            setMarket(data.market);
        } catch (error) {
            console.error("Error fetching market:", error);
            setMarketError(error instanceof Error ? error.message : "Failed to load market data");
            setMarket(null);
        } finally {
            setMarketLoading(false);
        }
    }, []);

    const fetchOutcomesPriceData = useCallback(async (
        id: string,
        startTimestamp: number,
        endTimestamp: number,
        chartType: ChartType,
        marketData?: any
    ) => {
        setPriceDataLoading(true);
        setPriceDataError(null);
        try {
            // Fetch pools related to this market (consolidated query)
            const { data: poolsData } = await client.query({
                query: MARKET_POOLS_QUERY,
                variables: { marketId: id },
                fetchPolicy: "network-only",
            });

            const uniquePools = poolsData?.pools || [];
            
            if (uniquePools.length === 0) {
                setOutcomesPriceData([]);
                return;
            }

            // Fetch historical data for each pool
            const allPriceData: any[] = [];
            
            for (const pool of uniquePools) {
                const { data: hourlyData } = await client.query({
                    query: MARKET_POOL_HOUR_DATA_QUERY,
                    variables: {
                        pool: pool.id,
                        startTimestamp,
                        endTimestamp,
                    },
                    fetchPolicy: "network-only",
                });

                if (hourlyData?.poolHourDatas) {
                    // Use provided marketData or fall back to state
                    const currentMarket = marketData || market;
                    if (!currentMarket) {
                        console.warn('No market data available for price calculation');
                        continue;
                    }
                    
                    // Determine which token is the outcome token
                    const outcomeIndex = determineOutcomeIndex(pool, currentMarket);
                    
                    hourlyData.poolHourDatas.forEach((hourData: any) => {
                        const price = calculateOutcomePrice(pool, hourData, currentMarket);
                        // Only add data points with valid prices
                        if (price !== null && price !== undefined) {
                            allPriceData.push({
                                ...hourData,
                                poolId: pool.id,
                                outcomeIndex,
                                price,
                            });
                        }
                    });
                }
            }

            // Sort by timestamp
            allPriceData.sort((a, b) => a.periodStartUnix - b.periodStartUnix);
            setOutcomesPriceData(allPriceData);
        } catch (error) {
            console.error("Error fetching outcomes price data:", error);
            setPriceDataError(error instanceof Error ? error.message : "Failed to load price data");
            setOutcomesPriceData([]);
        } finally {
            setPriceDataLoading(false);
        }
    }, [market]);

    return {
        market,
        marketLoading,
        marketError,
        fetchMarket,
        outcomesPriceData,
        fetchOutcomesPriceData,
        priceDataLoading,
        priceDataError,
    };
};

// Helper function to determine which outcome a pool represents
function determineOutcomeIndex(pool: any, market: any): number {
    if (!market?.outcomes) return 0;
    
    // Check if this pool belongs to this market via market0 or market1
    const poolMarket = pool.market0?.id === market.id ? pool.market0 : 
                       pool.market1?.id === market.id ? pool.market1 : null;
    
    if (!poolMarket) return 0;
    
    // Get wrapped tokens from the market to properly identify outcome tokens
    let wrappedTokens: string[] = [];
    if (poolMarket.wrappedTokensString) {
        // Handle both string and array cases
        if (typeof poolMarket.wrappedTokensString === 'string') {
            wrappedTokens = poolMarket.wrappedTokensString.split(',').map((t: string) => t.trim().toLowerCase());
        } else if (Array.isArray(poolMarket.wrappedTokensString)) {
            wrappedTokens = poolMarket.wrappedTokensString.map((t: any) => String(t).toLowerCase());
        }
    }
    
    // If no wrapped tokens, try to match by token symbol with outcomes
    if (wrappedTokens.length === 0) {
        const token0Symbol = pool.token0.symbol?.toLowerCase();
        const token1Symbol = pool.token1.symbol?.toLowerCase();
        
        for (let i = 0; i < market.outcomes.length - 1; i++) {
            const outcome = market.outcomes[i].toLowerCase();
            if (token0Symbol?.includes(outcome) || token1Symbol?.includes(outcome)) {
                return i;
            }
        }
    }
    
    // Check which token in the pool matches which wrapped token (outcome)
    const token0Id = pool.token0.id?.toLowerCase();
    const token1Id = pool.token1.id?.toLowerCase();
    
    // Find which outcome index this pool represents
    for (let i = 0; i < wrappedTokens.length && i < market.outcomes.length - 1; i++) {
        if (token0Id === wrappedTokens[i] || token1Id === wrappedTokens[i]) {
            return i;
        }
    }
    
    // Default to first outcome if no match
    return 0;
}

// Helper function to calculate outcome price from pool data
function calculateOutcomePrice(pool: any, hourData: any, market: any): number {
    // Identify if token0 or token1 is the outcome token
    const market0 = pool.market0;
    const market1 = pool.market1;
    
    // Get the collateral token ID from the relevant market
    let collateralTokenId: string | null = null;
    let isToken0Outcome = false;
    
    if (market0?.id === market.id) {
        // This pool trades outcome tokens from market0
        collateralTokenId = market0.collateralToken?.id?.toLowerCase();
        
        // Check if token0 is an outcome token
        if (collateralTokenId && pool.token1.id?.toLowerCase() === collateralTokenId) {
            // token1 is collateral, so token0 must be outcome
            isToken0Outcome = true;
        } else if (collateralTokenId && pool.token0.id?.toLowerCase() === collateralTokenId) {
            // token0 is collateral, so token1 must be outcome
            isToken0Outcome = false;
        } else {
            // Fallback: try to use wrappedTokensString if available
            if (market0.wrappedTokensString && typeof market0.wrappedTokensString === 'string') {
                const wrappedTokens = market0.wrappedTokensString.split(',').map((t: string) => t.trim().toLowerCase());
                isToken0Outcome = wrappedTokens.includes(pool.token0.id?.toLowerCase());
            }
        }
    } else if (market1?.id === market.id) {
        // This pool trades outcome tokens from market1
        collateralTokenId = market1.collateralToken?.id?.toLowerCase();
        
        // Check if token0 is an outcome token
        if (collateralTokenId && pool.token1.id?.toLowerCase() === collateralTokenId) {
            // token1 is collateral, so token0 must be outcome
            isToken0Outcome = true;
        } else if (collateralTokenId && pool.token0.id?.toLowerCase() === collateralTokenId) {
            // token0 is collateral, so token1 must be outcome
            isToken0Outcome = false;
        } else {
            // Fallback: try to use wrappedTokensString if available
            if (market1.wrappedTokensString && typeof market1.wrappedTokensString === 'string') {
                const wrappedTokens = market1.wrappedTokensString.split(',').map((t: string) => t.trim().toLowerCase());
                isToken0Outcome = wrappedTokens.includes(pool.token0.id?.toLowerCase());
            }
        }
    }
    
    // Determine the price based on token ordering
    // According to CLAUDE.md:
    // - When token0 is outcome, token1 is collateral: price = collateral/outcome (token0Price)
    // - When token0 is collateral, token1 is outcome: price = 1/(outcome/collateral) = 1/token1Price
    
    let price: number;
    if (isToken0Outcome) {
        // token0 is outcome, token1 is collateral
        // token0Price = collateral/outcome (what we want)
        const token0Price = parseFloat(hourData.token0Price);
        // Return null if no valid price data
        if (!token0Price || isNaN(token0Price) || token0Price === 0) {
            return null as any; // Will be filtered out
        }
        price = token0Price;
    } else {
        // token0 is collateral, token1 is outcome
        // token1Price = collateral/outcome (what we want)
        const token1Price = parseFloat(hourData.token1Price);
        // Return null if no valid price data
        if (!token1Price || isNaN(token1Price) || token1Price === 0) {
            return null as any; // Will be filtered out
        }
        price = token1Price;
    }
    
    // Ensure price is between 0 and 1 for outcome tokens
    // If price > 1, it means the units are inverted (outcome/collateral instead of collateral/outcome)
    // We need to invert to get the correct price in terms of collateral
    if (price > 1 && price !== Infinity) {
        price = 1 / price;
    }
    
    // Only return valid prices in range [0.0001, 1] (avoid exact 0 which indicates missing data)
    if (price < 0.0001 || price > 1 || !isFinite(price)) {
        return null as any;
    }
    
    return price;
}