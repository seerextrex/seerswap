import { Currency, CurrencyAmount, Price, Token } from "@uniswap/sdk-core";
import { useMemo } from "react";
import useUSDCPrice from "./useUSDCPrice";

/**
 * Custom hook to calculate USD value for prediction market tokens
 * For outcome tokens, we calculate the value through the collateral token price
 * and the outcome's price relative to collateral
 */
export function usePredictionMarketUSDCValue(
    currencyAmount: CurrencyAmount<Currency> | undefined | null,
    collateralCurrency?: Currency | null,
    outcomePrice?: number // Price of outcome in terms of collateral (0-1 range)
): CurrencyAmount<Token> | null {
    // Get the USDC price of the collateral token
    const collateralUSDCPrice = useUSDCPrice(collateralCurrency || undefined);
    
    return useMemo(() => {
        if (!currencyAmount) return null;
        
        const isCollateral = collateralCurrency && currencyAmount.currency.equals(collateralCurrency);
        
        
        // If this is the collateral token itself, use the standard USDC price
        if (isCollateral && collateralUSDCPrice) {
            try {
                return collateralUSDCPrice.quote(currencyAmount);
            } catch (error) {
                console.error('Error calculating collateral USDC value:', error);
                return null;
            }
        }
        
        // For outcome tokens, calculate value through collateral
        if (!isCollateral && collateralCurrency && collateralUSDCPrice && outcomePrice !== undefined && outcomePrice >= 0) {
            try {
                // The value of outcome tokens = amount * outcomePrice * collateralUSDCPrice
                // outcomePrice is in terms of collateral (e.g., 0.7 means 0.7 collateral per outcome)
                const collateralEquivalent = parseFloat(currencyAmount.toExact()) * outcomePrice;
                
                
                if (isNaN(collateralEquivalent) || collateralEquivalent < 0) {
                    return null;
                }
                
                // Create a currency amount in collateral terms
                const collateralAmount = CurrencyAmount.fromRawAmount(
                    collateralCurrency as Currency,
                    Math.floor(collateralEquivalent * Math.pow(10, collateralCurrency?.decimals || 18))
                );
                
                // Get the USDC value of that collateral amount
                return collateralUSDCPrice.quote(collateralAmount);
            } catch (error) {
                console.error('Error calculating outcome USDC value:', error);
                return null;
            }
        }
        
        return null;
    }, [currencyAmount, collateralCurrency, collateralUSDCPrice, outcomePrice]);
}