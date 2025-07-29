import { gql } from "@apollo/client";
import { logDOM } from "@testing-library/react";

//Farming

export const ONE_FARMING_EVENT = gql`
    query limitFarm($time: BigInt) {
        limitFarmings(orderBy: createdAtTimestamp, orderDirection: desc, first: 1, where: { startTime_gt: $time, isDetached: false }) {
            startTime
            endTime
        }
    }
`;

export const ONE_ETERNAL_FARMING = gql`
    query eternalFarm {
        eternalFarmings(where: { isDetached: false }, first: 1) {
            startTime
            endTime
        }
    }
`;

export const FETCH_REWARDS = gql`
    query fetchRewards($account: Bytes) {
        rewards(orderBy: amount, orderDirection: desc, where: { owner: $account }) {
            id
            rewardAddress
            amount
            owner
        }
    }
`;

export const FETCH_TOKEN = gql`
    query fetchToken($tokenId: ID!) {
        tokens(where: { id: $tokenId }) {
            id
            symbol
            name
            decimals
        }
    }
`;

export const FETCH_LIMIT = gql`
    query fetchLimit($limitFarmingId: ID!) {
        limitFarmings(where: { id: $limitFarmingId }) {
            id
            rewardToken
            bonusRewardToken
            pool
            startTime
            endTime
            reward
            bonusReward
            multiplierToken
            createdAtTimestamp
            tier1Multiplier
            tier2Multiplier
            tier3Multiplier
            tokenAmountForTier1
            tokenAmountForTier2
            tokenAmountForTier3
            enterStartTime
            isDetached
        }
    }
`;

export const FETCH_ETERNAL_FARM = gql`
    query eternalFarmings($farmId: ID!) {
        eternalFarmings(where: { id: $farmId }) {
            id
            isDetached
            pool {
                id
            }
            rewardToken
            bonusRewardToken
            rewardRate
            bonusRewardRate
            startTime
            endTime
            virtualPool
            multiplierToken
            tokenAmountForTier1
            tokenAmountForTier2
            tokenAmountForTier3
            tier1Multiplier
            tier2Multiplier
            tier3Multiplier
        }
    }
`;

export const FETCH_ETERNAL_FARM_FROM_POOL = gql`
  query eternalFarmingsFromPools($pools: [String!]!, $currentTime: BigInt!) {
    eternalFarmings(
      where: {pool_in: $pools, isDetached: false, endTime_gt: $currentTime, endTimeImplied_gt: $currentTime}
    ) {
      id
      rewardToken
      bonusRewardToken
      pool {
        id
        market0 {
          id
          marketName
          image {
            id
            cidMarket
            cidOutcomes
          }
          wrappedTokensString
          tokens {
            id
            name
          }
        }
        market1 {
          id
          marketName
          image {
            id
            cidMarket
            cidOutcomes
          }
          wrappedTokensString
          tokens {
            id
            name
          }
        }
      }
      startTime
      endTime
      reward
      bonusReward
      rewardRate
      bonusRewardRate
      isDetached
    }
  }
`;

export const FETCH_LIMIT_FARM_FROM_POOL = gql`
  query limitFarmingsFromPools($pools: [Bytes!]!, $currentTime: BigInt!) {
    limitFarmings(where: {pool_in: $pools, isDetached: false, endTime_gt: $currentTime}) {
      id
      createdAtTimestamp
      rewardToken
      bonusReward
      bonusRewardToken
      pool
      startTime
      endTime
      reward
      multiplierToken
      tokenAmountForTier1
      tokenAmountForTier2
      tokenAmountForTier3
      tier1Multiplier
      tier2Multiplier
      tier3Multiplier
      enterStartTime
      isDetached
    }
  }
`;

export const FETCH_POOL = gql`
    query fetchPool($poolId: ID!) {
        pools(where: { id: $poolId }) {
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
            market0 {
                id
                marketName
                wrappedTokensString
                image {
                    id
                    cidMarket
                    cidOutcomes
                }
                tokens {
                    id
                    name
                }
            }
            market1 {
                id
                marketName
                wrappedTokensString
                image {
                    id
                    cidMarket
                    cidOutcomes
                }
                tokens {
                    id
                    name
                }
            }
        }
    }
`;

export const FETCH_POOLS_BY_IDS = gql`
    query fetchPoolsByIds($poolIds: [ID!]!) {
        pools(where: { id_in: $poolIds }) {
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
            totalValueLockedUSD
            market0 {
                id
                marketName
                wrappedTokensString
                image {
                    id
                    cidMarket
                    cidOutcomes
                }
                tokens {
                  id
                  name
                }
            }
            market1 {
                id
                marketName
                wrappedTokensString
                image {
                    id
                    cidMarket
                    cidOutcomes
                }
                tokens {
                  id
                  name
                }
            }
        }
    }
`;

export const FETCH_TOKENS_BY_IDS = gql`
    query fetchTokensByIds($tokenIds: [ID!]!) {
        tokens(where: {id_in: $tokenIds}) {
            id
            symbol
            name
            decimals
            derivedMatic # Using this as derivedETH is not available on the subgraph
        }
    }
`;

export const CHART_FEE_POOL_DATA = gql`
    query feeHourData($pool: String!, $startTimestamp: BigInt!, $endTimestamp: BigInt!) {
        feeHourDatas(first: 1000, where: { pool: $pool, timestamp_gte: $startTimestamp, timestamp_lte: $endTimestamp }) {
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
`;

export const CHART_FEE_LAST_ENTRY = gql`
    query lastFeeHourData($pool: String!) {
        feeHourDatas(first: 1, orderBy: timestamp, orderDirection: desc, where: { pool: $pool }) {
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
`;
export const CHART_FEE_LAST_NOT_EMPTY = gql`
    query lastNotEmptyHourData($pool: String!, $timestamp: BigInt!) {
        feeHourDatas(first: 1, orderBy: timestamp, orderDirection: desc, where: { pool: $pool, timestamp_lt: $timestamp }) {
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
`;

export const CHART_POOL_LAST_NOT_EMPTY = gql`
    query lastNotEmptyPoolHourData($pool: ID!, $timestamp: Int!) {
        poolHourDatas(first: 1, orderBy: periodStartUnix, orderDirection: desc, where: { pool_: { id: $pool }, periodStartUnix_lt: $timestamp }) {
            periodStartUnix
            volumeUSD
            tvlUSD
            feesUSD
            untrackedVolumeUSD
            token1Price
            token0Price
        }
    }
`;

export const CHART_POOL_LAST_ENTRY = gql`
    query lastPoolHourData($pool: ID!) {
        poolHourDatas(first: 1, where: { pool_: { id: $pool } }, orderBy: periodStartUnix, orderDirection: desc) {
            periodStartUnix
            volumeUSD
            tvlUSD
            feesUSD
            untrackedVolumeUSD
        }
    }
`;

export const CHART_POOL_DATA = gql`
    query poolHourData($pool: ID!, $startTimestamp: Int!, $endTimestamp: Int!) {
        poolHourDatas(
            first: 1000
            where: { pool_: { id: $pool }, periodStartUnix_gte: $startTimestamp, periodStartUnix_lte: $endTimestamp }
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
`;

export const LAST_EVENT = gql`
    query lastEvent {
        limitFarmings(first: 1, orderDirection: desc, orderBy: createdAtTimestamp, where: { isDetached: false }) {
            createdAtTimestamp
            id
            startTime
            endTime
        }
    }
`;

export const FUTURE_EVENTS = gql`
    query futureEvents($timestamp: BigInt!) {
        limitFarmings(orderBy: startTime, orderDirection: asc, where: { startTime_gt: $timestamp, isDetached: false }) {
            id
            createdAtTimestamp
            rewardToken
            bonusReward
            bonusRewardToken
            pool
            startTime
            endTime
            reward
            tier1Multiplier
            tier2Multiplier
            tier3Multiplier
            tokenAmountForTier1
            tokenAmountForTier2
            tokenAmountForTier3
            multiplierToken
            enterStartTime
            isDetached
        }
    }
`;

export const CURRENT_EVENTS = gql`
    query currentEvents($startTime: BigInt!, $endTime: BigInt!) {
        limitFarmings(orderBy: endTime, orderDirection: desc, where: { startTime_lte: $startTime, endTime_gt: $endTime, isDetached: false }) {
            id
            rewardToken
            bonusReward
            bonusRewardToken
            pool
            startTime
            endTime
            reward
            tier1Multiplier
            tier2Multiplier
            tier3Multiplier
            tokenAmountForTier1
            tokenAmountForTier2
            tokenAmountForTier3
            enterStartTime
            multiplierToken
            isDetached
        }
    }
`;

export const FETCH_FINITE_FARM_FROM_POOL = gql`
  query limitFarmingsFromPools($pools: [Bytes!]!, $currentTime: BigInt!) {
    limitFarmings(where: {pool_in: $pools, isDetached: false, endTime_gt: $currentTime}) {
        id
        createdAtTimestamp
        rewardToken
        bonusReward
        bonusRewardToken
        pool
        startTime
        endTime
        reward
        multiplierToken
        tokenAmountForTier1
        tokenAmountForTier2
        tokenAmountForTier3
        tier1Multiplier
        tier2Multiplier
        tier3Multiplier
        enterStartTime
        isDetached
    }
  }
`;

export const TRANSFERED_POSITIONS = (tierFarming: boolean) => gql`
    query transferedPositions ($account: Bytes) {
        deposits (orderBy: id, orderDirection: desc, where: {owner: $account, onFarmingCenter: true}) {
            id
            owner
            pool {
              id
            }
            L2tokenId
            limitFarming {
              id
            }
            eternalFarming {
              id
            }
            onFarmingCenter
            ${tierFarming
    ? `
              enteredInEternalFarming
              tokensLockedEternal
              tokensLockedLimit
              tierLimit
              tierEternal`
    : ""
  }
    }
}
`;

export const HAS_TRANSFERED_POSITIONS = gql`
    query hasTransferedPositions($account: Bytes!) {
        deposits(first: 1, where: { owner: $account, onFarmingCenter: true }) {
            id
        }
    }
`;

export const POSITIONS_ON_ETERNAL_FARMING = gql`
    query positionsOnEternalFarming($account: Bytes!) {
        deposits(orderBy: id, orderDirection: desc, where: { owner: $account, onFarmingCenter: true, eternalFarming_not: null }) {
            id
            owner
            pool {
              id
            }
            L2tokenId
            eternalFarming {
              id
            }
            onFarmingCenter
            enteredInEternalFarming
        }
    }
`;

export const TRANSFERED_POSITIONS_FOR_POOL = gql`
    query transferedPositionsForPool($account: Bytes!, $pool: ID!) {
        deposits(orderBy: id, orderDirection: desc, where: { owner: $account, pool_: { id: $pool }, liquidity_not: "0" }) {
            id
            owner
            pool {
              id
            }
            L2tokenId
            limitFarming {
              id
            }
            eternalFarming {
              id
            }
            onFarmingCenter
            enteredInEternalFarming
            tokensLockedLimit
            tokensLockedEternal
            tierLimit
            tierEternal
        }
    }
`;

//Info

export const POSITIONS_ON_FARMING = gql`
    query positionsOnFarming($account: Bytes!, $pool: ID!) {
        deposits(orderBy: id, orderDirection: desc, where: { owner: $account, pool_: { id: $pool }, onFarmingCenter: true }) {
            id
        }
    }
`;

export const FULL_POSITIONS = gql`
  query fullPositionsPriceRange($account: Bytes, $pool: String!, $positions: [ID!]!) {
    q1: positions (where: {owner: $account, pool: $pool}) {
      owner
      liquidity
      id
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
    }
    q2: positions (where: {id_in: $positions}) {
      owner
      liquidity
      id
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
    }
  }
`;

export const INFINITE_EVENTS = gql`
    query infiniteFarms($endTime: BigInt!) {
        eternalFarmings(where: { isDetached: false, endTime_gt: $endTime, reward_gt: 0, endTimeImplied_gt: $endTime }) {
            id
            rewardToken
            bonusRewardToken
            pool {
              id
              market0 {
                id
                marketName
                totalValueLockedUSD
                wrappedTokensString
                image {
                  id
                  cidMarket
                  cidOutcomes
                }
                tokens {
                  id
                  name
                }
              }
              market1 {
                id
                marketName
                wrappedTokensString
                totalValueLockedUSD
                image {
                  id
                  cidMarket
                  cidOutcomes
                }
                tokens {
                  id
                  name
                }
              }
            }
            startTime
            endTime
            reward
            bonusReward
            rewardRate
            bonusRewardRate

            tokenAmountForTier1
            tokenAmountForTier2
            tokenAmountForTier3
            tier1Multiplier
            tier2Multiplier
            tier3Multiplier
            multiplierToken
        }
    }
`;

export const TOP_POOLS = gql`
    query topPools {
        pools(first: 100, orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
            id
        }
    }
`;

// For fetching with a specific block
export const POOLS_FROM_ADDRESSES_HISTORICAL = gql`
  query getPoolsFromAddressesHistorical($pools: [ID!]!, $blockNumber: Int!) {
    pools(
      where: {id_in: $pools}
      block: {number: $blockNumber}
      orderBy: totalValueLockedUSD
      orderDirection: desc
      subgraphError: allow
    ) {
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
`;

// For fetching latest block data
export const POOLS_FROM_ADDRESSES_LATEST = gql`
  query getPoolsFromAddressesLatest($pools: [ID!]!) {
    pools(
      where: {id_in: $pools}
      orderBy: totalValueLockedUSD
      orderDirection: desc
      subgraphError: allow
    ) {
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
`;

export const TOP_TOKENS = gql`
    query topTokens {
        tokens(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
            id
        }
    }
`;

// For fetching with a specific block
export const TOKENS_FROM_ADDRESSES_HISTORICAL = gql`
  query getTokensFromAddressesHistorical($tokens: [ID!]!, $blockNumber: Int!) {
    tokens(
      where: {id_in: $tokens}
      block: {number: $blockNumber}
      orderBy: totalValueLockedUSD
      orderDirection: desc
      subgraphError: allow
    ) {
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
`;

// For fetching latest block data
export const TOKENS_FROM_ADDRESSES_LATEST = gql`
  query getTokensFromAddressesLatest($tokens: [ID!]!) {
    tokens(
      where: {id_in: $tokens}
      orderBy: totalValueLockedUSD
      orderDirection: desc
      subgraphError: allow
    ) {
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
`;

// For fetching with a specific block
export const TOTAL_STATS_HISTORICAL = gql`
  query totalStatsHistorical($blockNumber: Int!) {
    factories(block: { number: $blockNumber }) {
      totalVolumeUSD
      untrackedVolumeUSD
      totalValueLockedUSD
      totalValueLockedUSDUntracked
      txCount
      totalFeesUSD
    }
  }
`;

// For fetching latest block data
export const TOTAL_STATS_LATEST = gql`
  query totalStatsLatest {
    factories {
      totalVolumeUSD
      untrackedVolumeUSD
      totalValueLockedUSD
      totalValueLockedUSDUntracked
      txCount
      totalFeesUSD
    }
  }
`;

//Blocklytics

export const GET_BLOCK_BY_TIMESTAMP_RANGE = gql`
  query getBlockByTimestampRange($timestamp_gt: BigInt!, $timestamp_lt: BigInt!) {
    blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: {timestamp_gt: $timestamp_gt, timestamp_lt: $timestamp_lt}) {
      number
    }
  }
`;

//Ticks

export const FETCH_TICKS = gql`
    query surroundingTicks($poolAddress: String!, $tickIdxLowerBound: BigInt!, $tickIdxUpperBound: BigInt!, $skip: Int!) {
        ticks(subgraphError: allow, first: 1000, skip: $skip, where: { poolAddress: $poolAddress, tickIdx_lte: $tickIdxUpperBound, tickIdx_gte: $tickIdxLowerBound }) {
            tickIdx
            liquidityGross
            liquidityNet
            price0
            price1
        }
    }
`;

//Add Liquidity

export const FETCH_POPULAR_POOLS = gql`
    query popularPools {
        pools(orderBy: totalValueLockedUSD, orderDirection: desc, first: 6) {
            token0 {
                id
            }
            token1 {
                id
            }
        }
    }
`;

export const FETCH_ETERNAL_FARMS_BY_IDS = (farmIds: string[]) => gql`
    query eternalFarmingsByIds($farmIds: [ID!]!) {
        eternalFarmings(where: { id_in: $farmIds }) {
            id
            isDetached
            pool {
                id
            }
            rewardToken
            bonusRewardToken
            rewardRate
            bonusRewardRate
            startTime
            endTime
            virtualPool
            multiplierToken
            tokenAmountForTier1
            tokenAmountForTier2
            tokenAmountForTier3
            tier1Multiplier
            tier2Multiplier
            tier3Multiplier
        }
    }
`;
