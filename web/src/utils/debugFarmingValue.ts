import { Deposit } from '../models/interfaces';

/**
 * Debug helper to log farming position data
 */
export function debugFarmingPosition(position: Deposit, label: string = 'Position') {
    console.group(`🔍 ${label} Debug`);
    
    console.log('Position ID:', position.id);
    console.log('Liquidity:', position.liquidity?.toString());
    console.log('Tick Lower:', position.tickLower);
    console.log('Tick Upper:', position.tickUpper);
    
    if (position.pool) {
        console.group('Pool Data:');
        console.log('Pool ID:', position.pool.id);
        console.log('Pool Liquidity:', position.pool.liquidity);
        console.log('Pool SqrtPrice:', position.pool.sqrtPrice);
        console.log('Pool Tick:', position.pool.tick);
        console.log('Pool TVL USD:', position.pool.totalValueLockedUSD);
        
        if (position.pool.token0) {
            console.log('Token0:', {
                symbol: position.pool.token0.symbol,
                decimals: position.pool.token0.decimals,
                derivedMatic: position.pool.token0.derivedMatic,
                price: position.pool.token0Price
            });
        }
        
        if (position.pool.token1) {
            console.log('Token1:', {
                symbol: position.pool.token1.symbol,
                decimals: position.pool.token1.decimals,
                derivedMatic: position.pool.token1.derivedMatic,
                price: position.pool.token1Price
            });
        }
        console.groupEnd();
    }
    
    console.groupEnd();
}