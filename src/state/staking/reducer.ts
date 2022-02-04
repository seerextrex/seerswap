import { createReducer } from '@reduxjs/toolkit'
import { incentiveRefundeeAddress, incentiveRewardAmount, incentiveTime, TimePart } from './actions'

interface StakingState {
    readonly poolAddress: string
    readonly rewardAddress: string
    readonly reward: string
    readonly refundee: string
    readonly [TimePart.START_TIME]: number
    readonly [TimePart.END_TIME]: number
}

const initialState: StakingState = {
    poolAddress: '',
    rewardAddress: '',
    reward: '0',
    refundee: '',
    [TimePart.START_TIME]: Date.now(),
    [TimePart.END_TIME]: 0
}

export default createReducer<StakingState>(initialState, (builder) =>
    builder.addCase(incentiveRewardAmount, (state, { payload: { amount } }) => {
        return {
            ...state,
            reward: amount
        }
    })
        .addCase(incentiveRefundeeAddress, (state, { payload: { address } }) => {
            return {
                ...state,
                refundee: address
            }
        })
        .addCase(incentiveTime, (state, { payload: { part, time } }) => {
            return {
                ...state,
                [TimePart[part]]: time
            }
        })
)
