import { useCallback, useState } from 'react'
import { useActiveWeb3React } from '../web3'
import { useClients } from './useClients'
import {
    CHART_FEE_LAST_ENTRY,
    CHART_FEE_LAST_NOT_EMPTY,
    CHART_FEE_POOL_DATA,
    CHART_POOL_DATA,
    CHART_POOL_LAST_ENTRY,
    CHART_POOL_LAST_NOT_EMPTY,
    GET_STAKE,
    GET_STAKE_HISTORY,
    POOLS_FROM_ADDRESSES,
    TOKENS_FROM_ADDRESSES,
    TOP_POOLS,
    TOP_TOKENS,
    TOTAL_STATS
} from 'utils/graphql-queries'
import { useBlocksFromTimestamps } from '../blocks'
import { useEthPrices } from '../useEthPrices'
import { useDeltaTimestamps } from 'utils/queries'
import { formatTokenName, formatTokenSymbol, get2DayChange, getPercentChange } from 'utils/info'
import { stakerClient } from 'apollo/client'
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
    StakeSubgraph,
    SubgraphResponse,
    SubgraphResponseStaking,
    TokenAddressSubgraph,
    TokenInSubgraph,
    TotalStatSubgraph
} from '../../models/interfaces'

function parsePoolsData(tokenData: PoolSubgraph[] | string) {
    if (typeof tokenData === 'string') return {}
    return tokenData ? tokenData.reduce((accum: { [address: string]: PoolSubgraph }, poolData) => {
            accum[poolData.id] = poolData
            return accum
        }, {})
        : {}
}

function parseTokensData(tokenData: TokenInSubgraph[] | string) {
    if (typeof tokenData === 'string') return {}
    return tokenData ? tokenData.reduce((accum: { [address: string]: TokenInSubgraph }, tokenData) => {
            accum[tokenData.id] = tokenData
            return accum
        }, {})
        : {}
}

export function useInfoSubgraph() {
    const { account } = useActiveWeb3React()
    const { dataClient } = useClients()
    const [t24, t48, tWeek] = useDeltaTimestamps()

    const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48, tWeek])
    const [block24, block48, blockWeek] = blocks?.reverse() ?? []

    const ethPrices = useEthPrices()

    const [poolsResult, setPools] = useState<string | null | FormattedPool[]>(null)
    const [poolsLoading, setPoolsLoading] = useState<null | boolean>(null)

    const [tokensResult, setTokens] = useState<string | null | FormattedToken[]>(null)
    const [tokensLoading, setTokensLoading] = useState<null | boolean>(null)


    const [feesResult, setFees] = useState<null | string | FormattedFee>(null)
    const [feesLoading, setFeesLoading] = useState<null | boolean>(null)

    const [chartPoolData, setChartPoolData] = useState<null | string | FormattedChartPool>(null)
    const [chartPoolDataLoading, setChartPoolDataLoading] = useState<null | boolean>(null)

    const [totalStats, setTotalStats] = useState<null | string | FormattedTotalStats>(null)
    const [totalStatsLoading, setTotalStatsLoading] = useState<null | boolean>(null)

    const [stakesResult, setStakes] = useState<null | string | SubgraphResponseStaking<FactorySubgraph[], StakeSubgraph[]>>(null)
    const [stakesLoading, setStakesLoading] = useState<null | boolean>(null)

    const [stakeHistoriesResult, setHistories] = useState<string | null | HistoryStakingSubgraph[]>(null)
    const [historiesLoading, setHistoriesLoading] = useState<null | boolean>(null)

    async function fetchInfoPools() {

        if (!blocks || blockError || !ethPrices) return

        try {
            setPoolsLoading(true)

            const {
                data: { pools: topPools },
                error
            } = (await dataClient.query<SubgraphResponse<PoolAddressSubgraph[]>>({
                query: TOP_POOLS,
                fetchPolicy: 'network-only'
            }))

            if (error) {
                setPools(`failed`)
                return
            }

            const poolsAddresses = topPools.map(el => el.id)

            const {
                data: { pools },
                error: _error2
            } = await dataClient.query<SubgraphResponse<PoolSubgraph[]>>({
                query: POOLS_FROM_ADDRESSES(undefined, poolsAddresses),
                fetchPolicy: 'network-only'
            })

            if (_error2) {
                setPools(`failed`)
                return
            }

            const [_block24, _block48, _blockWeek] = [block24, block48, blockWeek].sort((a, b) => +b.timestamp - +a.timestamp)

            const pools24 = await fetchPoolsByTime(_block24.number, poolsAddresses)
            const pools48 = await fetchPoolsByTime(_block48.number, poolsAddresses)
            const poolsWeek = await fetchPoolsByTime(_blockWeek.number, poolsAddresses)

            const parsedPools = parsePoolsData(pools)
            const parsedPools24 = parsePoolsData(pools24)
            const parsedPools48 = parsePoolsData(pools48)
            const parsedPoolsWeek = parsePoolsData(poolsWeek)

            const formatted = poolsAddresses.reduce((accum: { [address: string]: FormattedPool }, address: string) => {
                const current: PoolSubgraph | undefined = parsedPools[address]
                const oneDay: PoolSubgraph | undefined = parsedPools24[address]
                const twoDay: PoolSubgraph | undefined = parsedPools48[address]
                const week: PoolSubgraph | undefined = parsedPoolsWeek[address]

                const [volumeUSD, volumeUSDChange] =
                    current && oneDay && twoDay
                        ? get2DayChange(current.volumeUSD, oneDay.volumeUSD, twoDay.volumeUSD)
                        : current && oneDay ?
                            [parseFloat(current.volumeUSD) - parseFloat(oneDay.volumeUSD), 0] : current
                                ? [parseFloat(current.volumeUSD), 0]
                                : [0, 0]

                const volumeUSDWeek = current && week ? parseFloat(current.volumeUSD) - parseFloat(week.volumeUSD) : current ? parseFloat(current.volumeUSD) : 0
                const tvlUSD = current ? parseFloat(current.totalValueLockedUSD) : 0
                const tvlUSDChange = getPercentChange(current?.totalValueLockedUSD, oneDay?.totalValueLockedUSD)
                const feesUSD = current && oneDay ? parseFloat(current.feesUSD) - parseFloat(oneDay.feesUSD) : current ? parseFloat(current.feesUSD) : 0
                const apr = isNaN(feesUSD * 365 / tvlUSD * 100) ? 0 : feesUSD * 365 / tvlUSD * 100
                accum[address] = {
                    token0: current.token0,
                    token1: current.token1,
                    fee: current.fee,
                    exists: !!current,
                    address,
                    volumeUSD,
                    volumeUSDChange,
                    volumeUSDWeek,
                    tvlUSD,
                    tvlUSDChange,
                    totalValueLockedUSD: current.totalValueLockedUSD,
                    apr
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

    async function fetchInfoTokens() {

        if (!blocks || blockError || !ethPrices) return

        try {
            setTokensLoading(true)

            const {
                data: { tokens: topTokens },
                error
            } = (await dataClient.query<SubgraphResponse<TokenAddressSubgraph[]>>({
                query: TOP_TOKENS,
                fetchPolicy: 'network-only'
            }))

            if (error) {
                setTokens('failed')
                return
            }

            const tokenAddresses: string[] = topTokens.map(el => el.id)

            const {
                data: { tokens },
                error: _error
            } = await dataClient.query<SubgraphResponse<TokenInSubgraph[]>>({
                query: TOKENS_FROM_ADDRESSES(undefined, tokenAddresses),
                fetchPolicy: 'network-only'
            })

            if (_error) {
                setTokens('failed')
                return
            }

            const [_block24, _block48, _blockWeek] = [block24, block48, blockWeek].sort((a, b) => +b.timestamp - +a.timestamp)

            const tokens24 = await fetchTokensByTime(_block24.number, tokenAddresses)
            const tokens48 = await fetchTokensByTime(_block48.number, tokenAddresses)
            const tokensWeek = await fetchTokensByTime(_blockWeek.number, tokenAddresses)

            const parsedTokens = parseTokensData(tokens)
            const parsedTokens24 = parseTokensData(tokens24)
            const parsedTokens48 = parseTokensData(tokens48)
            const parsedTokensWeek = parseTokensData(tokensWeek)

            const formatted = tokenAddresses.reduce((accum: { [address: string]: FormattedToken }, address) => {
                const current: TokenInSubgraph | undefined = parsedTokens[address]
                const oneDay: TokenInSubgraph | undefined = parsedTokens24[address]
                const twoDay: TokenInSubgraph | undefined = parsedTokens48[address]
                const week: TokenInSubgraph | undefined = parsedTokensWeek[address]

                const [volumeUSD, volumeUSDChange] =
                    current && oneDay && twoDay
                        ? get2DayChange(current.volumeUSD, oneDay.volumeUSD, twoDay.volumeUSD)
                        : current
                            ? [parseFloat(current.volumeUSD), 0]
                            : [0, 0]

                const volumeUSDWeek = current && week ? parseFloat(current.volumeUSD) - parseFloat(week.volumeUSD) : current ? parseFloat(current.volumeUSD) : 0
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
                    priceUSDChangeWeek
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

    async function fetchTokensByTime(blockNumber: number, tokenAddresses: string[]): Promise<TokenInSubgraph[] | string> {

        try {

            const {
                data: { tokens },
                error: error
            } = await dataClient.query<SubgraphResponse<TokenInSubgraph[]>>({
                query: TOKENS_FROM_ADDRESSES(blockNumber, tokenAddresses),
                fetchPolicy: 'network-only'
            })

            if (error) return `${error.name} ${error.message}`

            return tokens

        } catch (err) {
            throw new Error('Tokens fetching by time ' + err)
        }
    }

    async function fetchPoolsByTime(blockNumber: number, tokenAddresses: string[]): Promise<PoolSubgraph[] | string> {

        try {

            const {
                data: { pools },
                error
            } = await dataClient.query<SubgraphResponse<PoolSubgraph[]>>({
                query: POOLS_FROM_ADDRESSES(blockNumber, tokenAddresses),
                fetchPolicy: 'network-only'
            })

            if (error) return `${error.name} ${error.message}`

            return pools

        } catch (err) {
            throw new Error('Pools by time fetching ' + err)
        }
    }

    async function fetchLastEntry(pool: string): Promise<FeeSubgraph[] | string> {
        try {
            const {
                data: { feeHourDatas },
                error
            } = await dataClient.query<SubgraphResponse<FeeSubgraph[]>>({
                query: CHART_FEE_LAST_ENTRY(pool),
                fetchPolicy: 'network-only'
            })

            if (error) return `${error.name} ${error.message}`

            return feeHourDatas

        } catch (err) {
            throw new Error('Fees last failed: ' + err)
        }
    }

    async function fetchLastNotEmptyEntry(pool: string, timestamp: string): Promise<FeeSubgraph[] | string> {
        try {
            const {
                data: { feeHourDatas },
                error
            } = await dataClient.query<SubgraphResponse<FeeSubgraph[]>>({
                query: CHART_FEE_LAST_NOT_EMPTY(pool, timestamp),
                fetchPolicy: 'network-only'
            })
            if (error) return `${error.name} ${error.message}`

            if (feeHourDatas.length === 0) return []

            return feeHourDatas

        } catch (err) {
            throw new Error('Fees last not empty failed:' + err)
        }
    }

    async function fetchPoolLastNotEmptyEntry(pool: string, timestamp: string): Promise<LastPoolSubgraph[] | string> {
        try {

            const {
                data: { poolHourDatas },
                error
            } = await dataClient.query<SubgraphResponse<LastPoolSubgraph[]>>({
                query: CHART_POOL_LAST_NOT_EMPTY(pool, timestamp),
                fetchPolicy: 'network-only'
            })

            if (error) return `${error.name} ${error.message}`

            if (poolHourDatas.length === 0) return []

            return poolHourDatas

        } catch (err) {
            throw new Error('Pool last not empty failed:' + err)
        }
    }

    async function fetchPoolLastEntry(pool: string): Promise<LastPoolSubgraph[] | string> {
        try {

            const {
                data: { poolHourDatas },
                error
            } = await dataClient.query<SubgraphResponse<LastPoolSubgraph[]>>({
                query: CHART_POOL_LAST_ENTRY(pool),
                fetchPolicy: 'network-only'
            })

            if (error) return `${error.name} ${error.message}`

            return poolHourDatas

        } catch (err) {
            throw new Error('Fees last failed: ' + err)
        }
    }

    const fetchStaking = useCallback(async (id: string) => {

        setStakes(null)

        try {
            setStakesLoading(true)

            const {
                data: { factories, stakes },
                error
            } = await stakerClient.query<SubgraphResponseStaking<FactorySubgraph[], StakeSubgraph[]>>({
                query: GET_STAKE(id),
                fetchPolicy: 'network-only'
            })

            if (error) {
                setStakes('failed')
                return
            }

            setStakesLoading(false)
            setStakes({ factories, stakes })

        } catch (err) {
            setStakesLoading(false)
            setStakes('failed')
        }
    }, [account])

    async function fetchFeePool(pool: string, startTimestamp: number, endTimestamp: number) {
        try {
            setFeesLoading(true)

            const { data: { feeHourDatas } } = await dataClient.query<SubgraphResponse<FeeSubgraph[]>>({
                query: CHART_FEE_POOL_DATA(pool, startTimestamp, endTimestamp),
                fetchPolicy: 'network-only'
            })

            const _feeHourData = feeHourDatas.length === 0 ? await fetchLastEntry(pool) : feeHourDatas

            if (typeof _feeHourData === 'string') return

            const previousData = await fetchLastNotEmptyEntry(pool, _feeHourData[0].timestamp)

            if (typeof previousData === 'string') return

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

            setFees('Failed')
        } finally {
            setFeesLoading(false)
        }
    }

    async function fetchChartPoolData(pool: string, startTimestamp: number, endTimestamp: number) {
        try {

            setChartPoolDataLoading(true)

            const {
                data: { poolHourDatas },
                error
            } = await dataClient.query<SubgraphResponse<LastPoolSubgraph[]>>({
                query: CHART_POOL_DATA(pool, startTimestamp, endTimestamp),
                fetchPolicy: 'network-only'
            })

            if (error) return

            const _poolHourDatas = poolHourDatas.length === 0 ? await fetchPoolLastEntry(pool) : poolHourDatas

            if (typeof _poolHourDatas === 'string') return

            const previousData = await fetchPoolLastNotEmptyEntry(pool, String(poolHourDatas[0].periodStartUnix))

            if (typeof previousData === 'string') return

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
            setChartPoolData('Chart pool data failed: ' + err)
        } finally {
            setChartPoolDataLoading(false)
        }
    }

    async function fetchStakingHistory() {
        try {
            setHistoriesLoading(true)

            const {
                data: { histories },
                error
            } = await stakerClient.query<SubgraphResponse<HistoryStakingSubgraph[]>>({
                query: GET_STAKE_HISTORY(),
                fetchPolicy: 'network-only'
            })

            if (error) {
                setHistories('Getting histories failed')
                return
            }

            setHistories(histories)

        } catch (e) {
            setHistories('Getting histories failed')
            return
        } finally {
            setHistoriesLoading(false)
        }
    }

    async function fetchTotalStats() {

        try {

            setTotalStatsLoading(true)

            const [_block24, _block48, _blockWeek] = [block24, block48, blockWeek].sort((a, b) => +b.timestamp - +a.timestamp)

            const {
                data: data,
                error: error
            } = await dataClient.query<SubgraphResponse<TotalStatSubgraph[]>>({
                query: TOTAL_STATS(),
                fetchPolicy: 'network-only'
            })

            if (error) {
                setTotalStats('Failed')
                return
            }

            const {
                data: data24,
                error: error24
            } = await dataClient.query<SubgraphResponse<TotalStatSubgraph[]>>({
                query: TOTAL_STATS(_block24.number),
                fetchPolicy: 'network-only'
            })

            if (error24) {
                setTotalStats('Failed')
                return
            }

            const stats = data.factories[0]
            const stats24 = data24.factories[0]

            const volumeUSD = stats && stats24 ? parseFloat(stats.totalVolumeUSD) - parseFloat(stats24.totalVolumeUSD) : parseFloat(stats.totalVolumeUSD)

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
        getStakes: { stakesResult, stakesLoading, fetchStakingFn: fetchStaking },
        fetchStakedHistory: {
            historiesLoading,
            stakeHistoriesResult,
            fetchStakingHistoryFn: fetchStakingHistory
        },
        fetchChartFeesData: { feesResult, feesLoading, fetchFeePoolFn: fetchFeePool },
        fetchChartPoolData: {
            chartPoolData,
            chartPoolDataLoading,
            fetchChartPoolDataFn: fetchChartPoolData
        },
        fetchTotalStats: { totalStats, totalStatsLoading, fetchTotalStatsFn: fetchTotalStats }
    }
}
