/**
 * Test file to verify price calculations are correct
 * Run this in browser console to verify the logic
 */

import { tickToPrice } from './marketPrices';

export function testPriceCalculations() {
  console.log('=== Testing Price Calculations ===\n');
  
  // Test Case 1: Tick = 0 (price should be 1:1)
  console.log('Test 1: Tick = 0 (balanced pool)');
  const [p0_1, p1_1] = tickToPrice(0);
  console.log(`  price0 (token0/token1): ${p0_1.toFixed(4)}`);
  console.log(`  price1 (token1/token0): ${p1_1.toFixed(4)}`);
  console.assert(Math.abs(p0_1 - 1) < 0.0001, 'Price0 should be ~1 at tick 0');
  console.assert(Math.abs(p1_1 - 1) < 0.0001, 'Price1 should be ~1 at tick 0');
  
  // Test Case 2: Positive tick (token0 is more valuable)
  console.log('\nTest 2: Tick = 6932 (~2x price)');
  const [p0_2, p1_2] = tickToPrice(6932);
  console.log(`  price0 (token0/token1): ${p0_2.toFixed(4)}`);
  console.log(`  price1 (token1/token0): ${p1_2.toFixed(4)}`);
  console.assert(Math.abs(p0_2 - 2) < 0.01, 'Price0 should be ~2 at tick 6932');
  console.assert(Math.abs(p1_2 - 0.5) < 0.01, 'Price1 should be ~0.5 at tick 6932');
  
  // Test Case 3: Negative tick (token1 is more valuable)
  console.log('\nTest 3: Tick = -6932 (~0.5x price)');
  const [p0_3, p1_3] = tickToPrice(-6932);
  console.log(`  price0 (token0/token1): ${p0_3.toFixed(4)}`);
  console.log(`  price1 (token1/token0): ${p1_3.toFixed(4)}`);
  console.assert(Math.abs(p0_3 - 0.5) < 0.01, 'Price0 should be ~0.5 at tick -6932');
  console.assert(Math.abs(p1_3 - 2) < 0.01, 'Price1 should be ~2 at tick -6932');
  
  // Example scenario for prediction market
  console.log('\n=== Prediction Market Example ===\n');
  
  // Scenario: Token0 is "YES" outcome, Token1 is USDC collateral
  console.log('Scenario: Token0 = YES outcome, Token1 = USDC collateral');
  console.log('Market believes YES has 70% chance (should cost ~0.7 USDC)\n');
  
  // At what tick would YES cost 0.7 USDC?
  // We want: USDC/YES = 0.7
  // Since token0 is YES and token1 is USDC: USDC/YES = token1/token0 = price1
  // So we need price1 = 0.7, which means price0 = 1/0.7 = 1.4286
  // tick = log(1.4286) / log(1.0001) ≈ 3566
  
  const tickFor70Percent = 3566;
  const [p0_ex, p1_ex] = tickToPrice(tickFor70Percent);
  console.log(`Tick ${tickFor70Percent}:`);
  console.log(`  price0 (YES/USDC): ${p0_ex.toFixed(4)} YES per USDC`);
  console.log(`  price1 (USDC/YES): ${p1_ex.toFixed(4)} USDC per YES`);
  console.log(`  Outcome price: ${p1_ex.toFixed(4)} USDC (${(p1_ex * 100).toFixed(1)}% probability)`);
  
  console.log('\n✅ Price calculation tests complete!');
}

/**
 * Calculate the tick for a desired outcome price
 */
export function calculateTickForPrice(desiredOutcomePrice: number, isToken0Outcome: boolean): number {
  // desiredOutcomePrice is in terms of collateral/outcome
  
  if (isToken0Outcome) {
    // Token0 is outcome, Token1 is collateral
    // We want price1 = desiredOutcomePrice
    // price1 = 1/price0, so price0 = 1/desiredOutcomePrice
    // tick = log(price0) / log(1.0001)
    const price0 = 1 / desiredOutcomePrice;
    return Math.round(Math.log(price0) / Math.log(1.0001));
  } else {
    // Token1 is outcome, Token0 is collateral
    // We want price0 = desiredOutcomePrice
    // tick = log(price0) / log(1.0001)
    return Math.round(Math.log(desiredOutcomePrice) / Math.log(1.0001));
  }
}