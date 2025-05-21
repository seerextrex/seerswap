import { isAddress } from "@ethersproject/address";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Frown } from "react-feather";
import { useFarmingHandlers } from "../../hooks/useFarmingHandlers";
import { useAccount } from "wagmi";
import { useAllTransactions } from "../../state/transactions/hooks";
import Loader from "../Loader";
import Modal from "../Modal";
import { Deposit, RewardInterface, UnfarmingInterface, DefaultFarming, DefaultFarmingWithError } from "../../models/interfaces";
import { FarmingType } from "../../models/enums";
import { getCountdownTime } from "../../utils/time";
import { getProgress } from "../../utils/getProgress";
import { CheckOut } from "./CheckOut";
import { Link, useLocation } from "react-router-dom";
import { useSortedRecentTransactions } from "../../hooks/useSortedRecentTransactions";
import "./index.scss";
import ModalBody from "./ModalBody";
import PositionHeader from "./PositionHeader";
import PositionCardBodyHeader from "./PositionCardBodyHeader";
import PositionCardBodyStat from "./PositionCardBodyStat";
import { t, Trans } from "@lingui/macro";

interface FarmingMyFarmsProps {
    data: Deposit[] | null;
    refreshing: boolean;
    now: number;
    fetchHandler: () => any;
}

export function FarmingMyFarms({ data, refreshing, now, fetchHandler }: FarmingMyFarmsProps) {
    const { address: account } = useAccount();

    const {
        getRewardsHash,
        transferNFTFromFarmingCenterHandler,
        eternalCollectRewardHandler,
        withdrawHandler,
        exitHandler,
        claimRewardsHandler,
        claimRewardHash,
        transferedHash,
        eternalCollectRewardHash,
        withdrawnHash,
    } = useFarmingHandlers() || {};

    const [sendModal, setSendModal] = useState<string | null>(null);
    const [recipient, setRecipient] = useState<string>("");
    const [sending, setSending] = useState<UnfarmingInterface>({ id: null, state: null });
    const [shallowPositions, setShallowPositions] = useState<Deposit[] | null>(null);
    const [gettingReward, setGettingReward] = useState<RewardInterface>({ id: null, state: null, farmingType: null });
    const [eternalCollectReward, setEternalCollectReward] = useState<UnfarmingInterface>({ id: null, state: null });
    const [unfarming, setUnfarming] = useState<UnfarmingInterface>({ id: null, state: null });

    const allTransactions = useAllTransactions();
    const sortedRecentTransactions = useSortedRecentTransactions();
    const { hash } = useLocation();

    const confirmed = useMemo(() => sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash), [sortedRecentTransactions, allTransactions]);

    const farmedNFTs = useMemo(() => {
        if (!shallowPositions) return;
        const _positions = shallowPositions.filter((v) => v.onFarmingCenter);
        return _positions.length > 0 ? _positions : [];
    }, [shallowPositions]);

    const sendNFTHandler = useCallback(
        (v: any) => {
            if (!isAddress(recipient) || recipient === account) {
                return;
            }
            if (transferNFTFromFarmingCenterHandler) {
                transferNFTFromFarmingCenterHandler(recipient, v.id);
                setSending({ id: v.id, state: "pending" });
            }
        },
        [recipient, account, transferNFTFromFarmingCenterHandler]
    );

    useEffect(() => {
        fetchHandler();
    }, [account]);

    useEffect(() => {
        setShallowPositions(data);
    }, [data]);

    useEffect(() => {
        if (!sending.state || sending.state !== 'pending' || !sending.id) return;

        if (typeof transferedHash === "string") {
            console.error("Send NFT Error (raw string from transferedHash):", transferedHash);
            setSending({ id: sending.id, state: "error" });
        } else if (transferedHash && typeof transferedHash === 'object' && 'hash' in transferedHash && transferedHash.hash && confirmed.includes(String(transferedHash.hash))) {
            if (transferedHash.id === sending.id) {
                setSending({ id: transferedHash.id, state: "done" });
                if (shallowPositions) {
                    setShallowPositions(shallowPositions.filter((el) => el.id !== transferedHash.id));
                }
            }
        } else if (transferedHash && typeof transferedHash === 'object' && 'error' in transferedHash && transferedHash.error && transferedHash.id === sending.id) {
            const errorObj = transferedHash as DefaultFarmingWithError;
            console.error("Send NFT Error (from transferedHash.error):", errorObj.error);
            setSending({ id: sending.id, state: "error" });
        }
    }, [transferedHash, confirmed, shallowPositions, sending.id, sending.state]);

    useEffect(() => {
        if (!eternalCollectReward.state) return;

        if (typeof eternalCollectRewardHash === "string") {
            setEternalCollectReward({ id: null, state: null });
        } else if (eternalCollectRewardHash && confirmed.includes(String(eternalCollectRewardHash.hash))) {
            setEternalCollectReward({ id: eternalCollectRewardHash.id, state: "done" });
            if (!shallowPositions) return;
            setShallowPositions(
                shallowPositions.map((el) => {
                    if (el.id === eternalCollectRewardHash.id) {
                        el.eternalEarned = 0;
                        el.eternalBonusEarned = 0;
                    }
                    return el;
                })
            );
        }
    }, [eternalCollectRewardHash, confirmed]);

    useEffect(() => {
        if (!unfarming.state) return;

        if (typeof withdrawnHash === "string") {
            setUnfarming({ id: null, state: null });
        } else if (withdrawnHash && confirmed.includes(String(withdrawnHash.hash))) {
            setUnfarming({ id: withdrawnHash.id, state: "done" });
            if (!shallowPositions) return;
            setShallowPositions(
                shallowPositions.map((el) => {
                    if (el.id === withdrawnHash.id) {
                        el.onFarmingCenter = false;
                    }
                    return el;
                })
            );
        }
    }, [withdrawnHash, confirmed]);

    useEffect(() => {
        if (!gettingReward.state) return;

        if (typeof claimRewardHash === "string") {
            setGettingReward({ id: null, state: null, farmingType: null });
        } else if (claimRewardHash && confirmed.includes(String(claimRewardHash.hash))) {
            setGettingReward({
                id: claimRewardHash.id,
                state: "done",
                farmingType: claimRewardHash.farmingType,
            });
            if (!shallowPositions) return;
            setShallowPositions(
                shallowPositions.map((el) => {
                    if (el.id === claimRewardHash.id) {
                        if (claimRewardHash.farmingType === FarmingType.LIMIT) {
                            el.limitFarming = null;
                        } else {
                            el.eternalFarming = null;
                        }
                    }
                    return el;
                })
            );
        }
    }, [claimRewardHash, confirmed]);

    useEffect(() => {
        if (!gettingReward.state) return;

        if (typeof getRewardsHash === "string") {
            setGettingReward({ id: null, state: null, farmingType: null });
        } else if (getRewardsHash && confirmed.includes(String(getRewardsHash.hash))) {
            setGettingReward({
                id: getRewardsHash.id,
                state: "done",
                farmingType: getRewardsHash.farmingType,
            });
            if (!shallowPositions) return;
            setShallowPositions(
                shallowPositions.map((el) => {
                    if (el.id === getRewardsHash.id) {
                        if (getRewardsHash.farmingType === FarmingType.LIMIT) {
                            el.limitFarming = null;
                        } else {
                            el.eternalFarming = null;
                        }
                    }
                    return el;
                })
            );
        }
    }, [getRewardsHash, confirmed]);

    return (
        <>
            <Modal
                isOpen={Boolean(sendModal)}
                onDismiss={() => {
                    if (sending.state !== "pending") {
                        setSendModal(null);
                        setRecipient("");
                        setTimeout(() => setSending({ id: null, state: null }));
                    }
                }}
            >
                <ModalBody
                    recipient={recipient}
                    setRecipient={setRecipient}
                    sendModal={sendModal}
                    sending={sending}
                    setSending={setSending}
                    sendNFTHandler={sendNFTHandler}
                    account={account ?? undefined}
                />
            </Modal>
            {refreshing || !shallowPositions ? (
                <div className={"my-farms__loader flex-s-between f-jc"}>
                    <Loader stroke={"white"} size={"1.5rem"} />
                </div>
            ) : shallowPositions && shallowPositions.length === 0 ? (
                <div className={"my-farms__loader flex-s-between f c f-jc"}>
                    <Frown size={35} stroke={"white"} />
                    <div className={"mt-1"}>
                        <Trans>No farms</Trans>
                    </div>
                </div>
            ) : shallowPositions && shallowPositions.length !== 0 ? (
                <>
                    {farmedNFTs && (
                        <div>
                            {farmedNFTs.map((el, i) => {
                                const date = new Date(+el.enteredInEternalFarming * 1000).toLocaleString();

                                return (
                                    <div className={"my-farms__position-card p-1 br-12 mb-1"} key={i} data-navigatedto={hash == `#${el.id}`}>
                                        <PositionHeader el={el} setUnstaking={setUnfarming} setSendModal={setSendModal} unstaking={unfarming} withdrawHandler={withdrawHandler} />
                                        <div className={"f cg-1 rg-1 mxs_fd-c"}>
                                            <div className={"my-farms__position-card__body w-100 p-1 br-8"}>
                                                <PositionCardBodyHeader
                                                    farmingType={FarmingType.ETERNAL}
                                                    date={date}
                                                    enteredInEternalFarming={el.enteredInEternalFarming}
                                                    eternalFarming={el.eternalFarming}
                                                    el={el}
                                                />
                                                {el.eternalFarming ? (
                                                    <>
                                                        <PositionCardBodyStat
                                                            rewardToken={el.eternalRewardToken}
                                                            earned={el.eternalEarned}
                                                            bonusEarned={el.eternalBonusEarned}
                                                            bonusRewardToken={el.eternalBonusRewardToken}
                                                        />
                                                        <div className={"f mxs_fd-c w-100"}>
                                                            <button
                                                                className={"btn primary w-100 b br-8 pv-075"}
                                                                disabled={
                                                                    (eternalCollectReward.id === el.id && eternalCollectReward.state !== "done") ||
                                                                    (el.eternalEarned == 0 && el.eternalBonusEarned == 0)
                                                                }
                                                                onClick={() => {
                                                                    setEternalCollectReward({
                                                                        id: el.id,
                                                                        state: "pending",
                                                                    });
                                                                    eternalCollectRewardHandler(el.id, { ...el });
                                                                }}
                                                            >
                                                                {eternalCollectReward && eternalCollectReward.id === el.id && eternalCollectReward.state !== "done" ? (
                                                                    <div className={"f f-jc f-ac cg-05"}>
                                                                        <Loader size={"18px"} stroke={"var(--white)"} />
                                                                        <Trans>Collecting</Trans>
                                                                    </div>
                                                                ) : (
                                                                    <span>
                                                                        <Trans>Collect rewards</Trans>
                                                                    </span>
                                                                )}
                                                            </button>
                                                            <button
                                                                className={"btn primary w-100 b br-8 ml-1 mxs_ml-0 mxs_mt-1 pv-075"}
                                                                disabled={gettingReward.id === el.id && gettingReward.farmingType === FarmingType.ETERNAL && gettingReward.state !== "done"}
                                                                onClick={() => {
                                                                    setGettingReward({
                                                                        id: el.id,
                                                                        state: "pending",
                                                                        farmingType: FarmingType.ETERNAL,
                                                                    });
                                                                    claimRewardsHandler(el.id, { ...el }, FarmingType.ETERNAL);
                                                                }}
                                                            >
                                                                {gettingReward && gettingReward.id === el.id && gettingReward.farmingType === FarmingType.ETERNAL && gettingReward.state !== "done" ? (
                                                                    <div className={"f f-jc f-ac cg-05"}>
                                                                        <Loader size={"18px"} stroke={"var(--white)"} />
                                                                        <Trans>Withdrawing</Trans>
                                                                    </div>
                                                                ) : (
                                                                    <span>
                                                                        <Trans>Withdraw</Trans>
                                                                    </span>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className={"my-farms__position-card__empty f c f-ac f-jc"}>
                                                        {el.eternalAvailable ? (
                                                            <CheckOut link={"infinite-farms"} />
                                                        ) : (
                                                            <div>
                                                                <Trans>No infinite farms for now</Trans>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            ) : null}
        </>
    );
}
