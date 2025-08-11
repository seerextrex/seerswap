import React, { useMemo, useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { Trans } from '@lingui/macro';
import { ChevronDown, ChevronUp, ExternalLink } from 'react-feather';
import { NavLink } from 'react-router-dom';
import { FETCH_POOLS_GROUPED_BY_MARKET } from '../../utils/graphql-queries';
import { formatDollarAmount, formatAmount } from '../../utils/numbers';
import { Token, Market, Pool, getOutcomeName, getOutcomeInfo, getPoolTokensForMarket, GroupedMarketPools, groupPoolsByMarketWithHierarchy, formatIpfsUrl } from '../../utils/market';
import { calculateOutcomeProbabilities, formatProbability } from '../../utils/marketPrices';
import { OUTCOME_COLORS, OUTCOME_GRADIENTS } from '../../constants/outcomeColors';
import { ZapButton } from '../MarketZap/ZapButton';
import { ZapModal, ZapModalContent } from '../MarketZap/ZapModal';
import Modal from '../Modal';
import Loader from '../Loader';
import './index.scss';
import './index-modern.scss';

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
      <div 
        className="outcome-header" 
        onClick={toggleExpanded}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleExpanded();
          }
        }}>
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
              <div className="outcome-image-placeholder" role="img" aria-label={outcomeName}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  {/* Balance scale representing weighing probabilities */}
                  <path d="M12 3v18M12 3l-4 0M12 3l4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
                  <path d="M6 8l-3 5h6l-3-5zM18 8l-3 5h6l-3-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.5"/>
                  <circle cx="5" cy="14" r="0.5" fill="currentColor" opacity="0.6"/>
                  <circle cx="19" cy="14" r="0.5" fill="currentColor" opacity="0.6"/>
                </svg>
              </div>
            )}
          </div>
          <h4 className="outcome-name">{outcomeName}</h4>
          <div className="outcome-stats">
            <span className="pool-count">{pools.length} pool{pools.length !== 1 ? 's' : ''}</span>
            <span className="outcome-tvl">TVL: {formatDollarAmount(outcomeStats.totalTVL)}</span>
          </div>
        </div>
        <div className={`expand-toggle ${isExpanded ? 'expanded' : ''}`}>
          <ChevronDown size={16} className="expand-icon" />
        </div>
      </div>

      <div className={`outcome-pools ${isExpanded ? 'expanded' : ''}`}>
        {sortedPools.map((pool) => (
          <PoolCard key={pool.id} pool={pool} market={market} />
        ))}
      </div>
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

  // Calculate outcome probabilities for child market
  const probabilities = useMemo(() => {
    return childMarket.pools && childMarket.market ? 
      calculateOutcomeProbabilities(childMarket.pools, childMarket.market) : null;
  }, [childMarket.pools, childMarket.market]);


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
      <div 
        className="child-market-header" 
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}>
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
              <div className="child-market-image-placeholder" role="img" aria-label={childMarket.market.marketName || 'Child Market'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
                </svg>
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
        <div className={`expand-toggle ${isExpanded ? 'expanded' : ''}`}>
          <ChevronDown size={16} className="expand-icon" />
        </div>
      </div>

      <div className={`child-market-content ${isExpanded ? 'expanded' : ''}`}>
        <MarketOutcomesList groupedMarket={childMarket} />
      </div>
    </div>
  );
});

interface MarketGroupProps {
  groupedMarket: GroupedMarketPools;
}

const MarketGroup: React.FC<MarketGroupProps> = React.memo(({ 
  groupedMarket
}) => {
  const [imageError, setImageError] = useState(false);

  const { market, pools, totalTVL, totalVolume, totalFees, isParent, childMarkets } = groupedMarket;

  const marketImageUrl = market?.image?.[0]?.cidMarket ? formatIpfsUrl(market.image[0].cidMarket) : null;

  // Calculate outcome probabilities for inline display
  const probabilities = useMemo(() => {
    return pools && market ? calculateOutcomeProbabilities(pools, market) : null;
  }, [pools, market]);
  
  // Sort outcomes by probability for card display
  const sortedOutcomes = useMemo(() => {
    if (!probabilities || !market?.outcomes) {
      return [];
    }
    return market.outcomes.map((outcome, index) => ({
      outcome,
      index,
      probability: probabilities[index] || 0,
      gradient: OUTCOME_GRADIENTS[index % OUTCOME_GRADIENTS.length]
    }))
    .filter(({ outcome, probability }) => {
      const isInvalidResult = outcome.toLowerCase().includes('invalid');
      if (isInvalidResult && probability < 1) {
        return false;
      }
      return true;
    })
    .sort((a, b) => b.probability - a.probability);
  }, [market?.outcomes, probabilities]);


  // Calculate total pools including child markets
  const directPools = pools.length;
  const childPools = childMarkets ? 
    Array.from(childMarkets.values()).reduce((sum, child) => 
      sum + child.pools.length, 0) : 0;
  const totalPools = directPools + childPools;

  // Get leading outcome for display
  const leadingOutcome = useMemo(() => {
    if (!sortedOutcomes || sortedOutcomes.length === 0) return null;
    return sortedOutcomes[0];
  }, [sortedOutcomes]);
  
  // Check if this is a binary Yes/No market (excluding Invalid result)
  const isBinaryMarket = useMemo(() => {
    if (!market?.outcomes) return false;
    const outcomesLower = market.outcomes
      .filter(o => !o.toLowerCase().includes('invalid'))
      .map(o => o.toLowerCase());
    
    if (outcomesLower.length !== 2) return false;
    
    return (
      (outcomesLower.includes('yes') && outcomesLower.includes('no')) ||
      (outcomesLower.includes('up') && outcomesLower.includes('down'))
    );
  }, [market?.outcomes]);
  
  // Check if this is a scalar UP/DOWN market with bounds
  const isScalarMarket = useMemo(() => {
    if (!market?.outcomes) return false;
    
    // Filter out Invalid result outcome
    const validOutcomes = market.outcomes.filter(o => !o.toLowerCase().includes('invalid'));
    const outcomesLower = validOutcomes.map(o => o.toLowerCase());
    
    // Check if we have exactly UP and DOWN (after filtering Invalid)
    const hasUpDown = outcomesLower.includes('up') && outcomesLower.includes('down') && validOutcomes.length === 2;
    
    if (!hasUpDown || !market.lowerBound || !market.upperBound) return false;
    
    // Check if bounds exist and are valid
    const rawLower = market.lowerBound;
    const rawUpper = market.upperBound;
    
    // Parse bounds - they might be BigInt strings or decimal strings
    const lower = rawLower ? parseFloat(rawLower) : null;
    const upper = rawUpper ? parseFloat(rawUpper) : null;
    
    // Only scale if the values are actually in wei format (very large integers)
    // Normal bounds like "2", "14" should NOT be scaled
    // Wei values would be like "2000000000000000000", "14000000000000000000"
    const looksLikeWei = (value: string | null | undefined): boolean => {
      if (!value) return false;
      // Check if it's a very large integer (no decimal point and > 1e15)
      return !value.includes('.') && value.length > 15;
    };
    
    const needsScaling = looksLikeWei(rawLower) || looksLikeWei(rawUpper);
    const scaledLower = needsScaling && lower !== null ? lower / 1e18 : lower;
    const scaledUpper = needsScaling && upper !== null ? upper / 1e18 : upper;
    
    const hasBounds = scaledLower !== null && scaledUpper !== null && 
                      (scaledLower !== 0 || scaledUpper !== 0) && 
                      scaledUpper > scaledLower;
    
    return hasUpDown && hasBounds;
  }, [market?.outcomes, market?.lowerBound, market?.upperBound]);
  
  // Calculate scalar value for UP/DOWN markets
  const scalarValue = useMemo(() => {
    if (!isScalarMarket || !market.lowerBound || !market.upperBound) return null;
    
    const rawLower = market.lowerBound;
    const rawUpper = market.upperBound;
    
    let lower = parseFloat(rawLower);
    let upper = parseFloat(rawUpper);
    
    // Use the same detection logic as isScalarMarket
    const looksLikeWei = (value: string): boolean => {
      return !value.includes('.') && value.length > 15;
    };
    
    const needsScaling = looksLikeWei(rawLower) || looksLikeWei(rawUpper);
    if (needsScaling) {
      lower = lower / 1e18;
      upper = upper / 1e18;
    }
    
    // Find UP and DOWN probabilities (these are actually prices in 0-100 range)
    const upOutcome = sortedOutcomes.find(o => o.outcome.toLowerCase() === 'up');
    const downOutcome = sortedOutcomes.find(o => o.outcome.toLowerCase() === 'down');
    
    if (!upOutcome && !downOutcome) return null;
    
    // Convert probabilities to prices (0-1 range)
    const upPrice = upOutcome ? upOutcome.probability / 100 : 0;
    const downPrice = downOutcome ? downOutcome.probability / 100 : 0;
    
    // Calculate estimates using both formulas
    // estimate_1 = lowerBound + (upperBound - lowerBound) * DOWN_PRICE
    // estimate_2 = upperBound - (upperBound - lowerBound) * UP_PRICE
    // Note: DOWN price indicates how far up from lower bound
    // UP price indicates how far down from upper bound
    const estimate1 = lower + (upper - lower) * downPrice;
    const estimate2 = upper - (upper - lower) * upPrice;
    
    // Take the average of both estimates
    const estimatedValue = (estimate1 + estimate2) / 2;
    
    return {
      value: estimatedValue,
      lower,
      upper,
      upPrice: upOutcome?.probability || 0,
      downPrice: downOutcome?.probability || 0,
      estimate1,
      estimate2
    };
  }, [isScalarMarket, market.lowerBound, market.upperBound, sortedOutcomes]);

  const handleCardClick = useCallback(() => {
    // Navigate to market info page
    window.location.href = `#/info/markets/${market.id}`;
  }, [market]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  }, [handleCardClick]);

  return (
    <div className="market-card-modern">
      <div 
        className="market-card-inner" 
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={`Market: ${market.marketName}. Leading outcome: ${leadingOutcome?.outcome || 'Unknown'} at ${leadingOutcome ? Math.round(leadingOutcome.probability) : 0}% probability`}>
        {/* Market Header with Image and Title */}
        <div className="market-card-header">
          <div className="market-image-container">
            {marketImageUrl && !imageError ? (
              <img 
                src={marketImageUrl} 
                alt={market.marketName}
                className="market-image"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="market-image-fallback">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                  <circle cx="12" cy="11" r="1.5" fill="currentColor" opacity="0.6"/>
                  <path d="M12 12.5l-5 5M12 12.5l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
                  <circle cx="7" cy="19" r="1.5" fill="currentColor" opacity="0.3"/>
                  <circle cx="17" cy="19" r="1.5" fill="currentColor" opacity="0.3"/>
                </svg>
              </div>
            )}
          </div>
          <h3 className="market-title">
            {market.marketName || 'Unknown Market'}
          </h3>
        </div>

        {/* Probability Indicator and Outcomes */}
        <div className="market-probability-section">
          {(isScalarMarket && scalarValue) ? (
            <div 
              className="probability-indicator scalar-market"
              aria-label={`Market estimate: ${scalarValue.value.toFixed(2)} (range: ${scalarValue.lower} to ${scalarValue.upper})`}>
              <svg className="probability-ring" viewBox="0 0 36 36">
                <defs>
                  <linearGradient id={`gradient-ring-${market.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                {/* Background circle */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="2"
                />
                {/* Progress circle showing position within range */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke={`url(#gradient-ring-${market.id})`}
                  strokeWidth="2"
                  strokeDasharray={`${Math.max(0, Math.min(100, ((scalarValue.value - scalarValue.lower) / (scalarValue.upper - scalarValue.lower)) * 100))} 100`}
                  strokeDashoffset="25"
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                  className="probability-progress"
                />
              </svg>
              <div className="probability-value">
                <span className="probability-number scalar-value">{scalarValue.value.toFixed(2)}</span>
                <span className="probability-unit">
                  <span className="range-indicator">{scalarValue.lower}-{scalarValue.upper}</span>
                </span>
              </div>
            </div>
          ) : leadingOutcome && (
            <div 
              className="probability-indicator"
              aria-label={`${leadingOutcome.outcome}: ${Math.round(leadingOutcome.probability)}% probability`}>
              <svg className="probability-ring" viewBox="0 0 36 36">
                <defs>
                  <linearGradient id={`gradient-ring-${market.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={leadingOutcome.gradient[0]} />
                    <stop offset="100%" stopColor={leadingOutcome.gradient[1]} />
                  </linearGradient>
                </defs>
                {/* Background circle */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="2"
                />
                {/* Progress circle */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke={`url(#gradient-ring-${market.id})`}
                  strokeWidth="2"
                  strokeDasharray={`${leadingOutcome.probability} 100`}
                  strokeDashoffset="25"
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                  className="probability-progress"
                />
              </svg>
              <div className="probability-value">
                <span className="probability-number">{Math.round(leadingOutcome.probability)}</span>
                <span className="probability-percent">%</span>
              </div>
            </div>
          )}
          
          {/* Outcome labels */}
          <div className="outcome-labels">
            {isScalarMarket && scalarValue ? (
              <>
                <div className="scalar-info primary">
                  <span className="scalar-label">Market Estimate</span>
                  <span className="scalar-estimate">{scalarValue.value.toFixed(2)}</span>
                </div>
                <div className="scalar-details">
                  <div className="outcome-label-item small">
                    <span className="outcome-dot" style={{ background: '#6366f1' }} />
                    <span className="outcome-name">UP token</span>
                    <span className="outcome-prob">${(scalarValue.upPrice / 100).toFixed(3)}</span>
                  </div>
                  <div className="outcome-label-item small">
                    <span className="outcome-dot" style={{ background: '#8b5cf6' }} />
                    <span className="outcome-name">DOWN token</span>
                    <span className="outcome-prob">${(scalarValue.downPrice / 100).toFixed(3)}</span>
                  </div>
                </div>
              </>
            ) : (
              sortedOutcomes
                .filter(({ outcome }) => !outcome.toLowerCase().includes('invalid') || sortedOutcomes.length <= 2)
                .slice(0, isBinaryMarket ? 2 : 3)
                .map(({ outcome, probability, gradient }, idx) => (
                  <div key={idx} className="outcome-label-item">
                    <span 
                      className="outcome-dot" 
                      style={{ 
                        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
                      }}
                    />
                    <span className="outcome-name">{outcome}</span>
                    <span className="outcome-prob">{Math.round(probability)}%</span>
                  </div>
                ))
            )}
            {sortedOutcomes.filter(o => !o.outcome.toLowerCase().includes('invalid')).length > (isBinaryMarket ? 2 : 3) && (
              <div className="outcome-label-item more">
                <span className="outcome-name">+{sortedOutcomes.filter(o => !o.outcome.toLowerCase().includes('invalid')).length - (isBinaryMarket ? 2 : 3)} more</span>
              </div>
            )}
          </div>
        </div>

        {/* Market Stats Footer */}
        <div className="market-stats-footer">
          <div className="stat-item">
            <span className="stat-value">{formatDollarAmount(totalVolume)}</span>
            <span className="stat-label">Vol.</span>
          </div>
          {market.finalizeTs && (
            <div className="stat-item" title="Market resolves weekly">
              <span className="stat-icon">📅</span>
              <span className="stat-label">Weekly</span>
            </div>
          )}
        </div>
      </div>
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
      <div className="market-pools-view-modern">
        <div className="loading-state">
          <Loader stroke="white" size="2rem" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="market-pools-view-modern">
        <div className="error-state">
          <Trans>Error loading pools: {error.message}</Trans>
        </div>
      </div>
    );
  }

  if (groupedMarkets.length === 0) {
    return (
      <div className="market-pools-view-modern">
        <div className="empty-state">
          <Trans>No pools found</Trans>
        </div>
      </div>
    );
  }

  return (
    <div className="market-pools-view-modern">
      <div className="markets-grid">
        {groupedMarkets.map((groupedMarket) => (
          <MarketGroup
            key={groupedMarket.market.id}
            groupedMarket={groupedMarket}
          />
        ))}
      </div>
      
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