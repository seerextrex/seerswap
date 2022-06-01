import { IPresetArgs, PresetRanges } from "pages/NewAddLiquidity/components/PresetRanges";
import { RangeChart } from "pages/NewAddLiquidity/components/RangeChart";
import { RangeSelector } from "pages/NewAddLiquidity/components/RangeSelector";

import { Price, Token, Currency } from "@uniswap/sdk-core";

import "./index.scss";
import { Bound, updateSelectedPreset } from "state/mint/v3/actions";
import { IDerivedMintInfo, useRangeHopCallbacks, useV3MintActionHandlers, useV3MintState } from "state/mint/v3/hooks";
import LiquidityChartRangeInput from "components/LiquidityChartRangeInput";
import { USDPrices } from "pages/NewAddLiquidity/components/USDPrices";
import useUSDCPrice, { useUSDCValue } from "hooks/useUSDCPrice";
import { MAI_POLYGON, USDC_POLYGON, USDT_POLYGON } from "constants/tokens";
import { useCallback, useMemo } from "react";

import { useAppDispatch } from "state/hooks";
import { useActivePreset } from "state/mint/v3/hooks";

import { Check } from "react-feather";
import { Presets } from "state/mint/v3/reducer";
import { StepTitle } from "pages/NewAddLiquidity/components/StepTitle";
import { PriceFormats } from "pages/NewAddLiquidity/components/PriceFomatToggler";
import { tryParseAmount } from "state/swap/hooks";
import { tryParsePrice } from "state/mint/v3/utils";

interface IRangeSelector {
    currencyA: Currency | null | undefined;
    currencyB: Currency | null | undefined;
    mintInfo: IDerivedMintInfo;
    isCompleted: boolean;
    additionalStep: boolean;
    priceFormat: PriceFormats;
    disabled: boolean;
}

export function SelectRange({ currencyA, currencyB, mintInfo, isCompleted, additionalStep, priceFormat, disabled }: IRangeSelector) {
    const { startPriceTypedValue } = useV3MintState();

    const dispatch = useAppDispatch();
    const activePreset = useActivePreset();

    const currencyAUSDC = useUSDCPrice(currencyA ?? undefined);
    const currencyBUSDC = useUSDCPrice(currencyB ?? undefined);

    //TODO - create one main isUSD
    const isUSD = useMemo(() => {
        return priceFormat === PriceFormats.USD;
    }, []);

    const isStablecoinPair = useMemo(() => {
        if (!currencyA || !currencyB) return false;

        const stablecoins = [USDC_POLYGON.address, USDT_POLYGON.address, MAI_POLYGON.address, "0x4259Abc22981480D81075b0E8C4Bb0b142be8EF8", "0x71118EA77cf5d5D2B06e916C75804419574B6303"];

        return stablecoins.includes(currencyA.wrapped.address) && stablecoins.includes(currencyB.wrapped.address);
    }, [currencyA, currencyB]);

    // get value and prices at ticks
    const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = useMemo(() => {
        return mintInfo.ticks;
    }, [mintInfo]);

    const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = useMemo(() => {
        return mintInfo.pricesAtTicks;
    }, [mintInfo]);

    const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper, getSetFullRange } = useRangeHopCallbacks(
        currencyA ?? undefined,
        currencyB ?? undefined,
        mintInfo.dynamicFee,
        tickLower,
        tickUpper,
        mintInfo.pool
    );

    const { onLeftRangeInput, onRightRangeInput } = useV3MintActionHandlers(mintInfo.noLiquidity);

    const tokenA = (currencyA ?? undefined)?.wrapped;
    const tokenB = (currencyB ?? undefined)?.wrapped;

    const isSorted = useMemo(() => {
        return tokenA && tokenB && tokenA.sortsBefore(tokenB);
    }, [tokenA, tokenB, mintInfo]);

    const leftPrice = useMemo(() => {
        return isSorted ? priceLower : priceUpper?.invert();
    }, [isSorted, priceLower, priceUpper, mintInfo]);

    const rightPrice = useMemo(() => {
        return isSorted ? priceUpper : priceLower?.invert();
    }, [isSorted, priceUpper, priceLower, mintInfo]);

    const price = useMemo(() => {
        if (!mintInfo.price) return;

        return mintInfo.invertPrice ? mintInfo.price.invert().toSignificant(5) : mintInfo.price.toSignificant(5);
    }, [mintInfo]);

    const currentPriceInUSD = useUSDCValue(tryParseAmount(Number(price).toFixed(5), currencyB ?? undefined));

    const isBeforePrice = useMemo(() => {
        if (!price || !leftPrice || !rightPrice) return false;

        return mintInfo.outOfRange && price > rightPrice.toSignificant(5);
    }, [price, leftPrice, rightPrice, mintInfo]);

    const isAfterPrice = useMemo(() => {
        if (!price || !leftPrice || !rightPrice) return false;

        return mintInfo.outOfRange && price < leftPrice.toSignificant(5);
    }, [price, leftPrice, rightPrice, mintInfo]);

    const handlePresetRangeSelection = useCallback(
        (preset: IPresetArgs | null) => {
            if (!price) return;

            dispatch(updateSelectedPreset({ preset: preset ? preset.type : null }));

            if (preset && preset.type === Presets.FULL) {
                getSetFullRange();
            } else {
                onLeftRangeInput(preset ? String(+price * preset.min) : "");
                onRightRangeInput(preset ? String(+price * preset.max) : "");
            }
        },
        [price]
    );

    return (
        <div className="f c">
            <StepTitle title={"Select a range"} isCompleted={isCompleted} step={additionalStep ? 3 : 2} />
            <div className="f mxs_fd-cr">
                <div className="f c">
                    <div className="mb-1">
                        <RangeSelector
                            priceLower={priceLower}
                            priceUpper={priceUpper}
                            getDecrementLower={getDecrementLower}
                            getIncrementLower={getIncrementLower}
                            getDecrementUpper={getDecrementUpper}
                            getIncrementUpper={getIncrementUpper}
                            onLeftRangeInput={onLeftRangeInput}
                            onRightRangeInput={onRightRangeInput}
                            currencyA={currencyA}
                            currencyB={currencyB}
                            mintInfo={mintInfo}
                            initial={!!mintInfo.noLiquidity}
                            disabled={!startPriceTypedValue && !mintInfo.price}
                            isBeforePrice={isBeforePrice}
                            isAfterPrice={isAfterPrice}
                            priceFormat={priceFormat}
                        />
                    </div>
                    <div className="range__chart">
                        <LiquidityChartRangeInput
                            currencyA={currencyA ?? undefined}
                            currencyB={currencyB ?? undefined}
                            feeAmount={mintInfo.dynamicFee}
                            ticksAtLimit={mintInfo.ticksAtLimit}
                            price={priceFormat === PriceFormats.USD ? (currentPriceInUSD ? parseFloat(currentPriceInUSD.toSignificant(5)) : undefined) : price ? parseFloat(price) : undefined}
                            priceLower={priceLower}
                            priceUpper={priceUpper}
                            onLeftRangeInput={onLeftRangeInput}
                            onRightRangeInput={onRightRangeInput}
                            interactive={false}
                            priceFormat={priceFormat}
                        />
                        {mintInfo.outOfRange && <div className="range__notification out-of-range">Out of range</div>}
                        {mintInfo.invalidRange && <div className="range__notification error w-100">Invalid range</div>}
                    </div>
                </div>
                <div className="ml-2 mxs_ml-0">
                    {currencyA && currencyB && <USDPrices currencyA={currencyA} currencyB={currencyB} currencyAUSDC={currencyAUSDC} currencyBUSDC={currencyBUSDC} priceFormat={priceFormat} />}
                    <PresetRanges isStablecoinPair={isStablecoinPair} activePreset={activePreset} handlePresetRangeSelection={handlePresetRangeSelection} />
                </div>
            </div>
        </div>
    );
}
