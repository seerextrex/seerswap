import { createReducer } from '@reduxjs/toolkit'
import { isFarming } from './actions'

interface Farming {
    endTime: string
    startTime: string
    eternalFarmings: boolean
}

const initialState: Farming = {
    endTime: '',
    startTime: '',
    eternalFarmings: false
}

export default createReducer(initialState, (builder) =>
    builder
        .addCase(isFarming, (farms, { payload: { endTime = '', startTime = '', eternalFarmings = false } }) => {
            return {
                startTime,
                endTime,
                eternalFarmings
            }
        })
)
