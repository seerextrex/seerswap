import React, { useEffect, useMemo, useState } from 'react'
import Loader from '../Loader'
import Table from '../Table'
import { formatDollarAmount, formatPercent } from '../../utils/numbers'
import '../Table/index.scss'
import './index.scss'
import { NavLink } from 'react-router-dom'
import { Pool } from './PoolRow'
import { Apr } from './AprHeader'
import { useHandleSort } from '../../hooks/useHandleSort'
import { useHandleArrow } from '../../hooks/useHandleArrow'
import TableHeader from '../Table/TableHeader'
import TableBody from '../Table/TableBody'

interface InfoPoolsProps {
    data: any
    refreshing: boolean
    fetchHandler: () => any
    blocksFetched: boolean
}

const sortFields = [
    {
        title: '#',
        value: 'index'
    },
    {
        title: 'Pool',
        value: 'pool'
    },
    {
        title: 'Volume 24H',
        value: 'volumeUSD'
    },
    {
        title: 'Volume 7D',
        value: 'volumeUSDWeek'
    },
    {
        title: 'TVL',
        value: 'tvlUSD'
    },
    {
        title: '🚀 APR',
        value: 'apr'
    },
    {
        title: '🔥 Farming',
        value: 'farmingApr'
    }
]

export function InfoPools({ data, fetchHandler, blocksFetched }: InfoPoolsProps) {

    const [sortField, setSortField] = useState('volumeUSD')
    const [sortIndex, setSortIndex] = useState(2)
    const [sortDirection, setSortDirection] = useState<boolean>(true)
    const handleSort = useHandleSort(sortField, sortDirection, setSortDirection, setSortField, setSortIndex)
    const arrow = useHandleArrow(sortField, sortIndex, sortDirection)

    useEffect(() => {
        if (blocksFetched) {
            fetchHandler()
        }
    }, [blocksFetched])

    const _data = useMemo(() => {
        return data && data.map((el: any, i: any) => {

            const pool = Pool({ token0: el.token0, token1: el.token1, fee: el.fee, address: el.address })
            const apr = el.apr > 0 ? <span style={{ color: '#33FF89' }}>{formatPercent(el.apr)}</span> : <span>-</span>
            const farming = el.farmingApr > 0 ?
                <NavLink to={'/farming/infinite-farms'} className={'farming-link'} data-apr={el.farmingApr > 0}>
                    {formatPercent(el.farmingApr)}
                </NavLink>
                : <span>-</span>

            return [
                {
                    title: i + 1,
                    value: i + 1
                },
                {
                    title: pool,
                    value: el.address
                },
                {
                    title: formatDollarAmount(el.volumeUSD),
                    value: el.volumeUSD
                },
                {
                    title: formatDollarAmount(el.volumeUSDWeek),
                    value: el.volumeUSDWeek
                },
                {
                    title: formatDollarAmount(el.totalValueLockedUSD),
                    value: el.totalValueLockedUSD
                },
                {
                    title: apr,
                    value: el.apr
                },
                {
                    title: farming,
                    value: el.farmingApr
                }]
        })
    }, [data])

    if (!data)
        return (
            <div className={'mock-loader'}>
                <Loader stroke={'white'} size={'25px'} />
            </div>
        )

    return <Table gridClass={'grid-pools-table'} sortIndex={sortIndex} sortDirection={sortDirection} sortField={sortField} data={_data}>
        <TableHeader arrow={arrow} sortFields={sortFields} handleSort={handleSort} gridClass={'grid-pools-table'}>
            <span className={'table-header__item'}>#</span>
            <span className={'table-header__item'}>Pool</span>
            <span className={'table-header__item table-header__item--center'}>Volume 24H</span>
            <span className={'table-header__item table-header__item--center'}>Volume 7D</span>
            <span className={'table-header__item table-header__item--center'}>TVL</span>
            <span className={'table-header__item table-header__item--center'}><Apr /></span>
            <span className={'table-header__item table-header__item--center'}>🔥 Farming</span>
        </TableHeader>
    </Table>
}
