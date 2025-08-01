import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { publicClientToProvider } from "../utils/ethersAdapters";
import { Contract } from "ethers";
import ERC20_ABI from "abis/erc20.json";
import NON_FUN_POS_MAN from "abis/non-fun-pos-man.json";
import FARMING_CENTER_ABI from "abis/farming-center.json";
import FINITE_FARMING_ABI from "abis/finite-farming.json";
import { FARMING_CENTER, FINITE_FARMING, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from "../constants/addresses";
import {
    CURRENT_EVENTS,
    FETCH_ETERNAL_FARM,
    FETCH_ETERNAL_FARM_FROM_POOL,
    FETCH_FINITE_FARM_FROM_POOL,
    FETCH_LIMIT,
    FETCH_POOL,
    FETCH_POOLS_BY_IDS,
    FETCH_REWARDS,
    FETCH_TOKEN,
    FETCH_TOKENS_BY_IDS,
    FUTURE_EVENTS,
    HAS_TRANSFERED_POSITIONS,
    INFINITE_EVENTS,
    POSITIONS_ON_ETERNAL_FARMING,
    TRANSFERED_POSITIONS,
    TRANSFERED_POSITIONS_FOR_POOL,
    FETCH_ETERNAL_FARMS_BY_IDS,
} from "../utils/graphql-queries";
import { useClients } from "./subgraph/useClients";
import { formatUnits, parseUnits } from "ethers";
import {
    Deposit,
    DetachedEternalFarming,
    EternalFarming,
    FarmingEvent,
    FormattedEternalFarming,
    FormattedRewardInterface,
    PoolChartSubgraph,
    PoolSubgraph,
    Position,
    SubgraphResponse,
    TickFarming,
    TokenSubgraph,
} from "../models/interfaces";
import { Aprs, FutureFarmingEvent } from "../models/interfaces";
import { fetchEternalFarmTVL, fetchLimitFarmAPR, fetchLimitFarmTVL } from "utils/api";
import { useEthPrices } from "./useEthPrices";

import AlgebraConfig from "algebra.config";

export function useFarmingSubgraph() {
    const { address: account, chain } = useAccount();
    const chainId = chain?.id;
    const publicClient = usePublicClient({ chainId });
    const provider = useMemo(() => publicClient ? publicClientToProvider(publicClient) : undefined, [publicClient]);

    const { dataClient, farmingClient } = useClients();

    const [positionsForPool, setPositionsForPool] = useState<Position[] | null>(null);
    const [positionsForPoolLoading, setPositionsForPoolLoading] = useState<boolean>(false);

    const [transferredPositions, setTransferredPositions] = useState<Deposit[] | null>(null);
    const [transferredPositionsLoading, setTransferredPositionsLoading] = useState<boolean>(false);

    const [hasTransferredPositions, setHasTransferredPositions] = useState<boolean | null>(null);
    const [hasTransferredPositionsLoading, setHasTransferredPositionsLoading] = useState<boolean>(false);

    const [rewardsResult, setRewardsResult] = useState<FormattedRewardInterface[] | string>([]);
    const [rewardsLoading, setRewardsLoading] = useState<boolean>(false);

    const [futureEvents, setFutureEvents] = useState<FutureFarmingEvent[] | null>(null);
    const [futureEventsLoading, setFutureEventsLoading] = useState<boolean>(false);

    const [allEvents, setAllEvents] = useState<{ currentEvents: FarmingEvent[]; futureEvents: FutureFarmingEvent[] } | null>(null);
    const [allEventsLoading, setAllEventsLoading] = useState<boolean>(false);

    const [positionsOnFarmer, setPositionsOnFarmer] = useState<{ transferredPositionsIds: string[]; oldTransferredPositionsIds: string[] } | null>(null);
    const [positionsOnFarmerLoading, setPositionsOnFarmerLoading] = useState<boolean>(false);

    const [eternalFarms, setEternalFarms] = useState<FormattedEternalFarming[] | null>(null);
    const [eternalFarmsLoading, setEternalFarmsLoading] = useState<boolean>(false);

    const [positionsEternal, setPositionsEternal] = useState<TickFarming[] | null>(null);
    const [positionsEternalLoading, setPositionsEternalLoading] = useState<boolean>(false);

    const ethPrices = useEthPrices();

    // Utility function to validate token data
    const isValidToken = (token: any): boolean => {
        return token &&
            typeof token.id === 'string' &&
            typeof token.symbol === 'string' &&
            typeof token.decimals !== 'undefined' &&
            Number.isInteger(Number(token.decimals)) &&
            Number(token.decimals) >= 0;
    };

    // Utility function to detect retryable contract call errors
    const isRetryableError = (error: any): boolean => {
        if (!error || typeof error.message !== 'string') return false;
        const message = error.message.toLowerCase();

        // Network/RPC related errors that should be retried
        return message.includes('missing revert data') ||
            message.includes('call_exception') ||
            message.includes('network error') ||
            message.includes('timeout') ||
            message.includes('connection') ||
            message.includes('rpc') ||
            error.code === 'CALL_EXCEPTION';
    };

    // Enhanced retry wrapper with data refresh capability
    const retryContractCallWithRefresh = async <T>(
        contractCall: () => Promise<T>,
        refreshDataFn?: () => Promise<void>,
        maxRetries = 3,
        delayMs = 1000
    ): Promise<T | { error: any }> => {
        let lastError: any = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await contractCall();
                if (attempt > 1) {
                    console.log(`[DEBUG] ✅ Contract call succeeded on attempt ${attempt}/${maxRetries} (retry successful!)`);
                }
                return result;
            } catch (error) {
                lastError = error;

                if (isRetryableError(error) && attempt < maxRetries) {
                    const errorTyped = error as any;
                    console.warn(`[DEBUG] 🔄 Retryable error on attempt ${attempt}/${maxRetries}, retrying in ${delayMs}ms:`, {
                        errorType: errorTyped.code || 'unknown',
                        errorMessage: errorTyped.message?.substring(0, 100) + '...',
                        nextAttemptIn: delayMs,
                        willRefreshData: attempt === 2 && !!refreshDataFn // Refresh data on 2nd attempt
                    });

                    // On the second attempt, try refreshing underlying data
                    if (attempt === 2 && refreshDataFn) {
                        try {
                            console.log(`[DEBUG] 🔄 Refreshing underlying data before retry...`);
                            await refreshDataFn();
                        } catch (refreshError) {
                            console.warn(`[DEBUG] ⚠️ Data refresh failed:`, refreshError);
                        }
                    }

                    await new Promise(resolve => setTimeout(resolve, delayMs));
                    delayMs *= 1.5; // Exponential backoff
                } else {
                    if (attempt === maxRetries) {
                        console.error(`[DEBUG] ❌ All ${maxRetries} retry attempts failed`);
                    } else {
                        console.error(`[DEBUG] ❌ Non-retryable error, aborting retries`);
                    }
                    break;
                }
            }
        }

        console.error(`[DEBUG] Contract call failed after ${maxRetries} attempts:`, lastError);
        return { error: lastError };
    };

    const fetchPositionsOnFarmer = useCallback(async (account: string) => {
        try {
            setPositionsOnFarmerLoading(true);

            const {
                data: { deposits: positionsTransferred },
                error,
            } = await farmingClient.query<SubgraphResponse<Position[]>>({
                query: TRANSFERED_POSITIONS(true),
                fetchPolicy: "network-only",
                variables: { account },
            });

            if (error) throw new Error(`${error.name} ${error.message}`);

            const newTransferredPositionsIds = positionsTransferred.map((position) => position.id);
            // For now, oldTransferredPositionsIds is always empty in this function's logic
            const newOldTransferredPositionsIds: string[] = [];

            console.log("fetchPositionsOnFarmer: Fetched positionsTransferred:", positionsTransferred);
            console.log("fetchPositionsOnFarmer: Generated newTransferredPositionsIds:", newTransferredPositionsIds);

            setPositionsOnFarmer(prevState => {
                const prevTransferredIds = prevState?.transferredPositionsIds || [];
                const prevOldTransferredIds = prevState?.oldTransferredPositionsIds || [];

                const transferredChanged = newTransferredPositionsIds.length !== prevTransferredIds.length ||
                    newTransferredPositionsIds.some((id, index) => id !== prevTransferredIds[index]);

                const oldTransferredChanged = newOldTransferredPositionsIds.length !== prevOldTransferredIds.length ||
                    newOldTransferredPositionsIds.some((id, index) => id !== prevOldTransferredIds[index]);

                if (transferredChanged || oldTransferredChanged) {
                    console.log('fetchPositionsOnFarmer: Data changed, updating state.');
                    return {
                        transferredPositionsIds: newTransferredPositionsIds,
                        oldTransferredPositionsIds: newOldTransferredPositionsIds,
                    };
                }
                console.log('fetchPositionsOnFarmer: Data unchanged, not updating state.');
                return prevState; // Return previous state if no change
            });

        } catch (err) {
            // setPositionsOnFarmerLoading(false); // Moved to finally
            console.error("Error fetching positions on farmer:", err);
            // Reset to a known empty state on error to avoid keeping stale data
            setPositionsOnFarmer(prevState => {
                const prevTransferredIds = prevState?.transferredPositionsIds || [];
                const prevOldTransferredIds = prevState?.oldTransferredPositionsIds || [];
                if (prevTransferredIds.length === 0 && prevOldTransferredIds.length === 0) {
                    return prevState; // Already empty, no change needed
                }
                return {
                    transferredPositionsIds: [],
                    oldTransferredPositionsIds: [],
                }
            });
        } finally {
            setPositionsOnFarmerLoading(false);
        }
    }, [farmingClient]);

    async function fetchEternalFarmAPR() {
        const apiURL = AlgebraConfig.API.eternalFarmsAPR;

        try {
            return await fetch(apiURL).then((v) => v.json());
        } catch (error: any) {
            return {};
        }
    }

    async function getEvents(events: any[], farming = false) {
        const _events: any[] = [];

        for (let i = 0; i < events.length; i++) {
            console.log("count", i);
            const pool = await fetchPool(events[i].pool);
            const rewardToken = await fetchToken(events[i].rewardToken, farming);
            const bonusRewardToken = await fetchToken(events[i].bonusRewardToken, farming);
            const multiplierToken = await fetchToken(events[i].multiplierToken, farming);

            const _event: any = {
                ...events[i],
                pool,
                rewardToken,
                bonusRewardToken,
                multiplierToken,
                reward: formatUnits(BigInt(events[i].reward), rewardToken.decimals),
                bonusReward: formatUnits(BigInt(events[i].bonusReward), bonusRewardToken.decimals),
            };

            _events.push({ ..._event });
        }

        return _events;
    }

    async function fetchToken(tokenId: string, farming = false) {
        try {
            const {
                data: { tokens },
                error,
            } = await (farming ? farmingClient : dataClient).query<SubgraphResponse<TokenSubgraph[]>>({
                query: FETCH_TOKEN,
                variables: { tokenId },
            });

            if (error) throw new Error(`${error.name} ${error.message}`);

            return tokens[0];
        } catch (err) {
            throw new Error("Fetch token " + err);
        }
    }

    async function fetchPool(poolId: string) {
        try {
            const {
                data: { pools },
                error,
            } = await dataClient.query<SubgraphResponse<PoolSubgraph[]>>({
                query: FETCH_POOL,
                variables: { poolId },
            });

            if (error) throw new Error(`${error.name} ${error.message}`);

            return pools[0];
        } catch (err) {
            throw new Error("Fetch pools " + err);
        }
    }

    async function fetchLimit(limitFarmingId: string) {
        try {
            const {
                data: { limitFarmings },
                error,
            } = await farmingClient.query<SubgraphResponse<FutureFarmingEvent[]>>({
                query: FETCH_LIMIT,
                variables: { limitFarmingId },
            });

            if (error) throw new Error(`${error.name} ${error.message}`);

            return limitFarmings[0];
        } catch (err) {
            throw new Error("Fetch limit farmings " + err);
        }
    }

    async function fetchEternalFarming(farmId: string) {
        try {
            const {
                data: { eternalFarmings },
                error,
            } = await farmingClient.query<SubgraphResponse<DetachedEternalFarming[]>>({
                query: FETCH_ETERNAL_FARM,
                variables: { farmId },
            });

            if (error) throw new Error(`${error.name} ${error.message}`);

            return eternalFarmings[0];
        } catch (err: any) {
            throw new Error("Fetch infinite farming " + err.message);
        }
    }

    async function fetchRewards(reload?: boolean) {
        if (!account || !chainId) return;

        try {
            setRewardsLoading(true);

            const {
                data: { rewards },
                error,
            } = await farmingClient.query({
                query: FETCH_REWARDS,
                fetchPolicy: reload ? "network-only" : "cache-first",
                variables: { account },
            });

            if (error) throw new Error(`${error.name} ${error.message}`);

            if (!provider) throw new Error("No provider");

            const newRewards: any[] = [];
            // skip 0x0000000000000000000000000000000000000000
            for (const reward of rewards) {
                if (reward.rewardAddress === "0x0000000000000000000000000000000000000000") continue;
                const rewardContract = new Contract(reward.rewardAddress, ERC20_ABI, provider);
                const symbol: string = await rewardContract.symbol.staticCall();
                const name: string = await rewardContract.name.staticCall();
                const decimalsBigInt: bigint = await rewardContract.decimals.staticCall();
                const decimals = Number(decimalsBigInt);

                const newReward = {
                    ...reward,
                    amount: reward.amount > 0 ? formatUnits(BigInt(reward.amount), decimals) : "0",
                    trueAmount: reward.amount,
                    symbol,
                    name,
                    decimals, // Store numeric decimals
                };

                newRewards.push(newReward);
            }

            setRewardsResult(newRewards);
        } catch (err) {
            setRewardsResult("failed");
            console.log("err", err);
            if (err instanceof Error) {
                throw new Error("Reward fetching " + err.message);
            }
        }

        setRewardsLoading(false);
    }

    async function fetchFutureEvents(reload?: boolean) {
        try {
            setFutureEventsLoading(true);

            const {
                data: { limitFarmings: futureEvents },
                error,
            } = await farmingClient.query<SubgraphResponse<FutureFarmingEvent[]>>({
                query: FUTURE_EVENTS,
                fetchPolicy: reload ? "network-only" : "cache-first",
                variables: { timestamp: Math.round(Date.now() / 1000) },
            });

            if (error) throw new Error(`${error.name} ${error.message}`);

            if (futureEvents.length === 0) {
                setFutureEvents([]);
                setFutureEventsLoading(false);
                return;
            }

            setFutureEvents(await getEvents(futureEvents, true));
        } catch (err) {
            throw new Error("Future limit farmings fetching " + err);
        } finally {
            setFutureEventsLoading(false);
        }
    }

    async function fetchAllEvents(reload?: boolean) {
        setAllEventsLoading(true);

        try {
            const {
                data: { limitFarmings: currentEvents },
                error,
            } = await farmingClient.query<SubgraphResponse<FarmingEvent[]>>({
                query: CURRENT_EVENTS,
                fetchPolicy: reload ? "network-only" : "cache-first",
                variables: {
                    startTime: Math.round(Date.now() / 1000),
                    endTime: Math.round(Date.now() / 1000),
                },
            });

            if (error) throw new Error(`${error.name} ${error.message}`);

            const {
                data: { limitFarmings: futureEvents },
                error: _error,
            } = await farmingClient.query<SubgraphResponse<FutureFarmingEvent[]>>({
                query: FUTURE_EVENTS,
                fetchPolicy: reload ? "network-only" : "cache-first",
                variables: { timestamp: Math.round(Date.now() / 1000) },
            });

            if (_error) throw new Error(`${_error.name} ${_error.message}`);

            if (currentEvents.length === 0 && futureEvents.length === 0) {
                setAllEvents({
                    currentEvents: [],
                    futureEvents: [],
                });
                setAllEventsLoading(false);
                return;
            }

            const eventTVL = await fetchLimitFarmTVL();
            const aprs: Aprs = await fetchLimitFarmAPR();

            const price = 1;

            const EVENT_LOCK = 100_000;

            setAllEvents({
                currentEvents: await getEvents(
                    currentEvents.map((el) => ({
                        ...el,
                        active: true,
                        apr: aprs[el.id] ? aprs[el.id] : 37,
                    })),
                    true
                ),
                futureEvents: await getEvents(
                    futureEvents.map((el) => ({
                        ...el,
                        locked: eventTVL[el.id] === undefined ? false : eventTVL[el.id] * price >= EVENT_LOCK,
                        apr: aprs[el.id] ? aprs[el.id] : 37,
                    })),
                    true
                ),
            });

            setAllEventsLoading(false);
        } catch (err) {
            throw new Error("Error while fetching current limit farmings " + err);
        } finally {
            setAllEventsLoading(false);
        }
    }

    async function fetchHasTransferredPositions() {
        if (!chainId || !account) return;

        if (!provider) throw new Error("No provider");

        try {
            setHasTransferredPositionsLoading(true);

            const {
                data: { deposits: positionsTransferred },
                error,
            } = await farmingClient.query<SubgraphResponse<Deposit[]>>({
                query: HAS_TRANSFERED_POSITIONS,
                fetchPolicy: "network-only",
                variables: { account },
            });

            if (error) throw new Error(`${error.name} ${error.message}`);

            setHasTransferredPositions(Boolean(positionsTransferred.length));
            setHasTransferredPositionsLoading(false);
        } catch (err: any) {
            throw new Error("Has transferred positions " + err.code + " " + err.message);
        } finally {
            setHasTransferredPositionsLoading(false);
        }
    }

    async function fetchTransferredPositions(reload?: boolean) {
        if (!chainId || !account) return;

        if (!provider) throw new Error("No provider");

        try {
            setTransferredPositionsLoading(true);

            console.log(`[DEBUG] Starting fetchTransferredPositions`);

            const {
                data: { deposits: positionsTransferred },
                error,
            } = await farmingClient.query<SubgraphResponse<Deposit[]>>({
                query: TRANSFERED_POSITIONS(true),
                fetchPolicy: reload ? "network-only" : "cache-first",
                variables: { account },
            });

            if (error) throw new Error(`${error.name} ${error.message}`);

            if (positionsTransferred.length === 0) {
                setTransferredPositions([]);
                setTransferredPositionsLoading(false);
                return;
            }

            // Step 1: Collect unique IDs for farms, pools, and availability checks
            const uniqueLimitFarmIds = new Set<string>();
            const uniqueEternalFarmIds = new Set<string>();
            const allPoolIdsForGeneralBatching = new Set<string>();
            const poolIdsForLimitAvailabilityCheck = new Set<string>();
            const poolIdsForEternalAvailabilityCheck = new Set<string>();

            positionsTransferred.forEach(pos => {
                if (pos.limitFarming) {
                    const limitFarmingId = typeof pos.limitFarming === 'string'
                        ? pos.limitFarming
                        : (pos.limitFarming as any).id;
                    uniqueLimitFarmIds.add(limitFarmingId);
                } else if (typeof pos.pool === 'string') {
                    poolIdsForLimitAvailabilityCheck.add(pos.pool);
                }
                if (pos.eternalFarming) {
                    const eternalFarmingId = typeof pos.eternalFarming === 'string'
                        ? pos.eternalFarming
                        : (pos.eternalFarming as any).id;
                    uniqueEternalFarmIds.add(eternalFarmingId);
                } else if (typeof pos.pool === 'string') {
                    poolIdsForEternalAvailabilityCheck.add(pos.pool);
                }
                if (typeof pos.pool === 'string') allPoolIdsForGeneralBatching.add(pos.pool);
            });

            // Step 2: Fetch farm configurations for directly staked farms & collect their token/pool IDs
            const limitFarmDetailsMap = new Map<string, FutureFarmingEvent>();
            const eternalFarmDetailsMap = new Map<string, DetachedEternalFarming>();
            const allTokenIdsForBatching = new Set<string>();

            const limitFarmPromises = Array.from(uniqueLimitFarmIds).map(id => fetchLimit(id));
            // const eternalFarmPromises = Array.from(uniqueEternalFarmIds).map(id => fetchEternalFarming(id)); // Will be replaced

            const settledLimitFarms = await Promise.allSettled(limitFarmPromises);
            settledLimitFarms.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    const farmDetail = result.value;
                    const farmId = Array.from(uniqueLimitFarmIds)[index];
                    limitFarmDetailsMap.set(farmId, farmDetail);
                    if (farmDetail.rewardToken) allTokenIdsForBatching.add(farmDetail.rewardToken);
                    if (farmDetail.bonusRewardToken) allTokenIdsForBatching.add(farmDetail.bonusRewardToken);
                    if (farmDetail.multiplierToken) allTokenIdsForBatching.add(farmDetail.multiplierToken);
                    if (farmDetail.pool) allPoolIdsForGeneralBatching.add(farmDetail.pool);
                } else if (result.status === 'rejected') {
                    console.warn(`Failed to fetch limit farm ${Array.from(uniqueLimitFarmIds)[index]}:`, result.reason);
                }
            });

            // Replace individual eternal farm fetches with a batch query
            if (uniqueEternalFarmIds.size > 0) {
                const eternalFarmIdsArray = Array.from(uniqueEternalFarmIds);
                try {
                    const { data, error: eternalFarmsError } =
                        await farmingClient.query<SubgraphResponse<DetachedEternalFarming[]>>({
                            query: FETCH_ETERNAL_FARMS_BY_IDS(eternalFarmIdsArray), // Use the new batched query
                            variables: { farmIds: eternalFarmIdsArray },
                        });

                    const fetchedEternalFarmsData = data?.eternalFarmings;

                    if (eternalFarmsError) {
                        console.warn(`Batch fetch eternal farms error: ${eternalFarmsError.name} ${eternalFarmsError.message}`);
                    } else if (fetchedEternalFarmsData) {
                        fetchedEternalFarmsData.forEach(farmDetail => {
                            eternalFarmDetailsMap.set(farmDetail.id, farmDetail);
                            if (farmDetail.rewardToken) allTokenIdsForBatching.add(farmDetail.rewardToken);
                            if (farmDetail.bonusRewardToken) allTokenIdsForBatching.add(farmDetail.bonusRewardToken);
                            if (farmDetail.multiplierToken) allTokenIdsForBatching.add(farmDetail.multiplierToken);
                            if (farmDetail.pool) allPoolIdsForGeneralBatching.add(farmDetail.pool.id);
                        });
                    } else {
                        console.warn("Batch fetch eternal farms returned no data and no error.");
                    }
                } catch (e) {
                    console.warn("Exception during batch fetch of eternal farms:", e);
                }
            }

            // Step 3: Batch fetch all unique tokens and pools
            const tokenMap = new Map<string, TokenSubgraph>();
            const poolMap = new Map<string, PoolSubgraph>();

            if (allTokenIdsForBatching.size > 0) {
                const tokenIdsArray = Array.from(allTokenIdsForBatching);
                try {
                    const { data: tokensResponseData, error: tokensError } =
                        await dataClient.query<SubgraphResponse<TokenSubgraph[]>>({
                            query: FETCH_TOKENS_BY_IDS,
                            variables: { tokenIds: tokenIdsArray },
                        });
                    if (tokensError) throw new Error(`Fetch tokens error: ${tokensError.name} ${tokensError.message}`);
                    const fetchedTokensData = tokensResponseData?.tokens || [];
                    fetchedTokensData.forEach(t => tokenMap.set(t.id, t));
                } catch (e) {
                    console.warn("Failed to batch fetch tokens:", e);
                }
            }

            if (allPoolIdsForGeneralBatching.size > 0) {
                const poolIdsArray = Array.from(allPoolIdsForGeneralBatching);
                try {
                    const { data: { pools: fetchedPoolsData }, error: poolsError } =
                        await dataClient.query<SubgraphResponse<PoolSubgraph[]>>({
                            query: FETCH_POOLS_BY_IDS,
                            variables: { poolIds: poolIdsArray },
                        });
                    if (poolsError) throw new Error(`Fetch pools error: ${poolsError.name} ${poolsError.message}`);
                    fetchedPoolsData.forEach(p => poolMap.set(p.id, p));
                } catch (e) {
                    console.warn("Failed to batch fetch pools:", e);
                }
            }

            // Step 4: Batch fetch farm availability data
            const limitFarmAvailabilityMap = new Map<string, boolean>();
            if (poolIdsForLimitAvailabilityCheck.size > 0) {
                const poolIdsToCheck = Array.from(poolIdsForLimitAvailabilityCheck);
                try {
                    const { data: { limitFarmings: availableLimitFarms }, error: availableFarmError } = await farmingClient.query({
                        query: FETCH_FINITE_FARM_FROM_POOL,
                        variables: { pools: poolIdsToCheck, currentTime: Math.round(Date.now() / 1000) },
                        fetchPolicy: "network-only",
                    });
                    if (availableFarmError) throw availableFarmError;
                    poolIdsToCheck.forEach(poolId => {
                        const hasUpcomingFarm = availableLimitFarms.some((farm: any) => farm.pool.id === poolId && Math.round(Date.now() / 1000) < farm.startTime);
                        limitFarmAvailabilityMap.set(poolId, hasUpcomingFarm);
                    });
                } catch (e) {
                    console.warn(`Failed to batch check limit farm availability for pools:`, e);
                }
            }

            const eternalFarmAvailabilityMap = new Map<string, boolean>();
            if (poolIdsForEternalAvailabilityCheck.size > 0) {
                const poolIdsToCheck = Array.from(poolIdsForEternalAvailabilityCheck);
                try {
                    const { data: { eternalFarmings: availableEternalFarms }, error: availableEternalFarmError } = await farmingClient.query({
                        query: FETCH_ETERNAL_FARM_FROM_POOL,
                        variables: { pools: poolIdsToCheck, currentTime: Math.round(Date.now() / 1000) },
                        fetchPolicy: "network-only",
                    });
                    if (availableEternalFarmError) throw availableEternalFarmError;
                    poolIdsToCheck.forEach(poolId => {
                        const hasActiveFarm = availableEternalFarms.some((farm: any) => farm.pool.id === poolId && (+farm.rewardRate || +farm.bonusRewardRate) && !farm.isDetached);
                        eternalFarmAvailabilityMap.set(poolId, hasActiveFarm);
                    });
                } catch (e) {
                    console.warn(`Failed to batch check eternal farm availability for pools:`, e);
                }
            }

            // Step 5: Enrich positions with subgraph data (no awaits)
            const positionsWithTvl = await Promise.all(
                positionsTransferred.map(async (position) => {
                    let poolObj = position.pool;
                    if (typeof poolObj === 'string') {
                        const mappedPool = poolMap.get(poolObj);
                        if (mappedPool) poolObj = mappedPool;
                    }
                    const limitFarm = position.limitFarming ? limitFarmDetailsMap.get(
                        typeof position.limitFarming === 'string'
                            ? position.limitFarming
                            : (position.limitFarming as any).id
                    ) : undefined;
                    const eternalFarm = position.eternalFarming ? eternalFarmDetailsMap.get(
                        typeof position.eternalFarming === 'string'
                            ? position.eternalFarming
                            : (position.eternalFarming as any).id
                    ) : undefined;
                    let limitAvailable = false;
                    let eternalAvailable = false;
                    if (!position.limitFarming && poolObj && typeof poolObj === 'object' && poolObj.id) {
                        limitAvailable = limitFarmAvailabilityMap.get(poolObj.id) || false;
                    } else if (!position.limitFarming && typeof poolObj === 'string') {
                        limitAvailable = limitFarmAvailabilityMap.get(poolObj) || false;
                    }
                    if (!position.eternalFarming && poolObj && typeof poolObj === 'object' && poolObj.id) {
                        eternalAvailable = eternalFarmAvailabilityMap.get(poolObj.id) || false;
                    } else if (!position.eternalFarming && typeof poolObj === 'string') {
                        eternalAvailable = eternalFarmAvailabilityMap.get(poolObj) || false;
                    }
                    return {
                        ...position,
                        pool: poolObj,
                        limitFarm,
                        eternalFarm,
                        limitAvailable,
                        eternalAvailable,
                    };
                })
            );

            // Create targeted refresh functions for contract calls
            const refreshTokensAndPools = async () => {
                console.log(`[DEBUG] 🔄 Refreshing tokens and pools data...`);

                try {
                    // Re-fetch the most recent pool and token data
                    if (allPoolIdsForGeneralBatching.size > 0) {
                        const {
                            data: { pools: refreshedPools },
                        } = await dataClient.query<SubgraphResponse<PoolSubgraph[]>>({
                            query: FETCH_POOLS_BY_IDS,
                            variables: { poolIds: Array.from(allPoolIdsForGeneralBatching) },
                            fetchPolicy: "network-only", // Force fresh data
                        });

                        // Update the maps with fresh data
                        refreshedPools.forEach(pool => poolMap.set(pool.id, pool));
                        console.log(`[DEBUG] ✅ Refreshed ${refreshedPools.length} pools`);
                    }

                    if (allTokenIdsForBatching.size > 0) {
                        const {
                            data: { tokens: refreshedTokens },
                        } = await dataClient.query<SubgraphResponse<TokenSubgraph[]>>({
                            query: FETCH_TOKENS_BY_IDS,
                            variables: { tokenIds: Array.from(allTokenIdsForBatching) },
                            fetchPolicy: "network-only", // Force fresh data
                        });

                        // Update the maps with fresh data
                        refreshedTokens.forEach(token => tokenMap.set(token.id, token));
                        console.log(`[DEBUG] ✅ Refreshed ${refreshedTokens.length} tokens`);
                    }
                } catch (refreshError) {
                    console.warn(`[DEBUG] ⚠️ Failed to refresh data:`, refreshError);
                    throw refreshError; // Re-throw so retry knows refresh failed
                }
            };

            // 2. Prepare all on-chain contract calls in parallel
            const nftPromises = positionsWithTvl.map(pos =>
                retryContractCallWithRefresh(() =>
                    new Contract(NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId], NON_FUN_POS_MAN, provider).positions.staticCall(+pos.id),
                    refreshTokensAndPools // Refresh data on 2nd attempt
                ).catch(e => ({ error: e }))
            );
            const limitRewardPromises = positionsWithTvl.map(pos => {
                if (pos.limitFarm) {
                    const { rewardToken, bonusRewardToken, pool, startTime, endTime } = pos.limitFarm;
                    // Extract pool ID if pool is an object
                    const limitPoolId = typeof pool === 'object' && pool && 'id' in pool ? (pool as any).id : pool;
                    console.log(`[DEBUG] Making limit farm contract call for position ${pos.id}:`, {
                        account,
                        rewardToken,
                        bonusRewardToken,
                        pool: limitPoolId,
                        startTime: +startTime,
                        endTime: +endTime
                    });
                    return retryContractCallWithRefresh(() =>
                        new Contract(FINITE_FARMING[chainId], FINITE_FARMING_ABI, provider).getRewardInfo.staticCall(
                            account,
                            rewardToken,
                            bonusRewardToken,
                            limitPoolId,
                            +startTime,
                            +endTime
                        ),
                        refreshTokensAndPools // Refresh data on 2nd attempt
                    ).catch(e => {
                        console.error(`[DEBUG] Limit farm contract call failed for position ${pos.id}:`, e);
                        return { error: e };
                    });
                }
                return null;
            });
            const eternalRewardPromises = positionsWithTvl.map(async (pos) => {
                if (pos.eternalFarm) {
                    const { rewardToken, bonusRewardToken, pool, startTime, endTime } = pos.eternalFarm;
                    // Extract pool ID if pool is an object
                    const eternalPoolId = typeof pool === 'object' && pool && 'id' in pool ? (pool as any).id : pool;
                    console.log(`[DEBUG] Making eternal farm contract call for position ${pos.id}:`, {
                        rewardParams: [rewardToken, bonusRewardToken, eternalPoolId, startTime, endTime],
                        positionId: +pos.id
                    });

                    const result = await retryContractCallWithRefresh(
                        () => {
                            // Add parameter validation logging
                            console.log(`[DEBUG] 🔍 Contract call parameters for position ${pos.id}:`, {
                                contractAddress: FARMING_CENTER[chainId],
                                method: 'collectRewards',
                                rewardToken,
                                bonusRewardToken,
                                poolId: eternalPoolId,
                                startTime,
                                endTime,
                                positionId: +pos.id,
                                farmingExists: !!pos.eternalFarm,
                                parametersValid: {
                                    rewardTokenNotZero: rewardToken !== '0x0000000000000000000000000000000000000000',
                                    bonusRewardIsZero: bonusRewardToken === '0x0000000000000000000000000000000000000000',
                                    poolIdExists: !!eternalPoolId,
                                    timesValid: startTime && endTime && +startTime < +endTime,
                                    positionIdValid: +pos.id > 0
                                }
                            });

                            return new Contract(FARMING_CENTER[chainId], FARMING_CENTER_ABI, provider).collectRewards.staticCall(
                                [rewardToken, bonusRewardToken, eternalPoolId, startTime, endTime],
                                +pos.id
                            );
                        },
                        refreshTokensAndPools // Refresh data on 2nd attempt
                    );

                    // Check if retry wrapper returned an error
                    if (result && typeof result === 'object' && 'error' in result) {
                        console.error(`[DEBUG] All eternal farm contract call attempts failed for position ${pos.id}:`, result.error);
                        return result; // Return the error result
                    }

                    // Validate the successful result structure
                    if (result && (result.reward !== undefined || result.bonusReward !== undefined)) {
                        console.log(`[DEBUG] Eternal farm contract call succeeded for position ${pos.id}`);
                        return result;
                    } else {
                        console.warn(`[DEBUG] Invalid reward result structure for position ${pos.id}:`, result);
                        return { error: new Error(`Invalid reward result structure`) };
                    }
                }
                return null;
            });

            // 3. Await all contract calls in parallel
            const [nftResults, limitRewardResults, eternalRewardResults] = await Promise.all([
                Promise.all(nftPromises),
                Promise.all(limitRewardPromises),
                Promise.all(eternalRewardPromises),
            ]);

            // 4. Merge results back into positions
            const finalPositions = positionsWithTvl.map((pos, i) => {
                // Use a local object to accumulate warnings/errors
                const extra: any = {};

                // Debug the position and its pool data structure
                console.log(`[DEBUG] Processing position ${pos.id}:`, {
                    positionId: pos.id,
                    poolData: pos.pool,
                    poolType: typeof pos.pool,
                    poolId: typeof pos.pool === 'object' ? pos.pool?.id : pos.pool,
                    hasLimitFarm: !!pos.limitFarm,
                    hasEternalFarm: !!pos.eternalFarm,
                    limitFarmPool: pos.limitFarm?.pool,
                    eternalFarmPool: pos.eternalFarm?.pool
                });

                // Process NFT data
                const nftResult = nftResults[i];
                if (nftResult && !nftResult.error) {
                    console.log(`[DEBUG] NFT data for position ${pos.id}:`, {
                        token0Address: nftResult.token0,
                        token1Address: nftResult.token1,
                        liquidity: nftResult.liquidity.toString()
                    });
                    Object.assign(extra, {
                        token0: nftResult.token0,
                        token1: nftResult.token1,
                        liquidity: nftResult.liquidity.toString(),
                        tickLower: Number(nftResult.tickLower),
                        tickUpper: Number(nftResult.tickUpper),
                        fee: nftResult.fee,
                    });
                } else {
                    extra.nftError = nftResult?.error || 'Failed to fetch NFT data';
                    console.warn(`[DEBUG] NFT error for position ${pos.id}:`, extra.nftError);
                }

                // Limit farming rewards
                if (pos.limitFarm) {
                    const rewardInfo = limitRewardResults[i];
                    console.log(`[DEBUG] Limit Farm Rewards for position ${pos.id}:`, {
                        rewardInfo,
                        hasError: rewardInfo?.error,
                        errorMessage: rewardInfo?.error?.message
                    });

                    if (rewardInfo && !rewardInfo.error) {
                        extra.limitEarned = rewardInfo.reward ? formatUnits(BigInt(rewardInfo.reward), 18) : "0";
                        extra.limitBonusEarned = rewardInfo.bonusReward ? formatUnits(BigInt(rewardInfo.bonusReward), 18) : "0";
                        console.log(`[DEBUG] Calculated limit earned for position ${pos.id}: ${extra.limitEarned}, bonus: ${extra.limitBonusEarned}`);
                    } else {
                        extra.limitEarned = "0";
                        extra.limitBonusEarned = "0";
                        extra.limitRewardError = rewardInfo?.error || 'Failed to fetch limit rewards';
                        console.warn(`[DEBUG] Limit reward error for position ${pos.id}:`, extra.limitRewardError);
                    }
                }

                // Eternal farming rewards  
                if (pos.eternalFarm) {
                    const rewardInfo = eternalRewardResults[i];

                    console.log(`[DEBUG] Eternal Farm Rewards for position ${pos.id}:`, {
                        rewardInfo,
                        hasError: rewardInfo?.error,
                        errorMessage: rewardInfo?.error?.message,
                        reward: rewardInfo?.reward,
                        bonusReward: rewardInfo?.bonusReward,
                    });

                    const _rewardToken = tokenMap.get(pos.eternalFarm.rewardToken);
                    const _bonusRewardToken = tokenMap.get(pos.eternalFarm.bonusRewardToken);
                    const _multiplierToken = tokenMap.get(pos.eternalFarm.multiplierToken);
                    const _pool = poolMap.get(typeof pos.eternalFarm.pool === 'object' ? pos.eternalFarm.pool.id : pos.eternalFarm.pool);

                    // Debug token resolution for eternal farming
                    console.log(`[DEBUG] Eternal Farm Token Resolution for position ${pos.id}:`, {
                        rewardTokenAddress: pos.eternalFarm.rewardToken,
                        rewardTokenFound: !!_rewardToken,
                        rewardTokenSymbol: _rewardToken?.symbol,
                        rewardTokenDecimals: _rewardToken?.decimals,
                        bonusRewardTokenAddress: pos.eternalFarm.bonusRewardToken,
                        bonusRewardTokenFound: !!_bonusRewardToken,
                        bonusRewardTokenSymbol: _bonusRewardToken?.symbol,
                        bonusRewardTokenDecimals: _bonusRewardToken?.decimals,
                        poolId: typeof pos.eternalFarm.pool === 'object' ? pos.eternalFarm.pool.id : pos.eternalFarm.pool,
                        poolFound: !!_pool,
                        poolToken0: _pool?.token0?.symbol,
                        poolToken1: _pool?.token1?.symbol,
                        tokenMapSize: tokenMap.size,
                        poolMapSize: poolMap.size
                    });

                    if (_rewardToken && _bonusRewardToken && _pool) {
                        // Validate token data before using it
                        const isRewardTokenValid = isValidToken(_rewardToken);
                        const isBonusTokenValid = isValidToken(_bonusRewardToken) || _bonusRewardToken.id === '0x0000000000000000000000000000000000000000';

                        if (!isRewardTokenValid) {
                            console.error(`[DEBUG] Invalid reward token data for position ${pos.id}:`, _rewardToken);
                        }
                        if (!isBonusTokenValid && _bonusRewardToken.id !== '0x0000000000000000000000000000000000000000') {
                            console.error(`[DEBUG] Invalid bonus reward token data for position ${pos.id}:`, _bonusRewardToken);
                        }

                        // Calculate rewards with more robust error handling and state protection
                        let eternalEarned = "0";
                        let eternalBonusEarned = "0";
                        let hasValidRewardData = false;

                        try {
                            if (rewardInfo && !rewardInfo.error && rewardInfo.reward && isRewardTokenValid) {
                                const rewardAmount = BigInt(rewardInfo.reward);
                                const decimals = Number(_rewardToken.decimals);
                                if (rewardAmount > 0 && decimals >= 0) {
                                    eternalEarned = formatUnits(rewardAmount, decimals);
                                    hasValidRewardData = true;
                                    console.log(`[DEBUG] ✅ Calculated eternal earned for position ${pos.id}: ${eternalEarned}`);
                                }
                            } else if (rewardInfo && rewardInfo.error) {
                                console.warn(`[DEBUG] ⚠️ Reward info has error for position ${pos.id}:`, rewardInfo.error);
                            } else if (!isRewardTokenValid) {
                                console.warn(`[DEBUG] ⚠️ Skipping reward calculation due to invalid reward token for position ${pos.id}`);
                            }
                        } catch (err) {
                            console.error(`[DEBUG] ❌ Error formatting eternal reward for position ${pos.id}:`, err);
                            eternalEarned = "0";
                        }

                        // Bonus reward handling - simplified and less noisy
                        try {
                            if (_bonusRewardToken.id === '0x0000000000000000000000000000000000000000') {
                                // Zero address bonus token is normal, just set to 0 without logging
                                eternalBonusEarned = "0";
                            } else if (rewardInfo && !rewardInfo.error && rewardInfo.bonusReward && isBonusTokenValid) {
                                const bonusAmount = BigInt(rewardInfo.bonusReward);
                                const decimals = Number(_bonusRewardToken.decimals);
                                if (bonusAmount > 0 && decimals >= 0) {
                                    eternalBonusEarned = formatUnits(bonusAmount, decimals);
                                    console.log(`[DEBUG] Calculated eternal bonus earned for position ${pos.id}: ${eternalBonusEarned}`);
                                }
                            } else if (rewardInfo && rewardInfo.error) {
                                // Only log bonus reward errors if the bonus token is not zero address
                                if (_bonusRewardToken.id !== '0x0000000000000000000000000000000000000000') {
                                    console.warn(`[DEBUG] Bonus reward info has error for position ${pos.id}:`, rewardInfo.error);
                                }
                            }
                        } catch (err) {
                            console.error(`[DEBUG] Error formatting eternal bonus reward for position ${pos.id}:`, err);
                            eternalBonusEarned = "0";
                        }

                        Object.assign(extra, {
                            pool: _pool,
                            eternalRewardToken: _rewardToken,
                            eternalBonusRewardToken: _bonusRewardToken,
                            eternalStartTime: pos.eternalFarm.startTime,
                            eternalEndTime: pos.eternalFarm.endTime,
                            multiplierToken: pos.multiplierToken || _multiplierToken,
                            eternalTier1Multiplier: pos.eternalFarm.tier1Multiplier,
                            eternalTier2Multiplier: pos.eternalFarm.tier2Multiplier,
                            eternalTier3Multiplier: pos.eternalFarm.tier3Multiplier,
                            eternalTokenAmountForTier1: pos.eternalFarm.tokenAmountForTier1,
                            eternalTokenAmountForTier2: pos.eternalFarm.tokenAmountForTier2,
                            eternalTokenAmountForTier3: pos.eternalFarm.tokenAmountForTier3,
                            // Only update rewards if we have valid data or no existing data
                            eternalEarned: hasValidRewardData ? eternalEarned : (pos.eternalEarned && parseFloat(String(pos.eternalEarned)) > 0 ? String(pos.eternalEarned) : eternalEarned),
                            eternalBonusEarned: eternalBonusEarned,
                            // Add metadata about the reward calculation
                            rewardDataSource: hasValidRewardData ? 'fresh_contract_call' : (pos.eternalEarned && parseFloat(String(pos.eternalEarned)) > 0 ? 'preserved_existing' : 'failed_calculation')
                        });

                        // Log reward data handling for debugging race conditions
                        if (hasValidRewardData) {
                            console.log(`[DEBUG] 🆕 Using fresh reward data for position ${pos.id}: ${eternalEarned}`);
                        } else if (pos.eternalEarned && parseFloat(String(pos.eternalEarned)) > 0) {
                            console.log(`[DEBUG] 🔒 Preserving existing reward data for position ${pos.id}: ${pos.eternalEarned} (avoiding race condition)`);
                        } else {
                            console.log(`[DEBUG] ⚪ No valid reward data for position ${pos.id}, using zero`);
                        }
                    } else {
                        extra.eternalFarmError = 'Missing token or pool data';
                        console.warn(`[DEBUG] Eternal farm error for position ${pos.id}: Missing token or pool data`, {
                            rewardTokenMissing: !_rewardToken,
                            bonusRewardTokenMissing: !_bonusRewardToken,
                            poolMissing: !_pool
                        });
                    }
                }

                // Final pool check with detailed debugging
                if (typeof pos.pool === 'object' && pos.pool !== null) {
                    if (!pos.pool.token0 || !pos.pool.token1) {
                        extra.poolWarning = `Resolved pool for position ${pos.id} (ID: ${pos.pool.id}) is missing token0/token1 details after all processing.`;
                        console.warn(`[DEBUG] Pool missing tokens for position ${pos.id}:`, {
                            poolId: pos.pool.id,
                            hasToken0: !!pos.pool.token0,
                            hasToken1: !!pos.pool.token1,
                            token0Data: pos.pool.token0,
                            token1Data: pos.pool.token1
                        });
                    }
                } else if (typeof pos.pool === 'string') {
                    extra.poolWarning = `Pool for position ${pos.id} remained a string ID: ${pos.pool}. This position might be incomplete.`;
                    console.warn(`[DEBUG] Pool still string for position ${pos.id}:`, pos.pool);
                }

                return { ...pos, ...extra };
            });

            // Filter out positions with incomplete pool data to prevent UI crashes
            const validPositions = finalPositions.filter(position => {
                // Check if position has valid pool data
                const hasValidPool = position.pool &&
                    typeof position.pool === 'object' &&
                    position.pool.token0 &&
                    position.pool.token1 &&
                    position.pool.token0.symbol &&
                    position.pool.token1.symbol;

                if (!hasValidPool) {
                    console.warn(`[DEBUG] Filtering out position ${position.id} due to incomplete pool data:`, {
                        poolExists: !!position.pool,
                        poolType: typeof position.pool,
                        hasToken0: !!(position.pool as any)?.token0,
                        hasToken1: !!(position.pool as any)?.token1,
                        token0Symbol: (position.pool as any)?.token0?.symbol,
                        token1Symbol: (position.pool as any)?.token1?.symbol,
                        poolWarning: position.poolWarning,
                        nftError: position.nftError,
                        eternalFarmError: position.eternalFarmError,
                        limitFarmError: position.limitFarmError
                    });
                    return false;
                }

                return true;
            });

            console.log(`[DEBUG] Position filtering results: ${finalPositions.length} total → ${validPositions.length} valid (filtered out ${finalPositions.length - validPositions.length})`);

            setTransferredPositions(validPositions);

            // Log retry statistics
            const totalContractCalls = finalPositions.length * 3; // NFT + limit + eternal per position
            const failedCalls = finalPositions.reduce((count, pos) => {
                return count +
                    (pos.nftError ? 1 : 0) +
                    (pos.limitRewardError ? 1 : 0) +
                    (pos.eternalFarmError ? 1 : 0);
            }, 0);

            console.log(`[DEBUG] 📊 Contract Call Summary: ${totalContractCalls - failedCalls}/${totalContractCalls} successful, ${failedCalls} failed after retries`);
        } catch (err: any) {
            console.warn(`[DEBUG] fetchTransferredPositions failed:`, err);
            setTransferredPositions([]);
            setTransferredPositionsLoading(false);
            console.error("Error fetching transferred positions:", err.message || err);
        } finally {
            setTransferredPositionsLoading(false);
        }
    }

    async function fetchPositionsOnEternalFarming(reload?: boolean) {
        if (!chainId || !account) return;

        if (!provider) throw new Error("No provider");

        setPositionsEternalLoading(true);

        try {
            const {
                data: { deposits: eternalPositions },
                error,
            } = await farmingClient.query<SubgraphResponse<Position[]>>({
                query: POSITIONS_ON_ETERNAL_FARMING,
                fetchPolicy: reload ? "network-only" : "cache-first",
                variables: { account },
            });

            if (error) throw new Error(`${error.name} ${error.message}`);

            if (eternalPositions.length === 0) {
                setPositionsEternal([]);
                setPositionsEternalLoading(false);
                return;
            }

            const _positions: TickFarming[] = [];
            let m = 0;
            for (const position of eternalPositions) {
                console.log("count m", m)
                const nftContract = new Contract(NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId], NON_FUN_POS_MAN, provider);

                const positionDataFromContract = await nftContract.positions.staticCall(+position.id);

                const eternalFarmingId = typeof position.eternalFarming === 'string'
                    ? position.eternalFarming
                    : (position.eternalFarming as any).id;
                const { rewardToken, bonusRewardToken, pool, startTime, endTime } = await fetchEternalFarming(String(eternalFarmingId));

                const _pool = await fetchPool(pool.id);
                const _rewardToken = await fetchToken(rewardToken);
                const _bonusRewardToken = await fetchToken(bonusRewardToken);

                if (!_pool || !_rewardToken || !_bonusRewardToken) continue;

                const _position: TickFarming = {
                    ...position,
                    tickLower: Number(positionDataFromContract.tickLower),
                    tickUpper: Number(positionDataFromContract.tickUpper),
                    liquidity: positionDataFromContract.liquidity.toString(),
                    token0: positionDataFromContract.token0,
                    token1: positionDataFromContract.token1,
                    pool: _pool,
                    rewardToken: _rewardToken,
                    bonusRewardToken: _bonusRewardToken,
                    startTime,
                    endTime,
                };

                _positions.push(_position);
                m++;
            }

            setPositionsEternal(_positions);
        } catch (error: any) {
            throw new Error("Infinite farms loading" + error.code + error.message);
        }
    }

    async function fetchPositionsForPool(pool: PoolChartSubgraph, minRangeLength: string) {
        if (!chainId || !account) return;

        try {
            setPositionsForPoolLoading(true);

            const {
                data: { deposits: positionsTransferred },
                error: errorTransferred,
            } = await farmingClient.query<SubgraphResponse<Position[]>>({
                query: TRANSFERED_POSITIONS_FOR_POOL,
                fetchPolicy: "network-only",
                variables: { account, pool: pool.id, minRangeLength },
            });

            if (errorTransferred) throw new Error(`${errorTransferred.name} ${errorTransferred.message}`);

            const _positions: Position[] = [];

            let _position: Position;

            //Hack
            for (const position of positionsTransferred) {
                _position = { ...position, onFarmingCenter: position.onFarmingCenter };

                _positions.push(_position);
            }

            setPositionsForPool(_positions);
        } catch (err) {
            throw new Error("Positions for pools " + err);
        } finally {
            setPositionsForPoolLoading(false);
        }
    }

    async function fetchEternalFarms(reload = false) {
        if (!farmingClient) return;
        if (!dataClient) return;
        if (eternalFarms && !reload) return;

        setEternalFarmsLoading(true);

        try {
            const {
                data: { eternalFarmings: fetchedEternalEvents },
                error: eventsError,
            } = await farmingClient.query<SubgraphResponse<EternalFarming[]>>({
                query: INFINITE_EVENTS,
                variables: { endTime: Math.round(Date.now() / 1000) },
                fetchPolicy: reload ? "network-only" : "cache-first",
            });

            if (eventsError) throw new Error(`${eventsError.name} ${eventsError.message}`);

            if (!fetchedEternalEvents || fetchedEternalEvents.length === 0) {
                setEternalFarms([]);
                setEternalFarmsLoading(false);
                return;
            }

            // Collect all unique IDs from fetchedEternalEvents
            const poolIds = [...new Set(fetchedEternalEvents.map(farm => farm.pool.id))];
            const rewardTokenIds = [...new Set(fetchedEternalEvents.map(farm => farm.rewardToken))];
            const bonusRewardTokenIds = [...new Set(fetchedEternalEvents.map(farm => farm.bonusRewardToken))];
            const multiplierTokenIds = [...new Set(fetchedEternalEvents.map(farm => farm.multiplierToken))];

            const allTokenIds = [...new Set([...rewardTokenIds, ...bonusRewardTokenIds, ...multiplierTokenIds])].filter(id => id !== '0x0000000000000000000000000000000000000000');

            console.log('[fetchEternalFarms] Requesting Pool IDs:', JSON.stringify(poolIds));
            console.log('[fetchEternalFarms] Requesting Token IDs:', JSON.stringify(allTokenIds));

            // Fetch all pools and tokens in batch
            const {
                data: poolsResponseData,
                error: poolsError,
            } = await dataClient.query<SubgraphResponse<PoolSubgraph[]>>({
                query: FETCH_POOLS_BY_IDS,
                variables: { poolIds },
            });

            if (poolsError) throw new Error(`Fetch pools error: ${poolsError.name} ${poolsError.message}`);
            const fetchedPoolsData = poolsResponseData?.pools || [];
            console.log('[fetchEternalFarms] Fetched Pools Data Count:', fetchedPoolsData.length);
            console.log('[fetchEternalFarms] Fetched Pool IDs:', JSON.stringify(fetchedPoolsData.map(p => p.id)));

            const {
                data: tokensResponseData,
                error: tokensError,
            } = await dataClient.query<SubgraphResponse<TokenSubgraph[]>>({
                query: FETCH_TOKENS_BY_IDS,
                variables: { tokenIds: allTokenIds },
            });

            if (tokensError) throw new Error(`Fetch tokens error: ${tokensError.name} ${tokensError.message}`);
            const fetchedTokensData = tokensResponseData?.tokens || [];
            console.log('[fetchEternalFarms] Fetched Tokens Data Count (batch):', fetchedTokensData.length);
            console.log('[fetchEternalFarms] Fetched Token IDs (batch):', JSON.stringify(fetchedTokensData.map(t => t.id)));

            // Create maps for easy lookup during position processing
            const poolMap = new Map(fetchedPoolsData.map(p => [p.id, p]));
            const tokenMap = new Map(fetchedTokensData.map(t => [t.id, t]));

            // Debug the maps to see what's available
            console.log('[DEBUG] Token Map Contents:', {
                size: tokenMap.size,
                keys: Array.from(tokenMap.keys()),
                sampleEntries: Array.from(tokenMap.entries()).slice(0, 3).map(([key, token]) => ({
                    address: key,
                    symbol: (token as any).symbol,
                    decimals: (token as any).decimals,
                    name: (token as any).name
                }))
            });

            console.log('[DEBUG] Pool Map Contents:', {
                size: poolMap.size,
                keys: Array.from(poolMap.keys()),
                sampleEntries: Array.from(poolMap.entries()).slice(0, 3).map(([key, pool]) => ({
                    id: key,
                    token0Symbol: (pool as any).token0?.symbol,
                    token1Symbol: (pool as any).token1?.symbol,
                    token0Address: (pool as any).token0?.id,
                    token1Address: (pool as any).token1?.id
                }))
            });

            const aprs: Aprs = {};

            const _newEternalFarmings: FormattedEternalFarming[] = [];

            for (const farmEvent of fetchedEternalEvents) {
                const pool = poolMap.get(farmEvent.pool.id);
                const rewardToken = tokenMap.get(farmEvent.rewardToken);

                const bonusRewardTokenAddress = farmEvent.bonusRewardToken;
                const isBonusTokenZeroAddress = bonusRewardTokenAddress === "0x0000000000000000000000000000000000000000";
                const bonusRewardToken = tokenMap.get(bonusRewardTokenAddress); // Undefined if zero or not found

                const multiplierTokenAddress = farmEvent.multiplierToken;
                const isMultiplierTokenZeroAddress = multiplierTokenAddress === "0x0000000000000000000000000000000000000000";
                const multiplierToken = tokenMap.get(multiplierTokenAddress); // Undefined if zero or not found

                if (
                    !pool ||
                    !rewardToken ||
                    (!isBonusTokenZeroAddress && bonusRewardTokenAddress && !bonusRewardToken) || // Skip if non-zero bonus token address is given but token not found
                    (!isMultiplierTokenZeroAddress && multiplierTokenAddress && !multiplierToken)  // Skip if non-zero multiplier token address is given but token not found
                ) {
                    console.warn(
                        `[fetchEternalFarms] Skipping farm ID: ${farmEvent.id} due to missing or unresolved critical token data for a non-zero address.`,
                        `Pool: ${!!pool} (ID: ${farmEvent.pool.id})`,
                        `RewardToken: ${!!rewardToken} (ID: ${farmEvent.rewardToken})`,
                        `BonusRewardToken: ${!!bonusRewardToken} (Address: ${bonusRewardTokenAddress}, Is Zero: ${isBonusTokenZeroAddress})`,
                        `MultiplierToken: ${!!multiplierToken} (Address: ${multiplierTokenAddress}, Is Zero: ${isMultiplierTokenZeroAddress})`,
                        "Full farmEvent:", farmEvent
                    );
                    continue;
                }

                // At this point: pool and rewardToken are guaranteed.
                // bonusRewardToken (object) is TokenSubgraph | undefined. Same for multiplierToken.

                const _rewardRate = formatUnits(BigInt(farmEvent.rewardRate || '0'), Number(rewardToken.decimals));
                // Safely format bonus reward rate, defaulting to "0" if bonusRewardToken or its decimals are missing.
                const _bonusRewardRate = (bonusRewardToken && bonusRewardToken.decimals)
                    ? formatUnits(BigInt(farmEvent.bonusRewardRate || '0'), Number(bonusRewardToken.decimals))
                    : "0";

                const dailyRewardRate = Math.round(+_rewardRate * 86_400);
                const dailyBonusRewardRate = Math.round(+_bonusRewardRate * 86_400);

                const farmTvlResult = await fetchEternalFarmTVL();
                const tvl = typeof farmTvlResult === 'object' && farmTvlResult !== null && 'tvl' in farmTvlResult && typeof (farmTvlResult as any).tvl === 'number' ? (farmTvlResult as any).tvl : 0;

                _newEternalFarmings.push({
                    ...farmEvent,
                    rewardToken,
                    bonusRewardToken: bonusRewardToken, // Can be TokenSubgraph | undefined
                    pool,
                    multiplierToken: multiplierToken, // Can be TokenSubgraph | undefined
                    apr: aprs[farmEvent.id] ? aprs[farmEvent.id] : 0,
                    dailyRewardRate,
                    dailyBonusRewardRate,
                    tvl: tvl,
                    reward: formatUnits(BigInt(farmEvent.reward || '0'), Number(rewardToken.decimals)),
                    // Safely format bonus reward, defaulting to "0" if bonusRewardToken or its decimals are missing.
                    bonusReward: (bonusRewardToken && bonusRewardToken.decimals)
                        ? formatUnits(BigInt(farmEvent.bonusReward || '0'), Number(bonusRewardToken.decimals))
                        : "0",
                });
            }
            setEternalFarms(_newEternalFarmings);
        } catch (error: any) {
            console.error("Error fetching eternal farms:", error);
            setEternalFarms([]);
        } finally {
            setEternalFarmsLoading(false);
        }
    }

    return {
        ethPricesFecthed: !!ethPrices,
        fetchRewards: { rewardsResult, rewardsLoading, fetchRewardsFn: fetchRewards },
        fetchFutureEvents: {
            futureEvents,
            futureEventsLoading,
            fetchFutureEventsFn: fetchFutureEvents,
        },
        fetchAllEvents: { allEvents, allEventsLoading, fetchAllEventsFn: fetchAllEvents },
        fetchPositionsForPool: {
            positionsForPool,
            positionsForPoolLoading,
            fetchPositionsForPoolFn: fetchPositionsForPool,
        },
        fetchTransferredPositions: {
            transferredPositions,
            transferredPositionsLoading,
            fetchTransferredPositionsFn: fetchTransferredPositions,
        },
        fetchHasTransferredPositions: {
            hasTransferredPositions,
            hasTransferredPositionsLoading,
            fetchHasTransferredPositionsFn: fetchHasTransferredPositions,
        },
        fetchPositionsOnFarmer: {
            positionsOnFarmer,
            positionsOnFarmerLoading,
            fetchPositionsOnFarmerFn: fetchPositionsOnFarmer,
        },
        fetchEternalFarms: {
            eternalFarms,
            eternalFarmsLoading,
            fetchEternalFarmsFn: fetchEternalFarms,
        },
        fetchPositionsOnEternalFarmings: {
            positionsEternal,
            positionsEternalLoading,
            fetchPositionsOnEternalFarmingFn: fetchPositionsOnEternalFarming,
        },
    };
}

