import { useState } from 'react'
import { useActiveWeb3React } from './web3'
import { CHAIN_SUBGRAPH_URL } from '../state/data/slice'
import { Contract, providers } from 'ethers'
import ERC20_ABI from 'abis/erc20'
import STAKER_ABI from 'abis/staker'
import NON_FUN_POS_MAN from 'abis/non-fun-pos-man'
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, STAKER_ADDRESS } from '../constants/addresses'
import { BigNumber } from '@ethersproject/bignumber'
import {
    CURRENT_EVENTS,
    FETCH_INCENTIVE,
    FETCH_POOL,
    FETCH_REWARDS,
    FETCH_TOKEN,
    FUTURE_EVENTS,
    POSITIONS_OWNED_FOR_POOL,
    SHARED_POSITIONS,
    TRANSFERED_POSITIONS,
    TRANSFERED_POSITIONS_FOR_POOL
} from '../utils/graphql-queries'
import { useClients } from './subgraph/useClients'
import { formatUnits } from '@ethersproject/units'

//TODO ТИПИЗИРОВАТЬ !!!!!!!!!!!!!
export function useIncentiveSubgraph() {
    const { chainId, account } = useActiveWeb3React()
    const { dataClient, farmingClient } = useClients()

    const [positionsForPool, setPositionsForPool] = useState(null)
    const [positionsForPoolLoading, setPositionsForPoolLoading] = useState<boolean>(false)

    const [transferredPositions, setTransferredPositions] = useState(null)
    const [transferredPositionsLoading, setTransferredPositionsLoading] = useState<boolean>(false)

    const [rewardsResult, setRewardsResult] = useState(null)
    const [rewardsLoading, setRewardsLoading] = useState<boolean>(false)

    const [futureEvents, setFutureEvents] = useState(null)
    const [futureEventsLoading, setFutureEventsLoading] = useState<boolean>(false)

    const [currentEvents, setCurrentEvents] = useState(null)
    const [currentEventsLoading, setCurrentEventsLoading] = useState<boolean>(false)

    const [positionsOnFarmer, setPositionsOnFarmer] = useState(null)
    const [positionsOnFarmerLoading, setPositionsOnFarmerLoading] = useState<boolean>(false)

    const provider = window.ethereum ? new providers.Web3Provider(window.ethereum) : undefined

    async function getEvents(events: any[]) {

        const _events = []

        for (let i = 0; i < events.length; i++) {

            const pool = await fetchPool(events[i].pool)

            const rewardToken = await fetchToken(events[i].rewardToken)
            const bonusRewardToken = await fetchToken(events[i].bonusRewardToken)

            const _event: any = {
                ...events[i],
                token0: pool.token0.symbol,
                token0Address: pool.token0.id,
                token1Address: pool.token1.id,
                token1: pool.token1.symbol,
                rewardAddress: events[i].rewardToken,
                bonusRewardAddress: events[i].bonusRewardToken,
                rewardToken: rewardToken.symbol,
                reward: formatUnits(BigNumber.from(events[i].reward), rewardToken.decimals),
                bonusRewardToken: bonusRewardToken.symbol,
                bonusReward: formatUnits(BigNumber.from(events[i].bonusReward), bonusRewardToken.decimals)
            }

            _events.push({ ..._event })
        }

        return _events

    }

    async function fetchToken(tokenId: string) {

        try {

            const { data: { tokens }, error } = (await dataClient.query({
                query: FETCH_TOKEN(tokenId)
            }))

            if (error) throw new Error(`${error.name} ${error.message}`)

            return tokens[0]

        } catch (err) {
            throw new Error('Fetch token ' + err)
        }
    }

    async function fetchPool(poolId: string) {
        try {

            const { data: { pools }, error } = (await dataClient.query({
                query: FETCH_POOL(poolId)
            }))


            if (error) throw new Error(`${error.name} ${error.message}`)

            return pools[0]

        } catch (err) {
            throw new Error('Fetch pools ' + err)
        }
    }

    async function fetchIncentive(incentiveId: string) {

        try {

            const { data: { incentives }, error } = (await farmingClient.query({
                query: FETCH_INCENTIVE(incentiveId)
            }))

            if (error) throw new Error(`${error.name} ${error.message}`)

            return incentives[0]


        } catch (err) {
            throw new Error('Fetch incentives ' + err)
        }
    }

    async function fetchRewards(reload?: boolean) {

        if (!account || !chainId) return

        try {
            setRewardsLoading(true)

            const { data: { rewards }, error } = (await farmingClient.query({
                query: FETCH_REWARDS(account),
                fetchPolicy: reload ? 'network-only' : 'cache-first'
            }))

            if (error) throw new Error(`${error.name} ${error.message}`)

            if (!provider) throw new Error('No provider')

            const newRewards = []

            for (const reward of rewards) {

                const rewardContract = new Contract(
                    reward.rewardAddress,
                    ERC20_ABI,
                    provider
                )

                const symbol = await rewardContract.symbol()
                const name = await rewardContract.name()
                const decimals = await rewardContract.decimals()

                const newReward = {
                    ...reward,
                    amount: reward.amount > 0 ? (reward.amount / Math.pow(10, decimals)).toFixed(decimals) : 0,
                    trueAmount: reward.amount,
                    symbol,
                    name
                }

                newRewards.push(newReward)

            }

            setRewardsResult(newRewards)

        } catch (err) {
            setRewardsResult('failed')
            throw new Error('Reward fetching ' + err.message)
        }

        setRewardsLoading(false)
    }

    async function fetchFutureEvents(reload?: boolean) {

        try {

            setFutureEventsLoading(true)

            const { data: { incentives: futureEvents }, error } = (await farmingClient.query({
                query: FUTURE_EVENTS(),
                fetchPolicy: reload ? 'network-only' : 'cache-first'
            }))

            if (error) throw new Error(`${error.name} ${error.message}`)

            if (futureEvents.length === 0) {
                setFutureEvents([])
                setFutureEventsLoading(false)
                return
            }

            setFutureEvents(await getEvents(futureEvents))

        } catch (err) {
            setFutureEventsLoading(null)
            throw new Error('Future incentives fetching ' + err)
        }

        setFutureEventsLoading(false)

    }

    async function fetchCurrentEvents(reload?: boolean) {

        setCurrentEventsLoading(true)

        try {

            const { data: { incentives: currentEvents }, error } = (await farmingClient.query({
                query: CURRENT_EVENTS(),
                fetchPolicy: reload ? 'network-only' : 'cache-first'
            }))

            if (error) throw new Error(`${error.name} ${error.message}`)

            if (currentEvents.length === 0) {
                setCurrentEvents([])
                setCurrentEventsLoading(false)
                return
            }

            setCurrentEvents(await getEvents(currentEvents.filter(el => el.id !== '0x5091ad63349a004342a9c834b950a4713dd9a10755a291e9f6713e234a97e7e6')))
            setCurrentEventsLoading(false)

        } catch (err) {
            setCurrentEventsLoading(null)
            throw new Error('Error while fetching current incentives ' + err)
        }

        setCurrentEventsLoading(false)

    }

    async function fetchTransferredPositions(reload?: boolean) {

        if (!chainId || !account) return

        if (!provider) throw new Error('No provider')

        try {

            setTransferredPositionsLoading(true)

            const { data: { deposits: positionsTransferred }, error } = (await farmingClient.query({
                query: TRANSFERED_POSITIONS(account, chainId),
                fetchPolicy: reload ? 'network-only' : 'cache-first'
            }))

            if (error) throw new Error(`${error.name} ${error.message}`)

            const {
                data: { deposits: positionsShared },
                error: _error
            } = await farmingClient.query({
                query: SHARED_POSITIONS(account),
                fetchPolicy: reload ? 'network-only' : 'cache-first'
            })

            if (error) throw new Error(`${_error.name} ${_error.message}`)

            if (positionsTransferred.length === 0 && positionsShared.length === 0) {
                setTransferredPositions([])
                setTransferredPositionsLoading(false)
                return
            }

            const _positions = []

            for (const position of [...positionsTransferred, ...positionsShared]) {
                const nftContract = new Contract(
                    NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
                    NON_FUN_POS_MAN,
                    provider.getSigner()
                )

                const {
                    tickLower,
                    tickUpper,
                    liquidity,
                    token0,
                    token1
                } = await nftContract.positions(+position.tokenId)

                let _position = {
                    tickLower,
                    tickUpper,
                    liquidity,
                    token0,
                    token1
                }

                if (position.incentive) {

                    const {
                        rewardToken,
                        bonusRewardToken,
                        pool,
                        startTime,
                        endTime,
                        refundee,
                        id
                    } = await fetchIncentive(position.incentive)

                    const rewardContract = new Contract(
                        rewardToken,
                        ERC20_ABI,
                        provider
                    )

                    const bonusRewardContract = new Contract(
                        bonusRewardToken,
                        ERC20_ABI,
                        provider
                    )

                    const symbol = await rewardContract.symbol()
                    const decimals = await rewardContract.decimals()
                    const name = await rewardContract.name()

                    const bonusSymbol = await bonusRewardContract.symbol()
                    const bonusDecimals = await bonusRewardContract.decimals()
                    const bonusName = await bonusRewardContract.name()

                    _position = {
                        ..._position,
                        ...position,
                        approved: true,
                        transfered: true,
                        pool: await fetchPool(pool),
                        rewardToken: {
                            symbol,
                            decimals,
                            name,
                            id: rewardToken
                        },
                        bonusRewardToken: {
                            symbol: bonusSymbol,
                            decimals: bonusDecimals,
                            name: bonusName,
                            id: bonusRewardToken
                        },
                        startTime,
                        endTime,
                        refundee,
                        ended: endTime * 1000 < Date.now()
                    }


                    if (position.staked) {

                        const stakingContract = new Contract(
                            STAKER_ADDRESS[chainId],
                            STAKER_ABI,
                            provider.getSigner()
                        )

                        const rewardInfo = await stakingContract.getRewardInfo(
                            [rewardToken, bonusRewardToken, pool, +startTime, +endTime, refundee],
                            +position.tokenId
                        )

                        _position = {
                            ..._position,
                            earned: formatUnits(BigNumber.from(rewardInfo[0]), decimals),
                            bonusEarned: formatUnits(BigNumber.from(rewardInfo[1]), bonusDecimals)
                        }

                    } else {
                        _position = {
                            ..._position,
                            earned: 0,
                            bonusEarned: 0
                        }
                    }

                    _positions.push(_position)

                } else {
                    _position = {
                        ..._position,
                        ...position,
                        approved: true,
                        transfered: true,
                        ended: true
                    }

                    _positions.push(_position)
                }

            }

            setTransferredPositions(_positions)

        } catch (err) {
            setTransferredPositionsLoading(null)
            throw new Error('Transferred positions' + err)
        }

        setTransferredPositionsLoading(false)

    }

    async function fetchPositionsForPool(pool: string) {

        if (!chainId || !account) return

        try {

            setPositionsForPoolLoading(true)

            const {
                data: { deposits: positionsTransferred },
                error: errorTransferred
            } = (await farmingClient.query({
                query: TRANSFERED_POSITIONS_FOR_POOL(account, pool),
                fetchPolicy: 'network-only'
            }))

            if (errorTransferred) throw new Error(`${errorTransferred.name} ${errorTransferred.message}`)

            const {
                data: { deposits: positionsOwned },
                error: errorOwned
            } = (await farmingClient.query({
                query: POSITIONS_OWNED_FOR_POOL(account, pool),
                fetchPolicy: 'network-only'
            }))

            if (errorOwned) throw new Error(`${errorOwned.name} ${errorOwned.message}`)

            const positions = [...positionsTransferred, ...positionsOwned]

            const _positions = []

            let _position

            for (const position of positions) {

                _position = { ...position }

                if (position.owner === STAKER_ADDRESS[chainId].toLowerCase()) {
                    _position.approved = true
                    _position.transfered = true
                }

                _positions.push(_position)

            }

            setPositionsForPool(_positions)

        } catch (err) {
            setPositionsForPoolLoading(null)
            throw new Error('Positions for pools ' + err)
        }

        setPositionsForPoolLoading(false)

    }

    async function fetchPositionsOnFarmer(account) {


        try {

            setPositionsOnFarmerLoading(true)

            const { data: { deposits: positionsTransferred }, error } = (await farmingClient.query({
                query: TRANSFERED_POSITIONS(account, chainId),
                fetchPolicy: 'network-only'
            }))

            if (error) throw new Error(`${error.name} ${error.message}`)

            if (positionsTransferred.length === 0) {
                setPositionsOnFarmer([])
                setPositionsOnFarmerLoading(false)
                return
            }


            const transferredPositionsIds = positionsTransferred.map(position => position.tokenId)

            setPositionsOnFarmer(transferredPositionsIds)

        } catch (err) {
            setPositionsOnFarmerLoading(null)
            throw new Error('Fetching positions on farmer ' + err)
        }

    }

    return {
        fetchRewards: { rewardsResult, rewardsLoading, fetchRewardsFn: fetchRewards },
        fetchFutureEvents: {
            futureEvents,
            futureEventsLoading,
            fetchFutureEventsFn: fetchFutureEvents
        },
        fetchCurrentEvents: {
            currentEvents,
            currentEventsLoading,
            fetchCurrentEventsFn: fetchCurrentEvents
        },
        fetchPositionsForPool: {
            positionsForPool,
            positionsForPoolLoading,
            fetchPositionsForPoolFn: fetchPositionsForPool
        },
        fetchTransferredPositions: {
            transferredPositions,
            transferredPositionsLoading,
            fetchTransferredPositionsFn: fetchTransferredPositions
        },
        fetchPositionsOnFarmer: {
            positionsOnFarmer,
            positionsOnFarmerLoading,
            fetchPositionsOnFarmerFn: fetchPositionsOnFarmer
        },
        fetchPool
    }

}
