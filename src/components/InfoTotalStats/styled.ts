import styled from 'styled-components/macro'

export const TotalStatsWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}
`

export const StatsCard = styled.div`
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

export const StatsCardTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 1rem;
`

export const StatsCardValue = styled.div`
  font-size: 30px;
`
