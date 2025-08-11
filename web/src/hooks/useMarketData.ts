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
        poolsByMarket0: pools(where: { market0: $marketId }) {
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
            }
            market1 {
                id
                outcomes
            }
        }
        poolsByMarket1: pools(where: { market1: $marketId }) {
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
            }
            market1 {
                id
                outcomes
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
    const [outcomesPriceData, setOutcomesPriceData] = useState<any[]>([]);
    const [priceDataLoading, setPriceDataLoading] = useState(false);

    const fetchMarket = useCallback(async (id: string) => {
        setMarketLoading(true);
        try {
            const { data } = await client.query({
                query: MARKET_QUERY,
                variables: { id },
                fetchPolicy: "network-only",
            });
            setMarket(data.market);
        } catch (error) {
            console.error("Error fetching market:", error);
        } finally {
            setMarketLoading(false);
        }
    }, []);

    const fetchOutcomesPriceData = useCallback(async (
        id: string,
        startTimestamp: number,
        endTimestamp: number,
        chartType: ChartType
    ) => {
        setPriceDataLoading(true);
        try {
            // First fetch pools related to this market
            const { data: poolsData } = await client.query({
                query: MARKET_POOLS_QUERY,
                variables: { marketId: id },
                fetchPolicy: "network-only",
            });

            // Combine pools from both queries and deduplicate
            const poolsByMarket0 = poolsData?.poolsByMarket0 || [];
            const poolsByMarket1 = poolsData?.poolsByMarket1 || [];
            const allPools = [...poolsByMarket0, ...poolsByMarket1];
            
            // Deduplicate pools by ID
            const uniquePools = allPools.reduce((acc: any[], pool: any) => {
                if (!acc.find((p: any) => p.id === pool.id)) {
                    acc.push(pool);
                }
                return acc;
            }, []);
            
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
                    // Determine which token is the outcome token
                    // Assuming token0 or token1 has outcome naming pattern
                    const outcomeIndex = determineOutcomeIndex(pool, market);
                    
                    hourlyData.poolHourDatas.forEach((hourData: any) => {
                        allPriceData.push({
                            ...hourData,
                            poolId: pool.id,
                            outcomeIndex,
                            // Calculate price based on token order
                            price: calculateOutcomePrice(pool, hourData),
                        });
                    });
                }
            }

            // Sort by timestamp
            allPriceData.sort((a, b) => a.periodStartUnix - b.periodStartUnix);
            setOutcomesPriceData(allPriceData);
        } catch (error) {
            console.error("Error fetching outcomes price data:", error);
            setOutcomesPriceData([]);
        } finally {
            setPriceDataLoading(false);
        }
    }, [market]);

    return {
        market,
        marketLoading,
        fetchMarket,
        outcomesPriceData,
        fetchOutcomesPriceData,
        priceDataLoading,
    };
};

// Helper function to determine which outcome a pool represents
function determineOutcomeIndex(pool: any, market: any): number {
    if (!market?.outcomes) return 0;
    
    // Check if this pool belongs to this market via market0 or market1
    const poolMarket = pool.market0?.id === market.id ? pool.market0 : 
                       pool.market1?.id === market.id ? pool.market1 : null;
    
    if (!poolMarket) return 0;
    
    // Logic to match pool tokens with market outcomes
    const token0Symbol = pool.token0.symbol?.toLowerCase();
    const token1Symbol = pool.token1.symbol?.toLowerCase();
    
    for (let i = 0; i < market.outcomes.length - 1; i++) {
        const outcome = market.outcomes[i].toLowerCase();
        if (token0Symbol?.includes(outcome) || token1Symbol?.includes(outcome)) {
            return i;
        }
    }
    
    // Default to first outcome if no match
    return 0;
}

// Helper function to calculate outcome price from pool data
function calculateOutcomePrice(pool: any, hourData: any): number {
    // Determine if token0 or token1 is the outcome token
    // For prediction markets, outcome price should be between 0 and 1
    
    // This is a simplified calculation - adjust based on your token ordering
    const price = hourData.token0Price;
    
    // Ensure price is between 0 and 1 for outcome tokens
    if (price > 1) {
        return 1 / price;
    }
    
    return price;
}