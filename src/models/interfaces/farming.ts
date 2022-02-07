import { BigNumber } from '@ethersproject/bignumber'
import { PoolChartSubgraph, TokenSubgraph } from './responseSubgraph'

export interface Deposit {
    L2tokenId: string
    enteredInEternalFarming: string
    eternalBonusEarned: string
    eternalBonusRewardToken: TokenSubgraph
    eternalEarned: string
    eternalEndTime: string
    eternalFarming: string
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
}

export interface DefaultFarming {
    hash: string | null
    id: string | null
    error?: unknown
}

// export interface GetRewardsHashInterface {
//
// }

export interface EternalCollectRewardHandlerInterface {
    pool: PoolChartSubgraph
    eternalRewardToken: TokenSubgraph
    eternalBonusRewardToken:TokenSubgraph
    eternalStartTime: string
    eternalEndTime: string
}

export interface GetRewardsHandlerInterface extends EternalCollectRewardHandlerInterface{
    incentiveRewardToken: TokenSubgraph
    incentiveBonusRewardToken: TokenSubgraph
    incentiveStartTime: string
    incentiveEndTime: string
}
