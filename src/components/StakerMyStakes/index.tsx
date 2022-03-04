import { isAddress } from '@ethersproject/address'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Frown } from 'react-feather'
import { useStakerHandlers } from '../../hooks/useStakerHandlers'
import { useActiveWeb3React } from '../../hooks/web3'
import { useAllTransactions } from '../../state/transactions/hooks'
import Loader from '../Loader'
import Modal from '../Modal'
import { Deposit, RewardInterface, UnstakingInterface } from '../../models/interfaces'
import { FarmingType } from '../../models/enums'
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
import ModalBody from './ModalBody'
import PositionHeader from './PositionHeader'
import PositionCardBodyHeader from './PositionCardBodyHeader'
import PositionCardBodyStat from './PositionCardBodyStat'

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
    const { hash } = useLocation()

    const confirmed = useMemo(() => sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash), [sortedRecentTransactions, allTransactions])

    const stakedNFTs = useMemo(() => {
        if (!shallowPositions) return
        const _positions = shallowPositions.filter((v) => v.onFarmingCenter)
        return _positions.length > 0 ? _positions : []
    }, [shallowPositions])

    const sendNFTHandler = useCallback((v) => {
        if (!isAddress(recipient) || recipient === account) {
            return
        }

        sendNFTL2Handler(recipient, v)
    }, [recipient])

    useEffect(() => {
        fetchHandler()
    }, [account])

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
                <ModalBody
                    recipient={recipient}
                    setRecipient={setRecipient}
                    sendModal={sendModal}
                    sending={sending}
                    setSending={setSending}
                    sendNFTHandler={sendNFTHandler}
                    account={account ?? undefined} />
            </Modal>
            {refreshing || !shallowPositions ? (
                <div className={'my-stakes__loader flex-s-between f-jc'}>
                    <Loader stroke={'white'} size={'1.5rem'} />
                </div>
            ) : shallowPositions && shallowPositions.length === 0 ? (
                <div className={'my-stakes__loader flex-s-between f-jc'}>
                    <div className={'mr-05'}>No farms</div>
                    <Frown size={35} stroke={'white'} />
                </div>
            ) : shallowPositions && shallowPositions.length !== 0 ? (
                <>
                    {stakedNFTs && (
                        <div>
                            {stakedNFTs.map((el, i) => {
                                const date = new Date(+el.enteredInEternalFarming * 1000).toLocaleString()
                                return (
                                    <div className={'my-stakes__position-card p-1 br-12 mb-1'} key={i} data-navigatedto={hash == `#${el.id}`}>
                                        <PositionHeader
                                            el={el}
                                            setUnstaking={setUnstaking}
                                            setSendModal={setSendModal}
                                            unstaking={unstaking}
                                            withdrawHandler={withdrawHandler}
                                        />
                                        <div className={'f cg-1'}>
                                            <div className={'my-stakes__position-card__body w-100 p-1 br-8'}>
                                                <PositionCardBodyHeader
                                                    farmingType={FarmingType.FINITE}
                                                    date={date}
                                                />
                                                {el.incentive ? (
                                                    <>
                                                        <PositionCardBodyStat
                                                            rewardToken={el.incentiveRewardToken}
                                                            earned={el.incentiveEarned}
                                                            bonusEarned={el.incentiveBonusEarned}
                                                            bonusRewardToken={el.incentiveBonusRewardToken}/>
                                                        <div className={'f'}>
                                                            {!el.ended && el.incentiveEndTime * 1000 > Date.now() && (
                                                                <div className={'f w-100'}>
                                                                    <div className={'w-100 mr-1'} data-started={el.started || el.incentiveStartTime * 1000 < Date.now()}>
                                                                        {!el.started && el.incentiveStartTime * 1000 > Date.now() && (
                                                                            <div className={'mb-3 p-r fs-075'}>{`Starts in ${getCountdownTime(el.incentiveStartTime, now)}`}</div>
                                                                        )}
                                                                        {(el.started || el.incentiveStartTime * 1000 < Date.now()) && (
                                                                            <div className={'mb-3 p-r fs-075'}>{`Ends in ${getCountdownTime(el.incentiveEndTime, now)}`}</div>
                                                                        )}
                                                                        <div className={'my-stakes__position-card__body__event-progress w-100 br-8 p-025 mt-05'}>
                                                                            {!el.started && el.incentiveStartTime * 1000 > Date.now() ? (
                                                                                <div className={'br-8'} style={{ width: getProgress(el.createdAtTimestamp, el.incentiveStartTime, now) }} />
                                                                            ) : (
                                                                                <div className={'br-8'} style={{ width: getProgress(el.incentiveStartTime, el.incentiveEndTime, now) }} />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    {!el.started && el.incentiveStartTime * 1000 > Date.now() && (
                                                                        <button
                                                                            className={'btn primary w-100 br-8 b pv-075'}
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
                                                                                <span>Undeposit</span>
                                                                            )}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                            {(el.ended || el.incentiveEndTime * 1000 < Date.now()) && (
                                                                <button
                                                                    className={'btn primary b pv-075'}
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
                                                                        <span>Collect rewards & Undeposit</span>
                                                                    )}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className={'full-wh f f-ac f-jc'}>
                                                        {el.finiteAvailable ? <CheckOut link={'limit-farms'} /> : <div>No limit farms for now</div>}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={'my-stakes__position-card__body w-100 p-1 br-8'}>
                                                <PositionCardBodyHeader
                                                    farmingType={FarmingType.ETERNAL}
                                                    date={date}
                                                    enteredInEternalFarming={el.enteredInEternalFarming}
                                                    eternalFarming={el.eternalFarming}
                                                />
                                                {el.eternalFarming ? (
                                                    <>
                                                        <PositionCardBodyStat
                                                            rewardToken={el.eternalRewardToken}
                                                            earned={el.eternalEarned}
                                                            bonusEarned={el.eternalBonusEarned}
                                                            bonusRewardToken={el.eternalBonusRewardToken}/>
                                                        <div className={'f w-100'}>
                                                            <button
                                                                className={'btn primary w-100 b br-8 pv-075'}
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
                                                                    <span>Collect rewards</span>
                                                                )}
                                                            </button>
                                                            <button
                                                                className={'btn primary w-100 b br-8 ml-1 pv-075'}
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
                                                                    <span>Undeposit</span>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className={'full-wh f f-ac f-jc'}>
                                                        {el.finiteAvailable ? <CheckOut link={'infinite-farms'} /> : <div>No infinite farms for now</div>}
                                                    </div>
                                                )}
                                            </div>
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
