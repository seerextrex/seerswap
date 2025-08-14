import React from "react";
import { Trans } from "@lingui/macro";
import { Info, AlertCircle } from "react-feather";
import { useAccount, useChainId } from "wagmi";
import { useScalarTradeV2 } from "../../hooks/useScalarTradeV2";
import { Market, Pool } from "../../utils/market";
import { getExplorerLink } from "../../utils/getExplorerLink";
import { MarketEstimateDisplay } from "./components/MarketEstimateDisplay";
import { PredictionInput } from "./components/PredictionInput";
import { TradePreview } from "./components/TradePreview";
import { TradeExecution } from "./components/TradeExecution";
import "./ScalarMarketInterface.scss";

interface ScalarMarketInterfaceV2Props {
    market: Market;
    pools: Pool[];
    onTrade?: (targetValue: number, tradeType: 'up' | 'down', amount: number) => void;
}

/**
 * ScalarMarketInterfaceV2 - Pure layout component
 * All business logic and state management is handled by useScalarTradeV2 hook
 */
export const ScalarMarketInterfaceV2: React.FC<ScalarMarketInterfaceV2Props> = ({ 
    market, 
    pools,
    onTrade 
}) => {
    // Get chain and account info
    const chainId = useChainId();
    const { isConnected } = useAccount();
    
    // Use the single source of truth hook
    const {
        marketEstimate,
        sliderValue,
        tradeAmount,
        hasUserModifiedSlider,
        tradeDirection,
        collateralCurrency,
        trade,
        approvalState,
        approvalTransaction,
        tradeTransaction,
        swapInputError,
        swapCallbackError,
        priceImpact,
        wouldOvershootTarget,
        isValidTrade,
        allowedSlippage,
        collateralBalance,
        hasInsufficientBalance,
        setSliderValue,
        setTradeAmount,
        resetToCurrent,
        handleApprove,
        executeTrade,
        isLoading,
        isApproving,
        isTrading,
    } = useScalarTradeV2({ market, pools });
    
    // Handle trade with callback
    const handleTrade = React.useCallback(async () => {
        try {
            await executeTrade();
            
            // Call optional callback
            if (onTrade && tradeDirection) {
                onTrade(sliderValue, tradeDirection.type, parseFloat(tradeAmount));
            }
        } catch (error) {
            console.error('Trade failed:', error);
        }
    }, [executeTrade, onTrade, sliderValue, tradeDirection, tradeAmount]);
    
    // Get collateral symbol
    const collateralSymbol = market?.collateralToken?.symbol || 'sDAI';
    
    // Debug logging
    console.log('[ScalarMarketInterfaceV2] Component state:', {
        hasMarket: !!market,
        hasPools: !!pools,
        poolsLength: pools?.length,
        marketEstimate,
        isLoading
    });
    
    // Early return if not a scalar market
    if (!marketEstimate) {
        return (
            <div className="scalar-market-interface">
                <div className="not-scalar-message">
                    <Info size={20} />
                    <Trans>This market does not support scalar trading</Trans>
                    <div style={{ marginTop: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                        Debug: outcomes={JSON.stringify(market?.outcomes)}, 
                        bounds=[{market?.lowerBound}, {market?.upperBound}]
                    </div>
                </div>
            </div>
        );
    }
    
    // Show loading state
    if (isLoading) {
        return (
            <div className="scalar-market-interface">
                <div className="loading-state">
                    <div className="spinner" />
                    <Trans>Loading market data...</Trans>
                </div>
            </div>
        );
    }
    
    return (
        <div className="scalar-market-interface">
            {/* Market Estimate Display */}
            <MarketEstimateDisplay marketEstimate={marketEstimate} />
            
            {/* Prediction Input with Speedometer Option */}
            <PredictionInput
                sliderValue={sliderValue}
                marketEstimate={marketEstimate}
                hasUserModifiedSlider={hasUserModifiedSlider}
                onSliderChange={setSliderValue}
                onReset={resetToCurrent}
                preferSpeedometer={false} // Can be toggled based on user preference
            />
            
            {/* Trade Preview with Enhanced Warnings */}
            <TradePreview
                tradeDirection={tradeDirection}
                trade={trade}
                tradeAmount={tradeAmount}
                collateralSymbol={collateralSymbol}
                sliderValue={sliderValue}
                priceImpact={priceImpact}
                wouldOvershootTarget={wouldOvershootTarget}
            />
            
            {/* Balance Warning */}
            {hasInsufficientBalance && (
                <div className="warning-message severity-critical">
                    <AlertCircle size={16} />
                    <span>
                        <Trans>Insufficient {collateralSymbol} balance</Trans>
                    </span>
                </div>
            )}
            
            {/* Transaction Status */}
            {approvalTransaction.status === 'pending' && (
                <div className="transaction-status approval">
                    <div className="spinner small" />
                    <span><Trans>Approval transaction pending...</Trans></span>
                </div>
            )}
            
            {approvalTransaction.status === 'success' && tradeTransaction.status === 'idle' && (
                <div className="transaction-status success">
                    <span>✓ <Trans>Approval confirmed!</Trans></span>
                </div>
            )}
            
            {tradeTransaction.status === 'pending' && (
                <div className="transaction-status trade">
                    <div className="spinner small" />
                    <span><Trans>Trade transaction pending...</Trans></span>
                    {tradeTransaction.confirmations > 0 && (
                        <span className="confirmations">
                            ({tradeTransaction.confirmations} confirmations)
                        </span>
                    )}
                </div>
            )}
            
            {tradeTransaction.status === 'success' && (
                <div className="transaction-status success">
                    <span>✓ <Trans>Trade successful!</Trans></span>
                    {tradeTransaction.hash && (
                        <a 
                            href={getExplorerLink(chainId, tradeTransaction.hash, 'transaction')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tx-link"
                        >
                            View transaction
                        </a>
                    )}
                </div>
            )}
            
            {tradeTransaction.status === 'error' && (
                <div className="transaction-status error">
                    <AlertCircle size={16} />
                    <span><Trans>Transaction failed</Trans></span>
                </div>
            )}
            
            {/* Trade Execution */}
            <TradeExecution
                tradeAmount={tradeAmount}
                onTradeAmountChange={setTradeAmount}
                collateralSymbol={collateralSymbol}
                isConnected={isConnected}
                approvalState={approvalState}
                trade={trade}
                isValidTrade={isValidTrade}
                swapInputError={swapInputError}
                swapCallbackError={swapCallbackError}
                sliderValue={sliderValue}
                tradeDirection={tradeDirection}
                wouldOvershootTarget={wouldOvershootTarget}
                allowedSlippage={allowedSlippage}
                chainId={chainId}
                onApprove={handleApprove}
                onTrade={handleTrade}
            />
        </div>
    );
};