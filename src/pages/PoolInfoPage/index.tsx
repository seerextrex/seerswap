import { useEffect } from 'react'
import { RouteComponentProps } from 'react-router'
import styled from 'styled-components/macro'
import { PoolInfoHeader } from '../../components/PoolInfoHeader'
import { useIncentiveSubgraph } from '../../hooks/useIncentiveSubgraph'
import { useInfoPoolChart } from '../../hooks/useInfoPoolChart'
import { usePoolDynamicFee } from '../../hooks/usePoolDynamicFee'
import { usePool } from '../../hooks/usePools'
import { useActiveWeb3React } from '../../hooks/web3'

const Wrapper = styled.div`
  min-width: 995px;
  max-width: 995px;
  display: flex;
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

  useEffect(() => {
    if (!id) return
    fetchPoolFn(id)
  }, [id])

  return (
    <Wrapper>
      {poolResult && (
        <PoolInfoHeader token0={poolResult.token0.id} token1={poolResult.token1.id} fee={''}></PoolInfoHeader>
      )}
    </Wrapper>
  )
}
