import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { t, Trans } from "@lingui/macro";
import { Currency, CurrencyAmount, Token, Percent, TradeType } from "@uniswap/sdk-core";
import { ArrowDown, ChevronDown } from "react-feather";
import { useAccount, useChainId } from "wagmi";
import { ConnectKitButton } from "connectkit";
import NewCurrencyInputPanel from "../../components/CurrencyInputPanel/NewCurrencyInputPanel";
import { ButtonError, ButtonPrimary } from "../../components/Button";
import { AutoColumn } from "../../components/Column";
import { ArrowWrapper } from "../../components/swap/styled";
import { useCurrency } from "../../hooks/Tokens";
import { Field } from "../../state/swap/actions";
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from "../../state/swap/hooks";
import { useSwapCallback } from "../../hooks/useSwapCallback";
import { useExpertModeManager } from "../../state/user/hooks";
import { Trade as V3Trade } from "lib/src";
import { WrappedCurrency } from "../../models/types";
import { useUSDCValue } from "../../hooks/useUSDCPrice";
import { computeFiatValuePriceImpact } from "../../utils/computeFiatValuePriceImpact";
import { usePredictionMarketUSDCValue } from "../../hooks/usePredictionMarketUSDCValue";
import { Market, Pool, TokenMetadata } from "../../types/market";
import { createTokenFromMarketData, extractTokenAddresses, isTokenMetadata } from "../../utils/tokenHelpers";
import "./SwapModule.scss";

interface SwapModuleProps {
    market: Market;
    outcomes: string[];
    selectedOutcome?: number;
    onOutcomeSelect?: (index: number) => void;
    pools?: Pool[];
}

export function SwapModule({ 
    market, 
    outcomes, 
    selectedOutcome,
    onOutcomeSelect,
    pools 
}: SwapModuleProps) {
    const { address: account, isConnected } = useAccount();
    const chainId = useChainId();
    const [isOutcomeDropdownOpen, setIsOutcomeDropdownOpen] = useState(false);
    const [localSelectedOutcome, setLocalSelectedOutcome] = useState(selectedOutcome ?? 0);
    const [isSwapping, setIsSwapping] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isExpertMode] = useExpertModeManager();
    
    // Update local state when prop changes
    useEffect(() => {
        if (selectedOutcome !== undefined && selectedOutcome !== localSelectedOutcome) {
            setLocalSelectedOutcome(selectedOutcome);
        }
    }, [selectedOutcome]);
    
    

    // Get ALL wrapped tokens for the market (including Invalid)
    // We keep them all because they map 1:1 with market.outcomes
    const wrappedTokens = useMemo(() => {
        let allTokens: string[] = [];
        
        // IMPORTANT: Use wrappedTokensString for correct ordering!
        // The wrappedTokens array (token objects) has a different order than market.outcomes
        // The wrappedTokensString array has the correct order matching market.outcomes
        
        const tokensString = market?.wrappedTokensString;
        
        if (!tokensString) {
            console.log('No wrappedTokensString found');
            return [];
        }
        
        // If it's already an array, use it
        if (Array.isArray(tokensString)) {
            allTokens = tokensString.map(s => s.trim().toLowerCase());
        }
        // Check if it's a comma-separated string
        else if (typeof tokensString === 'string' && tokensString.includes(',')) {
            allTokens = tokensString.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
        }
        // Otherwise try to parse it as JSON
        else {
            try {
                const parsed = JSON.parse(tokensString);
                if (Array.isArray(parsed)) {
                    allTokens = parsed.map(s => s.trim().toLowerCase());
                }
            } catch (error) {
                // If JSON parsing fails and it's a string, it might be a single address
                if (typeof tokensString === 'string') {
                    allTokens = [tokensString.trim().toLowerCase()];
                }
            }
        };
        
        return allTokens;
    }, [market?.wrappedTokensString, market?.outcomes]);

    // Get the outcome token address based on selection
    const outcomeTokenAddress = useMemo(() => {
        if (!wrappedTokens || wrappedTokens.length === 0 || !market?.outcomes) {
            return null;
        }
        
        const selectedOutcomeName = outcomes[localSelectedOutcome];
        const fullOutcomeIndex = market.outcomes.findIndex(o => o === selectedOutcomeName);
        
        if (fullOutcomeIndex === -1 || fullOutcomeIndex >= wrappedTokens.length) {
            return null;
        }
        
        const address = wrappedTokens[fullOutcomeIndex];
        
        return address;
    }, [wrappedTokens, localSelectedOutcome, outcomes, market?.outcomes]);

    // Get collateral token address
    const collateralTokenAddress = market?.collateralToken?.id;

    // Use currency hooks to get the actual currency objects
    const outcomeCurrencyFromHook = useCurrency(outcomeTokenAddress || undefined);
    const collateralCurrencyFromHook = useCurrency(collateralTokenAddress || undefined);
    
    
    // Force create tokens if the hook doesn't resolve them
    const outcomeCurrency = useMemo(() => {
        if (!outcomeTokenAddress || !chainId) return null;
        
        const selectedOutcomeName = outcomes[localSelectedOutcome];
        
        // Get token metadata if available
        // Since wrappedTokens array has wrong order, we need to find the token by address
        let tokenMetadata: TokenMetadata | null = null;
        if (market?.wrappedTokens && outcomeTokenAddress) {
            // Find the token metadata by matching the address
            const matchingToken = market.wrappedTokens.find((token: any) => 
                token?.id?.toLowerCase() === outcomeTokenAddress.toLowerCase()
            );
            if (matchingToken && isTokenMetadata(matchingToken)) {
                tokenMetadata = matchingToken as TokenMetadata;
            }
        }
        
        // If we have a currency from the hook, use it but with corrected name
        if (outcomeCurrencyFromHook && outcomeCurrencyFromHook instanceof Token) {
            // Return the token from the hook since it will have proper balance tracking
            // But only if the address matches
            if (outcomeCurrencyFromHook.address.toLowerCase() === outcomeTokenAddress.toLowerCase()) {
                return outcomeCurrencyFromHook;
            }
        }
        
        // Otherwise create a new token from scratch
        return createTokenFromMarketData(
            outcomeTokenAddress,
            tokenMetadata,
            chainId,
            selectedOutcomeName || `Outcome ${localSelectedOutcome}`,
            `${selectedOutcomeName || `Outcome ${localSelectedOutcome}`} Token`
        );
    }, [outcomeCurrencyFromHook, outcomeTokenAddress, market?.wrappedTokens, outcomes, localSelectedOutcome, chainId]);
    
    const collateralCurrency = useMemo(() => {
        // Prefer the currency from the hook as it will have proper balance tracking
        if (collateralCurrencyFromHook) return collateralCurrencyFromHook;
        
        if (!collateralTokenAddress || !chainId) return null;
        
        return createTokenFromMarketData(
            collateralTokenAddress,
            market?.collateralToken,
            chainId,
            market?.collateralToken?.symbol || 'COLLATERAL',
            market?.collateralToken?.name || 'Collateral Token',
            18 // Use default decimals, the function will handle getting proper decimals from metadata
        );
    }, [collateralCurrencyFromHook, collateralTokenAddress, market?.collateralToken, chainId]);
    

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
    
    // Get swap callback (only for V3 trades)
    const v3Trade = trade && 'swaps' in trade ? trade as V3Trade<Currency, Currency, TradeType> : undefined;
    const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
        v3Trade,
        allowedSlippage,
        recipient,
        undefined // No signature data for now
    );

    // Track swap direction (false = buying outcome, true = selling outcome)
    const [isReversed, setIsReversed] = useState(false);
    
    // Auto-select currencies when outcome changes or direction changes
    useEffect(() => {
        if (outcomeCurrency && collateralCurrency) {
            
            if (!isReversed) {
                // Normal direction: buying outcome with collateral
                onCurrencySelection(Field.INPUT, collateralCurrency);
                onCurrencySelection(Field.OUTPUT, outcomeCurrency);
            } else {
                // Reversed: selling outcome for collateral
                onCurrencySelection(Field.INPUT, outcomeCurrency);
                onCurrencySelection(Field.OUTPUT, collateralCurrency);
            }
            
            // Force a re-render by updating typedValue if it's empty
            if (!typedValue) {
                onUserInput(Field.INPUT, '');
            }
        }
    }, [outcomeCurrency, collateralCurrency, localSelectedOutcome, isReversed, onCurrencySelection, typedValue, onUserInput]);
    
    // Handle click outside and escape key for dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOutcomeDropdownOpen(false);
            }
        };
        
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOutcomeDropdownOpen) {
                setIsOutcomeDropdownOpen(false);
            }
        };
        
        if (isOutcomeDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOutcomeDropdownOpen]);

    const handleOutcomeSelect = useCallback((index: number) => {
        // Validate index bounds
        if (index >= 0 && index < outcomes.length) {
            setLocalSelectedOutcome(index);
            setIsOutcomeDropdownOpen(false);
            setIsReversed(false); // Reset to buying direction when changing outcome
            onOutcomeSelect?.(index);
        }
    }, [onOutcomeSelect, outcomes.length]);

    const handleTypeInput = useCallback((field: Field, value: string) => {
        onUserInput(field, value);
    }, [onUserInput]);

    const formattedAmounts = useMemo(() => ({
        [Field.INPUT]: independentField === Field.INPUT 
            ? typedValue 
            : trade?.inputAmount?.toSignificant(6) ?? '',
        [Field.OUTPUT]: independentField === Field.OUTPUT 
            ? typedValue 
            : trade?.outputAmount?.toSignificant(6) ?? '',
    }), [independentField, typedValue, trade]);
    
    // Calculate parsed amounts for fiat value calculation
    const parsedAmounts = useMemo(
        () => ({
            [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
            [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
        }),
        [independentField, parsedAmount, trade]
    );

    // Calculate outcome price from pool data (moved before fiatValue calculation)
    const outcomePrice = useMemo(() => {
        if (!pools || pools.length === 0 || !outcomeTokenAddress || !collateralTokenAddress) {
            return 0; // No price available
        }
        
        // Find the pool for this outcome token and collateral
        const relevantPool = pools.find(pool => {
            if (!pool.token0?.id || !pool.token1?.id) return false;
            
            const hasOutcomeToken = pool.token0.id.toLowerCase() === outcomeTokenAddress.toLowerCase() || 
                                   pool.token1.id.toLowerCase() === outcomeTokenAddress.toLowerCase();
            const hasCollateral = pool.token0.id.toLowerCase() === collateralTokenAddress.toLowerCase() || 
                                 pool.token1.id.toLowerCase() === collateralTokenAddress.toLowerCase();
            return hasOutcomeToken && hasCollateral;
        });
        
        if (!relevantPool) {
            return 0; // No pool found for this pair
        }
        
        // Calculate price based on which token is which
        const isToken0Outcome = relevantPool.token0.id.toLowerCase() === outcomeTokenAddress.toLowerCase();
        
        let price = 0;
        if (isToken0Outcome) {
            // Token0 is outcome, Token1 is collateral
            // token0Price = price of token0 in terms of token1 = outcome price in collateral
            price = parseFloat(relevantPool.token0Price) || 0;
        } else {
            // Token0 is collateral, Token1 is outcome  
            // token1Price = price of token1 in terms of token0 = outcome price in collateral
            price = parseFloat(relevantPool.token1Price) || 0;
        }
        
        // Ensure price is within valid range [0, 1] for prediction markets
        return Math.max(0, Math.min(1, price));
    }, [pools, outcomeTokenAddress, collateralTokenAddress]);
    
    // Calculate fiat values for prediction market tokens
    // For collateral input, use standard USDC value
    // For outcome output, calculate through collateral price
    const fiatValueInput = usePredictionMarketUSDCValue(
        parsedAmounts[Field.INPUT],
        collateralCurrency,
        1 // Collateral is worth 1 collateral
    );
    
    const fiatValueOutput = usePredictionMarketUSDCValue(
        parsedAmounts[Field.OUTPUT],
        collateralCurrency,
        outcomePrice // Use the calculated outcome price
    );
    
    const priceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput);
    
    const maxInputAmount = useMemo(() => {
        if (!currencyBalances[Field.INPUT]) return undefined;
        return currencyBalances[Field.INPUT];
    }, [currencyBalances]);

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
    
    // Handle swap execution
    const handleSwap = useCallback(async () => {
        if (!swapCallback) {
            return;
        }
        
        setIsSwapping(true);
        
        try {
            const txHash = await swapCallback();
            
            // Clear input after successful swap
            onUserInput(Field.INPUT, '');
        } catch (error) {
            // Error is already handled by swapCallbackError
        } finally {
            setIsSwapping(false);
        }
    }, [swapCallback, onUserInput]);

    // Validate props after all hooks are called
    if (!market || !outcomes || outcomes.length === 0) {
        return (
            <div className="swap-module">
                <div className="swap-module__header">
                    <h3><Trans>Swap</Trans></h3>
                </div>
                <div className="swap-module__body">
                    <div className="wallet-required-message">
                        <p><Trans>Market data not available</Trans></p>
                    </div>
                </div>
            </div>
        );
    }

    // Show message if wallet not connected and chain ID is needed
    if (!chainId) {
        return (
            <div className="swap-module">
                <div className="swap-module__header">
                    <h3><Trans>Swap</Trans></h3>
                </div>
                <div className="swap-module__body">
                    <div className="wallet-required-message">
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
        );
    }

    return (
        <div className="swap-module">
            <div className="swap-module__header">
                <h3><Trans>Swap</Trans></h3>
                <div className="outcome-selector" ref={dropdownRef}>
                    <button 
                        className="outcome-selector__button"
                        onClick={() => setIsOutcomeDropdownOpen(!isOutcomeDropdownOpen)}
                        aria-haspopup="true"
                        aria-expanded={isOutcomeDropdownOpen}
                        aria-label={`Select outcome. Current: ${outcomes[localSelectedOutcome]}`}
                    >
                        <span className="outcome-name">
                            {outcomes[localSelectedOutcome] || `Outcome ${localSelectedOutcome + 1}`}
                        </span>
                        <span className="outcome-price" aria-label={`Price: ${(outcomePrice * 100).toFixed(1)} percent`}>
                            {(outcomePrice * 100).toFixed(1)}%
                        </span>
                        <ChevronDown 
                            size={16} 
                            className={`chevron ${isOutcomeDropdownOpen ? 'open' : ''}`}
                            aria-hidden="true"
                        />
                    </button>
                    
                    {isOutcomeDropdownOpen && (
                        <div 
                            className="outcome-dropdown"
                            role="menu"
                            aria-label="Select an outcome"
                        >
                            {outcomes.map((outcome, index) => (
                                <button
                                    key={index}
                                    className={`outcome-option ${index === localSelectedOutcome ? 'selected' : ''}`}
                                    onClick={() => handleOutcomeSelect(index)}
                                    role="menuitem"
                                    aria-selected={index === localSelectedOutcome}
                                    tabIndex={isOutcomeDropdownOpen ? 0 : -1}
                                >
                                    <span className="outcome-name">{outcome}</span>
                                    <span className="outcome-badge" aria-hidden="true">
                                        {index === localSelectedOutcome && '✓'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="swap-module__body">
                <AutoColumn gap="md">
                    <div className="currency-input-wrapper">
                        <div className="input-label">
                            <span>
                                {!isReversed ? (
                                    <Trans>You pay</Trans>
                                ) : (
                                    <Trans>You sell</Trans>
                                )}
                            </span>
                            {maxInputAmount && (
                                <button className="max-button" onClick={handleMaxInput}>
                                    <Trans>Max</Trans>
                                </button>
                            )}
                        </div>
                        <NewCurrencyInputPanel
                            title=""
                            value={formattedAmounts[Field.INPUT]}
                            showMaxButton={false}
                            currency={currencies[Field.INPUT] as WrappedCurrency | null}
                            onUserInput={(value) => handleTypeInput(Field.INPUT, value)}
                            onCurrencySelect={undefined} // Disable currency selection
                            otherCurrency={currencies[Field.OUTPUT]}
                            fiatValue={fiatValueInput ?? undefined}
                            id="swap-currency-input"
                            hideInput={false}
                            hideBalance={false}
                            locked={false}
                            disabled={false}
                            shallow={false}
                            swap={true}
                        />
                    </div>

                    <ArrowWrapper clickable onClick={handleSwitchTokens}>
                        <ArrowDown size="16" color="#6c7284" />
                    </ArrowWrapper>

                    <div className="currency-input-wrapper">
                        <div className="input-label">
                            <span>
                                {!isReversed ? (
                                    <Trans>You receive</Trans>
                                ) : (
                                    <Trans>You get</Trans>
                                )}
                            </span>
                        </div>
                        <NewCurrencyInputPanel
                            title=""
                            value={formattedAmounts[Field.OUTPUT]}
                            showMaxButton={false}
                            currency={currencies[Field.OUTPUT] as WrappedCurrency | null}
                            onUserInput={(value) => handleTypeInput(Field.OUTPUT, value)}
                            onCurrencySelect={undefined} // Disable currency selection
                            otherCurrency={currencies[Field.INPUT]}
                            fiatValue={fiatValueOutput ?? undefined}
                            priceImpact={priceImpact}
                            id="swap-currency-output"
                            hideInput={false}
                            hideBalance={false}
                            locked={false}
                            disabled={false}
                            shallow={false}
                            swap={true}
                        />
                    </div>
                </AutoColumn>

                {/* Price Impact and Trade Route Info */}
                {trade && (
                    <div className="swap-details">
                        <div className="detail-row">
                            <span className="label"><Trans>Price</Trans></span>
                            <span className="value">
                                {/* Always show outcome token price in collateral terms, regardless of swap direction */}
                                {!isReversed ? (
                                    // Normal: buying outcome, show outcome price in collateral
                                    <>1 {outcomeCurrency?.symbol} = {trade.executionPrice.invert().toSignificant(6)} {collateralCurrency?.symbol}</>
                                ) : (
                                    // Reversed: selling outcome, show outcome price in collateral
                                    <>1 {outcomeCurrency?.symbol} = {trade.executionPrice.toSignificant(6)} {collateralCurrency?.symbol}</>
                                )}
                            </span>
                        </div>
                        <div className="detail-row">
                            <span className="label"><Trans>Slippage Tolerance</Trans></span>
                            <span className="value">{allowedSlippage.toFixed()}%</span>
                        </div>
                    </div>
                )}

                {/* Swap Button */}
                <div className="swap-button-wrapper">
                    {!isConnected ? (
                        <ConnectKitButton.Custom>
                            {({ show }) => (
                                <ButtonPrimary onClick={show}>
                                    <Trans>Connect Wallet</Trans>
                                </ButtonPrimary>
                            )}
                        </ConnectKitButton.Custom>
                    ) : swapInputError || swapCallbackError ? (
                        <ButtonError disabled>
                            {swapInputError || swapCallbackError}
                        </ButtonError>
                    ) : (
                        <ButtonPrimary 
                            onClick={handleSwap}
                            disabled={!trade || !swapCallback || isSwapping}
                        >
                            {isSwapping ? (
                                <Trans>Swapping...</Trans>
                            ) : (
                                <Trans>Swap</Trans>
                            )}
                        </ButtonPrimary>
                    )}
                </div>
            </div>
        </div>
    );
}