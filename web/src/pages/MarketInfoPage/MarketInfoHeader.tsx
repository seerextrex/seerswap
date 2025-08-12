import { FC, useState, useCallback, useMemo, useEffect } from "react";
import { t, Trans } from "@lingui/macro";
import { formatDollarAmount } from "../../utils/numbers";
import { AlertCircle, TrendingUp, ExternalLink } from "react-feather";
import { gql } from "@apollo/client";
import { client } from "../../apollo/client";
import Percent from "../../components/Percent";
import "./MarketInfoHeader.scss";

interface MarketInfoHeaderProps {
    market: any;
    validOutcomes: string[];
    compact?: boolean;
}

const MARKET_POOLS_WITH_PRICES_QUERY = gql`
    query MarketPoolsWithPrices($marketId: String!) {
        pools(
            where: { 
                or: [
                    { market0: $marketId },
                    { market1: $marketId }
                ]
            }
            first: 100
            orderBy: totalValueLockedUSD
            orderDirection: desc
        ) {
            id
            token0 {
                id
                symbol
            }
            token1 {
                id
                symbol
            }
            token0Price
            token1Price
            market0 {
                id
                collateralToken {
                    id
                }
                wrappedTokensString
            }
            market1 {
                id
                collateralToken {
                    id
                }
                wrappedTokensString
            }
        }
    }
`;

const HISTORICAL_POOL_DATA_QUERY = gql`
    query HistoricalPoolData($poolId: ID!, $timestamp: Int!) {
        poolHourDatas(
            first: 1
            where: { 
                pool_: { id: $poolId }, 
                periodStartUnix_lte: $timestamp 
            }
            orderBy: periodStartUnix
            orderDirection: desc
        ) {
            token0Price
            token1Price
        }
    }
`;

export const MarketInfoHeader: FC<MarketInfoHeaderProps> = ({ market, validOutcomes, compact = false }) => {
    const [marketImageError, setMarketImageError] = useState(false);
    const [outcomeImageErrors, setOutcomeImageErrors] = useState<{ [key: number]: boolean }>({});
    const [outcomePriceChanges, setOutcomePriceChanges] = useState<{ [key: number]: number | null }>({});
    const [currentPrices, setCurrentPrices] = useState<{ [key: number]: number | null }>({});

    const handleMarketImageError = useCallback(() => {
        setMarketImageError(true);
    }, []);

    const handleOutcomeImageError = useCallback((index: number) => {
        setOutcomeImageErrors(prev => ({ ...prev, [index]: true }));
    }, []);
    const currentDate = new Date();
    const openingDate = new Date(Number(market.openingTs) * 1000);
    const finalizeDate = new Date(Number(market.finalizeTs) * 1000);
    
    const isOpen = currentDate >= openingDate && currentDate < finalizeDate;
    const isFinalized = currentDate >= finalizeDate;
    const isPending = currentDate < openingDate;

    const getMarketStatus = () => {
        if (isPending) return { text: t`Pending`, class: "pending" };
        if (isOpen) return { text: t`Open`, class: "open" };
        if (isFinalized) return { text: t`Finalized`, class: "finalized" };
        return { text: t`Unknown`, class: "unknown" };
    };

    const status = getMarketStatus();

    const marketImageUrl = market?.image?.[0]?.cidMarket 
        ? `https://ipfs.io${market.image[0].cidMarket}` 
        : null;

    // Calculate 24-hour price changes for each outcome
    useEffect(() => {
        if (!market?.id) return;

        const fetchPriceChanges = async () => {
            try {
                // Get current pools and prices
                const { data: poolsData } = await client.query({
                    query: MARKET_POOLS_WITH_PRICES_QUERY,
                    variables: { marketId: market.id },
                    fetchPolicy: "network-only",
                });

                if (!poolsData?.pools || poolsData.pools.length === 0) return;

                // Calculate timestamp for 24 hours ago
                const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - 86400;

                const priceChanges: { [key: number]: number | null } = {};
                const prices: { [key: number]: number | null } = {};

                // Process each pool to find outcome prices
                for (const pool of poolsData.pools) {
                    // Determine which outcome this pool represents
                    const outcomeIndex = determineOutcomeIndexForPool(pool, market);
                    if (outcomeIndex === -1) continue;

                    // Calculate current price
                    const currentPrice = calculateOutcomePriceForPool(pool, market);
                    if (currentPrice === null) continue;

                    prices[outcomeIndex] = currentPrice;

                    // Fetch historical price from 24 hours ago
                    const { data: historicalData } = await client.query({
                        query: HISTORICAL_POOL_DATA_QUERY,
                        variables: {
                            poolId: pool.id,
                            timestamp: twentyFourHoursAgo,
                        },
                        fetchPolicy: "network-only",
                    });

                    if (historicalData?.poolHourDatas && historicalData.poolHourDatas.length > 0) {
                        const historicalPrice = calculateOutcomePriceForPool(
                            { ...pool, ...historicalData.poolHourDatas[0] },
                            market
                        );

                        if (historicalPrice !== null && historicalPrice > 0) {
                            // Calculate percentage change
                            const change = ((currentPrice - historicalPrice) / historicalPrice) * 100;
                            priceChanges[outcomeIndex] = change;
                        }
                    }
                }

                setOutcomePriceChanges(priceChanges);
                setCurrentPrices(prices);
            } catch (error) {
                console.error("Error fetching price changes:", error);
            }
        };

        fetchPriceChanges();
    }, [market]);

    // Helper function to determine outcome index for a pool
    const determineOutcomeIndexForPool = (pool: any, market: any): number => {
        if (!market?.outcomes) return -1;

        const poolMarket = pool.market0?.id === market.id ? pool.market0 :
                          pool.market1?.id === market.id ? pool.market1 : null;

        if (!poolMarket) return -1;

        let wrappedTokens: string[] = [];
        if (poolMarket.wrappedTokensString) {
            if (typeof poolMarket.wrappedTokensString === 'string') {
                wrappedTokens = poolMarket.wrappedTokensString.split(',').map((t: string) => t.trim().toLowerCase());
            }
        }

        const token0Id = pool.token0.id?.toLowerCase();
        const token1Id = pool.token1.id?.toLowerCase();
        const collateralId = poolMarket.collateralToken?.id?.toLowerCase();

        // Match by wrapped token IDs
        for (let i = 0; i < wrappedTokens.length && i < market.outcomes.length - 1; i++) {
            if (token0Id === wrappedTokens[i] || token1Id === wrappedTokens[i]) {
                return i;
            }
        }

        return -1;
    };

    // Helper function to calculate outcome price
    const calculateOutcomePriceForPool = (pool: any, market: any): number | null => {
        const poolMarket = pool.market0?.id === market.id ? pool.market0 :
                          pool.market1?.id === market.id ? pool.market1 : null;

        if (!poolMarket) return null;

        const collateralId = poolMarket.collateralToken?.id?.toLowerCase();
        const isToken0Outcome = pool.token1.id?.toLowerCase() === collateralId;

        let price: number;
        if (isToken0Outcome) {
            const token0Price = parseFloat(pool.token0Price);
            if (!token0Price || isNaN(token0Price)) return null;
            price = token0Price;
        } else {
            const token1Price = parseFloat(pool.token1Price);
            if (!token1Price || isNaN(token1Price)) return null;
            price = token1Price;
        }

        // Ensure price is between 0 and 1
        if (price > 1 && price !== Infinity) {
            price = 1 / price;
        }

        if (price < 0.0001 || price > 1 || !isFinite(price)) {
            return null;
        }

        return price;
    };

    if (compact) {
        return (
            <div className="market-info-header compact">
                <div className="compact-stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">
                            <Trans>Volume (24h)</Trans>
                        </div>
                        <div className="stat-value primary">
                            {formatDollarAmount(market.volumeUSD)}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">
                            <Trans>TVL</Trans>
                        </div>
                        <div className="stat-value">
                            {formatDollarAmount(market.totalValueLockedUSD)}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">
                            <Trans>Status</Trans>
                        </div>
                        <div className={`stat-value status ${status.class}`}>
                            {status.text}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">
                            <Trans>Closes</Trans>
                        </div>
                        <div className="stat-value">
                            {finalizeDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                </div>
                
                {market.questions && market.questions.length > 0 && market.questions[0]?.question?.id && (
                    <div className="compact-oracle-link">
                        <a 
                            href={`https://reality.eth.limo/app/#!/network/100/question/0xe78996a233895be74a66f451f1019ca9734205cc-${market.questions[0].question.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="oracle-button"
                        >
                            <span><Trans>View Oracle</Trans></span>
                            <ExternalLink size={14} />
                        </a>
                        {market.questions[0].question?.is_pending_arbitration && (
                            <span className="arbitration-badge">
                                <AlertCircle size={12} />
                                <Trans>Arbitration</Trans>
                            </span>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="market-info-header">
            <div className="market-info-header__top">
                <div className="market-title-section">
                    {marketImageUrl && !marketImageError ? (
                        <img 
                            src={marketImageUrl}
                            alt={market.marketName}
                            className="market-image"
                            onError={handleMarketImageError}
                        />
                    ) : (
                        <div className="market-image-placeholder">
                            {market.marketName?.slice(0, 1).toUpperCase() || '?'}
                        </div>
                    )}
                    <div className="market-title-content">
                        <h1 className="market-name">{market.marketName}</h1>
                        <span className={`market-status ${status.class}`}>
                            {status.class === "open" && <span className="status-dot pulse" />}
                            {status.text}
                        </span>
                    </div>
                </div>
            </div>

            <div className="market-info-header__middle">
                <div className="outcomes-section">
                    <h3 className="outcomes-title">
                        <Trans>Outcomes</Trans>
                    </h3>
                    <div className="outcomes-list">
                        {validOutcomes.map((outcome, index) => {
                            const outcomeImageUrl = market?.image?.[0]?.cidOutcomes?.[index]
                                ? `https://ipfs.io${market.image[0].cidOutcomes[index]}`
                                : null;
                            
                            const priceChange = outcomePriceChanges[index];
                            const hasSignificantChange = priceChange !== null && Math.abs(priceChange) >= 1;
                            
                            return (
                                <div 
                                    key={index} 
                                    className={`outcome-item ${hasSignificantChange ? 'significant-change' : ''} ${
                                        hasSignificantChange && priceChange > 0 ? 'price-up' : 
                                        hasSignificantChange && priceChange < 0 ? 'price-down' : ''
                                    }`}
                                >
                                    {hasSignificantChange && (
                                        <div className="change-indicator" title={`${priceChange > 0 ? '+' : ''}${priceChange.toFixed(2)}% in 24h`}>
                                            <span className="change-arrow">{priceChange > 0 ? '↑' : '↓'}</span>
                                        </div>
                                    )}
                                    {outcomeImageUrl && !outcomeImageErrors[index] ? (
                                        <img 
                                            src={outcomeImageUrl}
                                            alt={outcome}
                                            className="outcome-image"
                                            onError={() => handleOutcomeImageError(index)}
                                        />
                                    ) : (
                                        <span className="outcome-index">{index + 1}</span>
                                    )}
                                    <span className="outcome-name">{outcome}</span>
                                    <div className="outcome-price-info">
                                        {currentPrices[index] !== null && currentPrices[index] !== undefined && (
                                            <span className="outcome-price">
                                                {(currentPrices[index]! * 100).toFixed(1)}%
                                            </span>
                                        )}
                                        {priceChange !== null && priceChange !== undefined && (
                                            <Percent value={priceChange} fontWeight={400} />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="market-stats">
                    <div className="stat-item">
                        <div className="stat-label">
                            <TrendingUp size={16} />
                            <Trans>Volume</Trans>
                        </div>
                        <div className="stat-value">
                            {formatDollarAmount(market.volumeUSD)}
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">
                            <AlertCircle size={16} />
                            <Trans>TVL</Trans>
                        </div>
                        <div className="stat-value">
                            {formatDollarAmount(market.totalValueLockedUSD)}
                        </div>
                    </div>
                </div>
            </div>

            {market.questions && market.questions.length > 0 && market.questions[0]?.question?.id && (
                <div className="market-info-header__bottom">
                    <div className="questions-section">
                        <div className="question-item">
                            <a 
                                href={`https://reality.eth.limo/app/#!/network/100/question/0xe78996a233895be74a66f451f1019ca9734205cc-${market.questions[0].question.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="question-link"
                                aria-label="View oracle question on Reality.eth"
                            >
                                <span className="question-text">
                                    <Trans>Oracle Question</Trans>
                                </span>
                                <ExternalLink size={16} className="external-icon" />
                            </a>
                            {market.questions[0].question?.is_pending_arbitration && (
                                <span className="arbitration-badge">
                                    <AlertCircle size={14} />
                                    <Trans>Pending Arbitration</Trans>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};