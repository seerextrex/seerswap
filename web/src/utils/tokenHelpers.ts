import { Token } from "@uniswap/sdk-core";
import { TokenMetadata } from "../types/market";

/**
 * Creates a Token object from market data or falls back to basic token with address
 * @param address - The token address
 * @param metadata - Optional token metadata from the market
 * @param chainId - The chain ID
 * @param fallbackSymbol - Fallback symbol if metadata is not available
 * @param fallbackName - Fallback name if metadata is not available
 * @param fallbackDecimals - Fallback decimals if metadata is not available (default: 18)
 * @returns Token object or null if required data is missing
 */
export function createTokenFromMarketData(
    address: string | null | undefined,
    metadata: TokenMetadata | null | undefined,
    chainId: number | undefined,
    fallbackSymbol: string,
    fallbackName: string,
    fallbackDecimals = 18
): Token | null {
    if (!address || !chainId) {
        return null;
    }

    // Ensure decimals is always a valid number
    const getValidDecimals = (value: any): number => {
        if (typeof value === 'number' && !isNaN(value) && value >= 0 && value <= 255) {
            return Math.floor(value);
        }
        return fallbackDecimals;
    };

    // Use metadata if available
    if (metadata && typeof metadata === 'object' && 'id' in metadata) {
        const decimals = getValidDecimals(metadata.decimals);
        return new Token(
            chainId,
            metadata.id,
            decimals,
            metadata.symbol || fallbackSymbol,
            metadata.name || fallbackName
        );
    }

    // Fallback to creating a basic token with just the address
    const decimals = getValidDecimals(fallbackDecimals);
    return new Token(
        chainId,
        address,
        decimals,
        fallbackSymbol,
        fallbackName
    );
}

/**
 * Checks if a value is a valid TokenMetadata object
 * @param value - The value to check
 * @returns true if the value is a valid TokenMetadata object
 */
export function isTokenMetadata(value: any): value is TokenMetadata {
    return (
        value &&
        typeof value === 'object' &&
        'id' in value &&
        typeof value.id === 'string'
    );
}

/**
 * Extracts token addresses from wrapped tokens data
 * @param wrappedTokens - Array of token metadata or addresses
 * @returns Array of token addresses
 */
export function extractTokenAddresses(wrappedTokens: (TokenMetadata | string)[] | undefined): string[] {
    if (!wrappedTokens || !Array.isArray(wrappedTokens)) {
        return [];
    }

    return wrappedTokens.map(token => {
        if (isTokenMetadata(token)) {
            return token.id.toLowerCase();
        } else if (typeof token === 'string') {
            return token.toLowerCase();
        }
        return '';
    }).filter(address => address !== '');
}