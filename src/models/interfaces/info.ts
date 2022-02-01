import { TokenSubgraph } from './responseSubgraph'

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