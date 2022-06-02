import PositionListItem from "components/PositionListItem";
import React, { useMemo } from "react";
import { Trans } from "@lingui/macro";
import { PositionPool } from "../../models/interfaces";
import { AlertCircle } from "react-feather";
import { OldFarmingWarning } from "./styled";
import { useLocation } from "react-router-dom";
import { useShowNewestPosition } from "state/mint/v3/hooks";

type PositionListProps = React.PropsWithChildren<{
    positions: PositionPool[];
    newestPosition: number | undefined;
}>;

export default function PositionList({ positions, newestPosition }: PositionListProps) {
    const showNewestPosition = useShowNewestPosition();

    const _positions = useMemo(() => {
        if (!positions) {
            return [];
        }

        return positions.filter((position) => !position.onFarming && !position.oldFarming);
    }, [positions]);

    const _positionsOnFarming = useMemo(() => {
        if (!positions) {
            return [];
        }

        return positions.filter((position) => position.onFarming);
    }, [positions]);

    const _positionsOnOldFarming = useMemo(() => {
        if (!positions) {
            return [];
        }

        return positions.filter((position) => position.oldFarming);
    }, [positions]);

    return (
        <>
            {_positionsOnOldFarming.length ? (
                <OldFarmingWarning className="f full-w p-1 mb-1">
                    <AlertCircle size={"24px"} />
                    <span>{`Due to release of Tier Farming, we have updated our contracts.`}</span>
                    <a href="https://old.algebra.finance/#/farming/farms" target={"_blank"} rel={"noreferrer noopener"}>
                        Withdraw previous positions →
                    </a>
                </OldFarmingWarning>
            ) : null}
            <div className={"flex-s-between w-100 pr-2"}>
                <div>
                    <Trans>Your positions</Trans>
                    {positions && " (" + positions.length + ")"}
                </div>
                <span className={"hide-xs"}>
                    <Trans>Status</Trans>
                </span>
            </div>
            {_positionsOnOldFarming.map((p) => {
                return <PositionListItem key={p.tokenId.toString()} positionDetails={p} />;
            })}
            {_positionsOnFarming.map((p) => {
                return <PositionListItem key={p.tokenId.toString()} positionDetails={p} />;
            })}
            {_positions.map((p) => {
                return <PositionListItem newestPosition={newestPosition} highlightNewest={showNewestPosition} key={p.tokenId.toString()} positionDetails={p} />;
            })}
        </>
    );
}
