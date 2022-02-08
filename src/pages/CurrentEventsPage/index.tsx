import { useEffect } from 'react'
import { Frown } from 'react-feather'
import { StakerEventCard } from '../../components/StakerEventCard'
import { useChunkedRows } from '../../utils/chunkForRows'
import { EmptyMock, EventsCards, EventsCardsRow, PageWrapper } from './styled'

function isActive(endTime: number, now: number) {
    return endTime * 1000 > now
}

export function CurrentEventsPage({
    data,
    now,
    refreshing,
    fetchHandler
}: {
    data: any
    now: number
    refreshing: boolean
    fetchHandler: () => any
}) {
    useEffect(() => {
        fetchHandler()
    }, [])

    const chunked = useChunkedRows(data, 3)
    return (
        <PageWrapper>
            <EventsCards>
                {!data ? (
                    <EventsCards>
                        <EventsCardsRow>
                            {[0, 1, 2].map((el, i) => (
                                <StakerEventCard active skeleton key={i} />
                            ))}
                        </EventsCardsRow>
                        <EventsCardsRow>
                            {[0, 1].map((el, i) => (
                                <StakerEventCard active skeleton key={i} />
                            ))}
                        </EventsCardsRow>
                    </EventsCards>
                ) : data && data.length !== 0 && !data.every((el) => el.endTime < Math.round(Date.now() / 1000)) ? (
                    chunked?.map((el, i) => (
                        <EventsCardsRow key={i}>
                            {el.map(
                                (event, j) =>
                                    isActive(event.endTime, now) && (
                                        <StakerEventCard refreshing={refreshing} active key={j}
                                                         now={now} event={event} />
                                    )
                            )}
                        </EventsCardsRow>
                    ))
                ) : data && (data.length === 0 || data.every((el) => el.endTime < Math.round(Date.now() / 1000))) ? (
                    <EmptyMock>
                        <div>No current events</div>
                        <Frown size={35} stroke={'white'} />
                    </EmptyMock>
                ) : null}
            </EventsCards>
        </PageWrapper>
    )
}
