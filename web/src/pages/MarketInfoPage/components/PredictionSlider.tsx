import React, { FC, useCallback } from "react";
import { Trans } from "@lingui/macro";
import { CustomSlider } from "./CustomSlider";

interface MarketEstimate {
    current: number;
    lower: number;
    upper: number;
    range: number;
}

interface PredictionSliderProps {
    sliderValue: number;
    marketEstimate: MarketEstimate;
    hasUserModifiedSlider: boolean;
    onSliderChange: (value: number) => void;
    onReset: () => void;
}

export const PredictionSlider: FC<PredictionSliderProps> = ({
    sliderValue,
    marketEstimate,
    hasUserModifiedSlider,
    onSliderChange,
    onReset
}) => {
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && val >= marketEstimate.lower && val <= marketEstimate.upper) {
            onSliderChange(val);
        }
    }, [marketEstimate.lower, marketEstimate.upper, onSliderChange]);

    return (
        <div className="slider-section">
            <div className="slider-header">
                <span className="slider-label"><Trans>Your Prediction</Trans></span>
                <div className="slider-value-display">
                    <input
                        type="number"
                        className="slider-value-input"
                        value={sliderValue.toFixed(2)}
                        onChange={handleInputChange}
                        min={marketEstimate.lower}
                        max={marketEstimate.upper}
                        step={0.01}
                    />
                    {hasUserModifiedSlider && Math.abs(sliderValue - marketEstimate.current) > 0.01 && (
                        <button 
                            className="reset-button"
                            onClick={onReset}
                            title="Reset to current market estimate"
                        >
                            <Trans>Reset</Trans>
                        </button>
                    )}
                </div>
            </div>
            
            <CustomSlider
                value={sliderValue}
                min={marketEstimate.lower}
                max={marketEstimate.upper}
                currentMarketEstimate={marketEstimate.current}
                onChange={onSliderChange}
                hasUserModified={hasUserModifiedSlider}
                step={0.01}
            />
        </div>
    );
};