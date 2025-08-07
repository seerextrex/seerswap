import { useCallback, useMemo, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { publicClientToProvider } from "../utils/ethersAdapters";
import { Contract, JsonRpcProvider } from "ethers";
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
import { formatUnits } from "ethers";
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

// Backup RPC endpoints for Gnosis chain
const BACKUP_RPC_ENDPOINTS = [
    "https://rpc.gnosis.gateway.fm",
    "https://gnosis-mainnet.public.blastapi.io",
    "https://gnosis-pokt.nodies.app"
];

// Generic function to execute contract calls with RPC fallbacks
async function executeWithRpcFallbacks<T>(
    primaryCall: () => Promise<T>,
    fallbackCallBuilder: (provider: JsonRpcProvider) => Promise<T>,
    context: { positionId: string | number, callType: string }
): Promise<T | { error: any, isBackupRpc?: boolean, rpcUsed?: string, allBackupsFailed?: boolean }> {
    try {
        // Try primary call first
        const result = await primaryCall();
        
        // Check if primary call returned an error
        if (result && typeof result === 'object' && 'error' in result) {
            throw result.error;
        }
        
        return result;
    } catch (primaryError) {
        console.error(`[DEBUG] Primary ${context.callType} call failed for position ${context.positionId}:`, primaryError);
        // console.log(`[DEBUG] Attempting fallback using backup RPCs for ${context.callType} position ${context.positionId}`);
        
        // Try backup RPCs
        for (const rpcUrl of BACKUP_RPC_ENDPOINTS) {
            try {
                // console.log(`[DEBUG] Trying backup RPC for ${context.callType}: ${rpcUrl}`);
                const backupProvider = new JsonRpcProvider(rpcUrl);
                const result = await fallbackCallBuilder(backupProvider);
                
                // console.log(`[DEBUG] Backup RPC successful for ${context.callType} position ${context.positionId} using ${rpcUrl}`);
                
                // Add metadata about backup RPC usage
                if (result && typeof result === 'object') {
                    return { ...result, isBackupRpc: true, rpcUsed: rpcUrl };
                }
                return result;
            } catch (backupError) {
                console.warn(`[DEBUG] Backup RPC ${rpcUrl} failed for ${context.callType} position ${context.positionId}:`, backupError);
                // Continue to next RPC
            }
        }
        
        // All backup RPCs failed
        console.error(`[DEBUG] All backup RPCs failed for ${context.callType} position ${context.positionId}`);
        return { error: primaryError, allBackupsFailed: true };
    }
}

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
                    // console.log(`[DEBUG] ✅ Contract call succeeded on attempt ${attempt}/${maxRetries} (retry successful!)`);
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
                            // console.log(`[DEBUG] 🔄 Refreshing underlying data before retry...`);
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

    // Commented out - currently unused but may be needed in future
    // async function fetchEternalFarmAPR() {
    //     const apiURL = AlgebraConfig.API.eternalFarmsAPR;
    //
    //     try {
    //         return await fetch(apiURL).then((v) => v.json());
    //     } catch (error: any) {
    //         return {};
    //     }
    // }

    async function getEvents(events: any[], farming = false) {
        // Prepare all promises for parallel execution
        const eventPromises = events.map(async (event) => {
            // Fetch all data for this event in parallel
            const [pool, rewardToken, bonusRewardToken, multiplierToken] = await Promise.all([
                fetchPool(event.pool),
                fetchToken(event.rewardToken, farming),
                fetchToken(event.bonusRewardToken, farming),
                fetchToken(event.multiplierToken, farming)
            ]);

            return {
                ...event,
                pool,
                rewardToken,
                bonusRewardToken,
                multiplierToken,
                reward: formatUnits(BigInt(event.reward), rewardToken.decimals),
                bonusReward: formatUnits(BigInt(event.bonusReward), bonusRewardToken.decimals),
            };
        });

        // Execute all event processing in parallel
        const _events = await Promise.all(eventPromises);
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
            throw new Error("Fetch farming " + err.message);
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

    /**
     * Fetches all transferred positions for the current account with enriched data
     * This is a complex orchestration function that:
     * 1. Fetches positions from the subgraph
     * 2. Collects and batch-fetches related data (farms, pools, tokens)
     * 3. Makes on-chain calls for NFT data and reward calculations
     * 4. Enriches positions with all collected data
     * 
     * @param reload - Force network fetch instead of cache
     */
    async function fetchTransferredPositions(reload?: boolean) {
        if (!chainId || !account) return;

        if (!provider) throw new Error("No provider");

        try {
            setTransferredPositionsLoading(true);

            // ========== PHASE 1: Fetch Base Position Data from Subgraph ==========
            // This gets all positions that have been transferred to the farming center
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

            // ========== PHASE 2: Collect Unique IDs for Batch Fetching ==========
            // We collect all unique IDs to minimize the number of queries
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

            // ========== PHASE 3: Fetch Farm Configurations ==========
            // Fetch detailed data for limit and eternal farms that positions are staked in
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

            // Batch fetch eternal farms using a single GraphQL query for efficiency
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

            // ========== PHASE 4: Batch Fetch Tokens and Pools ==========
            // These provide price data and pool parameters needed for value calculations
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

            // ========== PHASE 5: Check Farm Availability ==========
            // Determine if positions can be staked in new farms
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

            // ========== PHASE 6: Initial Position Enrichment ==========
            // Combine position data with fetched pool/farm data (no async calls here)
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

            // ========== PHASE 7: Setup Retry Logic for On-Chain Calls ==========
            // Create a refresh function that can re-fetch data if on-chain calls fail
            const refreshTokensAndPools = async () => {
                // console.log(`[DEBUG] 🔄 Refreshing tokens and pools data...`);

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
                        // console.log(`[DEBUG] ✅ Refreshed ${refreshedPools.length} pools`);
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
                        // console.log(`[DEBUG] ✅ Refreshed ${refreshedTokens.length} tokens`);
                    }
                } catch (refreshError) {
                    console.warn(`[DEBUG] ⚠️ Failed to refresh data:`, refreshError);
                    throw refreshError; // Re-throw so retry knows refresh failed
                }
            };

            // ========== PHASE 8: Prepare On-Chain Contract Calls ==========
            // These fetch NFT positions and calculate current rewards
            const nftPromises = positionsWithTvl.map(pos =>
                retryContractCallWithRefresh(() =>
                    new Contract(NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId], NON_FUN_POS_MAN, provider).positions.staticCall(+pos.id),
                    refreshTokensAndPools // Refresh data on 2nd attempt
                ).catch(e => ({ error: e }))
            );
            const limitRewardPromises = positionsWithTvl.map(async pos => {
                if (pos.limitFarm) {
                    const { rewardToken, bonusRewardToken, pool, startTime, endTime } = pos.limitFarm;
                    // Extract pool ID if pool is an object
                    const limitPoolId = typeof pool === 'object' && pool && 'id' in pool ? (pool as any).id : pool;
                    // Fetching limit farm rewards
                    
                    return executeWithRpcFallbacks(
                        // Primary call using retry mechanism
                        () => retryContractCallWithRefresh(() =>
                            new Contract(FINITE_FARMING[chainId], FINITE_FARMING_ABI, provider).getRewardInfo.staticCall(
                                account,
                                rewardToken,
                                bonusRewardToken,
                                limitPoolId,
                                +startTime,
                                +endTime
                            ),
                            refreshTokensAndPools
                        ),
                        // Fallback call builder
                        (backupProvider) => {
                            const limitFarmingContract = new Contract(
                                FINITE_FARMING[chainId],
                                FINITE_FARMING_ABI,
                                backupProvider
                            );
                            return limitFarmingContract.getRewardInfo.staticCall(
                                account,
                                rewardToken,
                                bonusRewardToken,
                                limitPoolId,
                                +startTime,
                                +endTime
                            ).then(result => ({
                                reward: result[0],
                                bonusReward: result[1]
                            }));
                        },
                        // Context for logging
                        { positionId: pos.id, callType: 'limit farming' }
                    );
                }
                return null;
            });
            const eternalRewardPromises = positionsWithTvl.map(async (pos) => {
                if (pos.eternalFarm) {
                    const { rewardToken, bonusRewardToken, pool, startTime, endTime } = pos.eternalFarm;
                    // Extract pool ID if pool is an object
                    const eternalPoolId = typeof pool === 'object' && pool && 'id' in pool ? (pool as any).id : pool;
                    // Fetching eternal farm rewards

                    const result = await executeWithRpcFallbacks(
                        // Primary call using retry mechanism
                        () => retryContractCallWithRefresh(
                            () => {
                                // Add parameter validation logging
                                // Validate parameters silently

                                return new Contract(FARMING_CENTER[chainId], FARMING_CENTER_ABI, provider).collectRewards.staticCall(
                                    [rewardToken, bonusRewardToken, eternalPoolId, startTime, endTime],
                                    +pos.id
                                );
                            },
                            refreshTokensAndPools
                        ),
                        // Fallback call builder
                        (backupProvider) => {
                            const farmingCenterContract = new Contract(
                                FARMING_CENTER[chainId],
                                FARMING_CENTER_ABI,
                                backupProvider
                            );
                            return farmingCenterContract.collectRewards.staticCall(
                                [rewardToken, bonusRewardToken, eternalPoolId, startTime, endTime],
                                +pos.id
                            ).then(backupResult => ({
                                reward: backupResult.reward || backupResult[0],
                                bonusReward: backupResult.bonusReward || backupResult[1]
                            }));
                        },
                        // Context for logging
                        { positionId: pos.id, callType: 'eternal farming' }
                    );

                    // Validate the successful result structure
                    if (result && !result.error && (result.reward !== undefined || result.bonusReward !== undefined)) {
                        // console.log(`[DEBUG] Eternal farm contract call succeeded for position ${pos.id}`);
                        return result;
                    } else if (result && result.error) {
                        return result; // Return error result from executeWithRpcFallbacks
                    } else {
                        console.warn(`[DEBUG] Invalid reward result structure for position ${pos.id}:`, result);
                        return { error: new Error(`Invalid reward result structure`) };
                    }
                }
                return null;
            });

            // ========== PHASE 9: Execute Contract Calls with Rate Limiting ==========
            // Process calls in batches to avoid overwhelming RPC endpoints
            const BATCH_SIZE = 10;
            const BATCH_DELAY_MS = 200;
            
            // Helper to process promises in batches
            const processBatch = async <T>(promises: Promise<T>[], batchSize: number): Promise<T[]> => {
                const results: T[] = [];
                for (let i = 0; i < promises.length; i += batchSize) {
                    const batch = promises.slice(i, i + batchSize);
                    const batchResults = await Promise.all(batch);
                    results.push(...batchResults);
                    
                    // Add delay between batches to avoid rate limiting
                    if (i + batchSize < promises.length) {
                        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
                    }
                }
                return results;
            };
            
            // Process each type of call in batches
            const nftResults = await processBatch(nftPromises, BATCH_SIZE);
            const limitRewardResults = await processBatch(limitRewardPromises, BATCH_SIZE * 2); // Can handle more for rewards
            const eternalRewardResults = await processBatch(eternalRewardPromises, BATCH_SIZE * 2);

            // ========== PHASE 10: Final Position Assembly ==========
            // Merge all fetched data into final position objects
            const finalPositions = positionsWithTvl.map((pos, i) => {
                // Use a local object to accumulate warnings/errors
                const extra: any = {};

                // Process position data

                // Process NFT data - this provides the actual position parameters
                // (liquidity, ticks, tokens) from the NFT contract
                const nftResult = nftResults[i];
                if (nftResult && !nftResult.error) {
                    // Successfully retrieved NFT data - extract position parameters
                    Object.assign(extra, {
                        token0: nftResult.token0,
                        token1: nftResult.token1,
                        liquidity: nftResult.liquidity.toString(),
                        tickLower: Number(nftResult.tickLower),
                        tickUpper: Number(nftResult.tickUpper),
                        fee: nftResult.fee,
                    });
                } else {
                    // NFT data fetch failed - position won't have accurate parameters
                    extra.nftError = nftResult?.error || 'Failed to fetch NFT data';
                    console.warn(`[DEBUG] NFT error for position ${pos.id}:`, extra.nftError);
                }

                // Limit farming rewards
                if (pos.limitFarm) {
                    const rewardInfo = limitRewardResults[i];
                    // Process limit farm rewards

                    if (rewardInfo && !rewardInfo.error) {
                        extra.limitEarned = rewardInfo.reward ? formatUnits(BigInt(rewardInfo.reward), 18) : "0";
                        extra.limitBonusEarned = rewardInfo.bonusReward ? formatUnits(BigInt(rewardInfo.bonusReward), 18) : "0";
                        // console.log(`[DEBUG] Calculated limit earned for position ${pos.id}: ${extra.limitEarned}, bonus: ${extra.limitBonusEarned}`);
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

                    // Process eternal farm rewards

                    const _rewardToken = tokenMap.get(pos.eternalFarm.rewardToken);
                    const _bonusRewardToken = tokenMap.get(pos.eternalFarm.bonusRewardToken);
                    const _multiplierToken = tokenMap.get(pos.eternalFarm.multiplierToken);
                    const _pool = poolMap.get(typeof pos.eternalFarm.pool === 'object' ? pos.eternalFarm.pool.id : pos.eternalFarm.pool);

                    // Debug token resolution for eternal farming
                    // Resolve tokens for eternal farming rewards

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
                                    if (rewardInfo.isBackupRpc) {
                                        // console.log(`[DEBUG] ✅ Calculated eternal earned for position ${pos.id} using backup RPC (${rewardInfo.rpcUsed}): ${eternalEarned}`);
                                    } else {
                                        // console.log(`[DEBUG] ✅ Calculated eternal earned for position ${pos.id}: ${eternalEarned}`);
                                    }
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
                                    // console.log(`[DEBUG] Calculated eternal bonus earned for position ${pos.id}: ${eternalBonusEarned}`);
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
                            rewardDataSource: hasValidRewardData ? 
                                (rewardInfo?.isBackupRpc ? `backup_rpc_${rewardInfo.rpcUsed?.split('//')[1]?.split('/')[0]}` : 'fresh_contract_call') : 
                                (pos.eternalEarned && parseFloat(String(pos.eternalEarned)) > 0 ? 'preserved_existing' : 'failed_calculation'),
                            isBackupRpc: rewardInfo?.isBackupRpc || false,
                            backupRpcUsed: rewardInfo?.rpcUsed
                        });

                        // Log reward data handling for debugging race conditions
                        if (hasValidRewardData) {
                            // console.log(`[DEBUG] 🆕 Using fresh reward data for position ${pos.id}: ${eternalEarned}`);
                        } else if (pos.eternalEarned && parseFloat(String(pos.eternalEarned)) > 0) {
                            // console.log(`[DEBUG] 🔒 Preserving existing reward data for position ${pos.id}: ${pos.eternalEarned} (avoiding race condition)`);
                        } else {
                            // console.log(`[DEBUG] ⚪ No valid reward data for position ${pos.id}, using zero`);
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

            // console.log(`[DEBUG] Position filtering results: ${finalPositions.length} total → ${validPositions.length} valid (filtered out ${finalPositions.length - validPositions.length})`);

            setTransferredPositions(validPositions);

            // Log retry statistics
            const totalContractCalls = finalPositions.length * 3; // NFT + limit + eternal per position
            const failedCalls = finalPositions.reduce((count, pos) => {
                return count +
                    (pos.nftError ? 1 : 0) +
                    (pos.limitRewardError ? 1 : 0) +
                    (pos.eternalFarmError ? 1 : 0);
            }, 0);

            // console.log(`[DEBUG] 📊 Contract Call Summary: ${totalContractCalls - failedCalls}/${totalContractCalls} successful, ${failedCalls} failed after retries`);
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

            // Collect all unique IDs for batch fetching
            const eternalFarmingIds = new Set<string>();
            const poolIds = new Set<string>();
            const tokenIds = new Set<string>();
            
            eternalPositions.forEach(position => {
                const farmId = typeof position.eternalFarming === 'string'
                    ? position.eternalFarming
                    : (position.eternalFarming as any).id;
                eternalFarmingIds.add(farmId);
            });
            
            // Batch fetch all eternal farming data
            const eternalFarmDataPromises = Array.from(eternalFarmingIds).map(id => 
                fetchEternalFarming(String(id)).catch(() => null)
            );
            const eternalFarmData = await Promise.all(eternalFarmDataPromises);
            const eternalFarmMap = new Map();
            
            Array.from(eternalFarmingIds).forEach((id, index) => {
                const data = eternalFarmData[index];
                if (data) {
                    eternalFarmMap.set(id, data);
                    poolIds.add(data.pool.id);
                    tokenIds.add(data.rewardToken);
                    tokenIds.add(data.bonusRewardToken);
                }
            });
            
            // Batch fetch all pools and tokens
            const [pools, tokens] = await Promise.all([
                Promise.all(Array.from(poolIds).map(id => fetchPool(id).catch(() => null))),
                Promise.all(Array.from(tokenIds).map(id => fetchToken(id).catch(() => null)))
            ]);
            
            const poolMap = new Map();
            const tokenMap = new Map();
            
            Array.from(poolIds).forEach((id, index) => {
                if (pools[index]) poolMap.set(id, pools[index]);
            });
            
            Array.from(tokenIds).forEach((id, index) => {
                if (tokens[index]) tokenMap.set(id, tokens[index]);
            });
            
            // Create NFT contract once
            const nftContract = new Contract(NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId], NON_FUN_POS_MAN, provider);
            
            // Batch fetch all NFT positions
            const nftDataPromises = eternalPositions.map(position => 
                nftContract.positions.staticCall(+position.id).catch(() => null)
            );
            const nftData = await Promise.all(nftDataPromises);
            
            // Build positions array
            const _positions: TickFarming[] = [];
            
            eternalPositions.forEach((position, index) => {
                const positionDataFromContract = nftData[index];
                if (!positionDataFromContract) return;
                
                const eternalFarmingId = typeof position.eternalFarming === 'string'
                    ? position.eternalFarming
                    : (position.eternalFarming as any).id;
                    
                const farmData = eternalFarmMap.get(eternalFarmingId);
                if (!farmData) return;
                
                const _pool = poolMap.get(farmData.pool.id);
                const _rewardToken = tokenMap.get(farmData.rewardToken);
                const _bonusRewardToken = tokenMap.get(farmData.bonusRewardToken);
                
                if (!_pool || !_rewardToken || !_bonusRewardToken) return;
                
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
                    startTime: farmData.startTime,
                    endTime: farmData.endTime,
                };
                
                _positions.push(_position);
            });
            
            setPositionsEternal(_positions);
        } catch (error: any) {
            throw new Error("Farms loading" + error.code + error.message);
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

            // Maps are available for token and pool lookups

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

