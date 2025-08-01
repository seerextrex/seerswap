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
import { Market, Image } from '../../state/data/generated';

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
    const { token0ImageUrl, token1ImageUrl } = useMemo(() => {
        console.log(`[TokenPairDisplay] 🔍 Analyzing pool ${pool?.id} (${pool?.token0?.symbol}/${pool?.token1?.symbol}):`, {
            hasMarket0: !!pool?.market0,
            hasMarket1: !!pool?.market1,
            market0TokenCount: pool?.market0?.tokens?.length || 0,
            market1TokenCount: pool?.market1?.tokens?.length || 0,
            market0ImageCount: pool?.market0?.image?.[0]?.cidOutcomes?.length || 0,
            market1ImageCount: pool?.market1?.image?.[0]?.cidOutcomes?.length || 0
        });

        if (!pool?.market0 && !pool?.market1) {
            console.warn(`[TokenPairDisplay] ⚠️ No markets found for pool ${pool?.id}`);
            return { token0ImageUrl: null, token1ImageUrl: null };
        }

        // Helper function to find token image in a market
        const findTokenImage = (market: Pick<Market, 'id' | 'marketName' | 'wrappedTokensString'> & { image: Array<Pick<Image, 'id' | 'cidMarket' | 'cidOutcomes'>>; tokens: Array<{ id: string; name: string }> } | null | undefined, tokenId: string, marketName: string) => {
            if (!market?.tokens || !market?.image?.[0]?.cidOutcomes) {
                console.log(`[TokenPairDisplay] 📊 ${marketName} missing data: tokens=${!!market?.tokens}, images=${!!market?.image?.[0]?.cidOutcomes}`);
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
            console.log(`[TokenPairDisplay] 🔄 Token0 ${pool.token0?.symbol} not in market0, trying market1...`);
            token0Url = findTokenImage(pool.market1, pool.token0?.id, 'market1');
            if (token0Url) token0Source = 'market1';
        }
        if (!token1Url && pool.market1) {
            console.log(`[TokenPairDisplay] 🔄 Token1 ${pool.token1?.symbol} not in market0, trying market1...`);
            token1Url = findTokenImage(pool.market1, pool.token1?.id, 'market1');
            if (token1Url) token1Source = 'market1';
        }

        // Summary log for this token pair
        console.log(`[TokenPairDisplay] 📋 Final results for ${pool.token0?.symbol}/${pool.token1?.symbol}:`, {
            token0: { found: !!token0Url, source: token0Source, url: token0Url || 'none' },
            token1: { found: !!token1Url, source: token1Source, url: token1Url || 'none' }
        });

        return { token0ImageUrl: token0Url, token1ImageUrl: token1Url };
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

    return (
        <div className="token-pair-display">
            <div className="token-pair-images">
                <TokenImage
                    imageUrl={token0ImageUrl}
                    tokenSymbol={pool.token0?.symbol || 'T0'}
                    size={32}
                />
                <TokenImage
                    imageUrl={token1ImageUrl}
                    tokenSymbol={pool.token1?.symbol || 'T1'}
                    size={32}
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
    const [sortBy, setSortBy] = useState<'name' | 'tvl' | 'rewards'>('tvl'); // Default sort by TVL

    useEffect(() => {
        // if (priceFetched) {
        fetchHandler();
        // }
    }, [priceFetched]);

    // Group farms by market
    const groupedFarms = useMemo(() => {
        if (!data || data.length === 0) return {};

        const poolTVLMap = new Map<string, number>(); // Track unique pool TVLs

        const groups = data.reduce((groups: any, event: any) => {
            const marketName = event.pool?.market0?.marketName || 'Unknown Market';
            const marketId = event.pool?.market0?.id || 'unknown';
            const marketKey = `${marketId}-${marketName}`;

            if (!groups[marketKey]) {
                groups[marketKey] = {
                    marketName,
                    marketId,
                    market: event.pool?.market0 as Market | undefined,
                    farms: [],
                    poolIds: new Set<string>()
                };
            }

            groups[marketKey].farms.push(event);

            // Track unique pools for TVL calculation
            const poolId = event.pool?.id;
            if (poolId && !groups[marketKey].poolIds.has(poolId)) {
                groups[marketKey].poolIds.add(poolId);
                const poolTVL = parseFloat(event.pool?.totalValueLockedUSD || '0');
                if (poolTVL > 0) {
                    poolTVLMap.set(poolId, poolTVL);
                }
            }

            return groups;
        }, {});

        // Calculate total TVL for each market
        Object.values(groups).forEach((group: any) => {
            group.totalTVL = Array.from(group.poolIds).reduce((total: number, poolId) => {
                return total + (poolTVLMap.get(poolId as string) || 0);
            }, 0);

            // Calculate total daily rewards for this market
            group.totalDailyRewards = group.farms.reduce((total: number, farm: any) => {
                return total + (farm.dailyRewardRate || 0);
            }, 0);

            // Remove the poolIds set as we don't need it in the final object
            delete group.poolIds;
        });

        return groups;
    }, [data]);

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

    const toggleAllMarkets = () => {
        if (expandedMarkets.size === sortedMarketKeys.length) {
            // Collapse all
            setExpandedMarkets(new Set());
        } else {
            // Expand all
            setExpandedMarkets(new Set(sortedMarketKeys));
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
                                            </h3>
                                            <span className="eternal-page__market-count">
                                                {marketGroup.farms.length} pool{marketGroup.farms.length !== 1 ? 's' : ''}
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
                                    <MarketFarmsList
                                        farms={marketGroup.farms}
                                        onFarmClick={setModalForPool}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </>
    );
}
