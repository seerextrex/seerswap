import { Trans } from "@lingui/macro";
import { DollarSign, StopCircle } from "react-feather";

import { Currency, Token, Price } from "@uniswap/sdk-core";

import "./index.scss";
import Loader from "components/Loader";
import { PriceFormats } from "../PriceFomatToggler";
import { useEffect, useMemo, useState } from "react";

interface ISelectRangeUSDC {
    currencyA: Currency;
    currencyB: Currency;
    currencyAUSDC: Price<Currency, Token> | undefined;
    currencyBUSDC: Price<Currency, Token> | undefined;
    priceFormat: PriceFormats
}

export function USDPrices({ currencyA, currencyB, currencyAUSDC, currencyBUSDC, priceFormat }: ISelectRangeUSDC) {

    const isUSD = useMemo(() => {
        return priceFormat === PriceFormats.USD
    }, [priceFormat])

    const [loadingTimedout, setLoadingTimedout] = useState(false)

    useEffect(() => {
        
        setTimeout(() => {
            if (!currencyAUSDC || !currencyBUSDC) {
                setLoadingTimedout(true)
            }
        }, 5000)

    }, [currencyAUSDC, currencyBUSDC])

    return (
        <div className={"preset-ranges-wrapper pl-1 mb-2"}>
            <div className="mb-1 f f-ac">
                { isUSD ? <StopCircle style={{ display: "block" }} size={15}/> : <DollarSign style={{ display: "block" }} size={15} />
                }
                <span className="ml-05">
                    {
                        isUSD ? <Trans>Token Prices</Trans> :  <Trans>USD Prices</Trans>
                    }
                </span>
            </div>
            {currencyAUSDC && currencyBUSDC ? 
                isUSD ?
                (
                    <div className="fs-085">
                        <div className="mb-05">{`1 ${currencyA.symbol} = ${(+currencyAUSDC?.toSignificant(5) / +currencyBUSDC?.toSignificant(5)).toFixed(4)} ${currencyB.symbol}`}</div>
                        <div className="mb-05">{`1 ${currencyB.symbol} = ${(+currencyBUSDC?.toSignificant(5) / +currencyAUSDC?.toSignificant(5)).toFixed(4)} ${currencyA.symbol}`}</div>
                    </div>
                ):
            (
                <div className="fs-085">
                    <div className="mb-05">{`1 ${currencyA.symbol} = $${currencyAUSDC?.toSignificant(5)}`}</div>
                    <div className="mb-05">{`1 ${currencyB.symbol} = $${currencyBUSDC?.toSignificant(5)}`}</div>
                </div>
            ) : !loadingTimedout ? (
                <Loader stroke="white" />
            ) : <div>Can't fetch prices</div> }
        </div>
    );
}
