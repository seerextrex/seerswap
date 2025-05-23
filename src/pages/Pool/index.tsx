import { t, Trans } from "@lingui/macro";
import PositionList from "components/PositionList";
import { SwitchLocaleLink } from "components/SwitchLocaleLink";
import { useV3Positions } from "hooks/useV3Positions";
import { useAccount } from "wagmi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { useUserHideClosedPositions, useUserHideFarmingPositions } from "state/user/hooks";
import { Helmet } from "react-helmet";
import Loader from "../../components/Loader";
import FilterPanelItem from "./FilterPanelItem";
import { PositionPool } from "../../models/interfaces";
import Card from "../../shared/components/Card/Card";
import AutoColumn from "../../shared/components/AutoColumn";
import { SwapPoolTabs } from "../../components/NavigationTabs";
import "./index.scss";

export default function Pool() {
    const { address: account } = useAccount();

    const [userHideClosedPositions, setUserHideClosedPositions] = useUserHideClosedPositions();
    const [userHideFarmingPositions, setUserHideFarmingPositions] = useUserHideFarmingPositions();

    const { positions = [], loading: positionsLoading } = useV3Positions(account);

    const filteredPositions = useMemo(() => {
        return positions.filter((position) => {
            if (userHideClosedPositions && position.liquidity === 0n) {
                return false;
            }
            if (userHideFarmingPositions && position.onFarming) {
                return false;
            }
            return true;
        });
    }, [positions, userHideClosedPositions, userHideFarmingPositions]);

    return (
        <>
            <Helmet>
                <title>{t`Pool`}</title>
            </Helmet>
            <SwapPoolTabs active={"pool"} />
            <AutoColumn gap="2" justify="center">
                <div className="w-100">
                    <div className={"card-wrapper"}>
                        {!account ? (
                            <Card classes={"br-24 card-bg p-2"}>
                                <div className={"c-w fs-125"}>
                                    <Trans>Connect to a wallet to view your liquidity.</Trans>
                                </div>
                            </Card>
                        ) : positionsLoading ? (
                            <Card classes={"br-24 mh-400 f c f-ac f-jc"}>
                                <Loader stroke={"white"} size={"1.5rem"} />
                            </Card>
                        ) : (
                            <>
                                <Card classes={"br-24 card-bg"}>
                                    <Card classes={"p-1"}>
                                        <div className={"f f-ac mb-1"}>
                                            <div className={"f f-ac fs-125 b"}>
                                                <Trans>Your positions</Trans> {filteredPositions && ` (${filteredPositions.length})`}
                                            </div>
                                            <NavLink
                                                to={"/positions"}
                                                className={"btn primary pv-025 ph-05 br-8 ml-a"}>
                                                <Trans>View Analytics</Trans>
                                            </NavLink>
                                        </div>
                                        <div className={"flex-s-between mb-1"}>
                                            <FilterPanelItem
                                                method={setUserHideClosedPositions}
                                                checkValue={!userHideClosedPositions}
                                            />
                                        </div>
                                        <div className={"mb-1"}>
                                            <FilterPanelItem
                                                method={setUserHideFarmingPositions}
                                                checkValue={!userHideFarmingPositions}
                                            />
                                        </div>
                                    </Card>
                                    <div className={"mh-400"}>
                                        <PositionList positions={filteredPositions} />
                                    </div>
                                </Card>
                            </>
                        )}
                    </div>
                </div>
                <NavLink
                    to="/add"
                    className={"btn primary pv-05 ph-1 br-8 mh-a"}>
                    + <Trans>New Position</Trans>
                </NavLink>
            </AutoColumn>
            <SwitchLocaleLink />
        </>
    );
}
