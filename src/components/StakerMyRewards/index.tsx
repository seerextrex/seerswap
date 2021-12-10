import { useEffect, useMemo, useState } from 'react'
import { Frown } from 'react-feather'
import styled, { keyframes, css } from 'styled-components/macro'
import { useIncentiveSubgraph } from '../../hooks/useIncentiveSubgraph'
import { useStakerHandlers } from '../../hooks/useStakerHandlers'
import { useAllTransactions } from '../../state/transactions/hooks'
import { stringToColour } from '../../utils/stringToColour'
import Loader from '../Loader'

import AlgebraLogo from '../../assets/images/algebra-logo.png'
import USDCLogo from '../../assets/images/usdc-logo.png'
import WMATICLogo from '../../assets/images/matic-logo.png'

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

const Rewards = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 450px;
  min-height: 450px;
  border-radius: 8px;
  overflow: auto;
`

const RewardsRow = styled.div`
  display: flex;
  margin-bottom: 8px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
  `}
`

const Reward = styled.div`
  display: flex;
  position: relative;
  padding: 8px 16px;
  border-radius: 16px;
  border: 1px solid #202635;
  font-family: Montserrat;
  width: calc(33% - 4px);
  height: 55px;
  background: #202635;

  & > * {
    &:not(${LoadingShim}) {
      opacity: ${({ refreshing }) => (refreshing ? '0.5' : '1')};
    }
  }

  &:not(:nth-of-type(3n)) {
    margin-right: 8px;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
     width: 100%;
     margin-bottom: 20px;
  `}
`

const RewardTokenIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 1rem;
  width: 35px;
  height: 35px;
  background-color: ${({ name }) => (name ? stringToColour(name).background : '#3d4a6a')};
  border: 1px solid ${({ name }) => (name ? stringToColour(name).border : '#3d4a6a')};
  color: ${({ name }) => (name ? stringToColour(name).text : '#3d4a6a')};

  background: ${({ logo }) => (logo ? `url(${logo})` : '')};
  background-size: contain;

  ${({ skeleton }) => (skeleton ? skeletonGradient : null)}
`
const RewardTokenInfo = styled.div`
  & > * {
    font-family: Montserrat;
    font-size: 15px;
    ${({ skeleton }) =>
      skeleton
        ? css`
            width: 40px;
            height: 16px;
            background: #3d4a6a;
            margin-bottom: 3px;
            border-radius: 4px;
            ${skeletonGradient}
          `
        : null}
  }
`

const RewardClaimButton = styled.button`
  border: none;
  border-radius: 8px;
  background-color: #4829bb;
  color: white;
  margin: 0 0 0 auto;
  padding: 8px 12px;
  cursor: pointer;
  font-family: 'Montserrat';
  min-width: 60px;

  ${({ skeleton }) =>
    skeleton
      ? css`
          width: 60px;
          background-color: #3d4a6a;
          ${skeletonGradient};
        `
      : null}
  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`

const EmptyMock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;

  & > * {
    margin-bottom: 1rem;
  }
`

const StakeCTA = styled.button`
  border: none;
  background-color: #060320;
`

export function StakerMyRewards({
  data,
  refreshing,
  fetchHandler,
}: {
  data: any
  refreshing: boolean
  fetchHandler: () => any
}) {
  const allTransactions = useAllTransactions()

  const specialTokens = {
    ['0x2791bca1f2de4661ed88a30c99a7a9449aa84174']: {
      name: 'USDC',
      logo: USDCLogo,
    },
    ['0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6']: {
      name: 'ALGB',
      logo: AlgebraLogo,
    },
    ['0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270']: {
      name: 'WMATIC',
      logo: WMATICLogo,
    },
  }

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs
      .filter((tx) => new Date().getTime() - tx.addedTime < 86_400_000)
      .sort((a, b) => b.addedTime - a.addedTime)
  }, [allTransactions])

  const confirmed = useMemo(
    () => sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash),
    [sortedRecentTransactions, allTransactions]
  )

  const { claimRewardHash, claimRewardsHandler } = useStakerHandlers() || {}

  const [rewardsLoader, setRewardsLoader] = useState({ id: null, state: false })

  const isLoading = (id) => rewardsLoader.id === id && rewardsLoader.state

  useEffect(() => {
    fetchHandler()
  }, [])

  useEffect(() => {
    if (!data) return

    if (claimRewardHash && claimRewardHash.error) {
      setRewardsLoader({ id: claimRewardHash.id, state: false })
    } else if (claimRewardHash && confirmed.includes(claimRewardHash.hash)) {
      setRewardsLoader({ id: claimRewardHash.id, state: false })
      data.find((el) => el.rewardAddress === claimRewardHash.id).amount = 0
      data.find((el) => el.rewardAddress === claimRewardHash.id).trueAmount = 0
    }
  }, [claimRewardHash, confirmed])

  const chunkedRewards = useMemo(() => {
    if (!data) return

    if (!Array.isArray(data) || data.length === 0) return []

    const _rewards = [[data[0]]]

    let j = 0

    for (let i = 1; i < data.length; i++) {
      if (i % 3 === 0) {
        j++
        _rewards.push([])
      }
      _rewards[j].push(data[i])
    }

    return _rewards
  }, [data])

  function formatReward(earned) {
    if (earned === 0) {
      return '0'
    }
    const _earned = String(earned).split('.')
    return `${_earned[0].length > 8 ? `${_earned[0].slice(0, 8)}..` : _earned[0]}${
      !_earned[1].split('').every((el) => el === '0') ? `.${_earned[1].slice(0, 2)}` : ``
    }`
  }

  return (
    <>
      {!data ? (
        <Rewards>
          <RewardsRow>
            {[0, 1, 2].map((el, i) => (
              <Reward skeleton key={i}>
                <RewardTokenIcon skeleton></RewardTokenIcon>
                <RewardTokenInfo skeleton>
                  <div> </div>
                  <div> </div>
                </RewardTokenInfo>
                <RewardClaimButton skeleton></RewardClaimButton>
              </Reward>
            ))}
          </RewardsRow>
          <RewardsRow>
            {[0, 1].map((el, i) => (
              <Reward skeleton key={i}>
                <RewardTokenIcon skeleton></RewardTokenIcon>
                <RewardTokenInfo skeleton>
                  <div> </div>
                  <div> </div>
                </RewardTokenInfo>
                <RewardClaimButton skeleton></RewardClaimButton>
              </Reward>
            ))}
          </RewardsRow>
        </Rewards>
      ) : chunkedRewards.length !== 0 ? (
        <Rewards>
          {chunkedRewards.map((el, i) => (
            <RewardsRow key={i}>
              {el.map((rew, j) => (
                <Reward refreshing={refreshing} key={j}>
                  {refreshing && (
                    <LoadingShim>
                      <Loader style={{ margin: 'auto' }} size={'18px'} stroke={'white'} />
                    </LoadingShim>
                  )}
                  {rew.rewardAddress.toLowerCase() in specialTokens ? (
                    <RewardTokenIcon logo={specialTokens[rew.rewardAddress].logo}></RewardTokenIcon>
                  ) : (
                    <RewardTokenIcon name={rew.symbol}>{rew.rewardAddress}</RewardTokenIcon>
                  )}
                  <RewardTokenInfo>
                    <div title={rew.amount}>{window.innerWidth < 501 ? rew.amount : formatReward(rew.amount)}</div>
                    <div title={rew.symbol}>{rew.symbol}</div>
                  </RewardTokenInfo>
                  {isLoading(rew.rewardAddress) ? (
                    <RewardClaimButton>
                      <span>
                        <Loader style={{ margin: 'auto' }} stroke={'white'} />
                      </span>
                    </RewardClaimButton>
                  ) : (
                    <RewardClaimButton
                      disabled={rew.amount === 0}
                      onClick={() => {
                        setRewardsLoader({ id: rew.rewardAddress, state: true })
                        claimRewardsHandler(rew.rewardAddress, rew.trueAmount)
                      }}
                    >
                      {' '}
                      Claim
                    </RewardClaimButton>
                  )}
                </Reward>
              ))}
            </RewardsRow>
          ))}
        </Rewards>
      ) : chunkedRewards.length === 0 ? (
        <EmptyMock>
          <div>No rewards</div>
          <Frown size={35} stroke={'white'} />
        </EmptyMock>
      ) : null}
    </>
  )
}
