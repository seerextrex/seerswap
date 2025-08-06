import { useMemo, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { useLazyUserPositionsQuery, UserPositionsQuery } from "../state/data/generated";
import { PositionPool } from "../models/interfaces";
import { safeConvertToBigInt } from "../utils/bigintUtils";

// Extended PositionPool interface that includes subgraph-specific fields
export interface PositionPoolExtended extends PositionPool {
    pool?: UserPositionsQuery['positions'][0]['pool'];
    depositedToken0?: string;
    depositedToken1?: string;
    withdrawnToken0?: string;
    withdrawnToken1?: string;
    collectedFeesToken0?: string;
    collectedFeesToken1?: string;
    timestamp?: string;
}

interface UseSubgraphPositionsPaginatedResult {
    positions: PositionPoolExtended[] | undefined;
    loading: boolean;
    error: Error | undefined;
    hasMore: boolean;
    loadMore: () => void;
    refetch: () => void;
}

const POSITIONS_PER_PAGE = 20;

/**
 * Hook to fetch user positions from the subgraph with pagination support.
 * 
 * @param passedAccount - Optional account address to fetch positions for
 * @returns Object containing positions array, loading state, error, pagination controls
 * 
 * @note Data from the subgraph may be delayed by 1-2 minutes compared to on-chain state.
 * Critical fields like tokensOwed0/1 are not available and default to 0.
 */
export function useSubgraphPositionsPaginated(passedAccount?: string | null): UseSubgraphPositionsPaginatedResult {
    const { address: connectedAccount } = useAccount();
    const account = passedAccount ?? connectedAccount;

    const [allPositions, setAllPositions] = useState<PositionPoolExtended[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // Use the lazy query for manual control
    const [fetchPositions, { isLoading, error }] = useLazyUserPositionsQuery();

    const transformPosition = useCallback((pos: UserPositionsQuery['positions'][0]): PositionPoolExtended => {
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
        };
    }, []);

    const loadPositions = useCallback(async (page: number, isRefetch = false) => {
        if (!account) return;

        try {
            const result = await fetchPositions({
                user: account.toLowerCase(),
                first: POSITIONS_PER_PAGE,
                skip: page * POSITIONS_PER_PAGE,
            });

            if (result.data?.positions) {
                const transformedPositions = result.data.positions.map(transformPosition);
                
                if (isRefetch) {
                    setAllPositions(transformedPositions);
                    setCurrentPage(0);
                } else {
                    setAllPositions(prev => [...prev, ...transformedPositions]);
                }

                // Check if there are more positions to load
                setHasMore(result.data.positions.length === POSITIONS_PER_PAGE);
            }
        } catch (err) {
            console.error("Error fetching positions:", err);
        }
    }, [account, fetchPositions, transformPosition]);

    const loadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            loadPositions(nextPage);
        }
    }, [currentPage, hasMore, isLoading, loadPositions]);

    const refetch = useCallback(() => {
        setAllPositions([]);
        setCurrentPage(0);
        setHasMore(true);
        loadPositions(0, true);
    }, [loadPositions]);

    // Load initial data
    useMemo(() => {
        if (account && allPositions.length === 0 && currentPage === 0) {
            loadPositions(0);
        }
    }, [account, allPositions.length, currentPage, loadPositions]);

    return {
        positions: allPositions.length > 0 ? allPositions : undefined,
        loading: isLoading,
        error: error as Error | undefined,
        hasMore,
        loadMore,
        refetch,
    };
}

// Hook to get paginated positions grouped by market
export function useSubgraphPositionsByMarketPaginated(passedAccount?: string | null) {
    const { positions, loading, error, hasMore, loadMore, refetch } = useSubgraphPositionsPaginated(passedAccount);

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
        hasMore,
        loadMore,
        refetch,
    };
}