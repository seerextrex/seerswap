import React, { FC } from "react";
import { Trans } from "@lingui/macro";
import { Info } from "react-feather";

interface MarketEstimate {
    current: number;
    lower: number;
    upper: number;
    range: number;
}

interface MarketEstimateDisplayProps {
    marketEstimate: MarketEstimate;
}

export const MarketEstimateDisplay: FC<MarketEstimateDisplayProps> = ({ marketEstimate }) => {
    return (
        <div className="market-estimate-display">
            <div className="estimate-header">
                <span className="estimate-label"><Trans>Market Estimate</Trans></span>
                <div className="estimate-info-icon">
                    <Info size={14} />
                    <div className="tooltip">
                        <Trans>The market's current prediction based on trading activity</Trans>
                    </div>
                </div>
            </div>
            <div className="estimate-value-large" data-value={marketEstimate.current.toFixed(2)}>
                {marketEstimate.current.toFixed(2)}
            </div>
            <div className="estimate-range">
                <span className="range-label"><Trans>Range:</Trans></span>
                <span className="range-values">{marketEstimate.lower} - {marketEstimate.upper}</span>
            </div>
        </div>
    );
};