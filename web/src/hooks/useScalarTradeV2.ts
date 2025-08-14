import { useState, useCallback, useMemo, useEffect } from "react";
import { Currency, CurrencyAmount, TradeType } from "@uniswap/sdk-core";
import { Trade as V3Trade } from "lib/src";
import { useAccount, useChainId, useBalance, useWaitForTransactionReceipt } from "wagmi";
import { Market, Pool } from "../utils/market";
import { calculateScalarMarketEstimate } from "../utils/marketPrices";
import { useMarketCurrency } from "./useMarketCurrency";
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from "../state/swap/hooks";
import { useSwapCallback } from "./useSwapCallback";
import { ApprovalState, useApproveCallbackFromTrade } from "./useApproveCallback";
import { useERC20PermitFromTrade, UseERC20PermitState } from "./useERC20Permit";
import { Field } from "../state/swap/actions";
import { usePredictionMarketUSDCValue } from "./usePredictionMarketUSDCValue";
import { computeFiatValuePriceImpact } from "../utils/computeFiatValuePriceImpact";
import { parseUnits } from "viem";

/**
 * Enhanced Scalar Trade Hook V2
 * This is the single source of truth for scalar market trading logic.
 * It fetches its own data and manages all relevant state internally.
 */

interface UseScalarTradeV2Props {
    marketId?: string;
    market?: Market;
    pools?: Pool[];
}

interface TradeDirection {
    type: 'up' | 'down';
    targetEstimate: number;
    targetProbability: number;
    currentProbability: number;
    estimateDiff: number;
    outcomeToken: Currency | null;
    tokenAddress: string | null;
}

export interface TransactionStatus {
    hash?: string;
    status: 'idle' | 'pending' | 'success' | 'error';
    confirmations: number;
    error?: Error;
}

// Grouped interfaces for better organization
export interface MarketData {
    market: Market | null;
    pools: Pool[] | null;
    marketEstimate: ReturnType<typeof calculateScalarMarketEstimate> | null;
}

export interface UIState {
    sliderValue: number;
    tradeAmount: string;
    hasUserModifiedSlider: boolean;
}

export interface TradeState {
    direction: TradeDirection | null;
    collateralCurrency: Currency | null;
    v3Trade: V3Trade<Currency, Currency, TradeType> | undefined;
}

export interface ValidationState {
    swapInputError: string | undefined;
    swapCallbackError: string | null;
    priceImpact: ReturnType<typeof computeFiatValuePriceImpact>;
    wouldOvershootTarget: boolean;
    isValidTrade: boolean;
    allowedSlippage: any;
}

export interface TransactionState {
    approvalState: ApprovalState;
    approvalTransaction: TransactionStatus;
    tradeTransaction: TransactionStatus;
}

export interface BalanceState {
    collateralBalance: bigint | undefined;
    hasInsufficientBalance: boolean;
}

export interface Actions {
    setSliderValue: (value: number) => void;
    setTradeAmount: (amount: string) => void;
    resetToCurrent: () => void;
    handleApprove: () => Promise<void>;
    executeTrade: () => Promise<string>;
}

export interface LoadingState {
    isLoading: boolean;
    isApproving: boolean;
    isTrading: boolean;
}

export interface ScalarTradeState {
    marketData: MarketData;
    uiState: UIState;
    trade: TradeState;
    validation: ValidationState;
    transactions: TransactionState;
    balance: BalanceState;
    actions: Actions;
    loading: LoadingState;
    
    // Legacy flat properties for backward compatibility
    // TODO: Remove these after updating all consumers
    market: Market | null;
    pools: Pool[] | null;
    marketEstimate: ReturnType<typeof calculateScalarMarketEstimate> | null;
    sliderValue: number;
    tradeAmount: string;
    hasUserModifiedSlider: boolean;
    tradeDirection: TradeDirection | null;
    collateralCurrency: Currency | null;
    trade: V3Trade<Currency, Currency, TradeType> | undefined;
    swapInputError: string | undefined;
    swapCallbackError: string | null;
    priceImpact: ReturnType<typeof computeFiatValuePriceImpact>;
    wouldOvershootTarget: boolean;
    isValidTrade: boolean;
    allowedSlippage: any;
    approvalState: ApprovalState;
    approvalTransaction: TransactionStatus;
    tradeTransaction: TransactionStatus;
    collateralBalance: bigint | undefined;
    hasInsufficientBalance: boolean;
    setSliderValue: (value: number) => void;
    setTradeAmount: (amount: string) => void;
    resetToCurrent: () => void;
    handleApprove: () => Promise<void>;
    executeTrade: () => Promise<string>;
    isLoading: boolean;
    isApproving: boolean;
    isTrading: boolean;
}

export function useScalarTradeV2({
    marketId,
    market: propMarket,
    pools: propPools
}: UseScalarTradeV2Props = {}): ScalarTradeState {
    const { address: account } = useAccount();
    const chainId = useChainId();
    
    // State for market data (if fetching by ID)
    const [market, setMarket] = useState<Market | null>(propMarket || null);
    const [pools, setPools] = useState<Pool[] | null>(propPools || null);
    const [isLoading, setIsLoading] = useState(false);
    
    // UI state
    const [sliderValue, setSliderValue] = useState<number>(0);
    const [tradeAmount, setTradeAmount] = useState<string>('');
    const [hasUserModifiedSlider, setHasUserModifiedSlider] = useState(false);
    
    // Transaction tracking
    const [approvalTxHash, setApprovalTxHash] = useState<string | undefined>();
    const [tradeTxHash, setTradeTxHash] = useState<string | undefined>();
    
    // Update state when props change
    useEffect(() => {
        if (propMarket) {
            setMarket(propMarket);
        }
    }, [propMarket]);
    
    useEffect(() => {
        if (propPools) {
            setPools(propPools);
        }
    }, [propPools]);
    
    // Fetch market data if needed
    useEffect(() => {
        if (marketId && (!propMarket || !propPools)) {
            setIsLoading(true);
            // TODO: Implement actual data fetching from subgraph
            // For now, we'll use the provided props
            setIsLoading(false);
        }
    }, [marketId, propMarket, propPools]);
    
    // Calculate market estimate
    const marketEstimate = useMemo(() => {
        console.log('[useScalarTradeV2] Calculating market estimate with:', {
            hasMarket: !!market,
            hasPools: !!pools,
            poolsLength: pools?.length,
            marketId: market?.id,
            marketOutcomes: market?.outcomes,
            firstPool: pools?.[0]?.id
        });
        
        if (!market || !pools || pools.length === 0) {
            console.log('[useScalarTradeV2] Missing market or pools, returning null');
            return null;
        }
        
        const result = calculateScalarMarketEstimate(pools, market);
        console.log('[useScalarTradeV2] Market estimate result:', result);
        return result;
    }, [market, pools]);
    
    // Initialize slider value to current market estimate
    useEffect(() => {
        if (marketEstimate && !hasUserModifiedSlider) {
            setSliderValue(marketEstimate.current);
        }
    }, [marketEstimate, hasUserModifiedSlider]);
    
    // Get wrapped tokens
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
    
    // Get token addresses
    const upTokenAddress = useMemo(() => {
        if (!marketEstimate || !wrappedTokens.length) return null;
        return wrappedTokens[marketEstimate.upIndex] || null;
    }, [marketEstimate, wrappedTokens]);
    
    const downTokenAddress = useMemo(() => {
        if (!marketEstimate || !wrappedTokens.length) return null;
        return wrappedTokens[marketEstimate.downIndex] || null;
    }, [marketEstimate, wrappedTokens]);
    
    const collateralTokenAddress = market?.collateralToken?.id || null;
    
    // Resolve currencies
    const upCurrency = useMarketCurrency(
        upTokenAddress,
        chainId,
        'UP',
        market?.wrappedTokens
    );
    
    const downCurrency = useMarketCurrency(
        downTokenAddress,
        chainId,
        'DOWN',
        market?.wrappedTokens
    );
    
    const collateralCurrency = useMarketCurrency(
        collateralTokenAddress,
        chainId,
        market?.collateralToken?.symbol || 'sDAI',
        market?.collateralToken ? [market.collateralToken] : undefined
    );
    
    // Get collateral balance
    const { data: balanceData } = useBalance({
        address: account,
        token: collateralTokenAddress as `0x${string}` | undefined,
        chainId
    });
    
    const collateralBalance = balanceData?.value;
    
    // Check if user has insufficient balance
    const hasInsufficientBalance = useMemo(() => {
        if (!collateralBalance || !tradeAmount) return false;
        try {
            const amountBigInt = parseUnits(tradeAmount, balanceData?.decimals || 18);
            return amountBigInt > collateralBalance;
        } catch {
            return false;
        }
    }, [collateralBalance, tradeAmount, balanceData?.decimals]);
    
    // Swap state
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
    
    // Calculate trade direction
    const tradeDirection: TradeDirection | null = useMemo(() => {
        if (!marketEstimate) return null;
        
        const diff = sliderValue - marketEstimate.current;
        const threshold = 0.01;
        
        if (Math.abs(diff) < threshold) return null;
        
        if (diff > 0) {
            const targetUpProbability = (sliderValue - marketEstimate.lower) / marketEstimate.range;
            return {
                type: 'up',
                targetEstimate: sliderValue,
                targetProbability: targetUpProbability * 100,
                currentProbability: marketEstimate.upPrice,
                estimateDiff: diff,
                outcomeToken: upCurrency,
                tokenAddress: upTokenAddress
            };
        } else {
            const targetDownProbability = (marketEstimate.upper - sliderValue) / marketEstimate.range;
            return {
                type: 'down',
                targetEstimate: sliderValue,
                targetProbability: targetDownProbability * 100,
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
        
        onCurrencySelection(Field.INPUT, collateralCurrency);
        onCurrencySelection(Field.OUTPUT, tradeDirection.outcomeToken);
    }, [tradeDirection?.type, tradeDirection?.tokenAddress, collateralTokenAddress, onCurrencySelection]);
    
    // Bidirectional sync between trade amount and typed value - only when value actually changes
    useEffect(() => {
        const currentValue = typedValue || '';
        const newValue = tradeAmount || '';
        
        // Only update if the values are actually different
        if (currentValue !== newValue) {
            if (tradeAmount && parseFloat(tradeAmount) > 0) {
                onUserInput(Field.INPUT, tradeAmount);
            } else {
                onUserInput(Field.INPUT, '');
            }
        }
    }, [tradeAmount, typedValue, onUserInput]);
    
    // Get V3 trade
    const v3Trade = trade && 'swaps' in trade ? trade as V3Trade<Currency, Currency, TradeType> : undefined;
    
    // Calculate if trade would overshoot target
    const wouldOvershootTarget = useMemo(() => {
        if (!trade || !tradeDirection || !marketEstimate) return false;
        
        // Get the amounts from the trade
        const inputAmount = parseFloat(trade.inputAmount.toSignificant(6));
        const outputAmount = parseFloat(trade.outputAmount.toSignificant(6));
        
        if (inputAmount === 0 || outputAmount === 0) return false;
        
        // Calculate average price: how many outcome tokens we get per collateral
        const avgOutcomePerCollateral = outputAmount / inputAmount;
        
        // Apply price impact to estimate the final marginal price
        // Price impact makes the final price worse than average
        const priceImpactFactor = trade.priceImpact ? 
            Math.abs(parseFloat(trade.priceImpact.toSignificant(6))) / 100 : 0;
        
        // After price impact, we get fewer outcome tokens per collateral
        const finalOutcomePerCollateral = avgOutcomePerCollateral * (1 - priceImpactFactor);
        
        // Calculate the outcome token price in collateral terms (collateral per outcome)
        // This is the inverse: if we get 2 outcome per 1 collateral, then 1 outcome costs 0.5 collateral
        const outcomePrice = finalOutcomePerCollateral > 0 ? 1 / finalOutcomePerCollateral : 1;
        
        // Ensure outcome price is in valid range [0, 1]
        const normalizedOutcomePrice = Math.min(1, Math.max(0, outcomePrice));
        
        // Calculate estimated post-trade market value using the formulas:
        // For UP: marketEstimate = lowerBound + (upperBound - lowerBound) * UP_price
        // For DOWN: marketEstimate = upperBound - (upperBound - lowerBound) * DOWN_price
        let estimatedPostTradeValue: number;
        
        if (tradeDirection.type === 'up') {
            // UP token price represents how much the market thinks it will go up
            estimatedPostTradeValue = marketEstimate.lower + (marketEstimate.range * normalizedOutcomePrice);
        } else {
            // DOWN token price represents how much the market thinks it will go down
            estimatedPostTradeValue = marketEstimate.upper - (marketEstimate.range * normalizedOutcomePrice);
        }
        
        // Check if the post-trade market estimate would overshoot the user's target
        // Use a reasonable tolerance to avoid false positives
        const tolerance = 1.0; // Tolerance in market estimate units
        
        if (tradeDirection.type === 'up') {
            // For UP trades, check if we'd push the market above the target
            return estimatedPostTradeValue > sliderValue + tolerance;
        } else {
            // For DOWN trades, check if we'd push the market below the target
            return estimatedPostTradeValue < sliderValue - tolerance;
        }
    }, [trade, tradeDirection, marketEstimate, sliderValue]);
    
    // Calculate fiat values and price impact
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
        1
    );
    
    const fiatValueOutput = usePredictionMarketUSDCValue(
        parsedAmounts[Field.OUTPUT],
        collateralCurrency,
        tradeDirection ? (tradeDirection.currentProbability / 100) : 0
    );
    
    const priceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput);
    
    // Approval state
    const [approvalState, approveCallback] = useApproveCallbackFromTrade(v3Trade, allowedSlippage);
    const { state: signatureState, signatureData, gatherPermitSignature } = useERC20PermitFromTrade(v3Trade, allowedSlippage);
    
    // Swap callback
    const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
        v3Trade,
        allowedSlippage,
        null,
        signatureData
    );
    
    // Watch for transaction confirmations
    const { data: approvalReceipt, status: approvalStatus } = useWaitForTransactionReceipt({
        hash: approvalTxHash as `0x${string}` | undefined,
        confirmations: 1,
    });
    
    const { data: tradeReceipt, status: tradeStatus } = useWaitForTransactionReceipt({
        hash: tradeTxHash as `0x${string}` | undefined,
        confirmations: 1,
    });
    
    // Build transaction status objects
    const approvalTransaction: TransactionStatus = useMemo(() => ({
        hash: approvalTxHash,
        status: approvalTxHash ? (approvalStatus || 'pending') : 'idle',
        confirmations: approvalReceipt ? 1 : 0,
    }), [approvalTxHash, approvalStatus, approvalReceipt]);
    
    const tradeTransaction: TransactionStatus = useMemo(() => ({
        hash: tradeTxHash,
        status: tradeTxHash ? (tradeStatus || 'pending') : 'idle',
        confirmations: tradeReceipt ? 1 : 0,
    }), [tradeTxHash, tradeStatus, tradeReceipt]);
    
    // Handle approve
    const handleApprove = useCallback(async () => {
        setApprovalTxHash(undefined);
        
        if (signatureState === UseERC20PermitState.NOT_SIGNED && gatherPermitSignature) {
            try {
                await gatherPermitSignature();
            } catch (error: any) {
                if (error?.code !== 4001) {
                    const result = await approveCallback();
                    if (typeof result === 'string') {
                        setApprovalTxHash(result);
                    }
                }
            }
        } else {
            const result = await approveCallback();
            if (typeof result === 'string') {
                setApprovalTxHash(result);
            }
        }
    }, [approveCallback, gatherPermitSignature, signatureState]);
    
    // Handle trade execution
    const executeTrade = useCallback(async () => {
        if (!swapCallback) {
            throw new Error('No swap callback available');
        }
        
        setTradeTxHash(undefined);
        const txHash = await swapCallback();
        setTradeTxHash(txHash);
        
        // Clear inputs after successful trade
        onUserInput(Field.INPUT, '');
        setTradeAmount('');
        
        return txHash;
    }, [swapCallback, onUserInput]);
    
    // Handle slider change
    const handleSliderChange = useCallback((value: number) => {
        setSliderValue(value);
        setHasUserModifiedSlider(true);
        
        // Dynamic coupling: Update trade amount based on slider difference
        if (marketEstimate) {
            const diff = Math.abs(value - marketEstimate.current);
            const suggestedAmount = (diff * 10).toFixed(2); // Example scaling
            // Only update if user hasn't manually entered an amount recently
            // This is a simplified version - you might want more sophisticated logic
            if (!tradeAmount || parseFloat(tradeAmount) < 0.01) {
                setTradeAmount(suggestedAmount);
            }
        }
    }, [marketEstimate, tradeAmount]);
    
    // Handle trade amount change (with dynamic slider update)
    const handleTradeAmountChange = useCallback((amount: string) => {
        setTradeAmount(amount);
        
        // Dynamic coupling: Estimate slider position based on trade size
        if (marketEstimate && amount && parseFloat(amount) > 0) {
            const tradeSize = parseFloat(amount);
            const estimatedImpact = tradeSize / 100; // Simplified impact calculation
            
            if (tradeDirection?.type === 'up') {
                const newEstimate = Math.min(
                    marketEstimate.upper,
                    marketEstimate.current + estimatedImpact
                );
                // Only update if significantly different
                if (Math.abs(newEstimate - sliderValue) > 0.5) {
                    setSliderValue(newEstimate);
                    setHasUserModifiedSlider(true);
                }
            } else if (tradeDirection?.type === 'down') {
                const newEstimate = Math.max(
                    marketEstimate.lower,
                    marketEstimate.current - estimatedImpact
                );
                if (Math.abs(newEstimate - sliderValue) > 0.5) {
                    setSliderValue(newEstimate);
                    setHasUserModifiedSlider(true);
                }
            }
        }
    }, [marketEstimate, tradeDirection, sliderValue]);
    
    // Handle reset to current
    const resetToCurrent = useCallback(() => {
        if (marketEstimate) {
            setSliderValue(marketEstimate.current);
            setHasUserModifiedSlider(false);
            setTradeAmount('');
        }
    }, [marketEstimate]);
    
    // Determine if trade is valid
    const isValidTrade = Boolean(
        !swapInputError && 
        !hasInsufficientBalance &&
        tradeDirection && 
        parseFloat(tradeAmount) > 0 && 
        v3Trade &&
        !wouldOvershootTarget
    );
    
    // Determine loading states
    const isApproving = approvalTransaction.status === 'pending';
    const isTrading = tradeTransaction.status === 'pending';
    
    // Build grouped return objects
    const marketData: MarketData = {
        market,
        pools,
        marketEstimate
    };
    
    const uiState: UIState = {
        sliderValue,
        tradeAmount,
        hasUserModifiedSlider
    };
    
    const tradeState: TradeState = {
        direction: tradeDirection,
        collateralCurrency,
        v3Trade
    };
    
    const validationState: ValidationState = {
        swapInputError,
        swapCallbackError,
        priceImpact,
        wouldOvershootTarget,
        isValidTrade,
        allowedSlippage
    };
    
    const transactionState: TransactionState = {
        approvalState,
        approvalTransaction,
        tradeTransaction
    };
    
    const balanceState: BalanceState = {
        collateralBalance,
        hasInsufficientBalance
    };
    
    const actions: Actions = {
        setSliderValue: handleSliderChange,
        setTradeAmount: handleTradeAmountChange,
        resetToCurrent,
        handleApprove,
        executeTrade
    };
    
    const loading: LoadingState = {
        isLoading,
        isApproving,
        isTrading
    };
    
    return {
        // Grouped properties
        marketData,
        uiState,
        trade: tradeState,
        validation: validationState,
        transactions: transactionState,
        balance: balanceState,
        actions,
        loading,
        
        // Legacy flat properties for backward compatibility
        // TODO: Remove these after updating all consumers
        market,
        pools,
        marketEstimate,
        sliderValue,
        tradeAmount,
        hasUserModifiedSlider,
        tradeDirection,
        collateralCurrency,
        trade: v3Trade,
        swapInputError,
        swapCallbackError,
        priceImpact,
        wouldOvershootTarget,
        isValidTrade,
        allowedSlippage,
        approvalState,
        approvalTransaction,
        tradeTransaction,
        collateralBalance,
        hasInsufficientBalance,
        setSliderValue: handleSliderChange,
        setTradeAmount: handleTradeAmountChange,
        resetToCurrent,
        handleApprove,
        executeTrade,
        isLoading,
        isApproving,
        isTrading
    };
}