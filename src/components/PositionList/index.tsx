import PositionListItem from "components/PositionListItem";
import React, { useMemo, memo } from "react";
import { Trans } from "@lingui/macro";
import { PositionPool } from "../../models/interfaces";
import { useShowNewestPosition } from "state/mint/v3/hooks";
import { PositionTokens } from "../../hooks/usePositionTokens";

type PositionListProps = React.PropsWithChildren<{
    positions: PositionPool[];
    newestPosition?: number | undefined;
    positionTokens?: Record<string, PositionTokens>;
}>;

function PositionListInner({ positions, newestPosition, positionTokens }: PositionListProps) {
    const showNewestPosition = useShowNewestPosition();

    return !!positions.length ? (
        <>
            <div className={"w-100"}>
                {positions.map((position) => {
                    const tokens = positionTokens?.[position.tokenId.toString()];
                    return (
                        <PositionListItem
                            key={position.tokenId.toString()}
                            positionDetails={position}
                            newestPosition={newestPosition}
                            highlightNewest={showNewestPosition}
                            tokens={tokens}
                        />
                    );
                })}
            </div>
        </>
    ) : (
        <div className={"w-100 f c f-ac mh-100 p-1"}>
            <Trans>No open positions</Trans>
        </div>
    );
}

const PositionList = memo(PositionListInner);
export default PositionList;
