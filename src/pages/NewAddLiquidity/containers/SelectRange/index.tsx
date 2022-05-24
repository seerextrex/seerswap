import { PresetRanges } from "pages/NewAddLiquidity/components/PresetRanges";
import { RangeChart } from "pages/NewAddLiquidity/components/RangeChart";
import { RangeSelector } from "pages/NewAddLiquidity/components/RangeSelector";

import { Price, Token, Currency } from "@uniswap/sdk-core";

import "./index.scss";
import { Bound } from "state/mint/v3/actions";
import { useV3MintState } from "state/mint/v3/hooks";
import LiquidityChartRangeInput from "components/LiquidityChartRangeInput";
import { USDPrices } from "pages/NewAddLiquidity/components/USDPrices";

interface IRangeSelector {
    priceLower: Price<Token, Token> | undefined;
    priceUpper: Price<Token, Token> | undefined;
    onLeftRangeInput: (typedValue: string) => void;
    onRightRangeInput: (typedValue: string) => void;
    getDecrementLower: () => string;
    getIncrementLower: () => string;
    getDecrementUpper: () => string;
    getIncrementUpper: () => string;
    currencyA: Currency | null | undefined;
    currencyB: Currency | null | undefined;
    feeAmount: number;
    ticksAtLimit: { [bound in Bound]?: boolean | undefined };
    initial: boolean;
    disabled: boolean;
    noLiquidity: boolean | undefined;
    price: Price<Token, Token> | undefined;
    invertPrice: boolean;
}

export function SelectRange({
    priceLower,
    priceUpper,
    onLeftRangeInput,
    onRightRangeInput,
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
    currencyA,
    currencyB,
    feeAmount,
    ticksAtLimit,
    initial,
    disabled,
    noLiquidity,
    price,
    invertPrice,
}: IRangeSelector) {
    const { startPriceTypedValue } = useV3MintState();

    return (
        <div className="f">
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
                        feeAmount={feeAmount}
                        ticksAtLimit={ticksAtLimit}
                        initial={!!noLiquidity}
                        disabled={!startPriceTypedValue && !price}
                        price={price}
                        invertPrice={invertPrice}
                    />
                </div>
                <div className="range__chart">
                    <LiquidityChartRangeInput
                        currencyA={currencyA ?? undefined}
                        currencyB={currencyB ?? undefined}
                        feeAmount={feeAmount}
                        ticksAtLimit={ticksAtLimit}
                        price={price ? parseFloat((invertPrice ? price.invert() : price).toSignificant(8)) : undefined}
                        priceLower={priceLower}
                        priceUpper={priceUpper}
                        onLeftRangeInput={onLeftRangeInput}
                        onRightRangeInput={onRightRangeInput}
                        interactive={false}
                    />
                    {/* <div className="range__notification w-100">Error</div> */}
                </div>
            </div>
            <div className="ml-2">
                <USDPrices />
                <PresetRanges handlePresetRangeSelection={(range) => console.log(range)} />
            </div>
        </div>
    );
}
