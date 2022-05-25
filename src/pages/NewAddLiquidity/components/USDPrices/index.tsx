import { Trans } from "@lingui/macro";
import { DollarSign } from "react-feather";

import { Currency, Token, Price } from "@uniswap/sdk-core";

import "./index.scss";
import Loader from "components/Loader";

interface ISelectRangeUSDC {
    currencyA: Currency;
    currencyB: Currency;
    currencyAUSDC: Price<Currency, Token> | undefined;
    currencyBUSDC: Price<Currency, Token> | undefined;
}

export function USDPrices({ currencyA, currencyB, currencyAUSDC, currencyBUSDC }: ISelectRangeUSDC) {
    console.log(" USDC ASDASDA", currencyAUSDC, currencyBUSDC);

    return (
        <div className={"preset-ranges-wrapper pl-1 mb-2"}>
            <div className="mb-1 f f-ac">
                <DollarSign style={{ display: "block" }} size={15} />
                <span className="ml-05">
                    <Trans>USD Prices</Trans>
                </span>
            </div>
            {currencyAUSDC && currencyBUSDC ? (
                <div className="fs-085">
                    <div className="mb-05">{`1 ${currencyA.symbol} = $${currencyAUSDC?.toFixed(3)}`}</div>
                    <div className="mb-05">{`1 ${currencyB.symbol} = $${currencyBUSDC?.toFixed(3)}`}</div>
                </div>
            ) : (
                <Loader stroke="white" />
            )}
        </div>
    );
}
