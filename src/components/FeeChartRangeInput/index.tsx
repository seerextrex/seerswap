import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import Chart from './Chart'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'
import { DarkGreyCard } from '../Card'
import { useInfoSubgraph } from '../../hooks/subgraph/useInfoSubgraph'
import { useEffect } from 'react'
import Loader from '../Loader'
import { PageTitle } from '../PageTitle'
import { ChartType } from '../../pages/PoolInfoPage'

import { isMobile } from 'react-device-detect'

const Wrapper = styled.div`
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 10px;
  background-color: #052445;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-left: -2.5rem;
    margin-right: -2.5rem;
    width: unset;
    border-radius: 20px;
    // height: 440px;
  `}
`
const MockLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 360px;
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

export default function FeeChartRangeInput({ fetchedData, refreshing, span, type }: FeeChartRangeInputProps) {
  const ref = useRef(null)

  const formattedData = useMemo(() => {
    if (!fetchedData || !fetchedData.data || fetchedData.data.length === 0) return []
    // if (fetchedData.data.length === 0) return []

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
    <Wrapper ref={ref}>
      {refreshing ? (
        <MockLoading>
          <Loader stroke={'white'} size={'25px'} />
        </MockLoading>
      ) : (
        <>
          <Chart
            feeData={formattedData || undefined}
            dimensions={{
              width: isMobile ? ref?.current?.offsetWidth - 100 || 0 : 850,
              height: 300,
              margin: { top: 30, right: 0, bottom: isMobile ? 70 : 30, left: 50 },
            }}
            isMobile={isMobile}
            span={span}
            type={type}
          />
        </>
      )}
    </Wrapper>
  )
}
