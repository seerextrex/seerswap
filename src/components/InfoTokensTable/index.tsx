import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Loader, { LoadingRows } from 'components/Loader'
import { AutoColumn } from 'components/Column'
import { Label } from '../Text'
import { ClickableTextStyled, ResponsiveGrid, Wrapper } from './styled'
import { FormattedToken } from '../../models/interfaces'
import { useHandleSort } from '../../hooks/useHandleSort'
import { DataRow } from './DataRow'
import PageButtons from '../InfoPoolsTable/PageButtons'

const SORT_FIELD = {
    name: 'name',
    volumeUSD: 'volumeUSD',
    tvlUSD: 'tvlUSD',
    priceUSD: 'priceUSD',
    priceUSDChange: 'priceUSDChange',
    priceUSDChangeWeek: 'priceUSDChangeWeek'
}

const MAX_ITEMS = 10

interface InfoTokensTableProps {
    tokenDatas: FormattedToken[] | undefined;
    maxItems?: number;
}

export default function InfoTokensTable({
    tokenDatas,
    maxItems = MAX_ITEMS
}: InfoTokensTableProps) {
    // for sorting
    const [sortField, setSortField] = useState(SORT_FIELD.tvlUSD)
    const [sortDirection, setSortDirection] = useState<boolean>(true)

    // pagination
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)

    const handleSort = useHandleSort(sortField, sortDirection, setSortDirection, setSortField)

    useEffect(() => {
        let extraPages = 1
        if (tokenDatas) {
            if (tokenDatas.length % maxItems === 0) {
                extraPages = 0
            }
            setMaxPage(Math.floor(tokenDatas.length / maxItems) + extraPages)
        }
    }, [maxItems, tokenDatas])

    const sortedTokens = useMemo(() => {
        if (!Array.isArray(tokenDatas)) return []

        return tokenDatas
            ? tokenDatas
                .filter((x) => !!x)
                .sort((a, b) => {
                    if (a && b) {
                        return a[sortField as keyof FormattedToken] >
                        b[sortField as keyof FormattedToken]
                            ? (sortDirection ? -1 : 1) * 1
                            : (sortDirection ? -1 : 1) * -1
                    } else {
                        return -1
                    }
                })
                .slice(maxItems * (page - 1), page * maxItems)
            : []
    }, [tokenDatas, maxItems, page, sortDirection, sortField])

    const arrow = useCallback(
        (field: string) => {
            return sortField === field ? (!sortDirection ? '↑' : '↓') : ''
        },
        [sortDirection, sortField]
    )

    if (!tokenDatas) {
        return <Loader />
    }

    return (
        <Wrapper style={{ borderRadius: '8px' }}>
            {sortedTokens.length > 0 ? (
                <AutoColumn gap='16px'>
                    <ResponsiveGrid
                        style={{
                            borderBottom: '1px solid rgba(225, 229, 239, 0.18)',
                            paddingBottom: '1rem'
                        }}
                    >
                        <Label color={'#dedede'}>#</Label>
                        <ClickableTextStyled
                            color={'#dedede'}
                            onClick={() => handleSort(SORT_FIELD.name)}
                        >
                            Name {arrow(SORT_FIELD.name)}
                        </ClickableTextStyled>
                        <ClickableTextStyled
                            color={'#dedede'}
                            end={1}
                            onClick={() => handleSort(SORT_FIELD.priceUSD)}
                        >
                            Price {arrow(SORT_FIELD.priceUSD)}
                        </ClickableTextStyled>
                        <ClickableTextStyled
                            color={'#dedede'}
                            end={1}
                            onClick={() => handleSort(SORT_FIELD.priceUSDChange)}
                        >
                            Price Change {arrow(SORT_FIELD.priceUSDChange)}
                        </ClickableTextStyled>
                        <ClickableTextStyled
                            color={'#dedede'}
                            end={1}
                            onClick={() => handleSort(SORT_FIELD.volumeUSD)}
                        >
                            Volume 24H {arrow(SORT_FIELD.volumeUSD)}
                        </ClickableTextStyled>
                        <ClickableTextStyled
                            color={'#dedede'}
                            end={1}
                            onClick={() => handleSort(SORT_FIELD.tvlUSD)}
                        >
                            TVL {arrow(SORT_FIELD.tvlUSD)}
                        </ClickableTextStyled>
                    </ResponsiveGrid>

                    {sortedTokens.map((data, i) => {
                        if (data) {
                            return (
                                <React.Fragment key={i}>
                                    <DataRow index={(page - 1) * MAX_ITEMS + i} tokenData={data} />
                                </React.Fragment>
                            )
                        }
                        return null
                    })}
                    <PageButtons page={page} maxPage={maxPage} setPage={setPage} />
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
