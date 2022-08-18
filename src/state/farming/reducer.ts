import { createReducer } from '@reduxjs/toolkit'
import { hasTransferredPositions, isFarming } from './actions'

interface Farming {
    endTime: string
    startTime: string
    eternalFarmings: boolean
    hasTransferred: boolean
}

const initialState: Farming = {
    endTime: '',
    startTime: '',
    eternalFarmings: false,
    hasTransferred: false
}

export default createReducer(initialState, (builder) =>
    builder
        .addCase(isFarming, (state, {
            payload: {
                endTime = '',
                startTime = '',
                eternalFarmings = false
            }
        }) => {
            return {
                ...state,
                startTime,
                endTime,
                eternalFarmings
            }
        })
        .addCase(hasTransferredPositions, (state, { payload: hasTransferred }) => {
            return {
                ...state,
                hasTransferred
            }
        })
)
