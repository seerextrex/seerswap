import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import { Search, TrendingUp, DollarSign, Award, Plus, Filter, X } from 'react-feather';
import { formatDollarAmount } from '../../utils/numbers';
import { FarmCard } from './FarmCard';
import Modal from '../../components/Modal';
import { FarmModal } from '../../components/FarmModal';
import { FarmingType } from '../../models/enums';
import './index.scss';

// Accept props from parent but use internal data fetching
interface EternalFarmsPageProps {
    data?: any;
    refreshing?: boolean;
    priceFetched?: boolean;
    fetchHandler?: () => any;
}

const EternalFarmsPage = ({ data: propsData, refreshing: propsRefreshing, priceFetched, fetchHandler }: EternalFarmsPageProps) => {
    // Use propsData directly since it's passed from parent
    const allFarms = propsData || [];
    const loading = propsRefreshing || false;
    
    // Call fetchHandler once on mount to load initial data
    useEffect(() => {
        if (fetchHandler) {
            fetchHandler();
        }
    }, []); // Empty dependency array to run only once on mount
    
    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'high-reward' | 'active' | 'my-farms'>('all');
    const [showLiquidityHelper, setShowLiquidityHelper] = useState(false);
    const [selectedFarm, setSelectedFarm] = useState<any>(null);

    // Calculate aggregate stats
    const stats = useMemo(() => {
        if (!allFarms || allFarms.length === 0) {
            return {
                totalTVL: 0,
                totalDailyRewards: 0,
                averageAPR: 0,
                activeFarms: 0
            };
        }

        const totalTVL = allFarms.reduce((sum, farm) => {
            const tvl = parseFloat(farm.pool?.totalValueLockedUSD || '0');
            return sum + tvl;
        }, 0);

        const totalDailyRewards = allFarms.reduce((sum, farm) => {
            return sum + (farm.dailyRewardRate || 0);
        }, 0);

        const farmsWithAPR = allFarms.filter(f => f.apr && f.apr > 0);
        const averageAPR = farmsWithAPR.length > 0
            ? farmsWithAPR.reduce((sum, f) => sum + f.apr, 0) / farmsWithAPR.length
            : 0;

        const activeFarms = allFarms.filter(f => f.totalAmountUSDEstimated && parseFloat(f.totalAmountUSDEstimated) > 0).length;

        return {
            totalTVL,
            totalDailyRewards,
            averageAPR,
            activeFarms
        };
    }, [allFarms]);

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
                filtered = filtered.filter(farm => 
                    (farm.apr && farm.apr > 50) || 
                    (farm.dailyRewardRate && farm.dailyRewardRate > 5000)
                );
                break;
            case 'active':
                filtered = filtered.filter(farm => 
                    farm.totalAmountUSDEstimated && parseFloat(farm.totalAmountUSDEstimated) > 0
                );
                break;
            case 'my-farms':
                // This would filter to user's positions - placeholder for now
                filtered = [];
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
                        {Math.round(stats.totalDailyRewards).toLocaleString()} SEER
                    </div>
                </div>
                <div className="eternal-page__stat-card">
                    <div className="eternal-page__stat-card-label">
                        <Trans>Average APR</Trans>
                    </div>
                    <div className="eternal-page__stat-card-value eternal-page__stat-card-value--apr">
                        {Math.round(stats.averageAPR)}%
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
                <div className="eternal-page__filter-group">
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
                    >
                        <Trans>My Farms</Trans>
                    </button>
                </div>
            </div>

            {/* Farms Grid or Empty State */}
            {filteredFarms.length > 0 ? (
                <div className="eternal-page__farms-grid">
                    {filteredFarms.map((farm, index) => (
                        <FarmCard
                            key={`${farm.pool?.id}-${index}`}
                            farm={farm}
                            onClick={() => handleFarmClick(farm)}
                        />
                    ))}
                </div>
            ) : (
                <div className="eternal-page__empty-state">
                    <Filter size={64} />
                    <h3><Trans>No farms found</Trans></h3>
                    <p>
                        {searchQuery ? (
                            <Trans>Try adjusting your search terms</Trans>
                        ) : activeFilter === 'my-farms' ? (
                            <Trans>You don't have any active positions yet</Trans>
                        ) : (
                            <Trans>No farms match your current filters</Trans>
                        )}
                    </p>
                    <button onClick={() => {
                        setSearchQuery('');
                        setActiveFilter('all');
                    }}>
                        <Trans>Clear Filters</Trans>
                    </button>
                </div>
            )}

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