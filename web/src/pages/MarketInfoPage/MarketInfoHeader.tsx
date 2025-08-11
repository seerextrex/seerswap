import { FC } from "react";
import { t, Trans } from "@lingui/macro";
import { formatDollarAmount } from "../../utils/numbers";
import { AlertCircle, TrendingUp } from "react-feather";
import "./MarketInfoHeader.scss";

interface MarketInfoHeaderProps {
    market: any;
    validOutcomes: string[];
}

export const MarketInfoHeader: FC<MarketInfoHeaderProps> = ({ market, validOutcomes }) => {
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

    return (
        <div className="market-info-header">
            <div className="market-info-header__top">
                <div className="market-title-section">
                    <h1 className="market-name">{market.marketName}</h1>
                    <span className={`market-status ${status.class}`}>
                        {status.class === "open" && <span className="status-dot pulse" />}
                        {status.text}
                    </span>
                </div>
                
                <div className="market-dates">
                    <div className="date-item">
                        <span className="date-label">
                            <Trans>Opens</Trans>
                        </span>
                        <span className="date-value">
                            {openingDate.toLocaleDateString()} {openingDate.toLocaleTimeString()}
                        </span>
                    </div>
                    <div className="date-item">
                        <span className="date-label">
                            <Trans>Finalizes</Trans>
                        </span>
                        <span className="date-value">
                            {finalizeDate.toLocaleDateString()} {finalizeDate.toLocaleTimeString()}
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
                        {validOutcomes.map((outcome, index) => (
                            <div key={index} className="outcome-item">
                                <span className="outcome-index">{index + 1}</span>
                                <span className="outcome-name">{outcome}</span>
                            </div>
                        ))}
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

            {market.questions && market.questions.length > 0 && (
                <div className="market-info-header__bottom">
                    <div className="questions-section">
                        <h4 className="questions-title">
                            <Trans>Oracle Questions</Trans>
                        </h4>
                        {market.questions.map((mq: any, index: number) => (
                            <div key={index} className="question-item">
                                {mq.question?.is_pending_arbitration && (
                                    <span className="arbitration-badge">
                                        <AlertCircle size={14} />
                                        <Trans>Pending Arbitration</Trans>
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};