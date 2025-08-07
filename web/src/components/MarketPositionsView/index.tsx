import React, { useMemo, useState, useCallback, memo } from 'react';
import { Trans } from '@lingui/macro';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'react-feather';
import { Market } from '../../state/data/generated';
import { PositionPoolExtended } from '../../hooks/useSubgraphPositionsV2';
import { formatDollarAmount } from '../../utils/numbers';
import { calculatePositionValueUSD } from '../../utils/position';
import './styles.scss';

// Helper function to get outcome name (similar to farms page)
const getOutcomeName = (market: Market | null | undefined, tokenId: string, parentMarket?: Market | null): string | null => {
    if (!tokenId) return null;

    // For child markets, check parent market for outcome names
    if (parentMarket?.outcomes && parentMarket?.tokens) {
        const tokenIndex = parentMarket.tokens.findIndex((token: any) => 
            token.id.toLowerCase() === tokenId.toLowerCase()
        );
        
        if (tokenIndex !== -1 && tokenIndex < parentMarket.outcomes.length) {
            return parentMarket.outcomes[tokenIndex];
        }
    }

    // Check in the current market
    if (!market?.outcomes || !market?.wrappedTokensString) {
        return null;
    }

    try {
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
    } catch (e) {
        console.error('Error parsing outcome name:', e);
    }

    return null;
};

interface MarketGroupProps {
    market: Market | null | undefined;
    positions: PositionPoolExtended[];
    isExpanded: boolean;
    onToggle: () => void;
}

// Market image component
const MarketImage = memo(({ market, marketName }: { market: Market | null | undefined, marketName: string }) => {
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
            <div className="market-image-placeholder">
                {marketName.charAt(0).toUpperCase()}
            </div>
        );
    }

    return (
        <div className="market-image-container">
            {imageLoading && (
                <div className="market-image-placeholder loading-placeholder">
                    {marketName.charAt(0).toUpperCase()}
                </div>
            )}
            <img
                src={imageUrl}
                alt={marketName}
                className={`market-image ${imageLoading ? 'loading' : ''}`}
                onError={handleImageError}
                onLoad={handleImageLoad}
            />
        </div>
    );
});

// Token image component for outcome tokens
const TokenImage = memo(({ imageUrl, tokenSymbol, size = 24 }: { imageUrl: string | null, tokenSymbol: string, size?: number }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = useCallback(() => {
        setImageError(true);
        setImageLoading(false);
    }, []);

    const handleImageLoad = useCallback(() => {
        setImageLoading(false);
    }, []);

    if (!imageUrl || imageError) {
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
                style={{ width: size, height: size, borderRadius: size * 0.5 }}
                className={`token-image ${imageLoading ? 'loading' : ''}`}
                onError={handleImageError}
                onLoad={handleImageLoad}
            />
        </div>
    );
});

// Helper function to find token image URL
const findTokenImageUrl = (market: Market | null | undefined, tokenId: string): string | null => {
    if (!market?.tokens || !market?.image?.[0]?.cidOutcomes) {
        return null;
    }

    // Use wrappedTokensString if available
    if (market.wrappedTokensString && market.wrappedTokensString.length > 0) {
        const wrappedTokens = market.wrappedTokensString.map((token: string) => token.toLowerCase());
        const tokenIndex = wrappedTokens.findIndex((wrappedTokenId: string) => 
            wrappedTokenId === tokenId?.toLowerCase()
        );

        if (tokenIndex >= 0 && market.image[0].cidOutcomes[tokenIndex]) {
            return `https://ipfs.io${market.image[0].cidOutcomes[tokenIndex]}`;
        }
    }

    return null;
};

// Outcome group component
interface OutcomeGroupProps {
    outcomeName: string;
    outcomeToken: { id: string; symbol?: string };
    positions: PositionPoolExtended[];
    market: Market | null | undefined;
    isExpanded: boolean;
    onToggle: () => void;
}

const OutcomeGroup = memo(({ outcomeName, outcomeToken, positions, market, isExpanded, onToggle }: OutcomeGroupProps) => {
    const totalLiquidity = useMemo(() => {
        return positions.reduce((sum, pos) => {
            const positionValue = calculatePositionValueUSD(pos);
            return sum + (positionValue || 0);
        }, 0);
    }, [positions]);

    // Count farming positions
    const farmingCount = useMemo(() => {
        return positions.filter(pos => pos.onFarming === true).length;
    }, [positions]);

    const tokenImageUrl = findTokenImageUrl(market, outcomeToken.id);

    return (
        <div className="outcome-group">
            <div className="outcome-header" onClick={onToggle}>
                <div className="outcome-info">
                    <TokenImage 
                        imageUrl={tokenImageUrl} 
                        tokenSymbol={outcomeName} 
                        size={32} 
                    />
                    <span className="outcome-name">{outcomeName}</span>
                    <span className="outcome-stats">
                        {positions.length} position{positions.length !== 1 ? 's' : ''}
                        {farmingCount > 0 && (
                            <span className="farming-indicator">
                                {' '}(🌾 {farmingCount} farming)
                            </span>
                        )}
                        {' '}• {formatDollarAmount(totalLiquidity)}
                    </span>
                </div>
                <div className="expand-toggle">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </div>
            {isExpanded && (
                <div className="outcome-positions">
                    {positions.map((position) => (
                        <PositionCard key={position.tokenId.toString()} position={position} />
                    ))}
                </div>
            )}
        </div>
    );
});

const MarketGroup = memo(({ market, positions, isExpanded, onToggle }: MarketGroupProps) => {
    const [expandedOutcomes, setExpandedOutcomes] = useState<Set<string>>(new Set());

    // Count farming positions
    const farmingCount = useMemo(() => {
        return positions.filter(pos => pos.onFarming === true).length;
    }, [positions]);

    // Group positions by outcome token
    const positionsByOutcome = useMemo(() => {
        const outcomeMap = new Map<string, { token: any; positions: PositionPoolExtended[]; name: string }>();
        
        positions.forEach((position) => {
            const pool = position.pool;
            if (!pool || !pool.token0 || !pool.token1) return;

            // Determine outcome token
            const collateralTokenId = market?.collateralToken?.id?.toLowerCase();
            const outcomeToken = collateralTokenId && pool.token0.id.toLowerCase() === collateralTokenId ? pool.token1 : pool.token0;
            
            // Get outcome name
            const parentMarket = market?.parentMarket?.id ? 
                pool.market0?.id === market.parentMarket.id ? pool.market0 : 
                pool.market1?.id === market.parentMarket.id ? pool.market1 : null : null;
            
            const outcomeName = getOutcomeName(market, outcomeToken.id, parentMarket as Market | null) || 
                                outcomeToken.symbol || 
                                'Unknown';
            
            const key = outcomeToken.id;
            if (!outcomeMap.has(key)) {
                outcomeMap.set(key, { 
                    token: outcomeToken, 
                    positions: [], 
                    name: outcomeName 
                });
            }
            const outcomeData = outcomeMap.get(key);
            if (outcomeData) {
                outcomeData.positions.push(position);
            }
        });
        
        return outcomeMap;
    }, [positions, market]);

    const totalLiquidity = useMemo(() => {
        return positions.reduce((sum, pos) => {
            const positionValue = calculatePositionValueUSD(pos);
            return sum + (positionValue || 0);
        }, 0);
    }, [positions]);

    const toggleOutcome = useCallback((outcomeId: string) => {
        setExpandedOutcomes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(outcomeId)) {
                newSet.delete(outcomeId);
            } else {
                newSet.add(outcomeId);
            }
            return newSet;
        });
    }, []);

    return (
        <div className="market-group">
            <div className="market-header" onClick={onToggle}>
                <MarketImage market={market} marketName={market?.marketName || 'Unknown'} />
                <div className="market-info">
                    <h3 className="market-name">{market?.marketName || 'Unknown Market'}</h3>
                    <div className="market-stats">
                        <span className="position-count">
                            {positions.length} positions
                            {farmingCount > 0 && (
                                <span className="farming-indicator">
                                    {' '}(🌾 {farmingCount} farming)
                                </span>
                            )}
                        </span>
                        <span className="market-tvl">{formatDollarAmount(totalLiquidity)}</span>
                    </div>
                </div>
                <div className="expand-toggle">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>
            {isExpanded && (
                <div className="market-positions">
                    {positionsByOutcome.size === 0 ? (
                        <div className="no-positions">
                            <Trans>No positions in this market</Trans>
                        </div>
                    ) : (
                        <div className="outcomes-list">
                            {Array.from(positionsByOutcome.entries()).map(([outcomeId, outcomeData]) => (
                                <OutcomeGroup
                                    key={outcomeId}
                                    outcomeName={outcomeData.name}
                                    outcomeToken={outcomeData.token}
                                    positions={outcomeData.positions}
                                    market={market}
                                    isExpanded={expandedOutcomes.has(outcomeId)}
                                    onToggle={() => toggleOutcome(outcomeId)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

interface PositionCardProps {
    position: PositionPoolExtended;
}

const PositionCard = memo(({ position }: PositionCardProps) => {
    const pool = position.pool;
    if (!pool) return null;
    
    const positionValue = calculatePositionValueUSD(position);
    const isClosed = position.liquidity === 0n;
    const inRange = pool.tick && position.tickLower <= Number(pool.tick) && Number(pool.tick) < position.tickUpper;
    const isFarming = position.onFarming === true;

    return (
        <div className={`position-card compact ${inRange ? 'in-range' : 'out-of-range'} ${isClosed ? 'closed' : ''} ${isFarming ? 'farming' : ''}`}>
            <div className="position-header">
                {isFarming && (
                    <span className="farming-badge">
                        🌾 <Trans>Farming</Trans>
                    </span>
                )}
                {isClosed && (
                    <span className="closed-badge">
                        <Trans>Closed</Trans>
                    </span>
                )}
                <span className={`range-badge ${inRange ? 'in-range' : 'out-of-range'}`}>
                    {inRange ? <Trans>In Range</Trans> : <Trans>Out of Range</Trans>}
                </span>
            </div>
            <div className="position-stats">
                <div className="stat">
                    <label><Trans>Value</Trans></label>
                    <span className="value">{positionValue !== null ? formatDollarAmount(positionValue) : '-'}</span>
                </div>
                <div className="stat">
                    <label><Trans>Liquidity</Trans></label>
                    <span className="value">{position.liquidity.toString()}</span>
                </div>
                <div className="stat">
                    <label><Trans>Range</Trans></label>
                    <span className="value">[{position.tickLower}, {position.tickUpper}]</span>
                </div>
            </div>
            <div className="position-actions">
                <NavLink to={`/pool/${position.tokenId}`} className="btn btn-sm">
                    <Trans>Manage</Trans>
                </NavLink>
            </div>
        </div>
    );
});

interface MarketPositionsViewProps {
    positionsByMarket: Map<string, PositionPoolExtended[]> | undefined;
}

export default function MarketPositionsView({ positionsByMarket }: MarketPositionsViewProps) {
    const [expandedMarkets, setExpandedMarkets] = useState<Set<string>>(new Set());

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

    // Get unique markets from positions
    const markets = useMemo(() => {
        if (!positionsByMarket) return [];
        
        const marketMap = new Map();
        
        positionsByMarket.forEach((positions, marketId) => {
            // Get market info from first position's pool
            const firstPosition = positions[0];
            const pool = firstPosition?.pool;
            if (pool) {
                const market = pool.market0?.id === marketId ? pool.market0 : pool.market1;
                if (market) {
                    marketMap.set(marketId, market);
                }
            }
        });

        return Array.from(marketMap.entries());
    }, [positionsByMarket]);

    if (markets.length === 0) {
        return null;
    }

    return (
        <div className="market-positions-container">
            {markets.map(([marketId, market]) => (
                <MarketGroup
                    key={marketId}
                    market={market}
                    positions={positionsByMarket?.get(marketId) || []}
                    isExpanded={expandedMarkets.has(marketId)}
                    onToggle={() => toggleMarket(marketId)}
                />
            ))}
        </div>
    );
}