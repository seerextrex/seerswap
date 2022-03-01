import React, { useEffect, useMemo, useState } from 'react'
import { FormattedPool } from '../../models/interfaces'
import Loader from '../Loader'
import { DataRow } from './DataRow'
import PageButtons from './PageButtons'
import AutoColumn from '../../shared/components/AutoColumn'
import './index.scss'

const MAX_ITEMS = 10

interface InfoPoolsTableProps {
    data: any[]
    maxItems?: number,
    header: any,
    sortField: string,
    sortIndex: number,
    sortDirection: boolean
    gridClass: string
}

export default function Table({ data, maxItems = MAX_ITEMS, header, sortField, sortIndex,  sortDirection, gridClass }: InfoPoolsTableProps) {
    // pagination
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)

    useEffect(() => {
        let extraPages = 1
        if (data.length % maxItems === 0) {
            extraPages = 0
        }
        setMaxPage(Math.floor(data.length / maxItems) + extraPages)
    }, [maxItems, data])

    const sortedPools = useMemo(() => {

        console.log(data)
        if (!Array.isArray(data)) return []

        const sort = data
            ? data.sort((a, b) => {

                if (a && b) {
                    console.log(sortIndex, sortField)
                    return +a[sortIndex].value > +b[sortIndex].value
                        ? (sortDirection ? -1 : 1) * 1
                        : (sortDirection ? -1 : 1) * -1
                } else {
                    return -1
                }
            })
                .slice(maxItems * (page - 1), page * maxItems)
            : []

        console.log('[sort]',sort)
        return sort
    }, [maxItems, page, data, sortDirection, sortField, sortIndex])

    if (!data) {
        return <Loader />
    }
    return (
        <>
            {sortedPools.length > 0 ? (
                <AutoColumn gap={'1'}>
                    {/*<div className={`table-header ${gridClass}`}>*/}
                    {/*    {header.props.children.map((el: any, i: any) => <React.Fragment key={i}>{el}</React.Fragment>)}*/}
                    {/*</div>*/}
                    {sortedPools.map((poolData, i) => poolData &&
                        <DataRow data={poolData} key={i} grid={gridClass} header={header.props.children}/>)
                    }
                    <PageButtons
                        page={page}
                        maxPage={maxPage}
                        setPage={setPage} />
                </AutoColumn>
            ) : null}
        </>
    )
}
