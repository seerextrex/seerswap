import { useCurrency } from "hooks/Tokens";
import usePrevious from "hooks/usePrevious";
import { useActiveWeb3React } from "hooks/web3";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, RouteComponentProps, Switch, useRouteMatch } from "react-router-dom";
import { useV3DerivedMintInfo, useV3MintState, useV3MintActionHandlers, useInitialUSDPrices, useCurrentStep } from "state/mint/v3/hooks";
import { currencyId } from "utils/currencyId";
import { Stepper } from "./components/Stepper";
import { EnterAmounts } from "./containers/EnterAmounts";
import { SelectPair } from "./containers/SelectPair";
import { SelectRange } from "./containers/SelectRange";

import { Currency, Percent } from "@uniswap/sdk-core";

import "./index.scss";
import { WXDAI_EXTENDED } from "constants/tokens";
import { setInitialTokenPrice, setInitialUSDPrices, updateCurrentStep, updateSelectedPreset } from "state/mint/v3/actions";
import { Field } from "state/mint/actions";
import useUSDCPrice from "hooks/useUSDCPrice";
import { PriceFormats, PriceFormatToggler } from "./components/PriceFomatToggler";
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
import { useWalletModalToggle } from "state/application/hooks";
import { t, Trans } from "@lingui/macro";
import { isMobileOnly } from "react-device-detect";

import AlgebraConfig from "algebra.config";

const DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE = new Percent(50, 10_000);

export function NewAddLiquidityPage({
    match: {
        params: { currencyIdA, currencyIdB },
    },
    history,
}: RouteComponentProps<{
    currencyIdA?: string;
    currencyIdB?: string;
    step?: string;
}>) {
    const [isRejected, setRejected] = useState(false);

    const { account, chainId } = useActiveWeb3React();

    const toggleWalletModal = useWalletModalToggle(); // toggle wallet when disconnected

    const dispatch = useAppDispatch();

    const feeAmount = 100;

    const currentStep = useCurrentStep();

    const [end, setEnd] = useState(false);

    const [priceFormat, setPriceFormat] = useState(PriceFormats.TOKEN);

    useEffect(() => {
        onFieldAInput("");
        onFieldBInput("");
        onLeftRangeInput("");
        onRightRangeInput("");
    }, [currencyIdA, currencyIdB]);

    const baseCurrency = useCurrency(currencyIdA);
    const currencyB = useCurrency(currencyIdB);
    // prevent an error if they input ETH/WETH
    //TODO
    const quoteCurrency = baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB;

    const derivedMintInfo = useV3DerivedMintInfo(baseCurrency ?? undefined, quoteCurrency ?? undefined, feeAmount, baseCurrency ?? undefined, undefined);
    const prevDerivedMintInfo = usePrevious({ ...derivedMintInfo });

    const mintInfo = useMemo(() => {
        if ((!derivedMintInfo.pool || !derivedMintInfo.price || derivedMintInfo.noLiquidity) && prevDerivedMintInfo) {
            return {
                ...prevDerivedMintInfo,
                pricesAtTicks: derivedMintInfo.pricesAtTicks,
                ticks: derivedMintInfo.ticks,
                parsedAmounts: derivedMintInfo.parsedAmounts,
            };
        }
        return {
            ...derivedMintInfo,
        };
    }, [derivedMintInfo, baseCurrency, quoteCurrency]);

    const initialUSDPrices = useInitialUSDPrices();
    const usdPriceA = useUSDCPrice(baseCurrency ?? undefined);
    const usdPriceB = useUSDCPrice(quoteCurrency ?? undefined);

    const { onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, onStartPriceInput } = useV3MintActionHandlers(mintInfo.noLiquidity);

    const { startPriceTypedValue } = useV3MintState();

    const handleCurrencySelect = useCallback(
        (currencyNew: Currency, currencyIdOther?: string): (string | undefined)[] => {
            const currencyIdNew = currencyId(currencyNew, chainId || AlgebraConfig.CHAIN_PARAMS.chainId);

            let chainSymbol;

            if (chainId === AlgebraConfig.CHAIN_PARAMS.chainId) {
                chainSymbol = AlgebraConfig.CHAIN_PARAMS.nativeCurrency.symbol;
            }

            resetState();

            if (currencyIdNew.toLowerCase() === currencyIdOther?.toLowerCase()) {
                // not ideal, but for now clobber the other if the currency ids are equal
                return [currencyIdNew, undefined];
            } else {
                // prevent weth + eth
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
            if (idB === undefined) {
                history.push(`/add/${idA}`);
            } else {
                history.push(`/add/${idA}/${idB}`);
            }
        },
        [handleCurrencySelect, currencyIdB, history]
    );

    const handleCurrencyBSelect = useCallback(
        (currencyBNew: Currency) => {
            const [idB, idA] = handleCurrencySelect(currencyBNew, currencyIdA);
            if (idA === undefined) {
                history.push(`/add/${idB}`);
            } else {
                history.push(`/add/${idA}/${idB}`);
            }
        },
        [handleCurrencySelect, currencyIdA, history]
    );

    const handleCurrencySwap = useCallback(() => {
        history.push(`/add/${currencyIdB}/${currencyIdA}`);
        resetState();
    }, [history, handleCurrencySelect, currencyIdA, currencyIdB]);

    const handlePopularPairSelection = useCallback((pair: [string, string]) => {
        const WMATIC = "0xb7ddc6414bf4f5515b52d8bdd69973ae205ff101";
        history.push(`/add/${pair[0] === WMATIC ? "WDOGE" : pair[0]}/${pair[1] === WMATIC ? "WDOGE" : pair[1]}`);
        resetState();
    }, []);

    const handleStepChange = useCallback(
        (_step) => {
            history.push(`/add/${currencyIdA}/${currencyIdB}/${_step}`);
        },
        [currencyIdA, currencyIdB, history]
    );

    const handlePriceFormat = useCallback((priceFormat: PriceFormats) => {
        setPriceFormat(priceFormat);
    }, []);

    function resetState() {
        dispatch(updateSelectedPreset({ preset: null }));
        dispatch(setInitialTokenPrice({ typedValue: "" }));
        dispatch(setInitialUSDPrices({ field: Field.CURRENCY_A, typedValue: "" }));
        dispatch(setInitialUSDPrices({ field: Field.CURRENCY_B, typedValue: "" }));
        onStartPriceInput("");
    }

    const stepLinks = useMemo(() => {
        const _stepLinks = [
            {
                link: "select-pair",
                title: t`Select a pair`,
            },
        ];

        if (mintInfo.noLiquidity && baseCurrency && quoteCurrency) {
            _stepLinks.push({
                link: "initial-price",
                title: t`Set initial price`,
            });
        }

        _stepLinks.push(
            {
                link: "select-range",
                title: t`Select a range`,
            },
            {
                link: "enter-amounts",
                title: t`Enter amounts`,
            }
        );
        return _stepLinks;
    }, [baseCurrency, quoteCurrency, mintInfo]);

    const stepPair = useMemo(() => {
        return Boolean(baseCurrency && quoteCurrency && mintInfo.poolState !== PoolState.INVALID && mintInfo.poolState !== PoolState.LOADING);
    }, [baseCurrency, quoteCurrency, mintInfo]);

    const stepRange = useMemo(() => {
        return Boolean(mintInfo.lowerPrice && mintInfo.upperPrice && !mintInfo.invalidRange && account);
    }, [mintInfo]);

    const stepAmounts = useMemo(() => {
        if (mintInfo.outOfRange) {
            return Boolean(mintInfo.parsedAmounts[Field.CURRENCY_A] || (mintInfo.parsedAmounts[Field.CURRENCY_B] && account));
        }
        return Boolean(mintInfo.parsedAmounts[Field.CURRENCY_A] && mintInfo.parsedAmounts[Field.CURRENCY_B] && account);
    }, [mintInfo]);

    const stepInitialPrice = useMemo(() => {
        return mintInfo.noLiquidity ? Boolean(+startPriceTypedValue && account) : false;
    }, [mintInfo, startPriceTypedValue]);

    const steps = useMemo(() => {
        if (mintInfo.noLiquidity) {
            return [stepPair, stepInitialPrice, stepRange, stepAmounts];
        }

        return [stepPair, stepRange, stepAmounts];
    }, [stepPair, stepRange, stepAmounts, stepInitialPrice, mintInfo]);

    const completedSteps = useMemo(() => {
        return Array(currentStep).map((_, i) => i + 1);
    }, [currentStep]);

    const allowedSlippage = useUserSlippageToleranceWithDefault(mintInfo.outOfRange ? ZERO_PERCENT : DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE);

    const hidePriceFormatter = useMemo(() => {
        if (stepInitialPrice && currentStep < 2) {
            return false;
        }

        if (!stepInitialPrice && currentStep < 1) {
            return false;
        }

        return Boolean((mintInfo.noLiquidity ? stepInitialPrice : stepPair) && !initialUSDPrices.CURRENCY_A && !initialUSDPrices.CURRENCY_B && !usdPriceA && !usdPriceB);
    }, [mintInfo, currentStep, stepRange, stepInitialPrice, usdPriceA, usdPriceB, initialUSDPrices]);

    useEffect(() => {
        if (hidePriceFormatter) {
            handlePriceFormat(PriceFormats.TOKEN);
            setPriceFormat(PriceFormats.TOKEN);
        }
    }, [hidePriceFormatter]);

    useEffect(() => {
        return () => {
            resetState();
            dispatch(updateCurrentStep({ currentStep: 0 }));
        };
    }, []);

    useEffect(() => {
        switch (currentStep) {
            // case 0: {
            //     history.push(`/add/${currencyIdA}/${currencyIdB}/select-pair`);
            //     break;
            // }
            case 1: {
                if (!mintInfo.noLiquidity) {
                    history.push(`/add/${currencyIdA}/${currencyIdB}/select-range`);
                } else {
                    history.push(`/add/${currencyIdA}/${currencyIdB}/initial-price`);
                }
                break;
            }
            case 2: {
                if (!mintInfo.noLiquidity) {
                    history.push(`/add/${currencyIdA}/${currencyIdB}/enter-amounts`);
                } else {
                    history.push(`/add/${currencyIdA}/${currencyIdB}/select-range`);
                }
                break;
            }
            case 3: {
                if (mintInfo.noLiquidity) {
                    history.push(`/add/${currencyIdA}/${currencyIdB}/enter-amounts`);
                }
                break;
            }
        }
    }, [currencyIdA, currencyIdB, history, currentStep, mintInfo.noLiquidity]);

    return (
        <>
            <NavLink className={"c-p mb-1 f hover-op trans-op w-fc"} to={"/pool"}>
                <ArrowLeft size={"16px"} />
                <p className={"ml-05"}>
                    <Trans>Pools</Trans>
                </p>
            </NavLink>
            <div className="add-liquidity-page card-gradient-shadow">
                <div className="mb-1 add-liquidity-page__header f mxs_fd-c">
                    <div className="add-liquidity-page__header-title">
                        <Trans>Add liquidity</Trans>
                    </div>
                    <div className="ml-a mxs_ml-0 mxs_mt-1 f f-ac ">
                        {!hidePriceFormatter && <div className="mr-1">{/* <PriceFormatToggler currentFormat={priceFormat} handlePriceFormat={handlePriceFormat} /> */}</div>}
                        <div className="mxs_ml-a">
                            <SettingsTab placeholderSlippage={allowedSlippage} />
                        </div>
                    </div>
                </div>
                <div className="mb-2 add-liquidity-page__stepper">
                    <Stepper
                        currencyA={baseCurrency ?? undefined}
                        currencyB={quoteCurrency ?? undefined}
                        mintInfo={mintInfo}
                        stepLinks={stepLinks}
                        completedSteps={completedSteps}
                        end={end}
                        handleNavigation={(step) => {
                            if (step.isEnabled) {
                                handleStepChange(step.link);
                                setTimeout(() => dispatch(updateCurrentStep({ currentStep: step.step })), 10);
                            }
                        }}
                        priceFormat={priceFormat}
                    />
                </div>
                <Switch>
                    <RouterGuard
                        path={`/add/${currencyIdA}/${currencyIdB}/aftermath`}
                        redirect={`/add/${currencyIdA}/${currencyIdB}/select-pair`}
                        allowance={stepPair && stepRange && stepAmounts}
                        Component={Aftermath}
                        rejected={isRejected}
                        Button={() => (
                            <div className={"ml-a mr-a mt-1"}>
                                <AddLiquidityButton
                                    baseCurrency={baseCurrency ?? undefined}
                                    quoteCurrency={quoteCurrency ?? undefined}
                                    mintInfo={mintInfo}
                                    handleAddLiquidity={() => {
                                        setEnd(true);
                                        handleStepChange("aftermath");
                                    }}
                                    title={t`Retry`}
                                    setRejected={setRejected}
                                />
                            </div>
                        )}
                    />

                    <RouterGuard
                        path={`/add/${currencyIdA}/${currencyIdB}/enter-amounts`}
                        redirect={`/add/${currencyIdA}/${currencyIdB}/select-pair`}
                        allowance={stepPair && stepRange && currentStep === (stepInitialPrice ? 3 : 2)}
                        Component={EnterAmounts}
                        currencyA={baseCurrency ?? undefined}
                        currencyB={currencyB ?? undefined}
                        mintInfo={mintInfo}
                        isCompleted={stepAmounts}
                        additionalStep={stepInitialPrice}
                        priceFormat={priceFormat}
                        backStep={stepInitialPrice ? 2 : 1}
                    />

                    <RouterGuard
                        path={`/add/${currencyIdA}/${currencyIdB}/select-range`}
                        redirect={`/add/${currencyIdA}/${currencyIdB}/select-pair`}
                        allowance={stepPair && currentStep === (stepInitialPrice ? 2 : 1)}
                        Component={SelectRange}
                        currencyA={baseCurrency}
                        currencyB={quoteCurrency}
                        mintInfo={mintInfo}
                        disabled={!stepPair}
                        isCompleted={stepRange}
                        additionalStep={stepInitialPrice}
                        priceFormat={priceFormat}
                        backStep={stepInitialPrice ? 1 : 0}
                    />

                    <RouterGuard
                        path={`/add/${currencyIdA}/${currencyIdB}/initial-price`}
                        redirect={`/add/${currencyIdA}/${currencyIdB}/select-pair`}
                        allowance={mintInfo.noLiquidity}
                        Component={InitialPrice}
                        currencyA={baseCurrency ?? undefined}
                        currencyB={currencyB ?? undefined}
                        mintInfo={mintInfo}
                        isCompleted={stepInitialPrice}
                        priceFormat={priceFormat}
                        backStep={0}
                    />

                    <RouterGuard
                        path={``}
                        redirect={`/add/${currencyIdA}/${currencyIdB}/select-pair`}
                        allowance={true}
                        Component={SelectPair}
                        baseCurrency={baseCurrency}
                        quoteCurrency={quoteCurrency}
                        mintInfo={mintInfo}
                        isCompleted={stepPair}
                        handleCurrencySwap={handleCurrencySwap}
                        handleCurrencyASelect={handleCurrencyASelect}
                        handleCurrencyBSelect={handleCurrencyBSelect}
                        handlePopularPairSelection={handlePopularPairSelection}
                        priceFormat={priceFormat}
                    />
                </Switch>
                {!end && account ? (
                    <div className="mt-2 add-buttons f f-ac f-jc">
                        {currentStep !== 0 && (
                            <div>
                                <button
                                    className="add-buttons__prev f"
                                    onClick={() => {
                                        dispatch(updateCurrentStep({ currentStep: currentStep - 1 }));
                                        handleStepChange(stepLinks[currentStep - 1].link);
                                    }}
                                >
                                    <ChevronLeft size={18} style={{ marginRight: "5px" }} />
                                    <span className="add-buttons__prev-text">{stepLinks[currentStep - 1].title}</span>
                                    <span className="add-buttons__prev-text--mobile">
                                        <Trans>Back</Trans>
                                    </span>
                                </button>
                            </div>
                        )}
                        {currentStep === (stepInitialPrice ? 3 : 2) ? (
                            <AddLiquidityButton
                                baseCurrency={baseCurrency ?? undefined}
                                quoteCurrency={quoteCurrency ?? undefined}
                                mintInfo={mintInfo}
                                handleAddLiquidity={() => {
                                    setEnd(true);
                                    handleStepChange("aftermath");
                                }}
                                title={t`Add liquidity`}
                            />
                        ) : (
                            <button
                                className="btn primary f f-jc f-ac ml-a"
                                disabled={!steps[currentStep]}
                                onClick={() => {
                                    dispatch(updateCurrentStep({ currentStep: currentStep + 1 }));
                                    isMobileOnly && window.scrollTo(0, 0);
                                    handleStepChange(stepLinks[currentStep + 1].link);
                                }}
                            >
                                <span>{stepLinks[currentStep + 1].title}</span>
                                <ChevronRight size={18} style={{ marginLeft: "5px" }} />
                            </button>
                        )}
                    </div>
                ) : !account ? (
                    <div className="mt-2 add-buttons f f-ac f-jc mxs_mt-1">
                        <button className="btn primary f f-jc f-ac ml-a" onClick={toggleWalletModal}>
                            <Trans>Connect Wallet</Trans>
                        </button>
                    </div>
                ) : null}
            </div>
        </>
    );
}
