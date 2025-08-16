import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Trans, t } from '@lingui/macro';
import { X, ExternalLink } from 'react-feather';
import { Currency, CurrencyAmount, Token, Percent } from '@uniswap/sdk-core';
import { useAccount } from 'wagmi';
import { Market, Pool, getOutcomeName } from '../../utils/market';
import { useZapIntoMarket } from '../../hooks/useZapIntoMarket';
import { tryParseAmount } from '../../state/swap/hooks';
import { useUserSlippageToleranceWithDefault } from '../../state/user/hooks';
import useTransactionDeadline from '../../hooks/useTransactionDeadline';
import { getExplorerLink, ExplorerDataType } from '../../utils/getExplorerLink';
import TransactionConfirmationModal from '../TransactionConfirmationModal';
import Modal from '../Modal';
import SettingsTab from '../Settings';
import { ZapErrorRecovery, ZapStep, ZapProgress } from './ZapErrorRecovery';
import './ZapModal.scss';

interface ZapModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  market: Market;
  pools: Pool[];
  farms?: any[]; // Optional farms data for auto-staking
}

interface ZapModalContentProps {
  market: Market;
  pools: Pool[];
  farms?: any[];
  onDismiss: () => void;
}

const DEFAULT_ZAP_SLIPPAGE = new Percent(50, 10_000); // 0.5% default for zap
const MIN_ZAP_AMOUNT = 0.0001; // Minimum 0.0001 token (allows small amounts)

// Lightweight content component - renders after modal opens
export const ZapModalContent: React.FC<ZapModalContentProps> = ({ market, pools, farms, onDismiss }) => {
  const { chain } = useAccount();
  const chainId = chain?.id || 100; // Default to Gnosis if not connected
  
  const [amount, setAmount] = useState('');
  const [attemptingTxn, setAttemptingTxn] = useState(false);
  const [txHash, setTxHash] = useState<string | undefined>();
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [txSuccess, setTxSuccess] = useState(false);
  const [zapProgress, setZapProgress] = useState<ZapProgress | null>(null);
  const [showRecovery, setShowRecovery] = useState(false);
  
  // Get user's slippage tolerance and deadline
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_ZAP_SLIPPAGE);
  const deadline = useTransactionDeadline();

  // Create collateral token immediately - the Modal wrapper handles performance
  const collateralToken = useMemo(() => {
    if (!market.collateralToken) return undefined;
    
    // Try to get collateral token details from the first pool that has it
    // The market.collateralToken from the query might only have 'id' field
    if (pools && pools.length > 0) {
      for (const pool of pools) {
        // Check if token0 or token1 matches the collateral token
        if (pool.token0?.id.toLowerCase() === market.collateralToken.id.toLowerCase()) {
          return new Token(
            chainId,
            pool.token0.id,
            Number(pool.token0.decimals || 18),
            pool.token0.symbol || 'Unknown',
            pool.token0.name || 'Unknown Token'
          );
        }
        if (pool.token1?.id.toLowerCase() === market.collateralToken.id.toLowerCase()) {
          return new Token(
            chainId,
            pool.token1.id,
            Number(pool.token1.decimals || 18),
            pool.token1.symbol || 'Unknown',
            pool.token1.name || 'Unknown Token'
          );
        }
      }
    }
    
    // Fallback: try to use market.collateralToken if it has decimals
    if (market.collateralToken.decimals !== undefined && market.collateralToken.decimals !== null) {
      return new Token(
        chainId,
        market.collateralToken.id,
        Number(market.collateralToken.decimals),
        market.collateralToken.symbol || 'Unknown',
        market.collateralToken.name || 'Unknown Token'
      );
    }
    
    // Last resort: return undefined, will show error to user
    return undefined;
  }, [market.collateralToken, chainId, pools]);
  
  // Compute valid pools immediately using memoization
  const validPools = useMemo(() => {
    if (!market.collateralToken || !pools.length) return [];
    
    const collateralTokenId = market.collateralToken.id.toLowerCase();
    const marketId = market.id;
    const outcomePoolsMap = new Map<string, Pool>();
    
    for (const pool of pools) {
      if (!pool.market0 && !pool.market1) continue;
      
      const isMarketPool = pool.market0?.id === marketId || pool.market1?.id === marketId;
      if (!isMarketPool) continue;

      const token0Id = pool.token0.id.toLowerCase();
      const token1Id = pool.token1.id.toLowerCase();
      
      const isToken0Collateral = token0Id === collateralTokenId;
      const isToken1Collateral = token1Id === collateralTokenId;
      
      if (!isToken0Collateral && !isToken1Collateral) continue;
      
      const outcomeTokenId = isToken0Collateral ? pool.token1.id : pool.token0.id;
      
      const tvl = parseFloat(pool.totalValueLockedUSD || '0');
      if (tvl < 100) continue;
      
      const existingPool = outcomePoolsMap.get(outcomeTokenId);
      if (!existingPool || parseFloat(existingPool.totalValueLockedUSD || '0') < tvl) {
        outcomePoolsMap.set(outcomeTokenId, pool);
      }
    }
    
    return Array.from(outcomePoolsMap.values());
  }, [market, pools]);

  // Parse the input amount
  const parsedAmount = useMemo(() => {
    if (!collateralToken || !amount) return undefined;
    return tryParseAmount(amount, collateralToken);
  }, [amount, collateralToken]);

  // Calculate how many outcome tokens each pool needs (proportional to TVL)
  const poolAllocations = useMemo(() => {
    if (!validPools.length || !parsedAmount) return [];

    // Calculate total TVL across all valid pools
    const totalTVL = validPools.reduce((sum, pool) => {
      return sum + parseFloat(pool.totalValueLockedUSD || '0');
    }, 0);

    if (totalTVL === 0) {
      // If no TVL, allocate equally as fallback
      const poolCount = validPools.length;
      const amountPerPool = parsedAmount.divide(poolCount);
      return validPools.map(pool => ({
        pool,
        amount: amountPerPool
      }));
    }

    // Allocate proportionally to TVL
    return validPools.map(pool => {
      const poolTVL = parseFloat(pool.totalValueLockedUSD || '0');
      const proportion = poolTVL / totalTVL;
      const scaledAmount = parsedAmount.multiply(Math.floor(proportion * 10000)).divide(10000);
      return {
        pool,
        amount: scaledAmount
      };
    });
  }, [validPools, parsedAmount]);

  const { zapIntoMarket, loading } = useZapIntoMarket();

  const handleZap = useCallback(async () => {
    // Validate minimum amount first
    const amountNum = parseFloat(amount);
    if (!amount || amountNum <= 0 || isNaN(amountNum)) {
      setErrorMessage(`Please enter a valid amount`);
      return;
    }
    if (amountNum < MIN_ZAP_AMOUNT) {
      setErrorMessage(`Minimum amount is ${MIN_ZAP_AMOUNT} ${collateralToken?.symbol || 'tokens'}`);
      return;
    }
    
    if (!parsedAmount || !poolAllocations.length || !collateralToken) {
      setErrorMessage(`Unable to process amount. Please try again.`);
      return;
    }

    setAttemptingTxn(true);
    setShowConfirm(true);
    setErrorMessage(undefined);
    setTxSuccess(false);

    try {
      const txHash = await zapIntoMarket({
        market,
        collateralToken,
        amount: parsedAmount,
        poolAllocations,
        validPools,
        slippageTolerance: allowedSlippage,
        deadline: deadline?.toString(),
        farms: farms, // Pass farms data for auto-staking
        autoStake: true // Enable auto-staking
      });

      setTxHash(txHash);
      setAttemptingTxn(false);
      setTxSuccess(true);
    } catch (error: any) {
      console.error('Zap failed:', error);
      
      // Parse error for user-friendly message
      let userMessage = 'Transaction failed';
      if (error?.message?.includes('insufficient funds')) {
        userMessage = 'Insufficient funds';
      } else if (error?.message?.includes('user rejected')) {
        userMessage = 'Transaction cancelled';
      } else if (error?.message?.includes('slippage')) {
        userMessage = 'Price moved too much. Try increasing slippage tolerance.';
      }
      
      setErrorMessage(userMessage);
      setAttemptingTxn(false);
    }
  }, [parsedAmount, poolAllocations, collateralToken, market, zapIntoMarket, validPools, amount, allowedSlippage, deadline]);

  const handleDismiss = useCallback(() => {
    setShowConfirm(false);
    setTxHash(undefined);
    setAttemptingTxn(false);
    setErrorMessage(undefined);
    setTxSuccess(false);
    setAmount('');
    onDismiss();
  }, [onDismiss]);

  const modalHeader = () => (
    <div className="zap-modal-header">
      <h2><Trans>Zap Into Market</Trans></h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <SettingsTab placeholderSlippage={DEFAULT_ZAP_SLIPPAGE} />
        <button className="close-button" onClick={handleDismiss}>
          <X size={24} />
        </button>
      </div>
    </div>
  );

  const modalContent = () => (
    <div className="zap-modal-content">
      <div className="market-info">
        <h3>{market.marketName}</h3>
        <p className="description">
          <Trans>
            This will mint outcome tokens and provide liquidity to all outcome pools in full range (0 to 1 {collateralToken?.symbol || 'sDAI'}).
          </Trans>
        </p>
      </div>

      <div className="input-section">
        <label><Trans>Amount to Zap</Trans></label>
        <div className="input-wrapper">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="amount-input"
            step="0.0001"
            min={MIN_ZAP_AMOUNT}
          />
          <span className="currency-display">{collateralToken?.symbol || 'sDAI'}</span>
        </div>
        <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
          <Trans>Minimum: {MIN_ZAP_AMOUNT} {collateralToken?.symbol || 'sDAI'}</Trans>
        </small>
      </div>

      <div className="pool-info">
        <h4><Trans>Pools to Provide Liquidity</Trans></h4>
        <div className="pool-list">
          {validPools.length === 0 ? (
            <p className="no-pools"><Trans>No valid collateral/outcome pools found for this market</Trans></p>
          ) : (
            validPools.map((pool, index) => {
              // Determine which token is the outcome and get its name
              const isToken0Collateral = pool.token0.id.toLowerCase() === market.collateralToken?.id.toLowerCase();
              const outcomeToken = isToken0Collateral ? pool.token1 : pool.token0;
              const collateralSymbol = market.collateralToken?.symbol || 'sDAI';
              
              // Get the outcome name using the utility function
              const outcomeName = getOutcomeName(market, outcomeToken.id) || outcomeToken.symbol;
              
              return (
                <div key={pool.id} className="pool-item">
                  <span className="pool-tokens">
                    <strong>{outcomeName}</strong> / {collateralSymbol}
                  </span>
                  <span className="pool-tvl">
                    TVL: ${parseFloat(pool.totalValueLockedUSD).toLocaleString()}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <button
        className="zap-confirm-button"
        onClick={handleZap}
        disabled={!amount || parseFloat(amount) < MIN_ZAP_AMOUNT || isNaN(parseFloat(amount)) || validPools.length === 0 || loading}
      >
        {loading ? (
          <Trans>Processing...</Trans>
        ) : (
          <Trans>Zap {amount || '0'} {collateralToken?.symbol || 'sDAI'}</Trans>
        )}
      </button>
    </div>
  );

  return (
    <>
      <div className="zap-modal">
        {modalHeader()}
        {modalContent()}
      </div>

      {showConfirm && (
        <TransactionConfirmationModal
          isOpen={showConfirm}
          onDismiss={handleDismiss}
          attemptingTxn={attemptingTxn}
          hash={txHash}
          content={() => (
          <div className="confirmation-content">
            {txSuccess ? (
              <>
                <h3><Trans>Zap Successful!</Trans></h3>
                <p>
                  <Trans>
                    Successfully zapped {amount} {collateralToken?.symbol} into {validPools.length} pools
                  </Trans>
                </p>
                {txHash && (
                  <a 
                    href={getExplorerLink(chainId, txHash, ExplorerDataType.TRANSACTION)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tx-link"
                  >
                    <Trans>View on Explorer</Trans> <ExternalLink size={16} />
                  </a>
                )}
              </>
            ) : errorMessage ? (
              <>
                <h3><Trans>Transaction Failed</Trans></h3>
                <p className="error-message">{errorMessage}</p>
              </>
            ) : (
              <>
                <h3><Trans>Confirm Zap Transaction</Trans></h3>
                <p>
                  <Trans>
                    Zapping {amount} {collateralToken?.symbol} into {validPools.length} pools
                  </Trans>
                </p>
              </>
            )}
          </div>
        )}
        pendingText={t`Zapping into market...`}
        />
      )}
    </>
  );
};

// Legacy wrapper for backward compatibility
export const ZapModal: React.FC<ZapModalProps> = ({ isOpen, onDismiss, market, pools, farms }) => {
  const [hasOpened, setHasOpened] = useState(false);
  
  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
    }
  }, [isOpen, hasOpened]);
  
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90} fitContent={true}>
      {isOpen && (
        <ZapModalContent
          market={market}
          pools={pools}
          farms={farms}
          onDismiss={onDismiss}
        />
      )}
    </Modal>
  );
};