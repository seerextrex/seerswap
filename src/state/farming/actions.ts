import {createAction} from "@reduxjs/toolkit";

export const isFarming = createAction<{endTime: string, startTime: string}>('farming/getFarms')