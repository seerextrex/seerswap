import PositionListItem from "components/PositionListItem";
import React, { useMemo, memo } from "react";
import { Trans } from "@lingui/macro";
import { PositionPool } from "../../models/interfaces";
import { useShowNewestPosition } from "state/mint/v3/hooks";

type PositionListProps = React.PropsWithChildren<{
    positions: PositionPool[];
    newestPosition: number | undefined;
}>;

function PositionListInner({ positions, newestPosition }: PositionListProps) {
    const showNewestPosition = useShowNewestPosition();

    // This memoization prevents unnecessary recalculations when parent components render
    const _positions = useMemo(() => {
        if (!positions) {
            return [];
        }

        return positions;
    }, [positions]);

    // Creating stable identity for position IDs to prevent unnecessary re-renders
    const positionItems = useMemo(() => {
        return _positions.map((p) => {
            return (
                <PositionListItem
                    newestPosition={newestPosition}
                    highlightNewest={showNewestPosition}
                    key={p.tokenId.toString()}
                    positionDetails={p}
                />
            );
        });
    }, [_positions, newestPosition, showNewestPosition]);

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
            {positionItems}
        </>
    );
}

// Use React.memo to prevent unnecessary re-renders of the entire list
const PositionList = memo(PositionListInner);
export default PositionList;
