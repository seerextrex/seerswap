import React from 'react'
import './index.scss'


interface InfoPoolsTableProps {
    gridClass: string
    children: any
}

export default function Table({ children, gridClass }: InfoPoolsTableProps) {
    // pagination
    return (
        <div className={gridClass}>
            {children}
        </div>
    )
}
