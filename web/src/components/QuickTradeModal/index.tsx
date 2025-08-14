import React, { useState, useMemo, useCallback } from 'react';
import { Trans } from '@lingui/macro';
import Modal from '../Modal';
import { X } from 'react-feather';
import { Token, Market, Pool, getPoolTokensForMarket } from '../../utils/market';
import { formatDollarAmount } from '../../utils/numbers';
import './index.scss';

interface QuickTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: Market;
  pools: Pool[];
  selectedOutcome?: string;
}

export const QuickTradeModal: React.FC<QuickTradeModalProps> = ({
  isOpen,
  onClose,
  market,
  pools,
  selectedOutcome
}) => {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [selectedOutcomeIndex, setSelectedOutcomeIndex] = useState(0);
  const [amount, setAmount] = useState('');

  // Get available outcomes (excluding Invalid)
  const availableOutcomes = useMemo(() => {
    if (!market?.outcomes) return [];
    return market.outcomes.filter(o => !o.toLowerCase().includes('invalid'));
  }, [market?.outcomes]);

  // Set initial selected outcome based on prop
  React.useEffect(() => {
    if (selectedOutcome && availableOutcomes.length > 0) {
      const index = availableOutcomes.findIndex(o => o === selectedOutcome);
      if (index >= 0) setSelectedOutcomeIndex(index);
    }
  }, [selectedOutcome, availableOutcomes]);

  const handleTrade = useCallback(() => {
    // This would integrate with your trading logic
    // For now, we'll navigate to the add liquidity page as a placeholder
    const firstPool = pools[0];
    if (firstPool) {
      const tokenInfo = getPoolTokensForMarket(firstPool, market);
      if (tokenInfo) {
        window.location.href = `#/add/${tokenInfo.outcomeToken.id}/${tokenInfo.collateralToken.id}`;
      }
    }
    onClose();
  }, [pools, market, onClose]);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  }, []);

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} maxHeight={90}>
      <div className="quick-trade-modal">
        <div className="modal-header">
          <h2 className="modal-title">Quick Trade</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          {/* Market Title */}
          <div className="market-info">
            <h3 className="market-name">{market.marketName}</h3>
          </div>

          {/* Trade Type Toggle */}
          <div className="trade-type-toggle">
            <button
              className={`toggle-btn ${tradeType === 'buy' ? 'active' : ''}`}
              onClick={() => setTradeType('buy')}
            >
              Buy
            </button>
            <button
              className={`toggle-btn ${tradeType === 'sell' ? 'active' : ''}`}
              onClick={() => setTradeType('sell')}
            >
              Sell
            </button>
          </div>

          {/* Outcome Selection */}
          <div className="outcome-selection">
            <label className="input-label">
              <Trans>Select Outcome</Trans>
            </label>
            <div className="outcome-buttons">
              {availableOutcomes.map((outcome, index) => (
                <button
                  key={index}
                  className={`outcome-btn ${selectedOutcomeIndex === index ? 'selected' : ''}`}
                  onClick={() => setSelectedOutcomeIndex(index)}
                >
                  {outcome}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="amount-input">
            <label className="input-label">
              <Trans>Amount (USDC)</Trans>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="amount-field"
              />
              <div className="quick-amounts">
                <button onClick={() => setAmount('10')} className="quick-amount">$10</button>
                <button onClick={() => setAmount('50')} className="quick-amount">$50</button>
                <button onClick={() => setAmount('100')} className="quick-amount">$100</button>
                <button onClick={() => setAmount('500')} className="quick-amount">$500</button>
              </div>
            </div>
          </div>

          {/* Estimated Outcome */}
          <div className="trade-summary">
            <div className="summary-row">
              <span className="summary-label">
                <Trans>You {tradeType}</Trans>
              </span>
              <span className="summary-value">
                {amount || '0'} USDC
              </span>
            </div>
            <div className="summary-row">
              <span className="summary-label">
                <Trans>You receive (est.)</Trans>
              </span>
              <span className="summary-value">
                {amount ? (parseFloat(amount) * 0.98).toFixed(2) : '0'} {availableOutcomes[selectedOutcomeIndex]}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose}>
              <Trans>Cancel</Trans>
            </button>
            <button 
              className="trade-btn"
              onClick={handleTrade}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              <Trans>{tradeType === 'buy' ? 'Buy' : 'Sell'} {availableOutcomes[selectedOutcomeIndex]}</Trans>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuickTradeModal;