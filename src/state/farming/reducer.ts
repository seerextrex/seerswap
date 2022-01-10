import {createReducer} from "@reduxjs/toolkit";
import {isFarming} from "./actions";

interface Farming {
    endTime: string
    startTime: string
}
const initialState: Farming = {
    endTime: '',
    startTime: ''
}

export default createReducer(initialState, (builder) =>
builder
    .addCase(isFarming, (farms, {payload: {endTime = '', startTime = ''}}) => {
        return {
            startTime,
            endTime
        }
    })
)