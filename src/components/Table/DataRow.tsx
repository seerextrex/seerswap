import React from 'react'
import './index.scss'

interface DataRowProps {
    data: any[];
    grid: string
    header?: any
}

export const DataRow = ({ data, grid, header}: DataRowProps) => {
    return (
        <div className={`data-row pb-1 ${grid}`}>
            {data.map((el, i) => {
                    return <span  key={i} className={header[i].props.className}>{el.title}</span>
                }
            )}
        </div>
    )
}
