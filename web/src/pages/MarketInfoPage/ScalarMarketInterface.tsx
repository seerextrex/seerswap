import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Trans, t } from "@lingui/macro";
import { TrendingUp, TrendingDown, Info, DollarSign } from "react-feather";
import { useAccount, useChainId } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { Currency, CurrencyAmount, TradeType } from "@uniswap/sdk-core";
import { ButtonPrimary, ButtonError } from "../../components/Button";
import { Market, Pool } from "../../utils/market";
import { calculateScalarMarketEstimate } from "../../utils/marketPrices";
import { formatDollarAmount } from "../../utils/numbers";
import { useMarketCurrency } from "../../hooks/useMarketCurrency";
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from "../../state/swap/hooks";
import { useSwapCallback } from "../../hooks/useSwapCallback";
import { ApprovalState, useApproveCallbackFromTrade } from "../../hooks/useApproveCallback";
import { useERC20PermitFromTrade, UseERC20PermitState } from "../../hooks/useERC20Permit";
import { useBatchedSwap } from "../../hooks/useBatchedSwap";
import { Field } from "../../state/swap/actions";
import { Trade as V3Trade } from "lib/src";
import { usePredictionMarketUSDCValue } from "../../hooks/usePredictionMarketUSDCValue";
import { computeFiatValuePriceImpact } from "../../utils/computeFiatValuePriceImpact";
import "./ScalarMarketInterface.scss";

interface ScalarMarketInterfaceProps {
    market: Market;
    pools: Pool[];
    onTrade?: (targetValue: number, tradeType: 'up' | 'down', amount: number) => void;
}

export const ScalarMarketInterface: React.FC<ScalarMarketInterfaceProps> = ({ 
    market, 
    pools,
    onTrade 
}) => {
    const { address: account, isConnected } = useAccount();
    const chainId = useChainId();
    
    // State hooks - must be called unconditionally
    const [sliderValue, setSliderValue] = useState<number>(0);
    const [tradeAmount, setTradeAmount] = useState<string>('');
    const [isTrading, setIsTrading] = useState(false);
    const [hasUserModifiedSlider, setHasUserModifiedSlider] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    // Calculate current market estimate and prices using shared utility
    const marketEstimate = useMemo(() => {
        return calculateScalarMarketEstimate(pools, market);
    }, [market, pools]);
    
    // Get wrapped tokens and collateral token
    const wrappedTokens = useMemo(() => {
        const tokensString = market?.wrappedTokensString;
        if (!tokensString) return [];
        
        let allTokens: string[] = [];
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
    
    // Get the UP and DOWN token addresses
    const upTokenAddress = useMemo(() => {
        if (!marketEstimate || !wrappedTokens.length) return null;
        return wrappedTokens[marketEstimate.upIndex] || null;
    }, [marketEstimate, wrappedTokens]);
    
    const downTokenAddress = useMemo(() => {
        if (!marketEstimate || !wrappedTokens.length) return null;
        return wrappedTokens[marketEstimate.downIndex] || null;
    }, [marketEstimate, wrappedTokens]);
    
    const collateralTokenAddress = market?.collateralToken?.id || null;
    
    // Memoize the metadata arrays to prevent re-renders
    const wrappedTokensMetadata = useMemo(() => market?.wrappedTokens, [market?.wrappedTokens]);
    const collateralTokenMetadata = useMemo(() => 
        market?.collateralToken ? [market.collateralToken] : undefined,
        [market?.collateralToken]
    );
    
    // Use the custom hook to resolve currencies - always call hooks unconditionally
    const upCurrency = useMarketCurrency(
        upTokenAddress,
        chainId,
        'UP',
        wrappedTokensMetadata
    );
    
    const downCurrency = useMarketCurrency(
        downTokenAddress,
        chainId,
        'DOWN',
        wrappedTokensMetadata
    );
    
    const collateralCurrency = useMarketCurrency(
        collateralTokenAddress,
        chainId,
        market?.collateralToken?.symbol || 'sDAI',
        collateralTokenMetadata
    );
    
    // Swap state management - always call hooks unconditionally
    const { independentField, typedValue } = useSwapState();
    const { onCurrencySelection, onUserInput } = useSwapActionHandlers();
    
    const {
        v3TradeState: { state: v3TradeState },
        toggledTrade: trade,
        allowedSlippage,
        currencyBalances,
        parsedAmount,
        inputError: swapInputError,
    } = useDerivedSwapInfo();
    
    // Get swap callback - always call hooks unconditionally
    const v3Trade = trade && 'swaps' in trade ? trade as V3Trade<Currency, Currency, TradeType> : undefined;
    
    // Check whether the user has approved the router on the input token
    const [approvalState, approveCallback] = useApproveCallbackFromTrade(v3Trade, allowedSlippage);
    const { state: signatureState, signatureData, gatherPermitSignature } = useERC20PermitFromTrade(v3Trade, allowedSlippage);
    
    // Get swap callback with signature data if available
    const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
        v3Trade,
        allowedSlippage,
        null,  // recipient
        signatureData   // signature data for permit
    );
    
    // Track if approval is submitted
    const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);
    
    // Mark when a user has submitted an approval, reset on token change
    useEffect(() => {
        if (approvalState === ApprovalState.PENDING) {
            setApprovalSubmitted(true);
        }
    }, [approvalState]);
    
    // Reset approval submitted state when input currency changes
    useEffect(() => {
        setApprovalSubmitted(false);
    }, [collateralCurrency]);
    
    // Handle approve
    const handleApprove = useCallback(async () => {
        if (signatureState === UseERC20PermitState.NOT_SIGNED && gatherPermitSignature) {
            try {
                await gatherPermitSignature();
            } catch (error: any) {
                // Try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
                if (error?.code !== 4001) {
                    await approveCallback();
                }
            }
        } else {
            await approveCallback();
        }
    }, [approveCallback, gatherPermitSignature, signatureState]);
    
    // Setup batched swap for EIP-7702
    const { executeBatchedSwap, isExecuting: isBatchExecuting, canExecute: canBatchExecute } = useBatchedSwap({
        trade: v3Trade,
        allowedSlippage,
        needsApproval: approvalState !== ApprovalState.APPROVED,
        onSuccess: (txHash) => {
            console.log('Batched trade successful:', txHash);
            // Clear input after successful swap
            onUserInput(Field.INPUT, '');
            setTradeAmount('');
            setIsTrading(false);
            
            // Optionally call the onTrade callback
            if (onTrade && tradeDirection) {
                onTrade(sliderValue, tradeDirection.type, parseFloat(tradeAmount));
            }
        },
        onError: (error) => {
            console.error('Batched trade failed:', error);
            setErrorMessage(error.message || 'Transaction failed. Please try again.');
            setIsTrading(false);
            // Clear error after 5 seconds
            setTimeout(() => setErrorMessage(null), 5000);
        },
    });
    
    // Check if wallet supports EIP-7702 batching
    const [supportsBatching, setSupportsBatching] = useState(false);
    
    useEffect(() => {
        // Check if the wallet supports wallet_sendCalls method
        const checkBatchingSupport = async () => {
            if (typeof window !== 'undefined' && window.ethereum) {
                try {
                    const provider = window.ethereum as any;
                    
                    // Check for wallet_sendCalls method (EIP-5792)
                    // This is the standard method for batch transactions
                    if (provider.request) {
                        try {
                            // Try to get capabilities - wallets that support sendCalls should have this
                            const capabilities = await provider.request({
                                method: 'wallet_getCapabilities',
                                params: [account],
                            }).catch(() => null);
                            
                            // Check if the wallet explicitly supports atomicBatch
                            const supportsAtomicBatch = capabilities?.['atomicBatch']?.supported === true;
                            
                            // For now, enable batching for wallets that have capabilities
                            // or that we know support it (like Rainbow, Rabby, etc.)
                            setSupportsBatching(!!capabilities || supportsAtomicBatch);
                        } catch {
                            // Fallback: check if it's a known wallet that supports batching
                            const userAgent = navigator.userAgent.toLowerCase();
                            const knownSupportingWallets = ['rainbow', 'rabby', 'metamask'];
                            const isKnownWallet = knownSupportingWallets.some(wallet => 
                                userAgent.includes(wallet) || provider.isRainbow || provider.isRabby
                            );
                            setSupportsBatching(isKnownWallet);
                        }
                    }
                } catch {
                    setSupportsBatching(false);
                }
            }
        };
        
        if (account) {
            checkBatchingSupport();
        }
    }, [account]);
    
    // Update slider when market estimate changes (only if user hasn't modified it)
    useEffect(() => {
        if (marketEstimate && !hasUserModifiedSlider) {
            setSliderValue(marketEstimate.current);
        }
    }, [marketEstimate, hasUserModifiedSlider]);
    
    // Calculate what needs to be traded based on slider position
    const tradeDirection = useMemo(() => {
        if (!marketEstimate) return null;
        
        const diff = sliderValue - marketEstimate.current;
        const threshold = 0.01; // Minimum difference to show trade
        
        if (Math.abs(diff) < threshold) return null;
        
        if (diff > 0) {
            // Slider is higher than current - need to buy UP tokens
            // Buying UP tokens increases their price, which increases the market estimate
            const targetUpProbability = (sliderValue - marketEstimate.lower) / marketEstimate.range;
            return {
                type: 'up' as const,
                targetEstimate: sliderValue,
                targetProbability: targetUpProbability * 100, // Convert to percentage
                currentProbability: marketEstimate.upPrice,
                estimateDiff: diff,
                outcomeToken: upCurrency,
                tokenAddress: upTokenAddress
            };
        } else {
            // Slider is lower than current - need to buy DOWN tokens
            // Buying DOWN tokens increases their price, which decreases the market estimate
            const targetDownProbability = (marketEstimate.upper - sliderValue) / marketEstimate.range;
            return {
                type: 'down' as const,
                targetEstimate: sliderValue,
                targetProbability: targetDownProbability * 100, // Convert to percentage
                currentProbability: marketEstimate.downPrice,
                estimateDiff: diff,
                outcomeToken: downCurrency,
                tokenAddress: downTokenAddress
            };
        }
    }, [sliderValue, marketEstimate, upCurrency, downCurrency, upTokenAddress, downTokenAddress]);
    
    // Auto-select currencies based on trade direction
    useEffect(() => {
        if (!collateralCurrency || !tradeDirection || !tradeDirection.outcomeToken) {
            return;
        }
        
        // Always buy outcome tokens with collateral
        onCurrencySelection(Field.INPUT, collateralCurrency);
        onCurrencySelection(Field.OUTPUT, tradeDirection.outcomeToken);
    }, [tradeDirection?.type, tradeDirection?.outcomeToken, collateralCurrency, onCurrencySelection]);
    
    // Separate effect for updating input amount to prevent loops
    useEffect(() => {
        if (tradeAmount && parseFloat(tradeAmount) > 0 && collateralCurrency) {
            onUserInput(Field.INPUT, tradeAmount);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tradeAmount]); // Only depend on tradeAmount, not onUserInput to prevent loops
    
    const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setSliderValue(value);
        setHasUserModifiedSlider(true);
    }, []);
    
    const handleResetToCurrent = useCallback(() => {
        if (marketEstimate) {
            setSliderValue(marketEstimate.current);
            setHasUserModifiedSlider(false);
        }
    }, [marketEstimate]);
    
    const handleTrade = useCallback(async () => {
        // Use batched swap if supported and approval is needed
        if (supportsBatching && approvalState !== ApprovalState.APPROVED && canBatchExecute) {
            console.log('Using EIP-7702 batched transaction (approve + swap)');
            setIsTrading(true);
            await executeBatchedSwap();
            return;
        }
        
        // Fall back to regular swap if batching not supported or approval already done
        if (!swapCallback) {
            console.error('No swap callback available');
            return;
        }
        
        setIsTrading(true);
        
        try {
            const txHash = await swapCallback();
            console.log('Trade successful:', txHash);
            
            // Clear input after successful swap
            onUserInput(Field.INPUT, '');
            setTradeAmount('');
            
            // Optionally call the onTrade callback
            if (onTrade && tradeDirection) {
                onTrade(sliderValue, tradeDirection.type, parseFloat(tradeAmount));
            }
        } catch (error: any) {
            console.error('Trade failed:', error);
            setErrorMessage(error.message || 'Transaction failed. Please try again.');
            // Clear error after 5 seconds
            setTimeout(() => setErrorMessage(null), 5000);
        } finally {
            setIsTrading(false);
        }
    }, [
        supportsBatching,
        approvalState,
        canBatchExecute,
        executeBatchedSwap,
        swapCallback,
        onUserInput,
        onTrade,
        sliderValue,
        tradeDirection,
        tradeAmount
    ]);
    
    // Calculate fiat values
    const parsedAmounts = useMemo(
        () => ({
            [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
            [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
        }),
        [independentField, parsedAmount, trade]
    );
    
    const fiatValueInput = usePredictionMarketUSDCValue(
        parsedAmounts[Field.INPUT],
        collateralCurrency,
        1 // Collateral is worth 1 collateral
    );
    
    const fiatValueOutput = usePredictionMarketUSDCValue(
        parsedAmounts[Field.OUTPUT],
        collateralCurrency,
        tradeDirection ? (tradeDirection.currentProbability / 100) : 0 // Convert percentage to decimal
    );
    
    const priceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput);
    
    // Calculate if the trade would overshoot the target
    const wouldOvershootTarget = useMemo(() => {
        if (!trade || !tradeDirection || !marketEstimate) return false;
        
        // Get the execution price and price impact
        const executionPrice = trade.executionPrice;
        const priceImpact = trade.priceImpact;
        if (!executionPrice) return false;
        
        // Verify token ordering: we're always swapping collateral -> outcome
        // The trade is set up so input is collateral, output is outcome token
        // executionPrice = inputAmount/outputAmount = collateral/outcome
        const isCorrectOrder = trade.inputAmount.currency === collateralCurrency && 
                              trade.outputAmount.currency === tradeDirection.outcomeToken;
        
        // Get the average execution price
        const rawPrice = parseFloat(executionPrice.toSignificant(6));
        
        // If tokens are in the correct order (collateral -> outcome),
        // the price represents collateral per outcome token
        // Otherwise, we need to invert it
        const avgPrice = isCorrectOrder ? rawPrice : 1 / rawPrice;
        
        // To get a better approximation of the post-trade price, we can use the fact that
        // the final price will be higher than the average execution price for buys
        // We can estimate this using the price impact
        let estimatedFinalPrice = avgPrice;
        
        if (priceImpact) {
            // Price impact tells us how much worse our trade is compared to the mid price
            // For a buy, the final price will be approximately:
            // finalPrice ≈ avgPrice * (1 + priceImpact/2)
            // This is an approximation but better than using avgPrice directly
            const impactPercent = parseFloat(priceImpact.toSignificant(6)) / 100;
            estimatedFinalPrice = avgPrice * (1 + impactPercent / 2);
        }
        
        // Ensure price is in valid range [0, 1]
        const postTradePrice = Math.min(1, Math.max(0, estimatedFinalPrice));
        
        if (tradeDirection.type === 'up') {
            // We're buying UP tokens, so the UP price will increase
            // The new market estimate = lower + (upper - lower) * new_up_price
            const postTradeEstimate = marketEstimate.lower + (marketEstimate.range * postTradePrice);
            
            // Check if we'd overshoot the target
            return postTradeEstimate > sliderValue;
        } else {
            // We're buying DOWN tokens, so the DOWN price will increase
            // The new market estimate = upper - (upper - lower) * new_down_price
            const postTradeEstimate = marketEstimate.upper - (marketEstimate.range * postTradePrice);
            
            // Check if we'd overshoot the target
            return postTradeEstimate < sliderValue;
        }
    }, [trade, tradeDirection, marketEstimate, sliderValue]);
    
    const sliderPercentage = marketEstimate 
        ? ((sliderValue - marketEstimate.lower) / marketEstimate.range) * 100
        : 50;
    const collateralSymbol = market?.collateralToken?.symbol || 'sDAI';
    
    // Determine button state
    const isValidTrade = !swapInputError && 
                        tradeDirection && 
                        parseFloat(tradeAmount) > 0 && 
                        v3Trade &&
                        !wouldOvershootTarget;
    
    const buttonText = useMemo(() => {
        if (isTrading) return t`Processing...`;
        if (!tradeDirection) return t`Move slider to trade`;
        if (wouldOvershootTarget) return t`Amount too large - would overshoot target`;
        if (swapInputError) return swapInputError;
        if (!v3Trade) return t`Enter amount`;
        if (parseFloat(tradeAmount) === 0) return t`Enter amount`;
        return t`Trade to ${sliderValue.toFixed(2)}`;
    }, [isTrading, tradeDirection, swapInputError, v3Trade, sliderValue, wouldOvershootTarget, tradeAmount]);
    
    // Early return after all hooks have been called
    if (!marketEstimate) {
        return (
            <div className="scalar-market-interface">
                <div className="not-scalar-message">
                    <Info size={20} />
                    <Trans>This market does not support scalar trading</Trans>
                </div>
            </div>
        );
    }
    
    return (
        <div className="scalar-market-interface">
            {/* Current Market Estimate Display */}
            <div className="market-estimate-display">
                <div className="estimate-header">
                    <span className="estimate-label"><Trans>Market Estimate</Trans></span>
                    <div className="estimate-info-icon">
                        <Info size={14} />
                        <div className="tooltip">
                            <Trans>The market's current prediction based on trading activity</Trans>
                        </div>
                    </div>
                </div>
                <div className="estimate-value-large">
                    {marketEstimate.current.toFixed(2)}
                </div>
                <div className="estimate-range">
                    <span className="range-label"><Trans>Range:</Trans></span>
                    <span className="range-values">{marketEstimate.lower} - {marketEstimate.upper}</span>
                </div>
            </div>
            
            {/* Interactive Slider Section */}
            <div className="slider-section">
                <div className="slider-header">
                    <span className="slider-label"><Trans>Your Prediction</Trans></span>
                    <div className="slider-value-display">
                        <input
                            type="number"
                            className="slider-value-input"
                            value={sliderValue.toFixed(2)}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val) && val >= marketEstimate.lower && val <= marketEstimate.upper) {
                                    setSliderValue(val);
                                    setHasUserModifiedSlider(true);
                                }
                            }}
                            min={marketEstimate.lower}
                            max={marketEstimate.upper}
                            step={0.01}
                        />
                        {hasUserModifiedSlider && Math.abs(sliderValue - marketEstimate.current) > 0.01 && (
                            <button 
                                className="reset-button"
                                onClick={handleResetToCurrent}
                                title="Reset to current market estimate"
                            >
                                <Trans>Reset</Trans>
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="slider-container">
                    <div className="slider-track">
                        <div 
                            className="slider-fill"
                            style={{ width: `${sliderPercentage}%` }}
                        />
                        <div 
                            className="current-estimate-marker"
                            style={{ 
                                left: `${((marketEstimate.current - marketEstimate.lower) / marketEstimate.range) * 100}%` 
                            }}
                        >
                            <div className="marker-line" />
                            <div className="marker-label">Current</div>
                        </div>
                    </div>
                    <input
                        type="range"
                        className="slider-input"
                        min={marketEstimate.lower}
                        max={marketEstimate.upper}
                        step={0.01}
                        value={sliderValue}
                        onChange={handleSliderChange}
                    />
                    <div className="slider-labels">
                        <span className="slider-min">{marketEstimate.lower}</span>
                        <span className="slider-max">{marketEstimate.upper}</span>
                    </div>
                </div>
                
                {/* Trade Direction Indicator */}
                {tradeDirection && (
                    <div className={`trade-indicator ${tradeDirection.type}`}>
                        <div className="trade-direction">
                            {tradeDirection.type === 'up' ? (
                                <>
                                    <TrendingUp size={20} />
                                    <span><Trans>Buying UP to reach</Trans> {sliderValue.toFixed(2)}</span>
                                </>
                            ) : (
                                <>
                                    <TrendingDown size={20} />
                                    <span><Trans>Buying DOWN to reach</Trans> {sliderValue.toFixed(2)}</span>
                                </>
                            )}
                        </div>
                        <div className="trade-details">
                            <div className="detail-row">
                                <span className="detail-label"><Trans>Current Probability:</Trans></span>
                                <span className="detail-value">{tradeDirection.currentProbability.toFixed(1)}%</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label"><Trans>Target Probability:</Trans></span>
                                <span className="detail-value">{tradeDirection.targetProbability.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Trade Execution Section */}
            <div className="trade-execution">
                <div className="amount-input-section">
                    <label className="amount-label">
                        <Trans>Trade Amount ({collateralSymbol})</Trans>
                    </label>
                    <div className="amount-input-wrapper">
                        <DollarSign size={16} className="dollar-icon" />
                        <input
                            type="number"
                            className="amount-input"
                            value={tradeAmount}
                            onChange={(e) => {
                                setTradeAmount(e.target.value);
                                onUserInput(Field.INPUT, e.target.value);
                            }}
                            placeholder="Enter amount"
                            min="0"
                            step="1"
                        />
                    </div>
                    {trade && (
                        <div className="trade-summary">
                            <span className="summary-label"><Trans>You will receive:</Trans></span>
                            <span className="summary-value">
                                ~{trade.outputAmount?.toSignificant(6)} {tradeDirection?.type.toUpperCase()} tokens
                            </span>
                        </div>
                    )}
                </div>
                
                {!isConnected ? (
                    <ConnectKitButton.Custom>
                        {({ show }) => (
                            <ButtonPrimary onClick={show} className="trade-button">
                                <Trans>Connect Wallet</Trans>
                            </ButtonPrimary>
                        )}
                    </ConnectKitButton.Custom>
                ) : supportsBatching && approvalState !== ApprovalState.APPROVED && isValidTrade ? (
                    // Show single button for batched approve + swap when EIP-7702 is supported
                    <ButtonPrimary
                        onClick={handleTrade}
                        disabled={!canBatchExecute || isTrading || isBatchExecuting}
                        className="trade-button"
                    >
                        {isTrading || isBatchExecuting ? (
                            <Trans>Processing...</Trans>
                        ) : (
                            <Trans>Approve & Trade to {sliderValue.toFixed(2)}</Trans>
                        )}
                    </ButtonPrimary>
                ) : approvalState !== ApprovalState.APPROVED && isValidTrade ? (
                    // Show separate approve button when batching not supported
                    <ButtonPrimary
                        onClick={handleApprove}
                        disabled={approvalState === ApprovalState.PENDING || !isValidTrade}
                        className="trade-button"
                    >
                        {approvalState === ApprovalState.PENDING ? (
                            <Trans>Approving...</Trans>
                        ) : (
                            <Trans>Approve {collateralSymbol}</Trans>
                        )}
                    </ButtonPrimary>
                ) : (
                    // Show trade button when already approved or no approval needed
                    <ButtonPrimary 
                        onClick={handleTrade}
                        disabled={!isValidTrade || isTrading || (approvalState !== ApprovalState.APPROVED && approvalState !== ApprovalState.UNKNOWN)}
                        className="trade-button"
                    >
                        {buttonText}
                    </ButtonPrimary>
                )}
                
                {supportsBatching && approvalState !== ApprovalState.APPROVED && isValidTrade && (
                    <div className="info-message" style={{ marginTop: '10px', padding: '8px', background: '#f0f8ff', borderRadius: '4px', fontSize: '12px' }}>
                        <Info size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        <span><Trans>Using EIP-7702 to batch approve and swap in a single transaction</Trans></span>
                    </div>
                )}
                
                {(errorMessage || (swapCallbackError && swapCallbackError !== "Missing dependencies")) && (
                    <div className="error-message" style={{ marginTop: '10px', padding: '8px', background: '#ffebee', borderRadius: '4px', color: '#c62828' }}>
                        {errorMessage || swapCallbackError}
                    </div>
                )}
                
                {wouldOvershootTarget && tradeAmount && parseFloat(tradeAmount) > 0 && (
                    <div className="warning-message">
                        <Info size={16} />
                        <span><Trans>This trade amount would move the market estimate beyond your target. Please reduce the amount.</Trans></span>
                    </div>
                )}
                
                {priceImpact && Math.abs(parseFloat(priceImpact.toFixed(2))) > 5 && tradeDirection && isValidTrade && (
                    <div className="warning-message">
                        <Info size={16} />
                        <span><Trans>High price impact: {priceImpact.toFixed(2)}%</Trans></span>
                    </div>
                )}
            </div>
            
            {/* Token Prices Display */}
            <div className="token-prices">
                <div className="token-price up">
                    <div className="token-header">
                        <span className="token-name">UP Token</span>
                        <TrendingUp size={16} />
                    </div>
                    <div className="token-value">${(marketEstimate.upPrice / 100).toFixed(3)}</div>
                    <div className="token-subtext">{marketEstimate.upPrice.toFixed(1)}% probability</div>
                </div>
                <div className="token-price down">
                    <div className="token-header">
                        <span className="token-name">DOWN Token</span>
                        <TrendingDown size={16} />
                    </div>
                    <div className="token-value">${(marketEstimate.downPrice / 100).toFixed(3)}</div>
                    <div className="token-subtext">{marketEstimate.downPrice.toFixed(1)}% probability</div>
                </div>
            </div>
        </div>
    );
};