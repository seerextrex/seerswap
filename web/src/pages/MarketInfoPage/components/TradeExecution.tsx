import React, { FC, useState, useCallback, useEffect } from "react";
import { Trans, t } from "@lingui/macro";
import { DollarSign } from "react-feather";
import { ConnectKitButton } from "connectkit";
import { ButtonPrimary } from "../../../components/Button";
import { ApprovalState } from "../../../hooks/useApproveCallback";
import { useBatchedSwap } from "../../../hooks/useBatchedSwap";
import { Trade as V3Trade } from "lib/src";
import { Currency, TradeType } from "@uniswap/sdk-core";

interface TradeExecutionProps {
    tradeAmount: string;
    onTradeAmountChange: (amount: string) => void;
    collateralSymbol: string;
    isConnected: boolean;
    approvalState: ApprovalState;
    trade: V3Trade<Currency, Currency, TradeType> | undefined;
    isValidTrade: boolean;
    swapInputError: string | undefined;
    swapCallbackError: string | null;
    sliderValue: number;
    tradeDirection: any;
    wouldOvershootTarget: boolean;
    allowedSlippage: any;
    chainId?: number;
    onApprove: () => Promise<void>;
    onTrade: () => Promise<void>;
}

export const TradeExecution: FC<TradeExecutionProps> = ({
    tradeAmount,
    onTradeAmountChange,
    collateralSymbol,
    isConnected,
    approvalState,
    trade,
    isValidTrade,
    swapInputError,
    swapCallbackError,
    sliderValue,
    tradeDirection,
    wouldOvershootTarget,
    allowedSlippage,
    chainId,
    onApprove,
    onTrade
}) => {
    const [isTrading, setIsTrading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [approvalSubmitted, setApprovalSubmitted] = useState(false);
    const [supportsBatching, setSupportsBatching] = useState(false);

    // Setup batched swap for EIP-7702
    const { executeBatchedSwap, isExecuting: isBatchExecuting, canExecute: canBatchExecute } = useBatchedSwap({
        trade,
        allowedSlippage,
        needsApproval: approvalState !== ApprovalState.APPROVED,
        onSuccess: async (txHash) => {
            console.log('Batched trade successful:', txHash);
            onTradeAmountChange('');
            setIsTrading(false);
        },
        onError: (error) => {
            console.error('Batched trade failed:', error);
            setErrorMessage(error.message || 'Transaction failed. Please try again.');
            setIsTrading(false);
            setTimeout(() => setErrorMessage(null), 5000);
        },
    });

    // Check if wallet supports EIP-7702 batching
    useEffect(() => {
        const checkBatchingSupport = async () => {
            if (typeof window !== 'undefined' && window.ethereum && isConnected) {
                try {
                    const provider = window.ethereum as any;
                    
                    if (provider.request) {
                        try {
                            // Request wallet capabilities
                            const capabilities = await provider.request({
                                method: 'wallet_getCapabilities',
                                params: [],
                            }).catch(() => null);
                            
                            if (!capabilities) {
                                setSupportsBatching(false);
                                return;
                            }
                            
                            // Check for specific batching capabilities
                            // EIP-5792 defines wallet_sendCalls for batch transactions
                            // EIP-7702 uses atomicBatch capability
                            const hasAtomicBatch = capabilities['atomicBatch']?.supported === true;
                            const hasPaymasterService = capabilities['paymasterService']?.supported === true;
                            const hasSendCalls = capabilities['wallet_sendCalls']?.supported === true;
                            
                            // Also check for chain-specific capabilities
                            const chainCapabilities = capabilities[`0x${chainId?.toString(16)}`];
                            const hasChainBatching = chainCapabilities?.['atomicBatch']?.supported === true;
                            
                            // Wallet supports batching if it has any of these capabilities
                            const supportsBatch = hasAtomicBatch || hasPaymasterService || hasSendCalls || hasChainBatching;
                            
                            setSupportsBatching(supportsBatch);
                            
                            // Log capabilities for debugging
                            console.log('Wallet capabilities:', {
                                capabilities,
                                hasAtomicBatch,
                                hasPaymasterService,
                                hasSendCalls,
                                hasChainBatching,
                                supportsBatch
                            });
                        } catch (error) {
                            console.error('Error checking wallet capabilities:', error);
                            setSupportsBatching(false);
                        }
                    } else {
                        setSupportsBatching(false);
                    }
                } catch {
                    setSupportsBatching(false);
                }
            }
        };
        
        if (isConnected) {
            checkBatchingSupport();
        }
    }, [isConnected, chainId]);

    // Track approval state
    useEffect(() => {
        if (approvalState === ApprovalState.PENDING) {
            setApprovalSubmitted(true);
        }
    }, [approvalState]);

    const handleTrade = useCallback(async () => {
        // Use batched swap if supported and approval is needed
        if (supportsBatching && approvalState !== ApprovalState.APPROVED && canBatchExecute) {
            console.log('Using EIP-7702 batched transaction');
            setIsTrading(true);
            await executeBatchedSwap();
            return;
        }
        
        setIsTrading(true);
        try {
            await onTrade();
            onTradeAmountChange('');
        } catch (error: any) {
            console.error('Trade failed:', error);
            setErrorMessage(error.message || 'Transaction failed');
            setTimeout(() => setErrorMessage(null), 5000);
        } finally {
            setIsTrading(false);
        }
    }, [supportsBatching, approvalState, canBatchExecute, executeBatchedSwap, onTrade, onTradeAmountChange]);

    const buttonText = useCallback(() => {
        if (isTrading) return t`Processing...`;
        if (!tradeDirection) return t`Move slider to trade`;
        if (wouldOvershootTarget) return t`Amount too large`;
        if (swapInputError) return swapInputError;
        if (!trade) return t`Enter amount`;
        if (parseFloat(tradeAmount) === 0) return t`Enter amount`;
        return t`Trade to ${sliderValue.toFixed(2)}`;
    }, [isTrading, tradeDirection, swapInputError, trade, sliderValue, wouldOvershootTarget, tradeAmount]);

    return (
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
                        onChange={(e) => onTradeAmountChange(e.target.value)}
                        placeholder="Enter amount"
                        min="0"
                        step="1"
                    />
                </div>
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
                <ButtonPrimary
                    onClick={onApprove}
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
                <ButtonPrimary 
                    onClick={handleTrade}
                    disabled={!isValidTrade || isTrading || (approvalState !== ApprovalState.APPROVED && approvalState !== ApprovalState.UNKNOWN)}
                    className="trade-button"
                >
                    {buttonText()}
                </ButtonPrimary>
            )}
            
            {supportsBatching && approvalState !== ApprovalState.APPROVED && isValidTrade && (
                <div className="batch-info">
                    <div className="batch-badge">
                        <span className="badge-icon">⚡</span>
                        <span className="badge-text"><Trans>1-Click Trade</Trans></span>
                    </div>
                    <span className="batch-description"><Trans>Approve + Swap in one transaction</Trans></span>
                </div>
            )}
            
            {(errorMessage || (swapCallbackError && swapCallbackError !== "Missing dependencies")) && (
                <div className="error-message">
                    {errorMessage || swapCallbackError}
                </div>
            )}
        </div>
    );
};