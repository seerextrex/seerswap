import { useCallback } from 'react'

export function useHandleArrow(sortField: string, sortIndex: number, sortDirection: boolean) {
    return useCallback((field: string) => {
        return sortField === field ? (!sortDirection ? '↑' : '↓') : ''
    }, [sortDirection, sortField, sortIndex])
}
