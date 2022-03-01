import { useCallback } from 'react'

export function useHandleSort(sortField: string, sortDirection: boolean, setSortDirection: (a: boolean) => void, setSortField: (a: string) => void, setSortIndex: (a: number) => void) {
    return useCallback((newField: string, newIndex: number) => {
            setSortField(newField)
            setSortIndex(newIndex)
            setSortDirection(sortField !== newField ? true : !sortDirection)
        },
        [sortDirection, sortField]
    )
}
