import { Deposit } from '../models/interfaces';
import { SqrtPriceMath } from '../lib/src/utils/sqrtPriceMath';
import { TickMath } from '../lib/src/utils/tickMath';
import JSBI from 'jsbi';

/**
 * Result of position value calculation including metadata about why it might be zero
 */
export interface PositionValueResult {
    value: number;
    hasError?: boolean;
    missingPriceData?: boolean;
    errorReason?: string;
}

/**
 * Calculate position value using the EXACT same logic as the individual position page
 * Returns both the value and metadata about the calculation
 */
export function calculateFarmingPositionValueWithMetadata(position: Deposit): PositionValueResult {
    try {
        const pool = position.pool;
        if (!pool || typeof pool === 'string') {
            console.log(`Position ${position.id}: Pool not loaded, pool value:`, pool);
            return { value: 0, hasError: true, errorReason: 'Pool data not loaded' };
        }
        
        // Check if we have mint data with ticks
        const tickLower = position.mint?.tickLower ?? position.tickLower;
        const tickUpper = position.mint?.tickUpper ?? position.tickUpper;
        
        console.log(`Position ${position.id} data:`, {
            liquidity: position.liquidity,
            tickLower,
            tickUpper,
            mintTickLower: position.mint?.tickLower,
            mintTickUpper: position.mint?.tickUpper,
            directTickLower: position.tickLower,
            directTickUpper: position.tickUpper,
            poolSqrtPrice: pool.sqrtPrice,
            poolTick: pool.tick,
            token0Price: pool.token0?.derivedMatic,
            token1Price: pool.token1?.derivedMatic
        });
        
        // Check required fields
        if (
            !position.liquidity ||
            tickLower == null ||
            tickUpper == null ||
            !pool.sqrtPrice ||
            pool.tick == null
        ) {
            return { value: 0, hasError: true, errorReason: 'Missing position or pool data' };
        }
        
        // Convert values - use mint ticks if available, otherwise use direct ticks
        const liquidity = JSBI.BigInt(position.liquidity.toString());
        const tickCurrent = parseInt(pool.tick);
        // tickLower and tickUpper are already set above from mint or direct data
        
        // Get sqrt price ratios
        const sqrtRatioX96 = JSBI.BigInt(pool.sqrtPrice);
        const sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower);
        const sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper);
        
        let amount0: JSBI;
        let amount1: JSBI;
        
        // Calculate token amounts based on tick position (same as Position class)
        if (tickCurrent < tickLower) {
            // Below range: all in token0
            amount0 = SqrtPriceMath.getAmount0Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, false);
            amount1 = JSBI.BigInt(0);
        } else if (tickCurrent < tickUpper) {
            // In range: split between tokens
            amount0 = SqrtPriceMath.getAmount0Delta(sqrtRatioX96, sqrtRatioBX96, liquidity, false);
            amount1 = SqrtPriceMath.getAmount1Delta(sqrtRatioAX96, sqrtRatioX96, liquidity, false);
        } else {
            // Above range: all in token1
            amount0 = JSBI.BigInt(0);
            amount1 = SqrtPriceMath.getAmount1Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, false);
        }
        
        // Convert to human-readable numbers
        const token0Decimals = parseInt(pool.token0?.decimals || '18');
        const token1Decimals = parseInt(pool.token1?.decimals || '18');
        
        const humanAmount0 = parseFloat(amount0.toString()) / Math.pow(10, token0Decimals);
        const humanAmount1 = parseFloat(amount1.toString()) / Math.pow(10, token1Decimals);
        
        // Get token prices and calculate USD value
        const token0Price = parseFloat(pool.token0?.derivedMatic || '0');
        const token1Price = parseFloat(pool.token1?.derivedMatic || '0');
        
        // Check if we have price data
        const hasPriceData = token0Price > 0 || token1Price > 0;
        
        const totalValue = (humanAmount0 * token0Price) + (humanAmount1 * token1Price);
        
        console.log(`Position ${position.id} calculation:`, {
            amount0: amount0.toString(),
            amount1: amount1.toString(),
            humanAmount0,
            humanAmount1,
            token0Price,
            token1Price,
            totalValue,
            tickCurrent,
            tickLower,
            tickUpper,
            inRange: tickCurrent >= tickLower && tickCurrent < tickUpper
        });
        
        // Return 0 if calculation seems wrong
        if (!isFinite(totalValue) || totalValue < 0 || totalValue > 1e12) {
            return { 
                value: 0, 
                hasError: true, 
                errorReason: 'Invalid calculation result' 
            };
        }
        
        // If value is 0 but we have amounts, it might be missing price data
        if (totalValue === 0 && (humanAmount0 > 0 || humanAmount1 > 0) && !hasPriceData) {
            return { 
                value: 0, 
                missingPriceData: true,
                errorReason: 'Token price data not available'
            };
        }
        
        return { value: totalValue };
    } catch (error) {
        return { 
            value: 0, 
            hasError: true, 
            errorReason: 'Calculation failed' 
        };
    }
}

/**
 * Calculate position value using the EXACT same logic as the individual position page
 * This is a cleaned up version without debug logging
 */
export function calculateFarmingPositionValue(position: Deposit): number {
    const result = calculateFarmingPositionValueWithMetadata(position);
    return result.value;
}

/**
 * Calculate total value for multiple positions
 */
export function calculateTotalFarmingValue(positions: Deposit[]): number {
    return positions.reduce((total, position) => {
        return total + calculateFarmingPositionValue(position);
    }, 0);
}