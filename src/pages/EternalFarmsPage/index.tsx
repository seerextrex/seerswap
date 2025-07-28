import { useEffect, useState, useMemo } from "react";
import { Frown, ChevronDown, ChevronUp, ExternalLink } from "react-feather";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import { FarmModal } from "../../components/FarmModal";
import { FarmingType } from "../../models/enums";
import { Market } from "../../state/data/generated";
import { formatDollarAmount } from "../../utils/numbers";
import SDAI_LOGO from "../../assets/images/sdai-logo.svg";
import "./index.scss";

import { Trans } from "@lingui/macro";

interface EternalFarmsPageProps {
    data: any[] | null;
    refreshing: boolean;
    priceFetched: boolean;
    fetchHandler: () => any;
}

const TokenImage = ({ imageUrl, tokenSymbol, size = 24 }: { imageUrl: string | null, tokenSymbol: string, size?: number }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

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
};

const TokenPairDisplay = ({ pool }: { pool: any }) => {
    if (!pool?.market0 && !pool?.market1) {
        return (
            <div className="token-pair-display">
                <div className="token-pair-fallback">
                    {pool?.token0?.symbol || 'T0'}/{pool?.token1?.symbol || 'T1'}
                </div>
            </div>
        );
    }

    // Helper function to find token image in a market
    const findTokenImage = (market: any, tokenId: string) => {
        if (!market?.tokens || !market?.image?.[0]?.cidOutcomes) return null;

        const tokenIndex = market.tokens.findIndex((token: any) =>
            token.id.toLowerCase() === tokenId?.toLowerCase()
        );

        return tokenIndex >= 0 && market.image[0].cidOutcomes[tokenIndex]
            ? `https://ipfs.io${market.image[0].cidOutcomes[tokenIndex]}`
            : null;
    };

    // Try to find token images in market0 first, then market1
    let token0ImageUrl: string | null = null;
    let token1ImageUrl: string | null = null;

    if (pool.market0) {
        token0ImageUrl = findTokenImage(pool.market0, pool.token0?.id);
        token1ImageUrl = findTokenImage(pool.market0, pool.token1?.id);
    }

    // If not found in market0, try market1
    if (!token0ImageUrl && pool.market1) {
        token0ImageUrl = findTokenImage(pool.market1, pool.token0?.id);
    }
    if (!token1ImageUrl && pool.market1) {
        token1ImageUrl = findTokenImage(pool.market1, pool.token1?.id);
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
};

const MarketFarmsList = ({ farms, onFarmClick }: { farms: any[], onFarmClick: (farm: any) => void }) => {
    return (
        <div className="market-farms-list">
            <div className="market-farms-header">
                <div className="farm-header-item token-pair">
                    <Trans>Pool</Trans>
                </div>
                <div className="farm-header-item apr">
                    <Trans>APR</Trans>
                </div>
                <div className="farm-header-item tvl">
                    <Trans>TVL</Trans>
                </div>
                <div className="farm-header-item rewards">
                    <Trans>Daily Rewards</Trans>
                </div>
                <div className="farm-header-item action">
                    <Trans>Action</Trans>
                </div>
            </div>
            <div className="market-farms-body">
                {farms.map((farm: any, index: number) => (
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
                        <div className="farm-item rewards">
                            <div className="reward-amount">
                                {farm.dailyRewardRate ? `${farm.dailyRewardRate.toLocaleString()} SEER-LPP` : '-'}
                            </div>
                            {farm.dailyBonusRewardRate && farm.dailyBonusRewardRate > 0 && (
                                <div className="bonus-reward">
                                    + {farm.dailyBonusRewardRate.toLocaleString()} bonus
                                </div>
                            )}
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
};

const MarketImage = ({ market, marketName }: { market: Market | undefined, marketName: string }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const imageUrl = market?.image?.[0]?.cidMarket
        ? `https://ipfs.io${market.image[0].cidMarket}`
        : null;

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

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
};

export default function EternalFarmsPage({ data, refreshing, priceFetched, fetchHandler }: EternalFarmsPageProps) {
    const [modalForPool, setModalForPool] = useState<any>(null);
    const [expandedMarkets, setExpandedMarkets] = useState<Set<string>>(new Set());

    useEffect(() => {
        // if (priceFetched) {
        fetchHandler();
        // }
    }, [priceFetched]);

    // Group farms by market
    const groupedFarms = useMemo(() => {
        if (!data || data.length === 0) return {};

        return data.reduce((groups: any, event: any) => {
            const marketName = event.pool?.market0?.marketName || 'Unknown Market';
            const marketId = event.pool?.market0?.id || 'unknown';
            const marketKey = `${marketId}-${marketName}`;

            if (!groups[marketKey]) {
                groups[marketKey] = {
                    marketName,
                    marketId,
                    market: event.pool?.market0 as Market | undefined,
                    farms: []
                };
            }

            groups[marketKey].farms.push(event);
            return groups;
        }, {});
    }, [data]);

    const sortedMarketKeys = useMemo(() => {
        const keys = Object.keys(groupedFarms).sort((a, b) => {
            const marketA = groupedFarms[a].marketName;
            const marketB = groupedFarms[b].marketName;

            // Put "Unknown Market" at the end
            if (marketA === 'Unknown Market' && marketB !== 'Unknown Market') return 1;
            if (marketA !== 'Unknown Market' && marketB === 'Unknown Market') return -1;

            return marketA.localeCompare(marketB);
        });

        return keys;
    }, [groupedFarms]);

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
