import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Trans } from '@lingui/macro';
import Modal from '../Modal';
import { X, ArrowDown, AlertCircle, CheckCircle, Info } from 'react-feather';
import { Currency, CurrencyAmount, TradeType, Percent } from '@uniswap/sdk-core';
import { useAccount, useChainId } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import { ButtonError, ButtonPrimary, ButtonLight } from '../Button';
import NewCurrencyInputPanel from '../CurrencyInputPanel/NewCurrencyInputPanel';
import { AutoColumn } from '../Column';
import { ArrowWrapper } from '../swap/styled';
import { Field } from '../../state/swap/actions';
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from '../../state/swap/hooks';
import { V3TradeState } from '../../hooks/useBestV3Trade';
import { useSwapCallback } from '../../hooks/useSwapCallback';
import { useBatchSwapCallback } from '../../hooks/useBatchSwapCallback';
import { useExpertModeManager } from '../../state/user/hooks';
import { Trade as V3Trade } from 'lib/src';
import { useMarketCurrency } from '../../hooks/useMarketCurrency';
import { usePredictionMarketUSDCValue } from '../../hooks/usePredictionMarketUSDCValue';
import { Token, Market, Pool, getPoolTokensForMarket } from '../../utils/market';
import { formatDollarAmount } from '../../utils/numbers';
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback';
import Loader from '../Loader';
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
  const { address: account, isConnected } = useAccount();
  const chainId = useChainId();
  const [isSwapping, setIsSwapping] = useState(false);
  const [isExpertMode] = useExpertModeManager();
  
  // Get available outcomes (excluding Invalid)
  const availableOutcomes = useMemo(() => {
    if (!market?.outcomes) return [];
    return market.outcomes.filter(o => !o.toLowerCase().includes('invalid'));
  }, [market?.outcomes]);

  // Determine selected outcome index
  const [selectedOutcomeIndex, setSelectedOutcomeIndex] = useState(() => {
    if (selectedOutcome && availableOutcomes.length > 0) {
      const index = availableOutcomes.findIndex(o => o === selectedOutcome);
      return index >= 0 ? index : 0;
    }
    return 0;
  });

  // Get wrapped tokens for the market (using wrappedTokensString for correct ordering)
  const wrappedTokens = useMemo(() => {
    let allTokens: string[] = [];
    const tokensString = market?.wrappedTokensString;
    
    if (!tokensString) return [];
    
    if (Array.isArray(tokensString)) {
      allTokens = tokensString.map(s => s.trim().toLowerCase());
    } else if (typeof tokensString === 'string' && tokensString.includes(',')) {
      allTokens = tokensString.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
    } else {
      try {
        const parsed = JSON.parse(tokensString);
        if (Array.isArray(parsed)) {
          allTokens = parsed.map(s => s.trim().toLowerCase());
        }
      } catch (error) {
        if (typeof tokensString === 'string') {
          allTokens = [tokensString.trim().toLowerCase()];
        }
      }
    }
    
    return allTokens;
  }, [market?.wrappedTokensString]);

  // Get the outcome token address based on selection
  const outcomeTokenAddress = useMemo(() => {
    if (!wrappedTokens || wrappedTokens.length === 0 || !market?.outcomes) {
      return null;
    }
    
    const selectedOutcomeName = availableOutcomes[selectedOutcomeIndex];
    const fullOutcomeIndex = market.outcomes.findIndex(o => o === selectedOutcomeName);
    
    if (fullOutcomeIndex === -1 || fullOutcomeIndex >= wrappedTokens.length) {
      return null;
    }
    
    return wrappedTokens[fullOutcomeIndex];
  }, [wrappedTokens, selectedOutcomeIndex, availableOutcomes, market?.outcomes]);

  // Get collateral token address
  const collateralTokenAddress = market?.collateralToken?.id;

  // Use the custom hook to resolve currencies
  const outcomeCurrency = useMarketCurrency(
    outcomeTokenAddress,
    chainId,
    availableOutcomes[selectedOutcomeIndex] || `Outcome ${selectedOutcomeIndex}`,
    market?.wrappedTokens
  );
  
  const collateralCurrency = useMarketCurrency(
    collateralTokenAddress,
    chainId,
    market?.collateralToken?.symbol || 'USDC',
    market?.collateralToken ? [market.collateralToken] : undefined
  );

  // Swap state management
  const { independentField, typedValue, recipient } = useSwapState();
  const { onCurrencySelection, onUserInput, onSwitchTokens } = useSwapActionHandlers();
  
  const {
    v3TradeState: { state: v3TradeState },
    toggledTrade: trade,
    allowedSlippage,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo();

  // Track swap direction (false = buying outcome, true = selling outcome)
  const [isReversed, setIsReversed] = useState(false);
  
  // Track previous currencies to detect changes and prevent infinite loops
  const prevCurrenciesRef = useRef<{ input?: Currency; output?: Currency }>({});
  const prevOutcomeIndexRef = useRef<number | undefined>();

  // Helper function to get a unique identifier for a currency
  const getIdentifier = useCallback((currency: Currency) => {
    if (currency.isNative) return 'ETH';
    if (currency.isToken) return currency.address;
    // For native currencies (like ETH), we don't have an address
    return 'NATIVE';
  }, []);

  // Auto-select currencies when modal opens or outcome changes
  useEffect(() => {
    if (!outcomeCurrency || !collateralCurrency || !isOpen) return;
    
    const expectedInput = !isReversed ? collateralCurrency : outcomeCurrency;
    const expectedOutput = !isReversed ? outcomeCurrency : collateralCurrency;
    
    const inputChanged = !prevCurrenciesRef.current.input || 
                        getIdentifier(prevCurrenciesRef.current.input) !== getIdentifier(expectedInput);
    const outputChanged = !prevCurrenciesRef.current.output || 
                         getIdentifier(prevCurrenciesRef.current.output) !== getIdentifier(expectedOutput);
    const outcomeChanged = prevOutcomeIndexRef.current !== selectedOutcomeIndex;
    
    if (inputChanged || outputChanged) {
      onCurrencySelection(Field.INPUT, expectedInput);
      onCurrencySelection(Field.OUTPUT, expectedOutput);
      
      // Clear input only if outcome changed (not on initial load or direction change)
      if (outcomeChanged && prevOutcomeIndexRef.current !== undefined) {
        onUserInput(Field.INPUT, '');
      }
      
      // Update refs for next render
      prevCurrenciesRef.current = { input: expectedInput, output: expectedOutput };
    }
    
    prevOutcomeIndexRef.current = selectedOutcomeIndex;
  }, [outcomeCurrency, collateralCurrency, selectedOutcomeIndex, isReversed, isOpen, onCurrencySelection, onUserInput, getIdentifier]);

  // Get swap callback
  const v3Trade = trade && 'swaps' in trade ? trade as V3Trade<Currency, Currency, TradeType> : undefined;
  
  // Get approval state and callback
  const [approvalState, approveCallback] = useApproveCallbackFromTrade(v3Trade, allowedSlippage);
  const [approvalPending, setApprovalPending] = useState(false);
  
  // Use batched swap callback with EIP-7702 support
  const { 
    callback: batchSwapCallback, 
    error: swapCallbackError,
    supports7702 
  } = useBatchSwapCallback(
    v3Trade,
    allowedSlippage,
    recipient,
    undefined, // No signature data
    approvalState,
    trade?.inputAmount
  );

  // Calculate outcome price from pool data
  const outcomePrice = useMemo(() => {
    if (!pools || pools.length === 0 || !outcomeTokenAddress || !collateralTokenAddress) {
      return 0;
    }
    
    const relevantPool = pools.find(pool => {
      if (!pool.token0?.id || !pool.token1?.id) return false;
      
      const hasOutcomeToken = pool.token0.id.toLowerCase() === outcomeTokenAddress.toLowerCase() || 
                             pool.token1.id.toLowerCase() === outcomeTokenAddress.toLowerCase();
      const hasCollateral = pool.token0.id.toLowerCase() === collateralTokenAddress.toLowerCase() || 
                           pool.token1.id.toLowerCase() === collateralTokenAddress.toLowerCase();
      return hasOutcomeToken && hasCollateral;
    });
    
    if (!relevantPool) return 0;
    
    const isToken0Outcome = relevantPool.token0.id.toLowerCase() === outcomeTokenAddress.toLowerCase();
    
    let price = 0;
    if (isToken0Outcome) {
      price = relevantPool.token0Price ? parseFloat(relevantPool.token0Price) : 0;
    } else {
      price = relevantPool.token1Price ? parseFloat(relevantPool.token1Price) : 0;
    }
    
    if (price > 1 && price !== Infinity) {
      price = 1 / price;
    }
    
    return Math.max(0, Math.min(1, price));
  }, [pools, outcomeTokenAddress, collateralTokenAddress]);

  // Calculate parsed amounts for display
  const formattedAmounts = useMemo(() => ({
    [Field.INPUT]: independentField === Field.INPUT 
      ? typedValue 
      : trade?.inputAmount?.toSignificant(6) ?? '',
    [Field.OUTPUT]: independentField === Field.OUTPUT 
      ? typedValue 
      : v3TradeState === V3TradeState.NO_ROUTE_FOUND && independentField === Field.INPUT
        ? '--'
        : trade?.outputAmount?.toSignificant(6) ?? '',
  }), [independentField, typedValue, trade, v3TradeState]);

  // Calculate parsed amounts for fiat value
  const parsedAmounts = useMemo(
    () => ({
      [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
      [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
    }),
    [independentField, parsedAmount, trade]
  );

  // Calculate fiat values - need to determine which currency is collateral
  // When buying outcome: input is collateral (price=1), output is outcome (price=outcomePrice)
  // When selling outcome: input is outcome (price=outcomePrice), output is collateral (price=1)
  const inputIsCollateral = currencies[Field.INPUT] && collateralCurrency && 
    getIdentifier(currencies[Field.INPUT]) === getIdentifier(collateralCurrency);
  
  const fiatValueInput = usePredictionMarketUSDCValue(
    parsedAmounts[Field.INPUT],
    collateralCurrency,
    inputIsCollateral ? 1 : outcomePrice
  );
  
  const fiatValueOutput = usePredictionMarketUSDCValue(
    parsedAmounts[Field.OUTPUT],
    collateralCurrency,
    inputIsCollateral ? outcomePrice : 1
  );
  
  // Use the trade's built-in price impact calculation instead of fiat value comparison
  const priceImpact = trade?.priceImpact;

  // Handle input changes
  const handleTypeInput = useCallback((field: Field, value: string) => {
    onUserInput(field, value);
  }, [onUserInput]);

  // Handle max input
  const maxInputAmount = currencyBalances[Field.INPUT];
  const handleMaxInput = useCallback(() => {
    if (maxInputAmount) {
      onUserInput(Field.INPUT, maxInputAmount.toExact());
    }
  }, [maxInputAmount, onUserInput]);

  // Handle swap direction toggle
  const handleSwitchTokens = useCallback(() => {
    setIsReversed(prev => !prev);
    onSwitchTokens();
  }, [onSwitchTokens]);

  // Handle approval
  const handleApprove = useCallback(async () => {
    if (!approveCallback) return;
    
    setApprovalPending(true);
    try {
      await approveCallback();
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setApprovalPending(false);
    }
  }, [approveCallback]);

  // Handle modal close - reset state
  const handleClose = useCallback(() => {
    // Clear input
    onUserInput(Field.INPUT, '');
    // Reset direction
    setIsReversed(false);
    // Clear refs
    prevCurrenciesRef.current = {};
    prevOutcomeIndexRef.current = undefined;
    // Call original onClose
    onClose();
  }, [onUserInput, onClose]);

  // Handle swap execution
  const handleSwap = useCallback(async () => {
    if (!batchSwapCallback) return;
    
    setIsSwapping(true);
    
    try {
      const txHash = await batchSwapCallback();
      onUserInput(Field.INPUT, '');
      handleClose();
    } catch (error) {
      console.error('Swap failed:', error);
    } finally {
      setIsSwapping(false);
    }
  }, [batchSwapCallback, onUserInput, handleClose]);

  // Determine button state
  const isValid = !swapInputError && !swapCallbackError;
  const needsApproval = currencies[Field.INPUT] && !currencies[Field.INPUT].isNative && 
    approvalState === ApprovalState.NOT_APPROVED && trade;
  const showApproveButton = needsApproval && !supports7702; // Only show separate approve button if 7702 not supported
  const showApproving = approvalState === ApprovalState.PENDING || approvalPending;

  if (!isConnected) {
    return (
      <Modal isOpen={isOpen} onDismiss={handleClose} maxHeight={90}>
        <div className="quick-trade-modal">
          <div className="modal-header">
            <h2 className="modal-title">Quick Trade</h2>
            <button className="close-button" onClick={handleClose}>
              <X size={20} />
            </button>
          </div>
          <div className="modal-content">
            <div className="connect-wallet-message">
              <AlertCircle size={48} />
              <p><Trans>Please connect your wallet to trade</Trans></p>
              <ConnectKitButton.Custom>
                {({ show }) => (
                  <ButtonPrimary onClick={show}>
                    <Trans>Connect Wallet</Trans>
                  </ButtonPrimary>
                )}
              </ConnectKitButton.Custom>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onDismiss={handleClose} maxHeight={90}>
      <div className="quick-trade-modal">
        <div className="modal-header">
          <h2 className="modal-title">Quick Trade</h2>
          <button className="close-button" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          {/* Market Title */}
          <div className="market-info">
            <h3 className="market-name">{market.marketName}</h3>
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
                  {outcomePrice > 0 && selectedOutcomeIndex === index && (
                    <span className="outcome-price">{(outcomePrice * 100).toFixed(1)}%</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Input Panels */}
          <AutoColumn gap="md">
            <div style={{ position: 'relative' }}>
              <NewCurrencyInputPanel
                title=""
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={!isReversed}
                currency={currencies[Field.INPUT] as any}
                onUserInput={(value) => handleTypeInput(Field.INPUT, value)}
                onMax={handleMaxInput}
                onCurrencySelect={undefined}
                otherCurrency={currencies[Field.OUTPUT]}
                fiatValue={fiatValueInput ?? undefined}
                id="quick-trade-input"
                locked={false}
                hideBalance={false}
                hideInput={false}
                disabled={false}
                shallow={false}
                swap={true}
              />
              
              <ArrowWrapper clickable style={{ margin: '0.5rem 0' }}>
                <ArrowDown
                  size="16"
                  onClick={handleSwitchTokens}
                  color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? '#565A69' : '#C3C5CB'}
                />
              </ArrowWrapper>
              
              <NewCurrencyInputPanel
                title=""
                value={formattedAmounts[Field.OUTPUT]}
                showMaxButton={isReversed}
                currency={currencies[Field.OUTPUT] as any}
                onUserInput={(value) => handleTypeInput(Field.OUTPUT, value)}
                onMax={handleMaxInput}
                onCurrencySelect={undefined}
                otherCurrency={currencies[Field.INPUT]}
                fiatValue={fiatValueOutput ?? undefined}
                priceImpact={priceImpact}
                id="quick-trade-output"
                locked={false}
                hideBalance={false}
                hideInput={false}
                disabled={false}
                shallow={false}
                swap={true}
              />
            </div>
          </AutoColumn>

          {/* Trade Status Messages */}
          {v3TradeState === V3TradeState.NO_ROUTE_FOUND && parsedAmounts[Field.INPUT] && (
            <div className="liquidity-warning">
              <AlertCircle size={16} />
              <span>
                <Trans>Insufficient liquidity for this trade</Trans>
              </span>
            </div>
          )}
          {v3TradeState === V3TradeState.LOADING && parsedAmounts[Field.INPUT] && (
            <div className="liquidity-loading">
              <Loader size="16px" />
              <span>
                <Trans>Finding best price...</Trans>
              </span>
            </div>
          )}
          {swapInputError && parsedAmounts[Field.INPUT] && !swapInputError.includes('Enter an amount') && (
            <div className="liquidity-warning">
              <AlertCircle size={16} />
              <span>{swapInputError}</span>
            </div>
          )}

          {/* Trade Summary */}
          {trade && (
            <div className="trade-summary">
              <div className="summary-row">
                <span className="summary-label">
                  <Trans>Price</Trans>
                </span>
                <span className="summary-value">
                  {/* Always show outcome token price in collateral terms */}
                  {!isReversed ? (
                    // Buying outcome: input is collateral, output is outcome
                    // Show as: 1 outcome = X collateral
                    <>1 {currencies[Field.OUTPUT]?.symbol} = {trade.executionPrice.invert().toSignificant(6)} {currencies[Field.INPUT]?.symbol}</>
                  ) : (
                    // Selling outcome: input is outcome, output is collateral  
                    // Show as: 1 outcome = X collateral
                    <>1 {currencies[Field.INPUT]?.symbol} = {trade.executionPrice.toSignificant(6)} {currencies[Field.OUTPUT]?.symbol}</>
                  )}
                </span>
              </div>
              {priceImpact && (
                <div className="summary-row">
                  <span className="summary-label">
                    <Trans>Price Impact</Trans>
                  </span>
                  <span className="summary-value" style={{ 
                    color: priceImpact.lessThan(new Percent(1, 100)) ? '#27AE60' : 
                           priceImpact.lessThan(new Percent(5, 100)) ? '#FF9800' : '#F44336' 
                  }}>
                    {priceImpact.multiply(-1).toSignificant(2)}%
                  </span>
                </div>
              )}
              {approvalState === ApprovalState.APPROVED && currencies[Field.INPUT] && !currencies[Field.INPUT].isNative && (
                <div className="summary-row">
                  <span className="summary-label">
                    <CheckCircle size={14} style={{ color: '#27AE60', marginRight: '4px' }} />
                    <Trans>Approval</Trans>
                  </span>
                  <span className="summary-value" style={{ color: '#27AE60' }}>
                    <Trans>Approved</Trans>
                  </span>
                </div>
              )}
              {needsApproval && supports7702 && (
                <div className="summary-row">
                  <span className="summary-label">
                    <Info size={14} style={{ color: '#4A90E2', marginRight: '4px' }} />
                    <Trans>Transaction Mode</Trans>
                  </span>
                  <span className="summary-value" style={{ color: '#4A90E2' }}>
                    <Trans>Batched (EIP-7702)</Trans>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="modal-actions">
            {!isConnected ? (
              <ConnectKitButton.Custom>
                {({ show }) => (
                  <ButtonPrimary onClick={show}>
                    <Trans>Connect Wallet</Trans>
                  </ButtonPrimary>
                )}
              </ConnectKitButton.Custom>
            ) : showApproveButton ? (
              // Show separate approve button only if EIP-7702 is not supported
              <ButtonLight 
                onClick={handleApprove} 
                disabled={showApproving}
              >
                {showApproving ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Loader stroke="currentColor" size="1rem" />
                    <Trans>Approving...</Trans>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Trans>Approve {currencies[Field.INPUT]?.symbol}</Trans>
                  </div>
                )}
              </ButtonLight>
            ) : isValid ? (
              <ButtonPrimary 
                onClick={handleSwap} 
                disabled={!isValid || isSwapping || !trade || (!supports7702 && approvalState !== ApprovalState.APPROVED)}
              >
                {isSwapping ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Loader stroke="white" size="1rem" />
                    <Trans>Swapping...</Trans>
                  </div>
                ) : needsApproval && supports7702 ? (
                  // EIP-7702 batched transaction
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Trans>Approve & Swap</Trans>
                    {supports7702 && (
                      <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(1 tx)</span>
                    )}
                  </div>
                ) : approvalState === ApprovalState.APPROVED ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={16} />
                    <Trans>Swap</Trans>
                  </div>
                ) : (
                  <Trans>Swap</Trans>
                )}
              </ButtonPrimary>
            ) : (
              <ButtonError error disabled>
                {v3TradeState === V3TradeState.NO_ROUTE_FOUND ? (
                  <Trans>Insufficient liquidity</Trans>
                ) : v3TradeState === V3TradeState.LOADING && typedValue ? (
                  <Trans>Finding route...</Trans>
                ) : (
                  swapInputError || swapCallbackError || <Trans>Enter an amount</Trans>
                )}
              </ButtonError>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuickTradeModal;