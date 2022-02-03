import { FeeSubgraph, LastPoolSubgraph, TokenSubgraph } from './responseSubgraph'
import JSBI from 'jsbi'
import { Token } from '@uniswap/sdk-core'

export interface FormattedPool {
  address: string
  apr: number
  exists: boolean
  fee: string
  token0: TokenSubgraph
  token1: TokenSubgraph
  totalValueLockedUSD: string
  tvlUSD: number
  tvlUSDChange: number
  volumeUSD: number
  volumeUSDChange: number
  volumeUSDWeek: number
}

export interface FormattedToken {
  address: string
  exists: boolean
  feesUSD: number
  name: string
  priceUSD: number
  priceUSDChange: number
  priceUSDChangeWeek: number
  symbol: string
  tvlToken: number
  tvlUSD: number
  tvlUSDChange: number
  txCount: number
  volumeUSD: number
  volumeUSDChange: number
  volumeUSDWeek: number
}

export interface FormattedFee {
  data: FeeSubgraph[]
  previousData: FeeSubgraph[]
}

export interface FormattedChartPool {
  data: LastPoolSubgraph[]
  previousData: LastPoolSubgraph[]
}

export interface FormattedTotalStats {
  tvlUSD: number
  volumeUSD: number
}

export interface Liquidity {
  liquidityGross: string
  liquidityNet: string
  price0: string
  price1: string
  tickIdx: string
}

export interface ActiveTick {
  liquidityActive: JSBI
  tickIdx: number
  liquidityNet: JSBI
  price0: string
  price1: string
  liquidityGross: JSBI
}

export interface TokenTick {
  address: string
  chainId: number
  decimals: number
  isNative: boolean
  isToken: boolean
  name: string | undefined
  symbol: string | undefined
}

export interface FormattedTick {
  activeTickIdx: number
  tickSpacing: number
  token0: Token
  token1: Token
  ticksProcessed: ActiveTick[]
}

export interface FormattedFeeChart {
  timestamp: Date
  value: number
}