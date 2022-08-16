import PositionListItem from "components/PositionListItem";
import React, { useMemo } from "react";
import { Trans } from "@lingui/macro";
import { PositionPool } from "../../models/interfaces";
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

        return positions;
    }, [positions]);

    return (
        <>
            <div className={"flex-s-between w-100 pr-2"}>
                <div>
                    <Trans>Your positions</Trans>
                    {positions && " (" + positions.length + ")"}
                </div>
                <span className={"hide-xs"}>
                    <Trans>Status</Trans>
                </span>
            </div>
            {_positions.map((p) => {
                return <PositionListItem newestPosition={newestPosition} highlightNewest={showNewestPosition} key={p.tokenId.toString()} positionDetails={p} />;
            })}
        </>
    );
}
