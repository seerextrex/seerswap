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
        params: { currencyIdA, currencyIdB, step: stepFromUrl },
        path,
    },
    history,
}: RouteComponentProps<{
    currencyIdA?: string;
    currencyIdB?: string;
    step?: string;
}>) {
    const [isRejected, setRejected] = useState(false);

    const { address: account, chain } = useAccount();
    const chainId = chain?.id;

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

    const handleStepChange = useCallback(
        (_stepLink: string) => {
            history.push(`/add/${currencyIdA}/${currencyIdB}/${_stepLink}`);
        },
        [currencyIdA, currencyIdB, history]
    );

    const handlePriceFormat = useCallback((_priceFormat: PriceFormats) => {
        setPriceFormat(_priceFormat);
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
                step: 0,
            },
        ];
        if (mintInfo.noLiquidity && baseCurrency && quoteCurrency) {
            _stepLinks.push({
                link: "initial-price",
                title: t`Set initial price`,
                step: 1,
            });
        }
        _stepLinks.push({
            link: "select-range",
            title: t`Select price range`,
            step: mintInfo.noLiquidity ? 2 : 1,
        });
        _stepLinks.push({
            link: "enter-amounts",
            title: t`Enter amounts`,
            step: mintInfo.noLiquidity ? 3 : 2,
        });
        return _stepLinks;
    }, [mintInfo.noLiquidity, baseCurrency, quoteCurrency]);

    useEffect(() => {
        const currentPathStep = stepLinks.find(sl => sl.link === stepFromUrl)?.step;
        if (currentPathStep !== undefined && currentPathStep !== currentStep) {
            dispatch(updateCurrentStep({ currentStep: currentPathStep }));
        }
    }, [stepFromUrl, stepLinks, currentStep, dispatch]);

    const notConnected = useMemo(() => !Boolean(account), [account]);

    const stepperProps: any = {
        links: stepLinks,
        currentStep: currentStep,
        completedSteps: [],
        currencyA: baseCurrency ?? undefined,
        currencyB: quoteCurrency ?? undefined,
        mintInfo: mintInfo,
        end: end,
        handleNavigation: (step: any) => handleStepChange(step.link),
        priceFormat: priceFormat,
    };

    const priceFormatTogglerProps: any = {
        currentFormat: priceFormat,
        handlePriceFormat: handlePriceFormat,
    };

    const commonRouterGuardProps: any = {
        redirect: `${path}/select-pair`,
        allowance: true,
        Component: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
    };

    return (
        <div className={"add-liquidity-v3 w-100"}>
            <div className={"add-liquidity-v3__header flex-s-between mb-1"}>
                <div className={"add-liquidity-v3__header__left flex-s-between"}>
                    {currentStep !== 0 && (
                        <button
                            className={"add-liquidity-v3__header__left__back-btn flex-s-between mr-1"}
                            onClick={() => {
                                if (currentStep === stepLinks.length - 1) {
                                    setEnd(false);
                                }
                                handleStepChange(stepLinks[currentStep - 1].link);
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
                    {!isMobileOnly && <PriceFormatToggler {...priceFormatTogglerProps} />}
                    <SettingsTabMRS />
                </div>
            </div>
            <Stepper {...stepperProps} />
            {notConnected ? (
                <div className={"w-100 flex-s-between fd-c f-ac f-jc"} style={{ height: "30vh" }}>
                    <Trans>Connect to a wallet to add liquidity.</Trans>
                    <ConnectKitButton />
                </div>
            ) : (
                <Switch>
                    <Route exact path={`${path}/select-pair`} render={(props) => <RouterGuard {...props} {...commonRouterGuardProps} Component={SelectPairContainer} />} />
                    <Route exact path={`${path}/initial-price`} render={(props) => <RouterGuard {...props} {...commonRouterGuardProps} Component={InitialPriceContainer} />} />
                    <Route exact path={`${path}/select-range`} render={(props) => <RouterGuard {...props} {...commonRouterGuardProps} Component={SelectRangeContainer} />} />
                    <Route exact path={`${path}/enter-amounts`} render={(props) => <RouterGuard {...props} {...commonRouterGuardProps} Component={EnterAmountsContainer} />} />
                    <Route exact path={`${path}/aftermath`} render={(props) => <RouterGuard {...props} {...commonRouterGuardProps} Component={AftermathContainer} />} />
                    <Redirect to={`${path}/select-pair`} />
                </Switch>
            )}
        </div>
    );
}

function SettingsTabMRS() {
    const defaultSlippage = DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE;
    const userSlippageTolerance = useUserSlippageToleranceWithDefault(defaultSlippage);

    const settingsTabProps: any = {
        autoSlippage: defaultSlippage.quotient.toString(),
        allowedSlippage: userSlippageTolerance.quotient.toString(),
        placeholderSlippage: defaultSlippage,
    }
    return <SettingsTab {...settingsTabProps} />;
}
