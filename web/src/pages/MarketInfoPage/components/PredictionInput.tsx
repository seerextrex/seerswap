import React, { FC, useCallback, useState, useEffect } from "react";
import { Trans } from "@lingui/macro";
import { CustomSlider } from "./CustomSlider";
import { SpeedometerPicker } from "./SpeedometerPicker";
import { Activity, Sliders } from "react-feather";
import "./PredictionInput.scss";

interface MarketEstimate {
    current: number;
    lower: number;
    upper: number;
    range: number;
}

interface PredictionInputProps {
    sliderValue: number;
    marketEstimate: MarketEstimate;
    hasUserModifiedSlider: boolean;
    onSliderChange: (value: number) => void;
    onReset: () => void;
    preferSpeedometer?: boolean;
}

const STORAGE_KEY = 'scalar-market-preferred-view';

export const PredictionInput: FC<PredictionInputProps> = ({
    sliderValue,
    marketEstimate,
    hasUserModifiedSlider,
    onSliderChange,
    onReset,
    preferSpeedometer = false
}) => {
    // Initialize from localStorage or fallback to prop/default
    const [viewMode, setViewMode] = useState<'slider' | 'speedometer'>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored === 'slider' || stored === 'speedometer') {
                return stored;
            }
        } catch (error) {
            console.warn('Failed to read from localStorage:', error);
        }
        return preferSpeedometer ? 'speedometer' : 'slider';
    });
    
    // Save preference to localStorage when it changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, viewMode);
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    }, [viewMode]);
    
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && val >= marketEstimate.lower && val <= marketEstimate.upper) {
            onSliderChange(val);
        }
    }, [marketEstimate.lower, marketEstimate.upper, onSliderChange]);
    
    return (
        <div className="prediction-input">
            <div className="input-header">
                <span className="input-label"><Trans>Your Prediction</Trans></span>
                <div className="header-controls">
                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'slider' ? 'active' : ''}`}
                            onClick={() => setViewMode('slider')}
                            title="Slider view"
                            aria-label="Switch to slider view"
                            aria-pressed={viewMode === 'slider'}
                        >
                            <Sliders size={14} />
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'speedometer' ? 'active' : ''}`}
                            onClick={() => setViewMode('speedometer')}
                            title="Speedometer view"
                            aria-label="Switch to speedometer view"
                            aria-pressed={viewMode === 'speedometer'}
                        >
                            <Activity size={14} />
                        </button>
                    </div>
                    <div className="value-display">
                        <input
                            type="number"
                            className="value-input"
                            value={sliderValue.toFixed(2)}
                            onChange={handleInputChange}
                            min={marketEstimate.lower}
                            max={marketEstimate.upper}
                            step={0.01}
                        />
                        {hasUserModifiedSlider && Math.abs(sliderValue - marketEstimate.current) > 0.01 && (
                            <button 
                                className="reset-btn"
                                onClick={onReset}
                                title="Reset to current market estimate"
                            >
                                <Trans>Reset</Trans>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="input-content">
                {viewMode === 'slider' ? (
                    <div className="slider-view">
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
                ) : (
                    <div className="speedometer-view">
                        <SpeedometerPicker
                            value={sliderValue}
                            min={marketEstimate.lower}
                            max={marketEstimate.upper}
                            currentMarketEstimate={marketEstimate.current}
                            onChange={onSliderChange}
                            precision={2}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};