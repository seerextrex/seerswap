import React, { memo } from 'react';
import { Trans } from '@lingui/macro';
import { Plus, TrendingUp, DollarSign, Zap } from 'react-feather';
import { formatDollarAmount } from '../../utils/numbers';

interface FarmCardProps {
    farm: any;
    onClick: () => void;
}

export const FarmCard = memo(({ farm, onClick }: FarmCardProps) => {
    const isHighReward = (farm.apr && farm.apr > 50) || (farm.dailyRewardRate && farm.dailyRewardRate > 5000);
    
    // Extract token symbols
    const token0Symbol = farm.pool?.token0?.symbol || 'TOKEN';
    const token1Symbol = farm.pool?.token1?.symbol || 'TOKEN';
    
    return (
        <div className={`eternal-page__farm-card ${isHighReward ? 'eternal-page__farm-card--high-reward' : ''}`}>
            <div className="eternal-page__farm-header">
                <div className="eternal-page__farm-tokens">
                    <div className="eternal-page__token-pair">
                        <div className="token-icon">
                            {token0Symbol.substring(0, 2)}
                        </div>
                        <div className="token-icon">
                            {token1Symbol.substring(0, 2)}
                        </div>
                    </div>
                    <div className="eternal-page__farm-name">
                        <h3>{token0Symbol}/{token1Symbol}</h3>
                        <span>Concentrated Liquidity</span>
                    </div>
                </div>
                {isHighReward && (
                    <div className="eternal-page__farm-badge">
                        <Zap size={12} />
                        High Rewards
                    </div>
                )}
            </div>

            <div className="eternal-page__farm-stats">
                <div className="eternal-page__farm-stat">
                    <label><Trans>APR</Trans></label>
                    <div className="value apr">
                        {farm.apr ? `${Math.round(farm.apr)}%` : '—'}
                    </div>
                    {farm.apr && farm.apr > 100 && (
                        <div className="sub-value">
                            <TrendingUp size={12} /> Triple digits!
                        </div>
                    )}
                </div>

                <div className="eternal-page__farm-stat">
                    <label><Trans>TVL</Trans></label>
                    <div className="value tvl">
                        {farm.pool?.totalValueLockedUSD 
                            ? formatDollarAmount(parseFloat(farm.pool.totalValueLockedUSD))
                            : '—'}
                    </div>
                    {farm.totalAmountUSDEstimated && (
                        <div className="sub-value">
                            Active: {formatDollarAmount(parseFloat(farm.totalAmountUSDEstimated))}
                        </div>
                    )}
                </div>

                <div className="eternal-page__farm-stat">
                    <label><Trans>Daily Rewards</Trans></label>
                    <div className="value rewards">
                        {farm.dailyRewardRate 
                            ? `${farm.dailyRewardRate.toLocaleString()} SEER`
                            : '—'}
                    </div>
                </div>

                <div className="eternal-page__farm-stat">
                    <label><Trans>Remaining</Trans></label>
                    <div className="value">
                        {farm.rewardReserve 
                            ? `${Math.round(farm.rewardReserve / 1000)}k SEER`
                            : '—'}
                    </div>
                </div>
            </div>

            <div className="eternal-page__farm-action">
                <button className="eternal-page__add-liquidity-btn" onClick={onClick}>
                    <Plus size={20} />
                    <Trans>Add Liquidity</Trans>
                </button>
            </div>

            <div className="eternal-page__quick-stats">
                <span>Fee Tier: <strong>{farm.pool?.fee ? `${farm.pool.fee / 10000}%` : 'N/A'}</strong></span>
                <span>In Range: <strong>{farm.pool?.liquidity > 0 ? 'Yes' : 'No'}</strong></span>
            </div>
        </div>
    );
});