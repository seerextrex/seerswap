import React, { useMemo } from 'react';
import { Market, Pool } from '../../utils/market';
import { calculateOutcomeProbabilities, formatProbability } from '../../utils/marketPrices';
import { OUTCOME_COLORS } from '../../constants/outcomeColors';
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
  const probabilities = useMemo(() => {
    return calculateOutcomeProbabilities(pools, market);
  }, [pools, market]);

  if (!probabilities || !market?.outcomes) {
    return null;
  }


  if (displayType === 'bar') {
    return (
      <div className="market-outcome-visual">
        <div className="outcome-bar">
          {market.outcomes.map((outcome, index) => {
            const probability = probabilities[index] || 0;
            const color = OUTCOME_COLORS[index % OUTCOME_COLORS.length];
            
            return (
              <div
                key={index}
                className="outcome-segment"
                style={{
                  width: `${probability}%`,
                  backgroundColor: color,
                }}
                title={`${outcome}: ${formatProbability(probability)}`}
              >
                {probability > 10 && (
                  <span className="outcome-label">
                    {formatProbability(probability)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
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