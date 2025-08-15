import React, { useState, useMemo, useCallback, useEffect, memo } from 'react';
import { Trans } from '@lingui/macro';
import { Search, TrendingUp, DollarSign, Award, Plus, Filter, X, ChevronDown, ChevronUp, Info } from 'react-feather';
import { formatDollarAmount } from '../../utils/numbers';
import { getSeerTokenInfo } from '../../utils/seerTokenInfo';
import { formatUnits } from 'viem';
import { FarmCard } from './FarmCard';
import { MarketGroupedDisplay } from './MarketGroupedDisplay';
import Modal from '../../components/Modal';
import { FarmModal } from '../../components/FarmModal';
import { FarmingType } from '../../models/enums';
import { Market, Image, Token } from '../../state/data/generated';
import { useImageLoader } from '../../hooks/useImageLoader';
import { useAccount } from 'wagmi';
import SDAI_LOGO from '../../assets/images/sdai-logo.svg';
import './index.scss';

// Accept props from parent but use internal data fetching
interface EternalFarmsPageProps {
    data?: any;
    refreshing?: boolean;
    priceFetched?: boolean;
    fetchHandler?: () => any;
}

// Token Image Component with IPFS support
const TokenImage = memo(({ imageUrl, tokenSymbol, size = 24 }: { imageUrl: string | null, tokenSymbol: string, size?: number }) => {
    const { imageError, imageLoading, handleImageError, handleImageLoad } = useImageLoader();

    // Special case for sDAI - use imported logo
    if (tokenSymbol.toLowerCase() === 'sdai') {
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
        return (
            <div
                className="token-image-placeholder"
                style={{
                    width: size,
                    height: size,
                    fontSize: size * 0.4,
                    borderRadius: size * 0.5,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 600,
                    border: '2px solid rgba(255, 255, 255, 0.1)'
                }}
            >
                {tokenSymbol.charAt(0).toUpperCase()}
            </div>
        );
    }

    return (
        <div className="token-image-container" style={{ width: size, height: size, position: 'relative' }}>
            {imageLoading && (
                <div
                    className="token-image-placeholder"
                    style={{
                        width: size,
                        height: size,
                        fontSize: size * 0.4,
                        borderRadius: size * 0.5,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 600,
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                >
                    {tokenSymbol.charAt(0).toUpperCase()}
                </div>
            )}
            <img
                src={imageUrl}
                alt={tokenSymbol}
                className={`token-image ${imageLoading ? 'loading' : ''}`}
                style={{ 
                    width: size, 
                    height: size, 
                    borderRadius: size * 0.5,
                    opacity: imageLoading ? 0 : 1,
                    transition: 'opacity 0.3s ease'
                }}
                onError={handleImageError}
                onLoad={handleImageLoad}
            />
        </div>
    );
});

// Market Image Component
const MarketImage = memo(({ market, marketName, size = 48 }: { market: any, marketName: string, size?: number }) => {
    const { imageError, imageLoading, handleImageError, handleImageLoad } = useImageLoader();

    const imageUrl = useMemo(() => {
        if (market?.image?.[0]?.cidMarket) {
            return `https://ipfs.io${market.image[0].cidMarket}`;
        }
        return null;
    }, [market]);

    if (!imageUrl || imageError) {
        return (
            <div
                className="market-image-placeholder"
                style={{
                    width: size,
                    height: size,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, rgba(79, 195, 247, 0.2), rgba(41, 182, 246, 0.1))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: size * 0.4,
                    border: '1px solid rgba(79, 195, 247, 0.3)'
                }}
            >
                {marketName.charAt(0).toUpperCase()}
            </div>
        );
    }

    return (
        <div className="market-image-container" style={{ width: size, height: size, position: 'relative' }}>
            {imageLoading && (
                <div
                    className="market-image-placeholder"
                    style={{
                        width: size,
                        height: size,
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, rgba(79, 195, 247, 0.2), rgba(41, 182, 246, 0.1))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: size * 0.4,
                        border: '1px solid rgba(79, 195, 247, 0.3)',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                >
                    {marketName.charAt(0).toUpperCase()}
                </div>
            )}
            <img
                src={imageUrl}
                alt={marketName}
                className={`market-image ${imageLoading ? 'loading' : ''}`}
                style={{ 
                    width: size, 
                    height: size, 
                    borderRadius: 8,
                    objectFit: 'cover',
                    opacity: imageLoading ? 0 : 1,
                    transition: 'opacity 0.3s ease'
                }}
                onError={handleImageError}
                onLoad={handleImageLoad}
            />
        </div>
    );
});

const EternalFarmsPage = ({ data: propsData, refreshing: propsRefreshing, priceFetched, fetchHandler }: EternalFarmsPageProps) => {
    // Use propsData directly since it's passed from parent
    const allFarms = propsData || [];
    const loading = propsRefreshing || false;
    const { address: account } = useAccount();
    
    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'high-reward' | 'active' | 'my-farms'>('all');
    const [showLiquidityHelper, setShowLiquidityHelper] = useState(false);
    const [selectedFarm, setSelectedFarm] = useState<any>(null);
    const [expandedMarkets, setExpandedMarkets] = useState<Set<string>>(new Set());
    const [expandedChildMarkets, setExpandedChildMarkets] = useState<Set<string>>(new Set());
    const [totalAPR, setTotalAPR] = useState<number>(0);
    
    // Call fetchHandler once on mount to load initial data
    useEffect(() => {
        if (fetchHandler) {
            fetchHandler();
        }
    }, []); // Empty dependency array to run only once on mount

    // Group farms by market with hierarchical structure for conditional markets
    const groupedFarms = useMemo(() => {
        if (!allFarms || allFarms.length === 0) {
            return {};
        }

        const poolTVLMap = new Map<string, number>();
        const groups: any = {};

        allFarms.forEach((farm: any) => {
            const pool = farm.pool;
            if (!pool) return;

            // Track unique pool TVLs
            const poolId = pool.id;
            const poolTVL = parseFloat(pool.totalValueLockedUSD || '0');
            if (!poolTVLMap.has(poolId)) {
                poolTVLMap.set(poolId, poolTVL);
            }

            // Determine which market(s) this pool belongs to
            const market0 = pool.market0;
            const market1 = pool.market1;

            // Function to add farm to a market group
            const addToMarketGroup = (market: any, isChildMarket = false, parentMarketId?: string) => {
                if (!market) return;

                const marketId = market.id;
                const marketName = market.marketName || 'Unknown Market';

                // Initialize group if it doesn't exist
                if (!groups[marketId]) {
                    groups[marketId] = {
                        marketId,
                        marketName,
                        market,
                        farms: [],
                        childMarkets: {},
                        poolIds: new Set<string>(),
                        isParent: false,
                        totalTVL: 0,
                        totalDailyRewards: 0
                    };
                }

                // Add farm to the group
                groups[marketId].farms.push(farm);
                groups[marketId].poolIds.add(poolId);

                // If this is a child market, also add it to parent's children
                if (isChildMarket && parentMarketId && groups[parentMarketId]) {
                    if (!groups[parentMarketId].childMarkets[marketId]) {
                        groups[parentMarketId].childMarkets[marketId] = {
                            marketId,
                            marketName,
                            market,
                            farms: [],
                            poolIds: new Set<string>(),
                            totalTVL: 0,
                            totalDailyRewards: 0
                        };
                    }
                    groups[parentMarketId].childMarkets[marketId].farms.push(farm);
                    groups[parentMarketId].childMarkets[marketId].poolIds.add(poolId);
                    groups[parentMarketId].isParent = true;
                }
            };

            // Check if this is a conditional market relationship
            if (market0 && market1) {
                const market0CollateralId = market0.collateralToken?.id;
                const market1CollateralId = market1.collateralToken?.id;
                const token0Id = pool.token0?.id;
                const token1Id = pool.token1?.id;

                // Determine parent-child relationship
                let isConditional = false;
                if (market0CollateralId && (market0CollateralId === token0Id || market0CollateralId === token1Id)) {
                    // market1 is the child market (uses market0's outcome as collateral)
                    addToMarketGroup(market0, false);
                    addToMarketGroup(market1, true, market0.id);
                    isConditional = true;
                } else if (market1CollateralId && (market1CollateralId === token0Id || market1CollateralId === token1Id)) {
                    // market0 is the child market (uses market1's outcome as collateral)
                    addToMarketGroup(market1, false);
                    addToMarketGroup(market0, true, market1.id);
                    isConditional = true;
                }

                // If not conditional, add to both markets normally
                if (!isConditional) {
                    addToMarketGroup(market0, false);
                    addToMarketGroup(market1, false);
                }
            } else if (market0) {
                addToMarketGroup(market0, false);
            } else if (market1) {
                addToMarketGroup(market1, false);
            }
        });

        // Calculate totals for each group
        Object.values(groups).forEach((group: any) => {
            // Calculate for parent market
            group.totalTVL = Array.from(group.poolIds).reduce((total: number, poolId) => {
                return total + (poolTVLMap.get(poolId as string) || 0);
            }, 0);

            group.totalDailyRewards = group.farms.reduce((total: number, farm: any) => {
                // Calculate daily rewards with proper decimals
                const rewardTokenDecimals = farm.rewardToken?.decimals || 18;
                const dailyReward = farm.rewardRate ? 
                    parseFloat(formatUnits(BigInt(farm.rewardRate) * 86400n, rewardTokenDecimals)) : 
                    farm.dailyRewardRate || 0;
                return total + dailyReward;
            }, 0);

            // Calculate for child markets
            Object.values(group.childMarkets).forEach((childGroup: any) => {
                childGroup.totalTVL = Array.from(childGroup.poolIds).reduce((total: number, poolId) => {
                    return total + (poolTVLMap.get(poolId as string) || 0);
                }, 0);

                childGroup.totalDailyRewards = childGroup.farms.reduce((total: number, farm: any) => {
                    // Calculate daily rewards with proper decimals
                    const rewardTokenDecimals = farm.rewardToken?.decimals || 18;
                    const dailyReward = farm.rewardRate ? 
                        parseFloat(formatUnits(BigInt(farm.rewardRate) * 86400n, rewardTokenDecimals)) : 
                        farm.dailyRewardRate || 0;
                    return total + dailyReward;
                }, 0);

                // Add child totals to parent totals
                group.totalDailyRewards += childGroup.totalDailyRewards;

                // Remove poolIds set from final object
                delete childGroup.poolIds;
            });

            // Remove poolIds set from final object
            delete group.poolIds;
        });

        return groups;
    }, [allFarms]);

    // Calculate aggregate stats
    const stats = useMemo(() => {
        if (!allFarms || allFarms.length === 0) {
            return {
                totalTVL: 0,
                totalDailyRewards: 0,
                averageAPR: 0,
                activeFarms: 0,
                seerPrice: 0
            };
        }

        const totalTVL = allFarms.reduce((sum, farm) => {
            const tvl = parseFloat(farm.pool?.totalValueLockedUSD || '0');
            return sum + tvl;
        }, 0);

        const totalDailyRewards = allFarms.reduce((sum, farm) => {
            // Calculate daily rewards with proper decimals
            const rewardTokenDecimals = farm.rewardToken?.decimals || 18;
            const dailyReward = farm.rewardRate ? 
                parseFloat(formatUnits(BigInt(farm.rewardRate) * 86400n, rewardTokenDecimals)) : 
                farm.dailyRewardRate || 0;
            return sum + dailyReward;
        }, 0);

        // Calculate average APR based on total rewards and total TVL
        // This is more accurate than averaging individual APRs
        let averageAPR = 0;
        if (totalTVL > 0) {
            // Total APR = (Total Daily Rewards in SEER * SEER Price * 365) / Total TVL * 100
            // We'll calculate this asynchronously and store it in state
            averageAPR = 0; // Will be calculated with SEER price
        }

        const activeFarms = allFarms.filter(f => f.totalAmountUSDEstimated && parseFloat(f.totalAmountUSDEstimated) > 0).length;

        return {
            totalTVL,
            totalDailyRewards,
            averageAPR,
            activeFarms,
            seerPrice: 0
        };
    }, [allFarms]);
    
    // Calculate total APR based on total rewards and TVL
    useEffect(() => {
        const calculateTotalAPR = async () => {
            if (stats.totalTVL > 0 && stats.totalDailyRewards > 0) {
                try {
                    const { pricePerToken } = await getSeerTokenInfo();
                    // Total APR = (Total Daily Rewards * SEER Price * 365) / Total TVL * 100
                    const annualRewardsUSD = stats.totalDailyRewards * pricePerToken * 365;
                    const apr = (annualRewardsUSD / stats.totalTVL) * 100;
                    setTotalAPR(apr);
                } catch (error) {
                    console.error('Failed to calculate total APR:', error);
                    setTotalAPR(0);
                }
            } else {
                setTotalAPR(0);
            }
        };
        
        calculateTotalAPR();
    }, [stats.totalTVL, stats.totalDailyRewards]);

    // Sort market keys by total TVL
    const sortedMarketKeys = useMemo(() => {
        return Object.keys(groupedFarms).sort((a, b) => {
            const aGroup = groupedFarms[a];
            const bGroup = groupedFarms[b];
            return (bGroup.totalTVL || 0) - (aGroup.totalTVL || 0);
        });
    }, [groupedFarms]);

    // Toggle market expansion
    const toggleMarket = useCallback((marketKey: string) => {
        setExpandedMarkets(prev => {
            const newSet = new Set(prev);
            if (newSet.has(marketKey)) {
                newSet.delete(marketKey);
            } else {
                newSet.add(marketKey);
            }
            return newSet;
        });
    }, []);

    // Toggle all markets
    const toggleAllMarkets = useCallback(() => {
        if (expandedMarkets.size === sortedMarketKeys.length) {
            setExpandedMarkets(new Set());
        } else {
            setExpandedMarkets(new Set(sortedMarketKeys));
        }
    }, [expandedMarkets, sortedMarketKeys]);

    // Filter and search farms
    const filteredFarms = useMemo(() => {
        if (!allFarms) return [];

        let filtered = [...allFarms];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(farm => {
                const token0 = farm.pool?.token0?.symbol?.toLowerCase() || '';
                const token1 = farm.pool?.token1?.symbol?.toLowerCase() || '';
                return token0.includes(query) || token1.includes(query);
            });
        }

        // Apply category filter
        switch (activeFilter) {
            case 'high-reward':
                filtered = filtered.filter(farm => {
                    // Calculate daily rewards with proper decimals
                    const rewardTokenDecimals = farm.rewardToken?.decimals || 18;
                    const dailyReward = farm.rewardRate ? 
                        parseFloat(formatUnits(BigInt(farm.rewardRate) * 86400n, rewardTokenDecimals)) : 
                        farm.dailyRewardRate || 0;
                    return (farm.apr && farm.apr > 50) || (dailyReward > 5000);
                });
                break;
            case 'active':
                filtered = filtered.filter(farm => 
                    farm.totalAmountUSDEstimated && parseFloat(farm.totalAmountUSDEstimated) > 0
                );
                break;
            case 'my-farms':
                // Filter farms where user has positions
                if (account) {
                    filtered = filtered.filter(farm => {
                        // Check if user has any deposits in this farm
                        // This assumes the farm object has user position data
                        return farm.userDeposits && farm.userDeposits.length > 0;
                    });
                } else {
                    filtered = [];
                }
                break;
        }

        // Sort by APR descending
        filtered.sort((a, b) => (b.apr || 0) - (a.apr || 0));

        return filtered;
    }, [allFarms, searchQuery, activeFilter]);

    // Top performing farms for liquidity helper
    const topFarms = useMemo(() => {
        if (!allFarms) return [];
        return [...allFarms]
            .filter(f => f.apr && f.apr > 0)
            .sort((a, b) => (b.apr || 0) - (a.apr || 0))
            .slice(0, 3);
    }, [allFarms]);

    const handleFarmClick = useCallback((farm: any) => {
        setSelectedFarm(farm);
    }, []);

    const handleAddLiquidityToTop = useCallback(() => {
        if (topFarms.length > 0) {
            handleFarmClick(topFarms[0]);
        }
    }, [topFarms, handleFarmClick]);

    if (loading) {
        return (
            <div className="eternal-page__loader">
                <div className="spinner"></div>
                <p><Trans>Loading farms...</Trans></p>
            </div>
        );
    }

    return (
        <div className="eternal-page">
            {/* Hero Section */}
            <div className="eternal-page__hero">
                <h1><Trans>Liquidity Farms</Trans></h1>
                <p><Trans>Provide liquidity to earn rewards on your favorite prediction markets</Trans></p>
            </div>

            {/* Stats Bar */}
            <div className="eternal-page__stats-bar">
                <div className="eternal-page__stat-card">
                    <div className="eternal-page__stat-card-label">
                        <Trans>Total Value Locked</Trans>
                    </div>
                    <div className="eternal-page__stat-card-value eternal-page__stat-card-value--tvl">
                        {formatDollarAmount(stats.totalTVL)}
                    </div>
                </div>
                <div className="eternal-page__stat-card">
                    <div className="eternal-page__stat-card-label">
                        <Trans>Daily Rewards</Trans>
                    </div>
                    <div className="eternal-page__stat-card-value eternal-page__stat-card-value--rewards">
                        {stats.totalDailyRewards.toLocaleString(undefined, { maximumFractionDigits: 2 })} SEER
                    </div>
                </div>
                <div className="eternal-page__stat-card">
                    <div className="eternal-page__stat-card-label">
                        <Trans>Total APR</Trans>
                        <div className="apr-info-icon">
                            <Info size={14} />
                            <div className="apr-tooltip">
                                <div className="apr-tooltip-content">
                                    <strong>APR Estimate</strong>
                                    <p>Based on $1M SEER market cap & average LP range.</p>
                                    <p>Tighter ranges earn higher rewards.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="eternal-page__stat-card-value eternal-page__stat-card-value--apr">
                        {Math.round(totalAPR)}%
                    </div>
                </div>
                <div className="eternal-page__stat-card">
                    <div className="eternal-page__stat-card-label">
                        <Trans>Active Farms</Trans>
                    </div>
                    <div className="eternal-page__stat-card-value">
                        {stats.activeFarms}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="eternal-page__controls">
                <div className="eternal-page__search-box">
                    <label htmlFor="farm-search" className="sr-only">Search farms by token</label>
                    <input
                        id="farm-search"
                        type="text"
                        placeholder="Search by token..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search farms by token"
                    />
                    <Search size={20} />
                </div>
                <div className="eternal-page__filter-group" role="group" aria-label="Filter farms">
                    <button 
                        className={`eternal-page__filter-chip ${activeFilter === 'all' ? 'eternal-page__filter-chip--active' : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        <Trans>All Farms</Trans>
                    </button>
                    <button 
                        className={`eternal-page__filter-chip eternal-page__filter-chip--highlight ${activeFilter === 'high-reward' ? 'eternal-page__filter-chip--active' : ''}`}
                        onClick={() => setActiveFilter('high-reward')}
                    >
                        <Award size={16} />
                        <Trans>High Rewards</Trans>
                    </button>
                    <button 
                        className={`eternal-page__filter-chip ${activeFilter === 'active' ? 'eternal-page__filter-chip--active' : ''}`}
                        onClick={() => setActiveFilter('active')}
                    >
                        <Trans>Active</Trans>
                    </button>
                    <button 
                        className={`eternal-page__filter-chip ${activeFilter === 'my-farms' ? 'eternal-page__filter-chip--active' : ''}`}
                        onClick={() => setActiveFilter('my-farms')}
                        disabled={!account}
                        title={!account ? 'Connect wallet to view your farms' : undefined}
                    >
                        <Trans>My Farms</Trans>
                    </button>
                </div>
            </div>

            {/* Market Grouped Display */}
            <MarketGroupedDisplay
                sortedMarketKeys={sortedMarketKeys}
                groupedFarms={groupedFarms}
                expandedMarkets={expandedMarkets}
                toggleMarket={toggleMarket}
                toggleAllMarkets={toggleAllMarkets}
                handleFarmClick={handleFarmClick}
                MarketImage={MarketImage}
                TokenImage={TokenImage}
                searchQuery={searchQuery}
                activeFilter={activeFilter}
                setSearchQuery={setSearchQuery}
                setActiveFilter={setActiveFilter}
            />

            {/* Floating Liquidity Assistant */}
            <div className="liquidity-assistant">
                <button 
                    className="liquidity-assistant__toggle"
                    onClick={() => setShowLiquidityHelper(!showLiquidityHelper)}
                    aria-label="Liquidity Assistant"
                >
                    {showLiquidityHelper ? <X size={24} /> : <Plus size={24} />}
                </button>
                
                <div className={`liquidity-assistant__panel ${showLiquidityHelper ? 'liquidity-assistant__panel--open' : ''}`}>
                    <h3><Trans>Quick Add Liquidity</Trans></h3>
                    <p><Trans>Top performing farms right now:</Trans></p>
                    
                    <div className="suggestion-list">
                        {topFarms.map((farm, index) => (
                            <div 
                                key={index} 
                                className="suggestion"
                                onClick={() => {
                                    handleFarmClick(farm);
                                    setShowLiquidityHelper(false);
                                }}
                            >
                                <div className="farm-name">
                                    {farm.pool?.token0?.symbol}/{farm.pool?.token1?.symbol}
                                </div>
                                <div className="farm-apr">
                                    APR: {Math.round(farm.apr || 0)}%
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button onClick={handleAddLiquidityToTop}>
                        <Trans>Add to Best Farm</Trans>
                    </button>
                </div>
            </div>

            {/* Farm Modal */}
            <Modal isOpen={!!selectedFarm} onHide={() => setSelectedFarm(null)} onDismiss={() => console.log()}>
                {selectedFarm && <FarmModal event={selectedFarm} closeHandler={() => setSelectedFarm(null)} farmingType={FarmingType.ETERNAL} />}
            </Modal>
        </div>
    );
};

export default EternalFarmsPage;