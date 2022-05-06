import { RangeChart } from "pages/NewAddLiquidity/components/RangeChart";
import { RangeSelector } from "pages/NewAddLiquidity/components/RangeSelector";
import "./index.scss";

export function SelectRange() {
    return (
        <div>
            <RangeSelector />
            <RangeChart />
        </div>
    );
}
