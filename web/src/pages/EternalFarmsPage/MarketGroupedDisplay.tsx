import React from 'react';
import { Trans } from '@lingui/macro';
import { ChevronDown, ChevronUp, Filter } from 'react-feather';
import { formatDollarAmount } from '../../utils/numbers';
import { FarmCard } from './FarmCard';

interface MarketGroupedDisplayProps {
    sortedMarketKeys: string[];
    groupedFarms: any;
    expandedMarkets: Set<string>;
    toggleMarket: (key: string) => void;
    toggleAllMarkets: () => void;
    handleFarmClick: (farm: any) => void;
    MarketImage: any;
    TokenImage: any;
    searchQuery: string;
    activeFilter: string;
    setSearchQuery: (query: string) => void;
    setActiveFilter: (filter: any) => void;
}

export const MarketGroupedDisplay: React.FC<MarketGroupedDisplayProps> = ({
    sortedMarketKeys,
    groupedFarms,
    expandedMarkets,
    toggleMarket,
    toggleAllMarkets,
    handleFarmClick,
    MarketImage,
    TokenImage,
    searchQuery,
    activeFilter,
    setSearchQuery,
    setActiveFilter
}) => {
    // Check if there are any markets to display
    const hasMarkets = sortedMarketKeys.length > 0;

    if (!hasMarkets) {
        return (
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
        );
    }

    return (
        <div className="eternal-page__markets-container">
            {/* Toggle All Button */}
            <div className="eternal-page__markets-header">
                <button 
                    className="eternal-page__toggle-all"
                    onClick={toggleAllMarkets}
                >
                    {expandedMarkets.size === sortedMarketKeys.length ? (
                        <>
                            <ChevronUp size={18} />
                            <Trans>Collapse All</Trans>
                        </>
                    ) : (
                        <>
                            <ChevronDown size={18} />
                            <Trans>Expand All</Trans>
                        </>
                    )}
                </button>
            </div>

            {/* Market Groups */}
            {sortedMarketKeys.map((marketKey) => {
                const marketGroup = groupedFarms[marketKey];
                const isExpanded = expandedMarkets.has(marketKey);
                
                // Skip child markets from top level (they'll be shown under parents)
                const isChildOfAnotherMarket = Object.values(groupedFarms).some((group: any) => 
                    group.childMarkets && group.childMarkets[marketKey]
                );
                if (isChildOfAnotherMarket) return null;

                return (
                    <div key={marketKey} className="eternal-page__market-group">
                        {/* Market Header */}
                        <div
                            className="eternal-page__market-header"
                            onClick={() => toggleMarket(marketKey)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleMarket(marketKey);
                                }
                            }}
                            role="button"
                            tabIndex={0}
                            aria-expanded={isExpanded}
                            aria-controls={`market-content-${marketKey}`}
                        >
                            <div className="eternal-page__market-info">
                                <MarketImage
                                    market={marketGroup.market}
                                    marketName={marketGroup.marketName}
                                    size={48}
                                />
                                <div className="eternal-page__market-details">
                                    <h3 className="eternal-page__market-name">
                                        {marketGroup.marketName}
                                        {marketGroup.isParent && (
                                            <span className="eternal-page__parent-badge">
                                                <Trans>Parent Market</Trans>
                                            </span>
                                        )}
                                    </h3>
                                    <div className="eternal-page__market-stats">
                                        <span className="eternal-page__market-stat">
                                            {marketGroup.farms.length} outcome{marketGroup.farms.length !== 1 ? 's' : ''}
                                        </span>
                                        {marketGroup.totalTVL > 0 && (
                                            <span className="eternal-page__market-stat eternal-page__market-stat--tvl">
                                                {formatDollarAmount(marketGroup.totalTVL)} TVL
                                            </span>
                                        )}
                                        {marketGroup.totalDailyRewards > 0 && (
                                            <span className="eternal-page__market-stat eternal-page__market-stat--rewards">
                                                {marketGroup.totalDailyRewards.toLocaleString(undefined, { maximumFractionDigits: 2 })} SEER/day
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="eternal-page__market-toggle">
                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        </div>

                        {/* Market Content (Farms) */}
                        <div 
                            id={`market-content-${marketKey}`}
                            className={`eternal-page__market-content ${isExpanded ? 'expanded' : ''}`}
                        >
                            <div className="eternal-page__market-farms">
                                {marketGroup.farms.map((farm: any) => (
                                    <FarmCard
                                        key={`farm-${farm.id || farm.pool?.id}`}
                                        farm={farm}
                                        onClick={() => handleFarmClick(farm)}
                                        TokenImage={TokenImage}
                                    />
                                ))}

                                {/* Child Markets */}
                                {marketGroup.isParent && Object.keys(marketGroup.childMarkets).length > 0 && (
                                    <div className="eternal-page__child-markets">
                                        {Object.entries(marketGroup.childMarkets).map(([childKey, childGroup]: [string, any]) => (
                                            <div key={childKey} className="eternal-page__child-market">
                                                <div className="eternal-page__child-market-header">
                                                    <MarketImage
                                                        market={childGroup.market}
                                                        marketName={childGroup.marketName}
                                                        size={36}
                                                    />
                                                    <div className="eternal-page__child-market-info">
                                                        <h4>{childGroup.marketName}</h4>
                                                        <span className="eternal-page__child-badge">
                                                            <Trans>Conditional Market</Trans>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="eternal-page__child-market-farms">
                                                    {childGroup.farms.map((farm: any) => (
                                                        <FarmCard
                                                            key={`farm-child-${farm.id || farm.pool?.id}`}
                                                            farm={farm}
                                                            onClick={() => handleFarmClick(farm)}
                                                            TokenImage={TokenImage}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};