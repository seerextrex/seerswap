import { useMemo, useState } from "react";
import { 
    UseGroupedFarmingPositionsParams, 
    UseGroupedFarmingPositionsResult, 
    GroupedPositions, 
    MarketGroup,
    ChildMarketGroup 
} from "./types";
import { Market } from "../../state/data/generated";
import { calculateFarmingPositionValue, calculateTotalFarmingValue } from "../../utils/farmingPositionSimpleSDK";

export const useGroupedFarmingPositions = ({ 
    positions, 
    isConditionalMarketPool 
}: UseGroupedFarmingPositionsParams): UseGroupedFarmingPositionsResult => {
    const [sortBy, setSortBy] = useState<'name' | 'tvl' | 'positions' | 'rewards'>('tvl');

    // Group positions by market with hierarchical structure for conditional markets
    const groupedPositions = useMemo((): GroupedPositions => {
        if (!positions || positions.length === 0) return {};

        // Step 1: Build a complete map of all markets and their positions
        const marketMap = new Map<string, {
            market: Market;
            positions: typeof positions;
            parentId?: string;
        }>();
        
        // First pass: Collect all markets and their positions
        positions.forEach((position) => {
            const conditionalRelationship = isConditionalMarketPool(position);
            
            if (conditionalRelationship) {
                const { parentMarket, childMarket } = conditionalRelationship;
                
                // Add parent market
                const parentId = parentMarket.id;
                if (!marketMap.has(parentId)) {
                    marketMap.set(parentId, {
                        market: parentMarket,
                        positions: []
                    });
                }
                
                // Add child market with parent reference
                const childId = childMarket.id;
                if (!marketMap.has(childId)) {
                    marketMap.set(childId, {
                        market: childMarket,
                        positions: [],
                        parentId: parentId
                    });
                } else {
                    // Update parent reference if not set
                    const existing = marketMap.get(childId)!;
                    if (!existing.parentId) {
                        existing.parentId = parentId;
                    }
                }
                
                // Add position to child market
                marketMap.get(childId)!.positions.push(position);
            } else {
                // Regular market or standalone market
                const market = position.pool?.market0 || position.pool?.market1;
                if (market) {
                    const marketId = market.id;
                    
                    if (!marketMap.has(marketId)) {
                        // Check if this market has a parent
                        const parentId = market.parentMarket?.id;
                        
                        marketMap.set(marketId, {
                            market: market,
                            positions: [],
                            parentId: parentId
                        });
                        
                        // If it has a parent, ensure parent exists in map
                        if (parentId && !marketMap.has(parentId)) {
                            const parentMarket = market.parentMarket as Market;
                            marketMap.set(parentId, {
                                market: parentMarket,
                                positions: []
                            });
                        }
                    }
                    
                    marketMap.get(marketId)!.positions.push(position);
                }
            }
        });
        
        // Step 2: Build hierarchical structure
        const groups: GroupedPositions = {};
        
        marketMap.forEach((marketData, marketId) => {
            const { market, positions: marketPositions, parentId } = marketData;
            
            // Calculate TVL (sum of position values) and rewards for this market's positions
            const totalTVL = calculateTotalFarmingValue(marketPositions);
            let totalEarnedRewards = 0;
            
            marketPositions.forEach(position => {
                // Sum up earned rewards
                const eternalEarned = parseFloat(String(position.eternalEarned || '0'));
                const eternalBonusEarned = parseFloat(String(position.eternalBonusEarned || '0'));
                totalEarnedRewards += eternalEarned + eternalBonusEarned;
            });
            
            if (parentId && marketMap.has(parentId)) {
                // This is a child market - add it under its parent
                const parentMarketData = marketMap.get(parentId)!;
                const parentKey = `${parentId}-${parentMarketData.market.marketName}`;
                
                // Ensure parent group exists
                if (!groups[parentKey]) {
                    groups[parentKey] = {
                        marketName: parentMarketData.market.marketName,
                        marketId: parentId,
                        market: parentMarketData.market,
                        positions: [],
                        totalTVL: 0,
                        totalEarnedRewards: 0,
                        isParent: true,
                        childMarkets: {}
                    };
                }
                
                // Add child market
                const childKey = `${parentKey}-child-${marketId}`;
                groups[parentKey].childMarkets[childKey] = {
                    marketName: market.marketName,
                    marketId: marketId,
                    market: market,
                    positions: marketPositions,
                    totalTVL,
                    totalEarnedRewards,
                    isChild: true,
                    parentKey: parentKey
                };
                
                // Add child's totals to parent
                groups[parentKey].totalTVL += totalTVL;
                groups[parentKey].totalEarnedRewards += totalEarnedRewards;
                
            } else if (!Array.from(marketMap.values()).some(m => m.parentId === marketId)) {
                // This is a standalone market (not a child and not referenced as a parent)
                const marketKey = `${marketId}-${market.marketName}`;
                
                if (!groups[marketKey]) {
                    // Check if this market has child markets
                    const hasChildren = market.childMarkets && market.childMarkets.length > 0;
                    
                    groups[marketKey] = {
                        marketName: market.marketName,
                        marketId: marketId,
                        market: market,
                        positions: marketPositions,
                        totalTVL,
                        totalEarnedRewards,
                        isParent: hasChildren,
                        childMarkets: {}
                    };
                }
            } else {
                // This is a parent market that was referenced but might not have its own positions
                const marketKey = `${marketId}-${market.marketName}`;
                
                if (!groups[marketKey]) {
                    groups[marketKey] = {
                        marketName: market.marketName,
                        marketId: marketId,
                        market: market,
                        positions: marketPositions,
                        totalTVL,
                        totalEarnedRewards,
                        isParent: true,
                        childMarkets: {}
                    };
                }
            }
        });
        
        return groups;
    }, [positions, isConditionalMarketPool]);

    // Sort market keys based on selected criteria
    const sortedMarketKeys = useMemo(() => {
        const keys = Object.keys(groupedPositions);
        
        return keys.sort((a, b) => {
            const groupA = groupedPositions[a];
            const groupB = groupedPositions[b];
            
            switch (sortBy) {
                case 'tvl':
                    return groupB.totalTVL - groupA.totalTVL;
                case 'positions':
                    const positionsA = groupA.positions.length + 
                        Object.values(groupA.childMarkets).reduce((sum, child) => sum + child.positions.length, 0);
                    const positionsB = groupB.positions.length + 
                        Object.values(groupB.childMarkets).reduce((sum, child) => sum + child.positions.length, 0);
                    return positionsB - positionsA;
                case 'rewards':
                    return groupB.totalEarnedRewards - groupA.totalEarnedRewards;
                case 'name':
                default:
                    return groupA.marketName.localeCompare(groupB.marketName);
            }
        });
    }, [groupedPositions, sortBy]);

    return {
        groupedPositions,
        sortedMarketKeys,
        sortBy,
        setSortBy
    };
};