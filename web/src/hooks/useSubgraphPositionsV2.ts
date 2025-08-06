import { useMemo } from "react";
import { useAccount } from "wagmi";
import { useUserPositionsQuery, UserPositionsQuery } from "../state/data/generated";
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
    token0Tvl?: string;
    token1Tvl?: string;
    timestamp?: string;
}

interface UseSubgraphPositionsResult {
    positions: PositionPoolExtended[] | undefined;
    loading: boolean;
    error: Error | undefined;
    refetch: () => void;
}

/**
 * Hook to fetch user positions from the subgraph using generated RTK Query hooks.
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

    // Use the generated RTK Query hook
    const { data, isLoading, error, refetch } = useUserPositionsQuery(
        { user: account?.toLowerCase() || '' },
        { skip: !account }
    );

    // Transform the data to match our PositionPoolExtended format
    const positions = useMemo(() => {
        if (!data?.positions) return undefined;

        return data.positions.map((pos): PositionPoolExtended => {
            // Extract tokenId from the position id (format: "tokenId#blockNumber")
            // WARNING: This parsing is fragile and assumes the subgraph ID format won't change
            let tokenId: bigint;
            try {
                const idParts = pos.id.split('#');
                if (idParts.length === 0 || !idParts[0]) {
                    console.error('Invalid position ID format:', pos.id);
                    tokenId = 0n;
                } else {
                    tokenId = safeConvertToBigInt(idParts[0]);
                }
            } catch (error) {
                console.error('Error parsing position ID:', pos.id, error);
                tokenId = 0n;
            }

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
                token0Tvl: pos.token0Tvl,
                token1Tvl: pos.token1Tvl,
                timestamp: pos.transaction.timestamp,
            };
        });
    }, [data]);

    return {
        positions,
        loading: isLoading,
        error: error as Error | undefined,
        refetch,
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

            // Determine which market this position belongs to based on the outcome token
            const market0 = pool.market0;
            const market1 = pool.market1;
            let targetMarketId: string | null = null;

            // Identify the outcome market (not the collateral market)
            if (market0?.collateralToken?.id && market1) {
                // If market0 has a collateral token, check if it matches either pool token
                if (market0.collateralToken.id.toLowerCase() === pool.token0.id.toLowerCase() ||
                    market0.collateralToken.id.toLowerCase() === pool.token1.id.toLowerCase()) {
                    // market0 is providing collateral, so position belongs to market1
                    targetMarketId = market1.id;
                }
            } else if (market1?.collateralToken?.id && market0) {
                // If market1 has a collateral token, check if it matches either pool token
                if (market1.collateralToken.id.toLowerCase() === pool.token0.id.toLowerCase() ||
                    market1.collateralToken.id.toLowerCase() === pool.token1.id.toLowerCase()) {
                    // market1 is providing collateral, so position belongs to market0
                    targetMarketId = market0.id;
                }
            }

            // Fallback: if we couldn't determine based on collateral, use the first available market
            if (!targetMarketId) {
                // Pick the first available market to avoid duplication
                targetMarketId = pool.market0?.id || pool.market1?.id || null;
            }
            
            if (targetMarketId) {
                const marketPositions = marketMap.get(targetMarketId) || [];
                marketPositions.push(position);
                marketMap.set(targetMarketId, marketPositions);
            }
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