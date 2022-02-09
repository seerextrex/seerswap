import { FarmingType } from '../../hooks/useStakerHandlers'
import { EventsList, EventsListHeader, EventsListItem, PageWrapper, PoolWrapper, TextWrapper } from './styled'
import { Token } from '@uniswap/sdk-core'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import CurrencyLogo from '../../components/CurrencyLogo'


export default function EventsHistory() {

  const eventsHistory = [
    {
      start: 'Nov 19',
      end: 'Nov 26',
      pool: {
        token0: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
        token1: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC' }
      },
      rewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
      reward: 80_000,
      bonusRewardToken: { address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', symbol: 'WMATIC' },
      bonusReward: 5000,
      participants: 92,
      type: 'Finite',
      bestAPR: '3404%',
      tvl: '175k'
    },
    {
      start: 'Dec 7',
      end: 'Dec 14',
      pool: {
        token0: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
        token1: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC' }
      },
      rewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
      reward: 80_000,
      bonusRewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
      bonusReward: 5000,
      participants: 64,
      type: 'Finite',
      bestAPR: '472%',
      tvl: '192k'
    },
    {
      start: 'Dec 22',
      end: 'Jan 5',
      pool: {
        token0: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
        token1: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC' }
      },
      rewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
      reward: 80_000,
      bonusRewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
      bonusReward: 5000,
      participants: 64,
      type: 'Finite',
      bestAPR: '472%',
      tvl: '192k'
    }
  ]

  // ALGB / USDC
  // 12. ($50k total) 500 000 ALGB
  // 13. 25 000 USDC
  // 14. Dec 22 - Jan 5
  //
  // MATIC / USDC
  // 15. 100 000 ALGB
  // 16. 10 000 USDC
  // 17. 23 NFT
  // 18. $93 000 TVL
  // 19. Medium APR - 200%
  // 20. Jan 3 - Jan 17
  //
  // MATIC / RBC
  //
  // 1. 70 000 ALGB
  // 2. 14 000 RBC
  // 3. 64 NFT
  // 4. 860% APR
  // 5. Jan 6 - Jan 20


  return <PageWrapper>
    <EventsListHeader>
      <span>Pool</span>
      <span>Reward</span>
      <span>Bonus</span>
      <span>Participants</span>
      <span>Event type</span>
      <span>TVL</span>
      <span>Best APR</span>
      <span>Dates</span>
    </EventsListHeader>
    <EventsList>
      {
        eventsHistory.map((el, i) => {
          const token1 = new Token(137, el.pool.token0.address, 18, el.pool.token0.symbol)
          const token0 = new Token(137, el.pool.token1.address, 18, el.pool.token1.symbol)
          const Reward = new Token(137, el.rewardToken.address, 18, el.rewardToken.symbol)
          const Bonus = new Token(137, el.bonusRewardToken.address, 18, el.bonusRewardToken.symbol)
          return (
            <EventsListItem key={i}>
                          <PoolWrapper>
                              <DoubleCurrencyLogo currency0={token0} currency1={token1} size={30} />
                            <TextWrapper>{`${el.pool.token0.symbol} / ${el.pool.token1.symbol}`}</TextWrapper>
                          </PoolWrapper>
              <PoolWrapper>
                <CurrencyLogo currency={Bonus} size={'30px'}/>
                <TextWrapper>{el.bonusRewardToken.symbol}</TextWrapper>
              </PoolWrapper>
              <PoolWrapper>
                <CurrencyLogo currency={Reward} size={'30px'}/>
                <TextWrapper>{el.rewardToken.symbol}</TextWrapper>
              </PoolWrapper>
              <PoolWrapper>
                <span>{el.participants}</span>
              </PoolWrapper>
             <PoolWrapper>
               <span>{el.type}</span>
             </PoolWrapper>
             <PoolWrapper>
               <span>{el.tvl}</span>
             </PoolWrapper>
             <PoolWrapper>
               <span>{el.bestAPR}</span>
             </PoolWrapper>
             <PoolWrapper>
               <span>{`${el.start} - ${el.end}`}</span>
             </PoolWrapper>
            </EventsListItem>
          )
        })

      }
    </EventsList>
  </PageWrapper>
}