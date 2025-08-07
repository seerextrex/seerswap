import { Deposit } from '../models/interfaces';
import { BigNumber } from '@ethersproject/bignumber';

/**
 * Calculates the USD value of a farming position using available data
 * Since farming positions don't have depositedToken0/1 and withdrawnToken0/1,
 * we need to use different calculation methods
 * 
 * @param position - The farming position to calculate value for
 * @returns The estimated USD value of the position
 */
export function calculateFarmingPositionValue(position: Deposit): number {
    const pool = position.pool;
    if (!pool) return 0;
    
    // Get position liquidity
    const positionLiquidity = Number(position.liquidity || 0);
    if (positionLiquidity <= 0) return 0;
    
    // Debug logging - remove after fixing
    if (typeof window !== 'undefined' && window.location.hash === '#debug') {
        console.log('Calculating value for position:', {
            id: position.id,
            liquidity: positionLiquidity,
            tickLower: position.tickLower,
            tickUpper: position.tickUpper,
            poolLiquidity: pool.liquidity,
            poolTVL: pool.totalValueLockedUSD,
            token0Price: pool.token0?.derivedMatic,
            token1Price: pool.token1?.derivedMatic,
            sqrtPrice: pool.sqrtPrice,
            tick: pool.tick
        });
    }
    
    // Get token prices in USD (derivedMatic is actually USD price)
    const token0Price = parseFloat(pool.token0?.derivedMatic || '0');
    const token1Price = parseFloat(pool.token1?.derivedMatic || '0');
    
    // If we have tick information and current price, we can calculate more accurately
    if (position.tickLower !== undefined && position.tickUpper !== undefined && pool.sqrtPrice) {
        try {
            // Calculate position value based on concentrated liquidity math
            const sqrtPrice = parseFloat(pool.sqrtPrice);
            const sqrtRatioA = Math.pow(1.0001, position.tickLower / 2);
            const sqrtRatioB = Math.pow(1.0001, position.tickUpper / 2);
            
            // Current price in terms of token1/token0
            const currentPrice = Math.pow(sqrtPrice / Math.pow(2, 96), 2);
            
            // Calculate token amounts based on liquidity and price range
            let amount0 = 0;
            let amount1 = 0;
            
            if (currentPrice < Math.pow(sqrtRatioA, 2)) {
                // Price is below range, all liquidity is in token0
                amount0 = positionLiquidity * (1 / sqrtRatioA - 1 / sqrtRatioB);
                amount1 = 0;
            } else if (currentPrice > Math.pow(sqrtRatioB, 2)) {
                // Price is above range, all liquidity is in token1  
                amount0 = 0;
                amount1 = positionLiquidity * (sqrtRatioB - sqrtRatioA);
            } else {
                // Price is in range, liquidity is split between both tokens
                const sqrtPriceCurrent = Math.sqrt(currentPrice);
                amount0 = positionLiquidity * (1 / sqrtPriceCurrent - 1 / sqrtRatioB);
                amount1 = positionLiquidity * (sqrtPriceCurrent - sqrtRatioA);
            }
            
            // Convert to proper decimals
            const token0Decimals = parseInt(pool.token0?.decimals || '18');
            const token1Decimals = parseInt(pool.token1?.decimals || '18');
            
            // Adjust for decimals and calculate USD value
            const value0USD = (amount0 / Math.pow(10, token0Decimals)) * token0Price;
            const value1USD = (amount1 / Math.pow(10, token1Decimals)) * token1Price;
            
            const totalValue = value0USD + value1USD;
            
            // Sanity check - if the calculated value seems unreasonable, fall back
            if (totalValue > 0 && totalValue < 1e12) { // Less than $1 trillion :)
                return totalValue;
            }
        } catch (error) {
            console.warn('Error calculating concentrated liquidity position value:', error);
        }
    }
    
    // Fallback method 1: Use pool's totalValueLockedUSD and liquidity share
    // This is less accurate for concentrated positions but better than nothing
    if (pool.totalValueLockedUSD && pool.liquidity) {
        const poolLiquidity = parseFloat(pool.liquidity);
        if (poolLiquidity > 0) {
            const poolTVL = parseFloat(pool.totalValueLockedUSD);
            const liquidityShare = positionLiquidity / poolLiquidity;
            
            // For concentrated liquidity, positions in range have higher value per liquidity
            // We apply a rough multiplier based on typical concentrated position efficiency
            // Most positions are 2-10x more capital efficient than full range
            const concentrationMultiplier = 3; // Conservative estimate
            
            return poolTVL * liquidityShare * concentrationMultiplier;
        }
    }
    
    // Fallback method 2: Very rough estimate based on liquidity
    // Use token prices if available to make a better guess
    if (token0Price > 0 || token1Price > 0) {
        const avgPrice = (token0Price + token1Price) / 2;
        // Rough conversion assuming liquidity represents value
        return (positionLiquidity / 1e18) * avgPrice * 2; // *2 because liquidity is split between two tokens
    }
    
    // Last resort: Basic liquidity estimate
    return positionLiquidity / 1e18;
}

/**
 * Calculates the total USD value of multiple farming positions
 * @param positions - Array of farming positions
 * @returns The total estimated USD value
 */
export function calculateTotalFarmingPositionValue(positions: Deposit[]): number {
    return positions.reduce((total, position) => {
        return total + calculateFarmingPositionValue(position);
    }, 0);
}