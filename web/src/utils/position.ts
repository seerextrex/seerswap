import { PositionPool } from '../models/interfaces';
import { PositionPoolExtended } from '../hooks/useSubgraphPositionsV2';

/**
 * Calculate the USD value of a position
 * @param position The position to calculate value for
 * @returns The USD value of the position, or null if it cannot be determined
 */
export function calculatePositionValueUSD(position: PositionPool | PositionPoolExtended): number | null {
    const extendedPos = position as PositionPoolExtended;
    
    // If position has no liquidity (closed position), return 0
    if (position.liquidity === 0n || position.liquidity.toString() === '0') {
        return 0;
    }
    
    // Try to calculate using deposited/withdrawn amounts and token prices
    if (extendedPos.depositedToken0 !== undefined && 
        extendedPos.depositedToken1 !== undefined &&
        extendedPos.withdrawnToken0 !== undefined &&
        extendedPos.withdrawnToken1 !== undefined &&
        extendedPos.pool?.token0?.derivedMatic !== undefined &&
        extendedPos.pool?.token1?.derivedMatic !== undefined) {
        
        // Calculate net token amounts (deposited - withdrawn)
        const netToken0 = parseFloat(extendedPos.depositedToken0) - parseFloat(extendedPos.withdrawnToken0);
        const netToken1 = parseFloat(extendedPos.depositedToken1) - parseFloat(extendedPos.withdrawnToken1);
        
        // Get token prices in USD (derivedMatic is actually USD price on Gnosis)
        const token0PriceUSD = parseFloat(extendedPos.pool.token0.derivedMatic);
        const token1PriceUSD = parseFloat(extendedPos.pool.token1.derivedMatic);
        
        // Calculate value in USD directly
        const valueInUSD = (netToken0 * token0PriceUSD) + (netToken1 * token1PriceUSD);
        
        // Return the calculated value if it's valid
        if (!isNaN(valueInUSD) && valueInUSD >= 0) {
            return valueInUSD;
        }
    }
    
    // Try to use the direct TVL values from the subgraph if available
    if (extendedPos.token0Tvl !== undefined && extendedPos.token1Tvl !== undefined) {
        const token0Value = parseFloat(extendedPos.token0Tvl);
        const token1Value = parseFloat(extendedPos.token1Tvl);
        
        // If both values are valid numbers, return their sum
        if (!isNaN(token0Value) && !isNaN(token1Value)) {
            return token0Value + token1Value;
        }
    }
    
    // Fallback to pool share calculation if other methods are not available
    if (!extendedPos.pool || !extendedPos.pool.totalValueLockedUSD) {
        return null;
    }
    
    const poolTVL = parseFloat(extendedPos.pool.totalValueLockedUSD);
    const poolLiquidity = parseFloat(extendedPos.pool.liquidity || '0');
    const positionLiquidity = parseFloat(position.liquidity.toString());
    
    // Avoid division by zero or invalid pool liquidity
    if (poolLiquidity <= 0 || poolTVL <= 0) {
        return null;
    }
    
    // Calculate position's share of the pool's liquidity
    const positionShare = positionLiquidity / poolLiquidity;
    
    // Position value is its share of the pool's total value locked
    const positionValue = poolTVL * positionShare;
    
    // Sanity check - position value shouldn't exceed pool TVL
    return Math.min(positionValue, poolTVL);
}