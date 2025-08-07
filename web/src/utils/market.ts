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
}

/**
 * Groups a list of pools by their market and then by outcome
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