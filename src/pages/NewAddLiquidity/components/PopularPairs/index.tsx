import { Trans } from "@lingui/macro";
import { useToken } from "hooks/Tokens";
import { useMemo } from "react";
import "./index.scss";

interface IPopularPairs {
    pairs: [string, string][];
    farmings: [string, string][];
}

export function PopularPairs({ pairs, farmings }: IPopularPairs) {
    if (pairs.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ borderLeft: "1px solid #36f" }} className={"pl-1"}>
            <div className="mb-1">
                <Trans>Popular pairs</Trans>
            </div>
            <div className="mb-1">
                <ul>
                    {pairs.map((pair, key) => (
                        <li key={key}>
                            <PopularPair pair={pair} farming={false} />
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <ul>
                    {farmings.map((farming, key) => (
                        <li key={key}>
                            <PopularPair pair={farming} farming={true} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function PopularPair({ pair, farming }: { pair: [string, string]; farming: boolean }) {
    const token0 = useToken(pair[0]);
    const token1 = useToken(pair[1]);

    if (!token0 || !token1) return <div></div>;

    return <div className={`popular-pair ${farming ? "farming" : ""}`}>{`${farming ? "Farming: " : ""} ${token0.symbol} / ${token1.symbol}`}</div>;
}
