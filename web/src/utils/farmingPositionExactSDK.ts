import { Deposit } from '../models/interfaces';
import { BigNumber } from '@ethersproject/bignumber';
import { SqrtPriceMath } from '../lib/src/utils/sqrtPriceMath';
import { TickMath } from '../lib/src/utils/tickMath';
import JSBI from 'jsbi';

/**
 * Calculate token amounts for a farming position using the EXACT same math as the Position SDK
 * This matches what you see when you open an individual position
 */
export function getPositionTokenAmounts(position: Deposit): { amount0: number; amount1: number } | null {
    const pool = position.pool;
    if (!pool || typeof pool === 'string') return null;
    
    // Check required fields
    console.log('Checking position', position.id, {
        hasLiquidity: position.liquidity != null,
        liquidity: position.liquidity,
        hasTickLower: position.tickLower != null,
        tickLower: position.tickLower,
        hasTickUpper: position.tickUpper != null,
        tickUpper: position.tickUpper,
        hasSqrtPrice: !!pool.sqrtPrice,
        sqrtPrice: pool.sqrtPrice,
        hasTick: pool.tick != null,
        tick: pool.tick,
        poolData: pool
    });
    
    if (
        position.liquidity == null ||
        position.tickLower == null ||
        position.tickUpper == null ||
        !pool.sqrtPrice ||
        pool.tick == null
    ) {
        console.log('❌ Missing required fields for position', position.id);
        return null;
    }
    
    try {
        // Convert liquidity to JSBI
        const liquidity = JSBI.BigInt(position.liquidity.toString());
        
        // Get current pool tick
        const tickCurrent = parseInt(pool.tick);
        const tickLower = position.tickLower;
        const tickUpper = position.tickUpper;
        
        // Get sqrt price ratios
        const sqrtRatioX96 = JSBI.BigInt(pool.sqrtPrice);
        const sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower);
        const sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper);
        
        let amount0: JSBI;
        let amount1: JSBI;
        
        // Calculate token0 amount based on tick position (exact same logic as Position class)
        if (tickCurrent < tickLower) {
            // Current price is below the range, all liquidity is in token0
            amount0 = SqrtPriceMath.getAmount0Delta(
                sqrtRatioAX96,
                sqrtRatioBX96,
                liquidity,
                false
            );
            amount1 = JSBI.BigInt(0);
        } else if (tickCurrent < tickUpper) {
            // Current price is within the range
            amount0 = SqrtPriceMath.getAmount0Delta(
                sqrtRatioX96,
                sqrtRatioBX96,
                liquidity,
                false
            );
            amount1 = SqrtPriceMath.getAmount1Delta(
                sqrtRatioAX96,
                sqrtRatioX96,
                liquidity,
                false
            );
        } else {
            // Current price is above the range, all liquidity is in token1
            amount0 = JSBI.BigInt(0);
            amount1 = SqrtPriceMath.getAmount1Delta(
                sqrtRatioAX96,
                sqrtRatioBX96,
                liquidity,
                false
            );
        }
        
        // Convert to human-readable numbers
        const token0Decimals = parseInt(pool.token0?.decimals || '18');
        const token1Decimals = parseInt(pool.token1?.decimals || '18');
        
        const humanAmount0 = parseFloat(amount0.toString()) / Math.pow(10, token0Decimals);
        const humanAmount1 = parseFloat(amount1.toString()) / Math.pow(10, token1Decimals);
        
        return {
            amount0: humanAmount0,
            amount1: humanAmount1
        };
    } catch (error) {
        console.warn('Error calculating token amounts with SDK math:', error);
        return null;
    }
}

/**
 * Calculate USD value of a farming position using the exact SDK math for token amounts
 */
export function calculateFarmingPositionValueSDK(position: Deposit): number | null {
    const pool = position.pool;
    if (!pool || typeof pool === 'string') {
        console.log('Position', position.id, 'has no pool or pool is string');
        return null;
    }
    
    // Get token amounts using SDK math
    const amounts = getPositionTokenAmounts(position);
    if (!amounts) {
        console.log('Position', position.id, 'token amounts calculation failed, using fallback');
        // Fall back to liquidity share method if SDK calculation fails
        if (!pool.totalValueLockedUSD || !pool.liquidity) return null;
        
        const poolTVL = parseFloat(pool.totalValueLockedUSD);
        const poolLiquidity = parseFloat(pool.liquidity);
        const positionLiquidity = parseFloat(position.liquidity?.toString() || '0');
        
        if (poolLiquidity <= 0 || poolTVL <= 0) return null;
        
        const positionShare = positionLiquidity / poolLiquidity;
        return Math.min(poolTVL * positionShare, poolTVL);
    }
    
    // Get token prices
    const token0Price = parseFloat(pool.token0?.derivedMatic || '0');
    const token1Price = parseFloat(pool.token1?.derivedMatic || '0');
    
    // Calculate USD value
    const value0USD = amounts.amount0 * token0Price;
    const value1USD = amounts.amount1 * token1Price;
    const totalValue = value0USD + value1USD;
    
    // Debug logging
    if (typeof window !== 'undefined' && window.location.search.includes('debug')) {
        console.log('🎯 Farming position value (EXACT SDK calculation):', {
            positionId: position.id,
            tickLower: position.tickLower,
            tickUpper: position.tickUpper,
            currentTick: pool.tick,
            amount0: amounts.amount0,
            amount1: amounts.amount1,
            token0Symbol: pool.token0?.symbol,
            token1Symbol: pool.token1?.symbol,
            token0Price,
            token1Price,
            value0USD,
            value1USD,
            totalValue
        });
    }
    
    return totalValue;
}

/**
 * Calculate total value for multiple positions using SDK math
 */
export function calculateTotalFarmingValueSDK(positions: Deposit[]): number {
    return positions.reduce((total, position) => {
        const value = calculateFarmingPositionValueSDK(position);
        return total + (value || 0);
    }, 0);
}