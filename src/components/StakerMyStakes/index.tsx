import { isAddress } from '@ethersproject/address'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckCircle, Frown } from 'react-feather'
import { useStakerHandlers } from '../../hooks/useStakerHandlers'
import { useActiveWeb3React } from '../../hooks/web3'
import { useAllTransactions } from '../../state/transactions/hooks'
import Loader from '../Loader'
import Modal from '../Modal'
import { Table } from './Table'
import {
    EmptyMock,
    ModalTitle,
    RecipientInput,
    SendModal,
    SendNFTButton,
    SendNFTWarning,
    Stakes
} from './styled'
import { Deposit, RewardInterface, UnstakingInterface } from '../../models/interfaces'
import { FarmingType } from '../../models/enums'

interface StakerMyStakesProps {
    data: Deposit[]
    refreshing: boolean
    now: number
    fetchHandler: () => any
}

export function StakerMyStakes({ data, refreshing, now, fetchHandler }: StakerMyStakesProps) {
    const { account } = useActiveWeb3React()

  const {
    exitHandler,
    claimRewardsHandler,
    getRewardsHash,
    eternalCollectRewardHandler,
    eternalCollectRewardHash,
    withdrawHandler,
    withdrawnHash,
    sendNFTL2Handler,
    sendNFTL2Hash,
  } = useStakerHandlers() || {}

    const [sendModal, setSendModal] = useState(null)
    const [recipient, setRecipient] = useState<string>('')

    const [gettingReward, setGettingReward] = useState<RewardInterface>({
        id: null,
        state: null,
        farmingType: null
    })
    const [eternalCollectReward, setEternalCollectReward] = useState<UnstakingInterface>({
        id: null,
        state: null
    })

    const [unstaking, setUnstaking] = useState<UnstakingInterface>({ id: null, state: null })
    const [sending, setSending] = useState<UnstakingInterface>({ id: null, state: null })

    const [shallowPositions, setShallowPositions] = useState<Deposit[] | null>(null)

    const allTransactions = useAllTransactions()

    const sendNFTHandler = useCallback((v) => {
        if (!isAddress(recipient) || recipient === account) {
            return
        }

      sendNFTL2Handler(recipient, v)
    }, [recipient])

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

    const confirmed = useMemo(() => sortedRecentTransactions
        .filter((tx) => tx.receipt)
        .map((tx) => tx.hash), [sortedRecentTransactions, allTransactions])

    const stakedNFTs = useMemo(() => {
        if (!shallowPositions) return
        const _positions = shallowPositions.filter((v) => v.onFarmingCenter)
        return _positions.length > 0 ? _positions : []
    }, [shallowPositions])

    useEffect(() => {
        setShallowPositions(data)
    }, [data])

    useEffect(() => {
        if (!sending.state) return

        if (sendNFTL2Hash === 'failed') {
            setSending({ id: null, state: null })
        } else if (sendNFTL2Hash && confirmed.includes(String(sendNFTL2Hash.hash))) {
            setSending({ id: sendNFTL2Hash.id, state: 'done' })
            if (!shallowPositions) return
            setShallowPositions(shallowPositions.filter((el) => el.l2TokenId === sendNFTL2Hash.id))
        }
    }, [sendNFTL2Hash, confirmed])

    useEffect(() => {
        if (!eternalCollectReward.state) return

        if (eternalCollectRewardHash === 'failed') {
            setEternalCollectReward({ id: null, state: null })
        } else if (eternalCollectRewardHash && confirmed.includes(String(eternalCollectRewardHash.hash))) {
            setEternalCollectReward({ id: eternalCollectRewardHash.id, state: 'done' })
            if (!shallowPositions) return
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
        } else if (getRewardsHash && confirmed.includes(String(getRewardsHash.hash))) {
            setGettingReward({
                id: getRewardsHash.id,
                state: 'done',
                farmingType: getRewardsHash.farmingType
            })
            if (!shallowPositions) return
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

    useEffect(() => {
        if (!unstaking.state) return

        if (withdrawnHash === 'failed') {
            setUnstaking({ id: null, state: null })
        } else if (withdrawnHash && confirmed.includes(String(withdrawnHash.hash))) {
            setUnstaking({ id: withdrawnHash.id, state: 'done' })
            if (!shallowPositions) return
            setShallowPositions(
                shallowPositions.map((el) => {
                    if (el.id === withdrawnHash.id) {
                        el.onFarmingCenter = false
                    }
                    return el
                })
            )
        }
    }, [withdrawnHash, confirmed])

    useEffect(() => {
        fetchHandler()
    }, [account])

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
                    />
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
                    />
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
                            />
                          ) : (
                            <EventProgressInner
                              progress={getProgress(el.incentiveStartTime, el.incentiveEndTime, now)}
                            />
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
                            exitHandler(el.id, { ...el })
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
                        claimRewardsHandler(el.id, { ...el }, FarmingType.FINITE)
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
              { el.enteredInEternalFarming &&
              <span style={{ fontSize: '14px', fontWeight: 400, lineHeight: '21px' }}>
                <span>Entered at: </span>
                <span>{new Date(el.enteredInEternalFarming * 1000).toLocaleString().split(',')[0]}</span>
                <span>{`${new Date(el.enteredInEternalFarming * 1000)
                  .toLocaleString()
                  .split(',')[1]
                  .slice(0, -3)}`}</span>
              </span>
            }
            </PositionCardEventTitle>
            {el.eternalFarming ? (
              <>
                <PositionCardStats>
                  <PositionCardStatsItemWrapper>
                    <CurrencyLogo
                      size={'35px'}
                      currency={{ address: el.eternalRewardToken.id, symbol: el.eternalRewardToken.symbol }}
                    />
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
                      currency={new Token(137, el.eternalBonusRewardToken.id, el.eternalBonusRewardToken.symbol)}
                    />
                    <PositionCardStatsItem>
                      <PositionCardStatsItemTitle>Bonus Reward</PositionCardStatsItemTitle>
                      <PositionCardStatsItemValue title={el.eternalBonusEarned}>{`${formatReward(
                        el.eternalBonusEarned
                      )} ${el.eternalBonusRewardToken.symbol}`}</PositionCardStatsItemValue>
                    </PositionCardStatsItem>
                  </PositionCardStatsItemWrapper>
                </PositionCardStats>
                <StakeActions>
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
                      claimRewardsHandler(el.id, { ...el }, FarmingType.ETERNAL)
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
                  placeholder="Enter a recipient"
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
                        <Stakes>
                            <Table positions={stakedNFTs}
                                   unstaking={unstaking}
                                   setUnstaking={setUnstaking}
                                   setSendModal={setSendModal}
                                   gettingReward={gettingReward}
                                   setGettingReward={setGettingReward}
                                   now={now}
                                   eternalCollectReward={eternalCollectReward}
                                   setEternalCollectReward={setEternalCollectReward}
                            />
                        </Stakes>
                    )}
                </>
            ) : null}
        </>
    )
}
