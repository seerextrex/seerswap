import {createAction} from "@reduxjs/toolkit";

export const isFarming = createAction<{startTime: string, endTime: string}>('farming/getFarms')