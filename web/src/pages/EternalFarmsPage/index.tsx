import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { Trans } from '@lingui/macro';
import { Frown, ChevronDown, ChevronUp, ExternalLink } from 'react-feather';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { FarmModal } from '../../components/FarmModal';
import { FarmingType } from '../../models/enums';
import { useFarmingSubgraph } from '../../hooks/useFarmingSubgraph';
import { FormattedEternalFarming } from '../../models/interfaces/farming';
import { formatDollarAmount } from '../../utils/numbers';
import { useHandleSort } from '../../hooks/useHandleSort';
import { useHandleArrow } from '../../hooks/useHandleArrow';
import './index.scss';
import SDAI_LOGO from '../../assets/images/sdai-logo.svg';
import { Market, Image, Token } from '../../state/data/generated';

// Magic number representing infinity in the subgraph
const INFINITY_TIMESTAMP = "18446744073709551615";

// Utility function to calculate remaining rewards
const calculateRemainingRewards = (endTimeImplied: string, rewardRate: string, rewardReserve?: string): number => {
    // If endTimeImplied is the infinity magic number, use rewardReserve directly
    if (endTimeImplied === INFINITY_TIMESTAMP) {
        if (!rewardReserve) return 0;
        return parseFloat(rewardReserve) / Math.pow(10, 18);
    }

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const endTime = parseInt(endTimeImplied);
    const rate = parseFloat(rewardRate);

    if (endTime <= currentTime || rate <= 0) {
        return 0;
    }

    const remainingSeconds = endTime - currentTime;
    const remainingRewards = (remainingSeconds * rate) / Math.pow(10, 18);

    return remainingRewards;
};

// Format remaining rewards for display
const formatRemainingRewards = (remainingRewards: number): string => {
    if (remainingRewards <= 0) {
        return '0';
    }

    if (remainingRewards < 1) {
        return remainingRewards.toFixed(6);
    } else if (remainingRewards < 1000) {
        return remainingRewards.toFixed(2);
    } else if (remainingRewards < 1000000) {
        return (remainingRewards / 1000).toFixed(2) + 'K';
    } else {
        return (remainingRewards / 1000000).toFixed(2) + 'M';
    }
};

interface EternalFarmsPageProps {
    data: any[] | null;
    refreshing: boolean;
    priceFetched: boolean;
    fetchHandler: () => any;
}

const TokenImage = memo(({ imageUrl, tokenSymbol, size = 24 }: { imageUrl: string | null, tokenSymbol: string, size?: number }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = useCallback(() => {
        console.warn(`[TokenImage] ❌ Failed to load image for ${tokenSymbol}:`, imageUrl);
        setImageError(true);
        setImageLoading(false);
    }, [tokenSymbol, imageUrl]);

    const handleImageLoad = useCallback(() => {
        console.log(`[TokenImage] ✅ Successfully loaded image for ${tokenSymbol}:`, imageUrl);
        setImageLoading(false);
    }, [tokenSymbol, imageUrl]);

    // Special case for sDAI - use imported logo
    if (tokenSymbol.toLowerCase() === 'sdai') {
        console.log(`[TokenImage] 🎯 Using imported sDAI logo for ${tokenSymbol}`);
        return (
            <img
                src={SDAI_LOGO}
                alt={tokenSymbol}
                style={{ width: size, height: size, borderRadius: size * 0.5 }}
                className="token-image"
            />
        );
    }

    if (!imageUrl || imageError) {
        if (!imageUrl) {
            console.log(`[TokenImage] 📋 No IPFS URL found for ${tokenSymbol}, using placeholder`);
        }
        return (
            <div
                className="token-image-placeholder"
                style={{
                    width: size,
                    height: size,
                    fontSize: size * 0.4,
                    borderRadius: size * 0.5
                }}
            >
                {tokenSymbol.charAt(0).toUpperCase()}
            </div>
        );
    }

    return (
        <div className="token-image-container" style={{ width: size, height: size }}>
            {imageLoading && (
                <div
                    className="token-image-placeholder"
                    style={{
                        width: size,
                        height: size,
                        fontSize: size * 0.4,
                        borderRadius: size * 0.5
                    }}
                >
                    {tokenSymbol.charAt(0).toUpperCase()}
                </div>
            )}
            <img
                src={imageUrl}
                alt={tokenSymbol}
                className={`token-image ${imageLoading ? 'loading' : ''}`}
                style={{ width: size, height: size, borderRadius: size * 0.5 }}
                onError={handleImageError}
                onLoad={handleImageLoad}
            />
        </div>
    );
});

const TokenPairDisplay = memo(({ pool }: { pool: any }) => {
    // Helper function to get better outcome name from outcomes array
    const getOutcomeName = (market: Market | null | undefined, tokenId: string): string | null => {
        if (!market?.outcomes || !market?.wrappedTokensString || !tokenId) {
            return null;
        }

        try {
            // Handle wrappedTokensString as either string or array
            let wrappedTokenIds: string[];
            const wrappedTokensString = market.wrappedTokensString as any;

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
        } catch (error) {
            console.warn('Error getting outcome name:', error);
        }

        return null;
    };

    const { token0ImageUrl, token1ImageUrl, conditionalMarketInfo } = useMemo(() => {


        if (!pool?.market0 && !pool?.market1) {

            return { token0ImageUrl: null, token1ImageUrl: null, conditionalMarketInfo: null };
        }

        // Helper function to find token image in a market
        const findTokenImage = (market: Pick<Market, 'id' | 'marketName' | 'wrappedTokensString'> & { image: Array<Pick<Image, 'id' | 'cidMarket' | 'cidOutcomes'>>; tokens: Array<{ id: string; name: string }> } | null | undefined, tokenId: string, marketName: string) => {
            if (!market?.tokens || !market?.image?.[0]?.cidOutcomes) {

                return null;
            }

            // Use wrappedTokensString if available (preferred method)
            if (market.wrappedTokensString && market.wrappedTokensString.length > 0) {
                const wrappedTokens = market.wrappedTokensString.map((token: string) => token.toLowerCase());
                const tokenIndex = wrappedTokens.findIndex((wrappedTokenId: string) =>
                    wrappedTokenId === tokenId?.toLowerCase()
                );

                if (tokenIndex >= 0 && market.image[0].cidOutcomes[tokenIndex]) {
                    const imageUrl = `https://ipfs.io${market.image[0].cidOutcomes[tokenIndex]}`;
                    return imageUrl;
                }
                return null;
            }

            // Fallback: Filter out SER-INVALID tokens as they don't count towards cidOutcomes index
            const validTokens = market.tokens.filter((token: any) =>
                token.name !== 'SER-INVALID' && !token.name?.includes('SER-INVALID')
            );

            const tokenIndex = validTokens.findIndex((token: any) =>
                token.id.toLowerCase() === tokenId?.toLowerCase()
            );

            if (tokenIndex >= 0 && market.image[0].cidOutcomes[tokenIndex]) {
                const imageUrl = `https://ipfs.io${market.image[0].cidOutcomes[tokenIndex]}`;
                return imageUrl;
            }

            return null;
        };

        // Check for conditional market relationship
        const market0 = pool?.market0;
        const market1 = pool?.market1;
        const token0 = pool?.token0;
        const token1 = pool?.token1;

        let conditionalInfo: { outcomeToken: any; outcomeMarket: any; collateralToken: any; collateralMarket: any } | null = null;

        if (market0 && market1 && token0 && token1) {
            const market0CollateralId = market0.collateralToken?.id;
            const market1CollateralId = market1.collateralToken?.id;

            // Check if this is a conditional market (one token is the collateral of the other market)
            if (market0CollateralId === token0.id) {
                // token0 is market0's collateral, so token1 is the outcome from market1
                conditionalInfo = { outcomeToken: token1, outcomeMarket: market1, collateralToken: token0, collateralMarket: market0 };
            } else if (market0CollateralId === token1.id) {
                // token1 is market0's collateral, so token0 is the outcome from market1
                conditionalInfo = { outcomeToken: token0, outcomeMarket: market1, collateralToken: token1, collateralMarket: market0 };
            } else if (market1CollateralId === token0.id) {
                // token0 is market1's collateral, so token1 is the outcome from market0
                conditionalInfo = { outcomeToken: token1, outcomeMarket: market0, collateralToken: token0, collateralMarket: market1 };
            } else if (market1CollateralId === token1.id) {
                // token1 is market1's collateral, so token0 is the outcome from market0
                conditionalInfo = { outcomeToken: token0, outcomeMarket: market0, collateralToken: token1, collateralMarket: market1 };
            }
        }

        // Try to find token images in market0 first, then market1
        let token0Url: string | null = null;
        let token1Url: string | null = null;
        let token0Source = 'none';
        let token1Source = 'none';

        if (pool.market0) {
            token0Url = findTokenImage(pool.market0, pool.token0?.id, 'market0');
            token1Url = findTokenImage(pool.market0, pool.token1?.id, 'market0');
            if (token0Url) token0Source = 'market0';
            if (token1Url) token1Source = 'market0';
        }

        // If not found in market0, try market1
        if (!token0Url && pool.market1) {

            token0Url = findTokenImage(pool.market1, pool.token0?.id, 'market1');
            if (token0Url) token0Source = 'market1';
        }
        if (!token1Url && pool.market1) {

            token1Url = findTokenImage(pool.market1, pool.token1?.id, 'market1');
            if (token1Url) token1Source = 'market1';
        }



        return { token0ImageUrl: token0Url, token1ImageUrl: token1Url, conditionalMarketInfo: conditionalInfo };
    }, [pool?.market0, pool?.market1, pool?.token0?.id, pool?.token1?.id, pool?.token0?.symbol, pool?.token1?.symbol]);

    if (!pool?.market0 && !pool?.market1) {
        return (
            <div className="token-pair-display">
                <div className="token-pair-fallback">
                    {pool?.token0?.symbol || 'T0'}/{pool?.token1?.symbol || 'T1'}
                </div>
            </div>
        );
    }

    // For conditional markets, show only the outcome token
    if (conditionalMarketInfo) {
        const { outcomeToken, outcomeMarket } = conditionalMarketInfo;
        const outcomeIsToken0 = outcomeToken.id === pool?.token0?.id;
        const outcomeImageUrl = outcomeIsToken0 ? token0ImageUrl : token1ImageUrl;

        // Try to get better outcome name from outcomes array
        const outcomeName = getOutcomeName(outcomeMarket, outcomeToken.id);
        const displayName = outcomeName || outcomeToken.symbol || outcomeToken.name || outcomeToken.id?.slice(0, 8) + '...';

        return (
            <div className="token-pair-display">
                <div className="outcome-token-display">
                    <TokenImage
                        imageUrl={outcomeImageUrl}
                        tokenSymbol={outcomeName || outcomeToken.symbol || outcomeToken.name || 'TOKEN'}
                        size={40}
                    />
                    <div className="outcome-token-symbol">
                        {displayName}
                    </div>
                </div>
            </div>
        );
    }

    // For top-level markets, show only the outcome token (non-collateral token)
    const market0 = pool?.market0;
    const market1 = pool?.market1;

    if (market0 || market1) {
        // Determine which token is the outcome token (not the collateral)
        let outcomeToken: any = null;
        let outcomeImageUrl: string | null = null;

        if (market0?.collateralToken?.id) {
            // market0 has collateral, so find the non-collateral token
            if (market0.collateralToken.id.toLowerCase() === pool.token0?.id?.toLowerCase()) {
                // token0 is collateral, token1 is outcome
                outcomeToken = pool.token1;
                outcomeImageUrl = token1ImageUrl;
            } else {
                // token1 is collateral, token0 is outcome
                outcomeToken = pool.token0;
                outcomeImageUrl = token0ImageUrl;
            }
        } else if (market1?.collateralToken?.id) {
            // market1 has collateral, so find the non-collateral token
            if (market1.collateralToken.id.toLowerCase() === pool.token0?.id?.toLowerCase()) {
                // token0 is collateral, token1 is outcome
                outcomeToken = pool.token1;
                outcomeImageUrl = token1ImageUrl;
            } else {
                // token1 is collateral, token0 is outcome  
                outcomeToken = pool.token0;
                outcomeImageUrl = token0ImageUrl;
            }
        } else {
            // No collateral token info, default to token0 as outcome
            outcomeToken = pool.token0;
            outcomeImageUrl = token0ImageUrl;
        }

        if (outcomeToken) {
            // Try to get better outcome name from outcomes array
            const outcomeMarket = market0 || market1;
            const outcomeName = getOutcomeName(outcomeMarket, outcomeToken.id);
            const displayName = outcomeName || outcomeToken.symbol || outcomeToken.name || outcomeToken.id?.slice(0, 8) + '...';

            return (
                <div className="token-pair-display">
                    <div className="outcome-token-display">
                        <TokenImage
                            imageUrl={outcomeImageUrl}
                            tokenSymbol={outcomeName || outcomeToken.symbol || outcomeToken.name || 'TOKEN'}
                            size={40}
                        />
                        <div className="outcome-token-symbol">
                            {displayName}
                        </div>
                    </div>
                </div>
            );
        }
    }

    // Fallback: show both tokens if no market info available
    return (
        <div className="token-pair-display">
            <div className="token-pair-images">
                <TokenImage
                    imageUrl={token0ImageUrl}
                    tokenSymbol={pool.token0?.symbol || 'T0'}
                    size={40}
                />
                <TokenImage
                    imageUrl={token1ImageUrl}
                    tokenSymbol={pool.token1?.symbol || 'T1'}
                    size={40}
                />
            </div>
            <div className="token-pair-symbols">
                {pool.token0?.symbol || 'T0'} / {pool.token1?.symbol || 'T1'}
            </div>
        </div>
    );
});

const MarketFarmsList = memo(({ farms, onFarmClick }: { farms: any[], onFarmClick: (farm: any) => void }) => {
    const [sortField, setSortField] = useState<string>('tvl');
    const [sortDirection, setSortDirection] = useState<boolean>(true);
    const [sortIndex, setSortIndex] = useState<number>(2);

    const handleSort = useHandleSort(sortField, sortDirection, setSortDirection, setSortField, setSortIndex);
    const arrow = useHandleArrow(sortField, sortIndex, sortDirection);

    // Sort the farms based on current sort criteria
    const sortedFarms = useMemo(() => {
        return [...farms].sort((a, b) => {
            let valueA: number, valueB: number;

            switch (sortField) {
                case 'tvl':
                    valueA = parseFloat(a.pool?.totalValueLockedUSD || '0');
                    valueB = parseFloat(b.pool?.totalValueLockedUSD || '0');
                    break;
                case 'tvlActive':
                    valueA = parseFloat(a.totalAmountUSDEstimated || '0');
                    valueB = parseFloat(b.totalAmountUSDEstimated || '0');
                    break;
                case 'dailyRewards':
                    valueA = a.dailyRewardRate || 0;
                    valueB = b.dailyRewardRate || 0;
                    break;
                case 'remainingRewards':
                    valueA = calculateRemainingRewards(a.endTimeImplied, a.rewardRate, a.rewardReserve);
                    valueB = calculateRemainingRewards(b.endTimeImplied, b.rewardRate, b.rewardReserve);
                    break;
                default:
                    return 0;
            }

            return sortDirection ? valueB - valueA : valueA - valueB;
        });
    }, [farms, sortField, sortDirection]);

    return (
        <div className="market-farms-list">
            <div className="market-farms-header">
                <div className="farm-header-item token-pair">
                    <Trans>Pool</Trans>
                </div>
                <div className="farm-header-item apr">
                    <Trans>APR</Trans>
                </div>
                <div className="farm-header-item tvl sortable" onClick={() => handleSort('tvl', 2)}>
                    <Trans>TVL</Trans>
                    <span className="sort-arrow">{arrow('tvl')}</span>
                </div>
                <div className="farm-header-item tvl-active sortable" onClick={() => handleSort('tvlActive', 3)}>
                    <Trans>TVL Active</Trans>
                    <span className="sort-arrow">{arrow('tvlActive')}</span>
                </div>
                <div className="farm-header-item rewards sortable" onClick={() => handleSort('dailyRewards', 4)}>
                    <Trans>Daily Rewards (SEER-LPP)</Trans>
                    <span className="sort-arrow">{arrow('dailyRewards')}</span>
                </div>
                <div className="farm-header-item remaining-rewards sortable" onClick={() => handleSort('remainingRewards', 5)}>
                    <Trans>Remaining Rewards</Trans>
                    <span className="sort-arrow">{arrow('remainingRewards')}</span>
                </div>
                <div className="farm-header-item action">
                    <Trans>Action</Trans>
                </div>
            </div>
            <div className="market-farms-body">
                {sortedFarms.map((farm: any, index: number) => (
                    <div key={index} className="market-farm-row">
                        <div className="farm-item token-pair">
                            <TokenPairDisplay pool={farm.pool} />
                        </div>
                        <div className="farm-item apr">
                            {farm.apr ? (
                                <span className="apr-value">{Math.round(farm.apr)}%</span>
                            ) : (
                                <span className="apr-placeholder">-</span>
                            )}
                        </div>
                        <div className="farm-item tvl">
                            {farm.pool?.totalValueLockedUSD ? (
                                <span className="tvl-value">{formatDollarAmount(parseFloat(farm.pool.totalValueLockedUSD))}</span>
                            ) : (
                                <span className="tvl-placeholder">-</span>
                            )}
                        </div>
                        <div className="farm-item tvl-active">
                            {farm.totalAmountUSDEstimated ? (
                                <span className="tvl-active-value">{formatDollarAmount(parseFloat(farm.totalAmountUSDEstimated))}</span>
                            ) : (
                                <span className="tvl-active-placeholder">-</span>
                            )}
                        </div>
                        <div className="farm-item rewards">
                            <div className="reward-amount">
                                {farm.dailyRewardRate ? `${farm.dailyRewardRate.toLocaleString()}` : '-'}
                            </div>
                        </div>
                        <div className="farm-item remaining-rewards">
                            <div className="remaining-reward-amount">
                                {farm.endTimeImplied && farm.rewardRate ? (
                                    <span className="remaining-rewards-value">
                                        {formatRemainingRewards(calculateRemainingRewards(farm.endTimeImplied, farm.rewardRate, farm.rewardReserve))}
                                    </span>
                                ) : (
                                    <span className="remaining-rewards-placeholder">-</span>
                                )}
                            </div>
                        </div>
                        <div className="farm-item action">
                            <button
                                className="farm-action-button"
                                onClick={() => onFarmClick(farm)}
                            >
                                <Trans>Farm</Trans>
                                <ExternalLink size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

const MarketImage = memo(({ market, marketName }: { market: Market | undefined, marketName: string }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const imageUrl = market?.image?.[0]?.cidMarket
        ? `https://ipfs.io${market.image[0].cidMarket}`
        : null;

    const handleImageError = useCallback(() => {
        setImageError(true);
        setImageLoading(false);
    }, []);

    const handleImageLoad = useCallback(() => {
        setImageLoading(false);
    }, []);

    if (!imageUrl || imageError) {
        return (
            <div className="eternal-page__market-image-placeholder">
                {marketName.charAt(0).toUpperCase()}
            </div>
        );
    }

    return (
        <div className="eternal-page__market-image-container">
            {imageLoading && (
                <div className="eternal-page__market-image-placeholder">
                    {marketName.charAt(0).toUpperCase()}
                </div>
            )}
            <img
                src={imageUrl}
                alt={marketName}
                className={`eternal-page__market-image ${imageLoading ? 'loading' : ''}`}
                onError={handleImageError}
                onLoad={handleImageLoad}
            />
        </div>
    );
});

export default function EternalFarmsPage({ data, refreshing, priceFetched, fetchHandler }: EternalFarmsPageProps) {
    const [modalForPool, setModalForPool] = useState<any>(null);
    const [expandedMarkets, setExpandedMarkets] = useState<Set<string>>(new Set());
    const [expandedChildMarkets, setExpandedChildMarkets] = useState<Set<string>>(new Set());
    const [sortBy, setSortBy] = useState<'name' | 'tvl' | 'rewards'>('tvl'); // Default sort by TVL

    useEffect(() => {
        // if (priceFetched) {
        fetchHandler();
        // }
    }, [priceFetched]);

    // Helper function to detect if a pool represents a conditional market relationship
    const isConditionalMarketPool = useCallback((farm: any): {
        parentMarket: Market;
        childMarket: Market;
        relationship: 'parent-child';
    } | null => {
        const market0: Market | null | undefined = farm.pool?.market0;
        const market1: Market | null | undefined = farm.pool?.market1;

        if (!market0 || !market1) return null;

        // Get token IDs for both markets (handle nullable tokens)
        const market0TokenIds = market0.tokens?.map((t: Token) => t.id) || [];
        const market1TokenIds = market1.tokens?.map((t: Token) => t.id) || [];
        const market0CollateralId = market0.collateralToken?.id;
        const market1CollateralId = market1.collateralToken?.id;

        // Strategy 1: Check collateral token relationships (most reliable)
        // If market0's collateralToken matches any token in market1 → market1 is parent
        const market0UsesMarket1Token = market0CollateralId && market1TokenIds.includes(market0CollateralId);
        // If market1's collateralToken matches any token in market0 → market0 is parent  
        const market1UsesMarket0Token = market1CollateralId && market0TokenIds.includes(market1CollateralId);

        // Strategy 2: Check explicit parent-child relationships from schema
        const market0HasChildMarkets = market0.childMarkets && market0.childMarkets.length > 0;
        const market1HasChildMarkets = market1.childMarkets && market1.childMarkets.length > 0;
        const market0HasParent = !!market0.parentMarket?.id;
        const market1HasParent = !!market1.parentMarket?.id;

        // Strategy 3: Check if parent-child IDs match
        const market0IsParentOfMarket1 = market0HasChildMarkets && market0.childMarkets?.some(child => child.id === market1.id);
        const market1IsParentOfMarket0 = market1HasChildMarkets && market1.childMarkets?.some(child => child.id === market0.id);
        const market0IsChildOfMarket1 = market0HasParent && market0.parentMarket?.id === market1.id;
        const market1IsChildOfMarket0 = market1HasParent && market1.parentMarket?.id === market0.id;

        // Determine parent-child relationship with PRIORITY-BASED GROUPING
        let parentMarket: Market | null = null;
        let childMarket: Market | null = null;

        // PRIORITY 1: Direct collateral token relationships (most reliable)
        if (market1UsesMarket0Token) {
            parentMarket = market0;
            childMarket = market1;
        } else if (market0UsesMarket1Token) {
            parentMarket = market1;
            childMarket = market0;
        }
        // PRIORITY 2: Explicit parent-child ID relationships
        else if (market0IsParentOfMarket1 || market1IsChildOfMarket0) {
            parentMarket = market0;
            childMarket = market1;
        } else if (market1IsParentOfMarket0 || market0IsChildOfMarket1) {
            parentMarket = market1;
            childMarket = market0;
        }
        // PRIORITY 3: Schema indicators with validation
        else if (market0HasChildMarkets && market1HasParent) {
            // Verify with collateral token if available
            if (!market1CollateralId || market0TokenIds.includes(market1CollateralId)) {
                parentMarket = market0;
                childMarket = market1;
            }
        } else if (market1HasChildMarkets && market0HasParent) {
            // Verify with collateral token if available
            if (!market0CollateralId || market1TokenIds.includes(market0CollateralId)) {
                parentMarket = market1;
                childMarket = market0;
            }
        }

        if (parentMarket && childMarket) {
            console.log(`[ConditionalMarket] 🎯 FOUND: ${parentMarket.marketName} → ${childMarket.marketName}`);
            return {
                parentMarket,
                childMarket,
                relationship: 'parent-child' as const
            };
        }

        return null;
    }, []);

    // Group farms by market with hierarchical structure for conditional markets
    const groupedFarms = useMemo(() => {
        if (!data || data.length === 0) {
            console.log('[EternalFarms] ❌ No data available for grouping');
            return {};
        }

        console.log(`[EternalFarms] 🚀 Processing ${data.length} farms for hierarchical grouping...`);

        const poolTVLMap = new Map<string, number>(); // Track unique pool TVLs
        const groups: any = {};

        data.forEach((farm: any) => {
            const conditionalRelationship = isConditionalMarketPool(farm);

            if (conditionalRelationship) {
                // Handle conditional markets with parent-child relationship
                const { parentMarket, childMarket } = conditionalRelationship;
                const parentKey = `${parentMarket.id}-${parentMarket.marketName}`;
                const childKey = `${childMarket.id}-${childMarket.marketName}`;

                // Create parent group if it doesn't exist
                if (!groups[parentKey]) {
                    groups[parentKey] = {
                        marketName: parentMarket.marketName,
                        marketId: parentMarket.id,
                        market: parentMarket as Market | undefined,
                        farms: [],
                        poolIds: new Set<string>(),
                        isParent: true,
                        childMarkets: {}
                    };
                }

                // Create child group under parent
                if (!groups[parentKey].childMarkets[childKey]) {
                    groups[parentKey].childMarkets[childKey] = {
                        marketName: childMarket.marketName,
                        marketId: childMarket.id,
                        market: childMarket as Market | undefined,
                        farms: [],
                        poolIds: new Set<string>(),
                        isChild: true,
                        parentKey: parentKey
                    };
                }

                // Add farm to child market
                groups[parentKey].childMarkets[childKey].farms.push(farm);

                // Track pools for TVL calculation in both parent and child
                const poolId = farm.pool?.id;
                if (poolId) {
                    const poolTVL = parseFloat(farm.pool?.totalValueLockedUSD || '0');

                    if (!groups[parentKey].childMarkets[childKey].poolIds.has(poolId)) {
                        groups[parentKey].childMarkets[childKey].poolIds.add(poolId);
                        if (poolTVL > 0) {
                            poolTVLMap.set(poolId, poolTVL);
                        }
                    }

                    if (!groups[parentKey].poolIds.has(poolId)) {
                        groups[parentKey].poolIds.add(poolId);
                    }
                }
            } else {
                // Handle regular markets with SMART MARKET SELECTION
                // Priority: Choose the market that has more complete data or is a parent market
                let selectedMarket: Market | null = null;

                const market0 = farm.pool?.market0;
                const market1 = farm.pool?.market1;

                if (market0 && market1) {
                    // PRIORITY 1: Choose parent market if one exists
                    const market0IsParent = (market0.childMarkets && market0.childMarkets.length > 0);
                    const market1IsParent = (market1.childMarkets && market1.childMarkets.length > 0);

                    if (market0IsParent && !market1IsParent) {
                        selectedMarket = market0;
                    } else if (market1IsParent && !market0IsParent) {
                        selectedMarket = market1;
                    }
                    // PRIORITY 2: Choose market with more complete data
                    else if (!selectedMarket) {
                        const market0Score = (market0.tokens?.length || 0) + (market0.collateralToken ? 1 : 0) + (market0.image?.length || 0);
                        const market1Score = (market1.tokens?.length || 0) + (market1.collateralToken ? 1 : 0) + (market1.image?.length || 0);

                        selectedMarket = market0Score >= market1Score ? market0 : market1;
                    }
                } else {
                    selectedMarket = market0 || market1;
                }

                const marketName = selectedMarket?.marketName || 'Unknown Market';
                const marketId = selectedMarket?.id || 'unknown';
                const marketKey = `${marketId}-${marketName}`;

                if (!groups[marketKey]) {
                    groups[marketKey] = {
                        marketName,
                        marketId,
                        market: selectedMarket as Market | undefined,
                        farms: [],
                        poolIds: new Set<string>(),
                        isParent: false,
                        childMarkets: {}
                    };
                }

                groups[marketKey].farms.push(farm);

                // Track unique pools for TVL calculation
                const poolId = farm.pool?.id;
                if (poolId && !groups[marketKey].poolIds.has(poolId)) {
                    groups[marketKey].poolIds.add(poolId);
                    const poolTVL = parseFloat(farm.pool?.totalValueLockedUSD || '0');
                    if (poolTVL > 0) {
                        poolTVLMap.set(poolId, poolTVL);
                    }
                }
            }
        });

        // Debug summary
        const parentGroups = Object.keys(groups).filter(key => groups[key].isParent);
        const regularGroups = Object.keys(groups).filter(key => !groups[key].isParent);
        console.log(`[EternalFarms] 📈 FINAL SUMMARY: ${parentGroups.length} parent markets, ${regularGroups.length} regular markets`);

        if (parentGroups.length > 0) {
            console.log(`[EternalFarms] 🏛️ Parent markets found:`, parentGroups.map(key => ({
                name: groups[key].marketName,
                id: groups[key].marketId,
                childCount: Object.keys(groups[key].childMarkets).length,
                directFarms: groups[key].farms.length,
                childDetails: Object.keys(groups[key].childMarkets).map(childKey => ({
                    name: groups[key].childMarkets[childKey].marketName,
                    farms: groups[key].childMarkets[childKey].farms.length
                }))
            })));
        } else {
            console.log(`[EternalFarms] ⚠️ No parent markets detected! This might indicate conditional market detection isn't working.`);
        }

        console.log(`[EternalFarms] 🏪 Regular markets:`, regularGroups.map(key => ({
            name: groups[key].marketName,
            id: groups[key].marketId,
            farms: groups[key].farms.length
        })));

        // Calculate total TVL and total daily rewards for each market group
        Object.values(groups).forEach((group: any) => {
            // Calculate for parent market
            group.totalTVL = Array.from(group.poolIds).reduce((total: number, poolId) => {
                return total + (poolTVLMap.get(poolId as string) || 0);
            }, 0);

            group.totalDailyRewards = group.farms.reduce((total: number, farm: any) => {
                return total + (farm.dailyRewardRate || 0);
            }, 0);

            // Calculate for child markets
            Object.values(group.childMarkets).forEach((childGroup: any) => {
                childGroup.totalTVL = Array.from(childGroup.poolIds).reduce((total: number, poolId) => {
                    return total + (poolTVLMap.get(poolId as string) || 0);
                }, 0);

                childGroup.totalDailyRewards = childGroup.farms.reduce((total: number, farm: any) => {
                    return total + (farm.dailyRewardRate || 0);
                }, 0);

                // Add child totals to parent totals
                group.totalDailyRewards += childGroup.totalDailyRewards;

                // Remove the poolIds set as we don't need it in the final object
                delete childGroup.poolIds;
            });

            // Remove the poolIds set as we don't need it in the final object
            delete group.poolIds;
        });

        return groups;
    }, [data, isConditionalMarketPool]);

    const sortedMarketKeys = useMemo(() => {
        const keys = Object.keys(groupedFarms).sort((a, b) => {
            const marketA = groupedFarms[a];
            const marketB = groupedFarms[b];

            // Always put "Unknown Market" at the end regardless of sort criteria
            if (marketA.marketName === 'Unknown Market' && marketB.marketName !== 'Unknown Market') return 1;
            if (marketA.marketName !== 'Unknown Market' && marketB.marketName === 'Unknown Market') return -1;

            switch (sortBy) {
                case 'tvl':
                    // Sort by TVL (descending - highest first)
                    return (marketB.totalTVL || 0) - (marketA.totalTVL || 0);

                case 'rewards':
                    // Sort by total daily rewards (descending - highest first)
                    return (marketB.totalDailyRewards || 0) - (marketA.totalDailyRewards || 0);

                case 'name':
                default:
                    // Sort alphabetically by name
                    return marketA.marketName.localeCompare(marketB.marketName);
            }
        });

        return keys;
    }, [groupedFarms, sortBy]);

    const toggleMarket = (marketKey: string) => {
        const newExpanded = new Set(expandedMarkets);
        if (newExpanded.has(marketKey)) {
            newExpanded.delete(marketKey);
        } else {
            newExpanded.add(marketKey);
        }
        setExpandedMarkets(newExpanded);
    };

    const toggleChildMarket = (childKey: string) => {
        const newExpanded = new Set(expandedChildMarkets);
        if (newExpanded.has(childKey)) {
            newExpanded.delete(childKey);
        } else {
            newExpanded.add(childKey);
        }
        setExpandedChildMarkets(newExpanded);
    };

    const toggleAllMarkets = () => {
        if (expandedMarkets.size === sortedMarketKeys.length) {
            // Collapse all
            setExpandedMarkets(new Set());
            setExpandedChildMarkets(new Set());
        } else {
            // Expand all parent markets
            setExpandedMarkets(new Set(sortedMarketKeys));
            // Expand all child markets
            const allChildKeys: string[] = [];
            sortedMarketKeys.forEach(parentKey => {
                const parentGroup = groupedFarms[parentKey];
                if (parentGroup.isParent) {
                    Object.keys(parentGroup.childMarkets).forEach(childKey => {
                        allChildKeys.push(childKey);
                    });
                }
            });
            setExpandedChildMarkets(new Set(allChildKeys));
        }
    };

    return (
        <>
            <Modal isOpen={!!modalForPool} onHide={() => setModalForPool(null)} onDismiss={() => console.log()}>
                {modalForPool && <FarmModal event={modalForPool} closeHandler={() => setModalForPool(null)} farmingType={FarmingType.ETERNAL} />}
            </Modal>
            {refreshing ? (
                <div className={"eternal-page__loader"}>
                    <Loader stroke="white" size="1.5rem" />
                </div>
            ) : !data || data.length === 0 ? (
                <div className={"eternal-page__loader"}>
                    <div>
                        <Trans>No infinite farms</Trans>
                    </div>
                    <Frown size={"2rem"} stroke={"white"} />
                </div>
            ) : !refreshing && data.length !== 0 ? (
                <div className={"eternal-page__container mb-1 w-100"}>
                    {sortedMarketKeys.length > 1 && (
                        <div className="eternal-page__controls">
                            <div className="eternal-page__sort-controls">
                                <span className="eternal-page__sort-label">Sort by:</span>
                                <select
                                    className="eternal-page__sort-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as 'name' | 'tvl' | 'rewards')}
                                >
                                    <option value="tvl">TVL (Highest)</option>
                                    <option value="rewards">Rewards (Highest)</option>
                                    <option value="name">Name (A-Z)</option>
                                </select>
                            </div>
                            <button
                                className="eternal-page__toggle-all"
                                onClick={toggleAllMarkets}
                            >
                                {expandedMarkets.size === sortedMarketKeys.length ? (
                                    <>
                                        <ChevronUp size={16} />
                                        <Trans>Collapse All</Trans>
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown size={16} />
                                        <Trans>Expand All</Trans>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                    {sortedMarketKeys.map((marketKey) => {
                        const marketGroup = groupedFarms[marketKey];
                        const isExpanded = expandedMarkets.has(marketKey);

                        return (
                            <div key={marketKey} className="eternal-page__market-group">
                                <div
                                    className="eternal-page__market-header"
                                    onClick={() => toggleMarket(marketKey)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            toggleMarket(marketKey);
                                        }
                                    }}
                                >
                                    <div className="eternal-page__market-info">
                                        <MarketImage
                                            market={marketGroup.market}
                                            marketName={marketGroup.marketName}
                                        />
                                        <div className="eternal-page__market-text">
                                            <h3 className="eternal-page__market-title">
                                                {marketGroup.marketName}
                                                {marketGroup.isParent && Object.keys(marketGroup.childMarkets).length > 0 && (
                                                    <span className="eternal-page__parent-market-badge">
                                                        <Trans>Parent Market</Trans>
                                                    </span>
                                                )}
                                            </h3>
                                            <span className="eternal-page__market-count">
                                                {(() => {
                                                    const directOutcomes = marketGroup.farms.length;
                                                    const childOutcomes = Object.values(marketGroup.childMarkets).reduce((sum: number, child: any) => sum + child.farms.length, 0);
                                                    const totalOutcomes = directOutcomes + childOutcomes;

                                                    if (marketGroup.isParent && childOutcomes > 0) {
                                                        return `${totalOutcomes} outcome${totalOutcomes !== 1 ? 's' : ''} (${directOutcomes} direct, ${childOutcomes} in child markets)`;
                                                    } else {
                                                        return `${directOutcomes} outcome${directOutcomes !== 1 ? 's' : ''}`;
                                                    }
                                                })()}
                                                {marketGroup.totalTVL > 0 && (
                                                    <span className="eternal-page__market-tvl">
                                                        • {formatDollarAmount(marketGroup.totalTVL)} TVL
                                                    </span>
                                                )}
                                                {marketGroup.totalDailyRewards > 0 && (
                                                    <span className="eternal-page__market-rewards">
                                                        • {marketGroup.totalDailyRewards.toLocaleString()} SEER-LPP/day
                                                    </span>
                                                )}
                                                {marketGroup.market?.collateralToken && (
                                                    <span className="eternal-page__market-collateral">
                                                        • Collateral: {(() => {
                                                            const collateralToken = marketGroup.market.collateralToken;
                                                            // Check if it's sDAI by address
                                                            if (collateralToken.id === '0x83fe227d7c59ce6c7b12d7e4c600f4b5e8b09e6b') {
                                                                return 'sDAI';
                                                            }
                                                            // First, try to find the token in the pool's tokens to get symbol/name
                                                            const poolTokens = [
                                                                ...Object.values(marketGroup.childMarkets).flatMap((child: any) =>
                                                                    child.farms.flatMap((farm: any) => [farm.pool?.token0, farm.pool?.token1])
                                                                ),
                                                                ...marketGroup.farms.flatMap((farm: any) => [farm.pool?.token0, farm.pool?.token1])
                                                            ].filter(Boolean);

                                                            const matchingToken = poolTokens.find((token: any) =>
                                                                token?.id?.toLowerCase() === collateralToken.id?.toLowerCase()
                                                            );

                                                            if (matchingToken?.symbol) {
                                                                return matchingToken.symbol;
                                                            }
                                                            if (matchingToken?.name) {
                                                                return matchingToken.name;
                                                            }

                                                            // Fallback to truncated address if no symbol/name found
                                                            return collateralToken.id.slice(0, 8) + '...';
                                                        })()}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="eternal-page__market-toggle">
                                        {isExpanded ? (
                                            <ChevronUp size={20} />
                                        ) : (
                                            <ChevronDown size={20} />
                                        )}
                                    </div>
                                </div>
                                <div className={`eternal-page__market-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
                                    {/* Render direct farms for this market (non-conditional or parent market farms) */}
                                    {marketGroup.farms.length > 0 && (
                                        <MarketFarmsList
                                            farms={marketGroup.farms}
                                            onFarmClick={setModalForPool}
                                        />
                                    )}

                                    {/* Render child markets if this is a parent market */}
                                    {marketGroup.isParent && Object.keys(marketGroup.childMarkets).length > 0 && (
                                        <div className="eternal-page__child-markets">
                                            {Object.entries(marketGroup.childMarkets).map(([childKey, childGroup]: [string, any]) => {
                                                const isChildExpanded = expandedChildMarkets.has(childKey);

                                                return (
                                                    <div key={childKey} className="eternal-page__child-market-group">
                                                        <div
                                                            className="eternal-page__child-market-header"
                                                            onClick={() => toggleChildMarket(childKey)}
                                                            role="button"
                                                            tabIndex={0}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' || e.key === ' ') {
                                                                    e.preventDefault();
                                                                    toggleChildMarket(childKey);
                                                                }
                                                            }}
                                                        >
                                                            <div className="eternal-page__child-market-info">
                                                                <MarketImage
                                                                    market={childGroup.market}
                                                                    marketName={childGroup.marketName}
                                                                />
                                                                <div className="eternal-page__child-market-text">
                                                                    <h4 className="eternal-page__child-market-title">
                                                                        {childGroup.marketName}
                                                                        <span className="eternal-page__child-market-badge">
                                                                            <Trans>Child Market</Trans>
                                                                        </span>
                                                                    </h4>
                                                                    <span className="eternal-page__child-market-count">
                                                                        {childGroup.farms.length} outcome{childGroup.farms.length !== 1 ? 's' : ''}
                                                                        {childGroup.totalTVL > 0 && (
                                                                            <span className="eternal-page__child-market-tvl">
                                                                                • {formatDollarAmount(childGroup.totalTVL)} TVL
                                                                            </span>
                                                                        )}
                                                                        {childGroup.totalDailyRewards > 0 && (
                                                                            <span className="eternal-page__child-market-rewards">
                                                                                • {childGroup.totalDailyRewards.toLocaleString()} SEER-LPP/day
                                                                            </span>
                                                                        )}
                                                                        {childGroup.market?.collateralToken && (
                                                                            <span className="eternal-page__child-market-collateral">
                                                                                • Collateral: {(() => {
                                                                                    const collateralToken = childGroup.market.collateralToken;
                                                                                    // Check if it's sDAI by address
                                                                                    if (collateralToken.id === '0x83fe227d7c59ce6c7b12d7e4c600f4b5e8b09e6b') {
                                                                                        return 'sDAI';
                                                                                    }
                                                                                    // Try to find the token in the child market's pool tokens to get symbol/name
                                                                                    const poolTokens = childGroup.farms.flatMap((farm: any) => [farm.pool?.token0, farm.pool?.token1]).filter(Boolean);

                                                                                    const matchingToken = poolTokens.find((token: any) =>
                                                                                        token?.id?.toLowerCase() === collateralToken.id?.toLowerCase()
                                                                                    );

                                                                                    if (matchingToken?.symbol) {
                                                                                        return matchingToken.symbol;
                                                                                    }
                                                                                    if (matchingToken?.name) {
                                                                                        return matchingToken.name;
                                                                                    }

                                                                                    // Fallback to truncated address if no symbol/name found
                                                                                    return collateralToken.id.slice(0, 8) + '...';
                                                                                })()}
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="eternal-page__child-market-toggle">
                                                                {isChildExpanded ? (
                                                                    <ChevronUp size={16} />
                                                                ) : (
                                                                    <ChevronDown size={16} />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className={`eternal-page__child-market-content ${isChildExpanded ? 'expanded' : 'collapsed'}`}>
                                                            <MarketFarmsList
                                                                farms={childGroup.farms}
                                                                onFarmClick={setModalForPool}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </>
    );
}
