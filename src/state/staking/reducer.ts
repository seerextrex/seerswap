import { createReducer } from '@reduxjs/toolkit'
import { limitRefundeeAddress, limitRewardAmount, limitTime, TimePart } from './actions'

interface StakingState {
    readonly poolAddress: string
    readonly rewardAddress: string
    readonly reward: string
    readonly [TimePart.START_TIME]: number
    readonly [TimePart.END_TIME]: number
}

const initialState: StakingState = {
    poolAddress: '',
    rewardAddress: '',
    reward: '0',
    [TimePart.START_TIME]: Date.now(),
    [TimePart.END_TIME]: 0
}

export default createReducer<StakingState>(initialState, (builder) =>
    builder.addCase(limitRewardAmount, (state, { payload: { amount } }) => {
        return {
            ...state,
            reward: amount
        }
    })
        .addCase(limitRefundeeAddress, (state, { payload: { address } }) => {
            return {
                ...state,
                refundee: address
            }
        })
        .addCase(limitTime, (state, { payload: { part, time } }) => {
            return {
                ...state,
                [TimePart[part]]: time
            }
        })
)
