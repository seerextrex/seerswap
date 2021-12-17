import { gql } from "@apollo/client";
import { STAKER_ADDRESS } from "../constants/addresses";

//Farming

export const FETCH_REWARDS = account => gql`
query fetchRewards {
    rewards(orderBy: amount, orderDirection: desc, where: {owner: "${account}"}) {
        id
        rewardAddress
        amount
        owner
    }
}`

export const FETCH_TOKEN = tokenId => gql`
query fetchToken {
    tokens(where: { id: "${tokenId}" }) {
        id
        symbol
        name
        decimals
    }
}`

export const FETCH_INCENTIVE = incentiveId => gql`
query fetchIncentive {
    incentives(where: { id: "${incentiveId}" }) {
        id
        rewardToken
        bonusRewardToken
        startTime
        endTime
        reward
        bonusReward
        ended
        pool
        refundee
    }
}`

export const FETCH_POOL = poolId => gql`
query fetchPool {
    pools(where: { id: "${poolId}" }) {
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

    }
}`

export const CHART_FEE_POOL_DATA = (pool: string, timestampStart: number, timestampFinish: number) => {
  return gql`
  query feeHourData {
    feeHourDatas (first: 1000, where: {pool: "${pool}", timestamp_gte: "${timestampStart}", timestamp_lte: "${timestampFinish}"}) {
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
}

export const CHART_FEE_LAST_ENTRY = (pool: string) => gql`
  query lastFeeHourData {
    feeHourDatas (first: 1, orderBy: timestamp, orderDirection: desc, where: { pool: "${pool}" }) {
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
export const CHART_FEE_LAST_NOT_EMPTY = (pool: string, timestamp: string) => gql`
  query lastNotEmptyHourData {
    feeHourDatas (first: 1, orderBy: timestamp, orderDirection: desc, where: { pool: "${pool}", timestamp_lt: ${timestamp} }) {
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

export const CHART_POOL_LAST_NOT_EMPTY = (pool: string, timestamp: string) => gql`
  query lastNotEmptyPoolHourData {
    poolHourDatas (first: 1, orderBy: periodStartUnix, orderDirection: desc, where: { pool: "${pool}", periodStartUnix_lt: ${timestamp} }) {
      periodStartUnix
      volumeUSD
      tvlUSD
      feesUSD
    }
  }
`

export const CHART_POOL_LAST_ENTRY = (pool: string) => gql`
query lastPoolHourData {
 
  poolHourDatas(
      first: 1
      where: { pool: "${pool}" }
      orderBy: periodStartUnix, 
      orderDirection: desc,
    ) {
      periodStartUnix
      volumeUSD
      tvlUSD
      feesUSD
    }
  }
`

export const CHART_POOL_DATA = (pool: string, startTimestamp: number, endTimestamp) => gql`
  query poolHourData {
    poolHourDatas (
      first: 1000
      where: { pool: "${pool}", periodStartUnix_gte: ${startTimestamp}, periodStartUnix_lte: ${endTimestamp} }
      orderBy: periodStartUnix
      orderDirection: asc
      subgraphError: allow
    ) {
      periodStartUnix
      volumeUSD
      tvlUSD
      feesUSD
    }
  }
`


export const LAST_EVENT = () => gql`
query lastEvent {
    incentives (first: 1, orderDirection: desc, orderBy: createdAtTimestamp) {
        createdAtTimestamp
        id
        startTime
        endTime
      }
 }
`

export const FUTURE_EVENTS = () => gql`
query futureEvents {
    incentives(orderBy: startTime, orderDirection: asc, where: { startTime_gt: "${Math.round(Date.now() / 1000)}" }) {
        id
        createdAtTimestamp
        rewardToken
        bonusReward
        bonusRewardToken
        pool
        startTime
        endTime
        reward
        ended
        refundee
    }
}`

export const CURRENT_EVENTS = () => gql`
query currentEvents {
    incentives(orderBy: endTime, orderDirection: desc, where: { startTime_lte: "${Math.round(Date.now() / 1000)}", endTime_gt: "${Math.round(Date.now() / 1000)}" }) {
        id
        rewardToken
        bonusReward
        bonusRewardToken
        pool
        startTime
        endTime
        reward
        ended
    }
}`

export const TRANSFERED_POSITIONS = (account, chainId) => gql`
    query transferedPositions {
        deposits (orderBy: tokenId, orderDirection: desc, where: {oldOwner: "${account}", owner: "${STAKER_ADDRESS[chainId]}"}) {
            id
            owner
            staked
            liquidity
            approved
            pool
            tokenId
            L2tokenId
            incentive
    }
}
`

export const SHARED_POSITIONS = account => gql`
    query sharedPositions {
        deposits (orderBy: tokenId, orderDirection: desc, where: {owner: "${account}", incentive_not: null}) {
            id
            owner
            staked
            liquidity
            approved
            pool
            tokenId
            L2tokenId
            incentive
    }
}
`

export const TRANSFERED_POSITIONS_FOR_POOL = (account, pool) => gql`
query transferedPositionsForPool {
    deposits (orderBy: tokenId, orderDirection: desc, where: {oldOwner: "${account}", pool: "${pool}"}) {
        id
        owner
        staked
        liquidity
        approved
        pool
        tokenId
        L2tokenId
        incentive
    }
}`

export const POSITIONS_OWNED_FOR_POOL = (account, pool) => gql`
query positionsOwnedForPool {
    deposits (orderBy: tokenId, orderDirection: desc, where: {owner: "${account}",  pool: "${pool}"}) {
        id
        owner
        staked
        liquidity
        approved
        pool
        tokenId
        L2tokenId
        incentive
    }
}`

//Info

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
          feesUSD
          totalValueLockedUSD
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