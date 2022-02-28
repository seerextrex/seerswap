import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FormattedPool } from '../../models/interfaces'
import Loader from '../Loader'
import { Label } from '../Text'
import { DataRow } from './DataRow'
import PageButtons from './PageButtons'
import { POOL_HIDE } from '../InfoPools'
import AutoColumn from '../../shared/components/AutoColumn'
import './index.scss'
import { HelpCircle } from 'react-feather'

const MAX_ITEMS = 10

interface InfoPoolsTableProps {
    poolDatas: FormattedPool[]
    maxItems?: number,
    sortFields: {
        title: string
        value: string
    } []
}

// const data = [
//     [0, 1, 2, 3],
//     [0, 3, 1, 3]
//     ]
//

// <Table rowData={rowData} header={TableHeader} colData={colData} initialSort={'volumeUSD'} cols={8}>
//     <Row></Row>
//     <Row></Row>
// </Table>
//
// const data = [
//     [{value: 1, title: Pool},2,3],
//     [1,3,4]
// ]
//
// const TableHeader = () => <>
//     <div className={'center'}>a</div>
//     <div type={tvl}>b</div>
//     <div>c</div>
// </>
//
// const Row = (data) => <div>
//     {data}
// </div>
//
// <Table data={data} header={TableHeader}>
//     {
//         data.map(el => <Row></Row>)
//     }
// </Table>
//
// {
//     children.map((row,i) => <div>
//         {
//             [...Array(header.children.length)].map((col, j) => <div className={header.children[i].classList}>
//                 {
//                     data[i][j]
//                 }
//             </div>)
//         }
//     </div>)
// }

export default function Table({ poolDatas, maxItems = MAX_ITEMS, sortFields }: InfoPoolsTableProps) {
    // for sorting
    const [sortField, setSortField] = useState('volumeUSD')
    const [sortDirection, setSortDirection] = useState<boolean>(true)

    // pagination
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)

    useEffect(() => {
        let extraPages = 1
        if (poolDatas.length % maxItems === 0) {
            extraPages = 0
        }
        setMaxPage(Math.floor(poolDatas.length / maxItems) + extraPages)
    }, [maxItems, poolDatas])

    const sortedPools = useMemo(() => {
        if (!Array.isArray(poolDatas)) return []

        return poolDatas
            ? poolDatas
                .filter((x) => !!x && !POOL_HIDE.includes(x.address))
                .sort((a, b) => {
                    if (a && b) {
                        return +a[sortField as keyof FormattedPool] > +b[sortField as keyof FormattedPool]
                            ? (sortDirection ? -1 : 1) * 1
                            : (sortDirection ? -1 : 1) * -1
                    } else {
                        return -1
                    }
                })
                .slice(maxItems * (page - 1), page * maxItems)
            : []
    }, [maxItems, page, poolDatas, sortDirection, sortField])

    const handleSort = useCallback((newField: string) => {
        setSortField(newField)
        setSortDirection(sortField !== newField ? true : !sortDirection)
    }, [sortDirection, sortField])

    const arrow = useCallback((field: string) => {
        return sortField === field ? (!sortDirection ? '↑' : '↓') : ''
    }, [sortDirection, sortField])

    if (!poolDatas) {
        return <Loader />
    }

    return (
        <>
            {/*{sortedPools.length > 0 ? (*/}
            {/*    <AutoColumn gap={'1'}>*/}
            {/*        <div className={'table-header'}>*/}
            {/*            <Label color={'#dedede'}>#</Label>*/}
            {/*            {sortFields.map((el, i) =>*/}
            {/*                <span className={'table-header__item'} data-center={el.value === 'feeTier'} onClick={() => handleSort(el.value)} key={i}>*/}
            {/*                        {el.value !== 'apr' ?*/}
            {/*                            <>{el.title} {arrow(el.value)}</>*/}
            {/*                            :*/}
            {/*                            <span className={'table-header__apr'}>*/}
            {/*                                <span>{el.title} {arrow(el.value)}</span>*/}
            {/*                                <span style={{ marginLeft: '6px' }}>*/}
            {/*                                    <HelpCircle style={{ display: 'block' }} color={'white'} size={'16px'} />*/}
            {/*                                </span>*/}
            {/*                                <span className={'helper'}>*/}
            {/*                                    Based on <span className={'helper-part'}>fees</span> /{' '}*/}
            {/*                                    <span className={'helper-part'}>active liquidity</span>*/}
            {/*                                </span>*/}
            {/*                            </span>*/}
            {/*                        }*/}
            {/*                    </span>*/}
            {/*            )}*/}
            {/*        </div>*/}
            {/*        {sortedPools.map((poolData, i) => poolData &&*/}
            {/*            <DataRow index={(page - 1) * MAX_ITEMS + i} poolData={poolData} key={i} />)*/}
            {/*        }*/}
            {/*        <PageButtons*/}
            {/*            page={page}*/}
            {/*            maxPage={maxPage}*/}
            {/*            setPage={setPage} />*/}
            {/*    </AutoColumn>*/}
            {/*) : null}*/}
        </>
    )
}
