import styled from 'styled-components/macro'
import { useAppSelector } from '../../state/hooks'

const GasPriceWrapper = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 6rem;
  color: #2f567b;
  font-size: 11px;
  opacity: 0.7;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `}
`

export function GasPrice() {
  const gasPrice = useAppSelector((state) => state.application.gasPrice.fetched)

  return <GasPriceWrapper>{`Gas price: ${Math.round(gasPrice)}`}</GasPriceWrapper>
}
