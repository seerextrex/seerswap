import { Plus } from 'react-feather'
import styled, { keyframes, css } from 'styled-components/macro'
import { useActiveWeb3React } from '../../hooks/web3'
import { deviceSizes } from '../../pages/styled'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useAllTransactions } from '../../state/transactions/hooks'
import { stringToColour } from '../../utils/stringToColour'
import { getCountdownTime, getStatic, getStaticTime } from '../../utils/time'
import Loader from '../Loader'
import AlgebraLogo from '../../assets/images/algebra-logo.png'
import USDCLogo from '../../assets/images/usdc-logo.png'

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
      rgba(91, 105, 141, 0.2) 25%,
      rgba(91, 105, 141, 0.5) 60%,
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

const Card = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 1rem;
  border-radius: 1rem;
  background: #313644;
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
`
const CardHeader = styled.div`
  display: flex;
  margin-bottom: 1rem;
`

const TokenIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  background-color: ${({ name }) => (name ? stringToColour(name).background : '#3d4a6a')};
  border: 1px solid ${({ name }) => (name ? stringToColour(name).border : '#3d4a6a')};
  color: ${({ name }) => (name ? stringToColour(name).text : '#3d4a6a')};
  border-radius: 50%;
  user-select: none;
  background: ${({ logo }) => (logo ? `url(${logo})` : '')};
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

const Subtitle = styled.div`
  color: #969292;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;

  ${({ skeleton }) =>
    skeleton
      ? css`
          width: 50px;
          height: 15.2px;
          background-color: #3d4a6a;
          border-radius: 6px;
          margin-bottom: 3px;

          ${skeletonGradient}
        `
      : null}
`

const PoolsSymbols = styled.div`
  ${({ skeleton }) =>
    skeleton
      ? css`
          background: #3d4a6a;
          border-radius: 6px;
          height: 16.2px;

          ${skeletonGradient}
        `
      : null}
`

const RewardWrapper = styled.div`
  display: flex;
  padding: 8px;
  background-color: #206175;
  border: 1px solid #409ab6;
  border-radius: 8px;
  margin-bottom: 1rem;

  ${Subtitle} {
    color: #6bc5e1;
  }

  ${({ skeleton }) =>
    skeleton
      ? css`
          background-color: #273149;
          border: 1px solid #3d4a6a;

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
          background-color: #3d4a6a;
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
          background-color: #3d4a6a;
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
          background-color: #3d4a6a;
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
  background-color: #22252f;
  position: relative;
  padding: 4px;

  ${({ skeleton }) =>
    skeleton
      ? css`
          background-color: #3d4a6a;
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
            background-color: #3d4a6a;
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
  background-color: #4829bb;
  border-radius: 6px;
  transition-duration: 0.5s;

  ${skeletonGradient}
`

const StakeButton = styled.button`
  width: 100%;
  border: none;
  // background-color: #4829bb;
  background: linear-gradient(90deg, rgba(72, 41, 187, 1) 0%, rgba(188, 49, 255, 1) 100%);
  color: white;
  border-radius: 8px;
  padding: 8px 12px;
  font-weight: 500;
  margin-top: 10px;

  ${({ skeleton }) =>
    skeleton
      ? css`
          background-color: #3d4a6a;
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
  event: {
    token0,
    token1,
    rewardToken,
    bonusRewardToken,
    token0Address,
    token1Address,
    rewardAddress,
    bonusRewardAddress,
    bonusReward,
    createdAtTimestamp,
    reward,
    startTime,
    endTime,
    participants,
  } = {},
}: {
  active?: boolean
  skeleton?: any
  now: number
  refreshing: boolean
  stakeHandler: () => void
  event?: {
    token0?: string
    token1?: string
    createdAtTimestamp?: string
    rewardToken?: string
    rewardAddress?: string
    token0Address?: string
    token1Address?: string
    bonusRewardAddress?: string
    reward?: number
    startTime?: number
    endTime?: number
    bonusReward?: number
    participants?: number
  }
}) {
  const { account } = useActiveWeb3React()

  const toggleWalletModal = useWalletModalToggle()

  const specialTokens = {
    ['0x2791bca1f2de4661ed88a30c99a7a9449aa84174']: {
      name: 'USDC',
      logo: USDCLogo,
    },
    ['0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6']: {
      name: 'ALGB',
      logo: AlgebraLogo,
    },
  }

  return skeleton ? (
    <Card>
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
            backgroundColor: '#242a3b',
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
          {token0Address.toLowerCase() in specialTokens ? (
            <TokenIcon logo={specialTokens[token0Address].logo}></TokenIcon>
          ) : (
            <TokenIcon name={token0}>{token0 ? token0.slice(0, 2) : null}</TokenIcon>
          )}
          {token1Address.toLowerCase() in specialTokens ? (
            <TokenIcon logo={specialTokens[token1Address].logo}></TokenIcon>
          ) : (
            <TokenIcon
              style={{
                marginLeft: '-9px',
              }}
              name={token1}
            >
              {token1 ? token1.slice(0, 2) : null}
            </TokenIcon>
          )}
        </TokensIcons>
        <div>
          <Subtitle>POOL</Subtitle>
          <PoolsSymbols>{`${token0}/${token1}`}</PoolsSymbols>
        </div>
      </CardHeader>
      <RewardWrapper style={{ marginBottom: '6px' }}>
        {rewardAddress.toLowerCase() in specialTokens ? (
          <TokenIcon logo={specialTokens[rewardAddress].logo}></TokenIcon>
        ) : (
          <TokenIcon name={rewardToken}>{rewardToken ? rewardToken.slice(0, 2) : null}</TokenIcon>
        )}
        <div style={{ marginLeft: '1rem' }}>
          <Subtitle>Reward</Subtitle>
          <RewardSymbol>{rewardToken}</RewardSymbol>
        </div>
        {
          reward &&
          <RewardAmount title={reward}>
          {('' + reward).length <= 8 ? reward : ('' + reward).slice(0, 6) + '..'}
        </RewardAmount>
        }
      </RewardWrapper>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: 'calc(50% - 11px)',
            top: '-15px',
            backgroundColor: '#242a3b',
            borderRadius: '50%',
            padding: '3px',
          }}
        >
          <Plus style={{ display: 'block' }} size={18}></Plus>
        </div>
      </div>
      <RewardWrapper style={{ backgroundColor: '#90175b', borderColor: '#af4cad' }}>
        {bonusRewardAddress.toLowerCase() in specialTokens ? (
          <TokenIcon logo={specialTokens[bonusRewardAddress].logo}></TokenIcon>
        ) : (
          <TokenIcon name={bonusRewardAddress}>{bonusRewardAddress ? bonusRewardAddress.slice(0, 2) : null}</TokenIcon>
        )}
        <div style={{ marginLeft: '1rem' }}>
          <Subtitle style={{ color: '#ef71b8' }}>Bonus</Subtitle>
          <RewardSymbol>{bonusRewardToken}</RewardSymbol>
        </div>
        {
          bonusReward &&
          <RewardAmount title={bonusReward}>
          {('' + bonusReward).length <= 8 ? bonusReward : ('' + bonusReward).slice(0, 6) + '..'}
        </RewardAmount>
        }
      </RewardWrapper>
      <StakeInfo active>
        <div>
          <>
            <Subtitle>Start</Subtitle>
            <div>
              <span>{
                startTime &&
                new Date(startTime * 1000).toLocaleString().split(',')[0]
              }</span>
            </div>
            <div>
              <span>{startTime &&
              `${new Date(startTime * 1000).toLocaleString().split(',')[1].slice(0, -3)}`
              }</span>
            </div>
          </>
        </div>

        <div>
          <Subtitle>End</Subtitle>
          <div>
            <span>{
              endTime &&
              new Date(endTime * 1000).toLocaleString().split(',')[0]
            }</span>
          </div>
          <div>
            {
              endTime &&
              <span>{`${new Date(endTime * 1000).toLocaleString().split(',')[1].slice(0, -3)}`}</span>
            }
          </div>
        </div>
      </StakeInfo>
      <EventEndTime>
        {active ? (
          <span>{`ends in ${getCountdownTime(endTime, now)}`}</span>
        ) : (
          <span>{`starts in ${getCountdownTime(startTime, now)}`}</span>
        )}
      </EventEndTime>
      <EventProgress>
        {active ? (
          <EventProgressInner progress={getProgress(startTime, endTime, now)}></EventProgressInner>
        ) : (
          <EventProgressInner progress={getProgress(createdAtTimestamp, startTime, now)}></EventProgressInner>
        )}
      </EventProgress>
      {account && !active ? (
        <StakeButton onClick={stakeHandler} skeleton={skeleton} refreshing={refreshing}>
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
