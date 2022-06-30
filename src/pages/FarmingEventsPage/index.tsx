import { useEffect, useMemo, useState } from "react";
import { Frown } from "react-feather";
import { FarmingEventCard } from "../../components/FarmingEventCard";
import { FarmModal } from "../../components/FarmModal";
import { FarmingType } from "../../models/enums";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import "./index.scss";

import { Trans } from "@lingui/macro";

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

        if (Date.now() < 1652108400000) {
            return [...data?.currentEvents];
        } else {
            return [...data?.futureEvents, ...data?.currentEvents];
        }
    }, [data]);

    useEffect(() => {
        fetchHandler();
    }, []);

    return (
        <div className={"w-100"}>
            <Modal isOpen={Boolean(modalForPool)} onHide={() => setModalForPool(null)} onDismiss={() => console.log()}>
                {modalForPool && (
                    <>
                        <FarmModal event={modalForPool} closeHandler={() => setModalForPool(null)} farmingType={FarmingType.FINITE} />
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
                            <FarmingEventCard
                                refreshing={refreshing}
                                active={active}
                                key={j}
                                now={now}
                                event={event}
                                farmHandler={() => {
                                    setModalForPool(event);
                                }}
                            />
                        );
                    })}
                    {Date.now() < 1652108400000 && <FarmingEventCard secret />}
                </div>
            ) : formattedData && formattedData.length === 0 ? (
                Date.now() < 1651244400000 ? (
                    <div className={"farmings-page__row mb-1 rg-1 cg-1 "}>{<FarmingEventCard secret />}</div>
                ) : (
                    <div className={"farmings-page__loader f c f-ac f-jc"}>
                        <Frown size={35} stroke={"white"} className={"mb-1"} />
                        <div>
                            <Trans>No limit farms</Trans>
                        </div>
                    </div>
                )
            ) : (
                <div className={"farmings-page__loader f f-ac f-jc"} />
            )}
        </div>
    );
}
