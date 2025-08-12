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
    
    // DEBUG: Log everything to understand the issue
    useEffect(() => {
        if (market && outcomes) {
            console.log('=== SwapModule Debug Start ===');
            console.log('1. Market outcomes (FULL with Invalid):', market.outcomes);
            console.log('2. Filtered outcomes (passed as prop):', outcomes);
            console.log('3. Currently selected index:', localSelectedOutcome);
            console.log('4. Currently selected outcome name:', outcomes[localSelectedOutcome]);
            
            // Log wrapped tokens parsing
            if (market.wrappedTokens) {
                console.log('5. market.wrappedTokens (raw):', market.wrappedTokens);
            }
            if (market.wrappedTokensString) {
                console.log('6. market.wrappedTokensString (raw):', market.wrappedTokensString);
            }
        }
    }, [market, outcomes, localSelectedOutcome]);
    

    // Get ALL wrapped tokens for the market (including Invalid)
    // We keep them all because they map 1:1 with market.outcomes
    const wrappedTokens = useMemo(() => {
        let allTokens: string[] = [];
        
        console.log('=== Parsing Wrapped Tokens ===');
        console.log('Raw market.wrappedTokens:', market?.wrappedTokens);
        console.log('Raw market.wrappedTokensString:', market?.wrappedTokensString);
        
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
            console.log('wrappedTokensString is already an array');
            allTokens = tokensString.map(s => s.trim().toLowerCase());
        }
        // Check if it's a comma-separated string
        else if (typeof tokensString === 'string' && tokensString.includes(',')) {
            console.log('wrappedTokensString is comma-separated');
            allTokens = tokensString.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
        }
        // Otherwise try to parse it as JSON
        else {
            try {
                console.log('Trying to parse wrappedTokensString as JSON');
                const parsed = JSON.parse(tokensString);
                if (Array.isArray(parsed)) {
                    allTokens = parsed.map(s => s.trim().toLowerCase());
                }
            } catch (error) {
                // If JSON parsing fails and it's a string, it might be a single address
                if (typeof tokensString === 'string') {
                    console.log('wrappedTokensString is a single address');
                    allTokens = [tokensString.trim().toLowerCase()];
                }
            }
        }
        
        console.log('FINAL parsed tokens array:', allTokens);
        console.log('Tokens count:', allTokens.length, 'Outcomes count:', market?.outcomes?.length);
        console.log('=== End Parsing Wrapped Tokens ===');
        
        return allTokens;
    }, [market?.wrappedTokensString, market?.outcomes]);

    // Get the outcome token address based on selection
    const outcomeTokenAddress = useMemo(() => {
        if (!wrappedTokens || wrappedTokens.length === 0 || !market?.outcomes) {
            return null;
        }
        
        // Debug: Let's see what we have
        console.log('=== Token Address Selection Debug ===');
        console.log('A. Full market.outcomes (including Invalid):', market.outcomes);
        console.log('B. Filtered outcomes (without Invalid):', outcomes);
        console.log('C. All wrapped tokens:', wrappedTokens);
        console.log('D. Current selected index in filtered:', localSelectedOutcome);
        console.log('E. Current selected outcome name:', outcomes[localSelectedOutcome]);
        
        // The outcomes prop has Invalid filtered out, but wrappedTokens maps 1:1 with market.outcomes
        // However, Invalid is typically the LAST outcome, not the first
        // So if we have ["Yes", "No", "Invalid"] and filter to ["Yes", "No"]
        // The indices should actually match for non-Invalid outcomes
        
        const selectedOutcomeName = outcomes[localSelectedOutcome];
        const fullOutcomeIndex = market.outcomes.findIndex(o => o === selectedOutcomeName);
        
        console.log('F. Index of', selectedOutcomeName, 'in full market.outcomes:', fullOutcomeIndex);
        
        if (fullOutcomeIndex === -1 || fullOutcomeIndex >= wrappedTokens.length) {
            console.log('ERROR: Outcome not found or index out of bounds');
            console.log('   - Selected outcome name:', selectedOutcomeName);
            console.log('   - Full outcome index:', fullOutcomeIndex);
            console.log('   - Wrapped tokens length:', wrappedTokens.length);
            return null;
        }
        
        const address = wrappedTokens[fullOutcomeIndex];
        
        console.log('G. FINAL: Selected token address:', address);
        console.log('   - This is wrappedTokens[' + fullOutcomeIndex + ']');
        console.log('=== Token Address Selection Debug End ===');
        
        return address;
    }, [wrappedTokens, localSelectedOutcome, outcomes, market?.outcomes]);

    // Get collateral token address
    const collateralTokenAddress = market?.collateralToken?.id;

    // Use currency hooks to get the actual currency objects
    const outcomeCurrencyFromHook = useCurrency(outcomeTokenAddress || undefined);
    const collateralCurrencyFromHook = useCurrency(collateralTokenAddress || undefined);
    
    // Force create tokens if the hook doesn't resolve them
    const outcomeCurrency = useMemo(() => {
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
        
        // If we have a currency from the hook, we need to override its symbol/name with the correct outcome name
        if (outcomeCurrencyFromHook && outcomeCurrencyFromHook instanceof Token) {
            // Create a new token with the correct symbol and name
            return new Token(
                outcomeCurrencyFromHook.chainId,
                outcomeCurrencyFromHook.address,
                outcomeCurrencyFromHook.decimals,
                selectedOutcomeName || outcomeCurrencyFromHook.symbol,
                `${selectedOutcomeName} Token`
            );
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
        if (collateralCurrencyFromHook) return collateralCurrencyFromHook;
        
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

    // Auto-select currencies when outcome changes
    useEffect(() => {
        if (outcomeCurrency && collateralCurrency) {
            console.log('11. Setting currencies:');
            console.log('   - Collateral (INPUT):', collateralCurrency);
            console.log('   - Outcome (OUTPUT):', outcomeCurrency);
            
            // Set collateral as input (selling collateral)
            onCurrencySelection(Field.INPUT, collateralCurrency);
            // Set outcome as output (buying outcome)  
            onCurrencySelection(Field.OUTPUT, outcomeCurrency);
            
            // Force a re-render by updating typedValue if it's empty
            if (!typedValue) {
                onUserInput(Field.INPUT, '');
            }
        }
    }, [outcomeCurrency, collateralCurrency, localSelectedOutcome, onCurrencySelection, typedValue, onUserInput]);
    
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

    const maxInputAmount = useMemo(() => {
        if (!currencyBalances[Field.INPUT]) return undefined;
        return currencyBalances[Field.INPUT];
    }, [currencyBalances]);

    const handleMaxInput = useCallback(() => {
        if (maxInputAmount) {
            onUserInput(Field.INPUT, maxInputAmount.toExact());
        }
    }, [maxInputAmount, onUserInput]);
    
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

    // Calculate outcome price from pool data
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
            // Price is collateral/outcome (how much collateral per outcome)
            // token0Price is token1/token0, so we need the inverse
            price = parseFloat(relevantPool.token1Price) || 0;
        } else {
            // Price is collateral/outcome
            // token1Price is token0/token1
            price = parseFloat(relevantPool.token0Price) || 0;
        }
        
        // Ensure price is within valid range [0, 1]
        return Math.max(0, Math.min(1, price));
    }, [pools, outcomeTokenAddress, collateralTokenAddress]);

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
                            <span><Trans>You pay</Trans></span>
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
                            id="swap-currency-input"
                            hideInput={false}
                            hideBalance={false}
                            locked={false}
                            disabled={false}
                            shallow={false}
                            swap={true}
                        />
                    </div>

                    <ArrowWrapper clickable={false} style={{ cursor: 'default', opacity: 0.5 }}>
                        <ArrowDown size="16" color="#6c7284" />
                    </ArrowWrapper>

                    <div className="currency-input-wrapper">
                        <div className="input-label">
                            <span><Trans>You receive</Trans></span>
                        </div>
                        <NewCurrencyInputPanel
                            title=""
                            value={formattedAmounts[Field.OUTPUT]}
                            showMaxButton={false}
                            currency={currencies[Field.OUTPUT] as WrappedCurrency | null}
                            onUserInput={(value) => handleTypeInput(Field.OUTPUT, value)}
                            onCurrencySelect={undefined} // Disable currency selection
                            otherCurrency={currencies[Field.INPUT]}
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
                                1 {currencies[Field.INPUT]?.symbol} = {trade.executionPrice.toSignificant(6)} {currencies[Field.OUTPUT]?.symbol}
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