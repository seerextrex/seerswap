import { Currency } from "@uniswap/sdk-core";

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