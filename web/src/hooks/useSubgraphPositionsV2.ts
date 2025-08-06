import { useMemo } from "react";
import { useAccount } from "wagmi";
import { useUserPositionsQuery, UserPositionsQuery, useUserFarmingPositionsQuery, UserFarmingPositionsQuery, usePositionsByIdsQuery } from "../state/data/generated";
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

    // Fetch regular positions
    const { data: regularData, isLoading: regularLoading, error: regularError, refetch: refetchRegular } = useUserPositionsQuery(
        { user: account?.toLowerCase() || '' },
        { skip: !account }
    );

    // Fetch farming positions
    const { data: farmingData, isLoading: farmingLoading, error: farmingError, refetch: refetchFarming } = useUserFarmingPositionsQuery(
        { user: account?.toLowerCase() || '' },
        { skip: !account }
    );

    // Extract deposit IDs for position lookup
    const depositIds = useMemo(() => {
        if (!farmingData?.deposits) return [];
        return farmingData.deposits.map(d => d.id);
    }, [farmingData]);

    // Fetch position data for farming deposits
    const { data: farmingPositionsData, isLoading: farmingPositionsLoading, error: farmingPositionsError } = usePositionsByIdsQuery(
        { ids: depositIds },
        { skip: depositIds.length === 0 }
    );

    // Log error if position data fetch fails
    if (farmingPositionsError && depositIds.length > 0) {
        console.error('Failed to fetch position data for farming deposits:', farmingPositionsError);
        console.error('Deposit IDs that failed:', depositIds);
    }

    // Transform and combine the data
    const positions = useMemo(() => {
        const allPositions: PositionPoolExtended[] = [];
        
        // Add regular positions
        if (regularData?.positions) {
            regularData.positions.forEach((pos) => {
                // Extract tokenId from the position id (format: "tokenId#blockNumber")
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

                allPositions.push({
                    tokenId,
                    nonce: 0n,
                    operator: "0x0000000000000000000000000000000000000000",
                    token0: pos.pool.token0.id,
                    token1: pos.pool.token1.id,
                    fee: pos.pool.fee,
                    tickLower: Number(pos.tickLower.tickIdx),
                    tickUpper: Number(pos.tickUpper.tickIdx),
                    liquidity: safeConvertToBigInt(pos.liquidity),
                    feeGrowthInside0LastX128: safeConvertToBigInt(pos.feeGrowthInside0LastX128),
                    feeGrowthInside1LastX128: safeConvertToBigInt(pos.feeGrowthInside1LastX128),
                    tokensOwed0: 0n,
                    tokensOwed1: 0n,
                    onFarming: false, // Regular positions are not farming
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
                });
            });
        }
        
        // Add farming positions with position data
        if (farmingData?.deposits) {
            // Create a map of position data by ID
            const positionMap = new Map();
            if (farmingPositionsData?.positions) {
                farmingPositionsData.positions.forEach(pos => {
                    positionMap.set(pos.id, pos);
                });
            }

            // Track deposits without matching positions for debugging
            const depositsWithoutPositions: string[] = [];

            farmingData.deposits.forEach((deposit) => {
                // The deposit.id is the actual NFT Token ID (per schema comment)
                const tokenId = safeConvertToBigInt(deposit.id);
                const positionData = positionMap.get(deposit.id);
                
                // Log warning if position data is missing
                if (!positionData && farmingPositionsData?.positions) {
                    depositsWithoutPositions.push(deposit.id);
                }
                
                allPositions.push({
                    tokenId,
                    nonce: 0n,
                    operator: "0x0000000000000000000000000000000000000000",
                    token0: deposit.pool.token0.id,
                    token1: deposit.pool.token1.id,
                    fee: deposit.pool.fee,
                    tickLower: positionData ? Number(positionData.tickLower.tickIdx) : 0,
                    tickUpper: positionData ? Number(positionData.tickUpper.tickIdx) : 0,
                    liquidity: safeConvertToBigInt(deposit.liquidity),
                    feeGrowthInside0LastX128: positionData ? safeConvertToBigInt(positionData.feeGrowthInside0LastX128) : 0n,
                    feeGrowthInside1LastX128: positionData ? safeConvertToBigInt(positionData.feeGrowthInside1LastX128) : 0n,
                    tokensOwed0: 0n,
                    tokensOwed1: 0n,
                    onFarming: true, // Mark as farming position
                    // Additional fields from position data
                    pool: deposit.pool,
                    depositedToken0: positionData?.depositedToken0,
                    depositedToken1: positionData?.depositedToken1,
                    withdrawnToken0: positionData?.withdrawnToken0,
                    withdrawnToken1: positionData?.withdrawnToken1,
                    collectedFeesToken0: positionData?.collectedFeesToken0,
                    collectedFeesToken1: positionData?.collectedFeesToken1,
                    token0Tvl: positionData?.token0Tvl,
                    token1Tvl: positionData?.token1Tvl,
                    timestamp: undefined,
                });
            });
            
            // Log warning if any deposits don't have matching positions
            if (depositsWithoutPositions.length > 0) {
                console.warn(
                    `Found ${depositsWithoutPositions.length} farming deposits without matching position data:`,
                    depositsWithoutPositions
                );
                console.warn('These positions will use fallback TVL calculation based on pool share.');
            }
        }
        
        return allPositions.length > 0 ? allPositions : undefined;
    }, [regularData, farmingData, farmingPositionsData]);

    return {
        positions,
        loading: regularLoading || farmingLoading || farmingPositionsLoading,
        error: (regularError || farmingError || farmingPositionsError) as Error | undefined,
        refetch: () => {
            refetchRegular();
            refetchFarming();
        },
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