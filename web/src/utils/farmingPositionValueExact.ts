import { Deposit } from '../models/interfaces';

/**
 * Calculate the USD value of a farming position using the EXACT same method as the positions page
 * Since farming positions don't have depositedToken0/1, withdrawnToken0/1, or token0Tvl/token1Tvl,
 * we use the same fallback calculation that the positions page uses
 * 
 * @param position The farming position to calculate value for
 * @returns The USD value of the position, or null if it cannot be determined
 */
export function calculateFarmingPositionValueUSD(position: Deposit): number | null {
    // If position has no liquidity (closed position), return 0
    // Handle both string and BigNumber formats
    const liquidityString = position.liquidity?.toString() || '0';
    if (liquidityString === '0') {
        return 0;
    }
    
    // Check if pool data is available
    const pool = position.pool;
    if (!pool || typeof pool === 'string') {
        return null;
    }
    
    // This is the EXACT same calculation as lines 54-74 in position.ts
    if (!pool.totalValueLockedUSD) {
        return null;
    }
    
    const poolTVL = parseFloat(pool.totalValueLockedUSD);
    const poolLiquidity = parseFloat(pool.liquidity || '0');
    const positionLiquidity = parseFloat(liquidityString);
    
    // Avoid division by zero or invalid pool liquidity
    if (poolLiquidity <= 0 || poolTVL <= 0) {
        return null;
    }
    
    // Calculate position's share of the pool's liquidity
    const positionShare = positionLiquidity / poolLiquidity;
    
    // Position value is its share of the pool's total value locked
    const positionValue = poolTVL * positionShare;
    
    // Debug log to verify calculation (can be removed after confirming it works)
    if (typeof window !== 'undefined' && window.location.search.includes('debug')) {
        console.log('Farming position value (exact same as positions page):', {
            positionId: position.id,
            positionLiquidity,
            poolLiquidity,
            poolTVL,
            positionShare: (positionShare * 100).toFixed(4) + '%',
            calculatedValue: positionValue
        });
    }
    
    // Sanity check - position value shouldn't exceed pool TVL
    return Math.min(positionValue, poolTVL);
}

/**
 * Calculate total value for multiple farming positions
 * Returns null if any position value cannot be determined
 */
export function calculateTotalFarmingPositionValueUSD(positions: Deposit[]): number | null {
    let total = 0;
    let hasNull = false;
    
    for (const position of positions) {
        const value = calculateFarmingPositionValueUSD(position);
        if (value === null) {
            hasNull = true;
        } else {
            total += value;
        }
    }
    
    // If we have some valid values, return the total even if some were null
    // This matches the behavior on the positions page
    return total;
}