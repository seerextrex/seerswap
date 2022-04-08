import Chart from './Chart'
import { useEffect, useMemo, useRef, useState } from 'react'
import { map, min } from 'd3'
import Brush from './Brush'
import { BigNumber } from 'ethers'
import { formatEther, formatUnits, parseUnits } from 'ethers/lib/utils'
import { isMobile } from 'react-device-detect'
import RangeButtons from './RangeButtons'
import { HistoryStakingSubgraph } from '../../models/interfaces'
import { useGetDaysArray } from '../../hooks/useGetDaysArray'
import { convertDate } from '../../utils/convertDate'
import { useStartTimestamp } from '../../hooks/useStartTimestamp'
import { chartTypes } from '../../models/enums'
import './index.scss'

interface StakingAnalyticsChartProps {
    stakeHistoriesResult: HistoryStakingSubgraph[] | null | string
    type: chartTypes
    colors: string[]
}

export interface ChardDataInterface {
    value: string
    date: string
}

export default function StakingAnalyticsChart({ stakeHistoriesResult, type, colors }: StakingAnalyticsChartProps) {
    const [chartData, setChartData] = useState<ChardDataInterface[]>([])
    const [chart2Data, setChart2Data] = useState<ChardDataInterface[]>([])
    const [chartBorder, setChartBorder] = useState<string[]>([])
    const focusHeight = 70
    const wrapper = useRef<HTMLDivElement | null>(null)
    const margin = isMobile ? { left: 45, top: 30, right: 10, bottom: 50 } : {
        left: 50,
        top: 30,
        right: 10,
        bottom: 30
    }
    const [span, setSpan] = useState<string>('Month')
    const getArrayDays = useGetDaysArray()
    const startTimestamp = useStartTimestamp(span, type)

    useEffect(() => {
        if (startTimestamp === 'All') {
            setChartBorder([fullDateData[0]?.date, fullDateData[fullDateData.length - 1]?.date])
            return
        }
        setChartBorder([convertDate(new Date(startTimestamp * 1000)), convertDate(new Date())])
    }, [startTimestamp])

    useEffect(() => {
        if (typeof stakeHistoriesResult === 'string' || !stakeHistoriesResult) return

        if (type === 'apr') {
            setChartData(stakeHistoriesResult.map(item => {
                const aprBigNumber = BigNumber.from(item.ALGBfromVault).mul(BigNumber.from(parseUnits('365', 18))).mul(BigNumber.from(100)).div(BigNumber.from(item.ALGBbalance))
                return {
                    value: Math.floor(+formatEther(aprBigNumber)).toString(),
                    date: convertDate(new Date(+item.date * 1000))
                }
            }))
        } else if (type === 'xALGBminted') {
            setChartData(stakeHistoriesResult.map(item => {
                return {
                    value: formatUnits(BigNumber.from(item[type]), 18),
                    date: convertDate(new Date(+item.date * 1000))
                }
            }))
            setChart2Data(stakeHistoriesResult.map(item => {
                return {
                    value: formatUnits(BigNumber.from(item['xALGBburned']), 18),
                    date: convertDate(new Date(+item.date * 1000))
                }
            }))
        } else {
            setChartData(stakeHistoriesResult.map(item => {
                return {
                    value: formatUnits(BigNumber.from(item[type]), 18),
                    date: convertDate(new Date(+item.date * 1000))
                }
            }))
        }

    }, [stakeHistoriesResult])

    let prevData = ''
    const fullDateData = useMemo(() => getArrayDays(min(chartData.map(item => item.date)), new Date()).map(item => {
        for (let i = 0; i < chartData.length; i++) {
            if (chartData[i].date === item) {
                prevData = chartData[i].value
                return chartData[i]
            }
        }
        if (type === 'xALGBtotalSupply' || type === 'ALGBbalance') {
            return { value: prevData, date: item }
        }
        return { value: '0', date: item }
    }), [chartData])

    const fullDateData2 = useMemo(() => getArrayDays(min(chart2Data.map(item => item.date)), new Date()).map(item => {
        for (let i = 0; i < chart2Data.length; i++) {
            if (chart2Data[i].date === item) {
                return chart2Data[i]
            }
        }
        return { value: '0', date: item }
    }), [chartData])

    const borderedData = useMemo(() => fullDateData.filter(item => item.date >= chartBorder[0] && item.date <= chartBorder[1]),
        [chartBorder, fullDateData])

    const borderedData2 = useMemo(() => fullDateData2.filter(item => item.date >= chartBorder[0] && item.date <= chartBorder[1]),
        [chartBorder, fullDateData2])

    const X = useMemo(() => map(fullDateData, d => new Date(d.date)), [fullDateData])

    return (
        <div className={'w-100 stacking-chart mt-1 br-12 pt-1'} ref={wrapper}>
            {
                isMobile && <RangeButtons
                    setSpan={setSpan}
                    span={span} />
            }
            <Chart
                fData={borderedData}
                data2={borderedData2}
                margin={margin}
                dimensions={{
                    width: isMobile && wrapper && wrapper.current ? wrapper?.current?.offsetWidth - 20 : 1070,
                    height: isMobile ? 400 : 500
                }}
                type={type}
                colors={colors}
            />
            {!isMobile && <Brush
                data={fullDateData}
                data2={fullDateData2}
                colors={colors}
                width={isMobile && wrapper && wrapper.current ? wrapper?.current?.offsetWidth - 80 : 1070}
                margin={margin}
                focusHeight={focusHeight}
                X={X}
                updateChartData={setChartBorder} />}
        </div>
    )
}
