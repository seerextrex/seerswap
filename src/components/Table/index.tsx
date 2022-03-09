import React from 'react'
import './index.scss'
import TableBody from './TableBody'


interface InfoPoolsTableProps {
    gridClass: string
    children: any
    data: any
    sortDirection: boolean
    sortIndex: number
    sortField: string
}

export default function Table({ children, gridClass, data, sortDirection, sortIndex, sortField }: InfoPoolsTableProps) {
    // pagination
    return (
        <div className={gridClass}>
            {children}
            <TableBody
                gridClass={gridClass}
                data={data}
                sortDirection={sortDirection}
                sortIndex={sortIndex}
                sortField={sortField}
                maxItems={10}
                header={children} />
        </div>
    )
}
