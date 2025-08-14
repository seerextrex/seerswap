import { useState, useCallback, useMemo, useEffect } from "react";
import { Currency, CurrencyAmount, TradeType } from "@uniswap/sdk-core";
import { Trade as V3Trade } from "lib/src";
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

interface UseScalarTradeProps {
    market: Market;
    pools: Pool[];
    sliderValue: number;
    tradeAmount: string;
    chainId: number;
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

export function useScalarTrade({
    market,
    pools,
    sliderValue,
    tradeAmount,
    chainId
}: UseScalarTradeProps) {
    // Calculate market estimate
    const marketEstimate = useMemo(() => {
        return calculateScalarMarketEstimate(pools, market);
    }, [market, pools]);

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

    // Update trade amount - only when value actually changes
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
        1
    );
    
    const fiatValueOutput = usePredictionMarketUSDCValue(
        parsedAmounts[Field.OUTPUT],
        collateralCurrency,
        tradeDirection ? (tradeDirection.currentProbability / 100) : 0
    );
    
    const priceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput);

    // Handle approve
    const handleApprove = useCallback(async () => {
        if (signatureState === UseERC20PermitState.NOT_SIGNED && gatherPermitSignature) {
            try {
                await gatherPermitSignature();
            } catch (error: any) {
                if (error?.code !== 4001) {
                    await approveCallback();
                }
            }
        } else {
            await approveCallback();
        }
    }, [approveCallback, gatherPermitSignature, signatureState]);

    // Handle trade execution
    const executeTrade = useCallback(async () => {
        if (!swapCallback) {
            throw new Error('No swap callback available');
        }
        
        const txHash = await swapCallback();
        onUserInput(Field.INPUT, '');
        return txHash;
    }, [swapCallback, onUserInput]);

    // Determine if trade is valid
    const isValidTrade = !swapInputError && 
                        tradeDirection && 
                        parseFloat(tradeAmount) > 0 && 
                        v3Trade &&
                        !wouldOvershootTarget;

    return {
        marketEstimate,
        tradeDirection,
        collateralCurrency,
        trade: v3Trade,
        approvalState,
        swapInputError,
        swapCallbackError,
        priceImpact,
        wouldOvershootTarget,
        isValidTrade,
        allowedSlippage,
        handleApprove,
        executeTrade,
        signatureState,
        gatherPermitSignature,
    };
}