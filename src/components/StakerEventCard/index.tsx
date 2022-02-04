import { Plus } from 'react-feather'
import styled, { keyframes, css } from 'styled-components/macro'
import { useActiveWeb3React } from '../../hooks/web3'
import { useWalletModalToggle } from '../../state/application/hooks'
import { stringToColour } from '../../utils/stringToColour'
import { getCountdownTime } from '../../utils/time'
import Loader from '../Loader'
import { darken } from 'polished'
import CurrencyLogo from '../CurrencyLogo'
import { FarmingType } from '../../hooks/useStakerHandlers'

const skeletonAnimation = keyframes`
  100% {
    transform: translateX(100%);
  }
`

const skeletonGradient = css`
  position: relative;
  overflow: hidden;
  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(91, 105, 141, 0) 0,
      rgba(94, 131, 225, 0.25) 25%,
      rgba(94, 131, 225, 0.5) 60%,
      rgba(91, 105, 141, 0)
    );
    animation-name: ${skeletonAnimation};
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    content: '';
  }
`

const LoadingShim = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 5;
`

const Card = styled.div<{ refreshing: boolean; skeleton: boolean }>`
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(60, 97, 126, 0.5);
  width: calc(33% - 8px);

  ${({ refreshing }) =>
    refreshing
      ? css`
          & > * {
            &:not(${LoadingShim}) {
              opacity: 0.4;
            }
          }
        `
      : null}

  ${({ theme }) => theme.mediaWidth.upToSmall`{
    width: 100%;
    margin-bottom: 1rem;
  }`}

  ${({ skeleton }) =>
    skeleton &&
    css`
      background-color: #89c4ef;
    `}
`
const CardHeader = styled.div`
  display: flex;
  margin-bottom: 1rem;
`

const TokenIcon = styled.div<{ logo: string; name: string; skeleton: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  background-color: ${({ name }) => (name ? stringToColour(name).background : '#5aa7df')};
  border: 1px solid ${({ name }) => (name ? stringToColour(name).border : '#5aa7df')};
  color: ${({ name }) => (name ? stringToColour(name).text : '#5aa7df')};
  border-radius: 50%;
  user-select: none;
  background: ${({ logo }) => (logo ? `url(${logo})` : '')};
  background-repeat: no-repeat;
  background-size: contain;

  &:last-of-type {
    margin-left: -9px;
  }

  ${({ skeleton }) => (skeleton ? skeletonGradient : null)}
`

const TokensIcons = styled.div`
  display: flex;
  margin-right: 1rem;
`

const Subtitle = styled.div<{ skeleton: boolean }>`
  color: white;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;

  ${({ skeleton }) =>
    skeleton
      ? css`
          width: 50px;
          height: 15.2px;
          background-color: #5aa7df;
          border-radius: 6px;
          margin-bottom: 3px;

          ${skeletonGradient}
        `
      : null}
`

const PoolsSymbols = styled.div<{ skeleton: boolean }>`
  ${({ skeleton }) =>
    skeleton
      ? css`
          background: #5aa7df;
          border-radius: 6px;
          height: 16.2px;

          ${skeletonGradient}
        `
      : null}
`

const RewardWrapper = styled.div<{ skeleton: boolean }>`
  display: flex;
  padding: 8px;
  background-color: #2b5e91;
  border-radius: 8px;
  margin-bottom: 1rem;

  ${Subtitle} {
    color: #6bc5e1;
  }

  ${({ skeleton }) =>
    skeleton
      ? css`
          background-color: #5aa7df;
          border: 1px solid #5aa7df;

          ${skeletonAnimation}
        `
      : null}
`

const RewardAmount = styled.div`
  margin: auto 0 auto auto;
  font-size: 18px;

  ${({ skeleton }) =>
    skeleton
      ? css`
          background-color: #5aa7df;
          width: 70px;
          height: 19.2px;
          border-radius: 6px;

          ${skeletonGradient}
        `
      : null}
`

const RewardSymbol = styled.div`
  ${({ skeleton }) =>
    skeleton
      ? css`
          background-color: #5aa7df;
          height: 16.2px;
          width: 50px;
          border-radius: 6px;
          ${skeletonGradient}
        `
      : null}
`

const StakeInfo = styled.div`
  display: flex;
  margin-bottom: ${({ active }) => (active ? '10px' : '1rem')};
  justify-content: space-between;
`

const StakeDate = styled.div`
  ${({ skeleton }) =>
    skeleton
      ? css`
          width: 100px;
          height: 16.2px;
          background-color: #5aa7df;
          border-radius: 6px;

          &:not(:last-of-type) {
            margin-bottom: 3px;
          }
          ${skeletonGradient}
        `
      : null}
`

const EventProgress = styled.div`
  width: 100%;
  height: 16px;
  margin-top: 6px;
  border-radius: 6px;
  background-color: white;
  position: relative;
  padding: 4px;

  ${({ skeleton }) =>
    skeleton
      ? css`
          background-color: #5aa7df;
          margin-top: 3px;
          ${skeletonGradient}
        `
      : null}
`
const EventEndTime = styled.div`
  line-height: 16px;
  font-size: 13px;
  position: relative;
  text-align: center;
  margin-bottom: 3px;

  ${({ skeleton }) =>
    skeleton
      ? css`
          & > span {
            display: inline-block;
            border-radius: 6px;
            background-color: #5aa7df;
            height: 13px;
            width: 100px;
            ${skeletonGradient}
          }
        `
      : null}
`

const EventProgressInner = styled.div.attrs(({ progress }) => ({
  style: {
    width: `${progress}%`,
  },
}))`
  height: 100%;
  background-color: #5bb7ff;
  border-radius: 6px;
  transition-duration: 0.5s;

  ${skeletonGradient}
`

const StakeButton = styled.button`
  width: 100%;
  border: none;
  // background-color: #4829bb;
  background: ${({ theme }) => theme.winterMainButton};
  color: white;
  border-radius: 8px;
  padding: 8px 12px;
  font-weight: 500;
  margin-top: 10px;

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.winterMainButton)};
  }
  ${({ skeleton }) =>
    skeleton
      ? css`
          background-color: #5aa7df;
          height: 32px;
          ${skeletonGradient};
        `
      : null}
`

function getProgress(startTime: number, endTime: number, now: number) {
  const length = endTime - startTime
  const elapsed = endTime - now / 1000

  return 100 - (elapsed * 100) / length
}

function getUntilStart(startTime: number, endTime: number, now: number) {
  return 100 - ((startTime - now / 1000) / startTime) * 100 * 10000000
}

export function StakerEventCard({
  active,
  skeleton,
  refreshing,
  stakeHandler,
  now,
  event: { pool, createdAtTimestamp, rewardToken, bonusRewardToken, reward, bonusReward, startTime, endTime, apr } = {},
  eternal,
}: {
  active?: boolean
  skeleton?: any
  now: number
  refreshing: boolean
  stakeHandler: () => void
  event?: {
    pool?: any
    createdAtTimestamp?: string
    rewardToken?: any
    bonusRewardToken?: any
    reward?: number
    bonusReward?: number
    startTime?: number
    endTime?: number
    apr?: number
  }
  eternal?: boolean
}) {
  const { account } = useActiveWeb3React()

  const toggleWalletModal = useWalletModalToggle()

  return skeleton ? (
    <Card skeleton>
      <CardHeader>
        <TokensIcons>
          <TokenIcon skeleton></TokenIcon>
          <TokenIcon skeleton></TokenIcon>
        </TokensIcons>
        <div>
          <Subtitle skeleton></Subtitle>
          <PoolsSymbols skeleton></PoolsSymbols>
        </div>
      </CardHeader>
      <RewardWrapper skeleton style={{ marginBottom: '6px' }}>
        <TokenIcon skeleton></TokenIcon>
        <div style={{ marginLeft: '1rem' }}>
          <Subtitle skeleton></Subtitle>
          <RewardSymbol skeleton></RewardSymbol>
        </div>
        <RewardAmount skeleton></RewardAmount>
      </RewardWrapper>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: 'calc(50% - 11px)',
            top: '-15px',
            backgroundColor: '#5aa7df',
            borderRadius: '50%',
            padding: '3px',
          }}
        >
          <Plus style={{ display: 'block' }} size={18}></Plus>
        </div>
      </div>
      <RewardWrapper skeleton>
        <TokenIcon skeleton></TokenIcon>
        <div style={{ marginLeft: '1rem' }}>
          <Subtitle skeleton></Subtitle>
          <RewardSymbol skeleton></RewardSymbol>
        </div>
        <RewardAmount skeleton></RewardAmount>
      </RewardWrapper>
      <StakeInfo active>
        <div>
          <Subtitle skeleton></Subtitle>
          <StakeDate skeleton></StakeDate>
          <StakeDate skeleton></StakeDate>
        </div>
        <div>
          <Subtitle skeleton></Subtitle>
          <StakeDate skeleton></StakeDate>
          <StakeDate skeleton></StakeDate>
        </div>
      </StakeInfo>
      {active ? (
        <>
          <EventEndTime skeleton>
            <span></span>
          </EventEndTime>
          <EventProgress skeleton></EventProgress>
        </>
      ) : (
        <StakeButton skeleton></StakeButton>
      )}
    </Card>
  ) : (
    <Card refreshing={refreshing}>
      {refreshing && (
        <LoadingShim>
          <Loader size={'18px'} stroke={'white'} style={{ margin: 'auto' }} />
        </LoadingShim>
      )}
      <CardHeader>
        <TokensIcons>
          <CurrencyLogo currency={{ address: pool.token0.id, symbol: pool.token0.symbol }} size={'35px'} />
          <CurrencyLogo currency={{ address: pool.token1.id, symbol: pool.token1.symbol }} size={'35px'} />
        </TokensIcons>
        <div>
          <Subtitle>POOL</Subtitle>
          <PoolsSymbols>{`${pool.token0.symbol}/${pool.token1.symbol}`}</PoolsSymbols>
        </div>
      </CardHeader>
      <RewardWrapper style={{ marginBottom: '6px' }}>
        <CurrencyLogo currency={{ address: rewardToken.id, symbol: rewardToken.symbol }} size={'35px'} />
        <div style={{ marginLeft: '1rem' }}>
          <Subtitle style={{ color: 'rgb(138, 190, 243)' }}>{'Reward'}</Subtitle>
          <RewardSymbol>{rewardToken.symbol}</RewardSymbol>
        </div>
        {reward && (
          <RewardAmount title={reward}>
            {eternal ? (
              <span></span>
            ) : (
              <span>{`${('' + reward).length <= 8 ? reward : ('' + reward).slice(0, 6) + '..'}`}</span>
            )}
          </RewardAmount>
        )}
      </RewardWrapper>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: 'calc(50% - 11px)',
            top: '-15px',
            backgroundColor: 'rgb(19, 56, 93)',
            borderRadius: '50%',
            padding: '3px',
          }}
        >
          <Plus style={{ display: 'block' }} size={18}></Plus>
        </div>
      </div>
      {bonusReward > 0 && (
        <RewardWrapper>
          <CurrencyLogo currency={{ address: bonusRewardToken.id, symbol: bonusRewardToken.symbol }} size={'35px'} />
          <div style={{ marginLeft: '1rem' }}>
            <Subtitle style={{ color: 'rgb(138, 190, 243)' }}>{'Bonus'}</Subtitle>
            <RewardSymbol>{bonusRewardToken.symbol}</RewardSymbol>
          </div>
          {bonusReward && (
            <RewardAmount title={bonusReward}>
              {eternal ? (
                <span></span>
              ) : (
                <span>{`${('' + bonusReward).length <= 8 ? bonusReward : ('' + bonusReward).slice(0, 6) + '..'}`}</span>
              )}
            </RewardAmount>
          )}
        </RewardWrapper>
      )}
      {!eternal && (
        <StakeInfo active>
          <div>
            <>
              <Subtitle>Start</Subtitle>
              <div>
                <span>{startTime && new Date(startTime * 1000).toLocaleString().split(',')[0]}</span>
              </div>
              <div>
                <span>{startTime && `${new Date(startTime * 1000).toLocaleString().split(',')[1].slice(0, -3)}`}</span>
              </div>
            </>
          </div>

          <div>
            <Subtitle>End</Subtitle>
            <div>
              <span>{endTime && new Date(endTime * 1000).toLocaleString().split(',')[0]}</span>
            </div>
            <div>
              {endTime && <span>{`${new Date(endTime * 1000).toLocaleString().split(',')[1].slice(0, -3)}`}</span>}
            </div>
          </div>
        </StakeInfo>
      )}
      {!eternal && (
        <EventEndTime>
          {active ? (
            <span>{`ends in ${getCountdownTime(endTime, now)}`}</span>
          ) : (
            <span>{`starts in ${getCountdownTime(startTime, now)}`}</span>
          )}
        </EventEndTime>
      )}
      {!eternal && (
        <EventProgress>
          {active ? (
            <EventProgressInner progress={getProgress(startTime, endTime, now)}></EventProgressInner>
          ) : (
            <EventProgressInner progress={getProgress(createdAtTimestamp, startTime, now)}></EventProgressInner>
          )}
        </EventProgress>
      )}
      {eternal && (
        <RewardWrapper style={{ justifyContent: 'space-between' }}>
          <Subtitle style={{ fontSize: '14px', color: 'white', textTransform: 'none', lineHeight: '19px' }}>
            {'Overall APR:'}
          </Subtitle>
          <RewardSymbol>{`${apr.toFixed(2)}%`}</RewardSymbol>
        </RewardWrapper>
      )}
      {account && !active ? (
        <StakeButton
          style={{ marginTop: eternal ? '0' : '10px' }}
          onClick={stakeHandler}
          skeleton={skeleton}
          refreshing={refreshing}
        >
          Farm
        </StakeButton>
      ) : (
        !active && (
          <StakeButton onClick={toggleWalletModal} skeleton={skeleton} refreshing={refreshing}>
            Connect Wallet
          </StakeButton>
        )
      )}
    </Card>
  )
}
