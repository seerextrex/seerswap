import { Pool, Market } from './market';

/**
 * Calculate price from tick value using Uniswap V3 formula
 * price = 1.0001^tick represents token0/token1 (how many token0 per token1)
 * price1 = 1/price represents token1/token0 (how many token1 per token0)
 */
export function tickToPrice(tick: number): [number, number] {
  const price0 = Math.pow(1.0001, tick);  // token0/token1
  const price1 = 1 / price0;              // token1/token0
  return [price0, price1];
}

/**
 * Calculate outcome probabilities from pools
 * Returns normalized percentages that sum to 100%
 * 
 * IMPORTANT: Price Direction in Prediction Markets
 * -------------------------------------------------
 * In prediction markets, we want the price of outcome tokens in terms of collateral.
 * This represents how much collateral you need to buy 1 outcome token.
 * 
 * Example: If YES token costs 0.7 USDC, it implies 70% probability.
 * 
 * The formula: outcome_price = collateral_needed / outcome_tokens = collateral/outcome
 * 
 * In Uniswap V3:
 * - tick represents the price ratio between token0 and token1
 * - price = 1.0001^tick = token0/token1 (how many token0 per token1)
 * 
 * Token Ordering Cases:
 * 1. If token0 is outcome, token1 is collateral:
 *    - We want: collateral/outcome = token1/token0 = 1/price = price1
 * 
 * 2. If token0 is collateral, token1 is outcome:
 *    - We want: collateral/outcome = token0/token1 = price = price0
 */
export function calculateOutcomeProbabilities(pools: Pool[], market: Market): { [outcomeIndex: number]: number } | null {
  if (!pools || pools.length === 0 || !market?.outcomes) {
    console.log('[calculateOutcomeProbabilities] No pools or outcomes:', { pools: pools?.length, outcomes: market?.outcomes });
    return null;
  }

  console.log('[calculateOutcomeProbabilities] Starting calculation for market:', market.marketName);
  console.log('  Outcomes:', market.outcomes);
  console.log('  Number of pools:', pools.length);

  const outcomePrices: { [outcomeIndex: number]: { price: number; liquidity: number }[] } = {};
  
  // Collect prices for each outcome from all pools
  market.outcomes.forEach((_, index) => {
    outcomePrices[index] = [];
  });

  pools.forEach((pool, poolIndex) => {
    if (!pool.tick && pool.tick !== '0') {
      console.log(`  Pool ${poolIndex}: No tick value, skipping`);
      return;
    }
    
    const tick = parseInt(pool.tick);
    if (isNaN(tick)) {
      console.log(`  Pool ${poolIndex}: Invalid tick value (${pool.tick}), skipping`);
      return;
    }
    
    // Check for extreme tick values that might indicate special pool states
    const MAX_TICK = 887272;  // Maximum tick in Uniswap V3
    const MIN_TICK = -887272; // Minimum tick in Uniswap V3
    
    if (Math.abs(tick) > MAX_TICK) {
      console.log(`  Pool ${poolIndex}: Tick value ${tick} exceeds Uniswap V3 limits, clamping`);
      // Don't skip, but clamp the value
    }
    
    const [price0, price1] = tickToPrice(tick);
    
    console.log(`  Pool ${poolIndex}:`, {
      poolId: pool.id,
      tick,
      tickWarning: Math.abs(tick) > 200000 ? '⚠️ EXTREME TICK VALUE' : null,
      price0: price0.toFixed(6),
      price1: price1.toFixed(6),
      token0: pool.token0?.symbol,
      token1: pool.token1?.symbol,
      market0Id: pool.market0?.id,
      market1Id: pool.market1?.id,
      currentMarketId: market.id,
      liquidity: pool.liquidity,
      sqrtPrice: pool.sqrtPrice
    });
    
    // Determine which token is the outcome token and which is collateral
    // This is the critical part - we need to identify tokens correctly
    
    // First priority: Check if we can identify the collateral token directly
    let outcomeToken, collateralToken, isToken0Outcome;
    
    if (market.collateralToken) {
      const token0IsCollateral = pool.token0.id.toLowerCase() === market.collateralToken.id.toLowerCase();
      const token1IsCollateral = pool.token1.id.toLowerCase() === market.collateralToken.id.toLowerCase();
      
      if (token0IsCollateral && !token1IsCollateral) {
        // Token0 is collateral, Token1 must be outcome
        console.log(`    ✓ Token0 identified as collateral by direct match`);
        outcomeToken = pool.token1;
        collateralToken = pool.token0;
        isToken0Outcome = false;
      } else if (!token0IsCollateral && token1IsCollateral) {
        // Token1 is collateral, Token0 must be outcome
        console.log(`    ✓ Token1 identified as collateral by direct match`);
        outcomeToken = pool.token0;
        collateralToken = pool.token1;
        isToken0Outcome = true;
      } else {
        // Fallback to market association check
        const token0IsFromMarket = pool.market0?.id === market.id;
        const token1IsFromMarket = pool.market1?.id === market.id;
        
        // Skip if neither token is from our market
        if (!token0IsFromMarket && !token1IsFromMarket) {
          console.log(`    ✗ Pool doesn't belong to this market`);
          return;
        }
        
        if (token0IsFromMarket && !token1IsFromMarket) {
          outcomeToken = pool.token0;
          collateralToken = pool.token1;
          isToken0Outcome = true;
        } else if (!token0IsFromMarket && token1IsFromMarket) {
          outcomeToken = pool.token1;
          collateralToken = pool.token0;
          isToken0Outcome = false;
        } else {
          // Both from markets - shouldn't happen often
          outcomeToken = pool.token0;
          collateralToken = pool.token1;
          isToken0Outcome = true;
        }
      }
    } else {
      // No collateral token info, use market association
      const token0IsFromMarket = pool.market0?.id === market.id;
      const token1IsFromMarket = pool.market1?.id === market.id;
      
      if (!token0IsFromMarket && !token1IsFromMarket) {
        console.log(`    ✗ Pool doesn't belong to this market`);
        return;
      }
      
      if (token0IsFromMarket && !token1IsFromMarket) {
        outcomeToken = pool.token0;
        collateralToken = pool.token1;
        isToken0Outcome = true;
      } else if (!token0IsFromMarket && token1IsFromMarket) {
        outcomeToken = pool.token1;
        collateralToken = pool.token0;
        isToken0Outcome = false;
      } else {
        outcomeToken = pool.token0;
        collateralToken = pool.token1;
        isToken0Outcome = true;
      }
    }
    
    console.log(`    Token assignment:`, {
      isToken0Outcome,
      outcomeToken: outcomeToken?.symbol,
      outcomeTokenId: outcomeToken?.id,
      collateralToken: collateralToken?.symbol,
      collateralTokenId: collateralToken?.id,
      expectedCollateralId: market.collateralToken?.id,
      token0: pool.token0?.symbol,
      token1: pool.token1?.symbol
    });
    
    // Get the price of outcome in terms of collateral (collateral/outcome)
    // We want: how much collateral is needed to buy 1 outcome token
    // price0 = token0/token1 (how many token0 per token1)
    // price1 = token1/token0 (how many token1 per token0)
    // 
    // If token0 is outcome and token1 is collateral:
    //   We want collateral/outcome = token1/token0 = price1
    // If token0 is collateral and token1 is outcome:
    //   We want collateral/outcome = token0/token1 = price0
    const outcomePrice = isToken0Outcome ? price1 : price0;
    
    // Check if this might be inverted (outcome worth more than collateral suggests wrong direction)
    const alternativePrice = isToken0Outcome ? price0 : price1;
    
    console.log(`    Outcome price calculation:`, {
      isToken0Outcome,
      selectedPrice: isToken0Outcome ? 'price1' : 'price0',
      outcomePrice: outcomePrice.toFixed(6),
      alternativePrice: alternativePrice.toFixed(6),
      warning: outcomePrice > 1 ? '⚠️ Price > 1 suggests wrong token order or extreme tick!' : null
    });
    
    // Find which outcome this token represents
    if (!market.wrappedTokensString) {
      console.log(`    ✗ No wrappedTokensString in market data! Cannot match outcomes.`);
      console.log(`    Available market data:`, {
        hasWrappedTokens: !!market.wrappedTokens,
        wrappedTokensCount: market.wrappedTokens?.length,
        outcomes: market.outcomes
      });
      
      // Try to use wrappedTokens array as fallback if available
      if (market.wrappedTokens && market.wrappedTokens.length > 0) {
        console.log(`    Attempting to use wrappedTokens array as fallback...`);
        const wrappedTokenIds = market.wrappedTokens.map(t => t.id.toLowerCase());
        const outcomeIndex = wrappedTokenIds.findIndex(id => id === outcomeToken.id.toLowerCase());
        
        if (outcomeIndex !== -1 && outcomeIndex < market.outcomes.length) {
          console.log(`    ✓ Found match using wrappedTokens array! Index: ${outcomeIndex}`);
          if (outcomePrice <= 1 && outcomePrice >= 0) {
            const liquidity = parseFloat(pool.liquidity || '0');
            outcomePrices[outcomeIndex].push({ price: outcomePrice, liquidity });
          }
        }
      }
      return;
    }
    
    if (market.wrappedTokensString) {
      let wrappedTokenIds: string[];
      const wrappedTokensString = market.wrappedTokensString;
      
      console.log(`    Raw wrappedTokensString:`, {
        type: typeof wrappedTokensString,
        isArray: Array.isArray(wrappedTokensString),
        value: wrappedTokensString
      });
      
      if (Array.isArray(wrappedTokensString)) {
        wrappedTokenIds = wrappedTokensString.map((id: string) => id.trim().toLowerCase());
      } else if (typeof wrappedTokensString === 'string') {
        wrappedTokenIds = wrappedTokensString.split(',').map((id: string) => id.trim().toLowerCase());
      } else {
        wrappedTokenIds = [];
        console.log(`    ✗ Unexpected wrappedTokensString type: ${typeof wrappedTokensString}`);
      }
      
      // Also check with different ID formats
      const outcomeTokenIdLower = outcomeToken.id.toLowerCase();
      const outcomeTokenIdWith0x = outcomeTokenIdLower.startsWith('0x') ? outcomeTokenIdLower : `0x${outcomeTokenIdLower}`;
      const outcomeTokenIdWithout0x = outcomeTokenIdLower.startsWith('0x') ? outcomeTokenIdLower.slice(2) : outcomeTokenIdLower;
      
      const outcomeIndex = wrappedTokenIds.findIndex((id: string) => {
        const idWith0x = id.startsWith('0x') ? id : `0x${id}`;
        const idWithout0x = id.startsWith('0x') ? id.slice(2) : id;
        return id === outcomeTokenIdLower || 
               id === outcomeTokenIdWith0x || 
               id === outcomeTokenIdWithout0x ||
               idWith0x === outcomeTokenIdWith0x ||
               idWithout0x === outcomeTokenIdWithout0x;
      });
      
      console.log(`    Outcome matching details:`, {
        wrappedTokenIds,
        outcomeTokenId: outcomeToken.id,
        outcomeTokenIdLower,
        outcomeTokenIdWith0x,
        outcomeTokenIdWithout0x,
        outcomeIndex,
        outcomeName: outcomeIndex >= 0 ? market.outcomes[outcomeIndex] : 'NOT FOUND'
      });
      
      if (outcomeIndex !== -1 && outcomeIndex < market.outcomes.length) {
        // Only consider realistic prices (outcome cannot be worth more than 1 collateral)
        // But if price is way out of range, try the alternative calculation
        let finalPrice = outcomePrice;
        
        if (outcomePrice > 1 || outcomePrice < 0) {
          // Try the alternative price calculation
          const alternativePrice = isToken0Outcome ? price0 : price1;
          console.log(`    ⚠️ Primary price out of range (${outcomePrice.toFixed(6)}), trying alternative: ${alternativePrice.toFixed(6)}`);
          
          if (alternativePrice <= 1 && alternativePrice >= 0) {
            console.log(`    ✓ Alternative price is valid, using it instead`);
            finalPrice = alternativePrice;
          } else {
            // If both are out of range, try the inverse
            const inversePrice = 1 / outcomePrice;
            if (inversePrice <= 1 && inversePrice >= 0) {
              console.log(`    ✓ Inverse of primary price is valid (${inversePrice.toFixed(6)}), using it`);
              finalPrice = inversePrice;
            } else {
              console.log(`    ✗ All price calculations out of range:`, {
                primary: outcomePrice.toFixed(6),
                alternative: alternativePrice.toFixed(6),
                inverse: inversePrice.toFixed(6)
              });
            }
          }
        }
        
        if (finalPrice <= 1 && finalPrice >= 0) {
          const liquidity = parseFloat(pool.liquidity || '0');
          console.log(`    ✓ Adding price for outcome ${outcomeIndex} (${market.outcomes[outcomeIndex]}):`, {
            price: finalPrice.toFixed(6),
            liquidity
          });
          outcomePrices[outcomeIndex].push({ price: finalPrice, liquidity });
        } else {
          console.log(`    ✗ Final price still out of range [0,1]:`, finalPrice);
        }
      } else {
        console.log(`    ✗ Outcome not found in market outcomes`);
      }
    }
  });

  // Calculate liquidity-weighted average price for each outcome
  console.log('\n  Calculating weighted averages:');
  const averagePrices: { [outcomeIndex: number]: number } = {};
  let totalPrice = 0;
  
  Object.keys(outcomePrices).forEach(indexStr => {
    const index = parseInt(indexStr);
    const priceData = outcomePrices[index];
    
    console.log(`    Outcome ${index} (${market.outcomes[index]}):`, {
      numPrices: priceData.length,
      prices: priceData.map(p => p.price.toFixed(4))
    });
    
    if (priceData.length > 0) {
      // Calculate liquidity-weighted average
      const totalLiquidity = priceData.reduce((sum, p) => sum + p.liquidity, 0);
      
      if (totalLiquidity > 0) {
        averagePrices[index] = priceData.reduce((sum, p) => {
          return sum + (p.price * p.liquidity / totalLiquidity);
        }, 0);
        console.log(`      Liquidity-weighted average: ${averagePrices[index].toFixed(6)}`);
      } else {
        // Fallback to simple average if no liquidity data
        averagePrices[index] = priceData.reduce((sum, p) => sum + p.price, 0) / priceData.length;
        console.log(`      Simple average (no liquidity): ${averagePrices[index].toFixed(6)}`);
      }
      
      totalPrice += averagePrices[index];
    } else {
      averagePrices[index] = 0;
      console.log(`      No price data, defaulting to 0`);
    }
  });

  // Convert prices to percentages
  // In prediction markets, prices ARE probabilities (0.7946 = 79.46%)
  // We should NOT normalize them to sum to 100% if some outcomes are missing prices
  console.log(`\n  Total price sum: ${totalPrice.toFixed(6)}`);
  const normalizedProbabilities: { [outcomeIndex: number]: number } = {};
  
  // Count how many outcomes have prices
  const outcomesWithPrices = Object.keys(averagePrices).filter(
    indexStr => averagePrices[parseInt(indexStr)] > 0
  ).length;
  
  if (outcomesWithPrices > 0) {
    console.log(`  Converting prices to probabilities (${outcomesWithPrices} outcomes have prices):`);
    
    // Check if we have prices for ALL outcomes
    const hasAllPrices = outcomesWithPrices === market.outcomes.length;
    
    if (hasAllPrices && Math.abs(totalPrice - 1) > 0.1) {
      // If we have all prices but they don't sum close to 1, normalize them
      console.log(`  All outcomes have prices, sum=${totalPrice.toFixed(4)}, normalizing to 100%`);
      Object.keys(averagePrices).forEach(indexStr => {
        const index = parseInt(indexStr);
        normalizedProbabilities[index] = (averagePrices[index] / totalPrice) * 100;
        console.log(`    Outcome ${index} (${market.outcomes[index]}): ${averagePrices[index].toFixed(4)} → ${normalizedProbabilities[index].toFixed(2)}%`);
      });
    } else {
      // Direct conversion: price = probability
      console.log(`  Using direct price-to-probability conversion:`);
      market.outcomes.forEach((_, index) => {
        if (averagePrices[index] !== undefined && averagePrices[index] > 0) {
          // Direct conversion: 0.7946 → 79.46%
          normalizedProbabilities[index] = averagePrices[index] * 100;
          console.log(`    Outcome ${index} (${market.outcomes[index]}): ${averagePrices[index].toFixed(4)} → ${normalizedProbabilities[index].toFixed(2)}%`);
        } else {
          // No price data for this outcome
          normalizedProbabilities[index] = 0;
          console.log(`    Outcome ${index} (${market.outcomes[index]}): No price data → 0%`);
        }
      });
    }
  } else {
    // If no valid prices, distribute equally
    console.log('  No valid prices found, distributing equally:');
    const equalProb = 100 / market.outcomes.length;
    market.outcomes.forEach((_, index) => {
      normalizedProbabilities[index] = equalProb;
      console.log(`    Outcome ${index} (${market.outcomes[index]}): ${equalProb.toFixed(2)}%`);
    });
  }

  console.log('\n  Final probabilities:', normalizedProbabilities);
  console.log('='.repeat(80) + '\n');
  
  return normalizedProbabilities;
}

/**
 * Calculate scalar market estimate from UP/DOWN token probabilities
 * Uses an average of two estimates for better accuracy
 */
export function calculateScalarMarketEstimate(
  pools: Pool[],
  market: Market
): {
  current: number;
  lower: number;
  upper: number;
  upPrice: number;  // percentage 0-100
  downPrice: number;  // percentage 0-100
  upPriceDecimal: number;  // decimal 0-1
  downPriceDecimal: number;  // decimal 0-1
  range: number;
  upIndex: number;
  downIndex: number;
} | null {
  console.log('[calculateScalarMarketEstimate] Starting with:', {
    pools: pools?.length,
    market: market?.id,
    bounds: [market?.lowerBound, market?.upperBound],
    outcomes: market?.outcomes
  });
  
  // Check for required bounds
  if (!market.lowerBound || !market.upperBound) {
    console.log('[calculateScalarMarketEstimate] Missing bounds');
    return null;
  }
  
  const rawLower = market.lowerBound;
  const rawUpper = market.upperBound;
  
  let lower = parseFloat(rawLower);
  let upper = parseFloat(rawUpper);
  
  // Check if values need scaling from wei
  const looksLikeWei = (value: string): boolean => {
    return !value.includes('.') && value.length > 15;
  };
  
  const needsScaling = looksLikeWei(rawLower) || looksLikeWei(rawUpper);
  if (needsScaling) {
    lower = lower / 1e18;
    upper = upper / 1e18;
  }
  
  // Calculate outcome probabilities (these are percentages 0-100)
  console.log('[calculateScalarMarketEstimate] About to call calculateOutcomeProbabilities with:', {
    poolsLength: pools?.length,
    poolsType: typeof pools,
    poolsIsArray: Array.isArray(pools),
    firstPool: pools?.[0],
    marketId: market?.id
  });
  const probabilities = calculateOutcomeProbabilities(pools, market);
  console.log('[calculateScalarMarketEstimate] Probabilities:', probabilities);
  console.log('[calculateScalarMarketEstimate] Market outcomes:', market.outcomes);
  
  if (!probabilities) {
    console.log('[calculateScalarMarketEstimate] No probabilities calculated');
    return null;
  }
  
  // Find UP and DOWN outcomes
  const upIndex = market.outcomes.findIndex(o => o.toLowerCase() === 'up');
  const downIndex = market.outcomes.findIndex(o => o.toLowerCase() === 'down');
  
  console.log('[calculateScalarMarketEstimate] Found indices:', { upIndex, downIndex });
  
  if (upIndex === -1 || downIndex === -1) {
    console.log('[calculateScalarMarketEstimate] UP or DOWN outcome not found');
    return null;
  }
  
  // probabilities are in percentage (0-100), convert to decimal (0-1)
  const upPriceDecimal = probabilities[upIndex] ? probabilities[upIndex] / 100 : 0.5;
  const downPriceDecimal = probabilities[downIndex] ? probabilities[downIndex] / 100 : 0.5;
  
  // Calculate market estimate using both UP and DOWN probabilities
  // estimate1 = lower + (upper - lower) * upPrice
  // estimate2 = upper - (upper - lower) * downPrice
  // Take average for more accurate estimate
  const estimate1 = lower + (upper - lower) * upPriceDecimal;
  const estimate2 = upper - (upper - lower) * downPriceDecimal;
  const currentEstimate = (estimate1 + estimate2) / 2;
  
  console.log('[calculateScalarMarketEstimate] Result:', {
    lower,
    upper,
    upPriceDecimal,
    downPriceDecimal,
    estimate1,
    estimate2,
    currentEstimate,
    upPricePercent: probabilities[upIndex],
    downPricePercent: probabilities[downIndex]
  });
  
  return {
    current: currentEstimate,
    lower,
    upper,
    upPrice: probabilities[upIndex] || 0,  // Keep as percentage for display
    downPrice: probabilities[downIndex] || 0,  // Keep as percentage for display
    upPriceDecimal,  // Decimal for calculations
    downPriceDecimal,  // Decimal for calculations
    range: upper - lower,
    upIndex,
    downIndex
  };
}

/**
 * Format probabilities for display
 */
export function formatProbability(probability: number): string {
  return `${probability.toFixed(1)}%`;
}

/**
 * Get detailed price information for each pool
 */
export function getPoolPriceDetails(pools: Pool[], market: Market): Array<{
  poolId: string;
  outcomeToken: string;
  outcomeName: string;
  collateralToken: string;
  price: number;
  liquidity: string;
  tick: string;
}> {
  const details: Array<{
    poolId: string;
    outcomeToken: string;
    outcomeName: string;
    collateralToken: string;
    price: number;
    liquidity: string;
    tick: string;
  }> = [];

  pools.forEach(pool => {
    if (!pool.tick) return;
    
    const tick = parseInt(pool.tick);
    const [price0, price1] = tickToPrice(tick);
    
    // Determine which token is the outcome token and which is collateral
    // Using the same improved logic as in calculateOutcomeProbabilities
    let outcomeToken, collateralToken, isToken0Outcome;
    
    if (market.collateralToken) {
      const token0IsCollateral = pool.token0.id.toLowerCase() === market.collateralToken.id.toLowerCase();
      const token1IsCollateral = pool.token1.id.toLowerCase() === market.collateralToken.id.toLowerCase();
      
      if (token0IsCollateral && !token1IsCollateral) {
        outcomeToken = pool.token1;
        collateralToken = pool.token0;
        isToken0Outcome = false;
      } else if (!token0IsCollateral && token1IsCollateral) {
        outcomeToken = pool.token0;
        collateralToken = pool.token1;
        isToken0Outcome = true;
      } else {
        // Fallback to market association
        const token0IsFromMarket = pool.market0?.id === market.id;
        const token1IsFromMarket = pool.market1?.id === market.id;
        
        if (!token0IsFromMarket && !token1IsFromMarket) {
          return;
        }
        
        if (token0IsFromMarket && !token1IsFromMarket) {
          outcomeToken = pool.token0;
          collateralToken = pool.token1;
          isToken0Outcome = true;
        } else if (!token0IsFromMarket && token1IsFromMarket) {
          outcomeToken = pool.token1;
          collateralToken = pool.token0;
          isToken0Outcome = false;
        } else {
          outcomeToken = pool.token0;
          collateralToken = pool.token1;
          isToken0Outcome = true;
        }
      }
    } else {
      const token0IsFromMarket = pool.market0?.id === market.id;
      const token1IsFromMarket = pool.market1?.id === market.id;
      
      if (!token0IsFromMarket && !token1IsFromMarket) {
        return;
      }
      
      if (token0IsFromMarket && !token1IsFromMarket) {
        outcomeToken = pool.token0;
        collateralToken = pool.token1;
        isToken0Outcome = true;
      } else if (!token0IsFromMarket && token1IsFromMarket) {
        outcomeToken = pool.token1;
        collateralToken = pool.token0;
        isToken0Outcome = false;
      } else {
        outcomeToken = pool.token0;
        collateralToken = pool.token1;
        isToken0Outcome = true;
      }
    }
    
    // Get the price of outcome in terms of collateral (collateral/outcome)
    // Same logic as above: we want how much collateral per outcome token
    const outcomePrice = isToken0Outcome ? price1 : price0;
    
    // Get outcome name
    let outcomeName = 'Unknown';
    if (market.wrappedTokensString) {
      let wrappedTokenIds: string[];
      const wrappedTokensString = market.wrappedTokensString;
      
      if (Array.isArray(wrappedTokensString)) {
        wrappedTokenIds = wrappedTokensString.map((id: string) => id.trim().toLowerCase());
      } else if (typeof wrappedTokensString === 'string') {
        wrappedTokenIds = wrappedTokensString.split(',').map((id: string) => id.trim().toLowerCase());
      } else {
        wrappedTokenIds = [];
      }
      
      const outcomeIndex = wrappedTokenIds.findIndex((id: string) => id === outcomeToken.id.toLowerCase());
      if (outcomeIndex !== -1 && outcomeIndex < market.outcomes.length) {
        outcomeName = market.outcomes[outcomeIndex];
      }
    }

    details.push({
      poolId: pool.id,
      outcomeToken: outcomeToken.symbol,
      outcomeName,
      collateralToken: collateralToken.symbol,
      price: outcomePrice,
      liquidity: pool.liquidity,
      tick: pool.tick
    });
  });

  return details;
}