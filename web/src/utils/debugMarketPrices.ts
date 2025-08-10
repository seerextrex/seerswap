import { Pool, Market } from './market';
import { calculateOutcomeProbabilities, getPoolPriceDetails } from './marketPrices';

/**
 * Debug function to log market prices
 * Use this in components to see the actual prices being calculated
 */
export function logMarketPrices(market: Market, pools: Pool[]) {
  console.group(`📊 Market: ${market.marketName}`);
  
  // Log basic market info
  console.log('Market ID:', market.id);
  console.log('Collateral Token:', market.collateralToken?.symbol || 'Unknown');
  console.log('Outcomes:', market.outcomes);
  console.log('Number of Pools:', pools.length);
  
  // Log aggregated probabilities
  const probabilities = calculateOutcomeProbabilities(pools, market);
  if (probabilities) {
    console.group('📈 Aggregated Outcome Probabilities:');
    market.outcomes.forEach((outcome, index) => {
      const prob = probabilities[index] || 0;
      const price = prob / 100; // Convert percentage to price
      console.log(`  ${outcome}: ${price.toFixed(4)} ${market.collateralToken?.symbol || 'collateral'} (${prob.toFixed(1)}%)`);
    });
    console.groupEnd();
  }
  
  // Log individual pool details
  const poolDetails = getPoolPriceDetails(pools, market);
  if (poolDetails.length > 0) {
    console.group('💧 Individual Pool Prices:');
    poolDetails.forEach(detail => {
      console.log(`  Pool ${detail.poolId.slice(0, 8)}...`);
      console.log(`    Outcome: ${detail.outcomeName} (${detail.outcomeToken})`);
      console.log(`    Price: ${detail.price.toFixed(4)} ${detail.collateralToken}`);
      console.log(`    Liquidity: ${detail.liquidity}`);
      console.log(`    Tick: ${detail.tick}`);
    });
    console.groupEnd();
  }
  
  console.groupEnd();
}

/**
 * Create a summary table of all market prices
 */
export function createMarketPriceSummary(markets: Array<{ market: Market; pools: Pool[] }>) {
  const summary: Array<{
    marketName: string;
    outcome: string;
    price: number;
    probability: number;
    collateral: string;
  }> = [];

  markets.forEach(({ market, pools }) => {
    const probabilities = calculateOutcomeProbabilities(pools, market);
    if (probabilities && market.outcomes) {
      market.outcomes.forEach((outcome, index) => {
        const probability = probabilities[index] || 0;
        const price = probability / 100;
        summary.push({
          marketName: market.marketName,
          outcome,
          price,
          probability,
          collateral: market.collateralToken?.symbol || 'Unknown'
        });
      });
    }
  });

  return summary;
}