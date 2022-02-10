import { useEffect, useMemo, useState } from 'react'
import { Frown } from 'react-feather'
import { useStakerHandlers } from '../../hooks/useStakerHandlers'
import { useAllTransactions } from '../../state/transactions/hooks'
import Loader from '../Loader'
import CurrencyLogo from '../CurrencyLogo'
import {
    EmptyMock,
    LoadingShim,
    Reward,
    RewardClaimButton,
    Rewards,
    RewardsRow,
    RewardTokenIcon,
    RewardTokenInfo
} from './styled'

export function StakerMyRewards({
    data,
    refreshing,
    fetchHandler
}: {
    data: any
    refreshing: boolean
    fetchHandler: () => any
}) {

    const allTransactions = useAllTransactions()

    const formattedData = useMemo(() => data?.filter((el) => Boolean(+el.trueAmount)), [data])

    const sortedRecentTransactions = useMemo(() => {
        const txs = Object.values(allTransactions)
        return txs
            .filter((tx) => new Date().getTime() - tx.addedTime < 86_400_000)
            .sort((a, b) => b.addedTime - a.addedTime)
    }, [allTransactions])

    const confirmed = useMemo(() => sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash),
        [sortedRecentTransactions, allTransactions]
    )

    const { claimRewardHash, claimReward } = useStakerHandlers() || {}

    const [rewardsLoader, setRewardsLoader] = useState({ id: null, state: false })

    const isLoading = (id) => rewardsLoader.id === id && rewardsLoader.state

    useEffect(() => {
        fetchHandler()
    }, [])

    useEffect(() => {
        if (!formattedData) return

        if (claimRewardHash && claimRewardHash.error) {
            setRewardsLoader({ id: claimRewardHash.id, state: false })
        } else if (claimRewardHash && confirmed.includes(claimRewardHash.hash)) {
            setRewardsLoader({ id: claimRewardHash.id, state: false })
            formattedData.find((el) => el.rewardAddress === claimRewardHash.id).amount = 0
            formattedData.find((el) => el.rewardAddress === claimRewardHash.id).trueAmount = 0
        }
    }, [claimRewardHash, confirmed])

    const chunkedRewards = useMemo(() => {
        if (!formattedData) return

        if (!Array.isArray(formattedData) || formattedData.length === 0) return []

        const _rewards = [[formattedData[0]]]

        let j = 0

        for (let i = 1; i < formattedData.length; i++) {
            if (i % 3 === 0) {
                j++
                _rewards.push([])
            }
            _rewards[j].push(formattedData[i])
        }

        return _rewards
    }, [formattedData])

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
            {!formattedData ? (
                <Rewards>
                    <RewardsRow>
                        {[0, 1, 2].map((el, i) => (
                            <Reward skeleton key={i}>
                                <RewardTokenIcon skeleton/>
                                <RewardTokenInfo skeleton>
                                    <div/>
                                    <div/>
                                </RewardTokenInfo>
                                <RewardClaimButton skeleton/>
                            </Reward>
                        ))}
                    </RewardsRow>
                </Rewards>
            ) : chunkedRewards?.length !== 0 ? (
                <Rewards>
                    {chunkedRewards?.map((el, i) => (
                        <RewardsRow key={i}>
                            {el.map((rew, j) => (
                                <Reward refreshing={refreshing} key={j}>
                                    {refreshing && (
                                        <LoadingShim>
                                            <Loader style={{ margin: 'auto' }} size={'18px'}
                                                    stroke={'white'} />
                                        </LoadingShim>
                                    )}
                                    <CurrencyLogo
                                        currency={{
                                            address: rew.rewardAddress,
                                            symbol: rew.symbol
                                        }}
                                        size={'35px'}
                                        style={{ marginRight: '10px' }}
                                    />
                                    <RewardTokenInfo>
                                        <div title={rew.amount}>{formatReward(rew.amount)}</div>
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
                                                setRewardsLoader({
                                                    id: rew.rewardAddress,
                                                    state: true
                                                })
                                                claimReward(rew.rewardAddress)
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
            ) : null}
        </>
    )
}
