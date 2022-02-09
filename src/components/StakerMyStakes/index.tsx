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
        getRewardsHash,
        eternalCollectRewardHash,
        withdrawnHash,
        sendNFTL2Handler,
        sendNFTL2Hash
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
