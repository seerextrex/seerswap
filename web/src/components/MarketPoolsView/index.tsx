import React, { useMemo, useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { Trans } from '@lingui/macro';
import { ChevronDown, ChevronUp, ExternalLink } from 'react-feather';
import { NavLink } from 'react-router-dom';
import { FETCH_POOLS_GROUPED_BY_MARKET } from '../../utils/graphql-queries';
import { formatDollarAmount, formatAmount } from '../../utils/numbers';
import { Token, Market, Pool, getOutcomeName, getOutcomeInfo, getPoolTokensForMarket, GroupedMarketPools, groupPoolsByMarketWithHierarchy, formatIpfsUrl } from '../../utils/market';
import Loader from '../Loader';
import './index.scss';

interface PoolCardProps {
  pool: Pool;
  market: Market;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, market }) => {
  // Use the improved function to determine tokens
  const tokenInfo = getPoolTokensForMarket(pool, market);
  
  if (!tokenInfo) {
    return null; // Pool doesn't belong to this market
  }
  
  const { outcomeToken, collateralToken, outcomeName } = tokenInfo;
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

interface OutcomeGroupProps {
  outcomeName: string;
  outcomeImage: string | null;
  pools: Pool[];
  market: Market;
}

const OutcomeGroup: React.FC<OutcomeGroupProps> = ({ outcomeName, outcomeImage, pools, market }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Sort pools by TVL
  const sortedPools = useMemo(() => {
    return [...pools].sort((a, b) => {
      const tvlA = parseFloat(a.totalValueLockedUSD || '0');
      const tvlB = parseFloat(b.totalValueLockedUSD || '0');
      return tvlB - tvlA;
    });
  }, [pools]);

  // Calculate total stats for this outcome
  const outcomeStats = useMemo(() => {
    return pools.reduce(
      (acc, pool) => ({
        totalTVL: acc.totalTVL + parseFloat(pool.totalValueLockedUSD || '0'),
        totalVolume: acc.totalVolume + parseFloat(pool.volumeUSD || '0'),
        totalFees: acc.totalFees + parseFloat(pool.feesUSD || '0'),
      }),
      { totalTVL: 0, totalVolume: 0, totalFees: 0 }
    );
  }, [pools]);

  return (
    <div className="outcome-group">
      <div className="outcome-header" onClick={toggleExpanded}>
        <div className="outcome-info">
          <div className="outcome-image-wrapper">
            {outcomeImage && !imageError ? (
              <img 
                src={outcomeImage}
                alt={outcomeName}
                className="outcome-image"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="outcome-image-placeholder">
                {outcomeName.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <h4 className="outcome-name">{outcomeName}</h4>
          <div className="outcome-stats">
            <span className="pool-count">{pools.length} pool{pools.length !== 1 ? 's' : ''}</span>
            <span className="outcome-tvl">TVL: {formatDollarAmount(outcomeStats.totalTVL)}</span>
          </div>
        </div>
        <div className="expand-toggle">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {isExpanded && (
        <div className="outcome-pools">
          {sortedPools.map((pool) => (
            <PoolCard key={pool.id} pool={pool} market={market} />
          ))}
        </div>
      )}
    </div>
  );
};

interface MarketOutcomesListProps {
  groupedMarket: GroupedMarketPools;
}

const MarketOutcomesList: React.FC<MarketOutcomesListProps> = ({ groupedMarket }) => {
  const { market, pools } = groupedMarket;

  // Group pools by outcome
  const outcomeGroups = useMemo(() => {
    const groups = new Map<string, { pools: Pool[]; imageUrl: string | null; outcomeToken?: Token }>();

    pools.forEach(pool => {
      // Use improved token identification
      const tokenInfo = getPoolTokensForMarket(pool, market);
      
      if (tokenInfo) {
        const { outcomeToken, outcomeName } = tokenInfo;
        // Use outcome name if available, otherwise use token symbol
        const groupKey = outcomeName || outcomeToken.symbol || outcomeToken.name || 'Unknown';
        const outcomeInfo = outcomeName ? getOutcomeInfo(market, outcomeToken.id) : null;
        
        if (!groups.has(groupKey)) {
          groups.set(groupKey, {
            pools: [],
            imageUrl: outcomeInfo?.imageUrl || null,
            outcomeToken
          });
        }
        
        groups.get(groupKey)!.pools.push(pool);
      }
    });

    // Sort outcomes alphabetically, but ensure UP comes before DOWN
    return Array.from(groups.entries()).sort(([nameA], [nameB]) => {
      const upperA = nameA.toUpperCase();
      const upperB = nameB.toUpperCase();
      
      if (upperA === 'UP' && upperB === 'DOWN') return -1;
      if (upperA === 'DOWN' && upperB === 'UP') return 1;
      
      return nameA.localeCompare(nameB);
    });
  }, [pools, market]);

  if (outcomeGroups.length === 0) {
    return (
      <div className="market-outcomes-empty">
        <Trans>No pools available</Trans>
      </div>
    );
  }

  return (
    <div className="market-outcomes-list">
      {outcomeGroups.map(([outcomeName, { pools, imageUrl }]) => (
        <OutcomeGroup
          key={outcomeName}
          outcomeName={outcomeName}
          outcomeImage={imageUrl}
          pools={pools}
          market={market}
        />
      ))}
    </div>
  );
};

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
  const [imageError, setImageError] = useState(false);

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
              <a
                href={`https://app.seer.pm/markets/100/${childMarket.market.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="market-external-link"
                onClick={(e) => e.stopPropagation()}
                title="View on Seer"
              >
                <ExternalLink size={14} />
              </a>
            </h4>
            <div className="child-market-stats">
              <span className="stat-item">
                {childMarket.pools.length} pools
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
        <div className="child-market-content">
          <MarketOutcomesList groupedMarket={childMarket} />
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
  const [imageError, setImageError] = useState(false);

  const { market, pools, totalTVL, totalVolume, totalFees, isParent, childMarkets } = groupedMarket;
  
  const handleToggle = useCallback(() => {
    onToggle(marketId);
  }, [onToggle, marketId]);

  const marketImageUrl = market?.image?.[0]?.cidMarket ? formatIpfsUrl(market.image[0].cidMarket) : null;

  // Calculate total pools including child markets
  const directPools = pools.length;
  const childPools = childMarkets ? 
    Array.from(childMarkets.values()).reduce((sum, child) => 
      sum + child.pools.length, 0) : 0;
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
              <a
                href={`https://app.seer.pm/markets/100/${market.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="market-external-link"
                onClick={(e) => e.stopPropagation()}
                title="View on Seer"
              >
                <ExternalLink size={16} />
              </a>
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
          {/* Render outcomes for this market */}
          {directPools > 0 && (
            <div className="market-outcomes">
              <MarketOutcomesList groupedMarket={groupedMarket} />
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

interface MarketPoolsViewProps {
  minTVL?: number;
  hideLowValue?: boolean;
  hideResolved?: boolean;
}

export const MarketPoolsView: React.FC<MarketPoolsViewProps> = ({ 
  minTVL = 0, 
  hideLowValue = false,
  hideResolved = false
}) => {
  const [expandedMarkets, setExpandedMarkets] = useState<Set<string>>(new Set());
  const [expandedChildMarkets, setExpandedChildMarkets] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const ITEMS_PER_PAGE = 500; // Increased to fetch more pools initially

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
    let grouped = groupPoolsByMarketWithHierarchy(pools, hideLowValue, minTVL);
    
    // Filter out resolved markets if hideResolved is true
    if (hideResolved) {
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      grouped = grouped.filter(group => {
        const market = group.market;
        // Market is resolved if finalizeTs exists and is in the past
        // Markets with finalizeTs = 33260976000 are still pending
        const isResolved = market.finalizeTs && 
                          Number(market.finalizeTs) < currentTime && 
                          Number(market.finalizeTs) !== 33260976000;
        return !isResolved;
      });
    }
    
    return grouped;
  }, [data, hideLowValue, minTVL, hideResolved]);

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