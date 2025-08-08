import React from 'react';
import { Trans } from '@lingui/macro';
import { Zap } from 'react-feather';
import { Market } from '../../utils/market';
import './ZapButton.scss';

interface ZapButtonProps {
  market: Market;
  onClick: () => void;
  disabled?: boolean;
}

export const ZapButton: React.FC<ZapButtonProps> = ({ market, onClick, disabled = false }) => {
  return (
    <button
      className="zap-button"
      onClick={onClick}
      disabled={disabled}
      title="Add liquidity to all outcome pools"
    >
      <Zap size={16} />
      <span><Trans>Zap</Trans></span>
    </button>
  );
};