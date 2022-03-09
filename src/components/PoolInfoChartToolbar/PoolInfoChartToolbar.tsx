import { ChartType } from '../../models/enums'

interface PoolInfoChartToolbarProps {
    chartTypes: any
    chartSpans: any
    type: number
    span: number
    setType: any
    setSpan: any
}

export default function PoolInfoChartToolbar({ chartTypes, chartSpans, type, span, setType, setSpan }: PoolInfoChartToolbarProps) {
    return (
        <div className={'flex-s-between mxs_fd-c'}>
            <ul>
                {chartTypes.map((el: any, i: number) => (
                    <button className={`btn ph-05 pv-025 mr-05 toolbar-btn ${type === el.type && 'secondary'}`} onClick={() => setType(el.type)} key={i}>
                        {el.title}
                    </button>
                ))}
            </ul>
            {type !== ChartType.LIQUIDITY && (
                <ul className={'mxs_w-100 mxs_mt-05'}>
                    {chartSpans.map((el: any, i: number) => (
                        <button className={`btn ph-05 pv-025 mr-05 toolbar-btn ${span === el.type && 'secondary'}`} onClick={() => setSpan(el.type)} key={i}>
                            {el.title}
                        </button>
                    ))}
                </ul>
            )}
        </div>
    )
}
