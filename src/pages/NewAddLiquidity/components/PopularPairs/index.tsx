import { Trans } from "@lingui/macro";
import CurrencyLogo from "components/CurrencyLogo";
import Loader from "components/Loader";
import { useToken } from "hooks/Tokens";
import { WrappedCurrency } from "models/types";
import { Star, Zap } from "react-feather";

import "./index.scss";

interface IPopularPairs {
    pairs: [string, string][] | undefined;
    handlePopularPairSelection: (pair: [string, string]) => void;
}

export function PopularPairs({ pairs, handlePopularPairSelection }: IPopularPairs) {
    return (
        <div>
            <div className={"pair-list-wrapper pl-1 mm_pl-0"}>
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
                                    <PopularPair handlePopularPairSelection={handlePopularPairSelection} pair={pair} />
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="mb-1">
                        <Loader stroke="white" />
                    </div>
                )}
            </div>
        </div>
    );
}

function PopularPair({ pair, handlePopularPairSelection }: { pair: [string, string]; handlePopularPairSelection: (pair: [string, string]) => void }) {
    const tokenA = useToken(pair[1]);
    const tokenB = useToken(pair[0]);

    if (!tokenA || !tokenB) return <div></div>;

    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];

    const WXDAI = "0xe91d153e0b41518a2ce8dd3d7944fa863463a97d";

    return (
        <div onClick={() => handlePopularPairSelection([token0.address.toLowerCase(), token1.address.toLowerCase()])} className={`f f-ac f-jc popular-pair`}>
            <span className="popular-pair__logo">
                <CurrencyLogo currency={token0 as WrappedCurrency} size={"16px"} />
            </span>
            <span>{token0.address.toLowerCase() === WXDAI ? "WXDAI" : token0.symbol}</span>
            <span className="popular-pair__plus">+</span>
            <span className="popular-pair__logo">
                <CurrencyLogo currency={token1 as WrappedCurrency} size={"16px"} />
            </span>
            <span>{token1.address.toLowerCase() === WXDAI ? "WXDAI" : token1.symbol}</span>
        </div>
    );
}
