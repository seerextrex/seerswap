import { isAddress } from '@ethersproject/address'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckCircle, ChevronsUp, Frown, Send } from 'react-feather'
import { useStakerHandlers } from '../../hooks/useStakerHandlers'
import { useActiveWeb3React } from '../../hooks/web3'
import { useAllTransactions } from '../../state/transactions/hooks'
import Loader from '../Loader'
import Modal from '../Modal'
import {
    EventEndTime,
    EventProgress,
    EventProgressInner,
    NFTPositionIcon,
    PositionCardEvent,
    PositionCardEventTitle,
    PositionCardMock,
    PositionCardStats,
    PositionCardStatsItem,
    PositionCardStatsItemTitle,
    PositionCardStatsItemValue,
    PositionCardStatsItemWrapper,
    PositionNotDepositedText,
    StakeActions,
    StakeBottomWrapper,
    StakeButton,
    StakeCountdownProgress,
    StakeCountdownWrapper,
    TimeWrapper
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
import { WrappedCurrency } from '../../models/types'
import './index.scss'

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

    const sendNFTHandler = useCallback((v) => {
        if (!isAddress(recipient) || recipient === account) {
            return
        }

        sendNFTL2Handler(recipient, v)
    }, [recipient])

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
                <div className={'p-2'} style={{ alignItems: sending && sending.state === 'done' ? 'center' : '' }}>
                    {sending.state === 'done' ? (
                        <>
                            <CheckCircle size={'35px'} stroke={'#27AE60'} />
                            <div className={'mt-1'}>{`NFT was sent!`}</div>
                        </>
                    ) : (
                        <div className={'my-stakes__nft-send'}>
                            <div className={'mb-1 c-p fs-125 b'}>Send NFT to another account</div>
                            <div
                                className={'my-stakes__nft-send__warning br-12 p-05 mb-1 c-dec'}>{'If you send your NFT to another account, you can’t get it back unless you have an access to the recipient’s account.'}</div>
                            <div className={'mb-1'}>
                                <input
                                    className={'w-100 p-05 br-8'}
                                    placeholder='Enter a recipient'
                                    value={recipient}
                                    onChange={(v) => {
                                        setRecipient(v.target.value)
                                    }}
                                />
                            </div>
                            <button className={'btn primary w-100 pv-075 ph-1 c-w br-8 '}
                                    disabled={!isAddress(recipient) || recipient === account}
                                    onClick={() => {
                                        setSending({ id: sendModal, state: 'pending' })
                                        sendNFTHandler(sendModal)
                                    }}
                            >
                                {sending && sending.id === sendModal && sending.state !== 'done' ? (
                                    <span className={'f f-ac f-jc'}>
                                        <Loader size={'1rem'} stroke={'white'} />
                                        <span className={'ml-05'}>Sending</span>
                                    </span>
                                ) : (
                                    <span>{`Send NFT`}</span>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </Modal>
            {refreshing || !shallowPositions ? (
                <div className={'my-stakes__loader flex-s-between f-jc'}>
                    <Loader stroke={'white'} size={'1.5rem'} />
                </div>
            ) : shallowPositions && shallowPositions.length === 0 ? (
                <div className={'my-stakes__loader flex-s-between f-jc'}>
                    <div>No farms</div>
                    <Frown size={35} stroke={'white'} />
                </div>
            ) : shallowPositions && shallowPositions.length !== 0 ? (
                <>
                    {stakedNFTs && (
                        <div>
                            {stakedNFTs.map((el, i) => {
                                const date = new Date(+el.enteredInEternalFarming * 1000).toLocaleString()
                                return (
                                    <div className={'my-stakes__position-card p-1 br-12 mb-1'} key={i} data-navigatedTo={hash == `#${el.id}`}>
                                        <div className={'my-stakes__position-card__header flex-s-between mb-1 br-8 p-1'}>
                                            <div className={'f'}>
                                                <div className={'f f-ac'}>
                                                    <NFTPositionIcon name={el.id}>
                                                        <span>{el.id}</span>
                                                    </NFTPositionIcon>
                                                    <div className={'ml-05'}>
                                                        <IsActive el={el} />
                                                        <a className={'c-w fs-075'} href={`https://app.algebra.finance/#/pool/${+el.id}?onFarming=true`} rel='noopener noreferrer' target='_blank'>
                                                            View position
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className={'f f-ac ml-2'}>
                                                    <CurrencyLogo currency={new Token(137, el.token0, 18, el.pool.token0.symbol) as WrappedCurrency} size={'35px'} />
                                                    <CurrencyLogo currency={new Token(137, el.token1, 18, el.pool.token1.symbol) as WrappedCurrency} size={'35px'} style={{ marginLeft: '-1rem' }} />
                                                    <div className={'ml-05'}>
                                                        <div className={'b'}>Pool</div>
                                                        <div>{`${el.pool.token0.symbol} / ${el.pool.token1.symbol}`}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={'f'}>
                                                {!el.incentive && !el.eternalFarming && (
                                                    <button
                                                        className={'btn f f-ac c-p b pv-025'}
                                                        disabled={unstaking.id === el.id && unstaking.state !== 'done'}
                                                        onClick={() => {
                                                            setUnstaking({ id: el.id, state: 'pending' })
                                                            withdrawHandler(el.id)
                                                        }}
                                                    >
                                                        {unstaking && unstaking.id === el.id && unstaking.state !== 'done' ? (
                                                            <>
                                                                <Loader size={'1rem'} stroke={'var(--primary)'} style={{ margin: 'auto' }} />
                                                                <span className={'ml-05'}>Withdrawing</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronsUp color={'var(--primary)'} size={'1rem'} />
                                                                <span className={'ml-05'}>{`Withdraw`}</span>
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                                <button className={'btn f f-ac c-p b pv-025 ml-05'} onClick={() => setSendModal(el.L2tokenId)}>
                                                    <Send color={'var(--primary)'} size={'1rem'} />
                                                    <span className={'ml-05 c-p'}>Send</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className={'f cg-1'}>
                                            <div className={'my-stakes__position-card__body w-100 p-1 br-8'}>
                                                <div className={'b fs-125'}>Limit Farming</div>
                                                {el.incentive ? (
                                                    <>
                                                        <PositionCardStats>
                                                            <PositionCardStatsItemWrapper>
                                                                <CurrencyLogo size={'35px'}
                                                                              currency={new Token(137, el.incentiveRewardToken?.id, 18, el.incentiveRewardToken?.symbol) as WrappedCurrency} />
                                                                <PositionCardStatsItem>
                                                                    <PositionCardStatsItemTitle>Reward</PositionCardStatsItemTitle>
                                                                    <PositionCardStatsItemValue title={el.incentiveEarned}>{`${formatReward(+el.incentiveEarned)} ${
                                                                        el.incentiveRewardToken.symbol
                                                                    }`}</PositionCardStatsItemValue>
                                                                </PositionCardStatsItem>
                                                            </PositionCardStatsItemWrapper>
                                                            <PositionCardStatsItemWrapper>
                                                                <CurrencyLogo size={'35px'}
                                                                              currency={new Token(137, el.incentiveBonusRewardToken?.id, 18, el.incentiveBonusRewardToken?.symbol) as WrappedCurrency} />
                                                                <PositionCardStatsItem>
                                                                    <PositionCardStatsItemTitle>Bonus reward</PositionCardStatsItemTitle>
                                                                    <PositionCardStatsItemValue title={el.incentiveBonusEarned}>{`${formatReward(+el.incentiveBonusEarned)} ${
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
                                                                        +el.incentiveReward == 0
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
                                                    <div className={'full-wh f f-ac f-jc'}>
                                                        {el.finiteAvailable ? <CheckOut link={'limit-farms'} /> : <div>{'No limit farms for now'}</div>}
                                                    </div>
                                                )}
                                            </div>
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
                                                                <CurrencyLogo size={'35px'}
                                                                              currency={new Token(137, el.eternalRewardToken?.id, 18, el.eternalRewardToken?.symbol) as WrappedCurrency} />
                                                                <PositionCardStatsItem>
                                                                    <PositionCardStatsItemTitle>Reward</PositionCardStatsItemTitle>
                                                                    <PositionCardStatsItemValue title={el.eternalEarned}>{`${formatReward(+el.eternalEarned)} ${
                                                                        el.eternalRewardToken.symbol
                                                                    }`}</PositionCardStatsItemValue>
                                                                </PositionCardStatsItem>
                                                            </PositionCardStatsItemWrapper>
                                                            <PositionCardStatsItemWrapper>
                                                                <CurrencyLogo size={'35px'}
                                                                              currency={new Token(137, el.eternalBonusRewardToken?.id, 18, el.eternalBonusRewardToken?.symbol) as WrappedCurrency} />
                                                                <PositionCardStatsItem>
                                                                    <PositionCardStatsItemTitle>Bonus Reward</PositionCardStatsItemTitle>
                                                                    <PositionCardStatsItemValue title={el.eternalBonusEarned}>
                                                                        {`${formatReward(+el.eternalBonusEarned)} ${el.eternalBonusRewardToken.symbol}`}
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
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </>
            ) : null}
        </>
    )
}
