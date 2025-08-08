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
  finalizeTs?: string | number;
  payoutReported?: boolean;
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
  if (!market?.outcomes || !tokenId) {
    return null;
  }

  // First try using wrappedTokensString if available
  if (market.wrappedTokensString) {
    try {
      let wrappedTokenIds: string[];
      const wrappedTokensString = market.wrappedTokensString;

      if (Array.isArray(wrappedTokensString)) {
        wrappedTokenIds = wrappedTokensString.map((id: string) => id.trim().toLowerCase());
      } else if (typeof wrappedTokensString === 'string') {
        wrappedTokenIds = wrappedTokensString.split(',').map((id: string) => id.trim().toLowerCase());
      } else {
        wrappedTokenIds = [];
      }

      const tokenPosition = wrappedTokenIds.findIndex((id: string) => id === tokenId.toLowerCase());

      // IMPORTANT: This assumes the order of wrappedTokensString matches the order of outcomes
      // If the subgraph data doesn't guarantee this ordering, this mapping may be incorrect
      if (tokenPosition !== -1 && tokenPosition < market.outcomes.length) {
        return market.outcomes[tokenPosition];
      }
    } catch (e) {
      console.error('Error parsing outcome name from wrappedTokensString:', e);
    }
  }

  // Fallback: try using wrappedTokens array if available
  if (market.wrappedTokens && Array.isArray(market.wrappedTokens)) {
    const tokenIndex = market.wrappedTokens.findIndex(
      (token: any) => token.id.toLowerCase() === tokenId.toLowerCase()
    );
    if (tokenIndex !== -1 && tokenIndex < market.outcomes.length) {
      return market.outcomes[tokenIndex];
    }
  }

  // Another fallback: try using tokens array if available
  if (market.tokens && Array.isArray(market.tokens)) {
    const tokenIndex = market.tokens.findIndex(
      (token: any) => token.id.toLowerCase() === tokenId.toLowerCase()
    );
    if (tokenIndex !== -1 && tokenIndex < market.outcomes.length) {
      return market.outcomes[tokenIndex];
    }
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
  // First, identify which token is the collateral token
  const collateralTokenId = market.collateralToken?.id;
  
  if (!collateralTokenId) {
    // Fallback to old logic if no collateral token specified
    if (pool.market0?.id === market.id) {
      const outcomeName = getOutcomeName(market, pool.token0.id);
      if (outcomeName) {
        return { token: pool.token0, outcomeName };
      }
    }
    
    if (pool.market1?.id === market.id) {
      const outcomeName = getOutcomeName(market, pool.token1.id);
      if (outcomeName) {
        return { token: pool.token1, outcomeName };
      }
    }
    return null;
  }
  
  // If we have collateral token info, determine which token is NOT the collateral
  const isToken0Collateral = pool.token0.id.toLowerCase() === collateralTokenId.toLowerCase();
  const isToken1Collateral = pool.token1.id.toLowerCase() === collateralTokenId.toLowerCase();
  
  // The outcome token is the one that's NOT the collateral token
  if (isToken0Collateral && !isToken1Collateral) {
    // token1 is the outcome token
    const outcomeName = getOutcomeName(market, pool.token1.id);
    if (outcomeName) {
      return { token: pool.token1, outcomeName };
    }
  } else if (isToken1Collateral && !isToken0Collateral) {
    // token0 is the outcome token
    const outcomeName = getOutcomeName(market, pool.token0.id);
    if (outcomeName) {
      return { token: pool.token0, outcomeName };
    }
  } else {
    // Neither or both tokens match collateral (shouldn't happen normally)
    // Try to find which token has a valid outcome name
    const outcome0 = getOutcomeName(market, pool.token0.id);
    const outcome1 = getOutcomeName(market, pool.token1.id);
    
    if (outcome0 && !outcome1) {
      return { token: pool.token0, outcomeName: outcome0 };
    } else if (outcome1 && !outcome0) {
      return { token: pool.token1, outcomeName: outcome1 };
    }
  }
  
  return null;
}

/**
 * Determines which token is the outcome token for a given market
 * @param pool The pool to check
 * @param market The market to check against
 * @returns Object with outcomeToken, collateralToken, and outcomeName
 */
export function getPoolTokensForMarket(pool: Pool, market: Market): {
  outcomeToken: Token;
  collateralToken: Token;
  outcomeName: string | null;
} | null {
  const collateralTokenId = market.collateralToken?.id;
  
  // Check if this pool belongs to this market at all
  const poolBelongsToMarket = (pool.market0?.id === market.id) || (pool.market1?.id === market.id);
  if (!poolBelongsToMarket) return null;
  
  if (collateralTokenId) {
    // We know the collateral token, so identify tokens based on that
    const isToken0Collateral = pool.token0.id.toLowerCase() === collateralTokenId.toLowerCase();
    const isToken1Collateral = pool.token1.id.toLowerCase() === collateralTokenId.toLowerCase();
    
    if (isToken0Collateral && !isToken1Collateral) {
      const outcomeName = getOutcomeName(market, pool.token1.id);
      // Debug log for Unknown cases
      if (!outcomeName) {
        console.warn('Unknown outcome detected:', {
          poolId: pool.id,
          marketId: market.id,
          token0: pool.token0.id,
          token1: pool.token1.id,
          collateralTokenId,
          wrappedTokensString: market.wrappedTokensString,
          outcomes: market.outcomes
        });
      }
      return {
        outcomeToken: pool.token1,
        collateralToken: pool.token0,
        outcomeName
      };
    } else if (isToken1Collateral && !isToken0Collateral) {
      const outcomeName = getOutcomeName(market, pool.token0.id);
      // Debug log for Unknown cases
      if (!outcomeName) {
        console.warn('Unknown outcome detected:', {
          poolId: pool.id,
          marketId: market.id,
          token0: pool.token0.id,
          token1: pool.token1.id,
          collateralTokenId,
          wrappedTokensString: market.wrappedTokensString,
          outcomes: market.outcomes
        });
      }
      return {
        outcomeToken: pool.token0,
        collateralToken: pool.token1,
        outcomeName
      };
    }
  }
  
  // Fallback: try to determine based on which token has an outcome name
  const outcome0 = getOutcomeName(market, pool.token0.id);
  const outcome1 = getOutcomeName(market, pool.token1.id);
  
  if (outcome0 && !outcome1) {
    return {
      outcomeToken: pool.token0,
      collateralToken: pool.token1,
      outcomeName: outcome0
    };
  } else if (outcome1 && !outcome0) {
    return {
      outcomeToken: pool.token1,
      collateralToken: pool.token0,
      outcomeName: outcome1
    };
  }
  
  // Last resort: if pool.market0 matches, assume token0 is outcome
  // This maintains backward compatibility but may not always be correct
  if (pool.market0?.id === market.id) {
    return {
      outcomeToken: pool.token0,
      collateralToken: pool.token1,
      outcomeName: outcome0
    };
  } else if (pool.market1?.id === market.id) {
    return {
      outcomeToken: pool.token1,
      collateralToken: pool.token0,
      outcomeName: outcome1
    };
  }
  
  return null;
}

export interface GroupedMarketPools {
  market: Market;
  pools: Pool[];  // Direct list of pools instead of grouping by outcome
  poolsByOutcome: Map<string, Pool[]>;  // Keep for backwards compatibility
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
          pools: [],
          poolsByOutcome: new Map(),
          totalTVL: 0,
          totalVolume: 0,
          totalFees: 0,
        });
      }

      const marketGroup = marketMap.get(marketKey)!;
      
      // Add pool directly to the pools array
      marketGroup.pools.push(pool);
      
      // Add stats to market totals
      marketGroup.totalTVL += tvl;
      marketGroup.totalVolume += parseFloat(pool.volumeUSD || "0");
      marketGroup.totalFees += parseFloat(pool.feesUSD || "0");

      // Also group by outcome for backwards compatibility
      const outcomeInfo = getPoolOutcomeToken(pool, market);
      if (outcomeInfo) {
        const outcomeKey = outcomeInfo.outcomeName;
        if (!marketGroup.poolsByOutcome.has(outcomeKey)) {
          marketGroup.poolsByOutcome.set(outcomeKey, []);
        }
        marketGroup.poolsByOutcome.get(outcomeKey)!.push(pool);
      }
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
    
    // Don't filter pools here - we need all pools to properly group markets
    // Filtering will be applied at the parent market level later

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
          pools: [],
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
          pools: [],
          poolsByOutcome: new Map(),
          totalTVL: 0,
          totalVolume: 0,
          totalFees: 0,
          isChild: true,
          parentKey: parentKey
        });
      }

      const childGroup = parentGroup.childMarkets!.get(childKey)!;
      
      // Add pool directly to child market's pools array
      childGroup.pools.push(pool);
      
      // Also track by outcome for backwards compatibility
      const outcomeInfo = getPoolOutcomeToken(pool, childMarket);
      if (outcomeInfo) {
        const outcomeKey = outcomeInfo.outcomeName;
        if (!childGroup.poolsByOutcome.has(outcomeKey)) {
          childGroup.poolsByOutcome.set(outcomeKey, []);
        }
        childGroup.poolsByOutcome.get(outcomeKey)!.push(pool);
      }

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
          pools: [],
          poolsByOutcome: new Map(),
          totalTVL: 0,
          totalVolume: 0,
          totalFees: 0,
          isParent: false,
          childMarkets: new Map()
        });
      }

      const marketGroup = groups.get(marketKey)!;
      
      // Add pool directly to pools array
      marketGroup.pools.push(pool);
      
      // Also track by outcome for backwards compatibility
      const outcomeInfo = getPoolOutcomeToken(pool, selectedMarket);
      if (outcomeInfo) {
        const outcomeKey = outcomeInfo.outcomeName;
        if (!marketGroup.poolsByOutcome.has(outcomeKey)) {
          marketGroup.poolsByOutcome.set(outcomeKey, []);
        }
        marketGroup.poolsByOutcome.get(outcomeKey)!.push(pool);
      }

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
  // Only filter parent markets by TVL, child markets are always included with their parent
  return Array.from(groups.values())
    .filter(group => {
      // If filtering is disabled, show all markets
      if (!hideLowValue) return true;
      
      // For parent markets or standalone markets, apply TVL filter
      if (group.isParent || !group.childMarkets || group.childMarkets.size === 0) {
        return group.totalTVL >= minTVL;
      }
      
      // Child markets are handled by their parent, so they're always included
      // when the parent is shown (this shouldn't happen as child markets are nested)
      return true;
    })
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

/**
 * Gets the outcome image URL for a specific outcome
 * @param market The market containing outcome information
 * @param outcomeIndex The index of the outcome
 * @returns The IPFS URL for the outcome image or null
 */
export function getOutcomeImageUrl(market: Market | null | undefined, outcomeIndex: number): string | null {
  if (!market?.image?.[0]?.cidOutcomes) return null;
  
  const cidOutcomes = market.image[0].cidOutcomes;
  if (!cidOutcomes || outcomeIndex >= cidOutcomes.length) return null;
  
  const outcomeCid = cidOutcomes[outcomeIndex];
  if (!outcomeCid) return null;
  
  return formatIpfsUrl(outcomeCid);
}

/**
 * Gets outcome information including name and image for a token
 * @param market The market containing outcome information
 * @param tokenId The token ID to look up
 * @returns Object with outcome name, index, and image URL or null
 */
export function getOutcomeInfo(market: Market | null | undefined, tokenId: string): {
  name: string;
  index: number;
  imageUrl: string | null;
} | null {
  if (!market?.outcomes || !tokenId) {
    return null;
  }

  let tokenPosition = -1;

  // First try using wrappedTokensString if available
  if (market.wrappedTokensString) {
    try {
      let wrappedTokenIds: string[];
      const wrappedTokensString = market.wrappedTokensString;

      if (Array.isArray(wrappedTokensString)) {
        wrappedTokenIds = wrappedTokensString.map((id: string) => id.trim().toLowerCase());
      } else if (typeof wrappedTokensString === 'string') {
        wrappedTokenIds = wrappedTokensString.split(',').map((id: string) => id.trim().toLowerCase());
      } else {
        wrappedTokenIds = [];
      }

      tokenPosition = wrappedTokenIds.findIndex((id: string) => id === tokenId.toLowerCase());
    } catch (e) {
      console.error('Error parsing outcome info from wrappedTokensString:', e);
    }
  }

  // Fallback: try using wrappedTokens array if available
  if (tokenPosition === -1 && market.wrappedTokens && Array.isArray(market.wrappedTokens)) {
    tokenPosition = market.wrappedTokens.findIndex(
      (token: any) => token.id.toLowerCase() === tokenId.toLowerCase()
    );
  }

  // Another fallback: try using tokens array if available
  if (tokenPosition === -1 && market.tokens && Array.isArray(market.tokens)) {
    tokenPosition = market.tokens.findIndex(
      (token: any) => token.id.toLowerCase() === tokenId.toLowerCase()
    );
  }

  if (tokenPosition !== -1 && tokenPosition < market.outcomes.length) {
    return {
      name: market.outcomes[tokenPosition],
      index: tokenPosition,
      imageUrl: getOutcomeImageUrl(market, tokenPosition)
    };
  }

  return null;
}