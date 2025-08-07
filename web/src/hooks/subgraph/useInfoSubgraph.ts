import { useState, useMemo } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { useClients } from "./useClients";
import {
    CHART_FEE_LAST_ENTRY,
    CHART_FEE_LAST_NOT_EMPTY,
    CHART_FEE_POOL_DATA,
    CHART_POOL_DATA,
    CHART_POOL_LAST_ENTRY,
    CHART_POOL_LAST_NOT_EMPTY,
    FETCH_ETERNAL_FARM_FROM_POOL,
    POOLS_FROM_ADDRESSES_LATEST,
    POOLS_FROM_ADDRESSES_HISTORICAL,
    TOKENS_FROM_ADDRESSES_LATEST,
    TOKENS_FROM_ADDRESSES_HISTORICAL,
    TOP_POOLS,
    TOP_TOKENS,
    TOTAL_STATS_LATEST,
    TOTAL_STATS_HISTORICAL,
} from "utils/graphql-queries";
import { useBlocksFromTimestamps } from "../blocks";
import { useEthPrices } from "../useEthPrices";
import { useDeltaTimestamps } from "utils/queries";
import { formatTokenName, formatTokenSymbol, get2DayChange, getPercentChange } from "utils/info";
import {
    FactorySubgraph,
    FeeSubgraph,
    FormattedChartPool,
    FormattedFee,
    FormattedPool,
    FormattedToken,
    FormattedTotalStats,
    HistoryStakingSubgraph,
    LastPoolSubgraph,
    PoolAddressSubgraph,
    PoolSubgraph,
    PriceRangeChart,
    StakeSubgraph,
    SubgraphResponse,
    SubgraphResponseStaking,
    TokenAddressSubgraph,
    TokenInSubgraph,
    TotalStatSubgraph,
    EternalFarmingByPool,
} from "../../models/interfaces";
import { fetchEternalFarmAPR, fetchMerklFarmAPR, fetchPoolsAPR } from "utils/api";
import { farmingClient } from "apollo/client";

import AlgebraConfig from "algebra.config";
import { getAddress } from "ethers";

// Define block offset constants
const GNOSIS_AVG_BLOCKS_PER_24H = 16589;
const GNOSIS_AVG_BLOCKS_PER_48H = GNOSIS_AVG_BLOCKS_PER_24H * 2;
const GNOSIS_AVG_BLOCKS_PER_WEEK = GNOSIS_AVG_BLOCKS_PER_24H * 7;

function parsePoolsData(tokenData: PoolSubgraph[] | string) {
    if (typeof tokenData === "string") return {};
    return tokenData
        ? tokenData.reduce((accum: { [address: string]: PoolSubgraph }, poolData) => {
            accum[poolData.id] = poolData;
            return accum;
        }, {})
        : {};
}

function parseTokensData(tokenData: TokenInSubgraph[] | string) {
    if (typeof tokenData === "string") return {};
    return tokenData
        ? tokenData.reduce((accum: { [address: string]: TokenInSubgraph }, tokenData) => {
            accum[tokenData.id] = tokenData;
            return accum;
        }, {})
        : {};
}

// Type for the raw GraphQL response where pool is an object with id
interface EternalFarmingByPoolRaw {
    bonusReward: string
    bonusRewardRate: string
    bonusRewardToken: string
    endTime: string
    id: string
    isDetached: boolean
    pool: {
        id: string
    }
    reward: string
    rewardRate: string
    rewardToken: string
    startTime: string
}

export function useInfoSubgraph() {
    const { address: account } = useAccount();
    const { dataClient, farmingClient } = useClients();
    const publicClient = usePublicClient();
    const [t24, t48, tWeek] = useDeltaTimestamps();

    const timestamps = useMemo(() => [t24, t48, tWeek], [t24, t48, tWeek]);
    const { blocks, error: blockError } = useBlocksFromTimestamps(timestamps);
    const [block24, block48, blockWeek] = blocks?.sort((a, b) => +b.timestamp - +a.timestamp) ?? [];
    // console.log("[useInfoSubgraph] Initial blocks from useBlocksFromTimestamps (for ethPrices). block24:", block24);

    const ethPrices = useEthPrices();

    const [poolsResult, setPools] = useState<string | null | FormattedPool[]>(null);
    const [poolsLoading, setPoolsLoading] = useState<boolean>(false);

    const [tokensResult, setTokens] = useState<string | null | FormattedToken[]>(null);
    const [tokensLoading, setTokensLoading] = useState<boolean>(false);

    const [feesResult, setFees] = useState<null | string | FormattedFee>(null);
    const [feesLoading, setFeesLoading] = useState<boolean>(false);

    const [chartPoolData, setChartPoolData] = useState<null | string | FormattedChartPool>(null);
    const [chartPoolDataLoading, setChartPoolDataLoading] = useState<boolean>(false);

    const [totalStats, setTotalStats] = useState<null | string | FormattedTotalStats>(null);
    const [totalStatsLoading, setTotalStatsLoading] = useState<boolean>(true);

    const [stakesResult, setStakes] = useState<null | string | SubgraphResponseStaking<FactorySubgraph[], StakeSubgraph[]>>(null);
    const [stakesLoading, setStakesLoading] = useState<boolean>(false);

    const [stakeHistoriesResult, setHistories] = useState<null | HistoryStakingSubgraph[] | string>(null);
    const [historiesLoading, setHistoriesLoading] = useState<boolean>(false);

    const [positionsRange, setPositionsRange] = useState<{ closed: PriceRangeChart | null; opened: PriceRangeChart | null }>({ closed: null, opened: null });

    // const addressForCheck = AlgebraConfig.DEFAULT_TOKEN_LIST.filterForScamTokens.tokensForCheck;

    // const possibleNames = AlgebraConfig.DEFAULT_TOKEN_LIST.filterForScamTokens.possibleFakeNames;

    async function fetchInfoPools() {
        // ethPrices depends on 'blocks', publicClient is for latest block.
        if (!ethPrices || !publicClient) {
            setPoolsLoading(false);
            console.warn("[useInfoSubgraph][fetchInfoPools] Aborting: Core dependencies (ethPrices or publicClient) are not available yet.");
            setPools(null);
            return;
        }

        setPoolsLoading(true);
        let latestBlockNumber: number;
        let queryHistoricalBlock24H: number | undefined = undefined;
        let queryHistoricalBlock48H: number | undefined = undefined;
        let queryHistoricalBlockWeek: number | undefined = undefined;

        try {
            const latestBlockBigInt = await publicClient.getBlockNumber();
            latestBlockNumber = Number(latestBlockBigInt);

            if (isNaN(latestBlockNumber)) {
                console.error("[useInfoSubgraph][fetchInfoPools] Aborting: Failed to parse latestBlockNumber.", latestBlockBigInt);
                setPools("Failed due to latest block number parsing");
                setPoolsLoading(false);
                return;
            }

            queryHistoricalBlock24H = latestBlockNumber - GNOSIS_AVG_BLOCKS_PER_24H;
            queryHistoricalBlock48H = latestBlockNumber - GNOSIS_AVG_BLOCKS_PER_48H;
            queryHistoricalBlockWeek = latestBlockNumber - GNOSIS_AVG_BLOCKS_PER_WEEK;

            if (queryHistoricalBlock24H <= 0 || queryHistoricalBlock48H <= 0 || queryHistoricalBlockWeek <= 0) {
                console.error("[useInfoSubgraph][fetchInfoPools] Aborting: One or more calculated historical block numbers are invalid (<=0).");
                setPools("Failed due to invalid historical block calculation");
                setPoolsLoading(false);
                return;
            }
            // console.log(`[useInfoSubgraph][fetchInfoPools] Latest block: ${latestBlockNumber}. Historical blocks: 24H=${queryHistoricalBlock24H}, 48H=${queryHistoricalBlock48H}, Week=${queryHistoricalBlockWeek}`);

        } catch (e) {
            console.error("[useInfoSubgraph][fetchInfoPools] Error fetching latest block number:", e);
            setPools("Failed to fetch latest block");
            setPoolsLoading(false);
            return;
        }

        try {
            const {
                data,
                error,
            } = await dataClient.query<SubgraphResponse<PoolAddressSubgraph[]>>({
                query: TOP_POOLS,
                fetchPolicy: "network-only",
            });

            if (error || !data || !data.pools) {
                console.error("Failed to fetch top pools or data.pools is undefined. Error:", error, "Data:", data);
                setPools(null);
                setPoolsLoading(false);
                return;
            }

            const topPools = data.pools;

            const _poolsAddresses = topPools.map((el) => el.id);
            console.log('[useInfoSubgraph] _poolsAddresses for POOLS_FROM_ADDRESSES:', _poolsAddresses);

            let rawPools: PoolSubgraph[] = [];

            if (_poolsAddresses.length > 0) {
                const poolsFromAddressesResult = await dataClient.query<SubgraphResponse<PoolSubgraph[]>>({
                    query: POOLS_FROM_ADDRESSES_LATEST,
                    variables: { pools: _poolsAddresses },
                    fetchPolicy: "network-only",
                });

                if (poolsFromAddressesResult.error || !poolsFromAddressesResult.data || !poolsFromAddressesResult.data.pools) {
                    console.error("Failed to fetch pool details from POOLS_FROM_ADDRESSES_LATEST. Error:", poolsFromAddressesResult.error, "Data:", poolsFromAddressesResult.data);
                    setPoolsLoading(false);
                    setPools(null);
                    return;
                }
                rawPools = poolsFromAddressesResult.data.pools;
            }

            const pools = rawPools.filter((pool) => {
                const { symbol: token0Symbol, name: token0Name, id: token0Id } = pool.token0;
                const { symbol: token1Symbol, name: token1Name, id: token1Id } = pool.token1;

                // if (token0Symbol.toUpperCase() in addressForCheck || possibleNames.some((el) => el.names.includes(token0Name))) {
                //     return token0Id.toLowerCase() === addressForCheck[token0Symbol.toUpperCase()];
                // }

                // if (token1Symbol.toUpperCase() in addressForCheck || possibleNames.some((el) => el.names.includes(token1Name))) {
                //     return token1Id.toLowerCase() === addressForCheck[token1Symbol.toUpperCase()];
                // }

                return true;
            });

            const poolsAddresses = pools.map((pool) => pool.id);

            // Use calculated historical block numbers
            const pools24 = await fetchPoolsByTime(queryHistoricalBlock24H, poolsAddresses);
            const pools48 = await fetchPoolsByTime(queryHistoricalBlock48H, poolsAddresses);
            const poolsWeek = await fetchPoolsByTime(queryHistoricalBlockWeek, poolsAddresses);

            // console.log("[useInfoSubgraph][fetchInfoPools] pools24 (historical data result):", pools24); // Verbose

            const parsedPools = parsePoolsData(pools);
            const parsedPools24 = parsePoolsData(pools24);
            // console.log("[useInfoSubgraph][fetchInfoPools] parsedPools24:", parsedPools24); // Verbose
            const parsedPools48 = parsePoolsData(pools48);
            const parsedPoolsWeek = parsePoolsData(poolsWeek);

            const aprs = await fetchPoolsAPR();

            const farmAprs = await fetchMerklFarmAPR();

            const eternalFarmsData = await fetchEternalFarmingsAPRByPool(poolsAddresses);
            const eternalFarmsMap = eternalFarmsData.reduce((map, farm) => {
                const poolAddress = getAddress(farm.pool);
                // Assuming rewardRate and bonusRewardRate should be summed up if they are for the same token (SEER)
                // and that they are indeed the daily rates.
                // The rates are strings in the subgraph data, so parse them.
                const dailyRate = parseFloat(farm.rewardRate || "0") + parseFloat(farm.bonusRewardRate || "0");
                // Only add to map if there's a positive reward rate
                if (dailyRate > 0) {
                    map[poolAddress] = {
                        dailyRewardRate: dailyRate * 86400 / 1e18,
                        isEternal: true, // Mark as eternal if data is found here
                    };
                }
                return map;
            }, {} as Record<string, { dailyRewardRate: number; isEternal: boolean }>);

            const formatted = poolsAddresses.reduce((accum: { [address: string]: FormattedPool | any }, address) => {
                const current: PoolSubgraph | undefined = parsedPools[address];
                const oneDay: PoolSubgraph | undefined = parsedPools24[address];
                const twoDay: PoolSubgraph | undefined = parsedPools48[address];
                const week: PoolSubgraph | undefined = parsedPoolsWeek[address];

                // Removed detailed debug log for the first pool

                const manageUntrackedVolume = +current.volumeUSD <= 1 ? "volumeUSD" : "volumeUSD";
                const manageUntrackedTVL = +current.totalValueLockedUSD <= 1 ? "totalValueLockedUSD" : "totalValueLockedUSD";

                const [volumeUSD, volumeUSDChange] =
                    current && oneDay && twoDay
                        ? get2DayChange(current[manageUntrackedVolume], oneDay[manageUntrackedVolume], twoDay[manageUntrackedVolume])
                        : current && oneDay
                            ? [parseFloat(current[manageUntrackedVolume]) - parseFloat(oneDay[manageUntrackedVolume]), 0]
                            : current
                                ? [parseFloat(current[manageUntrackedVolume]), 0]
                                : [0, 0];

                const volumeUSDWeek = current && week ? parseFloat(current[manageUntrackedVolume]) - parseFloat(week[manageUntrackedVolume]) : current ? parseFloat(current[manageUntrackedVolume]) : 0;

                const volumeUSDMonth = current ? parseFloat(current[manageUntrackedVolume]) : 0;

                const txCount = current && oneDay ? parseFloat(current.txCount) - parseFloat(oneDay.txCount) : current ? parseFloat(current.txCount) : 0;

                const feesCollected = current && oneDay ? parseFloat(current.feesUSD) - parseFloat(oneDay.feesUSD) : current ? parseFloat(current.feesUSD) : 0;

                const tvlUSD = current ? parseFloat(current[manageUntrackedTVL]) : 0;
                const tvlUSDChange = getPercentChange(current ? current[manageUntrackedTVL] : undefined, oneDay ? oneDay[manageUntrackedTVL] : undefined);
                const aprPercent = aprs[address] ? aprs[address].toFixed(2) : 0;

                const checksumAddres = getAddress(address);
                const farmingApr = farmAprs["100"] && farmAprs["100"].pools[checksumAddres] ? +farmAprs["100"].pools[checksumAddres].meanAPR.toFixed(2) : 0;

                const eternalFarmInfo = eternalFarmsMap[checksumAddres];

                accum[address] = {
                    token0: current.token0,
                    token1: current.token1,
                    market0: current.market0,
                    market1: current.market1,
                    fee: current.fee,
                    exists: !!current,
                    address,
                    volumeUSD,
                    volumeUSDChange,
                    volumeUSDWeek,
                    volumeUSDMonth,
                    tvlUSD,
                    txCount,
                    tvlUSDChange,
                    apr: aprPercent,
                    farmingApr: eternalFarmInfo?.isEternal ? 0 : farmingApr, // Set farmingApr to 0 if eternal, as we'll use dailyRewardRate
                    feesCollected,
                    isEternal: eternalFarmInfo?.isEternal || false,
                    dailyRewardRate: eternalFarmInfo?.dailyRewardRate || 0,
                };
                return accum;
            }, {});

            setPools(Object.values(formatted));
        } catch (err) {
            console.error("[useInfoSubgraph][fetchInfoPools] ERROR during subgraph queries or processing", err);
            setPools(null);
            // Consider if re-throwing is desired or if setting state to null/error is sufficient.
            // throw new Error("Info pools fetch " + err);
        } finally {
            setPoolsLoading(false);
        }
    }

    async function fetchInfoTokens() {
        // ethPrices depends on 'blocks', publicClient for latest block
        if (!ethPrices || !publicClient) {
            setTokensLoading(false);
            console.warn("[useInfoSubgraph][fetchInfoTokens] Aborting: Core dependencies (ethPrices or publicClient) are not available yet.");
            setTokens(null);
            return;
        }

        setTokensLoading(true);
        let latestBlockNumber: number;
        let queryHistoricalBlock24H: number | undefined = undefined;
        let queryHistoricalBlock48H: number | undefined = undefined;

        try {
            const latestBlockBigInt = await publicClient.getBlockNumber();
            latestBlockNumber = Number(latestBlockBigInt);

            if (isNaN(latestBlockNumber)) {
                console.error("[useInfoSubgraph][fetchInfoTokens] Aborting: Failed to parse latestBlockNumber.", latestBlockBigInt);
                setTokens("Failed due to latest block number parsing");
                setTokensLoading(false);
                return;
            }

            queryHistoricalBlock24H = latestBlockNumber - GNOSIS_AVG_BLOCKS_PER_24H;
            queryHistoricalBlock48H = latestBlockNumber - GNOSIS_AVG_BLOCKS_PER_48H;
            // Not fetching week for tokens currently, but could add queryHistoricalBlockWeek if needed

            if (queryHistoricalBlock24H <= 0 || queryHistoricalBlock48H <= 0) {
                console.error("[useInfoSubgraph][fetchInfoTokens] Aborting: One or more calculated historical block numbers are invalid (<=0).");
                setTokens("Failed due to invalid historical block calculation");
                setTokensLoading(false);
                return;
            }
            // console.log(`[useInfoSubgraph][fetchInfoTokens] Latest block: ${latestBlockNumber}. Historical blocks: 24H=${queryHistoricalBlock24H}, 48H=${queryHistoricalBlock48H}`);

        } catch (e) {
            console.error("[useInfoSubgraph][fetchInfoTokens] Error fetching latest block number:", e);
            setTokens("Failed to fetch latest block");
            setTokensLoading(false);
            return;
        }

        try {
            const {
                data: topTokensData,
                error: topTokensError,
            } = await dataClient.query<SubgraphResponse<TokenAddressSubgraph[]>>({
                query: TOP_TOKENS,
                fetchPolicy: "cache-first",
            });

            if (topTokensError || !topTokensData || !topTokensData.tokens) {
                console.error("Failed to fetch top tokens. Error:", topTokensError, "Data:", topTokensData);
                setTokensLoading(false);
                setTokens(null);
                return;
            }
            const topTokens = topTokensData.tokens;

            const _tokenAddresses = topTokens.map((el) => el.id);

            if (_tokenAddresses.length === 0) {
                setTokens([]);
                setTokensLoading(false);
                return;
            }

            const tokensFromAddressesResult = await dataClient.query<SubgraphResponse<TokenInSubgraph[]>>({
                query: TOKENS_FROM_ADDRESSES_LATEST,
                variables: { tokens: _tokenAddresses },
                fetchPolicy: "network-only",
            });

            if (tokensFromAddressesResult.error || !tokensFromAddressesResult.data || !tokensFromAddressesResult.data.tokens) {
                console.error("Failed to fetch token details from TOKENS_FROM_ADDRESSES_LATEST. Error:", tokensFromAddressesResult.error, "Data:", tokensFromAddressesResult.data);
                setTokensLoading(false);
                setTokens(null);
                return;
            }
            const rawTokens = tokensFromAddressesResult.data.tokens;

            const tokens = rawTokens.filter((token) => {
                // if (token.symbol.toUpperCase() in addressForCheck || possibleNames.some((el) => el.names.includes(token.name))) {
                //     return token.id.toLowerCase() === addressForCheck[token.symbol.toUpperCase()];
                // }

                return true;
            });

            const tokenAddresses = tokens.map((token) => token.id);

            // Use calculated historical block numbers
            const tokens24 = await fetchTokensByTime(queryHistoricalBlock24H, tokenAddresses);
            const tokens48 = await fetchTokensByTime(queryHistoricalBlock48H, tokenAddresses);
            // const tokensWeek = await fetchTokensByTime(queryHistoricalBlockWeek, tokenAddresses) // If week is needed

            const parsedTokens = parseTokensData(tokens);
            const parsedTokens24 = parseTokensData(tokens24);
            const parsedTokens48 = parseTokensData(tokens48);
            // const parsedTokensWeek = parseTokensData(tokensWeek)

            const formatted = tokenAddresses.reduce((accum: { [address: string]: FormattedToken | any }, address) => {
                const current: TokenInSubgraph | undefined = parsedTokens[address];
                const oneDay: TokenInSubgraph | undefined = parsedTokens24[address];
                const twoDay: TokenInSubgraph | undefined = parsedTokens48[address];
                // const week: TokenInSubgraph | undefined = parsedTokensWeek[address]

                const manageUntrackedVolume = +current.volumeUSD <= 1 ? "volumeUSD" : "volumeUSD";
                const manageUntrackedTVL = +current.totalValueLockedUSD <= 1 ? "totalValueLockedUSD" : "totalValueLockedUSD";

                const [volumeUSD, volumeUSDChange] =
                    current && oneDay && twoDay
                        ? get2DayChange(current[manageUntrackedVolume], oneDay[manageUntrackedVolume], twoDay[manageUntrackedVolume])
                        : current
                            ? [parseFloat(current[manageUntrackedVolume]), 0]
                            : [0, 0];

                // const volumeUSDWeek = current && week ? parseFloat(current[manageUntrackedVolume]) - parseFloat(week[manageUntrackedVolume]) : current ? parseFloat(current[manageUntrackedVolume]) : 0
                const volumeUSDWeek = current ? parseFloat(current[manageUntrackedVolume]) : 0;
                const tvlUSD = current ? parseFloat(current[manageUntrackedTVL]) : 0;
                const tvlUSDChange = getPercentChange(current ? current[manageUntrackedTVL] : undefined, oneDay ? oneDay[manageUntrackedTVL] : undefined);
                const tvlToken = current ? parseFloat(current[manageUntrackedTVL]) : 0;
                const priceUSD = current ? parseFloat(current.derivedMatic) * ethPrices?.current : 0;
                const priceUSDOneDay = oneDay ? parseFloat(oneDay.derivedMatic) * ethPrices.oneDay : 0;
                // const priceUSDWeek = week ? parseFloat(week.derivedMatic) * ethPrices.week : 0

                const priceUSDChange = priceUSD && priceUSDOneDay ? getPercentChange(priceUSD.toString(), priceUSDOneDay.toString()) : 0;
                // const priceUSDChangeWeek =
                // priceUSD && priceUSDWeek ? getPercentChange(priceUSD.toString(), priceUSDWeek.toString()) : 0
                const txCount = current && oneDay ? parseFloat(current.txCount) - parseFloat(oneDay.txCount) : current ? parseFloat(current.txCount) : 0;
                // const feesUSD =
                //     current && oneDay
                //         ? parseFloat(current.feesUSD) - parseFloat(oneDay.feesUSD)
                //         : current
                //             ? parseFloat(current.feesUSD)
                //             : 0

                accum[address] = {
                    exists: !!current,
                    address,
                    name: current ? formatTokenName(address, current.name) : "",
                    symbol: current ? formatTokenSymbol(address, current.symbol) : "",
                    volumeUSD,
                    volumeUSDChange,
                    // volumeUSDWeek,
                    txCount,
                    tvlUSD,
                    // feesUSD,
                    tvlUSDChange,
                    tvlToken,
                    priceUSD,
                    priceUSDChange,
                    // priceUSDChangeWeek
                };

                return accum;
            }, {});

            setTokens(Object.values(formatted));
        } catch (err) {
            setTokensLoading(false);
            setTokens(null);
            console.error("[useInfoSubgraph][fetchInfoTokens] Error during subgraph queries or processing", err);
            // throw new Error("Info tokens fetching " + err);
        } finally {
            setTokensLoading(false);
        }
    }

    async function fetchTokensByTime(blockNumber: number | null | undefined, tokenAddresses: string[]): Promise<TokenInSubgraph[] | string> {
        try {
            if (typeof blockNumber !== 'number') {
                return "error: blockNumber must be a number for historical query";
            }

            const {
                data: queryData,
                error,
            } = await dataClient.query<SubgraphResponse<TokenInSubgraph[]>>({
                query: TOKENS_FROM_ADDRESSES_HISTORICAL,
                variables: { tokens: tokenAddresses, blockNumber },
                fetchPolicy: "network-only",
            });
            if (error || !queryData || !queryData.tokens) return "error fetching data";

            return queryData.tokens;
        } catch (err) {
            throw new Error("Tokens fetching by time " + err);
        }
    }

    async function fetchPoolsByTime(blockNumber: number | null | undefined, tokenAddresses: string[]): Promise<PoolSubgraph[] | string> {
        try {
            if (typeof blockNumber !== 'number') {
                console.warn("[fetchPoolsByTime] Attempted to fetch with invalid blockNumber:", blockNumber);
                return "error: blockNumber must be a number for historical query";
            }

            const {
                data: queryData,
                error,
            } = await dataClient.query<SubgraphResponse<PoolSubgraph[]>>({
                query: POOLS_FROM_ADDRESSES_HISTORICAL,
                variables: { pools: tokenAddresses, blockNumber },
                fetchPolicy: "network-only",
            });
            if (error || !queryData || !queryData.pools) return "error fetching data";

            return queryData.pools;
        } catch (err) {
            throw new Error("Pools by time fetching " + err);
        }
    }

    async function fetchLastEntry(pool: string): Promise<FeeSubgraph[] | string> {
        try {
            const {
                data: { feeHourDatas },
                error,
            } = await dataClient.query<SubgraphResponse<FeeSubgraph[]>>({
                query: CHART_FEE_LAST_ENTRY,
                variables: { pool },
                fetchPolicy: "network-only",
            });
            if (error || !feeHourDatas) return "error fetching data";
            return feeHourDatas;
        } catch (err) {
            return `error fetching data ${err}`;
        }
    }

    async function fetchLastNotEmptyEntry(pool: string, timestamp: string): Promise<FeeSubgraph[] | string> {
        try {
            const {
                data: { feeHourDatas },
                error,
            } = await dataClient.query<SubgraphResponse<FeeSubgraph[]>>({
                query: CHART_FEE_LAST_NOT_EMPTY,
                variables: { pool, timestamp },
                fetchPolicy: "network-only",
            });
            if (error || !feeHourDatas) return "error fetching data";
            return feeHourDatas;
        } catch (err) {
            return `error fetching data ${err}`;
        }
    }

    async function fetchPoolLastNotEmptyEntry(pool: string, timestamp: number): Promise<LastPoolSubgraph[] | string> {
        try {
            const {
                data: { poolHourDatas },
                error,
            } = await dataClient.query<SubgraphResponse<LastPoolSubgraph[]>>({
                query: CHART_POOL_LAST_NOT_EMPTY,
                variables: { pool, timestamp },
                fetchPolicy: "network-only",
            });
            if (error || !poolHourDatas) return "error fetching data";
            return poolHourDatas;
        } catch (err) {
            return `error fetching data ${err}`;
        }
    }

    async function fetchPoolLastEntry(pool: string): Promise<LastPoolSubgraph[] | string> {
        try {
            const {
                data: { poolHourDatas },
                error,
            } = await dataClient.query<SubgraphResponse<LastPoolSubgraph[]>>({
                query: CHART_POOL_LAST_ENTRY,
                variables: { pool },
                fetchPolicy: "network-only",
            });
            if (error || !poolHourDatas) return "error fetching data";
            return poolHourDatas;
        } catch (err) {
            return `error fetching data ${err}`;
        }
    }

    async function fetchFeePool(pool: string, startTimestamp: number, endTimestamp: number) {
        try {
            setFeesLoading(true);
            const {
                data: { feeHourDatas },
                error,
            } = await dataClient.query<SubgraphResponse<FeeSubgraph[]>>({
                query: CHART_FEE_POOL_DATA,
                variables: { pool, startTimestamp, endTimestamp },
                fetchPolicy: "network-only",
            });

            if (error || !feeHourDatas) {
                setFees("failed");
                setFeesLoading(false);
                return;
            }

            const _feeHourData = feeHourDatas.length === 0 ? await fetchLastEntry(pool) : feeHourDatas;

            if (typeof _feeHourData === "string") return;

            const previousData = await fetchLastNotEmptyEntry(pool, _feeHourData[0].timestamp);

            if (typeof previousData === "string") return;

            if (_feeHourData.length !== 0) {
                setFees({
                    data: _feeHourData,
                    previousData: previousData || [],
                });
            } else {
                setFees({
                    data: [],
                    previousData: previousData || [],
                });
            }
        } catch (err) {
            setFees("Failed");
        } finally {
            setFeesLoading(false);
        }
    }

    async function fetchChartPoolData(pool: string, startTimestamp: number, endTimestamp: number) {
        try {
            setChartPoolDataLoading(true);
            const {
                data: { poolHourDatas },
                error,
            } = await dataClient.query<SubgraphResponse<LastPoolSubgraph[]>>({
                query: CHART_POOL_DATA,
                variables: { pool, startTimestamp, endTimestamp },
                fetchPolicy: "network-only",
            });

            if (error || !poolHourDatas) {
                setChartPoolData("failed");
                setChartPoolDataLoading(false);
                return;
            }

            const _poolHourDatas = poolHourDatas.length === 0 ? await fetchPoolLastEntry(pool) : poolHourDatas;

            if (typeof _poolHourDatas === "string") return;

            const previousData = await fetchPoolLastNotEmptyEntry(pool, _poolHourDatas[0].periodStartUnix);

            if (typeof previousData === "string") return;

            if (_poolHourDatas.length !== 0) {
                setChartPoolData({
                    data: _poolHourDatas,
                    previousData: previousData || [],
                });
            } else {
                setChartPoolData({
                    data: [],
                    previousData: previousData || [],
                });
            }
        } catch (err) {
            setChartPoolData("Chart pool data failed: " + err);
        } finally {
            setChartPoolDataLoading(false);
        }
    }

    async function fetchTotalStats() {
        // ethPrices depends on 'blocks', publicClient is needed for latest block.
        if (!ethPrices || !publicClient) {
            setTotalStatsLoading(false);
            console.warn("[useInfoSubgraph][fetchTotalStats] Aborting: Core dependencies (ethPrices or publicClient) are not available yet.");
            return;
        }

        setTotalStatsLoading(true);
        let latestBlockNumber: number;
        let queryHistoricalBlock24H: number | undefined = undefined;

        try {
            const latestBlockBigInt = await publicClient.getBlockNumber();
            latestBlockNumber = Number(latestBlockBigInt);

            if (isNaN(latestBlockNumber)) {
                console.error("[useInfoSubgraph][fetchTotalStats] Aborting: Failed to parse latestBlockNumber.", latestBlockBigInt);
                setTotalStats("Failed due to latest block number parsing");
                setTotalStatsLoading(false);
                return;
            }

            queryHistoricalBlock24H = latestBlockNumber - GNOSIS_AVG_BLOCKS_PER_24H;

            if (queryHistoricalBlock24H <= 0) {
                console.error("[useInfoSubgraph][fetchTotalStats] Aborting: Calculated historical block number is invalid (<=0).", queryHistoricalBlock24H);
                setTotalStats("Failed due to invalid historical block calculation");
                setTotalStatsLoading(false);
                return;
            }
            // Minimal log
            // console.log(`[useInfoSubgraph][fetchTotalStats] Latest block: ${latestBlockNumber}. Historical query block (24H ago approx): ${queryHistoricalBlock24H}`);

        } catch (e) {
            console.error("[useInfoSubgraph][fetchTotalStats] Error fetching latest block number:", e);
            setTotalStats("Failed to fetch latest block");
            setTotalStatsLoading(false);
            return;
        }

        try {
            // Fetch current total stats (using latest, no block filter)
            const { data: currentQueryResultData, error: currentError } = await dataClient.query<SubgraphResponse<{ factories: TotalStatSubgraph[] }>>({
                query: TOTAL_STATS_LATEST,
                variables: {},
                fetchPolicy: "network-only",
            });

            // Fetch historical total stats
            let historicalQueryResultData: SubgraphResponse<{ factories: TotalStatSubgraph[] }> | undefined = undefined;
            let historicalError: any = undefined;
            let historicalQueryAttempted = false;

            if (typeof queryHistoricalBlock24H === 'number') {
                historicalQueryAttempted = true;
                const result24 = await dataClient.query<SubgraphResponse<{ factories: TotalStatSubgraph[] }>>({
                    query: TOTAL_STATS_HISTORICAL,
                    variables: { blockNumber: queryHistoricalBlock24H },
                    fetchPolicy: "network-only",
                });
                historicalQueryResultData = result24.data;
                historicalError = result24.error;
            }

            // console.log("[useInfoSubgraph][fetchTotalStats] historicalQueryResultData:", historicalQueryResultData); // Verbose log, remove later

            if (currentError || !currentQueryResultData?.factories?.[0] || (historicalQueryAttempted && (historicalError || !historicalQueryResultData?.factories?.[0]))) {
                console.error("[useInfoSubgraph][fetchTotalStats] Failed to fetch total stats. Current error:", currentError, "Historical error:", historicalError);
                setTotalStats("Failed");
                setTotalStatsLoading(false);
                return;
            }

            const stats = currentQueryResultData.factories[0];
            const stats24 = historicalQueryAttempted && historicalQueryResultData?.factories?.[0] ? historicalQueryResultData.factories[0] : undefined;

            // Minimal logging for calculation values, can be removed after confirmation
            // if (stats && stats24) {
            //     console.log(`[useInfoSubgraph][fetchTotalStats] Calc Values: CurrentVol: ${stats.totalVolumeUSD}, HistVol: ${stats24.totalVolumeUSD}`);
            // }


            const volumeUSD = stats && stats24 ? parseFloat(stats.totalVolumeUSD) - parseFloat(stats24.totalVolumeUSD) : parseFloat(stats.totalVolumeUSD);
            const txCount = stats && stats24 ? parseFloat(stats.txCount) - parseFloat(stats24.txCount) : stats ? parseFloat(stats.txCount) : 0;
            const feesCollected = stats && stats24 ? parseFloat(stats.totalFeesUSD) - parseFloat(stats24.totalFeesUSD) : stats ? parseFloat(stats.totalFeesUSD) : 0;

            setTotalStats({
                tvlUSD: parseFloat(stats.totalValueLockedUSD),
                volumeUSD,
                txCount,
                feesCollected,
            });
        } catch (err) {
            console.error("[useInfoSubgraph][fetchTotalStats] Error during subgraph queries or processing:", err);
            setTotalStats("Failed");
        } finally {
            setTotalStatsLoading(false);
        }
    }

    async function fetchEternalFarmingsAPRByPool(poolAddresses: string[]): Promise<EternalFarmingByPool[]> {
        if (!dataClient) return [];
        try {
            const { data, error } = await farmingClient.query<SubgraphResponse<EternalFarmingByPoolRaw[]>>({
                query: FETCH_ETERNAL_FARM_FROM_POOL,
                variables: { pools: poolAddresses, currentTime: Math.floor(Date.now() / 1000) },
                fetchPolicy: "network-only",
            });

            if (error || !data || !data.eternalFarmings) {
                console.error("Error fetching eternal farmings APR by pool:", error);
                return [];
            }

            // Transform the response to match our interface
            return data.eternalFarmings.map(farm => ({
                ...farm,
                pool: farm.pool.id  // Extract the id from the pool object
            }));
        } catch (e) {
            console.error("Exception fetching eternal farmings APR by pool:", e);
            return [];
        }
    }

    return {
        blocksFetched: blockError ? false : !!ethPrices && !!blocks,
        fetchInfoPools: { poolsResult, poolsLoading, fetchInfoPoolsFn: fetchInfoPools },
        fetchInfoTokens: { tokensResult, tokensLoading, fetchInfoTokensFn: fetchInfoTokens },
        fetchChartFeesData: { feesResult, feesLoading, fetchFeePoolFn: fetchFeePool },
        fetchChartPoolData: { chartPoolData, chartPoolDataLoading, fetchChartPoolDataFn: fetchChartPoolData },
        fetchTotalStats: { totalStats, totalStatsLoading, fetchTotalStatsFn: fetchTotalStats },
    };
}
