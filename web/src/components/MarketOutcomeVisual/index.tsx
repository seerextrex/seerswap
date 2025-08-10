import React, { useMemo, useState } from 'react';
import { Market, Pool } from '../../utils/market';
import { calculateOutcomeProbabilities, formatProbability } from '../../utils/marketPrices';
import { OUTCOME_COLORS, OUTCOME_GRADIENTS } from '../../constants/outcomeColors';
import './styles.scss';

interface MarketOutcomeVisualProps {
  market: Market;
  pools: Pool[];
  displayType?: 'bar' | 'pie';
}

export const MarketOutcomeVisual: React.FC<MarketOutcomeVisualProps> = ({ 
  market, 
  pools,
  displayType = 'bar' 
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const probabilities = useMemo(() => {
    return calculateOutcomeProbabilities(pools, market);
  }, [pools, market]);
  
  // Sort and filter outcomes by probability for better visual hierarchy
  const sortedOutcomes = useMemo(() => {
    if (!probabilities || !market?.outcomes) {
      return [];
    }
    return market.outcomes.map((outcome, index) => ({
      outcome,
      index,
      probability: probabilities[index] || 0,
      color: OUTCOME_COLORS[index % OUTCOME_COLORS.length],
      gradient: OUTCOME_GRADIENTS[index % OUTCOME_GRADIENTS.length]
    }))
    .filter(({ outcome, probability }) => {
      // Filter out "Invalid result" if it has very low or no probability
      const isInvalidResult = outcome.toLowerCase().includes('invalid');
      if (isInvalidResult && probability < 1) {
        return false;
      }
      return true;
    })
    .sort((a, b) => b.probability - a.probability);
  }, [market?.outcomes, probabilities]);

  if (!probabilities || !market?.outcomes || sortedOutcomes.length === 0) {
    return null;
  }


  if (displayType === 'bar') {
    return (
      <div className="market-outcome-visual enhanced-bar">
        <div className="visualization-header">
          <h4 className="viz-title">Outcome Probabilities</h4>
          <div className="viz-subtitle">Based on current market prices</div>
        </div>
        
        <div className="outcome-bar-container">
          <div className="outcome-bar">
            {sortedOutcomes.map(({ outcome, index, probability, color, gradient }) => {
              const isHovered = hoveredIndex === index;
              const isSmall = probability < 15;
              
              return (
                <div
                  key={index}
                  className={`outcome-segment ${isHovered ? 'hovered' : ''} ${isSmall ? 'small-segment' : ''}`}
                  style={{
                    width: `${probability}%`,
                    background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
                    zIndex: isHovered ? 10 : 1,
                    transform: isHovered ? 'scaleY(1.1)' : 'scaleY(1)',
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {!isSmall && (
                    <div className="outcome-content">
                      <span className="outcome-percentage">
                        {formatProbability(probability)}
                      </span>
                      {probability > 25 && (
                        <span className="outcome-name">{outcome}</span>
                      )}
                    </div>
                  )}
                  
                  {isHovered && (
                    <div className="outcome-tooltip">
                      <div className="tooltip-content">
                        <strong>{outcome}</strong>
                        <span>{formatProbability(probability)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="percentage-scale">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="outcome-legend">
          {sortedOutcomes.map(({ outcome, index, probability, color, gradient }) => {
            const isHovered = hoveredIndex === index;
            
            return (
              <div 
                key={index} 
                className={`legend-item ${isHovered ? 'highlighted' : ''}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span 
                  className="legend-color" 
                  style={{ 
                    background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
                    transform: isHovered ? 'scale(1.2)' : 'scale(1)'
                  }}
                />
                <span className="legend-label">{outcome}</span>
                <div className="legend-probability">
                  <span className="legend-value">{formatProbability(probability)}</span>
                  <div className="probability-bar" style={{ 
                    width: `${probability}%`,
                    background: `linear-gradient(90deg, ${gradient[0]}40 0%, ${gradient[1]}20 100%)`
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Pie chart visualization
  const createPieSlice = (startAngle: number, endAngle: number, color: string) => {
    const centerX = 50;
    const centerY = 50;
    const radius = 40;

    const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  let currentAngle = -90; // Start at top

  return (
    <div className="market-outcome-visual pie-chart">
      <svg viewBox="0 0 100 100" className="pie-svg">
        {market.outcomes.map((outcome, index) => {
          const probability = probabilities[index] || 0;
          const angle = (probability / 100) * 360;
          const color = OUTCOME_COLORS[index % OUTCOME_COLORS.length];
          
          const path = createPieSlice(currentAngle, currentAngle + angle, color);
          currentAngle += angle;

          return (
            <path
              key={index}
              d={path}
              fill={color}
              stroke="#fff"
              strokeWidth="0.5"
            >
              <title>{`${outcome}: ${formatProbability(probability)}`}</title>
            </path>
          );
        })}
      </svg>
      <div className="outcome-legend">
        {market.outcomes.map((outcome, index) => {
          const probability = probabilities[index] || 0;
          const color = OUTCOME_COLORS[index % OUTCOME_COLORS.length];
          
          return (
            <div key={index} className="legend-item">
              <span 
                className="legend-color" 
                style={{ backgroundColor: color }}
              />
              <span className="legend-label">{outcome}</span>
              <span className="legend-value">{formatProbability(probability)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};