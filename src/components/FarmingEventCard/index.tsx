import { Lock, Plus } from "react-feather";
import { useWalletModalToggle } from "../../state/application/hooks";
import { convertDateTime, getCountdownTime } from "../../utils/time";
import { getProgress } from "../../utils/getProgress";
import Loader from "../Loader";
import CurrencyLogo from "../CurrencyLogo";
import { LoadingShim } from "./styled";
import { useMemo } from "react";
import { convertLocalDate } from "../../utils/convertDate";
import { Token } from "@uniswap/sdk-core";
import { WrappedCurrency } from "../../models/types";
import { formatAmount, formatAmountTokens, formatDollarAmount } from "utils/numbers";
import "./index.scss";
import { Link } from "react-router-dom";

import { Trans, t } from "@lingui/macro";
import { formatUnits } from "ethers";

import AlgebraConfig from "algebra.config";
import { useAccount } from "wagmi";

// Define a more specific type for items in rewardList
interface RewardListItem {
    token: any; // Should ideally be TokenSubgraph
    amount?: number; // Or string if pre-formatted
    rewardRate?: number;
}

interface FarmingEventCardProps {
    active?: boolean;
    now?: number;
    refreshing?: boolean;
    farmHandler?: () => void;
    event?: {
        id?: any;
        pool?: any;
        createdAtTimestamp?: string;
        rewardToken?: any;
        bonusRewardToken?: any;
        reward?: number;
        bonusReward?: number;
        startTime?: number;
        endTime?: number;
        enterStartTime?: number;
        apr?: number;
        tvl?: number;
        locked?: boolean;
        dailyRewardRate?: number;
        dailyBonusRewardRate?: number;
    };
    eternal?: boolean;
    secret?: boolean;
}

export function FarmingEventCard({
    active,
    refreshing,
    farmHandler,
    now,
    event,
    eternal,
}: FarmingEventCardProps) {
    const { address: account } = useAccount();
    const toggleWalletModal = useWalletModalToggle();

    const {
        pool,
        createdAtTimestamp,
        rewardToken,
        bonusRewardToken,
        reward,
        bonusReward,
        startTime,
        endTime,
        apr,
        locked,
        enterStartTime,
        tvl,
        dailyRewardRate,
        dailyBonusRewardRate
    } = event || {};

    const _startTime = useMemo(() => {
        if (!startTime) return [];
        const date = new Date(+startTime * 1000);
        return [convertLocalDate(date), convertDateTime(date)];
    }, [startTime]);

    const _endTime = useMemo(() => {
        if (!endTime) return [];
        const date = new Date(+endTime * 1000);
        return [convertLocalDate(date), convertDateTime(date)];
    }, [endTime]);

    const _enterTime = useMemo(() => {
        if (enterStartTime === undefined || enterStartTime === null) return [undefined, undefined];
        const date = new Date(+enterStartTime * 1000);
        return [convertLocalDate(date), convertDateTime(date)];
    }, [enterStartTime]);

    const rewardList: RewardListItem[] = useMemo(() => {
        const currentEvent = event || {};
        const {
            rewardToken: currentRewardToken,
            bonusRewardToken: currentBonusRewardToken,
            reward: currentReward,
            bonusReward: currentBonusReward,
            dailyRewardRate: currentDailyRewardRate,
            dailyBonusRewardRate: currentDailyBonusRewardRate
        } = currentEvent;

        if (!currentRewardToken) return [];

        if (!eternal && (currentReward === undefined || currentBonusReward === undefined)) return [];
        if (eternal && (currentDailyRewardRate === undefined && currentDailyBonusRewardRate === undefined)) return [];

        const list: RewardListItem[] = []; // Explicitly type the list

        if (currentBonusRewardToken && currentRewardToken.id === currentBonusRewardToken.id) {
            const totalReward = BigInt(currentReward || 0) + BigInt(currentBonusReward || 0);
            const formattedAmount = currentRewardToken.decimals ? formatUnits(totalReward, Number(currentRewardToken.decimals)) : '0';
            list.push({ token: currentRewardToken, rewardRate: (currentDailyRewardRate || 0) + (currentDailyBonusRewardRate || 0), amount: parseFloat(formattedAmount) });
            return list;
        }

        if (currentRewardToken) {
            list.push({ token: currentRewardToken, amount: currentReward, rewardRate: currentDailyRewardRate });
        }
        if (currentBonusRewardToken) {
            list.push({ token: currentBonusRewardToken, amount: currentBonusReward, rewardRate: currentDailyBonusRewardRate });
        }
        return list;

    }, [event, eternal]);

    if (!event || !event.pool || !event.pool.token0 || !event.pool.token1 || !event.rewardToken) {
        console.warn("FarmingEventCard: Missing critical event data (pool or rewardToken)", { event });
        return <div className={"farming-event-card p-1 br-12"}><Trans>Loading farm data...</Trans></div>;
    }

    const isFarmButtonDisabled = locked || (enterStartTime !== undefined && new Date(+enterStartTime * 1000).getTime() > Date.now());

    return (
        <div className={"farming-event-card p-1 br-12"} data-refreshing={refreshing}>
            {refreshing && (
                <LoadingShim>
                    <Loader size={"18px"} stroke={"white"} style={{ margin: "auto" }} />
                </LoadingShim>
            )}
            {locked && (
                <LoadingShim>
                    <div style={{ padding: "1rem", background: "#fff", borderRadius: "8px", color: "black" }}>
                        <div className="mb-1 f f-ac f-jc">
                            <span className="mr-05">
                                <Lock size={"16px"} stroke={"black"} />
                            </span>
                            <span>
                                <Trans>This farm is filled</Trans>
                            </span>
                        </div>
                        <div>
                            <Link
                                to={"/farming/infinite-farms"}
                                className={"farming-event-card__infinite-farming-available"}
                                style={{ padding: "6px 10px", borderRadius: "8px", color: "var(--white)", background: "var(--primary)" }}
                            >
                                <Trans>Infinite WETH farm is available →</Trans>
                            </Link>
                        </div>
                    </div>
                </LoadingShim>
            )}
            <div className={"f mb-1"}>
                <div className={"f mr-1"}>
                    <CurrencyLogo currency={new Token(AlgebraConfig.CHAIN_PARAMS.chainId, pool.token0.id, Number(pool.token0.decimals), pool.token0.symbol) as WrappedCurrency} size={"30px"} />
                    <CurrencyLogo currency={new Token(AlgebraConfig.CHAIN_PARAMS.chainId, pool.token1.id, Number(pool.token1.decimals), pool.token1.symbol) as WrappedCurrency} size={"30px"} />
                </div>
                <div>
                    <h3 className={"fs-075 b"}>
                        <Trans>POOL</Trans>
                    </h3>
                    <div style={{ marginTop: "2px" }}>{`${pool.token0.symbol}/${pool.token1.symbol}`}</div>
                </div>
                {(apr !== undefined && apr > 0) ? (
                    <div className={"farming-event-card__reward-apr p-05 br-8 ml-a fs-085"}>
                        <span>{Math.round(apr)}%</span>
                        <span style={{ marginLeft: "5px" }}>APR</span>
                    </div>
                ) : null}
            </div>
            <div className={"farming-event-card__reward-wrapper mb-05 f c br-8"}>
                <div className="farming-event-card__reward-wrapper-header fs-075 b">
                    <Trans>REWARDS</Trans>
                </div>
                <ul className="farming-event-card__reward-list">
                    {rewardList?.map((rewardItem: RewardListItem, i: number) =>
                        rewardItem && rewardItem.token && (rewardItem.rewardRate !== undefined || rewardItem.amount !== undefined) ? (
                            <li key={i} className="farming-event-card__reward-list-item f">
                                <CurrencyLogo currency={new Token(AlgebraConfig.CHAIN_PARAMS.chainId, rewardItem.token.id, Number(rewardItem.token.decimals), rewardItem.token.symbol) as WrappedCurrency} size={"30px"} />
                                <span className="farming-event-card__reward-list-item__symbol ml-05">{rewardItem.token.symbol}</span>
                                <div className={"m-a mr-0 fs-085"} title={rewardItem.amount?.toString() || 'N/A'}>
                                    {eternal ?
                                        (rewardItem.rewardRate !== undefined ? <span>{formatAmountTokens(rewardItem.rewardRate, false)} per day</span> : <Trans>N/A</Trans>) :
                                        (rewardItem.amount !== undefined ? <span>{formatAmountTokens(rewardItem.amount, false)}</span> : <Trans>N/A</Trans>)
                                    }
                                </div>
                            </li>
                        ) : null
                    )}
                </ul>
            </div>
            {!eternal && (
                <div className="w-100 farming-event-card__timeline">
                    <div className="w-100 f farming-event-card__timeline-dates">
                        <div className="w-100 b fs-075 ta-l">
                            <Trans>Enter</Trans>
                        </div>
                        <div className="w-100 b fs-075 ta-c">
                            <Trans>Start</Trans>
                        </div>
                        <div className="w-100 b fs-075 ta-r">
                            <Trans>End</Trans>
                        </div>
                    </div>
                    <div className="w-100 f mt-05">
                        <div className="f f-ac f-jc farming-event-card__timeline-circle">
                            <div className={`farming-event-card__timeline-circle__inner ${!active && enterStartTime !== undefined && (new Date(+enterStartTime * 1000).getTime() < Date.now()) ? "active" : ""}`}></div>
                        </div>
                        <div className="farming-event-card__timeline-line">
                            <div
                                className="farming-event-card__timeline-line__inner"
                                style={{ width: active ? "100%" : (enterStartTime !== undefined && new Date(+enterStartTime * 1000).getTime() >= Date.now()) ? "0%" : `${getProgress(Number(createdAtTimestamp), startTime, now)}%` }}
                            ></div>
                        </div>
                        <div className="f f-ac f-jc farming-event-card__timeline-circle">{active && <div className="farming-event-card__timeline-circle__inner active" />}</div>
                        <div className="farming-event-card__timeline-line">
                            {active && <div className="w-100 farming-event-card__timeline-line__inner" style={{ width: `${getProgress(startTime, endTime, now)}%` }}></div>}
                        </div>
                        <div className="farming-event-card__timeline-circle"></div>
                    </div>
                    <div className="w-100 f fs-085" style={{ marginTop: "10px" }}>
                        <div className="w-100 f f-ac">
                            <div className="farming-event-card__timeline-calendar first ta-c">
                                <div className="farming-event-card__timeline-calendar-day">{_enterTime[0] || 'N/A'}</div>
                                <div className="farming-event-card__timeline-calendar-hour">{_enterTime[1] || '--:--'}</div>
                            </div>
                        </div>
                        <div className="w-100 f f-ac f-jc">
                            <div className="farming-event-card__timeline-calendar second ta-c">
                                <div className="farming-event-card__timeline-calendar-day">{_startTime[0] || 'N/A'}</div>
                                <div className="farming-event-card__timeline-calendar-hour">{_startTime[1] || '--:--'}</div>
                            </div>
                        </div>
                        <div className="w-100 f f-jc" style={{ justifyContent: "flex-end" }}>
                            <div className="farming-event-card__timeline-calendar third ta-c">
                                <div className="farming-event-card__timeline-calendar-day">{_endTime[0] || 'N/A'}</div>
                                <div className="farming-event-card__timeline-calendar-hour">{_endTime[1] || '--:--'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {account && !active ? (
                <>
                    <button
                        style={{ marginTop: "9px", border: "none", lineHeight: "19px", height: "36px" }}
                        disabled={isFarmButtonDisabled}
                        className={`btn primary w-100 b br-8 fs-085 pv-05 ${!eternal ? "mt-05" : ""}`}
                        onClick={farmHandler}
                    >
                        <span>{locked ? t`Filled` : t`Farm`}</span>
                    </button>
                </>
            ) : active ? (
                <div className={"mt-1 fs-085 p-05 br-8 ta-c mt-1 bg-pw"} style={{ marginTop: "9px", border: "none", lineHeight: "19px", height: "36px" }}>
                    <Trans>Started!</Trans>
                </div>
            ) : (
                <button className={`btn primary w-100 b pv-05 ${!eternal ? "mt-05" : ""}`} onClick={toggleWalletModal}>
                    <Trans>Connect Wallet</Trans>
                </button>
            )}
        </div>
    );
}
