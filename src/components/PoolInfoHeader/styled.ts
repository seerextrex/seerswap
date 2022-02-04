import styled from 'styled-components/macro'
import { NavLink } from 'react-router-dom'

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-weight: 600;
`
export const Navigation = styled(NavLink)`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  text-decoration: none;
  color: white;
`
export const PoolInfoWrapper = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-start;
  `}
`
export const PoolTitle = styled.span`
  font-size: 21px;
`
export const PoolFee = styled.span`
  margin-left: 1rem;
  padding: 4px 6px;
  background: #02365e;
  border-radius: 6px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-left: 0;
    margin-top: 1rem;
  `}
`
export const PoolCollectedFees = styled.span`
  margin-left: auto;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-left: 0;
    margin-top: 1rem;
  `}
`
