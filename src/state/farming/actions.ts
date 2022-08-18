import { createAction } from '@reduxjs/toolkit'

export const isFarming = createAction<{ startTime: string, endTime: string, eternalFarmings: boolean }>('farming/getFarms')
export const hasTransferredPositions = createAction<boolean>('farming/hasTransferredPositions')