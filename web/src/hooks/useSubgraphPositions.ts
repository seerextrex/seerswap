import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { useClients } from "./subgraph/useClients";
import { USER_POSITIONS } from "../utils/graphql-queries";
import { SubgraphResponse } from "../models/interfaces";
import { PositionPool } from "../models/interfaces";
import { safeConvertToBigInt } from "../utils/bigintUtils";

// Extended PositionPool interface that includes subgraph-specific fields
export interface PositionPoolExtended extends PositionPool {
    pool?: any;
    depositedToken0?: string;
    depositedToken1?: string;
    withdrawnToken0?: string;
    withdrawnToken1?: string;
    collectedFeesToken0?: string;
    collectedFeesToken1?: string;
    timestamp?: string;
}

interface SubgraphPosition {
    id: string;
    owner: string;
    pool: {
        id: string;
        token0: {
            id: string;
            symbol: string;
            decimals: number;
        };
        token1: {
            id: string;
            symbol: string;
            decimals: number;
        };
        fee: string;
        sqrtPrice: string;
        liquidity: string;
        tick: string;
        totalValueLockedUSD: string;
        market0: any;
        market1: any;
    };
    tickLower: {
        tickIdx: string;
    };
    tickUpper: {
        tickIdx: string;
    };
    liquidity: string;
    depositedToken0: string;
    depositedToken1: string;
    withdrawnToken0: string;
    withdrawnToken1: string;
    collectedFeesToken0: string;
    collectedFeesToken1: string;
    transaction: {
        timestamp: string;
    };
    feeGrowthInside0LastX128: string;
    feeGrowthInside1LastX128: string;
}

interface UseSubgraphPositionsResult {
    positions: PositionPoolExtended[] | undefined;
    loading: boolean;
    error: Error | undefined;
    refetch: () => void;
}

/**
 * Hook to fetch user positions from the subgraph instead of making multiple RPC calls.
 * 
 * @param passedAccount - Optional account address to fetch positions for
 * @returns Object containing positions array, loading state, error, and refetch function
 * 
 * @note Data from the subgraph may be delayed by 1-2 minutes compared to on-chain state.
 * Critical fields like tokensOwed0/1 are not available and default to 0.
 */
export function useSubgraphPositions(passedAccount?: string | null): UseSubgraphPositionsResult {
    const { address: connectedAccount } = useAccount();
    const account = passedAccount ?? connectedAccount;
    const { dataClient } = useClients();

    const [positions, setPositions] = useState<PositionPoolExtended[] | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | undefined>(undefined);

    const fetchPositions = useCallback(async () => {
        if (!account || !dataClient) {
            setPositions(undefined);
            return;
        }

        try {
            setLoading(true);
            setError(undefined);

            const { data, error: queryError } = await dataClient.query<SubgraphResponse<SubgraphPosition[]>>({
                query: USER_POSITIONS,
                variables: { user: account.toLowerCase() },
                fetchPolicy: "network-only",
            });

            if (queryError) {
                throw new Error(`Query error: ${queryError.message}`);
            }

            if (!data?.positions) {
                setPositions([]);
                return;
            }

            // Transform subgraph positions to PositionPoolExtended format
            const transformedPositions: PositionPoolExtended[] = data.positions.map((pos) => {
                // Extract tokenId from the position id (format: "tokenId#blockNumber")
                // WARNING: This parsing is fragile and assumes the subgraph ID format won't change
                const tokenId = safeConvertToBigInt(pos.id.split('#')[0]);

                return {
                    tokenId,
                    nonce: 0n, // Not available from subgraph
                    operator: "0x0000000000000000000000000000000000000000", // Not available from subgraph
                    token0: pos.pool.token0.id,
                    token1: pos.pool.token1.id,
                    fee: pos.pool.fee, // Fee tier from the pool
                    tickLower: Number(pos.tickLower.tickIdx),
                    tickUpper: Number(pos.tickUpper.tickIdx),
                    liquidity: safeConvertToBigInt(pos.liquidity),
                    feeGrowthInside0LastX128: safeConvertToBigInt(pos.feeGrowthInside0LastX128),
                    feeGrowthInside1LastX128: safeConvertToBigInt(pos.feeGrowthInside1LastX128),
                    tokensOwed0: 0n, // TODO: Not available from subgraph, requires RPC call for real-time data
                    tokensOwed1: 0n, // TODO: Not available from subgraph, requires RPC call for real-time data
                    // Additional fields from subgraph
                    pool: pos.pool,
                    depositedToken0: pos.depositedToken0,
                    depositedToken1: pos.depositedToken1,
                    withdrawnToken0: pos.withdrawnToken0,
                    withdrawnToken1: pos.withdrawnToken1,
                    collectedFeesToken0: pos.collectedFeesToken0,
                    collectedFeesToken1: pos.collectedFeesToken1,
                    timestamp: pos.transaction.timestamp,
                } as PositionPoolExtended;
            });

            setPositions(transformedPositions);
        } catch (err: any) {
            console.error("Error fetching positions from subgraph:", err);
            
            // Better error handling with specific error types
            if (err.networkError) {
                setError(new Error("Network error: Please check your connection"));
            } else if (err.graphQLErrors?.length > 0) {
                setError(new Error(`Query error: ${err.graphQLErrors[0].message}`));
            } else if (err.message) {
                setError(new Error(err.message));
            } else {
                setError(new Error("Unknown error occurred while fetching positions"));
            }
            
            setPositions(undefined);
        } finally {
            setLoading(false);
        }
    }, [account, dataClient]);

    useEffect(() => {
        fetchPositions();
    }, [fetchPositions]);

    return {
        positions,
        loading,
        error,
        refetch: fetchPositions,
    };
}

// Hook to get positions grouped by market for market-centric display
export function useSubgraphPositionsByMarket(passedAccount?: string | null) {
    const { positions, loading, error, refetch } = useSubgraphPositions(passedAccount);

    const positionsByMarket = useMemo(() => {
        if (!positions) return undefined;

        const marketMap = new Map<string, PositionPoolExtended[]>();

        positions.forEach((position) => {
            const pool = position.pool;
            if (!pool) return;

            // Get market IDs from the pool
            const markets = [pool.market0?.id, pool.market1?.id].filter(Boolean);

            markets.forEach((marketId) => {
                if (!marketId) return;

                const marketPositions = marketMap.get(marketId) || [];
                marketPositions.push(position);
                marketMap.set(marketId, marketPositions);
            });
        });

        return marketMap;
    }, [positions]);

    return {
        positions,
        positionsByMarket,
        loading,
        error,
        refetch,
    };
}