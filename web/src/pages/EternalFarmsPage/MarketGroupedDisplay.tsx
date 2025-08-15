import React, { useMemo, useState } from 'react';
import { Trans } from '@lingui/macro';
import { ChevronDown, ChevronUp, Filter, Info, Clock } from 'react-feather';
import { formatDollarAmount } from '../../utils/numbers';
import { FarmCard } from './FarmCard';
import { ZapModal } from '../../components/MarketZap/ZapModal';

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
    marketAPRs?: { [marketId: string]: number };
    expandedConditionalSections?: Set<string>;
    toggleConditionalSection?: (key: string) => void;
    expandedChildMarkets?: Set<string>;
    toggleChildMarket?: (key: string) => void;
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
    setActiveFilter,
    marketAPRs = {},
    expandedConditionalSections = new Set(),
    toggleConditionalSection,
    expandedChildMarkets = new Set(),
    toggleChildMarket
}) => {
    const [zapMarket, setZapMarket] = useState<any>(null);
    // Helper function to format end date
    const formatEndDate = (endDate: Date | null) => {
        if (!endDate) return null;
        
        const now = new Date();
        const diffTime = endDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return 'Ended';
        } else if (diffDays === 0) {
            return 'Ends today';
        } else if (diffDays === 1) {
            return 'Ends tomorrow';
        } else if (diffDays <= 7) {
            return `Ends in ${diffDays} days`;
        } else if (diffDays <= 30) {
            const weeks = Math.floor(diffDays / 7);
            return `Ends in ${weeks} week${weeks > 1 ? 's' : ''}`;
        } else if (diffDays <= 365) {
            const months = Math.floor(diffDays / 30);
            return `Ends in ${months} month${months > 1 ? 's' : ''}`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `Ends in ${years} year${years > 1 ? 's' : ''}`;
        }
    };
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
        <>
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
                
                // All markets at this level are root markets now
                const hasDirectFarms = marketGroup.farms.length > 0;
                const hasChildMarkets = marketGroup.childMarkets && Object.keys(marketGroup.childMarkets).length > 0;
                const shouldShowMarket = hasDirectFarms || hasChildMarkets;
                
                if (!shouldShowMarket) return null;

                return (
                    <div key={marketKey} className={`eternal-page__market-group ${marketGroup.isParent ? 'eternal-page__market-group--parent' : ''}`}>
                        {/* Market Header */}
                        <div
                            className={`eternal-page__market-header ${isExpanded ? 'eternal-page__market-header--expanded' : ''}`}
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
                                    size={marketGroup.isParent ? 56 : 48}
                                />
                                <div className="eternal-page__market-details">
                                    <h3 className="eternal-page__market-name">
                                        {marketGroup.marketName}
                                        {marketGroup.isParent && !hasDirectFarms && (
                                            <span className="eternal-page__parent-only-badge">
                                                <Trans>Parent Market</Trans>
                                            </span>
                                        )}
                                    </h3>
                                    <div className="eternal-page__market-stats">
                                        <span className="eternal-page__market-stat">
                                            {marketGroup.farms.length} outcome{marketGroup.farms.length !== 1 ? 's' : ''}
                                        </span>
                                        {marketGroup.isParent && Object.keys(marketGroup.childMarkets).length > 0 && (
                                            <span className="eternal-page__market-stat eternal-page__market-stat--children">
                                                {Object.keys(marketGroup.childMarkets).length} conditional market{Object.keys(marketGroup.childMarkets).length !== 1 ? 's' : ''}
                                            </span>
                                        )}
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
                                        {marketAPRs[marketKey] !== undefined && marketAPRs[marketKey] > 0 && (
                                            <span className="eternal-page__market-stat eternal-page__market-stat--apr">
                                                <span className="apr-value">{Math.round(marketAPRs[marketKey])}% APR</span>
                                                <div className="apr-info-icon">
                                                    <Info size={12} />
                                                    <div className="apr-tooltip">
                                                        <div className="apr-tooltip-content">
                                                            <strong>Market APR</strong>
                                                            <p>Average APR for LPing in this market.</p>
                                                            <p>Based on total rewards & TVL.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </span>
                                        )}
                                        {marketGroup.estimatedEndDate && (
                                            <span className="eternal-page__market-stat eternal-page__market-stat--end-date">
                                                <Clock size={12} style={{ marginRight: '4px' }} />
                                                {formatEndDate(marketGroup.estimatedEndDate)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="eternal-page__market-actions">
                                {marketGroup.farms.length > 1 && (
                                    <button 
                                        className="eternal-page__zap-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setZapMarket(marketGroup);
                                        }}
                                        aria-label={`Zap into ${marketGroup.marketName}`}
                                    >
                                        ⚡ Zap
                                    </button>
                                )}
                                <div className="eternal-page__market-toggle">
                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>
                        </div>

                        {/* Market Content (Farms) */}
                        <div 
                            id={`market-content-${marketKey}`}
                            className={`eternal-page__market-content ${isExpanded ? 'expanded' : ''}`}
                        >
                            {hasDirectFarms && (
                                <div className="eternal-page__market-farms">
                                    {marketGroup.farms.map((farm: any) => (
                                        <FarmCard
                                            key={`farm-${farm.id || farm.pool?.id}`}
                                            farm={farm}
                                            onClick={() => handleFarmClick(farm)}
                                            TokenImage={TokenImage}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Child Markets */}
                            {hasChildMarkets && (
                                <div className="eternal-page__child-markets">
                                    {hasDirectFarms && (
                                        <div 
                                            className="eternal-page__child-markets-divider"
                                            onClick={() => toggleConditionalSection && toggleConditionalSection(marketKey)}
                                            onKeyDown={(e) => {
                                                if ((e.key === 'Enter' || e.key === ' ') && toggleConditionalSection) {
                                                    e.preventDefault();
                                                    toggleConditionalSection(marketKey);
                                                }
                                            }}
                                            role="button"
                                            tabIndex={0}
                                            aria-expanded={expandedConditionalSections.has(marketKey)}
                                            aria-controls={`conditional-content-${marketKey}`}
                                        >
                                            <div className="eternal-page__child-markets-header-content">
                                                <span className="eternal-page__child-markets-label">
                                                    <Trans>Conditional Markets</Trans>
                                                    <span className="eternal-page__child-markets-count">
                                                        ({Object.keys(marketGroup.childMarkets).length})
                                                    </span>
                                                </span>
                                                <div className="eternal-page__child-markets-summary">
                                                    {marketGroup.conditionalTotalTVL > 0 && (
                                                        <span className="eternal-page__child-markets-summary-stat">
                                                            <span className="label">TVL:</span>
                                                            <span className="value">{formatDollarAmount(marketGroup.conditionalTotalTVL)}</span>
                                                        </span>
                                                    )}
                                                    {marketGroup.conditionalTotalDailyRewards > 0 && (
                                                        <span className="eternal-page__child-markets-summary-stat">
                                                            <span className="label">Rewards:</span>
                                                            <span className="value">{marketGroup.conditionalTotalDailyRewards.toLocaleString(undefined, { maximumFractionDigits: 2 })} SEER/day</span>
                                                        </span>
                                                    )}
                                                    {marketAPRs[`${marketKey}_conditional`] !== undefined && marketAPRs[`${marketKey}_conditional`] > 0 && (
                                                        <span className="eternal-page__child-markets-summary-stat eternal-page__child-markets-summary-stat--apr">
                                                            <span className="label">APR:</span>
                                                            <span className="value">{Math.round(marketAPRs[`${marketKey}_conditional`])}%</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="eternal-page__child-markets-toggle">
                                                {expandedConditionalSections.has(marketKey) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </div>
                                        </div>
                                    )}
                                    <div 
                                        id={`conditional-content-${marketKey}`}
                                        className={`eternal-page__child-markets-content ${expandedConditionalSections.has(marketKey) || !hasDirectFarms ? 'expanded' : ''}`}
                                    >
                                        {Object.entries(marketGroup.childMarkets).map(([childKey, childGroup]: [string, any]) => {
                                            const isChildExpanded = expandedChildMarkets.has(childKey);
                                            return (
                                                <div key={childKey} className="eternal-page__child-market">
                                                    <div className="eternal-page__child-market-container">
                                                        <div 
                                                            className={`eternal-page__child-market-header ${isChildExpanded ? 'eternal-page__child-market-header--expanded' : ''}`}
                                                            onClick={() => toggleChildMarket && toggleChildMarket(childKey)}
                                                            onKeyDown={(e) => {
                                                                if ((e.key === 'Enter' || e.key === ' ') && toggleChildMarket) {
                                                                    e.preventDefault();
                                                                    toggleChildMarket(childKey);
                                                                }
                                                            }}
                                                            role="button"
                                                            tabIndex={0}
                                                            aria-expanded={isChildExpanded}
                                                            aria-controls={`child-market-content-${childKey}`}
                                                        >
                                                            <div className="eternal-page__child-market-connector"></div>
                                                            <MarketImage
                                                                market={childGroup.market}
                                                                marketName={childGroup.marketName}
                                                                size={40}
                                                            />
                                                            <div className="eternal-page__child-market-info">
                                                                <h4>{childGroup.marketName}</h4>
                                                                <div className="eternal-page__child-market-stats">
                                                                    <span className="eternal-page__child-stat">
                                                                        {childGroup.farms.length} outcome{childGroup.farms.length !== 1 ? 's' : ''}
                                                                    </span>
                                                                    {childGroup.totalTVL > 0 && (
                                                                        <span className="eternal-page__child-stat">
                                                                            {formatDollarAmount(childGroup.totalTVL)} TVL
                                                                        </span>
                                                                    )}
                                                                    {marketAPRs[childKey] !== undefined && marketAPRs[childKey] > 0 && (
                                                                        <span className="eternal-page__child-stat eternal-page__child-stat--apr">
                                                                            {Math.round(marketAPRs[childKey])}% APR
                                                                        </span>
                                                                    )}
                                                                    {childGroup.estimatedEndDate && (
                                                                        <span className="eternal-page__child-stat eternal-page__child-stat--end-date">
                                                                            <Clock size={11} style={{ marginRight: '3px' }} />
                                                                            {formatEndDate(childGroup.estimatedEndDate)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="eternal-page__child-market-toggle">
                                                                {isChildExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                            </div>
                                                        </div>
                                                        <div 
                                                            id={`child-market-content-${childKey}`}
                                                            className={`eternal-page__child-market-farms ${isChildExpanded ? 'expanded' : ''}`}
                                                        >
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
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
            </div>
            
            {/* Zap Modal */}
            {zapMarket && (
                <ZapModal
                    isOpen={!!zapMarket}
                    onDismiss={() => setZapMarket(null)}
                    market={zapMarket.market}
                    pools={zapMarket.farms.map((farm: any) => farm.pool).filter(Boolean)}
                />
            )}
        </>
    );
};