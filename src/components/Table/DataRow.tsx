import React from 'react'
import './index.scss'

interface DataRowProps {
    data: any[];
    grid: string
    header?: any
    rowId: number
}

export const DataRow = ({ data, grid, header, rowId}: DataRowProps) => {
    return (
        <div className={`data-row pb-05 pt-05 ${grid}`}>
            <span>{rowId}</span>
            {data.map((el, i) => {
                    return <span  key={i} className={header[i].props.className}>{el.title}</span>
                }
            )}
        </div>
    )
}
