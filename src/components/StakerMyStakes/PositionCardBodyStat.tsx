import React from "react";
import CurrencyLogo from "../CurrencyLogo";
import { Token } from "@uniswap/sdk-core";
import { WrappedCurrency } from "../../models/types";
import { formatReward } from "../../utils/formatReward";

interface PositionCardBodyStatProps {
    rewardToken: any;
    bonusRewardToken: any;
    earned: any;
    bonusEarned: any;
}

export default function PositionCardBodyStat({ rewardToken, earned, bonusRewardToken, bonusEarned }: PositionCardBodyStatProps) {
    return (
        <div className={"f mxs_fd-c mb-1"}>
            <div className={"f mr-1 w-100 mxs_mb-1"}>
                <CurrencyLogo size={"35px"} currency={new Token(940, rewardToken?.id, 18, rewardToken?.symbol) as WrappedCurrency} />
                <div className={"ml-05"}>
                    <h3 className={"fs-075 mb-025"}>Reward</h3>
                    <div title={earned.toString()}>{`${formatReward(+earned)} ${rewardToken.symbol}`}</div>
                </div>
            </div>
            <div className={"f mr-1 w-100"}>
                <CurrencyLogo size={"35px"} currency={new Token(940, bonusRewardToken?.id, 18, bonusRewardToken?.symbol) as WrappedCurrency} />
                <div className={"ml-05"}>
                    <h3 className={"fs-075 mb-025"}>Bonus reward</h3>
                    <div title={bonusEarned.toString()}>{`${formatReward(+bonusEarned)} ${bonusRewardToken.symbol}`}</div>
                </div>
            </div>
        </div>
    );
}
