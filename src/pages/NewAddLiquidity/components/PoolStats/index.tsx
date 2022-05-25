import { ReactElement } from "react";
import "./index.scss";

interface IPoolStats {
    fee: string | ReactElement;
    apr: string | ReactElement | undefined;
}

export function PoolStats({ fee, apr }: IPoolStats) {
    return (
        <div className="pool-stats-wrapper f f-jb w-100">
            <div className="pool-stats__title f w-100">Pool stats</div>
            <div className="f">
                <div className={`pool-stats__fee ${!apr ? "single" : ""}`}>
                    <span>{fee}</span>
                </div>
                {apr && (
                    <div className="pool-stats__apr">
                        <span>{apr}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
