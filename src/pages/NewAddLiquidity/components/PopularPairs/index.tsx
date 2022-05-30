import { Trans } from "@lingui/macro";
import CurrencyLogo from "components/CurrencyLogo";
import Loader from "components/Loader";
import { useToken } from "hooks/Tokens";
import { WrappedCurrency } from "models/types";
import { Star, Zap } from "react-feather";

import "./index.scss";

interface IPopularPairs {
    pairs: [string, string][] | undefined;
    farmings: [string, string][];
    handlePopularPairSelection: (pair: [string, string]) => void;
}

export function PopularPairs({ pairs, farmings, handlePopularPairSelection }: IPopularPairs) {
    return (
        <div>
            <div className={"pair-list-wrapper pl-1"}>
                <div className="mb-1 f f-ac">
                    <Star style={{ display: "block" }} fill={"white"} size={15} />
                    <span className="ml-05">
                        <Trans>Popular pairs</Trans>
                    </span>
                </div>
                {pairs ? (
                    <div className="mb-1">
                        <ul className="pair-list">
                            {pairs.map((pair, key) => (
                                <li key={key} className="pair-list-item">
                                    <PopularPair handlePopularPairSelection={handlePopularPairSelection} pair={pair} farming={false} />
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <Loader stroke="white" />
                )}
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
    const tokenA = useToken(pair[1]);
    const tokenB = useToken(pair[0]);

    if (!tokenA || !tokenB) return <div></div>;

    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];

    return (
        <div onClick={() => handlePopularPairSelection([token0.address, token1.address])} className={`f f-ac f-jc popular-pair ${farming ? "farming" : ""}`}>
            <span className="popular-pair__logo">
                <CurrencyLogo currency={token0 as WrappedCurrency} size={"16px"} />
            </span>
            <span>{token0.symbol}</span>
            <span className="popular-pair__plus">+</span>
            <span className="popular-pair__logo">
                <CurrencyLogo currency={token1 as WrappedCurrency} size={"16px"} />
            </span>
            <span>{token1.symbol}</span>
        </div>
    );
}
