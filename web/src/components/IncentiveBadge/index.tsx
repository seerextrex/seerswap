import React from 'react';
import { Zap, TrendingUp, Star } from 'react-feather';
import './index.scss';

interface IncentiveBadgeProps {
    apr?: number;
    dailyRewards?: number;
    tvl?: number;
    isHighApr?: boolean;
    isHighRewards?: boolean;
    isNewFarm?: boolean;
}

export const IncentiveBadge: React.FC<IncentiveBadgeProps> = ({
    apr,
    dailyRewards,
    tvl,
    isHighApr = false,
    isHighRewards = false,
    isNewFarm = false
}) => {
    // Determine incentive level
    const getIncentiveLevel = () => {
        if ((apr && apr > 100) || (dailyRewards && dailyRewards > 10000)) {
            return 'high';
        }
        if ((apr && apr > 50) || (dailyRewards && dailyRewards > 5000)) {
            return 'medium';
        }
        if ((apr && apr > 20) || (dailyRewards && dailyRewards > 1000)) {
            return 'low';
        }
        return null;
    };

    const incentiveLevel = getIncentiveLevel();

    if (!incentiveLevel && !isNewFarm) return null;

    return (
        <div className={`incentive-badge incentive-badge--${incentiveLevel || 'new'}`}>
            {incentiveLevel === 'high' && (
                <>
                    <Zap size={14} />
                    <span>High Rewards</span>
                </>
            )}
            {incentiveLevel === 'medium' && (
                <>
                    <TrendingUp size={14} />
                    <span>Good APR</span>
                </>
            )}
            {incentiveLevel === 'low' && (
                <>
                    <Star size={14} />
                    <span>Incentivized</span>
                </>
            )}
            {isNewFarm && (
                <>
                    <Star size={14} />
                    <span>New</span>
                </>
            )}
        </div>
    );
};

export const BoostIndicator: React.FC<{ multiplier: number }> = ({ multiplier }) => {
    if (multiplier <= 1) return null;

    return (
        <div className="boost-indicator">
            <Zap size={12} />
            <span>{multiplier}x Boost</span>
        </div>
    );
};