import React, { useEffect, useMemo, useState } from 'react'
import Loader from '../Loader'
import { useHandleSort } from '../../hooks/useHandleSort'
import { formatDollarAmount } from '../../utils/numbers'
import Percent from '../Percent'
import './index.scss'
import { useHandleArrow } from '../../hooks/useHandleArrow'
import { TokenRow } from './TokenRow'
import Table from '../Table'
import TableHeader from '../Table/TableHeader'

interface InfoTokensProps {
    data: any
    refreshing: boolean
    fetchHandler: () => any
    blocksFetched: boolean
}

const sortFields = [
    {
        title: 'Name',
        value: 'name'
    },
    {
        title: 'Price',
        value: 'priceUSD'
    },
    {
        title: 'Price Change',
        value: 'priceUSDChange'
    },
    {
        title: 'Volume 24H',
        value: 'volumeUSD'
    },
    {
        title: 'TVL',
        value: 'tvlUSD'
    }
]

export function InfoTokens({ data, fetchHandler, blocksFetched }: InfoTokensProps) {
    const [sortField, setSortField] = useState<string>('tvlUSD')
    const [sortDirection, setSortDirection] = useState<boolean>(true)
    const [sortIndex, setSortIndex] = useState<number>(4)

    const handleSort = useHandleSort(sortField, sortDirection, setSortDirection, setSortField, setSortIndex)
    const arrow = useHandleArrow(sortField, sortIndex, sortDirection)

    useEffect(() => {
        if (blocksFetched) {
            fetchHandler()
        }
    }, [blocksFetched])

    const _data = useMemo(() => {
        return data && data.map((el: any, i: number) => {
            const token = TokenRow({ address: el.address, symbol: el.symbol, name: el.name })

            return [
                {
                    title: token,
                    value: el.address
                },
                {
                    title: formatDollarAmount(el.priceUSD, 3),
                    value: el.priceUSD
                },
                {
                    title: <Percent key={i} value={el.priceUSDChange} fontWeight={400} />,
                    value: el.priceUSDChange
                },
                {
                    title: formatDollarAmount(el.volumeUSD),
                    value: el.volumeUSD
                },
                {
                    title: formatDollarAmount(el.tvlUSD),
                    value: el.tvlUSD
                }]
        })
    }, [data])

    if (!data)
        return (
            <div className={'mock-loader'}>
                <Loader stroke={'white'} size={'25px'} />
            </div>
        )
    return <Table gridClass={'grid-tokens-table'} sortIndex={sortIndex} sortField={sortField} sortDirection={sortDirection} data={_data}>
        <TableHeader
            gridClass={'grid-tokens-table'}
            sortFields={sortFields}
            handleSort={handleSort}
            arrow={arrow}
        >
            <span className={'table-header__item'}>Name</span>
            <span className={'table-header__item table-header__item--center'}>Price</span>
            <span className={'table-header__item table-header__item--center'}>Price Change</span>
            <span className={'table-header__item table-header__item--center'}>Volume 24H</span>
            <span className={'table-header__item table-header__item--center'}>TVL</span>
        </TableHeader>
    </Table>
}
