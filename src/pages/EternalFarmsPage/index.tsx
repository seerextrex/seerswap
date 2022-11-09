import { useEffect, useState } from "react";
import { Frown } from "react-feather";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import { FarmModal } from "../../components/FarmModal";
import { FarmingEventCard } from "../../components/FarmingEventCard";
import { FarmingType } from "../../models/enums";
import "./index.scss";

import { Trans } from "@lingui/macro";

export default function EternalFarmsPage({ data, refreshing, priceFetched, fetchHandler }: { data: any; refreshing: boolean; priceFetched: boolean; fetchHandler: () => any }) {
    const [modalForPool, setModalForPool] = useState(null);

    useEffect(() => {
        // if (priceFetched) {
        fetchHandler();
        // }
    }, [priceFetched]);

    return (
        <>
            <Modal isOpen={!!modalForPool} onHide={() => setModalForPool(null)} onDismiss={() => console.log()}>
                {modalForPool && <FarmModal event={modalForPool} closeHandler={() => setModalForPool(null)} farmingType={FarmingType.ETERNAL} />}
            </Modal>
            {refreshing ? (
                <div className={"eternal-page__loader"}>
                    <Loader stroke="white" size="1.5rem" />
                </div>
            ) : !data || data.length === 0 ? (
                <div className={"eternal-page__loader"}>
                    <div>
                        <Trans>No infinite farms</Trans>
                    </div>
                    <Frown size={"2rem"} stroke={"white"} />
                </div>
            ) : !refreshing && data.length !== 0 ? (
                <div className={"eternal-page__row mb-1 w-100"}>
                    {data.map((event: any, j: number) => (
                        <FarmingEventCard key={j} farmHandler={() => setModalForPool(event)} refreshing={refreshing} now={0} eternal event={event} />
                    ))}
                </div>
            ) : null}
        </>
    );
}
