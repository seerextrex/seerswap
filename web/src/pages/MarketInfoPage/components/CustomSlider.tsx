import React, { FC } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./CustomSlider.scss";

interface CustomSliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    currentMarketEstimate: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    hasUserModified?: boolean;
}

export const CustomSlider: FC<CustomSliderProps> = ({
    value,
    min,
    max,
    step = 0.1,
    currentMarketEstimate,
    onChange,
    disabled = false,
    hasUserModified = false,
}) => {
    // Calculate position percentage for market marker
    const marketMarkerPosition = ((currentMarketEstimate - min) / (max - min)) * 100;
    
    // Determine if we're above or below market
    const isAboveMarket = value > currentMarketEstimate;
    const isBelowMarket = value < currentMarketEstimate;
    
    const handleChange = (newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            onChange(newValue);
        }
    };
    
    return (
        <div className="custom-slider-container">
            <div className="slider-wrapper">
                <Slider
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    className={`custom-slider ${isAboveMarket ? 'above-market' : ''} ${isBelowMarket ? 'below-market' : ''}`}
                    railStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        height: 8,
                        borderRadius: 4,
                    }}
                    trackStyle={{
                        backgroundColor: isAboveMarket 
                            ? '#10b981' // Green for UP
                            : isBelowMarket 
                                ? '#ef4444' // Red for DOWN
                                : '#8b5cf6', // Purple for neutral
                        height: 8,
                        borderRadius: 4,
                        transition: 'background-color 0.3s ease',
                    }}
                    handleStyle={{
                        width: 24,
                        height: 24,
                        border: '3px solid #1a1b3a',
                        backgroundColor: hasUserModified 
                            ? (isAboveMarket ? '#10b981' : isBelowMarket ? '#ef4444' : '#8b5cf6')
                            : '#8b5cf6',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        marginTop: -8,
                        cursor: 'grab',
                        transition: 'all 0.2s ease',
                    }}
                    activeDotStyle={{
                        display: 'none',
                    }}
                />
                
                {/* Market estimate marker */}
                <div 
                    className="market-marker"
                    style={{
                        left: `${marketMarkerPosition}%`,
                    }}
                >
                    <div className="marker-line" />
                    <div className="marker-label">
                        <span className="label-text">Market</span>
                        <span className="label-value">{currentMarketEstimate.toFixed(1)}</span>
                    </div>
                </div>
                
                {/* Visual indicators for trade direction */}
                {hasUserModified && isAboveMarket && (
                    <div className="direction-indicator up">
                        <span className="arrow">↑</span>
                        <span className="text">Buying UP</span>
                    </div>
                )}
                
                {hasUserModified && isBelowMarket && (
                    <div className="direction-indicator down">
                        <span className="arrow">↓</span>
                        <span className="text">Buying DOWN</span>
                    </div>
                )}
            </div>
            
            {/* Range labels */}
            <div className="slider-labels">
                <span className="label-min">{min}</span>
                <span className="label-max">{max}</span>
            </div>
        </div>
    );
};