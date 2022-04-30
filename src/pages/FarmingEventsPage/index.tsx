import { useEffect, useMemo, useState } from "react";
import { Frown } from "react-feather";
import { StakerEventCard } from "../../components/StakerEventCard";
import { StakeModal } from "../../components/StakeModal";
import { FarmingType } from "../../models/enums";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import "./index.scss";

interface FarmingEventsPageProps {
    data: { currentEvents: any[]; futureEvents: any[] } | null;
    now: number;
    refreshing: boolean;
    fetchHandler: () => any;
}

export function FarmingEventsPage({ data, now, refreshing, fetchHandler }: FarmingEventsPageProps) {
    const [modalForPool, setModalForPool] = useState(null);

    const formattedData = useMemo(() => {
        if (!data || typeof data === "string") return [];

        return [...data?.futureEvents, ...data?.currentEvents];
    }, [data]);

    useEffect(() => {
        fetchHandler();
    }, []);

    return (
        <div className={"w-100"}>
            <Modal isOpen={Boolean(modalForPool)} onHide={() => setModalForPool(null)} onDismiss={() => console.log()}>
                {modalForPool && (
                    <>
                        <StakeModal event={modalForPool} closeHandler={() => setModalForPool(null)} farmingType={FarmingType.FINITE} />
                    </>
                )}
            </Modal>
            {refreshing ? (
                <div className={"farmings-page__loader f f-ac f-jc"}>
                    <Loader stroke={"white"} size={"1.5rem"} />
                </div>
            ) : formattedData.length !== 0 ? (
                <div className={"farmings-page__row mb-1 rg-1 cg-1 "}>
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
                    {Date.now() < 1652108400000 && <StakerEventCard secret />}
                </div>
            ) : formattedData && formattedData.length === 0 ? (
                Date.now() < 1651244400000 ? (
                    <div className={"farmings-page__row mb-1 rg-1 cg-1 "}>{<StakerEventCard secret />}</div>
                ) : (
                    <div className={"farmings-page__loader f c f-ac f-jc"}>
                        <Frown size={35} stroke={"white"} className={"mb-1"} />
                        <div>No limit farms</div>
                    </div>
                )
            ) : (
                <div className={"farmings-page__loader f f-ac f-jc"} />
            )}
        </div>
    );
}
