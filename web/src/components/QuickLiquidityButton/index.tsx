import React, { useState } from 'react';
import { Plus, DollarSign, Info } from 'react-feather';
import { Trans } from '@lingui/macro';
import './index.scss';

interface QuickLiquidityButtonProps {
    poolId: string;
    token0Symbol?: string;
    token1Symbol?: string;
    apr?: number;
    tvl?: number;
    onClick: () => void;
}

export const QuickLiquidityButton: React.FC<QuickLiquidityButtonProps> = ({
    poolId,
    token0Symbol,
    token1Symbol,
    apr,
    tvl,
    onClick
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="quick-liquidity-wrapper">
            <button
                className="quick-liquidity-button"
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="quick-liquidity-button__icon">
                    <Plus size={20} />
                </div>
                <div className="quick-liquidity-button__content">
                    <span className="quick-liquidity-button__label">
                        <Trans>Add Liquidity</Trans>
                    </span>
                    {isHovered && (
                        <span className="quick-liquidity-button__sublabel">
                            One-click liquidity
                        </span>
                    )}
                </div>
            </button>

            {isHovered && (
                <div className="quick-liquidity-tooltip">
                    <div className="quick-liquidity-tooltip__header">
                        <Info size={14} />
                        <span>Quick Add Liquidity</span>
                    </div>
                    <div className="quick-liquidity-tooltip__content">
                        <p>Add liquidity to {token0Symbol}/{token1Symbol} pool in one transaction</p>
                        {apr && (
                            <div className="quick-liquidity-tooltip__stat">
                                <span>Current APR:</span>
                                <span className="value">{apr}%</span>
                            </div>
                        )}
                        {tvl && (
                            <div className="quick-liquidity-tooltip__stat">
                                <span>Pool TVL:</span>
                                <span className="value">${tvl.toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const FloatingLiquidityButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <button
            className={`floating-liquidity-button ${isExpanded ? 'expanded' : ''}`}
            onClick={onClick}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <Plus size={24} />
            {isExpanded && (
                <span className="floating-liquidity-button__text">
                    <Trans>Add Liquidity</Trans>
                </span>
            )}
        </button>
    );
};