import { useEffect, useMemo, useState } from 'react'
import { Frown } from 'react-feather'
import { StakerEventCard } from '../../components/StakerEventCard'
import { useChunkedRows } from '../../utils/chunkForRows'
import { StakeModal } from '../../components/StakeModal'
import { FarmingType } from '../../hooks/useStakerHandlers'
import Modal from '../../components/Modal'
import { EmptyMock, EventsCards, EventsCardsRow, PageWrapper } from './styled'

function isActive(endTime: number, now: number) {
    return endTime * 1000 > now
}

export function FarmingEventsPage({
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

    // const changeActive = useMemo(() => data.some(el => isActive()), [data])

    const [modalForPool, setModalForPool] = useState(null)
    const chunked = useChunkedRows(data, 3)

    return (
        <PageWrapper>
            <Modal isOpen={Boolean(modalForPool)} onHide={() => setModalForPool(null)}
                   onDismiss={() => console.log()}>
                {modalForPool && (
                    <>
                        <StakeModal
                            event={modalForPool}
                            closeHandler={() => setModalForPool(null)}
                            farmingType={FarmingType.FINITE}
                        />
                    </>
                )}
            </Modal>
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
                ) : data && data.length !== 0 ? (
                    chunked?.map((el, i) => (
                        <EventsCardsRow key={i}>
                            {el.map(
                                (event, j) => {
                                   return <StakerEventCard refreshing={refreshing} active={event.active}
                                                     key={j} now={now} event={event}
                                                     stakeHandler={() => {
                                                         setModalForPool(event)
                                                     }} />
                                }
                            )}
                        </EventsCardsRow>
                    ))
                ) : data && data.length === 0 ? (
                    <EmptyMock>
                        <div>No farming events</div>
                        <Frown size={35} stroke={'white'} />
                    </EmptyMock>
                ) : null}
            </EventsCards>
        </PageWrapper>
    )
}
