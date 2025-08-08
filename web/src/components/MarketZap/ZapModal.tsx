import React, { useState, useMemo, useCallback } from 'react';
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
import './ZapModal.scss';

interface ZapModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  market: Market;
  pools: Pool[];
}

const DEFAULT_SLIPPAGE = new Percent(50, 10_000); // 0.5%
const MIN_ZAP_AMOUNT = 1; // Minimum 1 token

export const ZapModal: React.FC<ZapModalProps> = ({ isOpen, onDismiss, market, pools }) => {
  const { chain } = useAccount();
  const chainId = chain?.id || 100; // Default to Gnosis if not connected
  
  const [amount, setAmount] = useState('');
  const [attemptingTxn, setAttemptingTxn] = useState(false);
  const [txHash, setTxHash] = useState<string | undefined>();
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [txSuccess, setTxSuccess] = useState(false);
  
  // Get user's slippage tolerance and deadline
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_SLIPPAGE);
  const deadline = useTransactionDeadline();

  // Get collateral token (usually sDAI)
  const collateralToken = useMemo(() => {
    if (!market.collateralToken) return undefined;
    return new Token(
      chainId,
      market.collateralToken.id,
      Number(market.collateralToken.decimals),
      market.collateralToken.symbol,
      market.collateralToken.name
    );
  }, [market, chainId]);

  // Parse the input amount
  const parsedAmount = useMemo(() => {
    if (!collateralToken || !amount) return undefined;
    return tryParseAmount(amount, collateralToken);
  }, [amount, collateralToken]);

  // Filter pools to only include collateral/outcome pairs (one pool per outcome)
  const validPools = useMemo(() => {
    if (!market.collateralToken) return [];
    
    const collateralTokenId = market.collateralToken.id.toLowerCase();
    const outcomePoolsMap = new Map<string, Pool>(); // Track best pool per outcome
    
    pools.forEach(pool => {
      // Check if this pool is for this market
      const isMarketPool = pool.market0?.id === market.id || pool.market1?.id === market.id;
      if (!isMarketPool) return;

      // Check if one token is the collateral token
      const hasCollateral = 
        pool.token0.id.toLowerCase() === collateralTokenId || 
        pool.token1.id.toLowerCase() === collateralTokenId;
      
      if (!hasCollateral) return; // Skip pools that don't include collateral token
      
      // Identify the outcome token (the non-collateral token)
      const outcomeTokenId = pool.token0.id.toLowerCase() === collateralTokenId 
        ? pool.token1.id 
        : pool.token0.id;
      
      // Check if pool has sufficient liquidity
      const tvl = parseFloat(pool.totalValueLockedUSD || '0');
      if (tvl < 100) return; // Min TVL threshold
      
      // Keep only the highest TVL pool for each outcome token
      const existingPool = outcomePoolsMap.get(outcomeTokenId);
      if (!existingPool || parseFloat(existingPool.totalValueLockedUSD || '0') < tvl) {
        outcomePoolsMap.set(outcomeTokenId, pool);
      }
    });
    
    return Array.from(outcomePoolsMap.values());
  }, [pools, market]);

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
    if (!parsedAmount || !poolAllocations.length || !collateralToken) {
      return;
    }

    // Validate minimum amount
    const amountNum = parseFloat(amount);
    if (amountNum < MIN_ZAP_AMOUNT) {
      setErrorMessage(`Minimum amount is ${MIN_ZAP_AMOUNT} ${collateralToken.symbol || 'tokens'}`);
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
        deadline: deadline?.toString()
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
      <button className="close-button" onClick={handleDismiss}>
        <X size={24} />
      </button>
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
          />
          <span className="currency-display">{collateralToken?.symbol || 'sDAI'}</span>
        </div>
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
        disabled={!parsedAmount || validPools.length === 0 || loading}
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
      <Modal isOpen={isOpen && !showConfirm} onDismiss={handleDismiss} maxHeight={80}>
        <div className="zap-modal">
          {modalHeader()}
          {modalContent()}
        </div>
      </Modal>

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
    </>
  );
};