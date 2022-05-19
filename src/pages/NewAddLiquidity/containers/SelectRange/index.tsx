import { PresetRanges } from "pages/NewAddLiquidity/components/PresetRanges";
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
                    <div className="range__notification w-100">Error</div>
                </div>
            </div>
            <div className="ml-2">
                <PresetRanges handlePresetRangeSelection={(range) => console.log(range)} />
            </div>
        </div>
    );
}
