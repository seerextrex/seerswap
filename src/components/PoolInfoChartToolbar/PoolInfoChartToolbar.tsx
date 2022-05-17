import { ChartType } from "../../models/enums";
import PositionsSelect from "./PositionsSelect";
import { PriceRangeChart } from "../../models/interfaces";

interface PoolInfoChartToolbarProps {
    chartTypes: any;
    chartSpans: any;
    type: number;
    span: number;
    setType: any;
    setSpan: any;
    positions: {
        closed: PriceRangeChart | null;
        opened: PriceRangeChart | null;
    };
    selected: string[];
    setSelected: (a: string[]) => void;
}

export default function PoolInfoChartToolbar({ chartTypes, chartSpans, type, span, setType, setSpan, positions, selected, setSelected }: PoolInfoChartToolbarProps) {
    return (
        <div className={"flex-s-between mxs_fd-c mxs_f-as"}>
            <div className="mxs_w-100">
                <div className={"toolbar-btn-title"}>CHART TYPE</div>
                <ul className="toolbar-btn__list mt-05">
                    {chartTypes.map((el: any, i: number) => (
                        <button className={`btn mr-05 toolbar-btn hover-op ${type === el.type && "active c-d"}`} onClick={() => setType(el.type)} key={i}>
                            {el.title}
                        </button>
                    ))}
                </ul>
            </div>
            <div className="ml-a mxs_ml-0 mxs_mt-05">
                <div className={"toolbar-btn-title"}>CHART RANGE</div>
                {type !== ChartType.LIQUIDITY && (
                    <ul className={"mt-05 mxs_w-100 mxs_mt-05"}>
                        {chartSpans.map((el: any, i: number) => (
                            <button className={`btn toolbar-btn hover-op ${span === el.type && "active c-d"}`} onClick={() => setSpan(el.type)} key={i}>
                                {el.title}
                            </button>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
