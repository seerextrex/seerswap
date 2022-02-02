import Chart from './Chart'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { min, map } from 'd3'
import Brush from './Brush'
import { BigNumber } from 'ethers'
import { formatEther, formatUnits, parseUnits } from 'ethers/lib/utils'
import { isMobile } from 'react-device-detect'
import RangeButtons from './RangeButtons'
import dayjs from 'dayjs'
import { StakingAnalyticsChartWrapper } from './styled'

export function convertDate(date: Date) {
  const yyyy = date.getUTCFullYear().toString()
  const mm = (date.getUTCMonth() + 1).toString()
  const dd = date.getUTCDate().toString()

  const mmChars = mm.split('')
  const ddChars = dd.split('')

  return yyyy + '-' + (mmChars[1] ? mm : '0' + mmChars[0]) + '-' + (ddChars[1] ? dd : '0' + ddChars[0])
}

interface StakingAnalyticsChartProps {
  stakeHistoriesResult: any[] | null
  type: string
  colors: string[]
}

export interface ChardDataInterface {
  value: string
  date: string
}

export default function StakingAnalyticsChart({ stakeHistoriesResult, type, colors }: StakingAnalyticsChartProps) {
  const [chartData, setChartData] = useState([])
  const [chart2Data, setChart2Data] = useState([])
  const [chartBorder, setChartBorder] = useState([])
  const focusHeight = 70
  const wrapper = useRef(null)
  const margin = isMobile ? { left: 45, top: 30, right: 10, bottom: 50 } : { left: 50, top: 30, right: 30, bottom: 30 }
  const [span, setSpan] = useState('Day')


  const getDaysArray = useCallback((start, end) => {
    const arr = []
    const dt = new Date(start)

    while (dt <= end) {
      arr.push(convertDate(dt))
      dt.setDate(dt.getDate() + 1)
    }
    return arr
  }, [])

  const startTimestamp = useMemo(() => {
    const day = dayjs()

    switch (span) {
      case 'Day':
        return day.subtract(type === 'apr' || type === 'ALGBfromVault' ? 2 : 1, 'day').unix()
      case 'Week':
        return day.subtract(7, 'day').unix()
      case 'Month':
        return day.subtract(1, 'month').unix()
      case 'All':
        return 'All'
      default:
        return day.subtract(1, 'day').unix()
    }
  }, [span])

  useEffect(() => {
    if (startTimestamp === 'All') {
      setChartBorder([fullDateData[0]?.date, fullDateData[fullDateData.length - 1]?.date])
      return
    }
    setChartBorder([convertDate(new Date(startTimestamp * 1000)), convertDate(new Date())])
  }, [startTimestamp])

  useEffect(() => {
    if (stakeHistoriesResult) {
      if (type === 'apr') {
        setChartData(stakeHistoriesResult.map(item => {
          const aprBigNumber = BigNumber.from(item.ALGBfromVault).mul(BigNumber.from(parseUnits('365', 18))).mul(BigNumber.from(100)).div(BigNumber.from(item.ALGBbalance))
          return {
            value: Math.floor(formatEther(aprBigNumber)),
            date: convertDate(new Date(item.date * 1000))
          }
        }))

      } else if (type === 'xALGBminted') {
        setChartData(stakeHistoriesResult.map(item => {
          return {
            value: formatUnits(BigNumber.from(item[type]), 18),
            date: convertDate(new Date(item.date * 1000))
          }
        }))
        setChart2Data(stakeHistoriesResult.map(item => {
          return {
            value: formatUnits(BigNumber.from(item['xALGBburned']), 18),
            date: convertDate(new Date(item.date * 1000))
          }
        }))
      } else {
        setChartData(stakeHistoriesResult.map(item => {
          return {
            value: formatUnits(BigNumber.from(item[type]), 18),
            date: convertDate(new Date(item.date * 1000))
          }
        }))
      }
    }
  }, [stakeHistoriesResult])


  let prevData = ''
  const fullDateData = useMemo(() => getDaysArray(min(chartData)?.date, new Date()).map(item => {
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


  const fullDateData2 = useMemo(() => getDaysArray(min(chart2Data)?.date, new Date()).map(item => {
    for (let i = 0; i < chart2Data.length; i++) {
      if (chart2Data[i].date === item) {
        return chart2Data[i]
      }
    }
    return { value: '0', date: item }
  }), [chartData])

  const borderedData = useMemo(() => fullDateData.filter(item => {
    return item.date >= chartBorder[0] && item.date <= chartBorder[1]
  }), [chartBorder, fullDateData])

  const borderedData2 = useMemo(() => fullDateData2.filter(item => {
    return item.date >= chartBorder[0] && item.date <= chartBorder[1]
  }), [chartBorder, fullDateData2])

  const X = useMemo(() => map(fullDateData, d => new Date(d.date)), [fullDateData])

  return (
    <StakingAnalyticsChartWrapper ref={wrapper}>
      {isMobile && <RangeButtons setSpan={setSpan} span={span} />}
      <Chart
        fData={borderedData}
        data2={borderedData2}
        margin={margin}
        dimensions={{ width: isMobile ? wrapper?.current?.offsetWidth - 20 : 900, height: isMobile ? 300 : 400 }}
        type={type}
        colors={colors}
      />
      {!isMobile && <Brush
        data={fullDateData}
        data2={fullDateData2}
        colors={colors}
        width={isMobile ? wrapper?.current?.offsetWidth - 80 : 900}
        margin={margin}
        focusHeight={focusHeight}
        X={X}
        updateChartData={setChartBorder} />}
    </StakingAnalyticsChartWrapper>
  )
}