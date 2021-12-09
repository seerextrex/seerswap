import React, { useLayoutEffect, useState } from 'react'
import Chart from './Chart'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'
import { DarkGreyCard } from '../Card'
import { useInfoSubgraph } from '../../hooks/subgraph/useInfoSubgraph'
import { useEffect } from 'react'
import Loader from '../Loader'
import { PageTitle } from '../PageTitle'

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
  data: any
  refreshing: boolean
  fetchHandler: (id: string, start: number, end: number) => any
  id: string
  span: number
}

export enum ChartScale {
  MONTH,
  DAY,
}

function useWindowSize() {
  const [size, setSize] = useState([0, 0])
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight])
    }

    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  return size
}

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

export default function FeeChartRangeInput({ data, refreshing, fetchHandler, id, span }: FeeChartRangeInputProps) {

  const windowWidth = useWindowSize()

  function getDateAgo(date, days) {
    const dateCopy = new Date(date)

    dateCopy.setDate(date.getDate() - days)
    return dateCopy.getTime()
  }
  const currentData = new Date()

  const [startDate, setStartDate] = useState(getDateAgo(currentData, 1))

  useEffect(() => {
    if (span === 0) {
      setStartDate(getDateAgo(currentData, 1))
    }
    if (span === 1) {
      setStartDate(getDateAgo(currentData, 8))
    }
    if (span === 2) {
      setStartDate(currentData.setMonth(currentData.getMonth() - 1))
    }
    fetchHandler(id, Math.floor(startDate / 1000), Math.floor(new Date().getTime() / 1000))
    // console.log(Math.floor(startDate / 1000), Math.floor(new Date().getTime() / 1000))
  }, [span])

 useEffect(() => {
   // console.log(data, span)
 }, [data, span])

  return (
    <Wrapper>
      {refreshing ?
        (
          <MockLoading>
            <Loader stroke={'white'} size={'25px'} />
          </MockLoading>
        ) :
        (
          <React.Fragment>
            <Chart
              feeData={data || undefined}
              dimensions={{
                width: windowWidth[0] < 1100 ? windowWidth[0] - 200 : 950,
                height: 300,
                margin: { top: 30, right: windowWidth[0] < 961 ? 0 : 0, bottom: 30, left: 40 }
              }}
              scale={span}
              startDate={startDate}
            />
          </React.Fragment>
        )}
    </Wrapper>
  )
}
