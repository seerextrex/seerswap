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

    const { claimRewardHash, claimRewardsHandler } = useStakerHandlers() || {}

    const [rewardsLoader, setRewardsLoader] = useState({ id: null, state: false })

    const isLoading = (id: string | number) => rewardsLoader.id === id && rewardsLoader.state

    useEffect(() => {
        fetchHandler()
    }, [])

    useEffect(() => {
        if (!data) return

        if (claimRewardHash && claimRewardHash.error) {
            setRewardsLoader({ id: claimRewardHash.id, state: false })
        } else if (claimRewardHash && confirmed.includes(claimRewardHash.hash)) {
            setRewardsLoader({ id: claimRewardHash.id, state: false })
            data.find((el: any) => el.rewardAddress === claimRewardHash.id).amount = 0
            data.find((el: any) => el.rewardAddress === claimRewardHash.id).trueAmount = 0
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

    function formatReward(earned: any) {
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
            {!data ? (
                <Rewards>
                    <RewardsRow>
                        {[0, 1, 2].map((el, i) => (
                            <Reward skeleton key={i}>
                                <RewardTokenIcon skeleton />
                                <RewardTokenInfo skeleton>
                                    <div />
                                    <div />
                                </RewardTokenInfo>
                                <RewardClaimButton skeleton />
                            </Reward>
                        ))}
                    </RewardsRow>
                    <RewardsRow>
                        {[0, 1].map((el, i) => (
                            <Reward skeleton key={i}>
                                <RewardTokenIcon skeleton />
                                <RewardTokenInfo skeleton>
                                    <div />
                                    <div />
                                </RewardTokenInfo>
                                <RewardClaimButton skeleton />
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
                                    <CurrencyLogo currency={{
                                        address: rew.rewardAddress,
                                        symbol: rew.symbol
                                    }} size={'35px'}
                                                  style={{ marginRight: '10px' }} />
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
                                                claimRewardsHandler(rew.rewardAddress, rew.trueAmount)
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
            ) : chunkedRewards.length === 0 ? (
                <EmptyMock>
                    <div>No rewards</div>
                    <Frown size={35} stroke={'white'} />
                </EmptyMock>
            ) : null}
        </>
    )
}
