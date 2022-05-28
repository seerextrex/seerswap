import { Currency, Token, Price } from "@uniswap/sdk-core";
import { Trans } from "@lingui/macro";

import Toggle from "components/Toggle";

import useUSDCPrice from "hooks/useUSDCPrice";
import { useCallback, useEffect, useMemo, useState } from "react";

import "./index.scss";
import { Lock } from "react-feather";

enum InputType {
    TOKEN_RATIO,
    USD,
}

interface ITokenPrice {
    baseCurrency: Currency | undefined;
    quoteCurrency: Currency | undefined;
    basePrice: Price<Currency, Token> | undefined;
    quotePrice: Price<Currency, Token> | undefined;
    isLocked: boolean;
    userQuoteCurrencyUSD: string | undefined;
    changeQuotePriceHandler: any;
    isSelected: boolean;
}

interface IUSDPrice extends ITokenPrice {
    userBaseCurrencyUSD: string | undefined;
    changeBaseCurrencyUSDHandler: any;
}

function TokenPrice({ baseCurrency, quoteCurrency, basePrice, quotePrice, isLocked, userQuoteCurrencyUSD, changeQuotePriceHandler, isSelected }: ITokenPrice) {
    const baseSymbol = useMemo(() => (baseCurrency ? baseCurrency.symbol : "-"), [baseCurrency]);
    const quoteSymbol = useMemo(() => (quoteCurrency ? quoteCurrency.symbol : "-"), [quoteCurrency]);

    const tokenRatio = useMemo(() => {
        if (!basePrice || !quotePrice) return "Loading...";

        return basePrice.divide(quotePrice).toSignificant(5);
    }, [basePrice, quotePrice]);

    useEffect(() => {
        if (basePrice && quotePrice) {
            changeQuotePriceHandler(tokenRatio)
        }
    }, [basePrice, quotePrice, tokenRatio])

    return (
        <div className={`token-price ${isSelected ? "main" : "side"} ws-no-wrap mxs_fs-075`}>
            <div className={"quote-token w-100 f"}>
                <div>
                    {isLocked ? (
                        <div className="f f-ac">
                            <span className="pl-1"><Lock size={14}/></span>
                            <span className="quote-token__auto-fetched">{tokenRatio}</span>
                        </div>
                    ) : isSelected ? (
                        <input className={`quote-token__input bg-t c-w ol-n`} placeholder={`${quoteCurrency?.symbol} price`} type="text" value={userQuoteCurrencyUSD} onInput={(e: any) => changeQuotePriceHandler(e.target.value)} />
                    ) : (
                        <span>-</span>
                    )}
                </div>
                <div className="quote-token__symbol ml-a">{quoteSymbol}</div>
            </div>
            <div className="quote-token__separator"> = </div>
            <div className="base-token">
                <div className="base-token__amount">1</div>
                <div className="base-token__symbol">{baseSymbol}</div>
            </div>
        </div>
    );
}

function USDPriceField({
    symbol,
    price,
    isSelected,
    userUSD,
    changeHandler,
}: {
    symbol: string | undefined;
    price: Price<Currency, Token> | undefined;
    isSelected: boolean;
    userUSD: string | undefined;
    changeHandler: (price: number) => void;
}) {
    const _price = useMemo(() => (price ? price.toFixed(3) : "Loading..."), [price]);

    return (
        <div className={`usd-price-field f ac ws-no-wrap ${isSelected ? "main" : "side"}`}>
            <div className="usd-price">
                <span className={"usd-price__amount"}>1 {symbol}</span>
                <span className={"usd-price__separator"}> = </span>
                <span className={"usd-price__dollar"}>$</span>
                {price ? (
                    <span className={`usd-price__price`}>{_price}</span>
                ) : isSelected ? (
                    <input className={`ol-n usd-price__input`} type="text" value={userUSD} onInput={(e: any) => changeHandler(e.target.value)} />
                ) : (
                    <span> - </span>
                )}
            </div>
        </div>
    );
}

function USDPrice({
    baseCurrency,
    quoteCurrency,
    basePrice,
    quotePrice,
    isLocked,
    userQuoteCurrencyUSD,
    userBaseCurrencyUSD,
    changeQuotePriceHandler,
    changeBaseCurrencyUSDHandler,
    isSelected,
}: IUSDPrice) {
    const baseSymbol = useMemo(() => (baseCurrency ? baseCurrency.symbol : "-"), [baseCurrency]);
    const quoteSymbol = useMemo(() => (quoteCurrency ? quoteCurrency.symbol : "-"), [quoteCurrency]);

    return (
        <div className={`f usd-price__wrapper ${isSelected ? "main" : "side"}`}>
            <USDPriceField symbol={baseSymbol} price={basePrice} isSelected={isSelected} userUSD={userBaseCurrencyUSD} changeHandler={changeBaseCurrencyUSDHandler}></USDPriceField>
            <USDPriceField symbol={quoteSymbol} price={quotePrice} isSelected={isSelected} userUSD={userQuoteCurrencyUSD} changeHandler={changeQuotePriceHandler}></USDPriceField>
        </div>
    );
}

interface IStartingPrice {
    currencyA: Currency | undefined;
    currencyB: Currency | undefined;
    startPriceHandler: (value: string) => void
}

export default function StartingPrice({ currencyA, currencyB, startPriceHandler }: IStartingPrice) {
    const [inputType, setInputType] = useState<InputType>(InputType.TOKEN_RATIO);

    const basePriceUSD = useUSDCPrice(currencyA ?? undefined);
    const quotePriceUSD = useUSDCPrice(currencyB ?? undefined);

    // const [curUSDA, curUSDB] = [useUSDCPrice(baseCurrency ?? undefined)?.toFixed(3), useUSDCPrice(quoteCurrency ?? undefined)?.toFixed(3)];

    const [userBaseCurrencyUSD, setUserBaseCurrencyUSD] = useState<string | undefined>();
    const [userQuoteCurrencyUSD, setUserQuoteCurrencyUSD] = useState<string | undefined>();

    const isLocked = useMemo(() => Boolean(basePriceUSD && quotePriceUSD), [basePriceUSD, quotePriceUSD]);

    const handleStartPriceInput = useCallback((v: string) => {
        startPriceHandler(v)
        // if (inputType === InputType.TOKEN_RATIO) {
            setUserQuoteCurrencyUSD(v)
        // } else {
            // setUserBaseCurrencyUSD(v)
        // }
    }, [startPriceHandler])


    return (
        <div className={"f starting-price-wrapper c p-1"} style={{width: '542px', backgroundColor: '#26343f'}}>
            <div className={"flex-s-between"}>
                {isLocked ? (
                    <span className={"auto-fetched"}>✨ Prices were auto-fetched</span>
                ) : (
                    <span className={"not-auto-fetched"}>{`Can't auto-fetch. Please enter price for ${currencyB?.symbol} per 1 ${currencyA?.symbol}`}</span>
                    // <Toggle isActive={!!inputType} toggle={() => setInputType(+!inputType)} checked={<Trans>{"USD price"}</Trans>} unchecked={<Trans>{"Token ratio"}</Trans>} />
                )}
            </div>
            <div className={"br-8 mt-1 f c fs-085"}>
                <div className={`f ${inputType === InputType.TOKEN_RATIO ? "reverse" : "c"}`}>
                    {
                        inputType === InputType.TOKEN_RATIO ?  <TokenPrice
                        baseCurrency={currencyA}
                        quoteCurrency={currencyB}
                        basePrice={basePriceUSD}
                        quotePrice={quotePriceUSD}
                        isLocked={isLocked}
                        userQuoteCurrencyUSD={userQuoteCurrencyUSD}
                        changeQuotePriceHandler={handleStartPriceInput}
                        isSelected={inputType === InputType.TOKEN_RATIO}
                    ></TokenPrice> :  null
                //     <USDPrice
                //     baseCurrency={currencyA}
                //     quoteCurrency={currencyB}
                //     basePrice={basePriceUSD}
                //     quotePrice={quotePriceUSD}
                //     isLocked={isLocked}
                //     userQuoteCurrencyUSD={userQuoteCurrencyUSD}
                //     changeQuotePriceHandler={setUserQuoteCurrencyUSD}
                //     userBaseCurrencyUSD={userBaseCurrencyUSD}
                //     changeBaseCurrencyUSDHandler={setUserBaseCurrencyUSD}
                //     isSelected={inputType === InputType.USD}
                // ></USDPrice> 
                    }
                </div>
            </div>
        </div>
    );
}
