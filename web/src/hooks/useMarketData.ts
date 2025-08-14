import { useState, useCallback } from "react";
import { gql } from "@apollo/client";
import { client } from "../apollo/client";
import { ChartType } from "../models/enums";
import { addCalculatedWeeklyStatsToArray } from "../utils/market";

const MARKET_QUERY = gql`
    query Market($id: ID!) {
        market(id: $id) {
            id
            marketName
            outcomes
            openingTs
            finalizeTs
            lowerBound
            upperBound
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
            wrappedTokensString
            wrappedTokens {
                id
                symbol
                name
                decimals
            }
        }
    }
`;

const MARKET_POOLS_QUERY = gql`
    query MarketPools($marketId: String!, $timestampWeekAgo: Int!) {
        pools(
            where: { 
                or: [
                    { market0_: { id: $marketId } },
                    { market1_: { id: $marketId } }
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
            market0 {
                id
            }
            market1 {
                id
            }
            token0Price
            token1Price
            tick
            sqrtPrice
            liquidity
            volumeUSD
            totalValueLockedUSD
            poolHourData(
                where: { periodStartUnix_gt: $timestampWeekAgo }
                orderBy: periodStartUnix
                orderDirection: desc
            ) {
                periodStartUnix
                volumeUSD
                feesUSD
            }
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
        poolHourData(
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

// Query to get the last known price before a timestamp
const LAST_POOL_HOUR_DATA_QUERY = gql`
    query LastPoolHourData($pool: ID!, $beforeTimestamp: Int!) {
        poolHourData(
            first: 1
            where: { 
                pool_: { id: $pool }, 
                periodStartUnix_lt: $beforeTimestamp 
            }
            orderBy: periodStartUnix
            orderDirection: desc
        ) {
            periodStartUnix
            volumeUSD
            tvlUSD
            token0Price
            token1Price
        }
    }
`;

// For recent data (day view), also check pool day data
const MARKET_POOL_DAY_DATA_QUERY = gql`
    query MarketPoolDayData($pool: ID!, $startTimestamp: Int!, $endTimestamp: Int!) {
        poolDayDatas(
            first: 100
            where: { 
                pool_: { id: $pool}, 
                date_gte: $startTimestamp, 
                date_lte: $endTimestamp 
            }
            orderBy: date
            orderDirection: asc
        ) {
            date
            volumeUSD
            tvlUSD
            token0Price
            token1Price
        }
    }
`;

// Query to get the last known daily price before a timestamp
const LAST_POOL_DAY_DATA_QUERY = gql`
    query LastPoolDayData($pool: ID!, $beforeTimestamp: Int!) {
        poolDayDatas(
            first: 1
            where: { 
                pool_: { id: $pool}, 
                date_lt: $beforeTimestamp 
            }
            orderBy: date
            orderDirection: desc
        ) {
            date
            volumeUSD
            tvlUSD
            token0Price
            token1Price
        }
    }
`;

export const useMarketData = (marketId?: string) => {
    const [market, setMarket] = useState<any>(null);
    const [pools, setPools] = useState<any[]>([]);
    const [marketLoading, setMarketLoading] = useState(false);
    const [marketError, setMarketError] = useState<string | null>(null);
    const [outcomesPriceData, setOutcomesPriceData] = useState<any[]>([]);
    const [priceDataLoading, setPriceDataLoading] = useState(false);
    const [priceDataError, setPriceDataError] = useState<string | null>(null);

    const fetchMarket = useCallback(async (id: string) => {
        setMarketLoading(true);
        setMarketError(null);
        try {
            // Fetch market data
            const { data } = await client.query({
                query: MARKET_QUERY,
                variables: { id },
                fetchPolicy: "network-only",
            });
            if (!data.market) {
                throw new Error("Market not found");
            }
            setMarket(data.market);
            
            // Also fetch pools for this market with weekly data
            const timestampWeekAgo = Math.floor(Date.now() / 1000) - (7 * 86400);
            console.log('[useMarketData] Fetching pools for market:', id);
            const { data: poolsData } = await client.query({
                query: MARKET_POOLS_QUERY,
                variables: { 
                    marketId: id.toLowerCase(), // Ensure lowercase for consistency
                    timestampWeekAgo 
                },
                fetchPolicy: "network-only",
            });
            console.log('[useMarketData] Pools data:', poolsData?.pools);
            // Apply weekly calculations to pools before storing
            const poolsWithStats = addCalculatedWeeklyStatsToArray(poolsData?.pools || []);
            setPools(poolsWithStats);
        } catch (error) {
            console.error("Error fetching market:", error);
            setMarketError(error instanceof Error ? error.message : "Failed to load market data");
            setMarket(null);
            setPools([]);
        } finally {
            setMarketLoading(false);
        }
    }, []);

    const fetchOutcomesPriceData = useCallback(async (
        id: string,
        startTimestamp: number,
        endTimestamp: number,
        chartType: ChartType,
        span: number, // 0=day, 1=week, 2=month
        marketData?: any
    ) => {
        setPriceDataLoading(true);
        setPriceDataError(null);
        try {
            // Fetch pools related to this market (consolidated query)
            const timestampWeekAgo = Math.floor(Date.now() / 1000) - (7 * 86400);
            const { data: poolsData } = await client.query({
                query: MARKET_POOLS_QUERY,
                variables: { 
                    marketId: id,
                    timestampWeekAgo 
                },
                fetchPolicy: "network-only",
            });

            // Apply weekly calculations to pools before processing
            const pools = poolsData?.pools || [];
            const uniquePools = addCalculatedWeeklyStatsToArray(pools);
            
            if (uniquePools.length === 0) {
                setOutcomesPriceData([]);
                return;
            }

            // Fetch historical data for each pool
            const allPriceData: any[] = [];
            
            // Use provided marketData or fall back to state
            const currentMarket = marketData || market;
            if (!currentMarket) {
                console.warn('No market data available for price calculation');
                setOutcomesPriceData([]);
                return;
            }
            
            // Track which outcomes we have data for
            const outcomeDataMap = new Map<number, any[]>();
            
            for (const pool of uniquePools) {
                // Determine which token is the outcome token
                const outcomeIndex = determineOutcomeIndex(pool, currentMarket);
                
                // Add current pool state as the most recent data point
                const currentPrice = calculateOutcomePrice(pool, {
                    token0Price: pool.token0Price,
                    token1Price: pool.token1Price
                }, currentMarket);
                
                if (currentPrice !== null && currentPrice !== undefined) {
                    const currentDataPoint = {
                        periodStartUnix: Math.floor(Date.now() / 1000),
                        volumeUSD: pool.volumeUSD || '0',
                        tvlUSD: pool.totalValueLockedUSD || '0',
                        token0Price: pool.token0Price,
                        token1Price: pool.token1Price,
                        poolId: pool.id,
                        outcomeIndex,
                        price: currentPrice,
                    };
                    
                    allPriceData.push(currentDataPoint);
                    
                    if (!outcomeDataMap.has(outcomeIndex)) {
                        outcomeDataMap.set(outcomeIndex, []);
                    }
                    outcomeDataMap.get(outcomeIndex)!.push(currentDataPoint);
                }
                
                // For day view, fetch both hourly and last known data
                if (span === 0) { // Day view
                    // First, get the last known hour data before our time window
                    const { data: lastHourData } = await client.query({
                        query: LAST_POOL_HOUR_DATA_QUERY,
                        variables: {
                            pool: pool.id,
                            beforeTimestamp: startTimestamp,
                        },
                        fetchPolicy: "network-only",
                    });
                    
                    let lastKnownPrice: number | null = null;
                    let lastKnownData: any = null;
                    
                    if (lastHourData?.poolHourData && lastHourData.poolHourData.length > 0) {
                        lastKnownData = lastHourData.poolHourData[0];
                        lastKnownPrice = calculateOutcomePrice(pool, lastKnownData, currentMarket);
                    }
                    
                    // Then fetch hourly data for the time window
                    const { data: hourlyData } = await client.query({
                        query: MARKET_POOL_HOUR_DATA_QUERY,
                        variables: {
                            pool: pool.id,
                            startTimestamp,
                            endTimestamp,
                        },
                        fetchPolicy: "network-only",
                    });
                    
                    // Create a map of existing data points
                    const existingDataPoints = new Map<number, any>();
                    
                    if (hourlyData?.poolHourData && hourlyData.poolHourData.length > 0) {
                        hourlyData.poolHourData.forEach((dataPoint: any) => {
                            const price = calculateOutcomePrice(pool, dataPoint, currentMarket);
                            if (price !== null && price !== undefined) {
                                existingDataPoints.set(dataPoint.periodStartUnix, {
                                    ...dataPoint,
                                    poolId: pool.id,
                                    outcomeIndex,
                                    price,
                                });
                            }
                        });
                    }
                    
                    // Fill the entire time range with data
                    // Only use historical data, don't backfill with current price
                    let currentPrice = lastKnownPrice;
                    
                    let currentData = lastKnownData || {
                        token0Price: pool.token0Price,
                        token1Price: pool.token1Price,
                        tvlUSD: pool.totalValueLockedUSD || '0',
                        volumeUSD: '0'
                    };
                    
                    // Create hourly points for the entire range
                    // Align to hour boundaries
                    const hourStart = Math.floor(startTimestamp / 3600) * 3600;
                    const hourEnd = Math.ceil(endTimestamp / 3600) * 3600;
                    
                    for (let timestamp = hourStart; timestamp <= hourEnd; timestamp += 3600) {
                        if (existingDataPoints.has(timestamp)) {
                            // Use actual data if available
                            const dataPoint = existingDataPoints.get(timestamp)!;
                            allPriceData.push(dataPoint);
                            currentPrice = dataPoint.price;
                            currentData = dataPoint;
                            
                            if (!outcomeDataMap.has(outcomeIndex)) {
                                outcomeDataMap.set(outcomeIndex, []);
                            }
                            outcomeDataMap.get(outcomeIndex)!.push(dataPoint);
                        } else if (currentPrice !== null) {
                            // Use last known price for gaps
                            const syntheticDataPoint = {
                                periodStartUnix: timestamp,
                                volumeUSD: '0',
                                tvlUSD: currentData.tvlUSD,
                                token0Price: currentData.token0Price,
                                token1Price: currentData.token1Price,
                                poolId: pool.id,
                                outcomeIndex,
                                price: currentPrice,
                                synthetic: true
                            };
                            
                            allPriceData.push(syntheticDataPoint);
                            if (!outcomeDataMap.has(outcomeIndex)) {
                                outcomeDataMap.set(outcomeIndex, []);
                            }
                            outcomeDataMap.get(outcomeIndex)!.push(syntheticDataPoint);
                        }
                    }
                } else {
                    // For week/month views, use daily data
                    // First get last known daily data before time window
                    const { data: lastDayData } = await client.query({
                        query: LAST_POOL_DAY_DATA_QUERY,
                        variables: {
                            pool: pool.id,
                            beforeTimestamp: startTimestamp,
                        },
                        fetchPolicy: "network-only",
                    });
                    
                    let lastKnownPrice: number | null = null;
                    let lastKnownData: any = null;
                    
                    if (lastDayData?.poolDayDatas && lastDayData.poolDayDatas.length > 0) {
                        lastKnownData = lastDayData.poolDayDatas[0];
                        lastKnownPrice = calculateOutcomePrice(pool, lastKnownData, currentMarket);
                    }
                    
                    // Then fetch daily data for the time window
                    const { data: dailyData } = await client.query({
                        query: MARKET_POOL_DAY_DATA_QUERY,
                        variables: {
                            pool: pool.id,
                            startTimestamp,
                            endTimestamp,
                        },
                        fetchPolicy: "network-only",
                    });
                    
                    // Create a map of existing data points
                    const existingDataPoints = new Map<number, any>();
                    
                    if (dailyData?.poolDayDatas && dailyData.poolDayDatas.length > 0) {
                        dailyData.poolDayDatas.forEach((dataPoint: any) => {
                            const price = calculateOutcomePrice(pool, dataPoint, currentMarket);
                            if (price !== null && price !== undefined) {
                                existingDataPoints.set(dataPoint.date, {
                                    ...dataPoint,
                                    periodStartUnix: dataPoint.date,
                                    poolId: pool.id,
                                    outcomeIndex,
                                    price,
                                });
                            }
                        });
                    }
                    
                    // Fill gaps with last known price
                    // Only use historical data, don't backfill with current price
                    let currentPrice = lastKnownPrice;
                    
                    let currentData = lastKnownData || {
                        token0Price: pool.token0Price,
                        token1Price: pool.token1Price,
                        tvlUSD: pool.totalValueLockedUSD || '0',
                        volumeUSD: '0'
                    };
                    
                    // Create daily points for the range
                    // Align to day boundaries (UTC midnight)
                    const dayStart = Math.floor(startTimestamp / 86400) * 86400;
                    const dayEnd = Math.ceil(endTimestamp / 86400) * 86400;
                    
                    for (let timestamp = dayStart; timestamp <= dayEnd; timestamp += 86400) {
                        const dayTimestamp = timestamp;
                        
                        if (existingDataPoints.has(dayTimestamp)) {
                            // Use actual data if available
                            const dataPoint = existingDataPoints.get(dayTimestamp)!;
                            allPriceData.push(dataPoint);
                            currentPrice = dataPoint.price;
                            currentData = dataPoint;
                            
                            if (!outcomeDataMap.has(outcomeIndex)) {
                                outcomeDataMap.set(outcomeIndex, []);
                            }
                            outcomeDataMap.get(outcomeIndex)!.push(dataPoint);
                        } else if (currentPrice !== null) {
                            // Use last known price for gaps
                            const syntheticDataPoint = {
                                periodStartUnix: dayTimestamp,
                                date: dayTimestamp,
                                volumeUSD: '0',
                                tvlUSD: currentData.tvlUSD,
                                token0Price: currentData.token0Price,
                                token1Price: currentData.token1Price,
                                poolId: pool.id,
                                outcomeIndex,
                                price: currentPrice,
                                synthetic: true
                            };
                            
                            allPriceData.push(syntheticDataPoint);
                            if (!outcomeDataMap.has(outcomeIndex)) {
                                outcomeDataMap.set(outcomeIndex, []);
                            }
                            outcomeDataMap.get(outcomeIndex)!.push(syntheticDataPoint);
                        }
                    }
                }
            }
            
            // Log which outcomes have data
            console.log('Outcomes with data:', Array.from(outcomeDataMap.keys()).sort());
            console.log('Expected outcomes:', currentMarket.outcomes?.length ? currentMarket.outcomes.length - 1 : 0);

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
        pools,
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
    
    if (!poolMarket) {
        console.warn(`Pool ${pool.id} does not belong to market ${market.id}`);
        return 0;
    }
    
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
    
    const token0Id = pool.token0.id?.toLowerCase();
    const token1Id = pool.token1.id?.toLowerCase();
    const token0Symbol = pool.token0.symbol?.toLowerCase();
    const token1Symbol = pool.token1.symbol?.toLowerCase();
    const collateralId = poolMarket.collateralToken?.id?.toLowerCase();
    
    // First, try to match by wrapped token IDs
    if (wrappedTokens.length > 0) {
        for (let i = 0; i < wrappedTokens.length && i < market.outcomes.length - 1; i++) {
            if (token0Id === wrappedTokens[i] || token1Id === wrappedTokens[i]) {
                return i;
            }
        }
    }
    
    // Second, try to match by token symbol with outcomes
    // Look for exact matches or patterns like "YES", "NO" in token symbols
    for (let i = 0; i < market.outcomes.length - 1; i++) {
        const outcome = market.outcomes[i].toLowerCase();
        
        // Check for exact outcome match in symbol
        if (token0Symbol === outcome || token1Symbol === outcome) {
            return i;
        }
        
        // Check if symbol contains outcome (e.g., "sDAI-YES" contains "YES")
        // But make sure it's not the collateral token
        if (token0Id !== collateralId && token0Symbol?.includes(outcome)) {
            return i;
        }
        if (token1Id !== collateralId && token1Symbol?.includes(outcome)) {
            return i;
        }
    }
    
    // Third, try pattern matching for common outcome names
    const outcomePatterns = [
        { pattern: /yes|true|long/i, index: 0 },
        { pattern: /no|false|short/i, index: 1 },
    ];
    
    for (const { pattern, index } of outcomePatterns) {
        if (index < market.outcomes.length - 1) {
            if ((token0Id !== collateralId && pattern.test(token0Symbol || '')) ||
                (token1Id !== collateralId && pattern.test(token1Symbol || ''))) {
                return index;
            }
        }
    }
    
    // Log warning when we can't determine outcome
    console.warn(`Could not determine outcome for pool ${pool.id}:`, {
        token0: { id: token0Id, symbol: token0Symbol },
        token1: { id: token1Id, symbol: token1Symbol },
        wrappedTokens,
        marketOutcomes: market.outcomes
    });
    
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