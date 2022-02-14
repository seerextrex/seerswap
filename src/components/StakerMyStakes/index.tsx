import { isAddress } from '@ethersproject/address'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckCircle, ChevronsUp, Frown, Send } from 'react-feather'
import { useStakerHandlers } from '../../hooks/useStakerHandlers'
import { useActiveWeb3React } from '../../hooks/web3'
import { useAllTransactions } from '../../state/transactions/hooks'
import Loader from '../Loader'
import Modal from '../Modal'
import {
    EmptyMock,
    EventEndTime,
    EventProgress,
    EventProgressInner,
    ModalTitle,
    MoreButton,
    NFTPositionDescription,
    NFTPositionIcon,
    NFTPositionIndex,
    NFTPositionLink,
    PositionCard,
    PositionCardBody,
    PositionCardEvent,
    PositionCardEventTitle,
    PositionCardHeader,
    PositionCardMock,
    PositionCardStats,
    PositionCardStatsItem,
    PositionCardStatsItemTitle,
    PositionCardStatsItemValue,
    PositionCardStatsItemWrapper,
    PositionNotDepositedText,
    RecipientInput,
    SendModal,
    SendNFTButton,
    SendNFTWarning,
    StakeActions,
    StakeBottomWrapper,
    StakeButton,
    StakeCountdownProgress,
    StakeCountdownWrapper,
    StakePool,
    Stakes,
    TimeWrapper,
    TokensNames
} from './styled'
import { Deposit, RewardInterface, UnstakingInterface } from '../../models/interfaces'
import { FarmingType } from '../../models/enums'
import { IsActive } from './IsActive'
import CurrencyLogo from '../CurrencyLogo'
import { Token } from '@uniswap/sdk-core'
import { formatReward } from '../../utils/formatReward'
import { getCountdownTime } from '../../utils/time'
import { getProgress } from '../../utils/getProgress'
import { CheckOut } from './CheckOut'
import { useLocation } from 'react-router-dom'
import { useSortedRecentTransactions } from '../../hooks/useSortedRecentTransactions'

interface StakerMyStakesProps {
    data: Deposit[] | null
    refreshing: boolean
    now: number
    fetchHandler: () => any
}

export function StakerMyStakes({ data, refreshing, now, fetchHandler }: StakerMyStakesProps) {
    const { account } = useActiveWeb3React()

    const {
        getRewardsHash,
        sendNFTL2Handler,
        eternalCollectRewardHandler,
        withdrawHandler,
        exitHandler,
        claimRewardsHandler,
        claimRewardHash,
        sendNFTL2Hash,
        eternalCollectRewardHash,
        withdrawnHash
    } = useStakerHandlers() || {}

    const [sendModal, setSendModal] = useState<string | null>(null)
    const [recipient, setRecipient] = useState<string>('')
    const [sending, setSending] = useState<UnstakingInterface>({ id: null, state: null })
    const [shallowPositions, setShallowPositions] = useState<Deposit[] | null>(null)
    const [gettingReward, setGettingReward] = useState<RewardInterface>({ id: null, state: null, farmingType: null })
    const [eternalCollectReward, setEternalCollectReward] = useState<UnstakingInterface>({ id: null, state: null })
    const [unstaking, setUnstaking] = useState<UnstakingInterface>({ id: null, state: null })

    const allTransactions = useAllTransactions()

    const sortedRecentTransactions = useSortedRecentTransactions()

    const confirmed = useMemo(() => sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash), [sortedRecentTransactions, allTransactions])

    useEffect(() => {
        setShallowPositions(data)
    }, [data])

    useEffect(() => {
        if (!sending.state) return

        if (typeof sendNFTL2Hash === 'string') {
            setSending({ id: null, state: null })
        } else if (sendNFTL2Hash && confirmed.includes(String(sendNFTL2Hash.hash))) {
            setSending({ id: sendNFTL2Hash.id, state: 'done' })
            if (!shallowPositions) return
            setShallowPositions(shallowPositions.filter((el) => el.l2TokenId === sendNFTL2Hash.id))
        }
    }, [sendNFTL2Hash, confirmed])

    useEffect(() => {
        if (!eternalCollectReward.state) return

        if (typeof eternalCollectRewardHash === 'string') {
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
        if (!unstaking.state) return

        if (typeof withdrawnHash === 'string') {
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
        if (!gettingReward.state) return

        if (typeof claimRewardHash === 'string') {
            setGettingReward({ id: null, state: null, farmingType: null })
        } else if (claimRewardHash && confirmed.includes(String(claimRewardHash.hash))) {
            setGettingReward({
                id: claimRewardHash.id,
                state: 'done',
                farmingType: claimRewardHash.farmingType
            })
            if (!shallowPositions) return
            setShallowPositions(
                shallowPositions.map((el) => {
                    if (el.id === claimRewardHash.id) {
                        if (claimRewardHash.farmingType === FarmingType.FINITE) {
                            el.incentive = null
                        } else {
                            el.eternalFarming = null
                        }
                    }
                    return el
                })
            )
        }
    }, [claimRewardHash, confirmed])

    useEffect(() => {
        if (!gettingReward.state) return

        if (typeof getRewardsHash === 'string') {
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

    const sendNFTHandler = useCallback(
        (v) => {
            if (!isAddress(recipient) || recipient === account) {
                return
            }

            sendNFTL2Handler(recipient, v)
        },
        [recipient]
    )

    const stakedNFTs = useMemo(() => {
        if (!shallowPositions) return
        const _positions = shallowPositions.filter((v) => v.onFarmingCenter)
        return _positions.length > 0 ? _positions : []
    }, [shallowPositions])

    useEffect(() => {
        fetchHandler()
    }, [account])

    const { hash } = useLocation()

    return (
        <>
            <Modal
                isOpen={Boolean(sendModal)}
                onDismiss={() => {
                    if (sending.state !== 'pending') {
                        setSendModal(null)
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
                            <SendNFTWarning>{'If you send your NFT to another account, you can’t get it back unless you have an access to the recipient’s account.'}</SendNFTWarning>
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
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center'
                                            }}
                                        >
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
                            {stakedNFTs.map((el, i) => {
                                const date = new Date(+el.enteredInEternalFarming * 1000).toLocaleString()
                                return (
                                    <PositionCard key={i} navigatedTo={hash == `#${el.id}`}>
                                        <PositionCardHeader>
                                            <div style={{ display: 'flex' }}>
                                                <NFTPositionIcon name={el.id}>
                                                    <span>{el.id}</span>
                                                </NFTPositionIcon>
                                                <NFTPositionDescription>
                                                    <NFTPositionIndex>
                                                        <IsActive el={el} />
                                                    </NFTPositionIndex>
                                                    <NFTPositionLink href={`https://app.algebra.finance/#/pool/${+el.id}?onFarming=true`} rel='noopener noreferrer' target='_blank'>
                                                        View position
                                                    </NFTPositionLink>
                                                </NFTPositionDescription>
                                            </div>
                                            <StakePool>
                                                <>
                                                    <CurrencyLogo currency={new Token(137, el.token0, 18, el.pool.token0.symbol)} size={'35px'} />
                                                    <CurrencyLogo currency={new Token(137, el.token1, 18, el.pool.token1.symbol)} size={'35px'} style={{ marginLeft: '-1rem' }} />
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
                                                        withdrawHandler(el.id)
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
                                                <PositionCardEventTitle>Limit Farming</PositionCardEventTitle>
                                                {el.incentive ? (
                                                    <>
                                                        <PositionCardStats>
                                                            <PositionCardStatsItemWrapper>
                                                                <CurrencyLogo size={'35px'} currency={new Token(137, el.incentiveRewardToken?.id, 18, el.incentiveRewardToken?.symbol)} />
                                                                <PositionCardStatsItem>
                                                                    <PositionCardStatsItemTitle>Reward</PositionCardStatsItemTitle>
                                                                    <PositionCardStatsItemValue title={el.incentiveEarned}>{`${formatReward(el.incentiveEarned)} ${
                                                                        el.incentiveRewardToken.symbol
                                                                    }`}</PositionCardStatsItemValue>
                                                                </PositionCardStatsItem>
                                                            </PositionCardStatsItemWrapper>
                                                            <PositionCardStatsItemWrapper>
                                                                <CurrencyLogo size={'35px'} currency={new Token(137, el.incentiveBonusRewardToken?.id, 18, el.incentiveBonusRewardToken?.symbol)} />
                                                                <PositionCardStatsItem>
                                                                    <PositionCardStatsItemTitle>Bonus reward</PositionCardStatsItemTitle>
                                                                    <PositionCardStatsItemValue title={el.incentiveBonusEarned}>{`${formatReward(el.incentiveBonusEarned)} ${
                                                                        el.incentiveBonusRewardToken.symbol
                                                                    }`}</PositionCardStatsItemValue>
                                                                </PositionCardStatsItem>
                                                            </PositionCardStatsItemWrapper>
                                                        </PositionCardStats>
                                                        <StakeBottomWrapper>
                                                            {!el.ended && el.incentiveEndTime * 1000 > Date.now() && (
                                                                <StakeCountdownWrapper>
                                                                    <StakeCountdownProgress started={el.started || el.incentiveStartTime * 1000 < Date.now()}>
                                                                        {!el.started && el.incentiveStartTime * 1000 > Date.now() && (
                                                                            <EventEndTime>{`Starts in ${getCountdownTime(el.incentiveStartTime, now)}`}</EventEndTime>
                                                                        )}
                                                                        {(el.started || el.incentiveStartTime * 1000 < Date.now()) && (
                                                                            <EventEndTime>{`Ends in ${getCountdownTime(el.incentiveEndTime, now)}`}</EventEndTime>
                                                                        )}
                                                                        <EventProgress>
                                                                            {!el.started && el.incentiveStartTime * 1000 > Date.now() ? (
                                                                                <EventProgressInner progress={getProgress(el.createdAtTimestamp, el.incentiveStartTime, now)} />
                                                                            ) : (
                                                                                <EventProgressInner progress={getProgress(el.incentiveStartTime, el.incentiveEndTime, now)} />
                                                                            )}
                                                                        </EventProgress>
                                                                    </StakeCountdownProgress>
                                                                    {!el.started && el.incentiveStartTime * 1000 > Date.now() && (
                                                                        <StakeButton
                                                                            disabled={gettingReward.id === el.id && gettingReward.farmingType === FarmingType.FINITE && gettingReward.state !== 'done'}
                                                                            onClick={() => {
                                                                                setGettingReward({
                                                                                    id: el.id,
                                                                                    state: 'pending',
                                                                                    farmingType: FarmingType.FINITE
                                                                                })
                                                                                exitHandler(el.id, { ...el }, FarmingType.FINITE)
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
                                                                        (gettingReward.id === el.id && gettingReward.farmingType === FarmingType.FINITE && gettingReward.state !== 'done') ||
                                                                        el.incentiveReward == 0
                                                                    }
                                                                    onClick={() => {
                                                                        setGettingReward({
                                                                            id: el.id,
                                                                            state: 'pending',
                                                                            farmingType: FarmingType.FINITE
                                                                        })
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
                                                        {el.finiteAvailable ? <CheckOut link={'limit-farms'} /> : <PositionNotDepositedText>{'No limit farms for now'}</PositionNotDepositedText>}
                                                    </PositionCardMock>
                                                )}
                                            </PositionCardEvent>
                                            <PositionCardEvent>
                                                <PositionCardEventTitle>
                                                    <span>Infinite Farming</span>
                                                    {el.enteredInEternalFarming && el.eternalFarming && (
                                                        <TimeWrapper>
                                                            <span>Entered at: </span>
                                                            <span>{date.slice(0, -3)}</span>
                                                        </TimeWrapper>
                                                    )}
                                                </PositionCardEventTitle>
                                                {el.eternalFarming ? (
                                                    <>
                                                        <PositionCardStats>
                                                            <PositionCardStatsItemWrapper>
                                                                <CurrencyLogo size={'35px'} currency={new Token(137, el.eternalRewardToken?.id, 18, el.eternalRewardToken?.symbol)} />
                                                                <PositionCardStatsItem>
                                                                    <PositionCardStatsItemTitle>Reward</PositionCardStatsItemTitle>
                                                                    <PositionCardStatsItemValue title={el.eternalEarned}>{`${formatReward(el.eternalEarned)} ${
                                                                        el.eternalRewardToken.symbol
                                                                    }`}</PositionCardStatsItemValue>
                                                                </PositionCardStatsItem>
                                                            </PositionCardStatsItemWrapper>
                                                            <PositionCardStatsItemWrapper>
                                                                <CurrencyLogo size={'35px'} currency={new Token(137, el.eternalBonusRewardToken?.id, 18, el.eternalBonusRewardToken?.symbol)} />
                                                                <PositionCardStatsItem>
                                                                    <PositionCardStatsItemTitle>Bonus Reward</PositionCardStatsItemTitle>
                                                                    <PositionCardStatsItemValue title={el.eternalBonusEarned}>
                                                                        {`${formatReward(el.eternalBonusEarned)} ${el.eternalBonusRewardToken.symbol}`}
                                                                    </PositionCardStatsItemValue>
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
                                                                    setEternalCollectReward({
                                                                        id: el.id,
                                                                        state: 'pending'
                                                                    })
                                                                    eternalCollectRewardHandler(el.id, { ...el })
                                                                }}
                                                            >
                                                                {eternalCollectReward && eternalCollectReward.id === el.id && eternalCollectReward.state !== 'done' ? (
                                                                    <span>
                                                                        <Loader size={'13px'} stroke={'white'} style={{ margin: 'auto' }} />
                                                                    </span>
                                                                ) : (
                                                                    <span>{`Collect rewards`}</span>
                                                                )}
                                                            </StakeButton>
                                                            <StakeButton
                                                                disabled={gettingReward.id === el.id && gettingReward.farmingType === FarmingType.ETERNAL && gettingReward.state !== 'done'}
                                                                onClick={() => {
                                                                    setGettingReward({
                                                                        id: el.id,
                                                                        state: 'pending',
                                                                        farmingType: FarmingType.ETERNAL
                                                                    })
                                                                    claimRewardsHandler(el.id, { ...el }, FarmingType.ETERNAL)
                                                                }}
                                                            >
                                                                {gettingReward && gettingReward.id === el.id && gettingReward.farmingType === FarmingType.ETERNAL && gettingReward.state !== 'done' ? (
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
                                                        {el.eternalAvailable ? (
                                                            <CheckOut link={'infinite-farms'} />
                                                        ) : (
                                                            <PositionNotDepositedText>{'No infinite farms for now'}</PositionNotDepositedText>
                                                        )}
                                                    </PositionCardMock>
                                                )}
                                            </PositionCardEvent>
                                        </PositionCardBody>
                                    </PositionCard>
                                )
                            })}
                        </Stakes>
                    )}
                </>
            ) : null}
        </>
    )
}
