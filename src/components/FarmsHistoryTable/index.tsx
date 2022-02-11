import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { TYPE } from 'theme'
import Loader, { LoadingRows } from 'components/Loader'
import { AutoColumn } from 'components/Column'
import { RowFixed } from 'components/Row'
import { PoolData } from 'state/pools/reducer'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { Label } from 'components/Text'
import useTheme from 'hooks/useTheme'
import { useActiveWeb3React } from '../../hooks/web3'

import { ResponsiveGrid, LabelStyled, Wrapper, ClickableTextStyled, PageButtons, Arrow } from './styled'
import CurrencyLogo from '../CurrencyLogo'

const SORT_FIELD = {
    pool: 'pool',
    reward: 'reward',
    bonusReward: 'bonusReward',
    participants: 'participants',
    tvlUSD: 'tvlUSD',
    apr: 'apr',
    dates: 'dates',
}

const DataRow = ({ eventData, index }: { eventData: any; index: number }) => {
    const { chainId } = useActiveWeb3React()

    const poolTitle = useMemo(() => {
        if (eventData.pool.token0.symbol === 'USDC') {
            return eventData.pool.token1.symbol + '/' + eventData.pool.token0.symbol
        }
        return eventData.pool.token0.symbol + '/' + eventData.pool.token1.symbol
    }, [eventData])

    return (
        <div>
            <ResponsiveGrid style={{ borderBottom: '1px solid rgba(225, 229, 239, 0.18)', paddingBottom: '1rem' }}>
                <LabelStyled fontWeight={400}>{index + 1}</LabelStyled>
                <LabelStyled fontWeight={400}>
                    <div>
                        <CurrencyLogo size="35px" currency={{ address: eventData.pool.token0.address }}></CurrencyLogo>
                        <CurrencyLogo
                            size="35px"
                            style={{ marginLeft: '-10px' }}
                            currency={{ address: eventData.pool.token1.address }}
                        ></CurrencyLogo>
                    </div>
                    <div style={{ marginLeft: '10px' }}>
                        <div>{eventData.pool.token0.symbol}</div>
                        <div>{eventData.pool.token1.symbol}</div>
                    </div>
                </LabelStyled>
                <LabelStyled end={1} fontWeight={400}>
                    <CurrencyLogo
                        size="35px"
                        currency={{ address: eventData.rewardToken.address, symbol: eventData.rewardToken.symbol }}
                    ></CurrencyLogo>
                    <div style={{ marginLeft: '10px' }}>
                        <div>{eventData.reward}</div>
                        <div>{eventData.rewardToken.symbol} </div>
                    </div>
                </LabelStyled>
                <LabelStyled end={1} fontWeight={400}>
                    <CurrencyLogo
                        size="35px"
                        currency={{ address: eventData.bonusRewardToken.address, symbol: eventData.bonusRewardToken.symbol }}
                    ></CurrencyLogo>
                    <div style={{ marginLeft: '10px' }}>
                        <div>{eventData.bonusReward}</div>
                        <div>{eventData.bonusRewardToken.symbol} </div>
                    </div>
                </LabelStyled>
                <LabelStyled end={1} fontWeight={400}>
                    {eventData.participants}
                </LabelStyled>
                <LabelStyled end={1} fontWeight={400}>
                    {eventData.tvl}
                </LabelStyled>
                <LabelStyled end={1} fontWeight={400}>
                    {eventData.apr}
                </LabelStyled>
                <LabelStyled end={1} fontWeight={400}>
                    {`${eventData.start} — ${eventData.end}`}
                </LabelStyled>
            </ResponsiveGrid>
        </div>
    )
}

const MAX_ITEMS = 10

export default function FarmsHistoryTable({
    eventDatas,
    maxItems = MAX_ITEMS,
}: {
    eventDatas: any[]
    maxItems?: number
}) {
    // theming
    const theme = useTheme()

    // for sorting
    const [sortField, setSortField] = useState(SORT_FIELD.dates)
    const [sortDirection, setSortDirection] = useState<boolean>(true)

    // pagination
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)

    useEffect(() => {
        let extraPages = 1
        if (eventDatas.length % maxItems === 0) {
            extraPages = 0
        }
        setMaxPage(Math.floor(eventDatas.length / maxItems) + extraPages)
    }, [maxItems, eventDatas])

    const sortedPools = useMemo(() => {
        if (!Array.isArray(eventDatas)) return []

        return eventDatas
            ? eventDatas
                .sort((a, b) => {
                    if (a && b) {
                        return +a[sortField as keyof PoolData] > +b[sortField as keyof PoolData]
                            ? (sortDirection ? -1 : 1) * 1
                            : (sortDirection ? -1 : 1) * -1
                    } else {
                        return -1
                    }
                })
                .slice(maxItems * (page - 1), page * maxItems)
            : []
    }, [maxItems, page, eventDatas, sortDirection, sortField])

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

    if (!eventDatas) {
        return <Loader />
    }

    return (
        <Wrapper style={{ borderRadius: '8px' }}>
            {sortedPools.length > 0 ? (
                <AutoColumn gap="16px">
                    <ResponsiveGrid style={{ borderBottom: '1px solid rgba(225, 229, 239, 0.18)', paddingBottom: '1rem' }}>
                        <Label color={'#dedede'}>#</Label>
                        <ClickableTextStyled color={'#dedede'} onClick={() => handleSort(SORT_FIELD.pool)}>
                            Pool {arrow(SORT_FIELD.pool)}
                        </ClickableTextStyled>
                        <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.reward)}>
                            Reward {arrow(SORT_FIELD.reward)}
                        </ClickableTextStyled>
                        <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.bonusReward)}>
                            Bonus {arrow(SORT_FIELD.bonusReward)}
                        </ClickableTextStyled>
                        <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.participants)}>
                            Participants {arrow(SORT_FIELD.participants)}
                        </ClickableTextStyled>
                        <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.tvlUSD)}>
                            TVL {arrow(SORT_FIELD.tvlUSD)}
                        </ClickableTextStyled>
                        <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.bestApr)}>
                            Best APR {arrow(SORT_FIELD.bestApr)}
                        </ClickableTextStyled>
                        <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.dates)}>
                            Dates {arrow(SORT_FIELD.dates)}
                        </ClickableTextStyled>
                    </ResponsiveGrid>
                    {sortedPools.map((eventData, i) => {
                        if (eventData) {
                            return (
                                <React.Fragment key={i}>
                                    <DataRow index={(page - 1) * MAX_ITEMS + i} eventData={eventData} />
                                </React.Fragment>
                            )
                        }
                        return null
                    })}
                    <PageButtons>
                        <div
                            onClick={() => {
                                setPage(page === 1 ? page : page - 1)
                            }}
                        >
                            <Arrow faded={page === 1 ? true : false}>←</Arrow>
                        </div>
                        <TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
                        <div
                            onClick={() => {
                                setPage(page === maxPage ? page : page + 1)
                            }}
                        >
                            <Arrow faded={page === maxPage ? true : false}>→</Arrow>
                        </div>
                    </PageButtons>
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
