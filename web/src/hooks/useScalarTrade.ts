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
    }, [tradeDirection?.type, tradeDirection?.outcomeToken, collateralCurrency, onCurrencySelection]);

    // Update trade amount
    useEffect(() => {
        if (tradeAmount && parseFloat(tradeAmount) > 0) {
            onUserInput(Field.INPUT, tradeAmount);
        } else {
            onUserInput(Field.INPUT, '');
        }
    }, [tradeAmount, onUserInput]);

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
        
        const executionPrice = trade.executionPrice;
        const priceImpact = trade.priceImpact;
        if (!executionPrice) return false;
        
        // Check token ordering to understand price direction
        const isCorrectOrder = trade.inputAmount.currency === collateralCurrency && 
                              trade.outputAmount.currency === tradeDirection.outcomeToken;
        
        // Get the average execution price from the trade
        const rawPrice = parseFloat(executionPrice.toSignificant(6));
        const avgPrice = isCorrectOrder ? rawPrice : 1 / rawPrice;
        
        // Estimate the final spot price after trade execution
        let estimatedFinalPrice = avgPrice;
        
        // If the SDK provides post-trade pool state, use it directly
        // @ts-ignore - Check if swaps array has pool state info
        if (v3Trade && v3Trade.swaps && v3Trade.swaps.length > 0) {
            const lastSwap = v3Trade.swaps[v3Trade.swaps.length - 1];
            // @ts-ignore - Access pool's post-trade state if available
            if (lastSwap.route && lastSwap.route.pools && lastSwap.route.pools.length > 0) {
                const finalPool = lastSwap.route.pools[lastSwap.route.pools.length - 1];
                // Try to get the post-trade price from the pool state
                // This would be the most accurate if available
                if (finalPool.token0Price) {
                    const postPrice = isCorrectOrder 
                        ? parseFloat(finalPool.token0Price.toSignificant(6))
                        : 1 / parseFloat(finalPool.token0Price.toSignificant(6));
                    estimatedFinalPrice = postPrice;
                }
            }
        }
        
        // Fallback: Estimate using price impact
        // The impactPercent / 2 approximation assumes linear price movement
        // which is reasonable for small trades but less accurate for large ones
        if (estimatedFinalPrice === avgPrice && priceImpact) {
            const impactPercent = parseFloat(priceImpact.toSignificant(6)) / 100;
            // We use impactPercent / 2 because the average execution price
            // is typically halfway between the starting and ending spot prices
            estimatedFinalPrice = avgPrice * (1 + impactPercent / 2);
        }
        
        // Ensure price is within valid range [0, 1] for prediction markets
        const postTradePrice = Math.min(1, Math.max(0, estimatedFinalPrice));
        
        if (tradeDirection.type === 'up') {
            // Buying UP tokens increases their price, raising the market estimate
            const postTradeEstimate = marketEstimate.lower + (marketEstimate.range * postTradePrice);
            return postTradeEstimate > sliderValue;
        } else {
            // Buying DOWN tokens increases their price, lowering the market estimate
            const postTradeEstimate = marketEstimate.upper - (marketEstimate.range * postTradePrice);
            return postTradeEstimate < sliderValue;
        }
    }, [trade, tradeDirection, marketEstimate, sliderValue, collateralCurrency, v3Trade]);

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