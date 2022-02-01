import { useEffect, useCallback, useState, useRef } from "react";
import { useActiveWeb3React } from "./web3";
import * as request from 'utils/request';
import { CHAIN_SUBGRAPH_URL } from "../state/data/slice";
import { Contract, providers } from "ethers";
import POOL_ABI from 'abis/pool';
import ERC20_ABI from 'abis/erc20'
import STAKER_ABI from 'abis/staker'
import NON_FUN_POS_MAN from 'abis/non-fun-pos-man'
import FARMING_CENTER_ABI from 'abis/farming-center'
import FINITE_FARMING_ABI from 'abis/finite-farming'
import { FARMING_CENTER, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, FINITE_FARMING } from "../constants/addresses";
// import BigNumber from 'bignumber.js'
import { BigNumber } from "@ethersproject/bignumber";
import { position } from "styled-system";
import { useApolloClient, useLazyQuery, useQuery, gql } from "@apollo/client";
import { CURRENT_EVENTS, FETCH_ETERNAL_FARM, FETCH_INCENTIVE, FETCH_POOL, FETCH_REWARDS, FETCH_TOKEN, FUTURE_EVENTS, INFINITE_EVENTS, LAST_EVENT, POSITIONS_ON_ETERNAL_FARMING, POSITIONS_OWNED_FOR_POOL, SHARED_POSITIONS, TRANSFERED_POSITIONS, TRANSFERED_POSITIONS_FOR_POOL } from "../utils/graphql-queries";
import { useClients } from "./subgraph/useClients";
import { formatUnits } from "@ethersproject/units";


export function useIncentiveSubgraph() {

    const { chainId, account } = useActiveWeb3React()

    const { dataClient, farmingClient } = useClients()

    const [positionsForPool, setPositionsForPool] = useState(null);
    const [positionsForPoolLoading, setPositionsForPoolLoading] = useState(false)

    const [transferredPositions, setTransferredPositions] = useState(null);
    const [transferredPositionsLoading, setTransferredPositionsLoading] = useState(false)

    const [rewardsResult, setRewardsResult] = useState(null)
    const [rewardsLoading, setRewardsLoading] = useState(null)

    const [futureEvents, setFutureEvents] = useState(null)
    const [futureEventsLoading, setFutureEventsLoading] = useState(false)

    const [currentEvents, setCurrentEvents] = useState(null)
    const [currentEventsLoading, setCurrentEventsLoading] = useState(false)

    const [positionsOnFarmer, setPositionsOnFarmer] = useState(null)
    const [positionsOnFarmerLoading, setPositionsOnFarmerLoading] = useState(false)

    const [eternalFarms, setEternalFarms] = useState(null)
    const [eternalFarmsLoading, setEternalFarmsLoading] = useState(false)

    const [positionsEternal, setPositionsEternal] = useState(null)
    const [positionsEternalLoading, setPositionsEternalLoading] = useState(false)

    const provider = window.ethereum ? new providers.Web3Provider(window.ethereum) : undefined

    async function getEvents(events: any[]) {

        const _events = []

        for (let i = 0; i < events.length; i++) {

            const pool = await fetchPool(events[i].pool)

            const rewardToken = await fetchToken(events[i].rewardToken);
            const bonusRewardToken = await fetchToken(events[i].bonusRewardToken);

            const _event: any = {
                ...events[i],
                token0: pool.token0.symbol,
                token0Address: pool.token0.id,
                token1Address: pool.token1.id,
                token1: pool.token1.symbol,
                rewardAddress: events[i].rewardToken,
                bonusRewardAddress: events[i].bonusRewardToken,
                rewardToken,
                reward: formatUnits(BigNumber.from(events[i].reward), rewardToken.decimals),
                bonusRewardToken,
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

    async function fetchEternalFarming(farmId: string) {

        try {

            const { data: { eternalFarmings }, error } = (await farmingClient.query({
                query: FETCH_ETERNAL_FARM(farmId)
            }))

            if (error) throw new Error(`${error.name} ${error.message}`)

            return eternalFarmings[0]


        } catch (err) {
            throw new Error('Fetch eternal farming ' + err.code + err.message)
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
                    name,
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

            if (positionsTransferred.length === 0) {
                setTransferredPositions([])
                setTransferredPositionsLoading(false)
                return
            }

            const _positions = []

            for (const position of positionsTransferred) {

                const nftContract = new Contract(
                    NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
                    NON_FUN_POS_MAN,
                    provider.getSigner()
                )

                const { tickLower, tickUpper, liquidity, token0, token1 } = await nftContract.positions(+position.id)

                let _position = {
                    ...position,
                    tickLower,
                    tickUpper,
                    liquidity,
                    token0,
                    token1
                }

                if (!position.incentive && !position.eternalFarming) {

                    const _pool = await fetchPool(position.pool)

                    _position = {
                        ..._position,
                        pool: _pool,
                    }

                }

                if (position.incentive) {

                    const finiteFarmingContract = new Contract(
                        FINITE_FARMING[chainId],
                        FINITE_FARMING_ABI,
                        provider.getSigner()
                    )

                    const { rewardToken, bonusRewardToken, pool, startTime, endTime, id } = await fetchIncentive(position.incentive)

                    const rewardInfo = await finiteFarmingContract.getRewardInfo(
                        [rewardToken, bonusRewardToken, pool, +startTime, +endTime],
                        +position.id
                    )

                    const _rewardToken = await fetchToken(rewardToken)
                    const _bonusRewardToken = await fetchToken(bonusRewardToken)
                    const _pool = await fetchPool(pool)

                    _position = {
                        ..._position,
                        pool: _pool,
                        incentiveRewardToken: _rewardToken,
                        incentiveBonusRewardToken: _bonusRewardToken,
                        incentiveStartTime: startTime,
                        incentiveEndTime: endTime,
                        started: startTime * 1000 < Date.now(),
                        ended: endTime * 1000 < Date.now(),
                        incentiveEarned: formatUnits(BigNumber.from(rewardInfo[0]), _rewardToken.decimals),
                        incentiveBonusEarned: formatUnits(BigNumber.from(rewardInfo[1]), _bonusRewardToken.decimals)
                    }

                }

                if (position.eternalFarming) {

                    const { rewardToken, bonusRewardToken, pool, startTime, endTime, id } = await fetchEternalFarming(position.eternalFarming)

                    const farmingCenterContract = new Contract(
                        FARMING_CENTER[chainId],
                        FARMING_CENTER_ABI,
                        provider.getSigner()
                    )

                    const { reward, bonusReward } = await farmingCenterContract.callStatic.collectRewards(
                        [rewardToken, bonusRewardToken, pool, startTime, endTime],
                        +position.id,
                        {
                            from: account
                        }
                    )

                    const _rewardToken = await fetchToken(rewardToken)
                    const _bonusRewardToken = await fetchToken(bonusRewardToken)
                    const _pool = await fetchPool(pool)

                    _position = {
                        ..._position,
                        eternalRewardToken: _rewardToken,
                        eternalBonusRewardToken: _bonusRewardToken,
                        eternalStartTime: startTime,
                        eternalEndTime: endTime,
                        pool: _pool,
                        eternalEarned: formatUnits(BigNumber.from(reward), _rewardToken.decimals),
                        eternalBonusEarned: formatUnits(BigNumber.from(bonusReward), _bonusRewardToken.decimals)
                    }

                }

                _positions.push(_position)

            }

            console.log('[POSITIONSasda]', _positions)

            setTransferredPositions(_positions)

        } catch (err) {
            setTransferredPositionsLoading(null)
            throw new Error('Transferred positions' + err.code + err.message)
        }

        setTransferredPositionsLoading(false)

    }

    async function fetchPositionsOnEternalFarming(reload?: boolean) {

        if (!chainId || !account) return

        if (!provider) throw new Error('No provider')

        setPositionsEternalLoading(true)

        try {

            const { data: { deposits: eternalPositions }, error } = (await farmingClient.query({
                query: POSITIONS_ON_ETERNAL_FARMING(account),
                fetchPolicy: reload ? 'network-only' : 'cache-first'
            }))

            if (error) throw new Error(`${error.name} ${error.message}`)

            if (eternalPositions.length === 0) {
                setPositionsEternal([])
                setPositionsEternalLoading(false)
                return
            }

            const _positions = []

            for (const position of eternalPositions) {

                const nftContract = new Contract(
                    NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
                    NON_FUN_POS_MAN,
                    provider.getSigner()
                )

                const { tickLower, tickUpper, liquidity, token0, token1 } = await nftContract.positions(+position.id)

                let _position = {
                    tickLower,
                    tickUpper,
                    liquidity,
                    token0,
                    token1
                }

                const { rewardToken, bonusRewardToken, pool, startTime, endTime, id } = await fetchEternalFarming(position.eternalFarming)

                const _pool = await fetchPool(pool)
                const _rewardToken = await fetchToken(rewardToken)
                const _bonusRewardToken = await fetchToken(bonusRewardToken)

                _position = {
                    ..._position,
                    ...position,
                    pool: _pool,
                    rewardToken: _rewardToken,
                    bonusRewardToken: _bonusRewardToken,
                    startTime,
                    endTime
                }

                _positions.push(_position)

            }

            setPositionsEternal(_positions)

        } catch (error) {
            setPositionsEternalLoading(null)
            throw new Error('Eternal farms loading' + error.code + error.message)
        }

    }

    async function fetchPositionsForPool(pool: any) {

        if (!chainId || !account) return

        try {

            setPositionsForPoolLoading(true)

            const { data: { deposits: positionsTransferred }, error: errorTransferred } = (await farmingClient.query({
                query: TRANSFERED_POSITIONS_FOR_POOL(account, pool.id),
                fetchPolicy: 'network-only'
            }))

            if (errorTransferred) throw new Error(`${errorTransferred.name} ${errorTransferred.message}`)

            //Hack
            for (let position of positionsTransferred) {

                position = { ...position }

            }

            console.log('_POSITOSNSS', positionsTransferred)

            setPositionsForPool(positionsTransferred)

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

            const transferredPositionsIds = positionsTransferred.map(position => position.id);

            setPositionsOnFarmer(transferredPositionsIds);

        } catch (err) {
            setPositionsOnFarmerLoading(null)
            throw new Error('Fetching positions on farmer ' + err)
        }

    }

    async function fetchEternalFarms(reload: boolean) {

        setEternalFarmsLoading(true)

        try {

            const { data: { eternalFarmings }, error } = (await farmingClient.query({
                query: INFINITE_EVENTS,
                fetchPolicy: reload ? 'network-only' : 'cache-first'
            }))

            if (error) throw new Error(`${error.name} ${error.message}`)

            if (eternalFarmings.length === 0) {
                setEternalFarms([])
                setEternalFarmsLoading(false)
                return
            }

            let _eternalFarmings = []

            for (const farming of eternalFarmings) {

                const pool = await fetchPool(farming.pool)
                const rewardToken = await fetchToken(farming.rewardToken)
                const bonusRewardToken = await fetchToken(farming.bonusRewardToken)

                console.log(farming.pool, pool)

                _eternalFarmings = [
                    ..._eternalFarmings,
                    {
                        ...farming,
                        rewardToken,
                        bonusRewardToken,
                        pool
                    }
                ]

            }

            console.log('[ETERNAL FARMINGs]', _eternalFarmings)

            setEternalFarms(_eternalFarmings)

        } catch (err) {
            setEternalFarms(null)
            throw new Error('Error while fetching eternal farms ' + err.message)
        }

        setEternalFarmsLoading(false)

    }

    return {
        fetchRewards: { rewardsResult, rewardsLoading, fetchRewardsFn: fetchRewards },
        fetchFutureEvents: { futureEvents, futureEventsLoading, fetchFutureEventsFn: fetchFutureEvents },
        fetchCurrentEvents: { currentEvents, currentEventsLoading, fetchCurrentEventsFn: fetchCurrentEvents },
        fetchPositionsForPool: { positionsForPool, positionsForPoolLoading, fetchPositionsForPoolFn: fetchPositionsForPool },
        fetchTransferredPositions: { transferredPositions, transferredPositionsLoading, fetchTransferredPositionsFn: fetchTransferredPositions },
        fetchPositionsOnFarmer: { positionsOnFarmer, positionsOnFarmerLoading, fetchPositionsOnFarmerFn: fetchPositionsOnFarmer },
        fetchEternalFarms: { eternalFarms, eternalFarmsLoading, fetchEternalFarmsFn: fetchEternalFarms },
        fetchPositionsOnEternalFarmings: { positionsEternal, positionsEternalLoading, fetchPositionsOnEternalFarmingFn: fetchPositionsOnEternalFarming }
    }

}