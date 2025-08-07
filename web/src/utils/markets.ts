import { Market } from '../state/data/generated';
import { Deposit } from '../models/interfaces';

export interface ConditionalMarketRelationship {
    parentMarket: Market;
    childMarket: Market;
    relationship: 'parent-child';
}

/**
 * Detects if a pool represents a conditional market relationship
 * Based on the logic from EternalFarmsPage
 * 
 * @param position - The deposit position to check
 * @returns The parent-child relationship if found, null otherwise
 */
export function detectConditionalMarketRelationship(position: Deposit): ConditionalMarketRelationship | null {
    const market0 = position.pool?.market0;
    const market1 = position.pool?.market1;
    
    // If we don't have both markets, check for simple parent-child relationship
    if (!market0 && !market1) return null;
    
    if (!market1) {
        // Only market0 is available - check if it has a parent
        if (market0?.parentMarket?.id) {
            return {
                parentMarket: market0.parentMarket as Market,
                childMarket: market0,
                relationship: 'parent-child' as const
            };
        }
        return null;
    }
    
    // Both markets are available - use the same logic as farms
    if (!market0 || !market1) return null;
    
    // Get token IDs for both markets
    const market0TokenIds = market0.tokens?.map((t: any) => t.id) || [];
    const market1TokenIds = market1.tokens?.map((t: any) => t.id) || [];
    const market0CollateralId = market0.collateralToken?.id;
    const market1CollateralId = market1.collateralToken?.id;
    
    // Check collateral token relationships
    const market0UsesMarket1Token = market0CollateralId && market1TokenIds.includes(market0CollateralId);
    const market1UsesMarket0Token = market1CollateralId && market0TokenIds.includes(market1CollateralId);
    
    // Determine parent-child relationship
    let parentMarket: Market | null = null;
    let childMarket: Market | null = null;
    
    if (market1UsesMarket0Token) {
        // market0 is parent, market1 is child
        parentMarket = market0;
        childMarket = market1;
    } else if (market0UsesMarket1Token) {
        // market1 is parent, market0 is child
        parentMarket = market1;
        childMarket = market0;
    } else {
        // Check explicit parent-child relationships
        if (market0.parentMarket?.id === market1.id) {
            parentMarket = market1;
            childMarket = market0;
        } else if (market1.parentMarket?.id === market0.id) {
            parentMarket = market0;
            childMarket = market1;
        }
    }
    
    if (parentMarket && childMarket) {
        return {
            parentMarket,
            childMarket,
            relationship: 'parent-child' as const
        };
    }
    
    return null;
}

/**
 * Detects if a farm has a conditional market relationship
 * Used in the farms page
 * 
 * @param farm - The farm data with pool.market0 and pool.market1
 * @returns The parent-child relationship if found, null otherwise
 */
export function detectFarmConditionalMarket(farm: any): ConditionalMarketRelationship | null {
    const market0: Market | null | undefined = farm.pool?.market0;
    const market1: Market | null | undefined = farm.pool?.market1;

    if (!market0 || !market1) return null;

    // Get token IDs for both markets
    const market0TokenIds = market0.tokens?.map((t: any) => t.id) || [];
    const market1TokenIds = market1.tokens?.map((t: any) => t.id) || [];
    const market0CollateralId = market0.collateralToken?.id;
    const market1CollateralId = market1.collateralToken?.id;

    // Strategy 1: Check collateral token relationships
    const market0UsesMarket1Token = market0CollateralId && market1TokenIds.includes(market0CollateralId);
    const market1UsesMarket0Token = market1CollateralId && market0TokenIds.includes(market1CollateralId);

    // Strategy 2: Check explicit parent-child relationships
    const market0HasChildMarkets = market0.childMarkets && market0.childMarkets.length > 0;
    const market1HasChildMarkets = market1.childMarkets && market1.childMarkets.length > 0;
    const market0HasParent = !!market0.parentMarket?.id;
    const market1HasParent = !!market1.parentMarket?.id;

    // Strategy 3: Check if parent-child IDs match
    const market0IsParentOfMarket1 = market0HasChildMarkets && market0.childMarkets?.some((child: any) => child.id === market1.id);
    const market1IsParentOfMarket0 = market1HasChildMarkets && market1.childMarkets?.some((child: any) => child.id === market0.id);
    const market0IsChildOfMarket1 = market0HasParent && market0.parentMarket?.id === market1.id;
    const market1IsChildOfMarket0 = market1HasParent && market1.parentMarket?.id === market0.id;

    // Determine parent-child relationship with priority-based grouping
    let parentMarket: Market | null = null;
    let childMarket: Market | null = null;

    // PRIORITY 1: Direct collateral token relationships
    if (market1UsesMarket0Token) {
        parentMarket = market0;
        childMarket = market1;
    } else if (market0UsesMarket1Token) {
        parentMarket = market1;
        childMarket = market0;
    }
    // PRIORITY 2: Explicit parent-child ID relationships
    else if (market0IsParentOfMarket1 || market1IsChildOfMarket0) {
        parentMarket = market0;
        childMarket = market1;
    } else if (market1IsParentOfMarket0 || market0IsChildOfMarket1) {
        parentMarket = market1;
        childMarket = market0;
    }
    // PRIORITY 3: Schema indicators with validation
    else if (market0HasChildMarkets && market1HasParent) {
        if (!market1CollateralId || market0TokenIds.includes(market1CollateralId)) {
            parentMarket = market0;
            childMarket = market1;
        }
    } else if (market1HasChildMarkets && market0HasParent) {
        if (!market0CollateralId || market1TokenIds.includes(market0CollateralId)) {
            parentMarket = market1;
            childMarket = market0;
        }
    }

    if (parentMarket && childMarket) {
        return {
            parentMarket,
            childMarket,
            relationship: 'parent-child' as const
        };
    }

    return null;
}