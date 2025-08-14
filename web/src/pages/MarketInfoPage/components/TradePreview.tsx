import React, { FC } from "react";
import { Trans } from "@lingui/macro";
import { TrendingUp, TrendingDown, Info } from "react-feather";
import { Trade as V3Trade } from "lib/src";
import { Currency, TradeType } from "@uniswap/sdk-core";

interface TradeDirection {
    type: 'up' | 'down';
    targetEstimate: number;
    targetProbability: number;
    currentProbability: number;
    estimateDiff: number;
    outcomeToken: Currency | null;
    tokenAddress: string | null;
}

interface TradePreviewProps {
    tradeDirection: TradeDirection | null;
    trade: V3Trade<Currency, Currency, TradeType> | undefined;
    tradeAmount: string;
    collateralSymbol: string;
    sliderValue: number;
    priceImpact: any;
    wouldOvershootTarget: boolean;
}

export const TradePreview: FC<TradePreviewProps> = ({
    tradeDirection,
    trade,
    tradeAmount,
    collateralSymbol,
    sliderValue,
    priceImpact,
    wouldOvershootTarget
}) => {
    if (!tradeDirection || !trade || parseFloat(tradeAmount) <= 0) return null;

    const roi = ((parseFloat(trade.outputAmount?.toSignificant(6) || '0') / parseFloat(tradeAmount) - 1) * 100);

    return (
        <div className="trade-preview-container">
            <div className={`trade-indicator ${tradeDirection.type}`}>
                <div className="trade-header">
                    {tradeDirection.type === 'up' ? (
                        <>
                            <TrendingUp size={16} />
                            <span className="direction-text"><Trans>BETTING ON UP</Trans></span>
                        </>
                    ) : (
                        <>
                            <TrendingDown size={16} />
                            <span className="direction-text"><Trans>BETTING ON DOWN</Trans></span>
                        </>
                    )}
                    <span className="target-value">{sliderValue.toFixed(2)}</span>
                </div>
            </div>
            
            <div className="profit-box">
                <div className="profit-item">
                    <span className="profit-label"><Trans>If correct:</Trans></span>
                    <span className="profit-value positive">
                        +{trade.outputAmount?.toSignificant(2)} {collateralSymbol}
                    </span>
                </div>
                <div className="profit-item">
                    <span className="profit-label"><Trans>ROI:</Trans></span>
                    <span className="profit-value">{roi.toFixed(1)}%</span>
                </div>
            </div>

            {/* Warnings with color coding based on severity */}
            {wouldOvershootTarget && tradeAmount && parseFloat(tradeAmount) > 0 && (
                <div className="warning-message severity-critical">
                    <Info size={16} />
                    <span><Trans>Amount too large for target</Trans></span>
                </div>
            )}
            
            {priceImpact && tradeDirection && trade && !wouldOvershootTarget && (() => {
                const impact = Math.abs(parseFloat(priceImpact.toFixed(2)));
                let severity = '';
                let message = '';
                
                if (impact > 15) {
                    severity = 'severity-critical';
                    message = 'Extreme';
                } else if (impact > 10) {
                    severity = 'severity-high';
                    message = 'Very high';
                } else if (impact > 5) {
                    severity = 'severity-medium';
                    message = 'High';
                } else if (impact > 2) {
                    severity = 'severity-low';
                    message = 'Moderate';
                } else {
                    return null;
                }
                
                return (
                    <div className={`warning-message ${severity}`}>
                        <Info size={16} />
                        <span>
                            <Trans>{message} price impact: {priceImpact.toFixed(2)}%</Trans>
                        </span>
                    </div>
                );
            })()}
        </div>
    );
};