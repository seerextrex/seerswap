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
    zoom: number;
    handleZoomIn: () => void;
    handleZoomOut: () => void;
}

export default function PoolInfoChartToolbar({ chartTypes, chartSpans, type, span, setType, setSpan, zoom, handleZoomIn, handleZoomOut }: PoolInfoChartToolbarProps) {
    return (
        <div className={"flex-s-between ms_fd-c ms_f-as mxs_fd-c mxs_f-as"}>
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
            <div className="ml-a ms_ml-0 ms_mt-05 mxs_ml-0 mxs_mt-05">
                {type !== ChartType.LIQUIDITY && <div className={"toolbar-btn-title"}>CHART SPAN</div>}
                {type !== ChartType.LIQUIDITY && (
                    <ul className={"mt-05 ms_w-100 ms_mt-05 mxs_w-100 mxs_mt-05"}>
                        {chartSpans.map((el: any, i: number) => (
                            <button className={`btn toolbar-btn hover-op ${span === el.type && "active c-d"}`} onClick={() => setSpan(el.type)} key={i}>
                                {el.title}
                            </button>
                        ))}
                    </ul>
                )}
                {type === ChartType.LIQUIDITY && (
                    <>
                        <div className="toolbar-btn-title">ZOOM</div>
                        <div className="toolbar-btn__zoom f">
                            <button className="toolbar-btn__zoom-btn mr-05" disabled={zoom === 10} onClick={handleZoomIn}>
                                +
                            </button>
                            <button className="toolbar-btn__zoom-btn" disabled={zoom === 2} onClick={handleZoomOut}>
                                -
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
