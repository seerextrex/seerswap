import {useEffect, useMemo} from 'react'
import styled from 'styled-components/macro'

import { formatDollarAmount } from 'utils/numbers'
import Loader from '../Loader'
import {useLocation, useParams} from "react-router-dom"

const TotalStatsWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}
`

const StatsCard = styled.div`
  border-radius: 20px;
  background-color: rgba(91, 183, 255, 0.6);
  padding: 1rem;
  width: 100%;

  &:first-of-type {
    margin-right: 1rem;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    &:first-of-type {
        margin-right: 0;
        margin-bottom: 1rem;
    }
`}
`

const StatsCardTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 1rem;
`

const StatsCardValue = styled.div`
  font-size: 30px;
`

function StatCard({ isLoading, title, data }: { isLoading: boolean; title: string; data: number }) {
  return (
    <StatsCard>
      <StatsCardTitle>{title}</StatsCardTitle>
      <StatsCardValue>
        {isLoading ? (
          <span>
            <Loader size={'30px'} stroke="white" />
          </span>
        ) : (
          formatDollarAmount(data)
        )}
      </StatsCardValue>
    </StatsCard>
  )
}

export function InfoTotalStats({
  data,
  isLoading,
  refreshHandler,
  blocksFetched,
  poolsStat
}: {
  data: any
  isLoading: boolean
  refreshHandler: any
  blocksFetched: boolean
  poolsStat: any
}) {
  const {pathname} = useLocation()

  useEffect(() => {
    if (blocksFetched) {
      refreshHandler()
    }
  }, [blocksFetched])

  const pool = useMemo(() => {
    return pathname.split('pools/')[1]
  }, [pathname])

  const _data = useMemo(() => {
    if (pool) {
      let res = {
        tvlUSD: undefined,
        volumeUSD: undefined
      }
      poolsStat?.forEach(item => {
        if (item.address.toLowerCase() === pool.toLowerCase()) {
          res = {
            tvlUSD: item.tvlUSD,
            volumeUSD: item.volumeUSD
          }
        }
      })
      return res
    }
    return {
      tvlUSD: data?.tvlUSD,
      volumeUSD: data?.volumeUSD
    }
  }, [data, poolsStat, pool])

  return (
    <TotalStatsWrapper>
      <StatCard isLoading={isLoading} data={_data?.tvlUSD} title={'Total Value Locked'}/>
      <StatCard isLoading={isLoading} data={_data?.volumeUSD} title={'Volume 24H'}/>
    </TotalStatsWrapper>
  )
}
