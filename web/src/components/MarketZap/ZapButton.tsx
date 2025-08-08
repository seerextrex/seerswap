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
  // Check if market is resolved
  const currentTime = Math.floor(Date.now() / 1000);
  const isResolved = !!(market.finalizeTs && 
                       Number(market.finalizeTs) < currentTime && 
                       Number(market.finalizeTs) !== 33260976000); // 33260976000 is a special value for pending markets
  
  const buttonDisabled = disabled || isResolved;
  const title = isResolved ? 'Market is resolved' : 'Add liquidity to all outcome pools';

  return (
    <button
      className="zap-button"
      onClick={onClick}
      disabled={buttonDisabled}
      title={title}
    >
      <Zap size={16} />
      <span><Trans>Zap</Trans></span>
    </button>
  );
};