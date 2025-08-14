import React, { useState, useCallback, useMemo } from "react";
import { Trans } from "@lingui/macro";
import { Info } from "react-feather";
import { useAccount, useChainId } from "wagmi";
import { Market, Pool } from "../../utils/market";
import { calculateScalarMarketEstimate } from "../../utils/marketPrices";
import { useScalarTrade } from "../../hooks/useScalarTrade";
import { MarketEstimateDisplay } from "./components/MarketEstimateDisplay";
import { PredictionSlider } from "./components/PredictionSlider";
import { TradePreview } from "./components/TradePreview";
import { TradeExecution } from "./components/TradeExecution";
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
    
    // Local UI state
    const [sliderValue, setSliderValue] = useState<number>(0);
    const [tradeAmount, setTradeAmount] = useState<string>('');
    const [hasUserModifiedSlider, setHasUserModifiedSlider] = useState(false);
    
    // Calculate current market estimate
    const marketEstimate = useMemo(() => {
        return calculateScalarMarketEstimate(pools, market);
    }, [market, pools]);
    
    // Initialize slider value to current market estimate
    React.useEffect(() => {
        if (marketEstimate && !hasUserModifiedSlider) {
            setSliderValue(marketEstimate.current);
        }
    }, [marketEstimate, hasUserModifiedSlider]);
    
    // Use the custom hook for all trading logic
    const {
        tradeDirection,
        collateralCurrency,
        trade,
        approvalState,
        swapInputError,
        swapCallbackError,
        priceImpact,
        wouldOvershootTarget,
        isValidTrade,
        allowedSlippage,
        handleApprove,
        executeTrade,
    } = useScalarTrade({
        market,
        pools,
        sliderValue,
        tradeAmount,
        chainId
    });
    
    // Handle slider change
    const handleSliderChange = useCallback((value: number) => {
        setSliderValue(value);
        setHasUserModifiedSlider(true);
    }, []);
    
    // Handle reset to current
    const handleResetToCurrent = useCallback(() => {
        if (marketEstimate) {
            setSliderValue(marketEstimate.current);
            setHasUserModifiedSlider(false);
        }
    }, [marketEstimate]);
    
    // Handle trade execution
    const handleTrade = useCallback(async () => {
        try {
            const txHash = await executeTrade();
            console.log('Trade successful:', txHash);
            
            // Clear inputs after successful trade
            setTradeAmount('');
            
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
    
    // Early return if not a scalar market
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
            {/* Market Estimate Display */}
            <MarketEstimateDisplay marketEstimate={marketEstimate} />
            
            {/* Prediction Slider */}
            <PredictionSlider
                sliderValue={sliderValue}
                marketEstimate={marketEstimate}
                hasUserModifiedSlider={hasUserModifiedSlider}
                onSliderChange={handleSliderChange}
                onReset={handleResetToCurrent}
            />
            
            {/* Trade Preview */}
            <TradePreview
                tradeDirection={tradeDirection}
                trade={trade}
                tradeAmount={tradeAmount}
                collateralSymbol={collateralSymbol}
                sliderValue={sliderValue}
                priceImpact={priceImpact}
                wouldOvershootTarget={wouldOvershootTarget}
            />
            
            {/* Trade Execution */}
            <TradeExecution
                tradeAmount={tradeAmount}
                onTradeAmountChange={setTradeAmount}
                collateralSymbol={collateralSymbol}
                isConnected={isConnected}
                approvalState={approvalState}
                trade={trade}
                isValidTrade={isValidTrade || false}
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