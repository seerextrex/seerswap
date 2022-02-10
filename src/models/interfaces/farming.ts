import { BigNumber } from '@ethersproject/bignumber'
import { PoolChartSubgraph, TokenSubgraph } from './responseSubgraph'

export interface Deposit {
    L2tokenId: string
    enteredInEternalFarming: string
    eternalBonusEarned: string | number
    eternalBonusRewardToken: TokenSubgraph
    eternalEarned: string | number
    eternalEndTime: string
    eternalFarming: string | null
    eternalRewardToken: TokenSubgraph
    eternalStartTime: string
    id: string
    incentive: null
    liquidity: BigNumber
    onFarmingCenter: boolean
    owner: string
    pool: PoolChartSubgraph
    tickLower: number
    tickUpper: number
    token0: string
    token1: string
    l2TokenId: string | null
}

export interface StakeDefault {
    rewardToken: string
    bonusRewardToken: string
    pool: string
    startTime: string
    endTime: string
}

export interface DefaultFarming {
    hash: string | null
    id: string | null
}

export interface DefaultNFT {
    id: string
    onFarmingCenter: boolean
}

export interface ApprovedNFT {
    id: string
    approved: boolean
}

export interface DefaultFarmingWithError extends DefaultFarming {
    error?: unknown
}

export interface GetRewardsHashInterface {
    hash: string | null
    id: string | null
    farmingType: number | null
}

export interface EternalCollectRewardHandlerInterface {
    pool: PoolChartSubgraph
    eternalRewardToken: TokenSubgraph
    eternalBonusRewardToken: TokenSubgraph
    eternalStartTime: string
    eternalEndTime: string
}

export interface GetRewardsHandlerInterface extends EternalCollectRewardHandlerInterface {
    incentiveRewardToken: TokenSubgraph
    incentiveBonusRewardToken: TokenSubgraph
    incentiveStartTime: string
    incentiveEndTime: string
}


export interface RewardInterface {
    id: string | null
    state: string | null
    farmingType: number | null
}

export interface UnstakingInterface {
    id: string | null
    state: string | null
}

export interface FormattedRewardInterface {
    amount: number
    id: string
    name: string
    owner: string
    rewardAddress: string
    symbol: string
    trueAmount: string
}
