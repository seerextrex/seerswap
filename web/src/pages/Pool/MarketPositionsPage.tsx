import React, { useMemo, useState, useCallback, memo } from 'react';
import { Trans, t } from '@lingui/macro';
import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ChevronDown, ChevronUp, Frown } from 'react-feather';
import { useAccount } from 'wagmi';
import { useSubgraphPositionsByMarket, PositionPoolExtended } from '../../hooks/useSubgraphPositions';
import { useUserHideClosedPositions } from '../../state/user/hooks';
import { Market } from '../../state/data/generated';
import { formatDollarAmount } from '../../utils/numbers';
import Loader from '../../components/Loader';
import Card from '../../shared/components/Card/Card';
import AutoColumn from '../../shared/components/AutoColumn';
import { SwapPoolTabs } from '../../components/NavigationTabs';
import FilterPanelItem from './FilterPanelItem';
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink';
import './MarketPositionsPage.scss';

// Helper function to get outcome name (similar to farms page)
const getOutcomeName = (market: Market | null | undefined, tokenId: string): string | null => {
    if (!market?.outcomes || !market?.wrappedTokensString || !tokenId) {
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
    market: any;
    positions: PositionPoolExtended[];
    isExpanded: boolean;
    onToggle: () => void;
}

const MarketGroup = memo(({ market, positions, isExpanded, onToggle }: MarketGroupProps) => {
    const [userHideClosedPositions] = useUserHideClosedPositions();

    const filteredPositions = useMemo(() => {
        if (userHideClosedPositions) {
            return positions.filter(p => p.liquidity > 0n);
        }
        return positions;
    }, [positions, userHideClosedPositions]);

    const totalLiquidity = useMemo(() => {
        return filteredPositions.reduce((sum, pos) => {
            const poolTVL = parseFloat(pos.pool?.totalValueLockedUSD || '0');
            // Estimate position share based on liquidity proportion
            const poolLiquidity = parseFloat(pos.pool?.liquidity || '1');
            const positionLiquidity = parseFloat(pos.liquidity.toString());
            const positionShare = poolLiquidity > 0 ? positionLiquidity / poolLiquidity : 0;
            return sum + (poolTVL * positionShare);
        }, 0);
    }, [filteredPositions]);

    return (
        <div className="market-group">
            <div className="market-header" onClick={onToggle}>
                <div className="market-info">
                    <h3 className="market-name">{market?.marketName || 'Unknown Market'}</h3>
                    <div className="market-stats">
                        <span className="position-count">{filteredPositions.length} positions</span>
                        <span className="market-tvl">{formatDollarAmount(totalLiquidity)}</span>
                    </div>
                </div>
                <div className="expand-toggle">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>
            {isExpanded && (
                <div className="market-positions">
                    {filteredPositions.length === 0 ? (
                        <div className="no-positions">
                            <Trans>No positions in this market</Trans>
                        </div>
                    ) : (
                        <div className="positions-grid">
                            {filteredPositions.map((position) => (
                                <PositionCard key={position.tokenId.toString()} position={position} market={market} />
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
    market: any;
}

const PositionCard = memo(({ position, market }: PositionCardProps) => {
    const pool = position.pool;
    if (!pool) return null;

    // Determine outcome token
    let outcomeToken: any = null;
    let outcomeTokenSymbol = '';

    if (pool.token0 && pool.token1) {
        // Check which token is the outcome token (not collateral)
        const isToken0Outcome = pool.market0?.id === market?.id || pool.market1?.id === market?.id;
        outcomeToken = isToken0Outcome ? pool.token0 : pool.token1;
        
        // Try to get outcome name
        const outcomeName = getOutcomeName(market, outcomeToken.id);
        outcomeTokenSymbol = outcomeName || outcomeToken.symbol || 'Unknown';
    }

    const inRange = pool.tick && position.tickLower <= Number(pool.tick) && Number(pool.tick) < position.tickUpper;

    return (
        <div className={`position-card ${inRange ? 'in-range' : 'out-of-range'}`}>
            <div className="position-header">
                <span className="token-symbol">{outcomeTokenSymbol}</span>
                <span className={`range-badge ${inRange ? 'in-range' : 'out-of-range'}`}>
                    {inRange ? <Trans>In Range</Trans> : <Trans>Out of Range</Trans>}
                </span>
            </div>
            <div className="position-stats">
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

export default function MarketPositionsPage() {
    const { address: account } = useAccount();
    const { positions, positionsByMarket, loading, error, refetch } = useSubgraphPositionsByMarket(account);
    const [expandedMarkets, setExpandedMarkets] = useState<Set<string>>(new Set());
    const [userHideClosedPositions, setUserHideClosedPositions] = useUserHideClosedPositions();

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

    const filters = [
        {
            method: setUserHideClosedPositions,
            checkValue: userHideClosedPositions,
        },
    ];

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

    return (
        <>
            <Helmet>
                <title>{t`Market Positions`}</title>
            </Helmet>
            <Card classes={"card-gradient-shadow br-24 ph-2 pv-1 mxs_ph-1 mv-2"}>
                <SwapPoolTabs active={"pool"} />
                <AutoColumn gap="1">
                    <div className={"pool__header flex-s-between"}>
                        <span className={"fs-125"}>
                            <Trans>Market Positions Overview</Trans>
                        </span>
                        {positions && positions.length > 0 && (
                            <div className={"flex-s-between mxs_mv-05"}>
                                <NavLink className={"btn primary p-05 br-8"} id="join-pool-button" to={`/add`}>
                                    + <Trans>New Position</Trans>
                                </NavLink>
                            </div>
                        )}
                    </div>
                    {account && (
                        <div className={"f mb-05 rg-2 cg-2 mxs_f-jc"}>
                            {filters.map((item, key) => (
                                <FilterPanelItem item={item} key={key} />
                            ))}
                        </div>
                    )}
                    <main className={"f c f-ac"}>
                        {!account ? (
                            <div className={"f c f-ac f-jc h-400 w-100 maw-300"}>
                                <Trans>Connect to a wallet to view your liquidity.</Trans>
                            </div>
                        ) : loading ? (
                            <Loader style={{ margin: "auto" }} stroke="white" size={"2rem"} />
                        ) : error ? (
                            <div className={"f c f-ac f-jc h-400 w-100 maw-300"}>
                                <Frown size={48} />
                                <Trans>Error loading positions</Trans>
                                <button onClick={refetch} className="btn btn-sm mt-1">
                                    <Trans>Retry</Trans>
                                </button>
                            </div>
                        ) : markets.length === 0 ? (
                            <div className={"f c f-ac f-jc h-400 w-100 maw-300"}>
                                <Trans>You do not have any liquidity positions.</Trans>
                                <NavLink style={{ textAlign: "center" }} className={"btn primary pv-05 ph-1 mt-1 w-100"} to={`/add`}>
                                    + <Trans>New Position</Trans>
                                </NavLink>
                            </div>
                        ) : (
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
                        )}
                    </main>
                </AutoColumn>
            </Card>
            <SwitchLocaleLink />
        </>
    );
}