import { gql } from '@apollo/client'

//Farming

export const ONE_FARMING_EVENT = () => gql`
query incentive {
   incentives(orderBy: createdAtTimestamp, orderDirection: desc, first: 1, where: {startTime_gt: ${Math.round(Date.now() / 1000)}}) {
    startTime,
    endTime
  }
}
`

export const ONE_ETERNAL_FARMING = () => gql`
  query eternalFarm {
    eternalFarmings (where: { isDetached: false }, first: 1) {
      startTime
      endTime
    }
  }
`

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
        pool
        startTime
        endTime
        reward
        bonusReward
        createdAtTimestamp
    }
}`

export const FETCH_ETERNAL_FARM = farmId => gql`
  query fetchEternalFarm {
    eternalFarmings (where: { id: "${farmId}" }) {
      id
      rewardToken
      bonusRewardToken
      pool
      startTime
      endTime
      reward
      bonusReward
      rewardRate
      bonusRewardRate
      isDetached
    }
  }
`

export const FETCH_ETERNAL_FARM_FROM_POOL = pools => {
  let poolString = `[`
  pools.map((address) => {
    return (poolString += `"${address}",`)
  })
  poolString += ']'
  const queryString =
    `
      query eternalFarmingsFromPools {
        eternalFarmings(where: {pool_in: ${poolString}}) {
          id
          rewardToken
          bonusRewardToken
          pool
          startTime
          endTime
          reward
          bonusReward
          rewardRate
          bonusRewardRate
          isDetached
        }
      }
      `

  return gql(queryString)
}


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
        sqrtPrice
        liquidity
        tick
        feesUSD
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
      untrackedVolumeUSD
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
      untrackedVolumeUSD
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
      untrackedVolumeUSD
    }
  }
`

export const TOTAL_STATS = (block?: number) => gql`
  query totalStats {
    factories ${block ? `(block: { number: ${block} })` : ''} {
      totalVolumeUSD
      untrackedVolumeUSD
      totalValueLockedUSD
      totalValueLockedUSDUntracked
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
    }
}`

export const FROZEN_STAKED = (account: string) => gql`
   query frozenStaked  {
     stakeTxes (where: {owner: "${account.toLowerCase()}", timestamp_gte: ${Math.round(Date.now() / 1000)}}, orderBy: timestamp, orderDirection: asc) {
     timestamp
     stakedALGBAmount
     xALGBAmount
   }
}
`

export const TRANSFERED_POSITIONS = (account: string) => gql`
    query transferedPositions {
        deposits (orderBy: id, orderDirection: desc, where: {owner: "${account}", onFarmingCenter: true}) {
            id
            owner
            pool
            L2tokenId
            incentive
            eternalFarming
            onFarmingCenter
            enteredInEternalFarming
    }
}
`

export const POSITIONS_ON_ETERNAL_FARMING = (account: string) => gql`
  query positionsOnEternalFarming {
    deposits (orderBy: id, orderDirection: desc, where: { owner: "${account}", onFarmingCenter: true, eternalFarming_not: null }) {
      id
      owner
      pool
      L2tokenId
      eternalFarming
      onFarmingCenter
      enteredInEternalFarming
    }
  }
`

export const TRANSFERED_POSITIONS_FOR_POOL = (account, pool) => gql`
query transferedPositionsForPool {
    deposits (orderBy: id, orderDirection: desc, where: {owner: "${account}", pool: "${pool}"}) {
        id
        owner
        pool
        L2tokenId
        incentive
        eternalFarming
        onFarmingCenter
        enteredInEternalFarming
    }
}`

export const POSITIONS_OWNED_FOR_POOL = (account, pool) => gql`
query positionsOwnedForPool {
    deposits (orderBy: id, orderDirection: desc, where: {owner: "${account}",  pool: "${pool}"}) {
        id
        owner
        pool
        L2tokenId
        incentive
        eternalFarming
        enteredInEternalFarming
    }
}`

//Info

export const INFINITE_EVENTS = gql`
    query infiniteFarms {
        eternalFarmings (where: {isDetached: false}) {
            id
            rewardToken
            bonusRewardToken
            pool
            startTime
            endTime
            reward
            bonusReward
            rewardRate
            bonusRewardRate
        }
    }
`

export const SWAPS_PER_DAY = (startTimestamp: string) => gql`
  query swapsPerDay {
    swaps (first: 1000, where: {timestamp_gt: ${startTimestamp}, timestamp_lt: ${Math.round(Date.now() / 1000)}} ) {
      pool {
        id
      }
      timestamp
      tick
      amountUSD
    }
  }
`
export const ALL_POSITIONS = gql`
query allPositions {
  positions (first: 1000) {
    pool {
      id
    }
    id
    liquidity
    tickLower {
      tickIdx
      liquidityGross
    }
    tickUpper {
      tickIdx
      liquidityGross
    }
    transaction {
      mints {
        amountUSD
      }
    }
  }
}
`

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

export const GET_STAKE = (id: string) => gql`
query stakeHistory {
  factories {
    currentStakedAmount
    earnedForAllTime
    ALGBbalance
    xALGBtotalSupply
  }
  stakes (where:{id: "${id}"}) {
    stakedALGBAmount
    xALGBAmount
  }
}
`

export const GET_STAKE_HISTORY = () => gql`
query stake {
  histories(where: { date_gte: 1642626000 }) {
  date
  currentStakedAmount
  ALGBbalance
  xALGBminted
  xALGBburned
  xALGBtotalSupply
  ALGBfromVault
}
}
`

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
