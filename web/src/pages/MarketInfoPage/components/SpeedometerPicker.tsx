import React, { FC, useCallback, useRef, useEffect, useState } from "react";
import { Trans } from "@lingui/macro";
import "./SpeedometerPicker.scss";

interface SpeedometerPickerProps {
    value: number;
    min: number;
    max: number;
    currentMarketEstimate: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    label?: string;
    precision?: number;
}

export const SpeedometerPicker: FC<SpeedometerPickerProps> = ({
    value,
    min,
    max,
    currentMarketEstimate,
    onChange,
    disabled = false,
    label = "Your Prediction",
    precision = 2
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);
    const centerX = 200;
    const centerY = 200;
    const radius = 140;
    const startAngle = -225; // Start at bottom left
    const endAngle = 45; // End at bottom right
    const angleRange = endAngle - startAngle;
    
    // Calculate angle for a given value
    const valueToAngle = useCallback((val: number) => {
        const normalized = (val - min) / (max - min);
        return startAngle + (normalized * angleRange);
    }, [min, max, startAngle, angleRange]);
    
    // Calculate value for a given angle
    const angleToValue = useCallback((angle: number) => {
        const normalized = (angle - startAngle) / angleRange;
        return min + (normalized * (max - min));
    }, [min, max, startAngle, angleRange]);
    
    // Get current angles
    const currentAngle = valueToAngle(value);
    const marketAngle = valueToAngle(currentMarketEstimate);
    
    // Handle mouse/touch events
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        if (disabled) return;
        setIsDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
    }, [disabled]);
    
    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!isDragging || disabled || !svgRef.current) return;
        
        const rect = svgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - centerX;
        const y = e.clientY - rect.top - centerY;
        
        let angle = Math.atan2(y, x) * (180 / Math.PI);
        
        // Normalize angle to our range
        if (angle < -180) angle += 360;
        if (angle > 180) angle -= 360;
        
        // Clamp to our speedometer range
        if (angle < startAngle) angle = startAngle;
        if (angle > endAngle) angle = endAngle;
        
        const newValue = angleToValue(angle);
        onChange(Number(newValue.toFixed(precision)));
    }, [isDragging, disabled, centerX, centerY, startAngle, endAngle, angleToValue, onChange, precision]);
    
    const handlePointerUp = useCallback(() => {
        setIsDragging(false);
    }, []);
    
    // Create tick marks
    const ticks = [];
    const majorTickCount = 5;
    const minorTickCount = 20;
    
    // Major ticks with labels
    for (let i = 0; i <= majorTickCount; i++) {
        const tickValue = min + (i * (max - min) / majorTickCount);
        const angle = valueToAngle(tickValue);
        const angleRad = (angle * Math.PI) / 180;
        
        const innerRadius = radius - 15;
        const outerRadius = radius;
        const labelRadius = radius + 25;
        
        const x1 = centerX + innerRadius * Math.cos(angleRad);
        const y1 = centerY + innerRadius * Math.sin(angleRad);
        const x2 = centerX + outerRadius * Math.cos(angleRad);
        const y2 = centerY + outerRadius * Math.sin(angleRad);
        const labelX = centerX + labelRadius * Math.cos(angleRad);
        const labelY = centerY + labelRadius * Math.sin(angleRad);
        
        ticks.push(
            <g key={`major-${i}`}>
                <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="2"
                />
                <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="tick-label"
                    fill="rgba(255, 255, 255, 0.6)"
                    fontSize="12"
                    fontWeight="600"
                >
                    {tickValue.toFixed(0)}
                </text>
            </g>
        );
    }
    
    // Minor ticks
    for (let i = 0; i <= minorTickCount; i++) {
        if (i % (minorTickCount / majorTickCount) === 0) continue; // Skip major tick positions
        
        const tickValue = min + (i * (max - min) / minorTickCount);
        const angle = valueToAngle(tickValue);
        const angleRad = (angle * Math.PI) / 180;
        
        const innerRadius = radius - 8;
        const outerRadius = radius;
        
        const x1 = centerX + innerRadius * Math.cos(angleRad);
        const y1 = centerY + innerRadius * Math.sin(angleRad);
        const x2 = centerX + outerRadius * Math.cos(angleRad);
        const y2 = centerY + outerRadius * Math.sin(angleRad);
        
        ticks.push(
            <line
                key={`minor-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
            />
        );
    }
    
    // Create gradient arc sections
    const createArcPath = (startVal: number, endVal: number) => {
        const startA = valueToAngle(startVal);
        const endA = valueToAngle(endVal);
        const startRad = (startA * Math.PI) / 180;
        const endRad = (endA * Math.PI) / 180;
        
        const innerR = radius - 30;
        const outerR = radius;
        
        const x1 = centerX + outerR * Math.cos(startRad);
        const y1 = centerY + outerR * Math.sin(startRad);
        const x2 = centerX + outerR * Math.cos(endRad);
        const y2 = centerY + outerR * Math.sin(endRad);
        const x3 = centerX + innerR * Math.cos(endRad);
        const y3 = centerY + innerR * Math.sin(endRad);
        const x4 = centerX + innerR * Math.cos(startRad);
        const y4 = centerY + innerR * Math.sin(startRad);
        
        const largeArc = Math.abs(endA - startA) > 180 ? 1 : 0;
        
        return `
            M ${x1} ${y1}
            A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}
            L ${x3} ${y3}
            A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}
            Z
        `;
    };
    
    // Needle calculations
    const needleAngleRad = (currentAngle * Math.PI) / 180;
    const needleLength = radius - 35;
    const needleX = centerX + needleLength * Math.cos(needleAngleRad);
    const needleY = centerY + needleLength * Math.sin(needleAngleRad);
    
    // Market estimate marker
    const marketAngleRad = (marketAngle * Math.PI) / 180;
    const marketInnerRadius = radius - 40;
    const marketOuterRadius = radius + 10;
    const marketX1 = centerX + marketInnerRadius * Math.cos(marketAngleRad);
    const marketY1 = centerY + marketInnerRadius * Math.sin(marketAngleRad);
    const marketX2 = centerX + marketOuterRadius * Math.cos(marketAngleRad);
    const marketY2 = centerY + marketOuterRadius * Math.sin(marketAngleRad);
    
    return (
        <div 
            className={`speedometer-picker ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
            role="group"
            aria-labelledby="speedometer-label"
        >
            <div className="speedometer-label" id="speedometer-label">{label}</div>
            
            <svg
                ref={svgRef}
                width="400"
                height="320"
                viewBox="0 0 400 320"
                className="speedometer-svg"
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
                aria-label={`${label}: ${value.toFixed(precision)}`}
                aria-disabled={disabled}
                tabIndex={disabled ? -1 : 0}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onKeyDown={(e) => {
                    if (disabled) return;
                    const step = (max - min) / 100;
                    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                        onChange(Math.min(max, value + step));
                    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                        onChange(Math.max(min, value - step));
                    } else if (e.key === 'Home') {
                        onChange(min);
                    } else if (e.key === 'End') {
                        onChange(max);
                    }
                }}
            >
                {/* Background gradient definitions */}
                <defs>
                    <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
                    </linearGradient>
                    
                    <linearGradient id="activeArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                    </linearGradient>
                    
                    <radialGradient id="needleGradient">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#e0e0e0" />
                    </radialGradient>
                    
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    
                    <filter id="needleShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                    </filter>
                </defs>
                
                {/* Background arc */}
                <path
                    d={createArcPath(min, max)}
                    fill="url(#arcGradient)"
                    opacity="0.3"
                />
                
                {/* Active arc (up to current value) */}
                <path
                    d={createArcPath(min, value)}
                    fill="url(#activeArcGradient)"
                    className="active-arc"
                />
                
                {/* Tick marks */}
                {ticks}
                
                {/* Market estimate marker */}
                <g className="market-marker">
                    <line
                        x1={marketX1}
                        y1={marketY1}
                        x2={marketX2}
                        y2={marketY2}
                        stroke="rgba(124, 58, 237, 0.8)"
                        strokeWidth="3"
                        strokeDasharray="5,3"
                        className="market-line"
                    />
                    <circle
                        cx={marketX2}
                        cy={marketY2}
                        r="8"
                        fill="rgba(124, 58, 237, 0.2)"
                        stroke="rgba(124, 58, 237, 0.8)"
                        strokeWidth="2"
                    />
                    <text
                        x={marketX2}
                        y={marketY2 - 15}
                        textAnchor="middle"
                        className="market-label"
                        fill="rgba(124, 58, 237, 0.9)"
                        fontSize="10"
                        fontWeight="700"
                    >
                        MARKET
                    </text>
                </g>
                
                {/* Needle */}
                <g className={`needle-group ${isHovering ? 'hovering' : ''}`}>
                    <line
                        x1={centerX}
                        y1={centerY}
                        x2={needleX}
                        y2={needleY}
                        stroke="url(#needleGradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        filter="url(#needleShadow)"
                        className="needle"
                    />
                    
                    {/* Center cap */}
                    <circle
                        cx={centerX}
                        cy={centerY}
                        r="12"
                        fill="url(#needleGradient)"
                        filter="url(#needleShadow)"
                    />
                    <circle
                        cx={centerX}
                        cy={centerY}
                        r="8"
                        fill="rgba(124, 58, 237, 0.8)"
                    />
                </g>
                
                {/* Interactive area (invisible) for better touch targets */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={radius + 30}
                    fill="transparent"
                    className="interaction-area"
                    style={{ cursor: disabled ? 'default' : 'pointer' }}
                />
            </svg>
            
            {/* Digital display */}
            <div className="speedometer-display">
                <div className="display-value">
                    {value.toFixed(precision)}
                </div>
                <div className="display-info">
                    <span className="info-item">
                        <span className="info-label">Market:</span>
                        <span className="info-value">{currentMarketEstimate.toFixed(precision)}</span>
                    </span>
                    <span className="info-divider">|</span>
                    <span className="info-item">
                        <span className="info-label">Diff:</span>
                        <span className={`info-value ${value > currentMarketEstimate ? 'positive' : 'negative'}`}>
                            {value > currentMarketEstimate ? '+' : ''}{(value - currentMarketEstimate).toFixed(precision)}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
};