// Utility functions for market-related operations

export interface Token {
  id: string;
  symbol: string;
  name: string;
  decimals: string;
  derivedMatic?: string;
}

export interface Market {
  id: string;
  outcomes: string[];
  marketName: string;
  collateralToken?: {
    id: string;
    symbol: string;
    name: string;
    decimals: string;
  };
  wrappedTokensString?: string[] | string;
  wrappedTokens?: Array<{
    id: string;
    name: string;
    symbol: string;
  }>;
  image?: Array<{
    id: string;
    cidMarket: string;
    cidOutcomes: string[];
  }>;
  tokens?: Array<{
    id: string;
    name: string;
  }>;
  childMarkets?: Array<{
    id: string;
  }>;
  parentMarket?: {
    id: string;
    marketName: string;
  };
}

export interface Pool {
  id: string;
  fee: string;
  liquidity: string;
  sqrtPrice: string;
  tick: string;
  totalValueLockedUSD: string;
  volumeUSD: string;
  feesUSD: string;
  token0: Token;
  token1: Token;
  market0?: Market;
  market1?: Market;
}

/**
 * Get the outcome name for a specific token in a market
 * @param market The market containing outcome information
 * @param tokenId The token ID to look up
 * @returns The outcome name or null if not found
 */
export function getOutcomeName(market: Market | null | undefined, tokenId: string): string | null {
  if (!market?.outcomes || !market?.wrappedTokensString || !tokenId) {
    return null;
  }

  try {
    let wrappedTokenIds: string[];
    const wrappedTokensString = market.wrappedTokensString;

    if (Array.isArray(wrappedTokensString)) {
      wrappedTokenIds = wrappedTokensString.map((id: string) => id.trim().toLowerCase());
    } else if (typeof wrappedTokensString === 'string') {
      wrappedTokenIds = wrappedTokensString.split(',').map((id: string) => id.trim().toLowerCase());
    } else {
      return null;
    }

    const tokenPosition = wrappedTokenIds.findIndex((id: string) => id === tokenId.toLowerCase());

    // IMPORTANT: This assumes the order of wrappedTokensString matches the order of outcomes
    // If the subgraph data doesn't guarantee this ordering, this mapping may be incorrect
    if (tokenPosition !== -1 && tokenPosition < market.outcomes.length) {
      return market.outcomes[tokenPosition];
    }
  } catch (e) {
    console.error('Error parsing outcome name:', e);
  }

  return null;
}

/**
 * Determines which token in a pool corresponds to a specific market's outcome
 * @param pool The pool to check
 * @param market The market to match against
 * @returns The outcome token and its name, or null if not found
 */
export function getPoolOutcomeToken(pool: Pool, market: Market): { token: Token; outcomeName: string } | null {
  // Check if token0 belongs to this market
  if (pool.market0?.id === market.id) {
    const outcomeName = getOutcomeName(market, pool.token0.id);
    if (outcomeName) {
      return { token: pool.token0, outcomeName };
    }
  }
  
  // Check if token1 belongs to this market
  if (pool.market1?.id === market.id) {
    const outcomeName = getOutcomeName(market, pool.token1.id);
    if (outcomeName) {
      return { token: pool.token1, outcomeName };
    }
  }
  
  return null;
}

export interface GroupedMarketPools {
  market: Market;
  poolsByOutcome: Map<string, Pool[]>;
  totalTVL: number;
  totalVolume: number;
  totalFees: number;
  isParent?: boolean;
  isChild?: boolean;
  parentKey?: string;
  childMarkets?: Map<string, GroupedMarketPools>;
}

/**
 * Detects if a pool represents a conditional market (parent-child) relationship
 * @param pool The pool to check
 * @returns Object with parent and child market info, or null
 */
export function detectConditionalMarket(pool: Pool): {
  parentMarket: Market;
  childMarket: Market;
} | null {
  const market0 = pool.market0;
  const market1 = pool.market1;

  if (!market0 || !market1) return null;

  // Get token IDs for both markets
  const market0TokenIds = market0.tokens?.map(t => t.id) || [];
  const market1TokenIds = market1.tokens?.map(t => t.id) || [];
  const market0CollateralId = market0.collateralToken?.id;
  const market1CollateralId = market1.collateralToken?.id;

  // Strategy 1: Check collateral token relationships
  const market0UsesMarket1Token = market0CollateralId && market1TokenIds.includes(market0CollateralId);
  const market1UsesMarket0Token = market1CollateralId && market0TokenIds.includes(market1CollateralId);

  // Strategy 2: Check explicit parent-child relationships
  const market0HasChildMarkets = market0.childMarkets && market0.childMarkets.length > 0;
  const market1HasChildMarkets = market1.childMarkets && market1.childMarkets.length > 0;
  const market0HasParent = !!market0.parentMarket?.id;
  const market1HasParent = !!market1.parentMarket?.id;

  // Strategy 3: Check if parent-child IDs match
  const market0IsParentOfMarket1 = market0HasChildMarkets && 
    market0.childMarkets?.some(child => child.id === market1.id);
  const market1IsParentOfMarket0 = market1HasChildMarkets && 
    market1.childMarkets?.some(child => child.id === market0.id);
  const market0IsChildOfMarket1 = market0HasParent && market0.parentMarket?.id === market1.id;
  const market1IsChildOfMarket0 = market1HasParent && market1.parentMarket?.id === market0.id;

  // Determine parent-child relationship with priority-based grouping
  let parentMarket: Market | null = null;
  let childMarket: Market | null = null;

  // Priority 1: Direct collateral token relationships
  if (market1UsesMarket0Token) {
    parentMarket = market0;
    childMarket = market1;
  } else if (market0UsesMarket1Token) {
    parentMarket = market1;
    childMarket = market0;
  }
  // Priority 2: Explicit parent-child ID relationships
  else if (market0IsParentOfMarket1 || market1IsChildOfMarket0) {
    parentMarket = market0;
    childMarket = market1;
  } else if (market1IsParentOfMarket0 || market0IsChildOfMarket1) {
    parentMarket = market1;
    childMarket = market0;
  }
  // Priority 3: Schema indicators with validation
  else if (market0HasChildMarkets && market1HasParent) {
    if (!market1CollateralId || market0TokenIds.includes(market1CollateralId)) {
      parentMarket = market0;
      childMarket = market1;
    }
  } else if (market1HasChildMarkets && market0HasParent) {
    if (!market0CollateralId || market1TokenIds.includes(market0CollateralId)) {
      parentMarket = market1;
      childMarket = market0;
    }
  }

  if (parentMarket && childMarket) {
    return { parentMarket, childMarket };
  }

  return null;
}

/**
 * Groups a list of pools by their market and then by outcome (simple version without parent-child nesting)
 * @param pools The list of pools to group
 * @param hideLowValue Whether to filter out low value pools
 * @param minTVL Minimum TVL threshold for filtering
 * @returns An array of grouped market pools sorted by TVL
 */
export function groupPoolsByMarketAndOutcome(
  pools: Pool[], 
  hideLowValue = false, 
  minTVL = 0
): GroupedMarketPools[] {
  const marketMap = new Map<string, GroupedMarketPools>();

  pools.forEach((pool) => {
    const tvl = parseFloat(pool.totalValueLockedUSD || "0");
    
    // First filter: Skip individual pools with low TVL
    // This prevents low-value pools from being included in market groups
    if (hideLowValue && tvl < minTVL) return;

    const markets = [pool.market0, pool.market1].filter(Boolean) as Market[];
    
    markets.forEach((market) => {
      if (!market) return;

      const marketKey = market.id;
      
      if (!marketMap.has(marketKey)) {
        marketMap.set(marketKey, {
          market,
          poolsByOutcome: new Map(),
          totalTVL: 0,
          totalVolume: 0,
          totalFees: 0,
        });
      }

      const marketGroup = marketMap.get(marketKey)!;
      
      // Add stats to market totals
      marketGroup.totalTVL += tvl;
      marketGroup.totalVolume += parseFloat(pool.volumeUSD || "0");
      marketGroup.totalFees += parseFloat(pool.feesUSD || "0");

      // Find which outcome this pool belongs to
      const outcomeInfo = getPoolOutcomeToken(pool, market);
      
      if (outcomeInfo) {
        // Group by the specific outcome
        const outcomeKey = outcomeInfo.outcomeName;
        
        if (!marketGroup.poolsByOutcome.has(outcomeKey)) {
          marketGroup.poolsByOutcome.set(outcomeKey, []);
        }
        
        marketGroup.poolsByOutcome.get(outcomeKey)!.push(pool);
      } else if (!market.outcomes || market.outcomes.length === 0) {
        // If no outcomes defined, group under "Default"
        const outcomeKey = 'Default';
        if (!marketGroup.poolsByOutcome.has(outcomeKey)) {
          marketGroup.poolsByOutcome.set(outcomeKey, []);
        }
        marketGroup.poolsByOutcome.get(outcomeKey)!.push(pool);
      }
      // If market has outcomes but pool doesn't match any, skip it
    });
  });

  // Second filter: Remove market groups whose total TVL is below threshold
  // This ensures that even if a market has some pools above threshold,
  // the market itself must have sufficient total TVL to be displayed
  return Array.from(marketMap.values())
    .filter(group => !hideLowValue || group.totalTVL >= minTVL)
    .sort((a, b) => b.totalTVL - a.totalTVL);
}

/**
 * Groups pools by market with parent-child relationships
 * @param pools The list of pools to group
 * @param hideLowValue Whether to filter out low value pools
 * @param minTVL Minimum TVL threshold for filtering
 * @returns An array of grouped market pools with parent-child hierarchy
 */
export function groupPoolsByMarketWithHierarchy(
  pools: Pool[],
  hideLowValue = false,
  minTVL = 0
): GroupedMarketPools[] {
  const groups = new Map<string, GroupedMarketPools>();
  const poolTVLMap = new Map<string, number>();

  pools.forEach((pool) => {
    const tvl = parseFloat(pool.totalValueLockedUSD || "0");
    
    // Filter out low TVL pools if requested
    if (hideLowValue && tvl < minTVL) return;

    const conditionalRelationship = detectConditionalMarket(pool);

    if (conditionalRelationship) {
      // Handle conditional markets with parent-child relationship
      const { parentMarket, childMarket } = conditionalRelationship;
      const parentKey = `${parentMarket.id}-${parentMarket.marketName}`;
      const childKey = `${childMarket.id}-${childMarket.marketName}`;

      // Create parent group if it doesn't exist
      if (!groups.has(parentKey)) {
        groups.set(parentKey, {
          market: parentMarket,
          poolsByOutcome: new Map(),
          totalTVL: 0,
          totalVolume: 0,
          totalFees: 0,
          isParent: true,
          childMarkets: new Map()
        });
      }

      const parentGroup = groups.get(parentKey)!;
      
      // Create child group under parent
      if (!parentGroup.childMarkets!.has(childKey)) {
        parentGroup.childMarkets!.set(childKey, {
          market: childMarket,
          poolsByOutcome: new Map(),
          totalTVL: 0,
          totalVolume: 0,
          totalFees: 0,
          isChild: true,
          parentKey: parentKey
        });
      }

      const childGroup = parentGroup.childMarkets!.get(childKey)!;
      
      // Add pool to child market
      const outcomeInfo = getPoolOutcomeToken(pool, childMarket);
      const outcomeKey = outcomeInfo?.outcomeName || 'Default';
      
      if (!childGroup.poolsByOutcome.has(outcomeKey)) {
        childGroup.poolsByOutcome.set(outcomeKey, []);
      }
      childGroup.poolsByOutcome.get(outcomeKey)!.push(pool);

      // Update child market stats
      childGroup.totalTVL += tvl;
      childGroup.totalVolume += parseFloat(pool.volumeUSD || "0");
      childGroup.totalFees += parseFloat(pool.feesUSD || "0");

      // Track unique pool TVL
      const poolId = pool.id;
      if (!poolTVLMap.has(poolId)) {
        poolTVLMap.set(poolId, tvl);
        // Add to parent's total TVL (don't double count)
        parentGroup.totalTVL += tvl;
        parentGroup.totalVolume += parseFloat(pool.volumeUSD || "0");
        parentGroup.totalFees += parseFloat(pool.feesUSD || "0");
      }
    } else {
      // Handle regular markets
      let selectedMarket: Market | null = null;
      const market0 = pool.market0;
      const market1 = pool.market1;

      if (market0 && market1) {
        // Priority: Choose parent market if one exists
        const market0IsParent = market0.childMarkets && market0.childMarkets.length > 0;
        const market1IsParent = market1.childMarkets && market1.childMarkets.length > 0;

        if (market0IsParent && !market1IsParent) {
          selectedMarket = market0;
        } else if (market1IsParent && !market0IsParent) {
          selectedMarket = market1;
        } else {
          // Choose market with more complete data
          const market0Score = (market0.tokens?.length || 0) + 
                              (market0.collateralToken ? 1 : 0) + 
                              (market0.image?.length || 0);
          const market1Score = (market1.tokens?.length || 0) + 
                              (market1.collateralToken ? 1 : 0) + 
                              (market1.image?.length || 0);
          selectedMarket = market0Score >= market1Score ? market0 : market1;
        }
      } else {
        selectedMarket = market0 || market1 || null;
      }

      if (!selectedMarket) return;

      const marketKey = `${selectedMarket.id}-${selectedMarket.marketName}`;
      
      if (!groups.has(marketKey)) {
        groups.set(marketKey, {
          market: selectedMarket,
          poolsByOutcome: new Map(),
          totalTVL: 0,
          totalVolume: 0,
          totalFees: 0,
          isParent: false,
          childMarkets: new Map()
        });
      }

      const marketGroup = groups.get(marketKey)!;
      
      // Find which outcome this pool belongs to
      const outcomeInfo = getPoolOutcomeToken(pool, selectedMarket);
      const outcomeKey = outcomeInfo?.outcomeName || 'Default';
      
      if (!marketGroup.poolsByOutcome.has(outcomeKey)) {
        marketGroup.poolsByOutcome.set(outcomeKey, []);
      }
      marketGroup.poolsByOutcome.get(outcomeKey)!.push(pool);

      // Update market stats
      const poolId = pool.id;
      if (!poolTVLMap.has(poolId)) {
        poolTVLMap.set(poolId, tvl);
        marketGroup.totalTVL += tvl;
        marketGroup.totalVolume += parseFloat(pool.volumeUSD || "0");
        marketGroup.totalFees += parseFloat(pool.feesUSD || "0");
      }
    }
  });

  // Filter and sort market groups
  return Array.from(groups.values())
    .filter(group => !hideLowValue || group.totalTVL >= minTVL)
    .sort((a, b) => b.totalTVL - a.totalTVL);
}

/**
 * Formats a CID for use with an IPFS gateway
 * @param cid The CID to format
 * @param gateway The IPFS gateway URL (defaults to ipfs.io)
 * @returns The full IPFS URL
 */
export function formatIpfsUrl(cid: string, gateway = 'https://ipfs.io'): string {
  if (!cid) return '';
  // The CID already includes the full path like /ipfs/Qm...
  // So we just concatenate directly
  return `${gateway}${cid}`;
}