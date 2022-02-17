import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Loader, { LoadingRows } from 'components/Loader'
import { AutoColumn } from 'components/Column'
import { Label } from 'components/Text'
import { HelpCircle } from 'react-feather'
import { APRWrapper, ClickableTextStyled, HelperDropdown, HelperDropdownPart, ResponsiveGrid, Wrapper } from './styled'
import { DataRow } from './DataRow'
import PageButtons from './PageButtons'
import { FormattedPool } from '../../models/interfaces'

const SORT_FIELD = {
    feeTier: 'feeTier',
    volumeUSD: 'volumeUSD',
    tvlUSD: 'tvlUSD',
    volumeUSDWeek: 'volumeUSDWeek',
    feesUSD: 'feesUSD',
    apr: 'apr',
    farmingApr: 'farmingApr'
}

export const POOL_HIDE = [
    '0x86d257cdb7bc9c0df10e84c8709697f92770b335',
    '0xf8dbd52488978a79dfe6ffbd81a01fc5948bf9ee',
    '0x8fe8d9bb8eeba3ed688069c3d6b556c9ca258248'
]

const MAX_ITEMS = 10

interface InfoPoolsTableProps {
    poolDatas: FormattedPool[]
    maxItems?: number
}

export default function InfoPoolsTable({ poolDatas, maxItems = MAX_ITEMS }: InfoPoolsTableProps) {
    // for sorting
    const [sortField, setSortField] = useState(SORT_FIELD.volumeUSD)
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

    const handleSort = useCallback(
        (newField: string) => {
            setSortField(newField)
            setSortDirection(sortField !== newField ? true : !sortDirection)
        },
        [sortDirection, sortField]
    )

    const arrow = useCallback(
        (field: string) => {
            return sortField === field ? (!sortDirection ? '↑' : '↓') : ''
        },
        [sortDirection, sortField]
    )

    if (!poolDatas) {
        return <Loader />
    }

    return (
        <Wrapper style={{ borderRadius: '8px' }}>
            {sortedPools.length > 0 ? (
                <AutoColumn gap='16px'>
                    <ResponsiveGrid style={{
                        borderBottom: '1px solid rgba(225, 229, 239, 0.18)',
                        paddingBottom: '1rem'
                    }}>
                        <Label color={'#dedede'}>#</Label>
                        <ClickableTextStyled color={'#dedede'}
                                             onClick={() => handleSort(SORT_FIELD.feeTier)}>
                            Pool {arrow(SORT_FIELD.feeTier)}
                        </ClickableTextStyled>
                        <ClickableTextStyled center color={'#dedede'} end={1}
                                             onClick={() => handleSort(SORT_FIELD.volumeUSD)}>
                            Volume 24H {arrow(SORT_FIELD.volumeUSD)}
                        </ClickableTextStyled>
                        <ClickableTextStyled center color={'#dedede'} end={1}
                                             onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}>
                            Volume 7D {arrow(SORT_FIELD.volumeUSDWeek)}
                        </ClickableTextStyled>
                        <ClickableTextStyled center color={'#dedede'} end={1}
                                             onClick={() => handleSort(SORT_FIELD.tvlUSD)}>
                            TVL {arrow(SORT_FIELD.tvlUSD)}
                        </ClickableTextStyled>
                        <ClickableTextStyled center color={'#dedede'} end={1}
                                             onClick={() => handleSort(SORT_FIELD.apr)}>
                            <APRWrapper style={{ display: 'flex', alignItems: 'center' }}>
                                <span>🚀 APR{arrow(SORT_FIELD.apr)}</span>
                                <span style={{ marginLeft: '6px' }}>
                  <HelpCircle style={{ display: 'block' }} color={'white'} size={'16px'} />
                </span>
                                <HelperDropdown>
                                    Based on <HelperDropdownPart>fees</HelperDropdownPart> /{' '}
                                    <HelperDropdownPart>active liquidity</HelperDropdownPart>
                                </HelperDropdown>
                            </APRWrapper>
                        </ClickableTextStyled>
                        <ClickableTextStyled center color={'#dedede'} end={1}
                                             onClick={() => handleSort(SORT_FIELD.farmingApr)}>
                            <span>🔥 Farming{arrow(SORT_FIELD.farmingApr)}</span>
                        </ClickableTextStyled>
                        {/* <AprInfo title={'based on 24h volume'}>?</AprInfo> */}
                    </ResponsiveGrid>
                    {sortedPools.map((poolData, i) => {
                        if (poolData) {
                            return (
                                <React.Fragment key={i}>
                                    <DataRow index={(page - 1) * MAX_ITEMS + i}
                                             poolData={poolData} />
                                </React.Fragment>
                            )
                        }
                        return null
                    })}
                    <PageButtons
                        page={page}
                        maxPage={maxPage}
                        setPage={setPage} />
                </AutoColumn>
            ) : (
                <LoadingRows>
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                </LoadingRows>
            )}
        </Wrapper>
    )
}
