import { Currency } from "@uniswap/sdk-core";
import { useQuery, gql } from "@apollo/client";
import { useMemo } from "react";

// Common collateral token addresses - add more as needed
const COLLATERAL_TOKEN_ADDRESSES: { [chainId: number]: string[] } = {
  // Add your chain ID and collateral token addresses here
  100: [
    // sDAI address on Gnosis Chain - this appears in your URL
    "0xaf204776c7245bf4147c2612bf6e5972ee483701".toLowerCase(),
    // Add other collateral tokens if needed
  ],
  // Add other chains as needed
};

// Common collateral token symbols
const COLLATERAL_TOKEN_SYMBOLS = [
  "sDAI",
  "USDC", 
  "USDT",
  "DAI",
  "WXDAI"
];

/**
 * Determines if a given currency is a collateral token
 * @param currency The currency to check
 * @param chainId The chain ID
 * @returns true if the currency is likely a collateral token
 */
export function isCollateralToken(currency: Currency | undefined, chainId: number | undefined): boolean {
  if (!currency || !chainId) return false;
  
  // Check by address first (most reliable)
  if (currency.isToken) {
    const collateralAddresses = COLLATERAL_TOKEN_ADDRESSES[chainId] || [];
    if (collateralAddresses.includes(currency.address.toLowerCase())) {
      return true;
    }
  }
  
  // Check by symbol as fallback
  if (currency.symbol && COLLATERAL_TOKEN_SYMBOLS.includes(currency.symbol)) {
    return true;
  }
  
  return false;
}

/**
 * Determines which of two currencies should be used as the base for price display
 * Prioritizes collateral tokens as the base (denominator)
 * @param currencyA First currency
 * @param currencyB Second currency  
 * @param chainId Chain ID
 * @returns true if price should be inverted (currencyA should be base), false if currencyB should be base, null if no collateral detected
 */
export function shouldInvertPriceForCollateral(
  currencyA: Currency | undefined, 
  currencyB: Currency | undefined, 
  chainId: number | undefined
): boolean | null {
  if (!currencyA || !currencyB || !chainId) return null;
  
  const aIsCollateral = isCollateralToken(currencyA, chainId);
  const bIsCollateral = isCollateralToken(currencyB, chainId);
  
  // If only one is collateral, use that as base (denominator)
  if (aIsCollateral && !bIsCollateral) {
    return true; // Invert so A (collateral) becomes denominator
  }
  
  if (bIsCollateral && !aIsCollateral) {
    return false; // Don't invert, B (collateral) is already denominator
  }
  
  // If both or neither are collateral, return null to use default logic
  return null;
}

// GraphQL query to check if tokens are part of a market and get collateral info
const TOKEN_MARKET_INFO_QUERY = gql`
  query TokenMarketInfo($token0: ID!, $token1: ID!) {
    token0: token(id: $token0) {
      id
      symbol
      market {
        id
        collateralToken {
          id
          symbol
        }
        collateralToken1 {
          id
          symbol
        }
        collateralToken2 {
          id
          symbol
        }
        wrappedTokens {
          id
          symbol
          name
        }
      }
    }
    token1: token(id: $token1) {
      id
      symbol
      market {
        id
        collateralToken {
          id
          symbol
        }
        collateralToken1 {
          id
          symbol
        }
        collateralToken2 {
          id
          symbol
        }
        wrappedTokens {
          id
          symbol
          name
        }
      }
    }
  }
`;

/**
 * Hook to determine market-aware token ordering for price display
 * For pools with market tokens, ensures price is always shown in terms of collateral
 */
export function useMarketAwareTokenOrder(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined
) {
  const { data, loading } = useQuery(TOKEN_MARKET_INFO_QUERY, {
    variables: {
      token0: currencyA?.isToken ? currencyA.address.toLowerCase() : '',
      token1: currencyB?.isToken ? currencyB.address.toLowerCase() : ''
    },
    skip: !currencyA?.isToken || !currencyB?.isToken
  });

  return useMemo(() => {
    if (loading || !data) {
      // Fallback to basic collateral detection
      return {
        shouldInvert: shouldInvertPriceForCollateral(currencyA, currencyB, currencyA?.chainId),
        isMarketPool: false,
        collateralToken: null,
        outcomeToken: null
      };
    }

    const token0Data = data.token0;
    const token1Data = data.token1;

    // Check if either token is an outcome token (has a market)
    const token0Market = token0Data?.market;
    const token1Market = token1Data?.market;

    if (token0Market || token1Market) {
      // This is a market pool
      let collateralTokenAddress: string | null = null;
      let outcomeTokenAddress: string | null = null;
      let shouldInvert = false;

      if (token0Market) {
        // Token0 is the outcome token
        outcomeTokenAddress = token0Data.id;
        // Token1 should be the collateral
        collateralTokenAddress = token1Data?.id || null;
        // We want collateral as base, so if token1 is collateral, don't invert
        shouldInvert = false;
      } else if (token1Market) {
        // Token1 is the outcome token
        outcomeTokenAddress = token1Data.id;
        // Token0 should be the collateral
        collateralTokenAddress = token0Data?.id || null;
        // We want collateral as base, so if token0 is collateral, invert
        shouldInvert = true;
      }

      // Verify the collateral token matches the market's collateral
      if (token0Market && collateralTokenAddress) {
        const marketCollateral = token0Market.collateralToken?.id || 
                                token0Market.collateralToken1?.id || 
                                token0Market.collateralToken2?.id;
        if (marketCollateral?.toLowerCase() !== collateralTokenAddress.toLowerCase()) {
          // Mismatch - fall back to basic detection
          return {
            shouldInvert: shouldInvertPriceForCollateral(currencyA, currencyB, currencyA?.chainId),
            isMarketPool: false,
            collateralToken: null,
            outcomeToken: null
          };
        }
      }

      return {
        shouldInvert,
        isMarketPool: true,
        collateralToken: collateralTokenAddress,
        outcomeToken: outcomeTokenAddress
      };
    }

    // Not a market pool, use basic collateral detection
    return {
      shouldInvert: shouldInvertPriceForCollateral(currencyA, currencyB, currencyA?.chainId),
      isMarketPool: false,
      collateralToken: null,
      outcomeToken: null
    };
  }, [data, loading, currencyA, currencyB]);
}