import { useEffect, useState } from 'react'
import { Frown } from 'react-feather'
import { StakerEventCard } from '../../components/StakerEventCard'
import { useChunkedRows } from '../../utils/chunkForRows'
import Modal from '../../components/Modal'
import { StakeModal } from '../../components/StakeModal'
import { EmptyMock, EventsCards, EventsCardsRow, PageWrapper } from './styled'
import { FarmingType } from '../../models/enums'

function isFuture(startTime: number, now: number) {
    return startTime * 1000 > now
}

export function FutureEventsPage({
    data,
    now,
    refreshing,
    fetchHandler
}: {
    data: any;
    now: number;
    refreshing: boolean;
    fetchHandler: () => any;
}) {
    useEffect(() => {
        fetchHandler()
    }, [])

    const chunked = useChunkedRows(data, 3)

    const [modalForPool, setModalForPool] = useState<boolean>(false)

    return (
        <>
            <Modal isOpen={modalForPool} onHide={() => setModalForPool(null)}>
                {modalForPool && (
                    <StakeModal
                        event={modalForPool}
                        closeHandler={() => setModalForPool(false)}
                        farmingType={FarmingType.FINITE}
                    />
                )}
            </Modal>
            <PageWrapper>
                <EventsCards>
                    {!data && refreshing ? (
                        <EventsCards>
                            <EventsCardsRow>
                                {[0, 1, 2].map((el, i) => (
                                    <StakerEventCard skeleton key={i} />
                                ))}
                            </EventsCardsRow>
                            <EventsCardsRow>
                                {[0, 1].map((el, i) => (
                                    <StakerEventCard skeleton key={i} />
                                ))}
                            </EventsCardsRow>
                        </EventsCards>
                    ) : data &&
                    data.length !== 0 &&
                    !data.every((el) => el.startTime < Math.round(Date.now() / 1000)) ? (
                        chunked?.map((el, i) => (
                            <EventsCardsRow key={i}>
                                {el.map(
                                    (event, j) =>
                                        isFuture(event.startTime, now) && (
                                            <StakerEventCard
                                                key={j}
                                                stakeHandler={() => setModalForPool(event)}
                                                refreshing={refreshing}
                                                now={now}
                                                event={event}
                                            />
                                        )
                                )}
                            </EventsCardsRow>
                        ))
                    ) : data &&
                    (data.length === 0 ||
                        data.every((el) => el.startTime < Math.round(Date.now() / 1000))) ? (
                        <EmptyMock>
                            <div>No future events</div>
                            <Frown size={35} stroke={'white'} />
                        </EmptyMock>
                    ) : null}
                </EventsCards>
            </PageWrapper>
        </>
    )
}
