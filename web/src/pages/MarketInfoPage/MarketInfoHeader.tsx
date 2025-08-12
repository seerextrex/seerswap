import { FC, useState, useCallback } from "react";
import { t, Trans } from "@lingui/macro";
import { formatDollarAmount } from "../../utils/numbers";
import { AlertCircle, TrendingUp, ExternalLink } from "react-feather";
import "./MarketInfoHeader.scss";

interface MarketInfoHeaderProps {
    market: any;
    validOutcomes: string[];
}

export const MarketInfoHeader: FC<MarketInfoHeaderProps> = ({ market, validOutcomes }) => {
    const [marketImageError, setMarketImageError] = useState(false);
    const [outcomeImageErrors, setOutcomeImageErrors] = useState<{ [key: number]: boolean }>({});

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
                            
                            return (
                                <div key={index} className="outcome-item">
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