import { Deposit } from '../models/interfaces';

/**
 * Calculate token amounts for a concentrated liquidity position
 * Based on Uniswap V3 math
 */
function getTokenAmounts(
    liquidity: number,
    sqrtPriceX96: number,
    tickLower: number,
    tickUpper: number
): { amount0: number; amount1: number } {
    // Convert ticks to sqrt prices
    const sqrtRatioAX96 = Math.sqrt(1.0001 ** tickLower) * (2 ** 96);
    const sqrtRatioBX96 = Math.sqrt(1.0001 ** tickUpper) * (2 ** 96);
    
    let amount0 = 0;
    let amount1 = 0;
    
    // If current price is below the range
    if (sqrtPriceX96 <= sqrtRatioAX96) {
        // All liquidity is in token0
        amount0 = liquidity * (1 / sqrtRatioAX96 - 1 / sqrtRatioBX96) * (2 ** 96);
        amount1 = 0;
    }
    // If current price is above the range
    else if (sqrtPriceX96 >= sqrtRatioBX96) {
        // All liquidity is in token1
        amount0 = 0;
        amount1 = liquidity * (sqrtRatioBX96 - sqrtRatioAX96) / (2 ** 96);
    }
    // If current price is within the range
    else {
        // Liquidity is split between both tokens
        amount0 = liquidity * (1 / sqrtPriceX96 - 1 / sqrtRatioBX96) * (2 ** 96);
        amount1 = liquidity * (sqrtPriceX96 - sqrtRatioAX96) / (2 ** 96);
    }
    
    return { amount0, amount1 };
}

/**
 * Calculate the USD value of a farming position using token amounts method
 * This mimics Method 1 from the positions page but calculates token amounts from liquidity
 */
export function calculateFarmingPositionValueWithAmounts(position: Deposit): number | null {
    // Check if position has liquidity
    const liquidityString = position.liquidity?.toString() || '0';
    if (liquidityString === '0') {
        return 0;
    }
    
    const pool = position.pool;
    if (!pool || typeof pool === 'string') {
        return null;
    }
    
    // Check if we have all required data for token amount calculation
    if (
        position.tickLower === undefined || 
        position.tickUpper === undefined ||
        !pool.sqrtPrice ||
        !pool.token0?.derivedMatic ||
        !pool.token1?.derivedMatic
    ) {
        // Fall back to liquidity share method
        if (!pool.totalValueLockedUSD || !pool.liquidity) {
            return null;
        }
        
        const poolTVL = parseFloat(pool.totalValueLockedUSD);
        const poolLiquidity = parseFloat(pool.liquidity);
        const positionLiquidity = parseFloat(liquidityString);
        
        if (poolLiquidity <= 0 || poolTVL <= 0) {
            return null;
        }
        
        const positionShare = positionLiquidity / poolLiquidity;
        return Math.min(poolTVL * positionShare, poolTVL);
    }
    
    try {
        // Calculate token amounts from liquidity and ticks
        const liquidity = parseFloat(liquidityString);
        const sqrtPriceX96 = parseFloat(pool.sqrtPrice);
        
        const { amount0, amount1 } = getTokenAmounts(
            liquidity,
            sqrtPriceX96,
            position.tickLower,
            position.tickUpper
        );
        
        // Get token decimals
        const token0Decimals = parseInt(pool.token0.decimals || '18');
        const token1Decimals = parseInt(pool.token1.decimals || '18');
        
        // Convert to human-readable amounts
        const humanAmount0 = amount0 / (10 ** token0Decimals);
        const humanAmount1 = amount1 / (10 ** token1Decimals);
        
        // Get token prices in USD
        const token0Price = parseFloat(pool.token0.derivedMatic);
        const token1Price = parseFloat(pool.token1.derivedMatic);
        
        // Calculate USD value
        const value0USD = humanAmount0 * token0Price;
        const value1USD = humanAmount1 * token1Price;
        const totalValue = value0USD + value1USD;
        
        // Debug logging
        if (typeof window !== 'undefined' && window.location.search.includes('debug')) {
            console.log('Farming position value (with token amounts):', {
                positionId: position.id,
                tickLower: position.tickLower,
                tickUpper: position.tickUpper,
                currentTick: pool.tick,
                amount0: humanAmount0,
                amount1: humanAmount1,
                token0Price,
                token1Price,
                value0USD,
                value1USD,
                totalValue,
                token0Symbol: pool.token0.symbol,
                token1Symbol: pool.token1.symbol
            });
        }
        
        // Sanity check
        if (!isNaN(totalValue) && totalValue >= 0 && totalValue < 1e12) {
            return totalValue;
        }
        
        // If calculation seems wrong, fall back to liquidity share
        if (pool.totalValueLockedUSD && pool.liquidity) {
            const poolTVL = parseFloat(pool.totalValueLockedUSD);
            const poolLiquidity = parseFloat(pool.liquidity);
            const positionShare = liquidity / poolLiquidity;
            return Math.min(poolTVL * positionShare, poolTVL);
        }
        
        return null;
    } catch (error) {
        console.warn('Error calculating token amounts:', error);
        
        // Fall back to liquidity share method
        if (pool.totalValueLockedUSD && pool.liquidity) {
            const poolTVL = parseFloat(pool.totalValueLockedUSD);
            const poolLiquidity = parseFloat(pool.liquidity);
            const positionLiquidity = parseFloat(liquidityString);
            const positionShare = positionLiquidity / poolLiquidity;
            return Math.min(poolTVL * positionShare, poolTVL);
        }
        
        return null;
    }
}

/**
 * Calculate total value for multiple farming positions
 */
export function calculateTotalFarmingValueWithAmounts(positions: Deposit[]): number {
    return positions.reduce((total, position) => {
        const value = calculateFarmingPositionValueWithAmounts(position);
        return total + (value || 0);
    }, 0);
}