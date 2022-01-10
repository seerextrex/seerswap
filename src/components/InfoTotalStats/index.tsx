import { useEffect } from 'react'
import styled from 'styled-components/macro'

import { formatDollarAmount } from 'utils/numbers'
import Loader from '../Loader'

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
}: {
  data: any
  isLoading: boolean
  refreshHandler: any
}) {
  useEffect(() => {
    refreshHandler()
  }, [])

  return (
    <TotalStatsWrapper>
      <StatCard isLoading={isLoading} data={data?.tvlUSD} title={'Total Volume Locked'}></StatCard>
      <StatCard isLoading={isLoading} data={data?.volumeUSD} title={'Total Trade Volume'}></StatCard>
    </TotalStatsWrapper>
  )
}
