import { isAddress } from '@ethersproject/address'
import { useCallback, useMemo, useState } from 'react'
import { useEffect } from 'react'
import { CheckCircle, Frown, Send } from 'react-feather'
import styled, { keyframes, css } from 'styled-components/macro'
import { useIncentiveSubgraph } from '../../hooks/useIncentiveSubgraph'
import { useStakerHandlers } from '../../hooks/useStakerHandlers'
import { useActiveWeb3React } from '../../hooks/web3'
import { useAllTransactions } from '../../state/transactions/hooks'
import { stringToColour } from '../../utils/stringToColour'
import FarmingPositionInfo from '../FarmingPositionInfo'
import Loader from '../Loader'
import Modal from '../Modal'
import { PageTitle } from '../PageTitle'

import { useLocation, useParams } from 'react-router'
import StakerMyStakesMobile from './StakerMyStakesMobile'

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
    background-image: linear-gradient(90deg,
    rgba(91, 105, 141, 0) 0,
    rgba(91, 105, 141, 0.2) 25%,
    rgba(91, 105, 141, 0.5) 60%,
    rgba(91, 105, 141, 0));
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
  background-color: ${({ name }) => (name ? stringToColour(name).background : '#3d4a6a')};
  border: 1px solid ${({ name }) => (name ? stringToColour(name).border : '#3d4a6a')};
  color: ${({ name }) => (name ? stringToColour(name).text : '#3d4a6a')};
  border-radius: 50%;
  user-select: none;

  ${({ skeleton }) => (skeleton ? skeletonGradient : null)}
  &:nth-of-type(2) {
    margin-left: -8px;
  }
`
const Stake = styled.div`
  display: flex;
  padding: 8px 0;
  margin-bottom: 16px;
  font-family: Montserrat;
  width: 100%;

  & > * {
    &:not(:last-of-type) {
      max-width: calc(100% / 6);
      min-width: calc(100% / 6);
    }
  }

  ${({ navigatedTo }) =>
          navigatedTo &&
          css`
            background-color: #1a1029;
          `}
`

export const StakeId = styled.div`
  display: flex;
  align-items: center;
  min-width: 96px !important;
`

export const StakePool = styled.div`
  display: flex;
`
const StakeSeparator = styled.div`
  display: flex;
  align-items: center;
  color: #878d9d;
  font-size: 14px;
  font-style: italic;
  margin: 0 1rem;
`

export const StakeReward = styled.div`
  display: flex;

  & > ${TokenIcon} {
    // margin-right: 16px;
  }
`

export const StakeCountdown = styled.div`
  font-size: 16px;
  margin: auto;

  max-width: 94px !important;
  min-width: 94px !important;

  & > * {
    ${({ skeleton }) =>
            skeleton
                    ? css`
                      width: 80px;
                      height: 16px;
                      background: #3d4a6a;
                      border-radius: 4px;

                      ${skeletonGradient}
                    `
                    : null}
  }
`

const StakeActions = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`

export const StakeButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  background-color: ${({ skeleton }) => (skeleton ? '#3d4a6a' : '#4829bb')};
  color: white;
  min-width: 126px;

  ${({ disabled }) =>
          disabled &&
          css`
            opacity: 0.4;
            cursor: default;
          `}

  ${({ skeleton }) =>
          skeleton
                  ? css`
                    ${skeletonGradient}
                    width: 80px;
                  `
                  : null}
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
    color: #ababab;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding-bottom: 0;
    `};
`

export const TokensNames = styled.div`
  margin-left: 1rem;

  & > * {
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
  background-color: #4829bb;
  border-radius: 8px;
  border: none;

  &:disabled {
    opacity: 0.4;
  }
`

export const MoreButton = styled.button`
  border: none;
  background-color: transparent;
`
const SendNFTWarning = styled.div`
  margin-bottom: 1rem;
  padding: 8px 12px;
  background: #373717;
  color: #ffff65;
  border-radius: 8px;
}
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

  const { getRewardsHandler, getRewardsHash, withdrawHandler, withdrawnHash, sendNFTL2Handler, sendNFTL2Hash } =
  useStakerHandlers() || {}

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

  const [gettingReward, setGettingReward] = useState({ id: null, state: null })
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
    const _positions = shallowPositions.filter((pos) => pos.staked && pos.transfered)
    return _positions.length > 0 ? _positions : undefined
  }, [shallowPositions])

  const inactiveNFTs = useMemo(() => {
    if (!shallowPositions) return
    const _positions = shallowPositions.filter((pos) => !pos.staked && pos.transfered)
    return _positions.length > 0 ? _positions : undefined
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
    if (!gettingReward.state) return

    if (getRewardsHash === 'failed') {
      setGettingReward({ id: null, state: null })
    } else if (getRewardsHash && confirmed.includes(getRewardsHash.hash)) {
      setGettingReward({ id: getRewardsHash.id, state: 'done' })
      setShallowPositions(
        shallowPositions.map((el) => {
          if (el.tokenId === getRewardsHash.id) {
            el.staked = false
          }
          return el
        })
      )
    }
  }, [getRewardsHash, confirmed])

  useEffect(() => {
    if (!unstaking.state) return

    if (withdrawnHash === 'failed') {
      setUnstaking({ id: null, state: null })
    } else if (withdrawnHash && confirmed.includes(withdrawnHash.hash)) {
      setUnstaking({ id: withdrawnHash.id, state: 'done' })
      setShallowPositions(
        shallowPositions.map((el) => {
          if (el.tokenId === withdrawnHash.id) {
            el.transfered = false
          }
          return el
        })
      )
    }
  }, [withdrawnHash, confirmed])

  useEffect(() => {
    fetchHandler()
  }, [account])

  function getCountdownTime(time) {
    const timestamp = (time * 1000 - now) / 1000
    const days = Math.floor(timestamp / (24 * 60 * 60))
    const hours = Math.floor(timestamp / (60 * 60)) % 24
    const minutes = Math.floor(timestamp / 60) % 60
    const seconds = Math.floor(timestamp / 1) % 60

    function format(digit: number) {
      return digit < 10 ? `0${digit}` : digit
    }

    return `${days > 0 ? `${days}d ` : ''}${format(hours)}:${format(minutes)}:${format(seconds)}`
  }

  function formatReward(earned) {
    const _earned = String(earned)
    return _earned.length > 8 ? `${_earned.slice(0, 8)}..` : _earned
  }

  function getTable(positions, staked: boolean) {
    return positions.map((el, i) => (
      <Stake key={i} navigatedTo={hash === `#${el.tokenId}`}>
        <StakeId>
          <FarmingPositionInfo el={el} />
        </StakeId>
        <StakePool>
          {staked && (
            <>
              <TokenIcon name={el.pool.token0.symbol}>{el.pool.token0.symbol.slice(0, 2)}</TokenIcon>
              <TokenIcon name={el.pool.token1.symbol}>{el.pool.token1.symbol.slice(0, 2)}</TokenIcon>
              <TokensNames>
                <div>{el.pool.token0.symbol}</div>
                <div>{el.pool.token1.symbol}</div>
              </TokensNames>
            </>
          )}
        </StakePool>
        {/* <StakeSeparator>for</StakeSeparator> */}
        {staked && (
          <StakeReward>
            <TokenIcon name={el.rewardToken.symbol}>{el.rewardToken.symbol.slice(0, 2)}</TokenIcon>
            <TokensNames>
              <div>{formatReward(el.earned)}</div>
              <div>{el.rewardToken.symbol}</div>
            </TokensNames>
          </StakeReward>
        )}
        {staked && (
          <StakeReward>
            <TokenIcon name={el.bonusRewardToken}>{el.bonusRewardToken.symbol.slice(0, 2)}</TokenIcon>
            <TokensNames>
              <div>{formatReward(el.bonusEarned)}</div>
              <div>{el.bonusRewardToken.symbol}</div>
            </TokensNames>
          </StakeReward>
        )}
        {/* <StakeSeparator>by</StakeSeparator> */}
        {staked && (
          <StakeCountdown>
            {el.ended || el.endTime * 1000 < Date.now() ? 'Finished' : getCountdownTime(el.endTime)}
          </StakeCountdown>
        )}
        <StakeActions>
          {staked ? (
            el.endTime * 1000 > Date.now() ? (
              // <StakeButton onClick={() => setSendModal(el.L2tokenId)}>Send NFT</StakeButton>
              <MoreButton onClick={() => setSendModal(el.L2tokenId)}>
                <Send color={'white'} size={18} />
              </MoreButton>
            ) : (
              staked && (
                <>
                  <StakeButton
                    disabled={gettingReward.id && gettingReward.state !== 'done'}
                    onClick={() => {
                      setGettingReward({ id: el.tokenId, state: 'pending' })
                      getRewardsHandler(el.tokenId, { ...el })
                    }}
                  >
                    {gettingReward && gettingReward.id === el.tokenId && gettingReward.state !== 'done' ? (
                      <span>
                        <Loader size={'18px'} stroke={'white'} style={{ margin: 'auto' }} />
                      </span>
                    ) : (
                      <span>{`Collect reward`}</span>
                    )}
                  </StakeButton>
                  <MoreButton style={{ marginLeft: '8px' }} onClick={() => setSendModal(el.L2tokenId)}>
                    <Send color={'white'} size={18} />
                  </MoreButton>
                </>
              )
            )
          ) : (
            <StakeButton
              disabled={unstaking.id && unstaking.state !== 'done'}
              onClick={() => {
                setUnstaking({ id: el.tokenId, state: 'pending' })
                withdrawHandler(el.tokenId, { ...el })
              }}
            >
              {unstaking && unstaking.id === el.tokenId && unstaking.state !== 'done' ? (
                <span>
                  <Loader size={'18px'} stroke={'white'} style={{ margin: 'auto' }} />
                </span>
              ) : (
                <span>{`Withdraw NFT`}</span>
              )}
            </StakeButton>
          )}
        </StakeActions>
      </Stake>
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
        <SendModal style={{ alignItems: sending && sending.state === 'done' ? 'center' : '' }}>
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
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
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
        <Stakes>
          {[0, 1, 2].map((el, i) => (
            <Stake key={i}>
              <StakePool>
                {/* {JSON.parse(el.pool)} */}
                <TokenIcon skeleton></TokenIcon>
                <TokenIcon skeleton></TokenIcon>
                <TokensNames skeleton>
                  <div>{}</div>
                  <div>{}</div>
                </TokensNames>
              </StakePool>
              {/* <StakeSeparator>for</StakeSeparator> */}
              <StakeReward>
                <TokenIcon skeleton>{}</TokenIcon>
                <TokensNames skeleton>
                  <div>{}</div>
                  <div>{}</div>
                </TokensNames>
              </StakeReward>
              {/* <StakeSeparator>by</StakeSeparator> */}
              <StakeCountdown skeleton>
                <div></div>
              </StakeCountdown>
              <StakeActions>
                <StakeButton skeleton></StakeButton>
              </StakeActions>
            </Stake>
          ))}
        </Stakes>
      ) : shallowPositions && shallowPositions.length === 0 ? (
        <EmptyMock>
          <div>No farms</div>
          <Frown size={35} stroke={'white'} />
        </EmptyMock>
      ) : shallowPositions && shallowPositions.length !== 0 ? (
        <>
          {stakedNFTs && (
            <> {window.innerWidth > 500 && (
              <StakeListHeader>
                <div style={{ minWidth: `${window.innerWidth < 500 ? '' : '96px'}` }}>ID</div>
                <div>Pool</div>
                <div>Earned</div>
                <div>Bonus</div>
                <div>End time</div>
                <div></div>
              </StakeListHeader>
            )}
              {/* eslint-disable-next-line react/jsx-no-undef */}
              <Stakes>{window.innerWidth < 500 ?
                <StakerMyStakesMobile position={stakedNFTs[0]} modalHandler={setSendModal}
                                      getRewardsHandler={getRewardsHandler}
                                      gettingReward={gettingReward}
                                      setGettingReward={setGettingReward}
                /> : getTable(stakedNFTs, true)}</Stakes>
            </>
          )}
          {inactiveNFTs && (
            <>
              <PageTitle title={'Inactive NFT-s'}></PageTitle>
              <StakeListHeader>
                <div style={{ minWidth: '96px' }}>ID</div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </StakeListHeader>
              <Stakes>{getTable(inactiveNFTs, false)}</Stakes>
            </>
          )}
        </>
      ) : null}
    </>
  )
}
