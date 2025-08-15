import React, { memo } from 'react';
import { Trans } from '@lingui/macro';
import { Plus, TrendingUp, DollarSign, Zap } from 'react-feather';
import { formatDollarAmount } from '../../utils/numbers';
import { formatUnits } from 'viem';

interface FarmCardProps {
    farm: any;
    onClick: () => void;
    TokenImage?: React.ComponentType<{ imageUrl: string | null; tokenSymbol: string; size?: number }>;
}

export const FarmCard = memo(({ farm, onClick, TokenImage }: FarmCardProps) => {
    // Format rewards with proper decimals
    const rewardTokenDecimals = farm.rewardToken?.decimals || 18;
    const formattedDailyReward = farm.rewardRate ? 
        parseFloat(formatUnits(BigInt(farm.rewardRate) * 86400n, rewardTokenDecimals)) : 
        farm.dailyRewardRate || 0;
    const formattedRewardReserve = farm.rewardReserve ? 
        parseFloat(formatUnits(BigInt(farm.rewardReserve), rewardTokenDecimals)) : 
        0;
    
    const isHighReward = (farm.apr && farm.apr > 50) || (formattedDailyReward > 5000);
    
    // Extract token and market information
    const token0 = farm.pool?.token0;
    const token1 = farm.pool?.token1;
    
    const market0 = farm.pool?.market0;
    const market1 = farm.pool?.market1;
    
    // Helper function to get human-readable outcome name from market
    const getOutcomeName = (market: any, tokenId: string): string | null => {
        if (!market?.outcomes || !tokenId) {
            return null;
        }

        // Handle wrappedTokensString as either string or array
        let wrappedTokenIds: string[];
        const wrappedTokensString = market.wrappedTokensString as any;

        if (Array.isArray(wrappedTokensString)) {
            wrappedTokenIds = wrappedTokensString.map((id: string) => id.trim().toLowerCase());
        } else if (typeof wrappedTokensString === 'string') {
            wrappedTokenIds = wrappedTokensString.split(',').map((id: string) => id.trim().toLowerCase());
        } else if (market.tokens) {
            // Fallback to tokens array
            wrappedTokenIds = market.tokens.map((token: any) => token.id?.toLowerCase());
        } else {
            return null;
        }

        const tokenPosition = wrappedTokenIds.findIndex((id: string) => id === tokenId.toLowerCase());

        if (tokenPosition !== -1 && tokenPosition < market.outcomes.length) {
            return market.outcomes[tokenPosition];
        }

        return null;
    };

    // Get token image URLs from market's outcome images
    // Helper function to find token image in a market using wrappedTokensString
    const findTokenImage = (market: any, tokenId: string) => {
        if (!market?.image?.[0]?.cidOutcomes || !tokenId) {
            return null;
        }

        // Use wrappedTokensString if available (preferred method)
        if (market.wrappedTokensString) {
            // Handle wrappedTokensString as either string or array
            let wrappedTokens: string[];
            const wrappedTokensString = market.wrappedTokensString as any;
            
            if (Array.isArray(wrappedTokensString)) {
                wrappedTokens = wrappedTokensString.map((token: string) => token.toLowerCase());
            } else if (typeof wrappedTokensString === 'string') {
                wrappedTokens = wrappedTokensString.split(',').map((token: string) => token.trim().toLowerCase());
            } else {
                return null;
            }
            
            const tokenIndex = wrappedTokens.findIndex((wrappedTokenId: string) =>
                wrappedTokenId === tokenId?.toLowerCase()
            );

            if (tokenIndex >= 0 && market.image[0].cidOutcomes[tokenIndex]) {
                return `https://ipfs.io${market.image[0].cidOutcomes[tokenIndex]}`;
            }
        }
        
        // Fallback to tokens array if wrappedTokensString not available
        if (market.tokens) {
            const tokenIndex = market.tokens.findIndex((token: any) =>
                token.id?.toLowerCase() === tokenId?.toLowerCase()
            );

            if (tokenIndex >= 0 && market.image[0].cidOutcomes[tokenIndex]) {
                return `https://ipfs.io${market.image[0].cidOutcomes[tokenIndex]}`;
            }
        }

        return null;
    };
    
    let token0ImageUrl = null;
    let token1ImageUrl = null;
    let token0OutcomeName = null;
    let token1OutcomeName = null;
    
    // Try to find token0 image and name in market0 first, then market1
    if (market0) {
        token0ImageUrl = findTokenImage(market0, token0?.id);
        token0OutcomeName = getOutcomeName(market0, token0?.id);
    }
    if (!token0ImageUrl && market1) {
        token0ImageUrl = findTokenImage(market1, token0?.id);
        if (!token0OutcomeName) {
            token0OutcomeName = getOutcomeName(market1, token0?.id);
        }
    }
    
    // Try to find token1 image and name in market0 first, then market1
    if (market0) {
        token1ImageUrl = findTokenImage(market0, token1?.id);
        token1OutcomeName = getOutcomeName(market0, token1?.id);
    }
    if (!token1ImageUrl && market1) {
        token1ImageUrl = findTokenImage(market1, token1?.id);
        if (!token1OutcomeName) {
            token1OutcomeName = getOutcomeName(market1, token1?.id);
        }
    }
    
    // Use outcome names if available, otherwise fall back to token symbols
    const token0DisplayName = token0OutcomeName || token0?.symbol || 'TOKEN';
    const token1DisplayName = token1OutcomeName || token1?.symbol || 'TOKEN';
    
    return (
        <div className={`eternal-page__farm-card ${isHighReward ? 'eternal-page__farm-card--high-reward' : ''}`}>
            <div className="eternal-page__farm-header">
                <div className="eternal-page__farm-tokens">
                    <div className="eternal-page__token-pair">
                        {TokenImage ? (
                            <>
                                <div className="token-icon">
                                    <TokenImage 
                                        imageUrl={token0ImageUrl} 
                                        tokenSymbol={token0DisplayName} 
                                        size={40}
                                    />
                                </div>
                                <div className="token-icon">
                                    <TokenImage 
                                        imageUrl={token1ImageUrl} 
                                        tokenSymbol={token1DisplayName} 
                                        size={40}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="token-icon">
                                    {token0DisplayName.substring(0, 2)}
                                </div>
                                <div className="token-icon">
                                    {token1DisplayName.substring(0, 2)}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="eternal-page__farm-name">
                        <h3>{token0DisplayName}/{token1DisplayName}</h3>
                        <span>Concentrated Liquidity</span>
                    </div>
                </div>
                {isHighReward && (
                    <div className="eternal-page__farm-badge">
                        <Zap size={12} />
                        High Rewards
                    </div>
                )}
            </div>

            <div className="eternal-page__farm-stats">
                <div className="eternal-page__farm-stat">
                    <label><Trans>APR</Trans></label>
                    <div className="value apr">
                        {farm.apr ? `${Math.round(farm.apr)}%` : '—'}
                    </div>
                    {farm.apr && farm.apr > 100 && (
                        <div className="sub-value">
                            <TrendingUp size={12} /> Triple digits!
                        </div>
                    )}
                </div>

                <div className="eternal-page__farm-stat">
                    <label><Trans>TVL</Trans></label>
                    <div className="value tvl">
                        {(() => {
                            const totalTVL = parseFloat(farm.pool?.totalValueLockedUSD || '0');
                            const activeTVL = parseFloat(farm.totalAmountUSDEstimated || '0');
                            // Show the minimum of total TVL and active TVL
                            const displayTVL = activeTVL > 0 ? Math.min(totalTVL, activeTVL) : totalTVL;
                            return displayTVL > 0 ? formatDollarAmount(displayTVL) : '—';
                        })()}
                    </div>
                </div>

                <div className="eternal-page__farm-stat">
                    <label><Trans>Daily Rewards</Trans></label>
                    <div className="value rewards">
                        {formattedDailyReward > 0
                            ? `${formattedDailyReward.toLocaleString(undefined, { maximumFractionDigits: 2 })} SEER`
                            : '—'}
                    </div>
                </div>

                <div className="eternal-page__farm-stat">
                    <label><Trans>Remaining</Trans></label>
                    <div className="value">
                        {formattedRewardReserve > 0
                            ? formattedRewardReserve >= 1000000
                                ? `${(formattedRewardReserve / 1000000).toFixed(2)}M SEER`
                                : formattedRewardReserve >= 1000
                                ? `${(formattedRewardReserve / 1000).toFixed(2)}k SEER`
                                : `${formattedRewardReserve.toFixed(2)} SEER`
                            : '—'}
                    </div>
                </div>
            </div>

            <div className="eternal-page__farm-action">
                <button className="eternal-page__add-liquidity-btn" onClick={onClick}>
                    <Plus size={20} />
                    <Trans>Add Liquidity</Trans>
                </button>
            </div>

            <div className="eternal-page__quick-stats">
                <span>Fee Tier: <strong>{farm.pool?.fee ? `${farm.pool.fee / 10000}%` : 'N/A'}</strong></span>
                <span>In Range: <strong>{farm.pool?.liquidity > 0 ? 'Yes' : 'No'}</strong></span>
            </div>
        </div>
    );
});