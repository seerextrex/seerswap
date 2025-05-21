// import { BigNumber } from 'ethers' // Removed import

export interface PositionPool {
    fee: undefined | string
    feeGrowthInside0LastX128: bigint
    feeGrowthInside1LastX128: bigint
    liquidity: bigint
    nonce: bigint
    operator: string
    tickLower: number
    tickUpper: number
    token0: string
    token1: string
    tokenId: bigint
    tokensOwed0: bigint
    tokensOwed1: bigint
    onFarming?: boolean
    oldFarming?: boolean
}
