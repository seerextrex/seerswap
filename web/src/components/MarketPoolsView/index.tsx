import React, { useMemo, useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { Trans } from '@lingui/macro';
import { ChevronDown, ChevronUp } from 'react-feather';
import { NavLink } from 'react-router-dom';
import { FETCH_POOLS_GROUPED_BY_MARKET } from '../../utils/graphql-queries';
import { formatDollarAmount, formatAmount } from '../../utils/numbers';
import { Token, Market, Pool, getOutcomeName, GroupedMarketPools, groupPoolsByMarketWithHierarchy, formatIpfsUrl } from '../../utils/market';
import Loader from '../Loader';
import './index.scss';

interface ChildMarketGroupProps {
  childMarket: GroupedMarketPools;
  parentMarket: Market;
  isExpanded: boolean;
  onToggle: (childKey: string) => void;
  childKey: string;
}

const ChildMarketGroup: React.FC<ChildMarketGroupProps> = React.memo(({ 
  childMarket, 
  parentMarket,
  isExpanded, 
  onToggle, 
  childKey 
}) => {
  const [expandedOutcomes, setExpandedOutcomes] = useState<Set<string>>(new Set());
  const [imageError, setImageError] = useState(false);

  const toggleOutcome = useCallback((outcomeKey: string) => {
    setExpandedOutcomes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(outcomeKey)) {
        newSet.delete(outcomeKey);
      } else {
        newSet.add(outcomeKey);
      }
      return newSet;
    });
  }, []);

  const handleToggle = useCallback(() => {
    onToggle(childKey);
  }, [onToggle, childKey]);

  const marketImageUrl = childMarket.market?.image?.[0]?.cidMarket ? 
    formatIpfsUrl(childMarket.market.image[0].cidMarket) : null;

  // Get collateral token info (which should be from parent market)
  const getCollateralTokenName = useCallback(() => {
    const collateralToken = childMarket.market?.collateralToken;
    if (!collateralToken || !parentMarket) return 'Unknown';

    // Try to find the collateral token in parent market's tokens
    if (parentMarket.tokens && parentMarket.outcomes) {
      const collateralIndex = parentMarket.tokens.findIndex((token: any) =>
        token.id.toLowerCase() === collateralToken.id.toLowerCase()
      );

      if (collateralIndex >= 0 && collateralIndex < parentMarket.outcomes.length) {
        return parentMarket.outcomes[collateralIndex];
      }
    }

    return collateralToken.symbol || collateralToken.name || 'Unknown';
  }, [childMarket.market, parentMarket]);

  return (
    <div className="child-market-group">
      <div className="child-market-header" onClick={handleToggle}>
        <div className="child-market-info">
          <div className="child-market-images">
            {marketImageUrl && !imageError ? (
              <img 
                src={marketImageUrl} 
                alt={childMarket.market.marketName}
                className="child-market-image"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="child-market-image-placeholder">
                {childMarket.market.marketName ? 
                  childMarket.market.marketName.slice(0, 1).toUpperCase() : '?'}
              </div>
            )}
          </div>
          <div className="child-market-details">
            <h4 className="child-market-name">
              {childMarket.market.marketName || 'Unknown Market'}
              <span className="child-market-badge">Child Market</span>
            </h4>
            <div className="child-market-stats">
              <span className="stat-item">
                {Array.from(childMarket.poolsByOutcome.values()).flat().length} pools
              </span>
              {childMarket.totalTVL > 0 && (
                <span className="stat-item">
                  • {formatDollarAmount(childMarket.totalTVL)} TVL
                </span>
              )}
              {childMarket.totalVolume > 0 && (
                <span className="stat-item">
                  • {formatDollarAmount(childMarket.totalVolume)} Volume
                </span>
              )}
              <span className="stat-item">
                • Collateral: {getCollateralTokenName()}
              </span>
            </div>
          </div>
        </div>
        <div className="expand-toggle">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {isExpanded && (
        <div className="child-market-outcomes">
          {Array.from(childMarket.poolsByOutcome.entries()).map(([outcomeKey, pools]) => {
            const isOutcomeExpanded = expandedOutcomes.has(outcomeKey);

            return (
              <div key={outcomeKey} className="outcome-group">
                <div className="outcome-header" onClick={() => toggleOutcome(outcomeKey)}>
                  <div className="outcome-info">
                    <h4 className="outcome-name">{outcomeKey}</h4>
                    <span className="pool-count">{pools.length} pools</span>
                  </div>
                  <div className="expand-toggle">
                    {isOutcomeExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {isOutcomeExpanded && (
                  <div className="outcome-pools">
                    {pools.map((pool) => (
                      <PoolCard key={pool.id} pool={pool} market={childMarket.market} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

interface MarketGroupProps {
  groupedMarket: GroupedMarketPools;
  isExpanded: boolean;
  onToggle: (marketId: string) => void;
  marketId: string;
  expandedChildMarkets: Set<string>;
  toggleChildMarket: (childKey: string) => void;
}

const MarketGroup: React.FC<MarketGroupProps> = React.memo(({ 
  groupedMarket, 
  isExpanded, 
  onToggle, 
  marketId,
  expandedChildMarkets,
  toggleChildMarket
}) => {
  const [expandedOutcomes, setExpandedOutcomes] = useState<Set<string>>(new Set());
  const [imageError, setImageError] = useState(false);

  const toggleOutcome = useCallback((outcomeKey: string) => {
    setExpandedOutcomes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(outcomeKey)) {
        newSet.delete(outcomeKey);
      } else {
        newSet.add(outcomeKey);
      }
      return newSet;
    });
  }, []);

  const { market, poolsByOutcome, totalTVL, totalVolume, totalFees, isParent, childMarkets } = groupedMarket;
  
  const handleToggle = useCallback(() => {
    onToggle(marketId);
  }, [onToggle, marketId]);

  const marketImageUrl = market?.image?.[0]?.cidMarket ? formatIpfsUrl(market.image[0].cidMarket) : null;

  // Calculate total pools including child markets
  const directPools = Array.from(poolsByOutcome.values()).flat().length;
  const childPools = childMarkets ? 
    Array.from(childMarkets.values()).reduce((sum, child) => 
      sum + Array.from(child.poolsByOutcome.values()).flat().length, 0) : 0;
  const totalPools = directPools + childPools;

  return (
    <div className="market-group">
      <div className="market-header" onClick={handleToggle}>
        <div className="market-info">
          <div className="market-image-wrapper">
            {marketImageUrl && !imageError ? (
              <img 
                src={marketImageUrl} 
                alt={market.marketName}
                className="market-image"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="market-image-placeholder">
                {market.marketName ? market.marketName.slice(0, 1).toUpperCase() : '?'}
              </div>
            )}
          </div>
          <div className="market-details">
            <h3 className="market-name">
              {market.marketName || 'Unknown Market'}
              {isParent && childMarkets && childMarkets.size > 0 && (
                <span className="parent-market-badge">Parent Market</span>
              )}
            </h3>
            <div className="market-stats">
              <span className="stat-item">
                {isParent && childPools > 0 ? 
                  `${totalPools} pools (${directPools} direct, ${childPools} in child markets)` :
                  `${directPools} pools`}
              </span>
              <span className="stat-item">
                <label>TVL:</label>
                <span>{formatDollarAmount(totalTVL)}</span>
              </span>
              <span className="stat-item">
                <label>Volume:</label>
                <span>{formatDollarAmount(totalVolume)}</span>
              </span>
              <span className="stat-item">
                <label>Fees:</label>
                <span>{formatDollarAmount(totalFees)}</span>
              </span>
              {market.collateralToken && (
                <span className="stat-item">
                  • Collateral: {market.collateralToken.symbol || market.collateralToken.name}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="expand-toggle">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {isExpanded && (
        <div className="market-content">
          {/* Render direct pools for this market */}
          {directPools > 0 && (
            <div className="market-outcomes">
              {Array.from(poolsByOutcome.entries()).map(([outcomeKey, pools]) => {
                const isOutcomeExpanded = expandedOutcomes.has(outcomeKey);

                return (
                  <div key={outcomeKey} className="outcome-group">
                    <div className="outcome-header" onClick={() => toggleOutcome(outcomeKey)}>
                      <div className="outcome-info">
                        <h4 className="outcome-name">{outcomeKey}</h4>
                        <span className="pool-count">{pools.length} pools</span>
                      </div>
                      <div className="expand-toggle">
                        {isOutcomeExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {isOutcomeExpanded && (
                      <div className="outcome-pools">
                        {pools.map((pool) => (
                          <PoolCard key={pool.id} pool={pool} market={market} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Render child markets if this is a parent market */}
          {isParent && childMarkets && childMarkets.size > 0 && (
            <div className="child-markets">
              {Array.from(childMarkets.entries()).map(([childKey, childGroup]) => {
                const isChildExpanded = expandedChildMarkets.has(childKey);

                return (
                  <ChildMarketGroup
                    key={childKey}
                    childMarket={childGroup}
                    parentMarket={market}
                    isExpanded={isChildExpanded}
                    onToggle={toggleChildMarket}
                    childKey={childKey}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

interface PoolCardProps {
  pool: Pool;
  market: Market;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, market }) => {
  // Determine which token is the outcome token and which is collateral
  const isToken0Market = pool.market0?.id === market.id;
  const outcomeToken = isToken0Market ? pool.token0 : pool.token1;
  const collateralToken = isToken0Market ? pool.token1 : pool.token0;
  
  const outcomeName = getOutcomeName(market, outcomeToken.id);
  const fee = parseFloat(pool.fee) / 10000; // Convert fee to percentage

  return (
    <div className="pool-card">
      <div className="pool-header">
        <div className="pool-tokens">
          <span className="token-pair">
            {outcomeName || outcomeToken.symbol} / {collateralToken.symbol}
          </span>
          <span className="fee-badge">{fee}%</span>
        </div>
      </div>

      <div className="pool-stats">
        <div className="stat">
          <label><Trans>TVL</Trans></label>
          <span>{formatDollarAmount(parseFloat(pool.totalValueLockedUSD))}</span>
        </div>
        <div className="stat">
          <label><Trans>Volume 24h</Trans></label>
          <span>{formatDollarAmount(parseFloat(pool.volumeUSD))}</span>
        </div>
        <div className="stat">
          <label><Trans>Fees 24h</Trans></label>
          <span>{formatDollarAmount(parseFloat(pool.feesUSD))}</span>
        </div>
      </div>

      <div className="pool-actions">
        <NavLink to={`/add/${outcomeToken.id}/${collateralToken.id}`} className="btn btn-sm primary">
          <Trans>Add Liquidity</Trans>
        </NavLink>
        <NavLink to={`/swap?inputCurrency=${collateralToken.id}&outputCurrency=${outcomeToken.id}`} className="btn btn-sm">
          <Trans>Swap</Trans>
        </NavLink>
      </div>
    </div>
  );
};

interface MarketPoolsViewProps {
  minTVL?: number;
  hideLowValue?: boolean;
}

export const MarketPoolsView: React.FC<MarketPoolsViewProps> = ({ 
  minTVL = 0, 
  hideLowValue = false 
}) => {
  const [expandedMarkets, setExpandedMarkets] = useState<Set<string>>(new Set());
  const [expandedChildMarkets, setExpandedChildMarkets] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const ITEMS_PER_PAGE = 100;

  const { data, loading, error, fetchMore } = useQuery(FETCH_POOLS_GROUPED_BY_MARKET, {
    variables: {
      first: ITEMS_PER_PAGE,
      skip: currentPage * ITEMS_PER_PAGE,
    },
    fetchPolicy: "cache-and-network",
  });

  const groupedMarkets = useMemo(() => {
    if (!data?.pools) return [];
    
    // Type the pools array properly
    const pools = data.pools as Pool[];
    return groupPoolsByMarketWithHierarchy(pools, hideLowValue, minTVL);
  }, [data, hideLowValue, minTVL]);

  const toggleMarket = useCallback((marketId: string) => {
    setExpandedMarkets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(marketId)) {
        newSet.delete(marketId);
      } else {
        newSet.add(marketId);
      }
      return newSet;
    });
  }, []);

  const toggleChildMarket = useCallback((childKey: string) => {
    setExpandedChildMarkets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(childKey)) {
        newSet.delete(childKey);
      } else {
        newSet.add(childKey);
      }
      return newSet;
    });
  }, []);

  const handleLoadMore = useCallback(() => {
    fetchMore({
      variables: {
        skip: (currentPage + 1) * ITEMS_PER_PAGE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.pools.length === 0) return prev;
        return {
          ...prev,
          pools: [...prev.pools, ...fetchMoreResult.pools],
        };
      },
    }).then(result => {
      if (result.data && result.data.pools.length > 0) {
        setCurrentPage(currentPage + 1);
        // If we got less than a full page, there are no more items
        if (result.data.pools.length < ITEMS_PER_PAGE) {
          setHasMoreItems(false);
        }
      } else {
        setHasMoreItems(false);
      }
    });
  }, [currentPage, fetchMore, ITEMS_PER_PAGE]);

  if (loading && !data) {
    return (
      <div className="market-pools-view">
        <div className="loading-state">
          <Loader stroke="white" size="2rem" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="market-pools-view">
        <div className="error-state">
          <Trans>Error loading pools: {error.message}</Trans>
        </div>
      </div>
    );
  }

  if (groupedMarkets.length === 0) {
    return (
      <div className="market-pools-view">
        <div className="empty-state">
          <Trans>No pools found</Trans>
        </div>
      </div>
    );
  }

  return (
    <div className="market-pools-view">
      {groupedMarkets.map((groupedMarket) => (
        <MarketGroup
          key={groupedMarket.market.id}
          groupedMarket={groupedMarket}
          isExpanded={expandedMarkets.has(groupedMarket.market.id)}
          onToggle={toggleMarket}
          marketId={groupedMarket.market.id}
          expandedChildMarkets={expandedChildMarkets}
          toggleChildMarket={toggleChildMarket}
        />
      ))}
      
      {hasMoreItems && data?.pools && data.pools.length > 0 && (
        <button
          className="load-more-btn"
          onClick={handleLoadMore}
          disabled={loading}
        >
          {loading ? <Trans>Loading...</Trans> : <Trans>Load More</Trans>}
        </button>
      )}
    </div>
  );
};

export default MarketPoolsView;