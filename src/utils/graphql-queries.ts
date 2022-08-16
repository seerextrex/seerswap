import { gql } from '@apollo/client'

export const FETCH_TOKEN = () => gql`
query fetchToken ($tokenId: ID) {
    tokens(where: { id: $tokenId}) {
        id
        symbol
        name
        decimals
    }
}`

export const FETCH_POOL = () => gql`
query fetchPool ($poolId: ID) {
    pools(where: { id: $poolId}) {
        id
        fee
        token0 {
            id
            decimals
            symbol
        }
        token1 {
            id
            decimals
            symbol
        }
        sqrtPrice
        liquidity
        tick
        feesUSD
        untrackedFeesUSD
    }
}`

export const CHART_FEE_POOL_DATA = () => gql`
  query feeHourData ($pool: String, $startTimestamp: BigInt, $endTimestamp: BigInt) {
    feeHourDatas (first: 1000, where: {pool: $pool, timestamp_gte: $startTimestamp, timestamp_lte: $endTimestamp}) {
      id
      pool
      fee
      changesCount
      timestamp
      minFee
      maxFee
      startFee
      endFee
    }
  }
`

export const CHART_FEE_LAST_ENTRY = () => gql`
  query lastFeeHourData ($pool: String) {
    feeHourDatas (first: 1, orderBy: timestamp, orderDirection: desc, where: { pool: $pool}) {
      id
      pool
      fee
      changesCount
      timestamp
      minFee
      maxFee
      startFee
      endFee
    }
  }
`
export const CHART_FEE_LAST_NOT_EMPTY = () => gql`
  query lastNotEmptyHourData ($pool: String, $timestamp: BigInt) {
    feeHourDatas (first: 1, orderBy: timestamp, orderDirection: desc, where: { pool: $pool, timestamp_lt: $timestamp}) {
      id
      pool
      fee
      changesCount
      timestamp
      minFee
      maxFee
      startFee
      endFee
    }
  }
`

export const CHART_POOL_LAST_NOT_EMPTY = () => gql`
  query lastNotEmptyPoolHourData ($pool: String, $timestamp: Int) {
    poolHourDatas (first: 1, orderBy: periodStartUnix, orderDirection: desc, where: { pool: $pool, periodStartUnix_lt: $timestamp}) {
      periodStartUnix
      volumeUSD
      tvlUSD
      feesUSD
      untrackedVolumeUSD
      token1Price
      token0Price
    }
  }
`

export const CHART_POOL_LAST_ENTRY = () => gql`
query lastPoolHourData ($pool: String) {
  poolHourDatas( first: 1, where: { pool: $pool}orderBy: periodStartUnix, orderDirection: desc) {
      periodStartUnix
      volumeUSD
      tvlUSD
      feesUSD
      untrackedVolumeUSD
    }
  }
`

export const CHART_POOL_DATA = () => gql`
  query poolHourData ($pool: String, $startTimestamp: Int, $endTimestamp: Int) {
    poolHourDatas (
      first: 1000
      where: { pool: $pool, periodStartUnix_gte: $startTimestamp, periodStartUnix_lte: $endTimestamp }
      orderBy: periodStartUnix
      orderDirection: asc
      subgraphError: allow
    ) {
      periodStartUnix
      volumeUSD
      tvlUSD
      feesUSD
      untrackedVolumeUSD
      token0Price
      token1Price
    }
  }
`

export const TOTAL_STATS = (block?: number) => {
  const qString = `
  query totalStats {
    factories ${block ? `(block: { number: ${block} })` : ''} {
      totalVolumeUSD
      untrackedVolumeUSD
      totalValueLockedUSD
      totalValueLockedUSDUntracked
    }
  }
`
  return gql(qString)
}

//Info

export const FULL_POSITIONS = (positions: string[], account: string | undefined, pool: string) => {
  const query = `
        query fullPositionsPriceRange {
            q1 : positions (where: {owner: "${account}", pool: "${pool}"})
            {
              owner
              liquidity
              id
              closed
              transaction {
                timestamp
              }
              tickLower {
                price0
                price1
              }
              tickUpper {
                price0
                price1
              }
              token0 {
                decimals
              }
              token1 {
                decimals
              }
              timestamps
            }

            q2: positions (where: {id_in: [${positions}] }) {
              owner
              liquidity
              id
              closed
              transaction {
                timestamp
              }
              tickLower {
                price0
                price1
              }
              tickUpper {
                price0
                price1
              }
               token0 {
                decimals
              }
              token1 {
                decimals
              }
              timestamps
            }
        }
    `
  return gql(query)
}

export const TOP_POOLS = gql`
query topPools {
  pools(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
    id
  }
}
`

export const POOLS_FROM_ADDRESSES = (blockNumber: undefined | number, pools: string[]) => {
  let poolString = `[`
  pools.map((address) => {
    return (poolString += `"${address}",`)
  })
  poolString += ']'
  const queryString =
    `
      query pools {
        pools(where: {id_in: ${poolString}},` +
    (blockNumber ? `block: {number: ${blockNumber}} ,` : ``) +
    ` orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
          id
          fee
          liquidity
          sqrtPrice
          tick
          token0 {
              id
              symbol
              name
              decimals
              derivedMatic
          }
          token1 {
              id
              symbol
              name
              decimals
              derivedMatic
          }
          token0Price
          token1Price
          volumeUSD
          txCount
          totalValueLockedToken0
          totalValueLockedToken1
          totalValueLockedUSD
          totalValueLockedUSDUntracked
          untrackedVolumeUSD
          feesUSD
        }
      }
      `
  return gql(queryString)
}


export const TOP_TOKENS = gql`
  query topTokens {
    tokens(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
      id
    }
  }
`

export const TOKENS_FROM_ADDRESSES = (blockNumber: number | undefined, tokens: string[]) => {
  let tokenString = `[`
  tokens.map((address) => {
    return (tokenString += `"${address}",`)
  })
  tokenString += ']'
  const queryString =
    `
      query tokens {
        tokens(where: {id_in: ${tokenString}},` +
    (blockNumber ? `block: {number: ${blockNumber}} ,` : ``) +
    ` orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
          id
          symbol
          name
          derivedMatic
          volumeUSD
          volume
          txCount
          totalValueLocked
          untrackedVolumeUSD
          feesUSD
          totalValueLockedUSD
          totalValueLockedUSDUntracked
        }
      }
      `

  return gql(queryString)
}

//Blocklytics

export const GET_BLOCKS = (timestamps: string[]) => {
  let queryString = 'query blocks {'
  queryString += timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600
      } }) {
          number
        }`
  })
  queryString += '}'
  return gql(queryString)
}


//Ticks

export const FETCH_TICKS = () => gql`
query surroundingTicks(
  $poolAddress: String!
  $tickIdxLowerBound: BigInt!
  $tickIdxUpperBound: BigInt!
  $skip: Int!
) {
  ticks(
    subgraphError: allow
    first: 1000
    skip: $skip
    where: { poolAddress: $poolAddress, tickIdx_lte: $tickIdxUpperBound, tickIdx_gte: $tickIdxLowerBound }
  ) {
    tickIdx
    liquidityGross
    liquidityNet
    price0
    price1
  }
}
`

//Add Liquidity

export const FETCH_POPULAR_POOLS = () => gql`
query popularPools {
 pools (orderBy: totalValueLockedUSD, orderDirection: desc, first: 6) {
    token0{
      id
    }
    token1 {
      id
    }
  }
}
`