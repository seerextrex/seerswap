import { ArrowLeft } from 'react-feather'
import { Header, PoolCollectedFees, PoolFee, PoolTitle, PoolInfoWrapper, Navigation } from './styled'

export function PoolInfoHeader({
                                 token0,
                                 token1,
                                 fee,
                                 collectedFees
                               }: {
  token0: any
  token1: any
  fee: string
  collectedFees: string
}) {

  return (
    <Header>
      <Navigation to={'/info/pools'}>
        <ArrowLeft style={{ marginRight: '8px' }} size={15} />
        <span>Back to pools table</span>
      </Navigation>
      <PoolInfoWrapper>
        <PoolTitle>
          {token0?.symbol || '...'} / {token1?.symbol || '...'}
        </PoolTitle>
        <PoolFee>{`${+fee / 10000}%`}</PoolFee>
        <PoolCollectedFees>Total Collected Fees: ${Math.round(+collectedFees) || '...'}</PoolCollectedFees>
      </PoolInfoWrapper>
      <span />
    </Header>
  )
}
