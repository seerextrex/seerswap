import { useMemo } from 'react'
import dayjs from 'dayjs'

export function useStartTimestamp(span: string, type: string) {
    return useMemo(() => {
        const day = dayjs()

        switch (span) {
            case 'Day':
                return day.subtract(type === 'apr' || type === 'ALGBfromVault' ? 2 : 1, 'day').unix()
            case 'Week':
                return day.subtract(7, 'day').unix()
            case 'Month':
                return day.subtract(1, 'month').unix()
            case 'All':
                return 'All'
            default:
                return day.subtract(1, 'day').unix()
        }
    }, [span])
}
