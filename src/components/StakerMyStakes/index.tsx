import { isAddress } from '@ethersproject/address'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckCircle, Frown, Send } from 'react-feather'
import { useStakerHandlers } from '../../hooks/useStakerHandlers'
import { useActiveWeb3React } from '../../hooks/web3'
import { useAllTransactions } from '../../state/transactions/hooks'
import FarmingPositionInfo from '../FarmingPositionInfo'
import Loader from '../Loader'
import Modal from '../Modal'
import { PageTitle } from '../PageTitle'
import { useLocation } from 'react-router'
import CurrencyLogo from '../CurrencyLogo'
import {
    EmptyMock,
    ModalTitle,
    MoreButton,
    RecipientInput,
    SendModal,
    SendNFTButton,
    SendNFTWarning,
    Stake,
    StakeActions,
    StakeButton,
    StakeCountdown,
    StakeId,
    StakeListHeader,
    StakePool,
    StakeReward,
    Stakes,
    TokenIcon,
    TokensNames
} from './styled'

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
        withdrawHandler,
        withdrawnHash,
        sendNFTL2Handler,
        sendNFTL2Hash
    } =
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
                            <CurrencyLogo
                                currency={{ address: el.token0, symbol: el.pool.token0.symbol }}
                                size={'35px'} />
                            <CurrencyLogo
                                currency={{ address: el.token1, symbol: el.pool.token1.symbol }}
                                size={'35px'} />
                            <TokensNames>
                                <div>{el.pool.token0.symbol}</div>
                                <div>{el.pool.token1.symbol}</div>
                            </TokensNames>
                        </>
                    )}
                </StakePool>
                {/* <StakeSeparator>for</StakeSeparator> */}
                {staked && (
                    <StakeReward reward={'Reward'}>
                        <CurrencyLogo
                            currency={{ address: el.rewardToken.id, symbol: el.rewardToken.symbol }}
                            size={'35px'} />
                        <TokensNames>
                            <div>{formatReward(el.earned)}</div>
                            <div>{el.rewardToken.symbol}</div>
                        </TokensNames>
                    </StakeReward>
                )}
                {staked && (
                    <StakeReward reward={'Bonus'}>
                        <CurrencyLogo currency={{
                            address: el.bonusRewardToken.id,
                            symbol: el.bonusRewardToken.symbol
                        }}
                                      size={'35px'} />
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
                            <>
                                {el.startTime * 1000 > Date.now() && (
                                    <StakeButton
                                        onClick={() => {
                                            setGettingReward({ id: el.tokenId, state: 'pending' })
                                            getRewardsHandler(el.tokenId, { ...el })
                                        }}
                                    >
                                        Undeposit
                                    </StakeButton>
                                )}
                                <MoreButton onClick={() => setSendModal(el.L2tokenId)}>
                                    <Send color={'white'} size={18} />
                                </MoreButton>
                            </>
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
                                    <MoreButton style={{ marginLeft: '8px' }}
                                                onClick={() => setSendModal(el.L2tokenId)}>
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
                <Stakes>
                    {[0, 1, 2].map((el, i) => (
                        <Stake key={i}>
                            <StakePool>
                                <TokenIcon skeleton />
                                <TokenIcon skeleton />
                                <TokensNames skeleton>
                                    <div>{}</div>
                                    <div>{}</div>
                                </TokensNames>
                            </StakePool>
                            <StakeReward>
                                <TokenIcon skeleton>{}</TokenIcon>
                                <TokensNames skeleton>
                                    <div>{}</div>
                                    <div>{}</div>
                                </TokensNames>
                            </StakeReward>
                            <StakeCountdown skeleton>
                                <div />
                            </StakeCountdown>
                            <StakeActions>
                                <StakeButton skeleton />
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
                        <>
                            {' '}
                            <StakeListHeader>
                                <div
                                    style={{ minWidth: `${window.innerWidth < 500 ? '' : '96px'}` }}>ID
                                </div>
                                <div>Pool</div>
                                <div>Earned</div>
                                <div>Bonus</div>
                                <div>End time</div>
                                <div />
                            </StakeListHeader>
                            <Stakes>{getTable(stakedNFTs, true)}</Stakes>
                        </>
                    )}
                    {inactiveNFTs && (
                        <>
                            <PageTitle title={'Inactive NFT-s'} />
                            <StakeListHeader>
                                <div style={{ minWidth: '96px' }}>ID</div>
                                <div />
                                <div />
                                <div />
                                <div />
                            </StakeListHeader>
                            <Stakes>{getTable(inactiveNFTs, false)}</Stakes>
                        </>
                    )}
                </>
            ) : null}
        </>
    )
}
