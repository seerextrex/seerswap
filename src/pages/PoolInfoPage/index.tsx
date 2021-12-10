import { useEffect } from 'react'
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

const Wrapper = styled.div`
  min-width: 995px;
  max-width: 995px;
  display: flex;
  flex-direction: column;
`
const BodyWrapper = styled.div`
  display: flex;
  height: 600px;
`

const ChartWrapper = styled.div`
  flex: 2;
  margin-right: 1rem;
`

const InfoWrapper = styled.div`
  flex: 1;
  background-color: blue;
`

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

  useEffect(() => {
    if (!id) return
    fetchPoolFn(id)
  }, [id])

  return (
    <Wrapper>
      {poolResult && (
        <>
          <PoolInfoHeader token0={poolResult.token0.id} token1={poolResult.token1.id} fee={''}></PoolInfoHeader>
          <BodyWrapper>
            <ChartWrapper>
              <PoolInfoChartToolbar></PoolInfoChartToolbar>
              <FeeChartRangeInput
                data={feesResult}
                fetchHandler={fetchFeePoolFn}
                refreshing={feesLoading}
                id={id}
              ></FeeChartRangeInput>
            </ChartWrapper>
            <InfoWrapper></InfoWrapper>
          </BodyWrapper>
        </>
      )}
    </Wrapper>
  )
}
