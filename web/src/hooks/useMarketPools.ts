import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Market, Pool } from '../utils/market';

// GraphQL query to fetch all pools for a market
// This will get pools where one side is the market's outcome tokens
const GET_MARKET_POOLS = gql`
  query GetMarketPools($marketId: String!) {
    pools(
      where: { 
        or: [
          { market0: $marketId }
          { market1: $marketId }
        ]
      }
      orderBy: totalValueLockedUSD
      orderDirection: desc
      first: 100
    ) {
      id
      fee
      liquidity
      sqrtPrice
      tick
      totalValueLockedUSD
      volumeUSD
      feesUSD
      token0 {
        id
        symbol
        name
        decimals
        derivedMatic
      }
      token1 {
        id
        symbol
        name
        decimals
        derivedMatic
      }
      market0 {
        id
        marketName
        outcomes
        conditionId
        parentCollectionId
        collateralToken {
          id
          symbol
          name
          decimals
        }
        wrappedTokensString
      }
      market1 {
        id
        marketName
        outcomes
        conditionId
        parentCollectionId
        collateralToken {
          id
          symbol
          name
          decimals
        }
        wrappedTokensString
      }
    }
  }
`;

/**
 * Hook to fetch all pools for a specific market
 * @param market The market to fetch pools for
 * @returns Array of pools and loading/error states
 */
export function useMarketPools(market: Market | null) {
  const { data, loading, error } = useQuery(GET_MARKET_POOLS, {
    variables: { marketId: market?.id },
    skip: !market?.id,
    fetchPolicy: 'cache-and-network'
  });

  const pools = useMemo(() => {
    if (!data?.pools) return [];
    return data.pools as Pool[];
  }, [data]);

  return {
    pools,
    loading,
    error
  };
}