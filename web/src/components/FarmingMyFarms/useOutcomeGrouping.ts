import { useCallback } from "react";
import { UseOutcomeGroupingParams, UseOutcomeGroupingResult, OutcomeGroupData } from "./types";
import { Market, Token } from "../../state/data/generated";
import { Deposit } from "../../models/interfaces";

export const useOutcomeGrouping = (params?: UseOutcomeGroupingParams): UseOutcomeGroupingResult => {
    // Helper function to get outcome name
    const getOutcomeName = useCallback((tokenId: string, market?: Market | null, parentMarket?: Market | null): string | null => {
        if (!tokenId) return null;

        // For child markets, check parent market for outcome names
        if (parentMarket?.outcomes && parentMarket?.tokens) {
            const tokenIndex = parentMarket.tokens.findIndex((token: Token) => 
                token.id.toLowerCase() === tokenId.toLowerCase()
            );
            
            if (tokenIndex !== -1 && tokenIndex < parentMarket.outcomes.length) {
                return parentMarket.outcomes[tokenIndex];
            }
        }

        // Check in the current market
        if (!market?.outcomes || !market?.wrappedTokensString) {
            return null;
        }

        try {
            let wrappedTokenIds: string[];
            const wrappedTokensString = market.wrappedTokensString as unknown;

            if (Array.isArray(wrappedTokensString)) {
                wrappedTokenIds = wrappedTokensString.map((id: string) => id.trim().toLowerCase());
            } else if (typeof wrappedTokensString === 'string') {
                wrappedTokenIds = wrappedTokensString.split(',').map((id: string) => id.trim().toLowerCase());
            } else {
                return null;
            }

            const tokenPosition = wrappedTokenIds.findIndex((id: string) => id === tokenId.toLowerCase());

            if (tokenPosition !== -1 && tokenPosition < market.outcomes.length) {
                return market.outcomes[tokenPosition];
            }
        } catch (e) {
            console.error('Error parsing outcome name:', e);
        }

        return null;
    }, []);

    // Helper function to find token image URL
    const findTokenImageUrl = useCallback((tokenId: string, market?: Market | null): string | null => {
        if (!market?.tokens || !market?.image?.[0]?.cidOutcomes) {
            return null;
        }

        // Use wrappedTokensString if available
        if (market.wrappedTokensString && market.wrappedTokensString.length > 0) {
            const wrappedTokens = market.wrappedTokensString.map((token: string) => token.toLowerCase());
            const tokenIndex = wrappedTokens.findIndex((wrappedTokenId: string) => 
                wrappedTokenId === tokenId?.toLowerCase()
            );

            if (tokenIndex >= 0 && market.image[0].cidOutcomes[tokenIndex]) {
                return `https://ipfs.io${market.image[0].cidOutcomes[tokenIndex]}`;
            }
        }

        return null;
    }, []);

    // Helper function to group positions by outcome
    const groupPositionsByOutcome = useCallback((positions: Deposit[], market?: Market | null, parentMarket?: Market | null): Map<string, OutcomeGroupData> => {
        const outcomeMap = new Map<string, OutcomeGroupData>();
        
        positions.forEach((position) => {
            const pool = position.pool;
            if (!pool || !pool.token0 || !pool.token1) return;

            // Determine outcome token (non-collateral token)
            const collateralTokenId = market?.collateralToken?.id?.toLowerCase();
            const outcomeToken = collateralTokenId && pool.token0.id.toLowerCase() === collateralTokenId ? pool.token1 : pool.token0;
            
            // Get outcome name
            const outcomeName = getOutcomeName(outcomeToken.id, market, parentMarket) || 
                                outcomeToken.symbol || 
                                'Unknown';
            
            // Get outcome image
            const imageUrl = findTokenImageUrl(outcomeToken.id, market);
            
            const key = outcomeToken.id;
            if (!outcomeMap.has(key)) {
                outcomeMap.set(key, { 
                    token: outcomeToken, 
                    positions: [], 
                    name: outcomeName,
                    imageUrl: imageUrl
                });
            }
            const outcomeData = outcomeMap.get(key);
            if (outcomeData) {
                outcomeData.positions.push(position);
            }
        });
        
        return outcomeMap;
    }, [getOutcomeName, findTokenImageUrl]);

    return {
        groupPositionsByOutcome,
        getOutcomeName,
        findTokenImageUrl,
    };
};