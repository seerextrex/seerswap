import React, { useMemo } from "react";
import { Trans } from "@lingui/macro";
import { useLocation } from "react-router-dom";
import { FarmingType } from "../../models/enums";
import { PositionCardProps } from "./types";
import Loader from "../Loader";
import PositionHeader from "./PositionHeader";
import PositionCardBodyHeader from "./PositionCardBodyHeader";
import PositionCardBodyStat from "./PositionCardBodyStat";
import { CheckOut } from "./CheckOut";
import { AlertTriangle } from "react-feather";

export const PositionCard: React.FC<PositionCardProps> = ({
    position,
    onUnfarm,
    onSendModal,
    onCollectReward,
    onClaimRewards,
    eternalCollectReward,
    gettingReward,
    unfarming,
}) => {
    const { hash } = useLocation();
    const date = new Date(+position.enteredInEternalFarming * 1000).toLocaleString();
    
    // Check if farm is expired
    const isExpired = useMemo(() => {
        if (!position.eternalFarm) return false;
        
        // Use endTimeImplied if available, otherwise use endTime
        const endTimeValue = position.eternalFarm.endTimeImplied || position.eternalFarm.endTime;
        if (!endTimeValue) return false;
        
        const endTimestamp = Number(endTimeValue) * 1000; // Convert to milliseconds
        const now = Date.now();
        
        return now > endTimestamp;
    }, [position.eternalFarm]);
    

    return (
        <div 
            className="my-farms__position-card p-1 br-12 mb-1" 
            data-navigatedto={hash === `#${position.id}`}
        >
            <PositionHeader 
                el={position} 
                setUnstaking={(unstakingData: { id: string | null; state: string | null }) => {
                    if (unstakingData.id) {
                        onUnfarm(unstakingData.id);
                    }
                }}
                setSendModal={(id: string) => onSendModal(id)} 
                unstaking={unfarming} 
                withdrawHandler={onUnfarm} 
            />
            {position.eternalFarming && isExpired && (
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    margin: '0.5rem 1rem',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 87, 87, 0.1)',
                    border: '1px solid rgba(255, 87, 87, 0.3)',
                    fontSize: '0.9rem',
                    color: '#ff5757',
                    fontWeight: '500'
                }}>
                    <AlertTriangle size={14} />
                    Farm Expired
                </div>
            )}
            <div className="f cg-1 rg-1 mxs_fd-c">
                <div className="my-farms__position-card__body w-100 p-1 br-8">
                    <PositionCardBodyHeader
                        farmingType={FarmingType.ETERNAL}
                        date={date}
                        enteredInEternalFarming={position.enteredInEternalFarming}
                        eternalFarming={position.eternalFarming}
                        el={position}
                    />
                    {position.eternalFarming ? (
                        <>
                            <PositionCardBodyStat
                                rewardToken={position.eternalRewardToken}
                                earned={position.eternalEarned}
                                bonusEarned={position.eternalBonusEarned}
                                bonusRewardToken={position.eternalBonusRewardToken}
                            />
                            <div className="f mxs_fd-c w-100">
                                <button
                                    className="btn primary w-100 b br-8 pv-075"
                                    disabled={
                                        (eternalCollectReward.id === position.id && eternalCollectReward.state !== "done") ||
                                        (position.eternalEarned === 0 && position.eternalBonusEarned === 0)
                                    }
                                    onClick={() => onCollectReward(position.id, position)}
                                >
                                    {eternalCollectReward?.id === position.id && eternalCollectReward.state !== "done" ? (
                                        <div className="f f-jc f-ac cg-05">
                                            <Loader size="18px" stroke="var(--white)" />
                                            <Trans>Collecting</Trans>
                                        </div>
                                    ) : (
                                        <span>
                                            <Trans>Collect rewards</Trans>
                                        </span>
                                    )}
                                </button>
                                <button
                                    className="btn primary w-100 b br-8 ml-1 mxs_ml-0 mxs_mt-1 pv-075"
                                    disabled={
                                        gettingReward.id === position.id && 
                                        gettingReward.farmingType === FarmingType.ETERNAL && 
                                        gettingReward.state !== "done"
                                    }
                                    onClick={() => onClaimRewards(position.id, position)}
                                >
                                    {gettingReward?.id === position.id && 
                                     gettingReward.farmingType === FarmingType.ETERNAL && 
                                     gettingReward.state !== "done" ? (
                                        <div className="f f-jc f-ac cg-05">
                                            <Loader size="18px" stroke="var(--white)" />
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
                        <div className="my-farms__position-card__empty f c f-ac f-jc">
                            {position.eternalAvailable ? (
                                <CheckOut link="infinite-farms" />
                            ) : (
                                <div>
                                    <Trans>No farms for now</Trans>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};