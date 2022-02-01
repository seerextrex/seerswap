export interface PoolSubgraph {
  fee: string
  feesUSD: string
  id: string
  liquidity: string
  sqrtPrice: string
  tick: string
  token0: TokenSubgraph
  token0Price: string
  token1: TokenSubgraph
  token1Price: string
  totalValueLockedToken0: string
  totalValueLockedToken1: string
  totalValueLockedUSD: string
  txCount: string
  volumeUSD: string
}

export interface PoolAddressSubgraph {
  id: string
}

//TODO type key
export interface SubgraphResponse<T> {
  [key: string] : T
}
export interface TokenInSubgraph {
  derivedMatic: string
  feesUSD: string
  id: string
  name: string
  symbol: string
  totalValueLocked: string
  totalValueLockedUSD: string
  txCount: string
  volume: string
  volumeUSD: string
}

export interface TokenAddressSubgraph {
  id: string
}

export interface TokenSubgraph {
  decimals: string
  derivedMatic: string
  id: string
  name: string
  symbol: string
}