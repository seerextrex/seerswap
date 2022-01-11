import { useApolloClient } from "@apollo/client";
import { useState } from "react";
import { Contract, providers } from "ethers";
import { useActiveWeb3React } from "../web3";
import { useClients } from "./useClients";
import {
    FETCH_FEE_FROM_POOL,
    CHART_FEE_LAST_ENTRY,
    CHART_FEE_POOL_DATA,
    CHART_POOL_DATA,
    CHART_POOL_LAST_ENTRY,
    POOLS_FROM_ADDRESSES,
    TOKENS_FROM_ADDRESSES,
    TOP_POOLS,
    TOP_TOKENS,
    CHART_FEE_LAST_NOT_EMPTY,
    CHART_POOL_LAST_NOT_EMPTY,
    SWAPS_PER_DAY,
    ALL_POSITIONS,
    TOTAL_STATS
} from '../../utils/graphql-queries'
import { useBlocksFromTimestamps } from '../blocks'
import { useEthPrices } from '../useEthPrices'
import { useDeltaTimestamps } from "../../utils/queries";
import { formatTokenName, formatTokenSymbol, get2DayChange, getPercentChange } from "../../utils/info";

function parseTokensData(tokenData) {
    return tokenData ? tokenData.reduce((accum: { [address: string]: TokenFields }, poolData) => {
        accum[poolData.id] = poolData
        return accum
    }, {})
        : {}
}

export function useInfoSubgraph() {

    const { chainId, account } = useActiveWeb3React()

    const { dataClient } = useClients()

    const [t24, t48, tWeek] = useDeltaTimestamps()

    const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48, tWeek])
    const [block24, block48, blockWeek] = blocks?.reverse() ?? []

    const ethPrices = useEthPrices()

    const [poolsResult, setPools] = useState(null);
    const [poolsLoading, setPoolsLoading] = useState(null);

    const [tokensResult, setTokens] = useState(null);
    const [tokensLoading, setTokensLoading] = useState(null);

    const [feesResult, setFees] = useState(null);
    const [feesLoading, setFeesLoading] = useState(null);

    const [chartPoolData, setChartPoolData] = useState(null)
    const [chartPoolDataLoading, setChartPoolDataLoading] = useState(null)

    const [totalStats, setTotalStats] = useState(null)
    const [totalStatsLoading, setTotalStatsLoading] = useState(null)

    async function fetchInfoPools(reload?: boolean) {

        if (!blocks || blockError || !ethPrices) return

        try {
            setPoolsLoading(true)

            const { data: { pools: topPools }, error } = (await dataClient.query({
                query: TOP_POOLS,
                fetchPolicy: 'network-only'
            }))

            if (error) throw new Error(`${error.name} ${error.message}`)

            const poolsAddresses = topPools.map(el => el.id)

            const { data: { pools }, error: _error2 } = await dataClient.query({
                query: POOLS_FROM_ADDRESSES(undefined, poolsAddresses),
                fetchPolicy: 'network-only'
            })

            if (error) throw new Error(`${_error2.name} ${_error2.message}`)

            const [_block24, _block48, _blockWeek] = [block24, block48, blockWeek].sort((a, b) => b.timestamp - a.timestamp)

            const pools24 = await fetchPoolsByTime(_block24.number, poolsAddresses)
            const pools48 = await fetchPoolsByTime(_block48.number, poolsAddresses)
            const poolsWeek = await fetchPoolsByTime(_blockWeek.number, poolsAddresses)

            const parsedPools = parseTokensData(pools)
            const parsedPools24 = parseTokensData(pools24)
            const parsedPools48 = parseTokensData(pools48)
            const parsedPoolsWeek = parseTokensData(poolsWeek)

            console.log('block 24', _block24)
            const formatted = poolsAddresses.reduce((accum: { [address: string]: TokenData }, address) => {
                const current: TokenFields | undefined = parsedPools[address]
                const oneDay: TokenFields | undefined = parsedPools24[address]
                const twoDay: TokenFields | undefined = parsedPools48[address]
                const week: TokenFields | undefined = parsedPoolsWeek[address]

                const [volumeUSD, volumeUSDChange] =
                    current && oneDay && twoDay
                        ? get2DayChange(current.volumeUSD, oneDay.volumeUSD, twoDay.volumeUSD)
                        : current && oneDay ?
                            [parseFloat(current.volumeUSD) - parseFloat(oneDay.volumeUSD), 0] : current
                                ? [parseFloat(current.volumeUSD), 0]
                                : [0, 0]

                const volumeUSDWeek =
                    current && week
                        ? parseFloat(current.volumeUSD) - parseFloat(week.volumeUSD)
                        : current
                            ? parseFloat(current.volumeUSD)
                            : 0

                const tvlUSD = current ? parseFloat(current.totalValueLockedUSD) : 0
                const tvlUSDChange = getPercentChange(current?.totalValueLockedUSD, oneDay?.totalValueLockedUSD)
                const tvlToken = current ? parseFloat(current.totalValueLocked) : 0

                const priceUSD = current ? parseFloat(current.derivedMatic) * ethPrices.current : 0
                const priceUSDOneDay = oneDay ? parseFloat(oneDay.derivedMatic) * ethPrices.oneDay : 0
                const priceUSDWeek = week ? parseFloat(week.derivedMatic) * ethPrices.week : 0

                const priceUSDChange =
                    priceUSD && priceUSDOneDay ? getPercentChange(priceUSD.toString(), priceUSDOneDay.toString()) : 0
                const priceUSDChangeWeek =
                    priceUSD && priceUSDWeek ? getPercentChange(priceUSD.toString(), priceUSDWeek.toString()) : 0
                const txCount =
                    current && oneDay
                        ? parseFloat(current.txCount) - parseFloat(oneDay.txCount)
                        : current
                            ? parseFloat(current.txCount)
                            : 0
                const feesUSD =
                    current && oneDay
                        ? parseFloat(current.feesUSD) - parseFloat(oneDay.feesUSD)
                        : current
                            ? parseFloat(current.feesUSD)
                            : 0



                accum[address] = {
                    token0: current.token0,
                    token1: current.token1,
                    fee: current.fee,
                    exists: !!current,
                    address,
                    name: current ? formatTokenName(address, current.name) : '',
                    symbol: current ? formatTokenSymbol(address, current.symbol) : '',
                    volumeUSD,
                    volumeUSDChange,
                    volumeUSDWeek,
                    txCount,
                    tvlUSD,
                    feesUSD,
                    tvlUSDChange,
                    totalValueLockedUSD: current.totalValueLockedUSD,
                    tvlToken,
                    priceUSD,
                    priceUSDChange,
                    priceUSDChangeWeek,
                    apr: isNaN(feesUSD * 365 / tvlUSD * 100) ? 0 : feesUSD * 365 / tvlUSD * 100
                }

                return accum
            }, {})

            setPools(Object.values(formatted))

        } catch (err) {
            setPools('failed')
            throw new Error('Info pools fetch ' + err)
        }

        setPoolsLoading(false)
    }

    async function fetchInfoTokens(reload?: boolean) {

        if (!blocks || blockError || !ethPrices) return

        try {
            setTokensLoading(true)

            const { data: { tokens: topTokens }, error } = (await dataClient.query({
                query: TOP_TOKENS,
                fetchPolicy: 'network-only'
            }))

            if (error) throw new Error(`${error.name} ${error.message}`)

            const tokenAddresses = topTokens.map(el => el.id)

            const { data: { tokens }, error: _error } = await dataClient.query({
                query: TOKENS_FROM_ADDRESSES(undefined, tokenAddresses),
                fetchPolicy: 'network-only'
            })

            if (error) throw new Error(`${_error.name} ${_error.message}`)

            const [_block24, _block48, _blockWeek] = [block24, block48, blockWeek].sort((a, b) => b.timestamp - a.timestamp)

            const tokens24 = await fetchTokensByTime(_block24.number, tokenAddresses)
            const tokens48 = await fetchTokensByTime(_block48.number, tokenAddresses)
            const tokensWeek = await fetchTokensByTime(_blockWeek.number, tokenAddresses)

            const parsedTokens = parseTokensData(tokens)
            const parsedTokens24 = parseTokensData(tokens24)
            const parsedTokens48 = parseTokensData(tokens48)
            const parsedTokensWeek = parseTokensData(tokensWeek)

            const formatted = tokenAddresses.reduce((accum: { [address: string]: TokenData }, address) => {
                const current: TokenFields | undefined = parsedTokens[address]
                const oneDay: TokenFields | undefined = parsedTokens24[address]
                const twoDay: TokenFields | undefined = parsedTokens48[address]
                const week: TokenFields | undefined = parsedTokensWeek[address]

                const [volumeUSD, volumeUSDChange] =
                    current && oneDay && twoDay
                        ? get2DayChange(current.volumeUSD, oneDay.volumeUSD, twoDay.volumeUSD)
                        : current
                            ? [parseFloat(current.volumeUSD), 0]
                            : [0, 0]

                const volumeUSDWeek =
                    current && week
                        ? parseFloat(current.volumeUSD) - parseFloat(week.volumeUSD)
                        : current
                            ? parseFloat(current.volumeUSD)
                            : 0
                const tvlUSD = current ? parseFloat(current.totalValueLockedUSD) : 0
                const tvlUSDChange = getPercentChange(current?.totalValueLockedUSD, oneDay?.totalValueLockedUSD)
                const tvlToken = current ? parseFloat(current.totalValueLocked) : 0
                const priceUSD = current ? parseFloat(current.derivedMatic) * ethPrices.current : 0
                const priceUSDOneDay = oneDay ? parseFloat(oneDay.derivedMatic) * ethPrices.oneDay : 0
                const priceUSDWeek = week ? parseFloat(week.derivedMatic) * ethPrices.week : 0
                const priceUSDChange =
                    priceUSD && priceUSDOneDay ? getPercentChange(priceUSD.toString(), priceUSDOneDay.toString()) : 0
                const priceUSDChangeWeek =
                    priceUSD && priceUSDWeek ? getPercentChange(priceUSD.toString(), priceUSDWeek.toString()) : 0
                const txCount =
                    current && oneDay
                        ? parseFloat(current.txCount) - parseFloat(oneDay.txCount)
                        : current
                            ? parseFloat(current.txCount)
                            : 0
                const feesUSD =
                    current && oneDay
                        ? parseFloat(current.feesUSD) - parseFloat(oneDay.feesUSD)
                        : current
                            ? parseFloat(current.feesUSD)
                            : 0

                accum[address] = {
                    exists: !!current,
                    address,
                    name: current ? formatTokenName(address, current.name) : '',
                    symbol: current ? formatTokenSymbol(address, current.symbol) : '',
                    volumeUSD,
                    volumeUSDChange,
                    volumeUSDWeek,
                    txCount,
                    tvlUSD,
                    feesUSD,
                    tvlUSDChange,
                    tvlToken,
                    priceUSD,
                    priceUSDChange,
                    priceUSDChangeWeek,
                }

                return accum
            }, {})

            setTokens(Object.values(formatted))

        } catch (err) {
            setTokens('failed')
            throw new Error('Info tokens fetching ' + err)
        }

        setTokensLoading(false)
    }

    async function fetchTokensByTime(blockNumber: number, tokenAddresses) {

        try {

            const { data: { tokens }, error: error } = await dataClient.query({
                query: TOKENS_FROM_ADDRESSES(blockNumber, tokenAddresses),
                fetchPolicy: 'network-only'
            })

            if (error) throw new Error(`${error.name} ${error.message}`)

            return tokens

        } catch (err) {
            throw new Error('Tokens fetching by time ' + err)
        }

    }

    async function fetchPoolsByTime(blockNumber: number, tokenAddresses) {

        try {

            const { data: { pools }, error: error } = await dataClient.query({
                query: POOLS_FROM_ADDRESSES(blockNumber, tokenAddresses),
                fetchPolicy: 'network-only'
            })

            if (error) throw new Error(`${error.name} ${error.message}`)

            return pools

        } catch (err) {
            throw new Error('Pools by time fetching ' + err)
        }

    }

    async function fetchLastEntry(pool) {
        try {
            const { data: { feeHourDatas }, error: error } = await dataClient.query({
                query: CHART_FEE_LAST_ENTRY(pool),
                fetchPolicy: 'network-only'
            })

            if (error) throw new Error(`${error.name} ${error.message}`)

            return feeHourDatas

        } catch (err) {
            console.error('Fees last failed: ', err);
        }
    }

    async function fetchLastNotEmptyEntry(pool: string, timestamp: string) {
        try {

            const { data: { feeHourDatas }, error: error } = await dataClient.query({
                query: CHART_FEE_LAST_NOT_EMPTY(pool, timestamp),
                fetchPolicy: 'network-only'
            })

            if (error) throw new Error(`${error.name} ${error.message}`)

            if (feeHourDatas.length === 0) return []

            return feeHourDatas

        } catch (err) {
            console.error('Fees last not empty failed:', err)
        }
    }

    async function fetchPoolLastNotEmptyEntry(pool: string, timestamp: string) {
        try {

            const { data: { poolHourDatas }, error: error } = await dataClient.query({
                query: CHART_POOL_LAST_NOT_EMPTY(pool, timestamp),
                fetchPolicy: 'network-only'
            })

            if (error) throw new Error(`${error.name} ${error.message}`)

            if (poolHourDatas.length === 0) return []

            return poolHourDatas

        } catch (err) {
            console.error('Pool last not empty failed:', err)
        }
    }

    async function fetchPoolLastEntry(pool) {
        try {

            const { data: { poolHourDatas }, error: error } = await dataClient.query({
                query: CHART_POOL_LAST_ENTRY(pool),
                fetchPolicy: 'network-only'
            })

            if (error) throw new Error(`${error.name} ${error.message}`)

            return poolHourDatas

        } catch (err) {
            console.error('Fees last failed: ', err);
        }
    }

    async function fetchFeePool(pool: string, startTimestamp: number, endTimestamp: number) {
        try {
            setFeesLoading(true)

            const { data: { feeHourDatas }, error: error } = await dataClient.query({
                query: CHART_FEE_POOL_DATA(pool, startTimestamp, endTimestamp),
                fetchPolicy: 'network-only'
            })

            if (error) throw new Error(`${error.name} ${error.message}`)

            const _feeHourData = feeHourDatas.length === 0 ? await fetchLastEntry(pool) : feeHourDatas

            const previousData = await fetchLastNotEmptyEntry(pool, _feeHourData[0].timestamp)

            if (_feeHourData.length !== 0) {
                setFees({
                    data: _feeHourData,
                    previousData: previousData || []
                })
            } else {
                setFees({
                    data: [],
                    previousData: previousData || []
                })
            }

        } catch (err) {
            console.error('Fees failed: ', err);
            setFees('Failed')
        }

        setFeesLoading(false)
    }

    async function fetchChartPoolData(pool: string, startTimestamp: number, endTimestamp: number) {
        try {

            setChartPoolDataLoading(true)

            const { data: { poolHourDatas }, error: error } = await dataClient.query({
                query: CHART_POOL_DATA(pool, startTimestamp, endTimestamp),
                fetchPolicy: 'network-only',
            })

            if (error) throw new Error(`${error.name} ${error.message}`)

            const _poolHourDatas = poolHourDatas.length === 0 ? await fetchPoolLastEntry(pool) : poolHourDatas

            const previousData = await fetchPoolLastNotEmptyEntry(pool, poolHourDatas[0].periodStartUnix)

            if (_poolHourDatas.length !== 0) {
                setChartPoolData({
                    data: _poolHourDatas,
                    previousData: previousData || []
                })
            } else {
                setChartPoolData({
                    data: [],
                    previousData: previousData || []
                })
            }

        } catch (err) {
            console.error('Chart pool data failed: ', err)
            setChartPoolData(false)
        }

        setChartPoolDataLoading(false)
    }

    async function fetchTotalStats() {

        try {

            setTotalStatsLoading(true)

            const [_block24, _block48, _blockWeek] = [block24, block48, blockWeek].sort((a, b) => b.timestamp - a.timestamp)

            const { data: data, error: error } = await dataClient.query({
                query: TOTAL_STATS(),
                fetchPolicy: 'network-only'
            })

            if (error) throw new Error(`${error.name} ${error.message}`)

            const { data: data24, error: error24 } = await dataClient.query({
                query: TOTAL_STATS(_block24.number),
                fetchPolicy: 'network-only'
            })

            if (error24) throw new Error(`${error24.name} ${error24.message}`)

            const stats = data.factories[0]
            const stats24 = data24.factories[0]
            
            const volumeUSD =
            stats && stats24
              ? parseFloat(stats.totalVolumeUSD) - parseFloat(stats24.totalVolumeUSD)
              : parseFloat(stats.totalVolumeUSD)

            setTotalStats({
                tvlUSD: parseFloat(stats.totalValueLockedUSD),
                volumeUSD: volumeUSD
            })

        } catch (err) {
            console.error('total stats failed', err)
            setTotalStats('Failed')
        }

        setTotalStatsLoading(false)
    }

    return {
        blocksFetched: blockError ? false : !!ethPrices && !!blocks,
        fetchInfoPools: { poolsResult, poolsLoading, fetchInfoPoolsFn: fetchInfoPools },
        fetchInfoTokens: { tokensResult, tokensLoading, fetchInfoTokensFn: fetchInfoTokens },
        fetchChartFeesData: { feesResult, feesLoading, fetchFeePoolFn: fetchFeePool },
        fetchChartPoolData: { chartPoolData, chartPoolDataLoading, fetchChartPoolDataFn: fetchChartPoolData },
        fetchTotalStats: { totalStats, totalStatsLoading, fetchTotalStatsFn: fetchTotalStats }
    }

}