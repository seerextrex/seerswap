import { ArrowLeft } from 'react-feather'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components/macro'
import { useToken } from '../../hooks/Tokens'

const Header = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-weight: 600;
`

const Navigation = styled(NavLink)`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  text-decoration: none;
  color: white;
`
const PoolInfoWrapper = styled.div`
  display: flex;
  align-items: center;

  ${({theme}) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-start;
  `}
`

const PoolTitle = styled.span`
  font-size: 21px;
`

const PoolFee = styled.span`
  margin-left: 1rem;
  padding: 4px 6px;
  background: #02365e;
  border-radius: 6px;

  ${({theme}) => theme.mediaWidth.upToSmall`
    margin-left: 0;
    margin-top: 1rem;
  `}
`

export function PoolInfoHeader({ token0, token1, fee }: { token0: string; token1: string; fee: number }) {
  const _token0 = useToken(token0)
  const _token1 = useToken(token1)

  return (
    <Header>
      <Navigation to={'/info/pools'}>
        <ArrowLeft style={{marginRight: '8px'}} size={15}/>
        <span>Back to pool table</span>
      </Navigation>
      <PoolInfoWrapper>
        <PoolTitle>
          {_token0?.symbol || '...'} / {_token1?.symbol || '...'}
        </PoolTitle>
        <PoolFee>{`${fee / 10000}%`}</PoolFee>
      </PoolInfoWrapper>
      <span></span>
    </Header>
  )
}
