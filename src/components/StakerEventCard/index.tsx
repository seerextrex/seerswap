import { Lock, Plus } from "react-feather";
import { useActiveWeb3React } from "../../hooks/web3";
import { useWalletModalToggle } from "../../state/application/hooks";
import { convertDateTime, getCountdownTime } from "../../utils/time";
import { getProgress } from "../../utils/getProgress";
import Loader from "../Loader";
import CurrencyLogo from "../CurrencyLogo";
import { LoadingShim } from "./styled";
import { useMemo } from "react";
import { convertLocalDate } from "../../utils/convertDate";
import { Token } from "@uniswap/sdk-core";
import { SupportedChainId } from "../../constants/chains";
import { WrappedCurrency } from "../../models/types";
import { formatAmountTokens } from "utils/numbers";
import "./index.scss";
import { Link } from "react-router-dom";

interface StakerEventCardProps {
    active?: boolean;
    now?: number;
    refreshing?: boolean;
    stakeHandler?: () => void;
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
        locked?: boolean;
    };
    eternal?: boolean;
    secret?: boolean;
}

export function StakerEventCard({
    active,
    refreshing,
    stakeHandler,
    now,
    event: { pool, createdAtTimestamp, rewardToken, bonusRewardToken, reward, bonusReward, startTime, endTime, apr, locked, enterStartTime } = {},
    eternal,
    secret,
}: StakerEventCardProps) {
    const { account } = useActiveWeb3React();
    const toggleWalletModal = useWalletModalToggle();

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
        if (!enterStartTime) return [];

        const date = new Date((+enterStartTime * 1000));

        return [convertLocalDate(date), convertDateTime(date)];
    }, [startTime]);

    const rewardList = useMemo(() => {
        if (!reward || !bonusReward) return;

        if (rewardToken.id === bonusRewardToken.id) {
            return [{ token: rewardToken, amount: +reward + +bonusReward }];
        }

        return [
            { token: rewardToken, amount: reward },
            { token: bonusRewardToken, amount: bonusReward },
        ];
    }, [reward, bonusReward, rewardToken, bonusRewardToken]);

    if (secret) {
        return (
            <div className={"staker-event-card p-1 br-12"} data-refreshing={refreshing}>
                <div className={"f mb-1"}>
                    <div className={"f mr-1"}>
                        <CurrencyLogo currency={new Token(SupportedChainId.POLYGON, "0x580a84c73811e1839f75d86d75d88cca0c241ff4", 18, "QI") as WrappedCurrency} size={"30px"} />
                        <CurrencyLogo currency={new Token(SupportedChainId.POLYGON, "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", 18, "MATIC") as WrappedCurrency} size={"30px"} />
                    </div>
                    <div>
                        <h3 className={"fs-075 b"}>POOL</h3>
                        <div style={{ marginTop: "2px" }}>{`QI / WMATIC`}</div>
                    </div>
                    {/* {
                        <div className={"staker-event-card__reward-tier p-05 br-8 ml-a fs-085"}>
                            <span>👑 Tier</span>
                        </div>
                    } */}
                </div>
                <div className={"staker-event-card__reward-wrapper mb-05 f c br-8"}>
                    <div className="staker-event-card__reward-wrapper-header fs-075 b">REWARDS</div>
                    <ul className="staker-event-card__reward-list">
                        {[{ token: { id: "0xa3fa99a148fa48d14ed51d610c367c61876997f1", symbol: "MAI" }, amount: "2500" }].map((reward: any, i) => (
                            <li key={i} className="staker-event-card__reward-list-item f">
                                <CurrencyLogo currency={new Token(SupportedChainId.POLYGON, reward.token.id, 18, reward.token.symbol) as WrappedCurrency} size={"30px"} />
                                <span className="staker-event-card__reward-list-item__symbol ml-05">{reward.token.symbol}</span>
                                <div className={"m-a mr-0 fs-085"} title={reward.amount.toString()}>
                                    <span>{formatAmountTokens(reward.amount, false)}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                {!eternal && (
                    <div className="w-100 staker-event-card__timeline">
                        <div className="w-100 f staker-event-card__timeline-dates">
                            <div className="w-100 b fs-075 ta-l">Enter</div>
                            <div className="w-100 b fs-075 ta-c">Start</div>
                            <div className="w-100 b fs-075 ta-r">End</div>
                        </div>
                        <div className="w-100 f mt-05">
                            <div className="f f-ac f-jc staker-event-card__timeline-circle">
                                <div className="staker-event-card__timeline-circle__inner active"></div>
                            </div>
                            <div className="staker-event-card__timeline-line">
                                <div className="staker-event-card__timeline-line__inner" style={{ width: active ? "100%" : `${getProgress(Number(now), 1652382000000, now)}%` }}></div>
                            </div>
                            <div className="f f-ac f-jc staker-event-card__timeline-circle">{active && <div className="staker-event-card__timeline-circle__inner"></div>}</div>
                            <div className="staker-event-card__timeline-line">{active && <div className="w-100 staker-event-card__timeline-line__inner" style={{ width: `0%` }}></div>}</div>
                            <div className="staker-event-card__timeline-circle"></div>
                        </div>
                        <div className="w-100 f fs-085" style={{ marginTop: "10px" }}>
                            <div className="w-100 f f-ac">
                                <div className="staker-event-card__timeline-calendar first ta-c">
                                    <div className="staker-event-card__timeline-calendar-day">{convertLocalDate(new Date(1652108400000))}</div>
                                    <div className="staker-event-card__timeline-calendar-hour">{convertDateTime(new Date(1652108400000))}</div>
                                </div>
                            </div>
                            <div className="w-100 f f-ac f-jc">
                                <div className="staker-event-card__timeline-calendar second ta-c">
                                    <div className="staker-event-card__timeline-calendar-day">{convertLocalDate(new Date(1652382000000))}</div>
                                    <div className="staker-event-card__timeline-calendar-hour">{convertDateTime(new Date(1652382000000))}</div>
                                </div>
                            </div>
                            <div className="w-100 f f-jc" style={{ justifyContent: "flex-end" }}>
                                <div className="staker-event-card__timeline-calendar third ta-c">
                                    <div className="staker-event-card__timeline-calendar-day">{convertLocalDate(new Date(1652986800000))}</div>
                                    <div className="staker-event-card__timeline-calendar-hour">{convertDateTime(new Date(1652986800000))}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className={"mt-1 fs-085 p-05 br-8 ta-c bg-v"} style={{ marginTop: "9px", height: "36px", lineHeight: "19px" }}>
                    ⚡ Upcoming farm
                </div>
            </div>
        );
    }

    return (
        <div className={"staker-event-card p-1 br-12"} data-refreshing={refreshing}>
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
                            <span>This farm is filled</span>
                        </div>
                        <div>
                            <Link
                                to={"/farming/infinite-farms"}
                                className={"staker-event-card__infinite-farming-available"}
                                style={{ padding: "6px 10px", borderRadius: "8px", color: "var(--white)", background: "var(--primary)" }}
                            >
                                Infinite WETH farm is available →
                            </Link>
                        </div>
                    </div>
                </LoadingShim>
            )}
            <div className={"f mb-1"}>
                <div className={"f mr-1"}>
                    <CurrencyLogo currency={new Token(SupportedChainId.POLYGON, pool.token0.id, 18, pool.token0.symbol) as WrappedCurrency} size={"30px"} />
                    <CurrencyLogo currency={new Token(SupportedChainId.POLYGON, pool.token1.id, 18, pool.token1.symbol) as WrappedCurrency} size={"30px"} />
                </div>
                <div>
                    <h3 className={"fs-075 b"}>POOL</h3>
                    <div style={{ marginTop: "2px" }}>{`${pool.token0.symbol}/${pool.token1.symbol}`}</div>
                </div>
                {apr && apr > 0 ? (
                    <div className={"staker-event-card__reward-apr p-05 br-8 ml-a fs-085"}>
                        <span>{Math.round(apr)}%</span>
                        <span style={{ marginLeft: "5px" }}>APR</span>
                    </div>
                ) : null}
            </div>
            <div className={"staker-event-card__reward-wrapper mb-05 f c br-8"}>
                <div className="staker-event-card__reward-wrapper-header fs-075 b">REWARDS</div>
                <ul className="staker-event-card__reward-list">
                    {rewardList?.map((reward: any, i) => (
                        <li key={i} className="staker-event-card__reward-list-item f">
                            <CurrencyLogo currency={new Token(SupportedChainId.POLYGON, reward.token.id, 18, reward.token.symbol) as WrappedCurrency} size={"30px"} />
                            <span className="staker-event-card__reward-list-item__symbol ml-05">{reward.token.symbol}</span>
                            <div className={"m-a mr-0 fs-085"} title={reward.amount.toString()}>
                                {eternal ? <span /> : <span>{formatAmountTokens(reward.amount, false)}</span>}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {!eternal && (
                <div className="w-100 staker-event-card__timeline">
                    <div className="w-100 f staker-event-card__timeline-dates">
                        <div className="w-100 b fs-075 ta-l">Enter</div>
                        <div className="w-100 b fs-075 ta-c">Start</div>
                        <div className="w-100 b fs-075 ta-r">End</div>
                    </div>
                    <div className="w-100 f mt-05">
                        <div className="f f-ac f-jc staker-event-card__timeline-circle">
                            <div className={`staker-event-card__timeline-circle__inner ${!active ? "active" : ""}`}></div>
                        </div>
                        <div className="staker-event-card__timeline-line">
                            <div className="staker-event-card__timeline-line__inner" style={{ width: active ? "100%" : `${getProgress(Number(createdAtTimestamp), startTime, now)}%` }}></div>
                        </div>
                        <div className="f f-ac f-jc staker-event-card__timeline-circle">{active && <div className="staker-event-card__timeline-circle__inner active"></div>}</div>
                        <div className="staker-event-card__timeline-line">
                            {active && <div className="w-100 staker-event-card__timeline-line__inner" style={{ width: `${getProgress(startTime, endTime, now)}%` }}></div>}
                        </div>
                        <div className="staker-event-card__timeline-circle"></div>
                    </div>
                    <div className="w-100 f fs-085" style={{ marginTop: "10px" }}>
                        <div className="w-100 f f-ac">
                            <div className="staker-event-card__timeline-calendar first ta-c">
                                <div className="staker-event-card__timeline-calendar-day">{_enterTime[0]}</div>
                                <div className="staker-event-card__timeline-calendar-hour">{_enterTime[1]}</div>
                            </div>
                        </div>
                        <div className="w-100 f f-ac f-jc">
                            <div className="staker-event-card__timeline-calendar second ta-c">
                                <div className="staker-event-card__timeline-calendar-day">{_startTime[0]}</div>
                                <div className="staker-event-card__timeline-calendar-hour">{_startTime[1]}</div>
                            </div>
                        </div>
                        <div className="w-100 f f-jc" style={{ justifyContent: "flex-end" }}>
                            <div className="staker-event-card__timeline-calendar third ta-c">
                                <div className="staker-event-card__timeline-calendar-day">{_endTime[0]}</div>
                                <div className="staker-event-card__timeline-calendar-hour">{_endTime[1]}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {account && !active ? (
                <button
                    style={{ marginTop: "9px", border: "none", lineHeight: "19px", height: "36px" }}
                    disabled={locked}
                    className={`btn primary w-100 b br-8 fs-085 pv-05 ${!eternal ? "mt-05" : ""}`}
                    onClick={stakeHandler}
                >
                    <span>{locked ? "Filled" : "Farm"}</span>
                </button>
            ) : active ? (
                <div className={"mt-1 fs-085 p-05 br-8 ta-c mt-1 bg-pw"} style={{ marginTop: "9px", border: "none", lineHeight: "19px", height: "36px" }}>
                    Started!
                </div>
            ) : (
                <button className={`btn primary w-100 b pv-05 ${!eternal ? "mt-05" : ""}`} onClick={toggleWalletModal}>
                    {" "}
                    Connect Wallet
                </button>
            )}
        </div>
    );
}
