import { t, Trans } from "@lingui/macro";
import { Currency } from "@uniswap/sdk-core";
import { STABLE_TOKEN_FOR_USD_PRICE } from "constants/tokens";
import useUSDCPrice from "hooks/useUSDCPrice";
import { useMemo } from "react";
import { isMobileOnly } from "react-device-detect";
import { Bound, updateSelectedPreset } from "state/mint/v3/actions";
import { IDerivedMintInfo, useActivePreset, useInitialUSDPrices } from "state/mint/v3/hooks";
import { Presets } from "state/mint/v3/reducer";
import { PriceFormats } from "../PriceFomatToggler";
import { useAppDispatch } from "state/hooks";
import isEqual from 'lodash/isEqual';

import "./index.scss";

interface IStepperNavigation {
    isEnabled: boolean;
    step: number;
    link: string;
}

interface IStepper {
    completedSteps: number[];
    stepLinks: { link: string; title: string; error?: boolean; description?: string }[];
    currencyA: Currency | undefined;
    currencyB: Currency | undefined;
    mintInfo: IDerivedMintInfo;
    end: boolean;
    handleNavigation: (navigate: IStepperNavigation) => void;
    priceFormat: PriceFormats;
}

export function Stepper({ completedSteps, stepLinks, currencyA, currencyB, mintInfo, end, handleNavigation, priceFormat }: IStepper) {
    const baseTokenUSD = useUSDCPrice(currencyA);
    const rangeTokenUSD = useUSDCPrice(currencyB);
    const dispatch = useAppDispatch();

    const initialUSDPrices = useInitialUSDPrices();

    const isUSD = useMemo(() => {
        return priceFormat === PriceFormats.USD;
    }, [priceFormat]);

    const isUSDCB = useMemo(() => {
        return currencyB && currencyB.wrapped.address === STABLE_TOKEN_FOR_USD_PRICE.address;
    }, [currencyB]);

    const isUSDCA = useMemo(() => {
        return currencyA && currencyA.wrapped.address === STABLE_TOKEN_FOR_USD_PRICE.address;
    }, [currencyA]);

    const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = mintInfo.pricesAtTicks;

    const isSorted = useMemo(() => {
        return currencyA && currencyB && currencyA.wrapped.sortsBefore(currencyB.wrapped);
    }, [currencyA, currencyB]);

    const leftPrice = useMemo(() => {
        return isSorted ? priceLower : priceUpper?.invert();
    }, [isSorted, priceLower, priceUpper]);

    const rightPrice = useMemo(() => {
        return isSorted ? priceUpper : priceLower?.invert();
    }, [isSorted, priceUpper, priceLower]);

    const preset = useActivePreset();

    const steps = useMemo(() => {
        const _steps: { link: string; title: string; error?: boolean; description?: string }[] = stepLinks.map(link => ({ ...link }));

        if (!currencyA || !currencyB || !mintInfo) return _steps;

        if (currencyA && currencyB && completedSteps.length >= 1) {
            if (_steps.length > 0) {
                _steps[0].title = `${currencyA.symbol} / ${currencyB.symbol}`;
            }
        }

        if (mintInfo.noLiquidity) {
            const rangeUSD = initialUSDPrices.CURRENCY_B || rangeTokenUSD?.toSignificant(8);

            if (mintInfo.price && rangeUSD && completedSteps.length >= 2) {
                if (_steps.length > 1) {
                    _steps[1].title = t`Initial price: 1 ${currencyA?.symbol || ''} = ${isUSD ? "$" : ""}${isUSD
                        ? isSorted
                            ? parseFloat(mintInfo.price.toSignificant(8))
                            : parseFloat((+mintInfo.price.invert().toSignificant(8) * +rangeUSD).toFixed(4))
                        : isSorted
                            ? parseFloat(mintInfo.price.toSignificant(5))
                            : parseFloat(mintInfo.price.invert().toSignificant(5))
                        } ${isUSD ? "" : ` ${currencyB.symbol}`}`;
                }
            }

            if (mintInfo.price && !rangeUSD && completedSteps.length >= 2) {
                if (_steps.length > 1) {
                    _steps[1].title = t`Initial price: 1 ${currencyA?.symbol || ''} = ${isSorted ? parseFloat(mintInfo.price.toSignificant(8)) : parseFloat(mintInfo.price.invert().toSignificant(8))} ${currencyB?.symbol || ''}`;
                }
            }

            if (leftPrice && rightPrice && completedSteps.length >= 3) {
                if (_steps.length > 2) {
                    if (preset !== Presets.FULL && rightPrice.toSignificant(5) !== "3384900000000000000000000000000000000000000000000") {
                        _steps[2].title = t`Range: ${isUSD && rangeUSD ? "$" : ""}${isUSD && rangeUSD && !isUSDCB ? (+leftPrice.toSignificant(8) * +rangeUSD).toFixed(6).slice(0, -1) : +leftPrice.toSignificant(8)
                            } — ${isUSD && rangeUSD ? "$" : ""}${isUSD && rangeUSD && !isUSDCB ? (+rightPrice.toSignificant(8) * +rangeUSD).toFixed(6).slice(0, -1) : rightPrice.toSignificant(8)}`;
                    } else {
                        _steps[2].title = t`Range: 0 — ∞`;
                    }
                }
            }

            if (baseTokenUSD && rangeUSD && mintInfo.parsedAmounts.CURRENCY_A && mintInfo.parsedAmounts.CURRENCY_B && end) {
                if (_steps.length > 3) {
                    const parsedA = parseFloat(String(Number(mintInfo.parsedAmounts.CURRENCY_A.toSignificant(5)).toFixed(4)));
                    const parsedB = parseFloat(String(Number(mintInfo.parsedAmounts.CURRENCY_B.toSignificant(5)).toFixed(4)));

                    let tokenA;
                    let tokenB;

                    if (isUSD) {
                        const tokenAUSD = Number(baseTokenUSD.toSignificant(5)).toFixed(4);
                        const tokenBUSD = Number(rangeUSD).toFixed(4);

                        tokenA = isUSDCA ? parsedA : parseFloat((parsedA * +tokenAUSD).toFixed(4));
                        tokenB = isUSDCB ? parsedB : parseFloat((parsedB * +tokenBUSD).toFixed(4));

                        _steps[3].title = t`Liquidity: $${tokenA + tokenB}`;
                    } else {
                        tokenA = parsedA;
                        tokenB = parsedB;

                        _steps[3].title = t`Liquidity: ${tokenA} ${currencyA?.symbol || ''}, ${tokenB} ${currencyB?.symbol || ''}`;
                    }
                }
            }
        } else {
            if (leftPrice && rightPrice && completedSteps.length >= 2) {
                if (_steps.length > 1) {
                    if (preset !== Presets.FULL) {
                        _steps[1].title = t`Range: ${isUSD ? "$" : ""}${isUSD && rangeTokenUSD && !isUSDCB ? (+leftPrice.toSignificant(8) * +rangeTokenUSD.toSignificant(8)).toFixed(6).slice(0, -1) : Number(leftPrice.toSignificant(8)).toFixed(4)
                            } — ${isUSD ? "$" : ""}${isUSD && rangeTokenUSD && !isUSDCB ? (+rightPrice.toSignificant(8) * +rangeTokenUSD.toSignificant(8)).toFixed(6).slice(0, -1) : Number(rightPrice.toSignificant(8)).toFixed(4)
                            }`;
                    } else {
                        _steps[1].title = t`Range: 0 — ∞`;
                    }
                }
            }

            if (baseTokenUSD && rangeTokenUSD && mintInfo.parsedAmounts.CURRENCY_A && mintInfo.parsedAmounts.CURRENCY_B && end) {
                if (_steps.length > 2) {
                    const parsedA = parseFloat(String(Number(mintInfo.parsedAmounts.CURRENCY_A.toSignificant(5)).toFixed(4)));
                    const parsedB = parseFloat(String(Number(mintInfo.parsedAmounts.CURRENCY_B.toSignificant(5)).toFixed(4)));

                    let tokenA;
                    let tokenB;

                    if (isUSD) {
                        const tokenAUSD = Number(baseTokenUSD.toSignificant(5)).toFixed(4);
                        const tokenBUSD = Number(rangeTokenUSD.toSignificant(5)).toFixed(4);

                        tokenA = isUSDCA ? parsedA : parseFloat((parsedA * +tokenAUSD).toFixed(4));
                        tokenB = isUSDCB ? parsedB : parseFloat((parsedB * +tokenBUSD).toFixed(4));

                        _steps[2].title = t`Liquidity: $${tokenA + tokenB}`;
                    } else {
                        tokenA = parsedA;
                        tokenB = parsedB;

                        _steps[2].title = t`Liquidity: ${tokenA} ${currencyA?.symbol || ''}, ${tokenB} ${currencyB?.symbol || ''}`;
                    }
                }
            }
        }

        if (completedSteps.length === 4 && !isEqual(completedSteps[3], preset)) {
            dispatch(updateSelectedPreset({ preset: preset }));
        }

        if (mintInfo.invalidRange) {
            if (_steps.length > 2) {
                _steps[2].error = true;
                _steps[2].description = t`Invalid range selected. The min price must be lower than the max price.`;
            }
        } else if (mintInfo.outOfRange) {
            if (_steps.length > 2) {
                _steps[2].title = t`Range: ${leftPrice?.toSignificant(5) || '...'} - ${rightPrice?.toSignificant(5) || '...'} ${currencyB?.symbol || ''}`;
                _steps[2].description = t`Your position will not earn fees or be used in trades until the market price moves into your range.`;
            }
        } else if (completedSteps.length >= 3) {
            if (_steps.length > 2) {
                _steps[2].title = t`Range: ${leftPrice?.toSignificant(5) || '...'} - ${rightPrice?.toSignificant(5) || '...'} ${currencyB?.symbol || ''}`;
                _steps[2].description = "";
            }
        }

        if ((!mintInfo.parsedAmounts.CURRENCY_A && !mintInfo.parsedAmounts.CURRENCY_B && completedSteps.length === 4) || (mintInfo.errorMessage && completedSteps.length === 4)) {
            if (_steps.length > 3) {
                _steps[3].title = t`Amounts: ${mintInfo.parsedAmounts.CURRENCY_A?.toSignificant(5) || '...'} ${currencyA?.symbol || ''} and ${mintInfo.parsedAmounts.CURRENCY_B?.toSignificant(5) || '...'} ${currencyB?.symbol || ''}`;
                _steps[3].description = "";
            }
        }

        return _steps;
    }, [completedSteps, stepLinks, currencyA, currencyB, mintInfo, isUSD, initialUSDPrices, rangeTokenUSD, preset, dispatch]);

    return (
        <div className="f w-100" style={{ justifyContent: "space-between" }}>
            {isMobileOnly ? (
                <div className={"f f-ac f-js w-100"}>
                    <div
                        className={"progress-circle-wrapper"}
                        style={{
                            background: `conic-gradient(rgb(3, 133, 255)${(100 / steps.length) * (completedSteps.length + 1)}%,rgb(242, 242, 242)${(100 / steps.length) * (completedSteps.length + 1)
                                }%)`,
                        }}
                    >
                        <div className={"progress-circle fs-085"}>
                            {completedSteps.length + 1} of {steps.length}
                        </div>
                    </div>

                    <div className={"ml-1"}>
                        <h3 style={{ whiteSpace: "break-spaces", lineHeight: "1.1rem" }} className={"mb-025"}>
                            {completedSteps.length === steps.length ? t`All steps completed` : steps[completedSteps.length]?.title}
                        </h3>
                        <h4 className={"fs-085 c-lg l"}>
                            {completedSteps.length === steps.length ? "" : <Trans>Next step: </Trans>}
                            {completedSteps.length < steps.length - 1 ? steps[completedSteps.length + 1]?.title : completedSteps.length === steps.length ? "" : t`Finish`}
                        </h4>
                    </div>
                </div>
            ) : (
                steps.map((el, i) => (
                    <div
                        key={i}
                        className={`stepper__step f f-ac ${completedSteps.length - 1 >= i && !end ? "clickable" : ""}`}
                        onClick={() => handleNavigation({ isEnabled: completedSteps.length - 1 >= i && !end, step: i, link: el.link })}
                    >
                        <div className={`stepper__circle mr-1 f f-ac f-jc ${i === completedSteps.length && !end ? "current" : ""} ${completedSteps.length - 1 >= i || end ? "done" : ""} `}>
                            {i + 1}
                        </div>
                        <div className={`${i === completedSteps.length && !end ? "stepper__circle-current" : ""}`}>{el.title}</div>
                    </div>
                ))
            )}
        </div>
    );
}
