import React from 'react'

interface TableHeaderProps {
    children: any
    handleSort: any
    sortFields: any
    arrow: any
    gridClass: string
}

const TableHeader = ({ children, handleSort, sortFields, arrow, gridClass }: TableHeaderProps) => {
    return <div className={`mb-1 table-header ${gridClass}`}>
        {children.map((el: any, i: any) =>
            <span className={el.props.className} key={i} onClick={() => handleSort(sortFields[i].value, i)}>
                {el}{arrow(sortFields[i].value)}
            </span>)}
    </div>
}

export default TableHeader
