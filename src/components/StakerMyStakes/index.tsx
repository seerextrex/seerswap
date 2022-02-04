import { isAddress } from '@ethersproject/address'
import { useCallback, useMemo, useState } from 'react'
import { useEffect } from 'react'
import { ArrowRight, CheckCircle, ChevronsUp, Frown, Send } from 'react-feather'
import styled, { keyframes, css } from 'styled-components/macro'
import { useIncentiveSubgraph } from '../../hooks/useIncentiveSubgraph'
import { FarmingType, useStakerHandlers } from '../../hooks/useStakerHandlers'
import { useActiveWeb3React } from '../../hooks/web3'
import { useAllTransactions } from '../../state/transactions/hooks'
import FarmingPositionInfo from '../FarmingPositionInfo'
import Loader from '../Loader'
import Modal from '../Modal'
import { PageTitle } from '../PageTitle'

import { useLocation, useParams } from 'react-router'
import StakerMyStakesMobile from './StakerMyStakesMobile'

import AlgebraLogo from '../../assets/images/algebra-logo.png'
import USDCLogo from '../../assets/images/usdc-logo.png'
import WMATICLogo from '../../assets/images/matic-logo.png'
import StakerMyStakesMobileSkeleton from './StakerMyStakesMobileSkeleton'

import { isMobile } from 'react-device-detect'
import { log } from 'util'
import { darken, position } from 'polished'
import CurrencyLogo from '../CurrencyLogo'

import gradient from 'random-gradient'
import { NavLink } from 'react-router-dom'
import { IsActive } from './IsActive'

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

const Stakes = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
`

export const TokenIcon = styled.div`
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

  ${({ skeleton }) => (skeleton ? skeletonGradient : null)}
  background: ${({ logo }) => (logo ? `url(${logo})` : '')};
  background-size: contain;
  background-repeat: no-repeat;

  &:nth-of-type(2) {
    margin-left: -8px;
  }
`
const PositionCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin-bottom: 16px;
  font-family: Montserrat;
  width: 100%;
  border-radius: 8px;
  background-color: #1474bf;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    // display: none;
    flex-direction: column;
    background: rgba(60, 97, 126, 0.5);
    padding: 1rem;
    border-radius: 8px;

    & > * {
      &:not(:last-of-type) {
        max-width: 100%;
        min-width: 100%;
      }
    }
  `}

  ${({ navigatedTo }) =>
    navigatedTo &&
    css`
      background-color: ${({ theme }) => darken(0.05, 'rgba(91,183,255,0.6)')};
      border-radius: 5px;
      padding: 8px 5px;
    `}
`

const PositionCardHeader = styled.div`
  display: flex;
  margin-bottom: 1rem;
  background-color: #11446c;
  padding: 1rem;
  border-radius: 8px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}
`

const NFTPositionIcon = styled.div<{ name: string; skeleton: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-top: 2px;
  background: ${({ name }) => (name ? gradient('token' + name) : '')};
  ${({ skeleton }) =>
    skeleton &&
    css`
      background: rgba(60, 97, 126, 0.5);
      ${skeletonGradient}
    `};
`
const NFTPositionDescription = styled.div<{ skeleton: boolean }>`
  margin-left: 10px;
  line-height: 18px;

  ${({ skeleton }) =>
    skeleton &&
    css`
      & > * {
        background: rgba(60, 97, 126, 0.5);
        border-radius: 6px;
        ${skeletonGradient}
      }

      & > ${NFTPositionIndex} {
        height: 18px;
        width: 40px;
        margin-bottom: 3px;
        margin-top: 2px;
      }

      & > ${NFTPositionLink} {
        height: 13px;
        width: 60px;
        display: inline-block;
      }
    `}
`
const NFTPositionIndex = styled.div``

const NFTPositionLink = styled.a`
  font-size: 13px;
  color: white;

  &:hover {
    color: #01ffff;
  }
`

const PositionCardBody = styled.div`
  display: flex;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}
`

const PositionCardEvent = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  background-color: #11446c;
  padding: 1rem;
  border-radius: 8px;

  &:first-of-type {
    margin-right: 1rem;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    &:first-of-type {
      margin-bottom: 1rem;
    }
  `}
`

const PositionCardEventTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
`

const PositionCardStats = styled.div`
  display: flex;
  margin-bottom: 1rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}
`

const PositionCardStatsItemWrapper = styled.div`
  display: flex;
  margin-right: 1rem;
  width: 100%;
  &:nth-of-type(2n) {
    margin-left: 1rem;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-right: 0;
    
    &:first-of-type {
      margin-bottom: 1rem;
    }

    &:last-of-type {
      margin-left: 0;
    }
  `}
`

const PositionCardStatsItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`

const PositionCardStatsItemTitle = styled.div`
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
`

const PositionCardStatsItemValue = styled.div`
  font-size: 16px;
  line-height: 25px;
`

const PositionCardMock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 92px;
`

export const StakeId = styled.div`
  display: flex;
  align-items: center;
  min-width: 96px !important;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-bottom: 1rem;

    &::before {
      content: "ID";
      margin-right: 1rem;
    }
  `}
`

export const StakePool = styled.div`
  display: flex;
  align-items: center;
  margin-left: 2rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-bottom: 1rem;
    margin-left: 0;
    margin-top: 1rem;
`}
`
const StakeSeparator = styled.div`
  display: flex;
  align-items: center;
  color: #878d9d;
  font-size: 14px;
  font-style: italic;
  margin: 0 1rem;
`

export const StakeReward = styled.div<{ reward?: string }>`
  display: flex;
  align-items: center;

  & > ${TokenIcon} {
    // margin-right: 16px;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-bottom: 1rem;
  &::before {
    content: "${(p) => p.reward || 'Reward'}";
    margin-right: 1rem;
  }
`}
`

export const StakeCountdown = styled.div`
  font-size: 16px;
  margin: auto;
  display: flex;

  max-width: 105px !important;
  min-width: 105px !important;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0 0 1rem 0;
    max-width: unset !important;
    min-width: unset !important;
    
     &::before {
    content: "End Time";
    margin-right: 1rem;
  }
  `}

  & > * {
    ${({ skeleton }) =>
      skeleton
        ? css`
            width: 80px;
            height: 16px;
            background: #5aa7df;
            border-radius: 4px;

            ${skeletonGradient}
          `
        : null}
  }
`

const StakeBottomWrapper = styled.div`
  display: flex;
`

const StakeCountdownWrapper = styled.div`
  display: flex;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}
`

const StakeCountdownProgress = styled.div<{ started: boolean }>`
  width: 100%;
  margin-right: ${({ started }) => (started ? '0' : '1rem')};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-bottom: ${({ started }) => (started ? '0' : '1rem')};
  `}
`

const StakeActions = styled.div`
  width: 100%;
  display: flex;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;

    & > ${StakeButton} {
      
      &:first-of-type {
        margin-bottom: 1rem;
      }

      &:last-of-type {
        margin-left: 0;
      }
    }
  `}
`

export const StakeButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  background-color: ${({ skeleton, theme }) => (skeleton ? '#5aa7df' : '#36f')};
  color: white;
  width: 100%;
  font-weight: 600;

  &:nth-of-type(2n) {
    margin-left: 1rem;
  }

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.winterMainButton)};
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.4;
      cursor: default;

      &:hover {
        background-color: #36f;
      }
    `}

  ${({ skeleton }) =>
    skeleton
      ? css`
          ${skeletonGradient}
          width: 80px;
        `
      : null}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `}
`

const StakeListHeader = styled.div`
  display: flex;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #202635;

  & > * {
    max-width: calc(100% / 6);
    min-width: calc(100% / 6);
    font-weight: 500;
    color: white;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-bottom: 0;
    display: none;
    `};
`

export const TokensNames = styled.div`
  margin-left: 0.5rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-left: .2rem;
    font-size: 14px;
  `}

  & > * {
    ${({ skeleton }) =>
      skeleton
        ? css`
            width: 40px;
            height: 16px;
            background: #5aa7df;
            margin-bottom: 3px;
            border-radius: 4px;
            ${skeletonGradient}
          `
        : null}
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

const SendModal = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  width: 100%;
`

const ModalTitle = styled.div`
  margin-bottom: 1rem;
  font-size: 18px;
  font-weight: 600;
  color: #080064;
`

const RecipientInput = styled.input`
  padding: 8px;
  border: none;
  border-radius: 8px;
  width: 100%;
`

const SendNFTButton = styled.button`
  padding: 10px 16px;
  width: 100%;
  color: white;
  background-color: ${({ theme }) => theme.winterMainButton};
  border-radius: 8px;
  border: none;

  &:disabled {
    opacity: 0.4;
  }
`

export const MoreButton = styled.button<{ single: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: white;
  color: #36f;
  border-radius: 4px;
  padding: 8px;
  height: 30px;
  font-weight: 600;

  &:first-of-type {
    margin: auto 0 auto auto;
  }

  &:last-of-type {
    margin: ${({ single }) => (single ? 'auto 0 auto auto' : 'auto 0 auto 1rem')};
  }

  &:hover {
    background-color: ${darken(0.1, '#fff')};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0 0 1rem 0;

    &:first-of-type {
      margin: 0 0 1rem;
    }

    &:last-of-type {
      margin: 0;
    }

  `}
`
const SendNFTWarning = styled.div`
  margin-bottom: 1rem;
  padding: 8px 12px;
  background: #e4e46b;
  color: #333303;
  border-radius: 8px;
}
`

const EventProgress = styled.div`
  width: 100%;
  height: 16px;
  margin-top: 6px;
  border-radius: 6px;
  background-color: white;
  position: relative;
  padding: 4px;
`
const EventEndTime = styled.div`
  line-height: 16px;
  font-size: 13px;
  position: relative;
  margin-bottom: 3px;
`

const EventProgressInner = styled.div.attrs(({ progress }: { progress: number }) => ({
  style: {
    width: `${progress}%`,
  },
}))<{ progress: number }>`
  height: 100%;
  background-color: #5bb7ff;
  border-radius: 6px;
  transition-duration: 0.5s;

  ${skeletonGradient}
`

const CheckOutLink = styled(NavLink)`
  color: #01ffff;
  font-size: 14px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const PositionNotDepositedText = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
`

export function StakerMyStakes({
    data,
    refreshing,
    now,
    fetchHandler
}: {
    data: any
    refreshing: boolean
    now: number
    fetchHandler: () => any
}) {
  const { account } = useActiveWeb3React()

  const {
    getRewardsHandler,
    getRewardsHash,
    eternalCollectRewardHandler,
    eternalCollectRewardHash,
    withdrawHandler,
    withdrawnHash,
    sendNFTL2Handler,
    sendNFTL2Hash,
  } = useStakerHandlers() || {}

  const { hash } = useLocation()

  const [sendModal, setSendModal] = useState(false)
  const [recipient, setRecipient] = useState('')

  const sendNFTHandler = useCallback(
    (v) => {
      if (!isAddress(recipient) || recipient === account) {
        return
      }

      sendNFTL2Handler(recipient, v)
    },
    [recipient]
  )

  const [gettingReward, setGettingReward] = useState({ id: null, state: null, farmingType: null })
  const [eternalCollectReward, setEternalCollectReward] = useState({ id: null, state: null })

  const [unstaking, setUnstaking] = useState({ id: null, state: null })
  const [sending, setSending] = useState({ id: null, state: null })

  const [shallowPositions, setShallowPositions] = useState(null)

  const allTransactions = useAllTransactions()

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

  useEffect(() => {
    setShallowPositions(data)
  }, [data])

  const stakedNFTs = useMemo(() => {
    if (!shallowPositions) return
    const _positions = shallowPositions.filter((v) => v.onFarmingCenter)
    return _positions.length > 0 ? _positions : []
  }, [shallowPositions])

  useEffect(() => {
    if (!sending.state) return

    if (sendNFTL2Hash === 'failed') {
      setSending({ id: null, state: null })
    } else if (sendNFTL2Hash && confirmed.includes(sendNFTL2Hash.hash)) {
      setSending({ id: sendNFTL2Hash.id, state: 'done' })
      setShallowPositions(shallowPositions.filter((el) => el.l2TokenId === sendNFTL2Hash.id))
    }
  }, [sendNFTL2Hash, confirmed])

  useEffect(() => {
    if (!eternalCollectReward.state) return

    if (eternalCollectRewardHash === 'failed') {
      setEternalCollectReward({ id: null, state: null })
    } else if (eternalCollectRewardHash && confirmed.includes(eternalCollectRewardHash.hash)) {
      setEternalCollectReward({ id: eternalCollectRewardHash.id, state: 'done' })
      setShallowPositions(
        shallowPositions.map((el) => {
          if (el.id === eternalCollectRewardHash.id) {
            el.eternalEarned = 0
            el.eternalBonusEarned = 0
          }
          return el
        })
      )
    }
  }, [eternalCollectRewardHash, confirmed])

  useEffect(() => {
    if (!gettingReward.state) return

    if (getRewardsHash === 'failed') {
      setGettingReward({ id: null, state: null, farmingType: null })
    } else if (getRewardsHash && confirmed.includes(getRewardsHash.hash)) {
      setGettingReward({ id: getRewardsHash.id, state: 'done', farmingType: getRewardsHash.farmingType })
      setShallowPositions(
        shallowPositions.map((el) => {
          if (el.id === getRewardsHash.id) {
            if (getRewardsHash.farmingType === FarmingType.FINITE) {
              el.incentive = null
            } else {
              el.eternalFarming = null
            }
          }
          return el
        })
      )
    }
  }, [getRewardsHash, confirmed])

        function format(digit: number) {
            return digit < 10 ? `0${digit}` : digit
        }

    if (withdrawnHash === 'failed') {
      setUnstaking({ id: null, state: null })
    } else if (withdrawnHash && confirmed.includes(withdrawnHash.hash)) {
      setUnstaking({ id: withdrawnHash.id, state: 'done' })
      setShallowPositions(
        shallowPositions.map((el) => {
          if (el.id === withdrawnHash.id) {
            el.onFarmingCenter = false
          }
          return el
        })
      )
    }

    function formatReward(earned) {
        const _earned = String(earned)
        return _earned.length > 8 ? `${_earned.slice(0, 8)}..` : _earned
    }

    return `${days > 0 ? `${days}d ` : ''}${format(hours)}:${format(minutes)}:${format(seconds)}`
  }

  function formatReward(earned) {
    if (earned === 0) {
      return '0'
    }

    if (earned < 0.001 && earned > 0) {
      return '< 0.001'
    }

    const _earned = String(earned).split('.')
    return `${_earned[0].length > 8 ? `${_earned[0].slice(0, 8)}..` : _earned[0]}${
      !_earned[1].split('').every((el) => el === '0') ? `.${_earned[1].slice(0, 2)}` : ``
    }`
  }

  function getProgress(startTime: number, endTime: number, now: number) {
    const length = endTime - startTime
    const elapsed = endTime - now / 1000

    return 100 - (elapsed * 100) / length
  }

  function CheckOut({ link }: { link: string }) {
    return (
      <CheckOutLink to={`/farming/${link}`}>
        <span>Check out available farms →</span>
      </CheckOutLink>
    )
  }

  function getTable(positions) {
    return positions.map((el, i) => (
      <PositionCard key={i} navigatedTo={hash == `#${el.id}`}>
        <PositionCardHeader>
          <div style={{ display: 'flex' }}>
            <NFTPositionIcon name={el.id}>
              <span>{el.id}</span>
            </NFTPositionIcon>
            <NFTPositionDescription>
              <NFTPositionIndex>
                <IsActive el={el}></IsActive>
              </NFTPositionIndex>
              <NFTPositionLink
                href={`https://app.algebra.finance/#/pool/${+el.id}?onFarming=true`}
                rel="noopener noreferrer"
                target="_blank"
              >
                View position
              </NFTPositionLink>
            </NFTPositionDescription>
          </div>
          <StakePool>
            <>
              <CurrencyLogo currency={{ address: el.token0, symbol: el.pool.token0.symbol }} size={'35px'} />
              <CurrencyLogo
                currency={{ address: el.token1, symbol: el.pool.token1.symbol }}
                size={'35px'}
                style={{ marginLeft: '-1rem' }}
              />
              <TokensNames>
                <PositionCardStatsItemTitle style={{ lineHeight: '20px' }}>Pool</PositionCardStatsItemTitle>
                <div>{`${el.pool.token0.symbol} / ${el.pool.token1.symbol}`}</div>
              </TokensNames>
            </>
          </StakePool>
          {!el.incentive && !el.eternalFarming && (
            <MoreButton
              disabled={unstaking.id === el.id && unstaking.state !== 'done'}
              onClick={() => {
                setUnstaking({ id: el.id, state: 'pending' })
                withdrawHandler(el.id, { ...el })
              }}
            >
              {unstaking && unstaking.id === el.id && unstaking.state !== 'done' ? (
                <>
                  <Loader size={'15px'} stroke={'#36f'} style={{ margin: 'auto' }} />
                  <span style={{ marginLeft: '5px' }}>Withdrawing</span>
                </>
              ) : (
                <>
                  <ChevronsUp color={'#36f'} size={18} />
                  <span style={{ marginLeft: '5px' }}>{`Withdraw`}</span>
                </>
              )}
            </MoreButton>
          )}
          <MoreButton single={el.incentive || el.eternalFarming} onClick={() => setSendModal(el.L2tokenId)}>
            <Send color={'#36f'} size={15} />
            <span style={{ marginLeft: '6px' }}>Send</span>
          </MoreButton>
        </PositionCardHeader>
        <PositionCardBody>
          <PositionCardEvent>
            <PositionCardEventTitle>Event</PositionCardEventTitle>
            {el.incentive ? (
              <>
                <PositionCardStats>
                  <PositionCardStatsItemWrapper>
                    <CurrencyLogo
                      size={'35px'}
                      currency={{ address: el.incentiveRewardToken?.id, symbol: el.incentiveRewardToken?.symbol }}
                    ></CurrencyLogo>
                    <PositionCardStatsItem>
                      <PositionCardStatsItemTitle>Reward</PositionCardStatsItemTitle>
                      <PositionCardStatsItemValue title={el.incentiveEarned}>{`${formatReward(el.incentiveEarned)} ${
                        el.incentiveRewardToken.symbol
                      }`}</PositionCardStatsItemValue>
                    </PositionCardStatsItem>
                  </PositionCardStatsItemWrapper>
                  <PositionCardStatsItemWrapper>
                    <CurrencyLogo
                      size={'35px'}
                      currency={{
                        address: el.incentiveBonusRewardToken?.id,
                        symbol: el.incentiveBonusRewardToken?.symbol,
                      }}
                    ></CurrencyLogo>
                    <PositionCardStatsItem>
                      <PositionCardStatsItemTitle>Bonus reward</PositionCardStatsItemTitle>
                      <PositionCardStatsItemValue title={el.incentiveBonusEarned}>{`${formatReward(
                        el.incentiveBonusEarned
                      )} ${el.incentiveBonusRewardToken.symbol}`}</PositionCardStatsItemValue>
                    </PositionCardStatsItem>
                  </PositionCardStatsItemWrapper>
                </PositionCardStats>
                <StakeBottomWrapper>
                  {!el.ended && el.incentiveEndTime * 1000 > Date.now() && (
                    <StakeCountdownWrapper>
                      <StakeCountdownProgress started={el.started || el.incentiveStartTime * 1000 < Date.now()}>
                        {!el.started && el.incentiveStartTime * 1000 > Date.now() && (
                          <EventEndTime>{`Starts in ${getCountdownTime(el.incentiveStartTime)}`}</EventEndTime>
                        )}
                        {(el.started || el.incentiveStartTime * 1000 < Date.now()) && (
                          <EventEndTime>{`Ends in ${getCountdownTime(el.incentiveEndTime)}`}</EventEndTime>
                        )}
                        <EventProgress>
                          {!el.started && el.incentiveStartTime * 1000 > Date.now() ? (
                            <EventProgressInner
                              progress={getProgress(el.createdAtTimestamp, el.incentiveStartTime, now)}
                            ></EventProgressInner>
                          ) : (
                            <EventProgressInner
                              progress={getProgress(el.incentiveStartTime, el.incentiveEndTime, now)}
                            ></EventProgressInner>
                          )}
                        </EventProgress>
                      </StakeCountdownProgress>
                      {!el.started && el.incentiveStartTime * 1000 > Date.now() && (
                        <StakeButton
                          disabled={
                            gettingReward.id === el.id &&
                            gettingReward.farmingType === FarmingType.FINITE &&
                            gettingReward.state !== 'done'
                          }
                          onClick={() => {
                            setGettingReward({ id: el.id, state: 'pending', farmingType: FarmingType.FINITE })
                            getRewardsHandler(el.id, { ...el }, FarmingType.FINITE)
                          }}
                        >
                          {gettingReward &&
                          gettingReward.farmingType === FarmingType.FINITE &&
                          gettingReward.id === el.id &&
                          gettingReward.state !== 'done' ? (
                            <span>
                              <Loader size={'13px'} stroke={'white'} style={{ margin: 'auto' }} />
                            </span>
                          ) : (
                            <span>{`Undeposit`}</span>
                          )}
                        </StakeButton>
                      )}
                    </StakeCountdownWrapper>
                  )}
                  {(el.ended || el.incentiveEndTime * 1000 < Date.now()) && (
                    <StakeButton
                      disabled={
                        (gettingReward.id === el.id &&
                          gettingReward.farmingType === FarmingType.FINITE &&
                          gettingReward.state !== 'done') ||
                        el.incentiveReward == 0
                      }
                      onClick={() => {
                        setGettingReward({ id: el.id, state: 'pending', farmingType: FarmingType.FINITE })
                        getRewardsHandler(el.id, { ...el }, FarmingType.FINITE)
                      }}
                    >
                      {gettingReward &&
                      gettingReward.farmingType === FarmingType.FINITE &&
                      gettingReward.id === el.id &&
                      gettingReward.state !== 'done' ? (
                        <span>
                          <Loader size={'13px'} stroke={'white'} style={{ margin: 'auto' }} />
                        </span>
                      ) : (
                        <span>{`Collect rewards & Undeposit`}</span>
                      )}
                    </StakeButton>
                  )}
                </StakeBottomWrapper>
              </>
            ) : (
              <PositionCardMock>
                <PositionNotDepositedText>Position is not deposited</PositionNotDepositedText>
                <CheckOut link={'future-events'} />
              </PositionCardMock>
            )}
          </PositionCardEvent>
          <PositionCardEvent>
            <PositionCardEventTitle>
              <span>Infinite farming</span>
              <span style={{ fontSize: '14px', fontWeight: 400, lineHeight: '21px' }}>
                <span>Entered at: </span>
                <span>{new Date(el.enteredInEternalFarming * 1000).toLocaleString().split(',')[0]}</span>
                <span>{`${new Date(el.enteredInEternalFarming * 1000)
                  .toLocaleString()
                  .split(',')[1]
                  .slice(0, -3)}`}</span>
              </span>
            </PositionCardEventTitle>
            {el.eternalFarming ? (
              <>
                <PositionCardStats>
                  <PositionCardStatsItemWrapper>
                    <CurrencyLogo
                      size={'35px'}
                      currency={{ address: el.eternalRewardToken.id, symbol: el.eternalRewardToken.symbol }}
                    ></CurrencyLogo>
                    <PositionCardStatsItem>
                      <PositionCardStatsItemTitle>Reward</PositionCardStatsItemTitle>
                      <PositionCardStatsItemValue title={el.eternalEarned}>{`${formatReward(el.eternalEarned)} ${
                        el.eternalRewardToken.symbol
                      }`}</PositionCardStatsItemValue>
                    </PositionCardStatsItem>
                  </PositionCardStatsItemWrapper>
                  <PositionCardStatsItemWrapper>
                    <CurrencyLogo
                      size={'35px'}
                      currency={{ address: el.eternalBonusRewardToken.id, symbol: el.eternalBonusRewardToken.symbol }}
                    ></CurrencyLogo>
                    <PositionCardStatsItem>
                      <PositionCardStatsItemTitle>Bonus Reward</PositionCardStatsItemTitle>
                      <PositionCardStatsItemValue title={el.eternalBonusEarned}>{`${formatReward(
                        el.eternalBonusEarned
                      )} ${el.eternalBonusRewardToken.symbol}`}</PositionCardStatsItemValue>
                    </PositionCardStatsItem>
                  </PositionCardStatsItemWrapper>
                </PositionCardStats>
                <StakeActions>
                  {console.log(el.eternalEarned, el.eternalBonusEarned)}
                  <StakeButton
                    disabled={
                      (eternalCollectReward.id === el.id && eternalCollectReward.state !== 'done') ||
                      (el.eternalEarned == 0 && el.eternalBonusEarned == 0)
                    }
                    onClick={() => {
                      setEternalCollectReward({ id: el.id, state: 'pending' })
                      eternalCollectRewardHandler(el.id, { ...el })
                    }}
                  >
                    {eternalCollectReward &&
                    eternalCollectReward.id === el.id &&
                    eternalCollectReward.state !== 'done' ? (
                      <span>
                        <Loader size={'13px'} stroke={'white'} style={{ margin: 'auto' }} />
                      </span>
                    ) : (
                      <span>{`Collect rewards`}</span>
                    )}
                  </StakeButton>
                  <StakeButton
                    disabled={
                      gettingReward.id === el.id &&
                      gettingReward.farmingType === FarmingType.ETERNAL &&
                      gettingReward.state !== 'done'
                    }
                    onClick={() => {
                      setGettingReward({ id: el.id, state: 'pending', farmingType: FarmingType.ETERNAL })
                      getRewardsHandler(el.id, { ...el }, FarmingType.ETERNAL)
                    }}
                  >
                    {gettingReward &&
                    gettingReward.id === el.id &&
                    gettingReward.farmingType === FarmingType.ETERNAL &&
                    gettingReward.state !== 'done' ? (
                      <span>
                        <Loader size={'13px'} stroke={'white'} style={{ margin: 'auto' }} />
                      </span>
                                        ) : (
                                            <span>{`Collect reward`}</span>
                                        )}
                                    </StakeButton>
                                    <MoreButton style={{ marginLeft: '8px' }}
                                                onClick={() => setSendModal(el.L2tokenId)}>
                                        <Send color={'white'} size={18} />
                                    </MoreButton>
                                </>
                            )
                        )
                    ) : (
                      <span>{`Undeposit`}</span>
                    )}
                  </StakeButton>
                </StakeActions>
              </>
            ) : (
              <PositionCardMock>
                <PositionNotDepositedText>Position is not deposited</PositionNotDepositedText>
                <CheckOut link={'infinite-farms'} />
              </PositionCardMock>
            )}
          </PositionCardEvent>
        </PositionCardBody>
      </PositionCard>
    ))
  }

    return (
        <>
            <Modal
                isOpen={sendModal}
                onDismiss={() => {
                    if (sending.state !== 'pending') {
                        setSendModal(false)
                        setRecipient('')
                        setTimeout(() => setSending({ id: null, state: null }))
                    }
                }}
            >
                <SendModal
                    style={{ alignItems: sending && sending.state === 'done' ? 'center' : '' }}>
                    {sending.state === 'done' ? (
                        <>
                            <CheckCircle size={'35px'} stroke={'#27AE60'} />
                            <div style={{ marginTop: '1rem' }}>{`NFT was sent!`}</div>
                        </>
                    ) : (
                        <>
                            <ModalTitle>Send NFT to another account</ModalTitle>
                            <SendNFTWarning>
                                {
                                    'If you send your NFT to another account, you can’t get it back unless you have an access to the recipient’s account.'
                                }
                            </SendNFTWarning>
                            <div style={{ marginBottom: '1rem' }}>
                                <RecipientInput
                                    placeholder='Enter a recipient'
                                    value={recipient}
                                    onChange={(v) => {
                                        setRecipient(v.target.value)
                                    }}
                                />
                            </div>
                            <div>
                                <SendNFTButton
                                    disabled={!isAddress(recipient) || recipient === account}
                                    onClick={() => {
                                        setSending({ id: sendModal, state: 'pending' })
                                        sendNFTHandler(sendModal)
                                    }}
                                >
                                    {sending && sending.id === sendModal && sending.state !== 'done' ? (
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center'
                                        }}>
                      <Loader size={'18px'} stroke={'white'} style={{ margin: 'auto 10px auto' }} />
                      <span>Sending</span>
                    </span>
                  ) : (
                    <span>{`Send NFT`}</span>
                  )}
                </SendNFTButton>
              </div>
            </>
          )}
        </SendModal>
      </Modal>
      {refreshing || !shallowPositions ? (
        <EmptyMock>
          <Loader stroke={'white'} size={'20px'} />
        </EmptyMock>
      ) : shallowPositions && shallowPositions.length === 0 ? (
        <EmptyMock>
          <div>No farms</div>
          <Frown size={35} stroke={'white'} />
        </EmptyMock>
      ) : shallowPositions && shallowPositions.length !== 0 ? (
        <>
          {stakedNFTs && (
            <>
              <Stakes>{getTable(stakedNFTs)}</Stakes>
            </>
          )}
        </>
    )
}
