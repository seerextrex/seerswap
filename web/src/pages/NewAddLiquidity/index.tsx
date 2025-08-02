import { useCurrency } from "hooks/Tokens";
import usePrevious from "hooks/usePrevious";
import { useAccount } from "wagmi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, RouteComponentProps, Switch, useRouteMatch, Route, Redirect } from "react-router-dom";
import { useV3DerivedMintInfo, useV3MintState, useV3MintActionHandlers, useInitialUSDPrices, useCurrentStep } from "state/mint/v3/hooks";
import { currencyId } from "utils/currencyId";
import { Stepper } from "./components/Stepper";
import { EnterAmounts } from "./containers/EnterAmounts";
import { SelectPair } from "./containers/SelectPair";
import { SelectRange } from "./containers/SelectRange";
import Loader from "components/Loader";

import { Currency, Percent } from "@uniswap/sdk-core";

import "./index.scss";
import { WXDAI_EXTENDED } from "constants/tokens";
import { setInitialTokenPrice, setInitialUSDPrices, updateCurrentStep, updateSelectedPreset } from "state/mint/v3/actions";
import { Field } from "state/mint/actions";
import useUSDCPrice from "hooks/useUSDCPrice";
import { PriceFormats } from "./components/PriceFomatToggler";
import { AddLiquidityButton } from "./containers/AddLiquidityButton";
import { ArrowLeft, ChevronLeft, ChevronRight } from "react-feather";
import { PoolState } from "hooks/usePools";
import { RouterGuard } from "./routing/router-guards";
import { InitialPrice } from "./containers/InitialPrice";
import { useAppDispatch } from "state/hooks";
import SettingsTab from "components/Settings";
import { useUserSlippageToleranceWithDefault } from "state/user/hooks";
import { ZERO_PERCENT } from "constants/misc";
import { Aftermath } from "./containers/Aftermath";
import { t, Trans } from "@lingui/macro";
import { isMobileOnly } from "react-device-detect";
import { ConnectKitButton } from 'connectkit';

import AlgebraConfig from "algebra.config";

const DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE = new Percent(50, 10_000);

// Define container components for RouterGuard
const SelectPairContainer = (props: any) => <SelectPair {...props} />;
const InitialPriceContainer = (props: any) => <InitialPrice {...props} />;
const SelectRangeContainer = (props: any) => <SelectRange {...props} />;
const EnterAmountsContainer = (props: any) => <EnterAmounts {...props} />;
const AftermathContainer = (props: any) => <Aftermath {...props} />;

export function NewAddLiquidityPage({
    match: {
        params: { currencyIdA: rawCurrencyIdA, currencyIdB: rawCurrencyIdB, step: stepFromUrl },
        path,
    },
    history,
}: RouteComponentProps<{
    currencyIdA?: string;
    currencyIdB?: string;
    step?: string;
}>) {
    // Lowercase currency IDs from URL
    const currencyIdA = rawCurrencyIdA?.toLowerCase();
    const currencyIdB = rawCurrencyIdB?.toLowerCase();

    const [isRejected, setRejected] = useState(false);

    const { address: account, chain } = useAccount();
    const chainId = chain?.id;

    const dispatch = useAppDispatch();

    const feeAmount = 100;

    const currentStep = useCurrentStep();

    const [end, setEnd] = useState(false);

    const [priceFormat, setPriceFormat] = useState(PriceFormats.TOKEN);

    const baseCurrency = useCurrency(currencyIdA);
    const currencyB = useCurrency(currencyIdB);
    const quoteCurrency = baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB;

    const derivedMintInfo = useV3DerivedMintInfo(baseCurrency ?? undefined, quoteCurrency ?? undefined, feeAmount, baseCurrency ?? undefined, undefined);
    const prevDerivedMintInfo = usePrevious({ ...derivedMintInfo });

    const mintInfo = useMemo(() => {
        if ((!derivedMintInfo.pool || !derivedMintInfo.price || derivedMintInfo.noLiquidity) &&
            prevDerivedMintInfo && prevDerivedMintInfo.pool && prevDerivedMintInfo.price) {
            return {
                ...prevDerivedMintInfo,
                pricesAtTicks: derivedMintInfo.pricesAtTicks,
                ticks: derivedMintInfo.ticks,
                parsedAmounts: derivedMintInfo.parsedAmounts,
                noLiquidity: derivedMintInfo.noLiquidity,
                poolState: derivedMintInfo.poolState,
                dynamicFee: derivedMintInfo.dynamicFee
            };
        }
        return {
            ...derivedMintInfo,
        };
    }, [derivedMintInfo, prevDerivedMintInfo]);

    const { onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, onStartPriceInput } = useV3MintActionHandlers(mintInfo.noLiquidity);
    const { startPriceTypedValue } = useV3MintState();
    const initialUSDPrices = useInitialUSDPrices();
    const usdPriceA = useUSDCPrice(baseCurrency ?? undefined);
    const usdPriceB = useUSDCPrice(quoteCurrency ?? undefined);

    // Stabilize resetState function to prevent infinite loops
    const resetState = useCallback(() => {
        dispatch(updateSelectedPreset({ preset: null }));
        dispatch(setInitialTokenPrice({ typedValue: "" }));
        dispatch(setInitialUSDPrices({ field: Field.CURRENCY_A, typedValue: "" }));
        dispatch(setInitialUSDPrices({ field: Field.CURRENCY_B, typedValue: "" }));
        // Call onStartPriceInput with empty string to clear the start price
        if (onStartPriceInput) {
            onStartPriceInput("");
        }
    }, [dispatch, onStartPriceInput]); // Keep onStartPriceInput but guard the call

    // Store previous currency IDs to prevent unnecessary resets
    const prevCurrencyIdA = usePrevious(currencyIdA);
    const prevCurrencyIdB = usePrevious(currencyIdB);

    // Clear form inputs when currencies change
    useEffect(() => {
        if (currencyIdA !== prevCurrencyIdA || currencyIdB !== prevCurrencyIdB) {
            onFieldAInput("");
            onFieldBInput("");
            onLeftRangeInput("");
            onRightRangeInput("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currencyIdA, currencyIdB, prevCurrencyIdA, prevCurrencyIdB]); // Removed action handlers from dependencies to prevent infinite loops

    const handleCurrencySelect = useCallback(
        (currencyNew: Currency, currencyIdOther?: string): (string | undefined)[] => {
            const currencyIdNew = currencyId(currencyNew, chainId || AlgebraConfig.CHAIN_PARAMS.chainId);
            const chainSymbol = chainId === AlgebraConfig.CHAIN_PARAMS.chainId ? AlgebraConfig.CHAIN_PARAMS.nativeCurrency.symbol : undefined;

            if (currencyIdNew.toLowerCase() === currencyIdOther?.toLowerCase()) {
                return [currencyIdNew, undefined];
            } else {
                const isETHOrWETHNew = currencyIdNew === chainSymbol || (chainId !== undefined && currencyIdNew === WXDAI_EXTENDED[chainId]?.address);
                const isETHOrWETHOther = currencyIdOther !== undefined && (currencyIdOther === chainSymbol || (chainId !== undefined && currencyIdOther === WXDAI_EXTENDED[chainId]?.address));
                if (isETHOrWETHNew && isETHOrWETHOther) {
                    return [currencyIdNew, undefined];
                } else {
                    return [currencyIdNew, currencyIdOther];
                }
            }
        },
        [chainId]
    );

    const handleCurrencyASelect = useCallback(
        (currencyANew: Currency) => {
            const [idA, idB] = handleCurrencySelect(currencyANew, currencyIdB);
            if (idB === undefined && idA) {
                history.push(`/add/${idA}/select-pair`);
            } else if (idA && idB) {
                history.push(`/add/${idA}/${idB}/select-pair`);
            }
        },
        [handleCurrencySelect, currencyIdB, history]
    );

    const handleCurrencyBSelect = useCallback(
        (currencyBNew: Currency) => {
            const [idB, idA] = handleCurrencySelect(currencyBNew, currencyIdA);
            if (idA === undefined && idB) {
                history.push(`/add/${idB}/select-pair`);
            } else if (idA && idB) {
                history.push(`/add/${idA}/${idB}/select-pair`);
            }
        },
        [handleCurrencySelect, currencyIdA, history]
    );

    const handleCurrencySwap = useCallback(() => {
        if (currencyIdA && currencyIdB) {
            history.push(`/add/${currencyIdB}/${currencyIdA}/select-pair`);
        }
    }, [history, currencyIdA, currencyIdB]);

    const handlePopularPairSelection = useCallback(
        (pair: [string, string]) => {
            history.push(`/add/${pair[0]}/${pair[1]}/select-pair`);
        },
        [history]
    );

    const stepLinks = useMemo(() => {
        const _links = [
            { link: "select-pair", title: t`Select a pair`, step: 0 },
        ];
        if (mintInfo.noLiquidity && baseCurrency && quoteCurrency) {
            _links.push({ link: "initial-price", title: t`Set initial price`, step: 1 });
        }
        _links.push({ link: "select-range", title: t`Select price range`, step: mintInfo.noLiquidity ? 2 : 1 });
        _links.push({ link: "enter-amounts", title: t`Enter amounts`, step: mintInfo.noLiquidity ? 3 : 2 });
        _links.push({ link: "aftermath", title: t`Review`, step: mintInfo.noLiquidity ? 4 : 3 });
        return _links;
    }, [mintInfo.noLiquidity, baseCurrency, quoteCurrency]);

    const handleStepChange = useCallback((_stepLink: string) => {
        let basePath = "/add";
        if (currencyIdA) basePath += `/${currencyIdA}`;
        if (currencyIdB) basePath += `/${currencyIdB}`;
        history.push(`${basePath}/${_stepLink}`);
    }, [currencyIdA, currencyIdB, history]);

    // Handle step synchronization with URL - simplified to prevent infinite loops
    useEffect(() => {
        const matchedStep = stepLinks.find(sl => sl.link === stepFromUrl);

        if (matchedStep && matchedStep.step !== currentStep) {
            dispatch(updateCurrentStep({ currentStep: matchedStep.step }));
        }
    }, [stepFromUrl, stepLinks, currentStep, dispatch]);

    // Reset state only when currencies actually change, not on every render
    useEffect(() => {
        if (currencyIdA !== prevCurrencyIdA || currencyIdB !== prevCurrencyIdB) {
            resetState();
            dispatch(updateCurrentStep({ currentStep: 0 }));
        }
    }, [currencyIdA, currencyIdB, prevCurrencyIdA, prevCurrencyIdB, dispatch, resetState]);

    // Cleanup on unmount only
    useEffect(() => {
        return () => {
            dispatch(updateCurrentStep({ currentStep: 0 }));
        };
    }, []); // Empty dependency array for unmount only

    const stepPair = useMemo(() => Boolean(baseCurrency && quoteCurrency && mintInfo.poolState !== PoolState.INVALID && mintInfo.poolState !== PoolState.LOADING), [baseCurrency, quoteCurrency, mintInfo.poolState]);
    const stepInitialPrice = useMemo(() => mintInfo.noLiquidity ? Boolean(startPriceTypedValue && account) : true, [mintInfo.noLiquidity, startPriceTypedValue, account]);
    const stepRange = useMemo(() => Boolean(mintInfo.lowerPrice && mintInfo.upperPrice && !mintInfo.invalidRange && account), [mintInfo.lowerPrice, mintInfo.upperPrice, mintInfo.invalidRange, account]);
    const stepAmounts = useMemo(() => {
        if (!account) return false;
        if (mintInfo.outOfRange) return Boolean(mintInfo.parsedAmounts[Field.CURRENCY_A] || mintInfo.parsedAmounts[Field.CURRENCY_B]);
        return Boolean(mintInfo.parsedAmounts[Field.CURRENCY_A] && mintInfo.parsedAmounts[Field.CURRENCY_B]);
    }, [mintInfo.outOfRange, mintInfo.parsedAmounts, account]);

    const stepsEnabledStatus = useMemo(() => {
        const status = [stepPair];
        if (mintInfo.noLiquidity) status.push(stepInitialPrice);
        status.push(stepRange, stepAmounts);
        return status;
    }, [stepPair, stepInitialPrice, stepRange, stepAmounts, mintInfo.noLiquidity]);



    const notConnected = useMemo(() => !Boolean(account), [account]);

    // Loading state for currencies based on URL IDs
    const currenciesLoading = useMemo(() => {
        return (currencyIdA && !baseCurrency) || (currencyIdB && !quoteCurrency);
    }, [currencyIdA, currencyIdB, baseCurrency, quoteCurrency]);

    console.log('NewAddLiquidityPage Render:', {
        currencyIdA,
        currencyIdB,
        rawChainId: chain?.id,
        baseCurrencyObj: baseCurrency,
        quoteCurrencyObj: quoteCurrency,
        baseSymbol: baseCurrency?.symbol,
        quoteSymbol: quoteCurrency?.symbol,
        currenciesLoading,
        currentStep
    });

    const stepperCommonProps = {
        currencyA: baseCurrency ?? undefined,
        currencyB: quoteCurrency ?? undefined,
        mintInfo: mintInfo,
        priceFormat: priceFormat,
    };

    const routerGuardCommonProps = {
        redirect: currencyIdA && currencyIdB ? `/add/${currencyIdA}/${currencyIdB}/select-pair` : (currencyIdA ? `/add/${currencyIdA}/select-pair` : '/add/select-pair'),
    };

    return (
        <div className={"add-liquidity-v3 w-100"}>
            <div className={"add-liquidity-v3__header flex-s-between mb-1"}>
                <div className={"add-liquidity-v3__header__left flex-s-between"}>
                    {currentStep > 0 && (
                        <button
                            className={"add-liquidity-v3__header__left__back-btn flex-s-between mr-1"}
                            onClick={() => {
                                const prevStepDetails = stepLinks.find(s => s.step === currentStep - 1);
                                if (prevStepDetails) {
                                    if (end && currentStep === stepLinks.length - 1) setEnd(false);
                                    dispatch(updateCurrentStep({ currentStep: prevStepDetails.step }));
                                    handleStepChange(prevStepDetails.link);
                                }
                            }}
                        >
                            <ChevronLeft size={22} />
                            <Trans>Back</Trans>
                        </button>
                    )}
                    <span className={"add-liquidity-v3__header__left__title fs-125"}>
                        <Trans>Add Liquidity</Trans>
                    </span>
                </div>
                <div className={"add-liquidity-v3__header__right flex-s-between"}>
                    <SettingsTabMRS />
                </div>
            </div>

            <Stepper
                stepLinks={stepLinks}
                completedSteps={Array.from({ length: currentStep }, (_, i) => i)}
                {...stepperCommonProps}
                end={end}
                handleNavigation={(stepToGo: { link: string; step: number }) => {
                    dispatch(updateCurrentStep({ currentStep: stepToGo.step }));
                    handleStepChange(stepToGo.link);
                }}
            />

            {notConnected ? (
                <div className={"w-100 flex-s-between fd-c f-ac f-jc"} style={{ height: "30vh" }}>
                    <Trans>Connect to a wallet to add liquidity.</Trans>
                    <ConnectKitButton />
                </div>
            ) : currenciesLoading ? (
                <div className={"w-100 flex-s-between fd-c f-ac f-jc"} style={{ height: "30vh" }}>
                    <Loader stroke="#22cbdc" />
                    <p><Trans>Loading token data...</Trans></p>
                </div>
            ) : (
                <Switch>
                    <Route exact path={`${path}/select-pair`} render={(routeProps) =>
                        <RouterGuard {...routeProps} {...routerGuardCommonProps} Component={SelectPairContainer}
                            allowance={true}
                            baseCurrency={baseCurrency}
                            quoteCurrency={quoteCurrency}
                            mintInfo={mintInfo}
                            isCompleted={stepPair}
                            priceFormat={priceFormat}
                            handleCurrencySwap={handleCurrencySwap}
                            handleCurrencyASelect={handleCurrencyASelect}
                            handleCurrencyBSelect={handleCurrencyBSelect}
                            handlePopularPairSelection={handlePopularPairSelection}
                        />} />
                    <Route exact path={`${path}/initial-price`} render={(routeProps) =>
                        <RouterGuard {...routeProps} {...routerGuardCommonProps} Component={InitialPriceContainer}
                            allowance={mintInfo.noLiquidity && stepPair}
                            {...stepperCommonProps}
                            isCompleted={stepInitialPrice}
                            onStartPriceInput={onStartPriceInput}
                            startPriceTypedValue={startPriceTypedValue}
                        />} />
                    <Route exact path={`${path}/select-range`} render={(routeProps) =>
                        <RouterGuard {...routeProps} {...routerGuardCommonProps} Component={SelectRangeContainer}
                            allowance={stepPair && (mintInfo.noLiquidity ? stepInitialPrice : true)}
                            {...stepperCommonProps}
                            disabled={!stepPair}
                            isCompleted={stepRange}
                            additionalStep={mintInfo.noLiquidity}
                            onLeftRangeInput={onLeftRangeInput}
                            onRightRangeInput={onRightRangeInput}
                        />} />
                    <Route exact path={`${path}/enter-amounts`} render={(routeProps) =>
                        <RouterGuard {...routeProps} {...routerGuardCommonProps} Component={EnterAmountsContainer}
                            allowance={stepPair && stepRange && (mintInfo.noLiquidity ? stepInitialPrice : true)}
                            {...stepperCommonProps}
                            isCompleted={stepAmounts}
                            additionalStep={mintInfo.noLiquidity}
                            onFieldAInput={onFieldAInput}
                            onFieldBInput={onFieldBInput}
                        />} />
                    <Route exact path={`${path}/aftermath`} render={(routeProps) =>
                        <RouterGuard {...routeProps} {...routerGuardCommonProps} Component={AftermathContainer}
                            allowance={stepPair && stepRange && stepAmounts && (mintInfo.noLiquidity ? stepInitialPrice : true) && end}
                            {...stepperCommonProps}
                            baseCurrency={baseCurrency}
                            quoteCurrency={quoteCurrency}
                            isRejected={isRejected}
                            setRejected={setRejected}
                        />} />
                    <Route exact path={`/add`} render={() =>
                        <RouterGuard redirect={'/add'} Component={SelectPairContainer}
                            allowance={true}
                            baseCurrency={baseCurrency}
                            quoteCurrency={quoteCurrency}
                            mintInfo={mintInfo}
                            isCompleted={stepPair}
                            priceFormat={priceFormat}
                            handleCurrencySwap={handleCurrencySwap}
                            handleCurrencyASelect={handleCurrencyASelect}
                            handleCurrencyBSelect={handleCurrencyBSelect}
                            handlePopularPairSelection={handlePopularPairSelection}
                        />} />
                </Switch>
            )}

            {!notConnected && !end && (
                <div className="mt-2 add-buttons f f-ac f-jc">
                    {currentStep > 0 && stepLinks.find(s => s.step === currentStep - 1) && (
                        <div>
                            <button
                                className="add-buttons__prev f"
                                onClick={() => {
                                    const prevStepDetails = stepLinks.find(s => s.step === currentStep - 1);
                                    if (prevStepDetails) {
                                        dispatch(updateCurrentStep({ currentStep: prevStepDetails.step }));
                                        handleStepChange(prevStepDetails.link);
                                    }
                                }}
                            >
                                <ChevronLeft size={18} style={{ marginRight: "5px" }} />
                                <span className="add-buttons__prev-text">{stepLinks.find(s => s.step === currentStep - 1)?.title}</span>
                                <span className="add-buttons__prev-text--mobile"><Trans>Back</Trans></span>
                            </button>
                        </div>
                    )}
                    {currentStep === stepsEnabledStatus.length - 1 ? (
                        <AddLiquidityButton
                            baseCurrency={baseCurrency ?? undefined}
                            quoteCurrency={quoteCurrency ?? undefined}
                            mintInfo={mintInfo}
                            handleAddLiquidity={() => {
                                if (!stepsEnabledStatus[currentStep]) return;
                                setEnd(true);
                                const aftermathStepDetails = stepLinks.find(s => s.link === 'aftermath');
                                if (aftermathStepDetails) {
                                    dispatch(updateCurrentStep({ currentStep: aftermathStepDetails.step }));
                                    handleStepChange(aftermathStepDetails.link);
                                }
                            }}
                            title={t`Add liquidity`}
                        />
                    ) : (
                        stepLinks.find(s => s.step === currentStep + 1) && (
                            <button
                                className="btn primary f f-jc f-ac ml-a"
                                onClick={() => {
                                    if (!stepsEnabledStatus[currentStep]) return;
                                    const nextStepDetails = stepLinks.find(s => s.step === currentStep + 1);
                                    if (nextStepDetails) {
                                        dispatch(updateCurrentStep({ currentStep: nextStepDetails.step }));
                                        isMobileOnly && window.scrollTo(0, 0);
                                        handleStepChange(nextStepDetails.link);
                                    }
                                }}
                            >
                                <span>{stepLinks.find(s => s.step === currentStep + 1)?.title}</span>
                                <ChevronRight size={18} style={{ marginLeft: "5px" }} />
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

function SettingsTabMRS() {
    const defaultSlippage = DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE;
    const userSlippageTolerance = useUserSlippageToleranceWithDefault(defaultSlippage);

    const settingsTabProps = {
        autoSlippage: defaultSlippage,
        allowedSlippage: userSlippageTolerance,
        placeholderSlippage: defaultSlippage,
    };
    return <SettingsTab {...settingsTabProps} />;
}
