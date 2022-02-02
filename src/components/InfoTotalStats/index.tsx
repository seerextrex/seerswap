import { useEffect, useMemo } from 'react'
import { formatDollarAmount } from 'utils/numbers'
import Loader from '../Loader'
import { useLocation } from 'react-router-dom'
import { StatsCard, StatsCardValue, StatsCardTitle, TotalStatsWrapper } from './styled'

function StatCard({ isLoading, title, data }: { isLoading: boolean; title: string; data: number }) {
  return (
    <StatsCard>
      <StatsCardTitle>{title}</StatsCardTitle>
      <StatsCardValue>
        {isLoading ? (
          <span>
            <Loader size={'30px'} stroke='white' />
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
  const { pathname } = useLocation()

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
      poolsStat?.forEach((item: any) => {
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
      <StatCard isLoading={isLoading} data={_data?.tvlUSD} title={'Total Value Locked'} />
      <StatCard isLoading={isLoading} data={_data?.volumeUSD} title={'Volume 24H'} />
    </TotalStatsWrapper>
  )
}
