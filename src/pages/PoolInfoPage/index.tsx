import { useEffect, useMemo, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import styled from 'styled-components/macro'
import FeeChartRangeInput from '../../components/FeeChartRangeInput'
import PoolInfoChartToolbar from '../../components/PoolInfoChartToolbar'
import { PoolInfoHeader } from '../../components/PoolInfoHeader'
import { useInfoSubgraph } from '../../hooks/subgraph/useInfoSubgraph'
import { useIncentiveSubgraph } from '../../hooks/useIncentiveSubgraph'
import { useInfoPoolChart } from '../../hooks/useInfoPoolChart'
import { usePoolDynamicFee } from '../../hooks/usePoolDynamicFee'
import { usePool } from '../../hooks/usePools'
import { useActiveWeb3React } from '../../hooks/web3'

import dayjs from 'dayjs'

const Wrapper = styled.div`
  min-width: 995px;
  max-width: 995px;
  display: flex;
  flex-direction: column;
`
const BodyWrapper = styled.div`
  display: flex;
  height: 600px;
  width: 100%;
`
const ChartWrapper = styled.div`
  width: 100%;
`
export enum ChartType {
  VOLUME,
  TVL,
  LIQUIDITY,
  FEES,
}

export enum ChartSpan {
  DAY,
  WEEK,
  MONTH,
}

export default function PoolInfoPage({
  match: {
    params: { id },
  },
  history,
}: RouteComponentProps<{ id?: string }>) {
  const { chainId } = useActiveWeb3React()

  const {
    fetchPool: { fetchPoolFn, poolLoading, poolResult },
  } = useInfoPoolChart()

  const {
    fetchFees: { feesResult, feesLoading, fetchFeePoolFn },
  } = useInfoSubgraph()

  const [span, setSpan] = useState(ChartSpan.DAY)
  const [type, setType] = useState(ChartType.FEES)

  const startTimestamp = useMemo(() => {
    const day = dayjs()

    switch (span) {
      case ChartSpan.DAY:
        return day.subtract(1, 'day').unix()
      case ChartSpan.WEEK:
        return day.subtract(7, 'day').unix()
      case ChartSpan.MONTH:
        return day.subtract(1, 'month').unix()
    }
  }, [span])

  const chartTypes = [
    {
      type: ChartType.VOLUME,
      title: 'Volume',
    },
    {
      type: ChartType.TVL,
      title: 'TVL',
    },
    {
      type: ChartType.LIQUIDITY,
      title: 'Liquidity',
    },
    {
      type: ChartType.FEES,
      title: 'Fees',
    },
  ]

  const chartSpans = [
    {
      type: ChartSpan.DAY,
      title: 'Day',
    },
    {
      type: ChartSpan.WEEK,
      title: 'Week',
    },
    {
      type: ChartSpan.MONTH,
      title: 'Month',
    },
  ]

  useEffect(() => {
    fetchFeePoolFn(id, startTimestamp, Math.floor(new Date().getTime() / 1000))
  }, [span, type])

  useEffect(() => {
    if (!id) return
    fetchPoolFn(id)
  }, [id])

  return (
    <Wrapper>
      {poolResult && (
        <>
          <PoolInfoHeader token0={poolResult.token0.id} token1={poolResult.token1.id} fee={''} />
          <BodyWrapper>
            <ChartWrapper>
              <PoolInfoChartToolbar
                chartSpans={chartSpans}
                chartTypes={chartTypes}
                setType={setType}
                span={span}
                type={type}
                setSpan={setSpan}
              />
              <FeeChartRangeInput
                data={feesResult}
                fetchHandler={fetchFeePoolFn}
                refreshing={feesLoading}
                id={id}
                span={span}
                startDate={startTimestamp}
              />
            </ChartWrapper>
          </BodyWrapper>
        </>
      )}
    </Wrapper>
  )
}
