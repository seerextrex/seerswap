import { useCallback } from 'react'
import { useAppDispatch } from 'state/hooks'
import { limitBonusRewardAmount, limitRefundeeAddress, limitRewardAmount, limitTime, TimePart } from './actions'

export function useLimitHandlers() {

    const dispatch = useAppDispatch()

    const onRewardInput = useCallback(
        (amount: string) => {
            dispatch(limitRewardAmount({ amount }))
        },
        [dispatch]
    )

    const onBonusRewardInput = useCallback(
        (amount: string) => {
            dispatch(limitBonusRewardAmount({ amount }))
        },
        [dispatch]
    )

    const onRefundeeInput = useCallback(
        (address: string) => {
            dispatch(limitRefundeeAddress({ address }))
        },
        [dispatch]
    )

    const onTimeInput = useCallback(
        (part: TimePart, time: number) => {
            dispatch(limitTime({ part, time }))
        },
        [dispatch]
    )

    return {
        onRewardInput,
        onBonusRewardInput,
        onRefundeeInput,
        onTimeInput
    }

}
