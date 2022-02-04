import { useCallback } from 'react'
import { convertDate } from '../utils/convertDate'

export function useGetDaysArray() {
    return useCallback((start, end) => {
        const arr = []
        const dt = new Date(start)

        while (dt <= end) {
            arr.push(convertDate(dt))
            dt.setDate(dt.getDate() + 1)
        }
        return arr
    }, [])
}
