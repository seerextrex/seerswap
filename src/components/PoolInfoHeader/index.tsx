import styled from 'styled-components/macro'
import { useToken } from '../../hooks/Tokens'

const Header = styled.div`
  display: flex;
  width: 100%;
`

export function PoolInfoHeader({ token0, token1, fee }: { token0: string; token1: string; fee: string }) {
  const _token0 = useToken(token0)
  const _token1 = useToken(token1)

  console.log(_token0, _token1)

  return (
    <Header>
      <span>
        {_token0.symbol}/{_token1.symbol}
      </span>
    </Header>
  )
}
