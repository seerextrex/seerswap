import { useMemo } from "react";
import { Token } from "@uniswap/sdk-core";
import { useTokensBatch } from "./useTokensBatch";
import { PositionPool } from "../models/interfaces";

export interface PositionTokens {
    token0?: Token;
    token1?: Token;
    isLoading: boolean;
}

// Hook to batch load all tokens for multiple positions
export function usePositionTokens(positions: PositionPool[]): Record<string, PositionTokens> {
    // Extract all unique token addresses from positions
    const tokenAddresses = useMemo(() => {
        const addresses = new Set<string>();

        positions.forEach(position => {
            if (position.token0) addresses.add(position.token0);
            if (position.token1) addresses.add(position.token1);
        });

        return Array.from(addresses);
    }, [positions]);

    // Batch load all tokens
    const tokens = useTokensBatch(tokenAddresses);

    // Create tokens map
    const tokensMap = useMemo(() => {
        const map = new Map<string, Token | undefined>();
        tokenAddresses.forEach((address, index) => {
            map.set(address, tokens[index]);
        });
        return map;
    }, [tokenAddresses, tokens]);

    // Create result map by position tokenId
    return useMemo(() => {
        const result: Record<string, PositionTokens> = {};

        positions.forEach(position => {
            const token0 = position.token0 ? tokensMap.get(position.token0) : undefined;
            const token1 = position.token1 ? tokensMap.get(position.token1) : undefined;

            // Check if tokens are still loading (undefined means loading, null means not found)
            const isLoading = Boolean((position.token0 && token0 === undefined) || (position.token1 && token1 === undefined));

            result[position.tokenId.toString()] = {
                token0: token0 || undefined,
                token1: token1 || undefined,
                isLoading
            };
        });

        return result;
    }, [positions, tokensMap]);
}

// Hook for a single position's tokens
export function usePositionToken(position: PositionPool | undefined): PositionTokens {
    const positions = useMemo(() => position ? [position] : [], [position]);
    const positionTokensMap = usePositionTokens(positions);

    return useMemo(() => {
        if (!position) {
            return { isLoading: false };
        }

        return positionTokensMap[position.tokenId.toString()] || { isLoading: false };
    }, [position, positionTokensMap]);
} 