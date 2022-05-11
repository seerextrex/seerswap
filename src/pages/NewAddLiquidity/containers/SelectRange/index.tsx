import { MostUsedRanges } from "pages/NewAddLiquidity/components/MostUsedRanges";
import { RangeChart } from "pages/NewAddLiquidity/components/RangeChart";
import { RangeSelector } from "pages/NewAddLiquidity/components/RangeSelector";
import "./index.scss";

export function SelectRange() {
    return (
        <div className="f">
            <div className="f c">
                <div className="mb-1">
                    <RangeSelector
                        priceHandler={() => {
                            console.log("");
                        }}
                    />
                </div>
                <div>
                    <RangeChart />
                </div>
            </div>
            <div className="ml-2">
                <MostUsedRanges handlePresetRangeSelection={(range) => console.log(range)} />
            </div>
        </div>
    );
}
