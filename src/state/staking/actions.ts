import { createAction } from '@reduxjs/toolkit'

export enum TimePart {
    START_TIME = 'START_TIME',
    END_TIME = 'END_TIME'
}

export const limitRewardAmount = createAction<{ amount: string }>('farming/limitRewardAmount')
export const limitBonusRewardAmount = createAction<{ amount: string }>('farming/limitBonusRewardAmount')
export const limitRefundeeAddress = createAction<{ address: string }>('farming/limitRefundeeAddress')
export const limitTime = createAction<{ part: TimePart, time: number }>('farming/limitTime')