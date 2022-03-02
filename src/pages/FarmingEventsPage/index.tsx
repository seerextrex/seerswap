import { useEffect, useMemo, useState } from "react";
import { Frown } from "react-feather";
import { StakerEventCard } from "../../components/StakerEventCard";
import { StakeModal } from "../../components/StakeModal";
import { FarmingType } from "../../models/enums";
import Modal from "../../components/Modal";
import { EmptyMock, EventsCards, EventsCardsRow, PageWrapper } from "./styled";
import Loader from "../../components/Loader";

export function FarmingEventsPage({ data, now, refreshing, fetchHandler }: { data: { currentEvents: any[]; futureEvents: any[] } | null; now: number; refreshing: boolean; fetchHandler: () => any }) {
    const [modalForPool, setModalForPool] = useState(null);

    // const formattedData = useMemo(() => {
    //     if (!data || typeof data === 'string') return []

    //     return [...data?.futureEvents, ...data?.currentEvents]
    // }, [data])

    const formattedData: any[] = [];

    useEffect(() => {
        fetchHandler();
    }, []);

    return (
        <PageWrapper>
            <Modal isOpen={Boolean(modalForPool)} onHide={() => setModalForPool(null)} onDismiss={() => console.log()}>
                {modalForPool && (
                    <>
                        <StakeModal event={modalForPool} closeHandler={() => setModalForPool(null)} farmingType={FarmingType.FINITE} />
                    </>
                )}
            </Modal>
            <EventsCards>
                {refreshing ? (
                    <EmptyMock>
                        <Loader stroke={"white"} size={"20px"} />
                    </EmptyMock>
                ) : formattedData.length !== 0 ? (
                    <EventsCardsRow>
                        {formattedData.map((event, j) => {
                            const isStarted = event.startTime <= Math.round(Date.now() / 1000);
                            const isEnded = event.endTime <= Math.round(Date.now() / 1000);

                            if (isEnded) return;

                            const active = isStarted && !isEnded;

                            return (
                                <StakerEventCard
                                    refreshing={refreshing}
                                    active={active}
                                    key={j}
                                    now={now}
                                    event={event}
                                    stakeHandler={() => {
                                        setModalForPool(event);
                                    }}
                                />
                            );
                        })}
                    </EventsCardsRow>
                ) : formattedData && formattedData.length === 0 ? (
                    <EmptyMock>
                        <div>No limit farms</div>
                        <Frown size={35} stroke={"white"} />
                    </EmptyMock>
                ) : (
                    <EmptyMock />
                )}
            </EventsCards>
        </PageWrapper>
    );
}
