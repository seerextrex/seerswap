import { Currency, Price, Token } from "@uniswap/sdk-core";
import { useMemo } from "react";
import { useMarketAwareTokenOrder } from "utils/collateralToken";

/**
 * Hook to format prices in market-aware manner
 * For prediction market pools, always shows price in terms of collateral token
 * 
 * @param price - The raw price from the pool
 * @param currencyA - First currency in the pair
 * @param currencyB - Second currency in the pair
 * @param invertPrice - Whether the price is already inverted
 * @returns Formatted price and related market information
 */
export function useMarketAwarePrice(
  price: Price<Token, Token> | undefined,
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  invertPrice?: boolean
) {
  const marketInfo = useMarketAwareTokenOrder(currencyA, currencyB);

  return useMemo(() => {
    if (!price) {
      return {
        formattedPrice: undefined,
        displayPrice: undefined,
        baseCurrency: currencyA,
        quoteCurrency: currencyB,
        isMarketPool: false,
        collateralToken: null,
        outcomeToken: null,
      };
    }

    let displayPrice = invertPrice ? price.invert() : price;
    let baseCurrency = currencyA;
    let quoteCurrency = currencyB;

    // For market pools, ensure price is always in collateral terms
    if (marketInfo.isMarketPool) {
      if (marketInfo.shouldInvert) {
        // Token0 is collateral, token1 is outcome
        // We want: outcome/collateral (price of outcome in collateral)
        displayPrice = displayPrice.invert();
        baseCurrency = currencyB; // outcome
        quoteCurrency = currencyA; // collateral
      } else {
        // Token1 is collateral, token0 is outcome
        // Already in correct format: outcome/collateral
        baseCurrency = currencyA; // outcome
        quoteCurrency = currencyB; // collateral
      }
    }

    return {
      formattedPrice: displayPrice.toSignificant(6),
      displayPrice,
      baseCurrency,
      quoteCurrency,
      isMarketPool: marketInfo.isMarketPool,
      collateralToken: marketInfo.collateralToken,
      outcomeToken: marketInfo.outcomeToken,
    };
  }, [price, currencyA, currencyB, invertPrice, marketInfo]);
}

/**
 * Hook to format a price range for market-aware display
 * Ensures both bounds are in collateral terms for prediction markets
 */
export function useMarketAwarePriceRange(
  priceLower: Price<Token, Token> | undefined,
  priceUpper: Price<Token, Token> | undefined,
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  isSorted: boolean | undefined
) {
  const marketInfo = useMarketAwareTokenOrder(currencyA, currencyB);

  return useMemo(() => {
    let leftPrice = isSorted ? priceLower : priceUpper?.invert();
    let rightPrice = isSorted ? priceUpper : priceLower?.invert();

    // For market pools, adjust prices to be in collateral terms
    if (marketInfo.isMarketPool && marketInfo.shouldInvert) {
      if (leftPrice) leftPrice = leftPrice.invert();
      if (rightPrice) rightPrice = rightPrice.invert();
    }

    return {
      leftPrice,
      rightPrice,
      isMarketPool: marketInfo.isMarketPool,
      collateralToken: marketInfo.collateralToken,
      outcomeToken: marketInfo.outcomeToken,
    };
  }, [priceLower, priceUpper, isSorted, marketInfo]);
}

/**
 * Get the proper currency symbols for display based on market awareness
 * For market pools, ensures collateral is always the quote currency
 */
export function useMarketAwareCurrencySymbols(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined
) {
  const marketInfo = useMarketAwareTokenOrder(currencyA, currencyB);

  return useMemo(() => {
    if (!currencyA || !currencyB) {
      return {
        baseSymbol: '',
        quoteSymbol: '',
        isMarketPool: false,
      };
    }

    let baseSymbol = currencyA.symbol || '';
    let quoteSymbol = currencyB.symbol || '';

    // For market pools, ensure collateral is quote and outcome is base
    if (marketInfo.isMarketPool) {
      if (marketInfo.shouldInvert) {
        // currencyA is collateral, currencyB is outcome
        baseSymbol = currencyB.symbol || '';
        quoteSymbol = currencyA.symbol || '';
      }
      // else currencyB is already collateral (quote), currencyA is outcome (base)
    }

    return {
      baseSymbol,
      quoteSymbol,
      isMarketPool: marketInfo.isMarketPool,
    };
  }, [currencyA, currencyB, marketInfo]);
}