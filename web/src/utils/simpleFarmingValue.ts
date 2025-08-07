import { Deposit } from '../models/interfaces';
import { BigNumber } from '@ethersproject/bignumber';

/**
 * Simple and conservative farming position value calculation
 * Uses the same approach as the positions page but adapted for farming data
 */
export function calculateSimpleFarmingValue(position: Deposit): number {
    try {
        const pool = position.pool;
        if (!pool || typeof pool === 'string') {
            console.log('Position has no pool data or pool is string:', position.id, pool);
            return 0;
        }
        
        // Check if position has liquidity
        const positionLiquidity = position.liquidity ? 
            (typeof position.liquidity === 'string' ? 
                parseFloat(position.liquidity) : 
                Number(position.liquidity)) : 0;
                
        if (positionLiquidity <= 0) return 0;
        
        // Get pool's total value locked
        const poolTVL = parseFloat(pool.totalValueLockedUSD || '0');
        if (poolTVL <= 0) return 0;
        
        // Get pool's total liquidity
        const poolLiquidity = parseFloat(pool.liquidity || '0');
        if (poolLiquidity <= 0) return 0;
        
        // Calculate position's share of the pool
        // This is the most conservative approach
        const liquidityShare = positionLiquidity / poolLiquidity;
        const positionValue = poolTVL * liquidityShare;
        
        // Debug log
        console.log('Position value calc:', {
            id: position.id,
            positionLiquidity,
            poolLiquidity,
            poolTVL,
            liquidityShare,
            positionValue
        });
        
        // Sanity check - if value seems unreasonable, return 0
        if (positionValue < 0 || positionValue > 1e9 || !isFinite(positionValue)) {
            return 0;
        }
        
        return positionValue;
    } catch (error) {
        console.warn('Error calculating farming position value:', error);
        return 0;
    }
}

/**
 * Calculate total value for multiple positions
 */
export function calculateSimpleFarmingTotalValue(positions: Deposit[]): number {
    return positions.reduce((total, position) => {
        return total + calculateSimpleFarmingValue(position);
    }, 0);
}