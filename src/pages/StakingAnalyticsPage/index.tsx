import StakingAnalyticsChart from "../../components/StakingAnalyticsChart";
import React, { useEffect } from "react";
import { useInfoSubgraph } from "../../hooks/subgraph/useInfoSubgraph";
import Loader from "../../components/Loader";
import { ArrowLeft } from "react-feather";
import { chartTypes } from "../../models/enums";
import { NavLink } from "react-router-dom";
import "./index.scss";

import { t, Trans } from "@lingui/macro";

const chartsInfo = [
    {
        title: t`APR`,
        type: chartTypes.APR,
        hint: t`Yearly percentage of profits at the current rate of rewards`,
    },
    {
        title: t`ALGB Balance`,
        type: chartTypes.ALGB_BALANCE,
        hint: t`Total amount of staked ALGB`,
    },
    {
        title: t`Staked ALGB`,
        type: chartTypes.CURRENCY_STAKED_AMOUNT,
        hint: t`Amount of newly-staked ALGB per day`,
    },
    {
        title: t`xALGB Total Supply`,
        type: chartTypes.XALGB_TOTAL_SUPPLY,
        hint: t`Total amount of minted xALGB`,
    },
    {
        title: t`ALGB from the Vault`,
        type: chartTypes.ALGB_FROM_VAULT,
        hint: t`Amount of ALGB fees sent as rewards`,
    },
    {
        title: [t`xALGB Minted`, t`xALGB Burned`],
        type: chartTypes.XALGB_MINTED,
        hint: [t`Amount of newly-minted xALGB per day`, t`Amount of newly-burned xALGB per day`],
    },
];
const chart1Color = "var(--primary)";
const chart2Color = "var(--red)";

export default function StakingAnalyticsPage() {
    const {
        fetchStakedHistory: { fetchStakingHistoryFn, historiesLoading, stakeHistoriesResult },
    } = useInfoSubgraph();

    useEffect(() => {
        fetchStakingHistoryFn();
    }, []);

    return (
        <div className={"w-100 maw-1180 mb-3"}>
            <NavLink className={"c-p f hover-op trans-op w-fc"} to={"/staking"}>
                <ArrowLeft size={"16px"} />
                <p className={"ml-05"}>
                    <Trans>Staking</Trans>
                </p>
            </NavLink>
            {chartsInfo.map((item, i) => (
                <div className={"stacking-chart-card br-24 pv-1 ph-2 mv-1 mxs_ph-1"} key={i}>
                    {item.type === "xALGBminted" ? (
                        <div className={"stacking-chart-card__color-text"}>
                            <div>
                                <div className={"f f-ac"}>
                                    <div className={"stacking-chart-card__color-rect"} data-stroke={"first"} />
                                    <h2 className={"ml-05 fs-15"}>{item.title[0]}</h2>
                                </div>
                                <p className={"mt-025"}>{item.hint[0]}</p>
                            </div>
                            <div className={"ml-2"}>
                                <div className={"f f-ac"}>
                                    <div className={"stacking-chart-card__color-rect"} data-stroke={"second"} />
                                    <h2 className={"ml-05 fs-15"}>{item.title[1]}</h2>
                                </div>
                                <p className={"mt-025"}>{item.hint[1]}</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className={"fs-15"}>{item.title}</h2>
                            <p className={"mt-025"}>{item.hint}</p>
                        </>
                    )}
                    {historiesLoading ? (
                        <div className={"stacking-chart-card__loader br-12 mt-1"}>
                            <Loader size={"35px"} stroke={"white"} />
                        </div>
                    ) : (
                        <StakingAnalyticsChart stakeHistoriesResult={stakeHistoriesResult} type={item.type} colors={[chart1Color, chart2Color]} />
                    )}
                </div>
            ))}
        </div>
    );
}
