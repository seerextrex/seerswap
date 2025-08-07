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
import { calculateFarmingPositionValueWithMetadata } from "../../utils/farmingPositionSimpleSDK";
import { formatDollarAmount } from "../../utils/numbers";
import { AlertCircle } from "react-feather";

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
    
    // Calculate position value with metadata
    const { positionValue, showWarning, warningMessage } = useMemo(() => {
        const result = calculateFarmingPositionValueWithMetadata(position);
        const value = result.value > 0 ? formatDollarAmount(result.value) : '--';
        const warning = result.missingPriceData || (result.hasError && result.value === 0);
        return {
            positionValue: value,
            showWarning: warning,
            warningMessage: result.errorReason || 'Unable to calculate value'
        };
    }, [position]);

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
            <div className="my-farms__position-value" style={{ 
                padding: '0.75rem 1rem', 
                fontSize: '1.2rem', 
                fontWeight: '600',
                color: 'var(--text1)',
                backgroundColor: 'var(--bg0)',
                border: '2px solid var(--primary1)',
                borderRadius: '8px',
                margin: '0.5rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span>Position Value:</span>
                <span style={{ 
                    color: 'var(--primary1)', 
                    fontSize: '1.3rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {positionValue}
                    {showWarning && (
                        <span 
                            title={warningMessage}
                            style={{ 
                                cursor: 'help',
                                display: 'inline-flex',
                                alignItems: 'center'
                            }}
                        >
                            <AlertCircle size={16} color="var(--warning)" />
                        </span>
                    )}
                </span>
            </div>
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
                                    <Trans>No infinite farms for now</Trans>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};