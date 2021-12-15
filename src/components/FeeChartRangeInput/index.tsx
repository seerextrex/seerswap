import React, { useLayoutEffect, useMemo, useState } from 'react'
import Chart from './Chart'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'
import { DarkGreyCard } from '../Card'
import { useInfoSubgraph } from '../../hooks/subgraph/useInfoSubgraph'
import { useEffect } from 'react'
import Loader from '../Loader'
import { PageTitle } from '../PageTitle'
import { ChartType } from '../../pages/PoolInfoPage'

const Wrapper = styled.div`
  width: 100%;
`
const MockLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 385px;
  padding: 0 16px;
  max-width: 1000px;
`

interface FeeChartRangeInputProps {
  fetchedData: {
    data: Array<any>
    previousData: Array<any>
  }
  refreshing: boolean
  id: string
  span: number
  type: number
  startDate: number
}

// function useWindowSize() {
//   const [size, setSize] = useState([0, 0])
//   useLayoutEffect(() => {
//     function updateSize() {
//       setSize([window.innerWidth, window.innerHeight])
//     }

//     window.addEventListener('resize', updateSize)
//     updateSize()
//     return () => window.removeEventListener('resize', updateSize)
//   }, [])
//   return size
// }

export function daysCount(month: number, year: number) {
  switch (month) {
    case 3:
    case 10:
    case 8:
    case 5:
      return 30
    case 0:
    case 2:
    case 4:
    case 6:
    case 7:
    case 9:
    case 11:
      return 31
    case 1:
      return (year - 2000) % 4 === 0 ? 29 : 28
    default:
      return 31
  }
}

export default function FeeChartRangeInput({
  fetchedData,
  refreshing,
  span,
  type,
  startDate,
}: FeeChartRangeInputProps) {
  // const windowWidth = useWindowSize()

  const windowWidth = useMemo(() => {
    return window.innerWidth
  }, [window.innerWidth])

  const formattedData = useMemo(() => {
    if (!fetchedData) return undefined
    if (fetchedData.data.length === 0) return []

    const field = type === ChartType.TVL ? 'tvlUSD' : type === ChartType.VOLUME ? 'volumeUSD' : 'feesUSD'

    if (type === ChartType.FEES) {
      return {
        data: fetchedData.data.map((el) => ({
          timestamp: new Date(el.timestamp * 1000),
          value: el.fee / el.changesCount / 10000,
        })),
        previousData: fetchedData.previousData.map((el) => ({
          timestamp: new Date(el.timestamp * 1000),
          value: el.fee / 10000,
        })),
      }
    } else {
      return {
        data: fetchedData.data.map((el) => ({
          timestamp: new Date(el.periodStartUnix * 1000),
          value: +el[field],
        })),
        previousData: fetchedData.previousData.map((el) => ({
          timestamp: new Date(el.periodStartUnix * 1000),
          value: +el[field],
        })),
      }
    }
  }, [fetchedData])

  return (
    <Wrapper>
      {refreshing ? (
        <MockLoading>
          <Loader stroke={'white'} size={'25px'} />
        </MockLoading>
      ) : (
        <>
          <Chart
            feeData={formattedData || undefined}
            dimensions={{
              width: windowWidth[0] < 1100 ? windowWidth[0] - 200 : 950,
              height: 300,
              margin: { top: 30, right: windowWidth[0] < 961 ? 0 : 0, bottom: 30, left: 40 },
            }}
            span={span}
            type={type}
          />
        </>
      )}
    </Wrapper>
  )
}
