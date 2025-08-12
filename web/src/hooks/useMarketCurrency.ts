import { useMemo } from "react";
import { Token } from "@uniswap/sdk-core";
import { useCurrency } from "./Tokens";
import { createTokenFromMarketData, isTokenMetadata } from "../utils/tokenHelpers";
import { TokenMetadata } from "../types/market";

/**
 * Custom hook to resolve a currency for prediction markets
 * Prefers the currency from the useCurrency hook for balance tracking,
 * but falls back to creating a token manually if the hook doesn't resolve
 */
export function useMarketCurrency(
    tokenAddress: string | null | undefined,
    chainId: number | undefined,
    tokenName?: string,
    tokenMetadataArray?: any[],
) {
    // Try to get the currency from the standard hook
    const currencyFromHook = useCurrency(tokenAddress || undefined);
    
    // Force create token if the hook doesn't resolve it
    const currency = useMemo(() => {
        if (!tokenAddress) {
            return null;
        }
        
        if (!chainId) {
            return null;
        }
        
        // Get token metadata if available
        let tokenMetadata: TokenMetadata | null = null;
        if (tokenMetadataArray && tokenAddress) {
            // Find the token metadata by matching the address
            const matchingToken = tokenMetadataArray.find((token: any) => 
                token?.id?.toLowerCase() === tokenAddress.toLowerCase()
            );
            if (matchingToken && isTokenMetadata(matchingToken)) {
                tokenMetadata = matchingToken as TokenMetadata;
            }
        }
        
        // If we have a currency from the hook, use it
        if (currencyFromHook && currencyFromHook instanceof Token) {
            // Verify the address matches (defensive check for stale data)
            if (currencyFromHook.address.toLowerCase() === tokenAddress.toLowerCase()) {
                return currencyFromHook;
            }
        }
        
        // Otherwise create a new token from scratch
        const token = createTokenFromMarketData(
            tokenAddress,
            tokenMetadata,
            chainId,
            tokenName || 'Unknown',
            `${tokenName || 'Unknown'} Token`
        );
        
        return token;
    }, [currencyFromHook, tokenAddress, tokenMetadataArray, chainId, tokenName]);
    
    return currency;
}