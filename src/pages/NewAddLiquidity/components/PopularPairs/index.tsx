import { Trans } from "@lingui/macro";
import { useToken } from "hooks/Tokens";
import { Star, Zap } from "react-feather";

import "./index.scss";

interface IPopularPairs {
    pairs: [string, string][] | undefined;
    farmings: [string, string][];
    handlePopularPairSelection: (pair: [string, string]) => void;
}

export function PopularPairs({ pairs, farmings, handlePopularPairSelection }: IPopularPairs) {
    if (!pairs) {
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
                                <PopularPair handlePopularPairSelection={handlePopularPairSelection} pair={pair} farming={false} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {farmings.length ? (
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
                                    <PopularPair handlePopularPairSelection={handlePopularPairSelection} pair={farming} farming={true} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function PopularPair({ pair, farming, handlePopularPairSelection }: { pair: [string, string]; farming: boolean; handlePopularPairSelection: (pair: [string, string]) => void }) {
    const token0 = useToken(pair[1]);
    const token1 = useToken(pair[0]);

    if (!token0 || !token1) return <div></div>;

    return <div onClick={() => handlePopularPairSelection(pair)} className={`popular-pair ${farming ? "farming" : ""}`}>{`${token0.symbol} / ${token1.symbol}`}</div>;
}
