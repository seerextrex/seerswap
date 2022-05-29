import { Currency, Token, Price } from "@uniswap/sdk-core";
import { Trans } from "@lingui/macro";

import Toggle from "components/Toggle";

import useUSDCPrice from "hooks/useUSDCPrice";
import { useCallback, useEffect, useMemo, useState } from "react";

import "./index.scss";
import { Lock } from "react-feather";
import { PriceFormats } from "../PriceFomatToggler";
import { IDerivedMintInfo, useInitialUSDPrices } from "state/mint/v3/hooks";
import { useAppDispatch } from "state/hooks";
import { Field, setInitialUSDPrices, updateSelectedPreset } from "state/mint/v3/actions";


interface IPrice {
    baseCurrency: Currency | undefined;
    quoteCurrency: Currency | undefined;
    basePrice: Price<Currency, Token> | undefined;
    quotePrice: Price<Currency, Token> | undefined;
    isLocked: boolean;
    isSelected: boolean;
}

interface ITokenPrice extends IPrice {
    userQuoteCurrencyToken?: string | undefined;
    changeQuotePriceHandler?: any;
}

interface IUSDPrice extends IPrice {
    userBaseCurrencyUSD: string | undefined;
    userQuoteCurrencyUSD: string | undefined;
    changeBaseCurrencyUSDHandler: any;
    changeQuoteCurrencyUSDHandler: any;
}

function TokenPrice({ baseCurrency, quoteCurrency, basePrice, quotePrice, isLocked, userQuoteCurrencyToken, changeQuotePriceHandler, isSelected }: ITokenPrice) {
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
                            <span className="pl-1"><Lock size={14} /></span>
                            <span className="quote-token__auto-fetched">{tokenRatio}</span>
                        </div>
                    ) : isSelected ? (
                        <input className={`quote-token__input bg-t c-w ol-n`} placeholder={`${quoteCurrency?.symbol} price`} type="text" value={userQuoteCurrencyToken} onInput={(e: any) => changeQuotePriceHandler(e.target.value)} />
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
    const _price = useMemo(() => (price ? price.toSignificant(5) : "Loading..."), [price]);

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
    changeBaseCurrencyUSDHandler,
    changeQuoteCurrencyUSDHandler,
    isSelected,
}: IUSDPrice) {
    const baseSymbol = useMemo(() => (baseCurrency ? baseCurrency.symbol : "-"), [baseCurrency]);
    const quoteSymbol = useMemo(() => (quoteCurrency ? quoteCurrency.symbol : "-"), [quoteCurrency]);

    return (
        <div className={`f usd-price__wrapper ${isSelected ? "main" : "side"}`}>
            <USDPriceField symbol={baseSymbol} price={basePrice} isSelected={isSelected} userUSD={userBaseCurrencyUSD} changeHandler={changeBaseCurrencyUSDHandler}></USDPriceField>
            <USDPriceField symbol={quoteSymbol} price={quotePrice} isSelected={isSelected} userUSD={userQuoteCurrencyUSD} changeHandler={changeQuoteCurrencyUSDHandler}></USDPriceField>
        </div>
    );
}

interface IStartingPrice {
    currencyA: Currency | undefined;
    currencyB: Currency | undefined;
    startPriceHandler: (value: string) => void
    mintInfo: IDerivedMintInfo
    priceFormat: PriceFormats
}

export default function StartingPrice({ currencyA, currencyB, startPriceHandler, mintInfo, priceFormat }: IStartingPrice) {

    const dispatch = useAppDispatch()
    const initialUSDPrices = useInitialUSDPrices()

    const basePriceUSD = useUSDCPrice(currencyA ?? undefined);
    const quotePriceUSD = useUSDCPrice(currencyB ?? undefined);

    const isSorted = currencyA && currencyB && currencyA?.wrapped.sortsBefore(currencyB?.wrapped);

    const [userBaseCurrencyUSD, setUserBaseCurrencyUSD] = useState<string | undefined>(initialUSDPrices.CURRENCY_A);
    const [userQuoteCurrencyUSD, setUserQuoteCurrencyUSD] = useState<string | undefined>(initialUSDPrices.CURRENCY_B);

    const [userQuoteCurrencyToken, setUserQuoteCurrencyToken] = useState<string | undefined>(mintInfo && isSorted ? mintInfo.price?.toSignificant(5) : mintInfo.price?.invert().toSignificant(5) || undefined);

    const isLocked = useMemo(() => Boolean(basePriceUSD && quotePriceUSD), [basePriceUSD, quotePriceUSD]);

    const handleStartPriceInput = useCallback((v: string) => {
        console.log('NEW STARTING PRICE', v)
        startPriceHandler(v)
        dispatch(setInitialUSDPrices({field: Field.CURRENCY_A, typedValue: ''}))
        dispatch(setInitialUSDPrices({field: Field.CURRENCY_B, typedValue: ''}))
        setUserBaseCurrencyUSD('')
        setUserQuoteCurrencyUSD('')
        dispatch(updateSelectedPreset({ preset: null }))
        // if (inputType === InputType.TOKEN_RATIO) {
        setUserQuoteCurrencyToken(v)
        // } else {
        // setUserBaseCurrencyUSD(v)
        // }
    }, [startPriceHandler])

    useEffect(() => {
        // startPriceHandler('')
        // setUserQuoteCurrencyUSD('')
        // setUserQuoteCurrencyToken('')
    }, [priceFormat])

    useEffect(() => {
        dispatch(setInitialUSDPrices({field: Field.CURRENCY_A, typedValue: userBaseCurrencyUSD || ''}))
    }, [userBaseCurrencyUSD])

    useEffect(() => {
        dispatch(setInitialUSDPrices({field: Field.CURRENCY_B, typedValue: userQuoteCurrencyUSD || ''}))
    }, [userQuoteCurrencyUSD])

    useEffect(() => {
        if (userBaseCurrencyUSD && userQuoteCurrencyUSD) {
            startPriceHandler(String(+userBaseCurrencyUSD / +userQuoteCurrencyUSD))
            dispatch(updateSelectedPreset({ preset: null }))
        }
    }, [userBaseCurrencyUSD, userQuoteCurrencyUSD])

    return (
        <div className={"f starting-price-wrapper c p-1"} style={{ width: '542px', backgroundColor: '#26343f' }}>
            <div className={"flex-s-between"}>
                {isLocked ? (
                    <span className={"auto-fetched"}>✨ Prices were auto-fetched</span>
                ) : (
                    <span className={"not-auto-fetched"}>{`Can't auto-fetch prices.`}</span>
                )}
            </div>
            <div className={"br-8 mt-1 f c"}>
                <div className={`f ${priceFormat === PriceFormats.TOKEN ? "reverse" : "c"}`}>
                    {
                        priceFormat === PriceFormats.TOKEN ? <TokenPrice
                            baseCurrency={currencyA}
                            quoteCurrency={currencyB}
                            basePrice={basePriceUSD}
                            quotePrice={quotePriceUSD}
                            isLocked={isLocked}
                            userQuoteCurrencyToken={userQuoteCurrencyToken}
                            changeQuotePriceHandler={handleStartPriceInput}
                            isSelected={priceFormat === PriceFormats.TOKEN}
                        ></TokenPrice> :
                            <USDPrice
                                baseCurrency={currencyA}
                                quoteCurrency={currencyB}
                                basePrice={basePriceUSD}
                                quotePrice={quotePriceUSD}
                                isLocked={isLocked}
                                userBaseCurrencyUSD={userBaseCurrencyUSD}
                                userQuoteCurrencyUSD={userQuoteCurrencyUSD}
                                changeBaseCurrencyUSDHandler={setUserBaseCurrencyUSD}
                                changeQuoteCurrencyUSDHandler={setUserQuoteCurrencyUSD}
                                isSelected={priceFormat === PriceFormats.USD}
                            ></USDPrice>
                    }
                </div>
            </div>
        </div>
    );
}
