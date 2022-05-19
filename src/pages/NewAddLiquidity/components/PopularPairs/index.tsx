import { Trans } from "@lingui/macro";
import { useToken } from "hooks/Tokens";
import { Star, Zap } from "react-feather";

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
        <div>
            <div className={"pair-list-wrapper pl-1"}>
                <div className="mb-1 f f-ac">
                    <Star style={{ display: "block" }} fill={"white"} size={15} />
                    <span className="ml-05">
                        <Trans>Popular pairs</Trans>
                    </span>
                </div>
                <div className="mb-1">
                    <ul className="pair-list">
                        {pairs.map((pair, key) => (
                            <li key={key} className="pair-list-item">
                                <PopularPair pair={pair} farming={false} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={"pair-list-wrapper pl-1"}>
                <div className="mb-1 f f-ac">
                    <Zap style={{ display: "block" }} fill={"white"} size={15} />
                    <span className="ml-05">
                        <Trans>Farms</Trans>
                    </span>
                </div>
                <div>
                    <ul className="pair-list">
                        {farmings.map((farming, key) => (
                            <li key={key} className="pair-list-item">
                                <PopularPair pair={farming} farming={true} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function PopularPair({ pair, farming }: { pair: [string, string]; farming: boolean }) {
    const token0 = useToken(pair[0]);
    const token1 = useToken(pair[1]);

    if (!token0 || !token1) return <div></div>;

    return <div className={`popular-pair ${farming ? "farming" : ""}`}>{`${token0.symbol} / ${token1.symbol}`}</div>;
}
