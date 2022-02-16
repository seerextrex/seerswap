import { useCallback } from 'react'
import { useAppDispatch } from 'state/hooks'
import { incentiveBonusRewardAmount, incentiveRefundeeAddress, incentiveRewardAmount, incentiveTime, TimePart } from './actions'

export function useIncentiveHandlers() {

    const dispatch = useAppDispatch()

    const onRewardInput = useCallback(
        (amount: string) => {
            dispatch(incentiveRewardAmount({ amount }))
        },
        [dispatch]
    )

    const onBonusRewardInput = useCallback(
        (amount: string) => {
            dispatch(incentiveBonusRewardAmount({ amount }))
        },
        [dispatch]
    )

    const onRefundeeInput = useCallback(
        (address: string) => {
            dispatch(incentiveRefundeeAddress({ address }))
        },
        [dispatch]
    )

    const onTimeInput = useCallback(
        (part: TimePart, time: number) => {
            dispatch(incentiveTime({ part, time }))
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
