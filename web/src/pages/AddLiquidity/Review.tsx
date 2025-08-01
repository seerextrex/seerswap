import { Bound } from "../../state/mint/v3/actions";
import { AutoColumn } from "components/Column";
import { Position } from "lib/src";
import { PositionPreview } from "components/PositionPreview";
import { t } from "@lingui/macro";

interface ReviewProps {
    position?: Position;
    outOfRange: boolean;
    ticksAtLimit: { [bound in Bound]?: boolean | undefined };
}

export function Review({ position, outOfRange, ticksAtLimit }: ReviewProps) {
    return (
        <div className={"pt-05"}>
            <AutoColumn gap="lg">{position ? <PositionPreview position={position} inRange={!outOfRange} ticksAtLimit={ticksAtLimit} title={t`Selected Range`} /> : null}</AutoColumn>
        </div>
    );
}
