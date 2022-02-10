import { useEffect, useMemo, useState } from 'react'
import { useStakerHandlers } from '../../hooks/useStakerHandlers'
import { useAllTransactions } from '../../state/transactions/hooks'
import Loader from '../Loader'
import CurrencyLogo from '../CurrencyLogo'
import {
    LoadingShim,
    Reward,
    RewardClaimButton,
    Rewards,
    RewardsRow,
    RewardTokenInfo
} from './styled'
import { formatReward } from '../../utils/formatReward'

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

    if (chunkedRewards?.length === 0) return null
    return (
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
    )
}
