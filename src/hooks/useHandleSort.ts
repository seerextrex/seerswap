import { useCallback } from 'react'

export function useHandleSort(sortField: string, sortDirection: boolean, setSortDirection: (a: boolean) => void, setSortField: (a: string) => void) {
    return useCallback((newField: string) => {
            setSortField(newField)
            setSortDirection(sortField !== newField ? true : !sortDirection)
        },
        [sortDirection, sortField]
    )
}
