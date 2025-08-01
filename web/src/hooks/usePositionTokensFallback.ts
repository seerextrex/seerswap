import { useMemo } from "react";
import { Token } from "@uniswap/sdk-core";
import { useToken } from "./Tokens";
import { PositionTokens } from "./usePositionTokens";
import { PositionPool } from "../models/interfaces";

// Fallback hook that uses individual token loading when batch loading is not available
export function usePositionTokensFallback(
    position: PositionPool | undefined,
    batchTokens: PositionTokens | undefined
): PositionTokens {
    // Use individual token hooks as fallback
    const fallbackToken0 = useToken(position?.token0);
    const fallbackToken1 = useToken(position?.token1);

    return useMemo(() => {
        // If batch tokens are available and not loading, use them
        if (batchTokens && !batchTokens.isLoading && (batchTokens.token0 || batchTokens.token1)) {
            return batchTokens;
        }

        // If batch tokens are loading, return loading state
        if (batchTokens?.isLoading) {
            return { isLoading: true };
        }

        // Use fallback individual token loading
        const token0Loading = fallbackToken0 === null;
        const token1Loading = fallbackToken1 === null;
        const isLoading = token0Loading || token1Loading;

        return {
            token0: fallbackToken0 || undefined,
            token1: fallbackToken1 || undefined,
            isLoading
        };
    }, [batchTokens, fallbackToken0, fallbackToken1]);
} 