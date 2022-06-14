import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TYPE } from "theme";
import Loader from "components/Loader";
import { LoadingRows } from "../Loader/styled";
import { AutoColumn } from "components/Column";
import { Label } from "components/Text";
import { Arrow, ClickableTextStyled, PageButtons, ResponsiveGrid, Wrapper } from "./styled";
import { useHandleSort } from "../../hooks/useHandleSort";
import DataRow from "./DataRow";
import { FormattedPool } from "../../models/interfaces";
//
// const SORT_FIELD = {
//     pool: 'pool',
//     reward: 'reward',
//     bonusReward: 'bonusReward',
//     participants: 'participants',
//     tvlUSD: 'tvlUSD',
//     bestApr: 'apr',
//     start: 'start'
// }
//
// const MAX_ITEMS = 10
//
// interface FarmsHistoryTableProps {
//     eventDatas: any[]
//     maxItems?: number
// }
//
// export default function FarmsHistoryTable({ eventDatas, maxItems = MAX_ITEMS }: FarmsHistoryTableProps) {
//     // for sorting
//     const [sortField, setSortField] = useState(SORT_FIELD.start)
//     const [sortDirection, setSortDirection] = useState<boolean>(true)
//
//     // pagination
//     const [page, setPage] = useState(1)
//     const [maxPage, setMaxPage] = useState(1)
//
//     //sort
//     // const handleSort = useHandleSort(sortField, sortDirection, setSortDirection, setSortField)
//
//
//     const sortedPools = useMemo(() => {
//         if (!Array.isArray(eventDatas)) return []
//
//         return eventDatas ? eventDatas.sort((a, b) => {
//                 if (a && b) {
//                     return +a[sortField as keyof FormattedPool] > +b[sortField as keyof FormattedPool]
//                         ? (sortDirection ? -1 : 1) * 1
//                         : (sortDirection ? -1 : 1) * -1
//                 } else {
//                     return -1
//                 }
//             })
//                 .slice(maxItems * (page - 1), page * maxItems)
//             : []
//     }, [maxItems, page, eventDatas, sortDirection, sortField])
//
//     const arrow = useCallback((field: string) => {
//         return sortField === field ? (!sortDirection ? '↑' : '↓') : ''
//     }, [sortDirection, sortField])
//
//     useEffect(() => {
//         let extraPages = 1
//         if (eventDatas.length % maxItems === 0) {
//             extraPages = 0
//         }
//         setMaxPage(Math.floor(eventDatas.length / maxItems) + extraPages)
//     }, [maxItems, eventDatas])
//
//     if (!eventDatas) {
//         return <Loader />
//     }
//
//     return (
//         <Wrapper style={{ borderRadius: '8px' }}>
//             {sortedPools.length > 0 ? (
//                 <AutoColumn gap='16px'>
//                     <ResponsiveGrid style={{ borderBottom: '1px solid rgba(225, 229, 239, 0.18)', paddingBottom: '1rem' }}>
//                         <Label color={'#dedede'}>#</Label>
//                         <ClickableTextStyled color={'#dedede'} onClick={() => handleSort(SORT_FIELD.pool)}>
//                             Pool {arrow(SORT_FIELD.pool)}
//                         </ClickableTextStyled>
//                         <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.reward)}>
//                             Reward {arrow(SORT_FIELD.reward)}
//                         </ClickableTextStyled>
//                         <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.bonusReward)}>
//                             Bonus {arrow(SORT_FIELD.bonusReward)}
//                         </ClickableTextStyled>
//                         <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.participants)}>
//                             Participants {arrow(SORT_FIELD.participants)}
//                         </ClickableTextStyled>
//                         <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.bestApr)}>
//                             Best APR {arrow(SORT_FIELD.bestApr)}
//                         </ClickableTextStyled>
//                         <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.start)}>
//                             Dates {arrow(SORT_FIELD.start)}
//                         </ClickableTextStyled>
//                     </ResponsiveGrid>
//                     {sortedPools.map((eventData, i) => {
//                         if (eventData) {
//                             return (
//                                 <React.Fragment key={i}>
//                                     <DataRow index={(page - 1) * MAX_ITEMS + i} eventData={eventData} />
//                                 </React.Fragment>
//                             )
//                         }
//                         return null
//                     })}
//                     <PageButtons>
//                         <div
//                             onClick={() => {
//                                 setPage(page === 1 ? page : page - 1)
//                             }}
//                         >
//                             <Arrow faded={page === 1}>←</Arrow>
//                         </div>
//                         <TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
//                         <div
//                             onClick={() => {
//                                 setPage(page === maxPage ? page : page + 1)
//                             }}
//                         >
//                             <Arrow faded={page === maxPage}>→</Arrow>
//                         </div>
//                     </PageButtons>
//                 </AutoColumn>
//             ) : (
//                 <LoadingRows>
//                     <div />
//                     <div />
//                     <div />
//                     <div />
//                     <div />
//                     <div />
//                     <div />
//                     <div />
//                     <div />
//                     <div />
//                     <div />
//                     <div />
//                 </LoadingRows>
//             )}
//         </Wrapper>
//     )
// }
