import { FC } from "react";
import { Trans } from "@lingui/macro";
import { RefreshCw } from "react-feather";
import { formatDollarAmount, formatAmount } from "../../utils/numbers";
import "./MarketInfoStats.scss";

interface MarketInfoStatsProps {
    market: any;
    refreshHandler: () => void;
    isLoading: boolean;
}

export const MarketInfoStats: FC<MarketInfoStatsProps> = ({
    market,
    refreshHandler,
    isLoading,
}) => {
    const stats = [
        {
            label: <Trans>Total Volume</Trans>,
            value: formatDollarAmount(market.volumeUSD),
            change: null,
        },
        {
            label: <Trans>Total Value Locked</Trans>,
            value: formatDollarAmount(market.totalValueLockedUSD),
            change: null,
        },
        {
            label: <Trans>Collateral Token</Trans>,
            value: market.collateralToken?.symbol || "—",
            subValue: market.collateralToken?.name,
        },
        {
            label: <Trans>Number of Outcomes</Trans>,
            value: market.outcomes ? market.outcomes.length - 1 : 0, // Exclude invalid outcome
            subValue: <Trans>excluding invalid</Trans>,
        },
    ];

    return (
        <div className="market-info-stats">
            <div className="stats-header">
                <h3 className="stats-title">
                    <Trans>Market Statistics</Trans>
                </h3>
                <button
                    className="refresh-btn"
                    onClick={refreshHandler}
                    disabled={isLoading}
                >
                    <RefreshCw
                        size={16}
                        className={isLoading ? "spinning" : ""}
                    />
                    <Trans>Refresh</Trans>
                </button>
            </div>
            
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-label">{stat.label}</div>
                        <div className="stat-value">
                            {stat.value}
                        </div>
                        {stat.subValue && (
                            <div className="stat-subvalue">{stat.subValue}</div>
                        )}
                    </div>
                ))}
            </div>

            {market.questions && market.questions.length > 0 && (
                <div className="oracle-stats">
                    <h4 className="oracle-title">
                        <Trans>Oracle Status</Trans>
                    </h4>
                    <div className="oracle-grid">
                        {market.questions.map((mq: any, index: number) => {
                            const question = mq.question;
                            if (!question) return null;

                            const finalizeDate = new Date(Number(question.finalize_ts) * 1000);
                            const isPending = question.is_pending_arbitration;
                            const hasAnswer = question.best_answer !== null;

                            return (
                                <div key={index} className="oracle-card">
                                    <div className="oracle-status">
                                        {isPending && (
                                            <span className="status-badge pending">
                                                <Trans>Pending Arbitration</Trans>
                                            </span>
                                        )}
                                        {!isPending && hasAnswer && (
                                            <span className="status-badge answered">
                                                <Trans>Answered</Trans>
                                            </span>
                                        )}
                                        {!isPending && !hasAnswer && (
                                            <span className="status-badge waiting">
                                                <Trans>Awaiting Answer</Trans>
                                            </span>
                                        )}
                                    </div>
                                    <div className="oracle-finalize">
                                        <span className="finalize-label">
                                            <Trans>Finalizes:</Trans>
                                        </span>
                                        <span className="finalize-date">
                                            {finalizeDate.toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};