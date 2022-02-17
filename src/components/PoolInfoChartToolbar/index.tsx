import { ChartType } from '../../models/enums'
import { ToolbarChartTypeWrapper, ToolbarOptions, ToolbarOptionsItem, ToolbarOptionsTitle, ToolbarWrapper } from './styled'

export default function PoolInfoChartToolbar({
    chartTypes,
    chartSpans,
    type,
    span,
    setType,
    setSpan
}: {
    chartTypes: any
    chartSpans: any
    type: number
    span: number
    setType: any
    setSpan: any
}) {
    return (
        <ToolbarWrapper>
            <ToolbarChartTypeWrapper>
                <ToolbarOptionsTitle>Chart type</ToolbarOptionsTitle>
                <ToolbarOptions>
                    {chartTypes.map((el: any, i: number) => (
                        <ToolbarOptionsItem selected={type === el.type}
                                            onClick={() => setType(el.type)} key={i}>
                            {el.title}
                        </ToolbarOptionsItem>
                    ))}
                </ToolbarOptions>
            </ToolbarChartTypeWrapper>
            {type !== ChartType.LIQUIDITY && (
                <ToolbarChartTypeWrapper>
                    <ToolbarOptionsTitle>Chart span</ToolbarOptionsTitle>
                    <ToolbarOptions>
                        {chartSpans.map((el: any, i: number) => (
                            <ToolbarOptionsItem selected={span === el.type}
                                                onClick={() => setSpan(el.type)} key={i}>
                                {el.title}
                            </ToolbarOptionsItem>
                        ))}
                    </ToolbarOptions>
                </ToolbarChartTypeWrapper>
            )}
        </ToolbarWrapper>
    )
}
