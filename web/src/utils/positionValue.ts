import { Deposit } from '../models/interfaces';

/**
 * Calculates the USD value of a farming position
 * @param position - The farming position to calculate value for
 * @returns The estimated USD value of the position
 */
export function calculatePositionValue(position: Deposit): number {
    const pool = position.pool;
    if (!pool) return 0;
    
    // Get position and pool liquidity
    const positionLiquidity = Number(position.liquidity || 0);
    const poolLiquidity = parseFloat(pool.liquidity || '0');
    
    if (positionLiquidity <= 0 || poolLiquidity <= 0) return 0;
    
    // Calculate position's share of the pool
    const liquidityShare = positionLiquidity / poolLiquidity;
    
    // Priority 1: Use pool's totalValueLockedUSD if available
    if (pool.totalValueLockedUSD) {
        const poolTVL = parseFloat(pool.totalValueLockedUSD);
        return poolTVL * liquidityShare;
    }
    
    // Priority 2: Calculate from token amounts and prices
    if (pool.totalValueLockedToken0 && pool.totalValueLockedToken1 &&
        pool.token0Price && pool.token1Price) {
        const token0TVL = parseFloat(pool.totalValueLockedToken0) * parseFloat(pool.token0Price);
        const token1TVL = parseFloat(pool.totalValueLockedToken1) * parseFloat(pool.token1Price);
        const poolTVL = token0TVL + token1TVL;
        return poolTVL * liquidityShare;
    }
    
    // Fallback: Very rough estimate based on liquidity
    // Assumes $1 per 1e18 liquidity units
    return positionLiquidity / 1e18;
}

/**
 * Calculates the total USD value of multiple farming positions
 * @param positions - Array of farming positions
 * @returns The total estimated USD value
 */
export function calculateTotalPositionValue(positions: Deposit[]): number {
    return positions.reduce((total, position) => {
        return total + calculatePositionValue(position);
    }, 0);
}