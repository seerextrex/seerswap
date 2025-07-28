import { useEffect, useState, useMemo } from "react";
import { Frown, ChevronDown, ChevronUp } from "react-feather";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import { FarmModal } from "../../components/FarmModal";
import { FarmingEventCard } from "../../components/FarmingEventCard";
import { FarmingType } from "../../models/enums";
import { Market } from "../../state/data/generated";
import "./index.scss";

import { Trans } from "@lingui/macro";

interface EternalFarmsPageProps {
    data: any[] | null;
    refreshing: boolean;
    priceFetched: boolean;
    fetchHandler: () => any;
}

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
                                                {marketGroup.farms.length} farm{marketGroup.farms.length !== 1 ? 's' : ''}
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
                                    <div className={"eternal-page__row mb-1 w-100"}>
                                        {marketGroup.farms.map((event: any, j: number) => (
                                            <FarmingEventCard
                                                key={`${marketKey}-${j}`}
                                                farmHandler={() => setModalForPool(event)}
                                                refreshing={refreshing}
                                                now={0}
                                                eternal
                                                event={event}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </>
    );
}
