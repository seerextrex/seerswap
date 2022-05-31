import { Trans } from "@lingui/macro";
import { DollarSign, StopCircle } from "react-feather";

import { Currency, Token, Price } from "@uniswap/sdk-core";

import "./index.scss";
import Loader from "components/Loader";
import { PriceFormats } from "../PriceFomatToggler";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInitialTokenPrice, useInitialUSDPrices } from "state/mint/v3/hooks";

interface ISelectRangeUSDC {
    currencyA: Currency;
    currencyB: Currency;
    currencyAUSDC: Price<Currency, Token> | undefined;
    currencyBUSDC: Price<Currency, Token> | undefined;
    priceFormat: PriceFormats;
}

export function USDPrices({ currencyA, currencyB, currencyAUSDC, currencyBUSDC, priceFormat }: ISelectRangeUSDC) {
    const isUSD = useMemo(() => {
        return priceFormat === PriceFormats.USD;
    }, [priceFormat]);

    const userUSDPrices = useInitialUSDPrices();
    const userTokenPrice = useInitialTokenPrice();

    const [loadingTimedout, setLoadingTimedout] = useState(false);

    const hasUSDPrices = useMemo(() => {
        return Boolean(
            (userUSDPrices.CURRENCY_A && userUSDPrices.CURRENCY_B) || (currencyAUSDC && currencyBUSDC) || (userUSDPrices.CURRENCY_A && currencyBUSDC) || (userUSDPrices.CURRENCY_B && currencyAUSDC)
        );
    }, [userUSDPrices, currencyAUSDC, currencyBUSDC]);

    const usdA = useMemo(() => {
        console.log(userUSDPrices);
        if (userUSDPrices.CURRENCY_A) return userUSDPrices.CURRENCY_A;
        if (currencyAUSDC) return currencyAUSDC.toSignificant(8);
        return;
    }, [userUSDPrices, currencyAUSDC]);

    const usdB = useMemo(() => {
        if (userUSDPrices.CURRENCY_B) return userUSDPrices.CURRENCY_B;
        if (currencyBUSDC) return currencyBUSDC.toSignificant(8);
        return;
    }, [userUSDPrices, currencyBUSDC]);

    useEffect(() => {
        setTimeout(() => {
            if (!hasUSDPrices) {
                setLoadingTimedout(true);
            }
        }, 5000);
    }, [currencyAUSDC, currencyBUSDC, userUSDPrices]);

    return (
        <div className={"preset-ranges-wrapper pl-1 mb-2 mxs_pl-0 mxs_mb-1"}>
            <div className="mb-1 f f-ac">
                {isUSD ? <StopCircle style={{ display: "block" }} size={15} /> : <DollarSign style={{ display: "block" }} size={15} />}
                <span className="ml-05">{isUSD ? <Trans>Token Prices</Trans> : <Trans>USD Prices</Trans>}</span>
            </div>

            {hasUSDPrices ? (
                !isUSD ? (
                    <div className="fs-085">
                        {usdA && <div className="mb-05">{`1 ${currencyA.symbol} = $${usdA}`}</div>}
                        {usdB && <div className="mb-05">{`1 ${currencyB.symbol} = $${usdB}`}</div>}
                    </div>
                ) : (
                    usdA &&
                    usdB &&
                    hasUSDPrices && (
                        <div className="fs-085">
                            <div className="mb-05">{`1 ${currencyA.symbol} = ${+usdA / (+usdB || 1)} ${currencyB.symbol}`}</div>
                            <div className="mb-05">{`1 ${currencyB.symbol} = ${+usdB / (+usdA || 1)} ${currencyA.symbol}`}</div>
                        </div>
                    )
                )
            ) : !loadingTimedout ? (
                <Loader stroke="white" />
            ) : (
                <div>Can't fetch prices</div>
            )}
        </div>
    );
}
