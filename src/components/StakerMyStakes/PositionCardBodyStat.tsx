import React, { useMemo } from "react";
import CurrencyLogo from "../CurrencyLogo";
import { Token } from "@uniswap/sdk-core";
import { WrappedCurrency } from "../../models/types";
import { formatReward } from "../../utils/formatReward";

import './position-card-body-stat.scss'

interface PositionCardBodyStatProps {
    rewardToken: any;
    bonusRewardToken: any;
    earned: any;
    bonusEarned: any;
}

export default function PositionCardBodyStat({ rewardToken, earned, bonusRewardToken, bonusEarned }: PositionCardBodyStatProps) {
    
    const rewardList = useMemo(() => {

        if (rewardToken.id === bonusRewardToken.id) return [
            { token: rewardToken, amount: +earned + +bonusEarned }
        ]

        return [
            { token: rewardToken, amount: earned },
            { token: bonusRewardToken, amount: bonusEarned }
        ]

    }, [])
    
    return (
        <div className={"f c mxs_fd-c p-1 br-8 mb-1"} style={{backgroundColor: 'var(--ebony-clay)'}}>
            <h3 className={"fs-075 mb-1"}>Earned rewards</h3>
            <div className="f">
            {
                rewardList.map( (reward: any, i) => 
                    <div key={i} className={"f f-ac mr-1 mxs_mb-1 position-card-body-stat"}>
                        <CurrencyLogo size={"30px"} currency={new Token(137, reward.token.id, 18, reward.token.symbol) as WrappedCurrency} />
                        <div className="ml-05" title={reward.amount.toString()}>{`${formatReward(reward.amount)} ${reward.token.symbol}`}</div>
                    </div>
            )}
                </div>
        </div>
    );
}
