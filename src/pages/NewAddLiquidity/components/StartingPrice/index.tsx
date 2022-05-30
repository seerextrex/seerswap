import { Currency, Token, Price } from "@uniswap/sdk-core";
import { Trans } from "@lingui/macro";

import Toggle from "components/Toggle";

import useUSDCPrice from "hooks/useUSDCPrice";
import { useCallback, useEffect, useMemo, useState } from "react";

import "./index.scss";
import { Lock } from "react-feather";
import { PriceFormats } from "../PriceFomatToggler";
import { IDerivedMintInfo, useInitialTokenPrice, useInitialUSDPrices } from "state/mint/v3/hooks";
import { useAppDispatch } from "state/hooks";
import { Field, setInitialTokenPrice, setInitialUSDPrices, updateSelectedPreset } from "state/mint/v3/actions";
import Input from "components/NumericalInput";

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
            changeQuotePriceHandler(tokenRatio);
        }
    }, [basePrice, quotePrice, tokenRatio]);

    return (
        <div className={`token-price ${isSelected ? "main" : "side"} ws-no-wrap mxs_fs-075`}>
            <div className={"quote-token w-100 f"}>
                <div>
                    {isLocked ? (
                        <div className="f f-ac">
                            <span className="pl-1">
                                <Lock size={14} />
                            </span>
                            <span className="quote-token__auto-fetched">{tokenRatio}</span>
                        </div>
                    ) : isSelected ? (
                        <Input
                            className={`quote-token__input bg-t c-w ol-n`}
                            placeholder={`${quoteCurrency?.symbol} price`}
                            value={userQuoteCurrencyToken || ""}
                            onUserInput={(e: string) => changeQuotePriceHandler(e)}
                        />
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
    changeHandler: (price: string) => void;
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
                    <Input className={`ol-n usd-price__input`} value={userUSD || ""} onUserInput={(e: string) => changeHandler(e)} />
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
    startPriceHandler: (value: string) => void;
    mintInfo: IDerivedMintInfo;
    priceFormat: PriceFormats;
}

export default function StartingPrice({ currencyA, currencyB, startPriceHandler, mintInfo, priceFormat }: IStartingPrice) {
    const dispatch = useAppDispatch();
    const initialUSDPrices = useInitialUSDPrices();
    const initialTokenPrice = useInitialTokenPrice();

    const basePriceUSD = useUSDCPrice(currencyA ?? undefined);
    const quotePriceUSD = useUSDCPrice(currencyB ?? undefined);

    const isSorted = currencyA && currencyB && currencyA?.wrapped.sortsBefore(currencyB?.wrapped);

    const [userBaseCurrencyUSD, setUserBaseCurrencyUSD] = useState<string | undefined>(initialUSDPrices.CURRENCY_A);
    const [userQuoteCurrencyUSD, setUserQuoteCurrencyUSD] = useState<string | undefined>(initialUSDPrices.CURRENCY_B);

    const [userQuoteCurrencyToken, setUserQuoteCurrencyToken] = useState<string | undefined>(
        mintInfo && isSorted ? mintInfo.price?.toSignificant(5) : mintInfo.price?.invert().toSignificant(5) || undefined
    );

    const isLocked = useMemo(() => Boolean(basePriceUSD && quotePriceUSD), [basePriceUSD, quotePriceUSD]);

    const isUSD = useMemo(() => priceFormat === PriceFormats.USD, [priceFormat]);

    const handleUSDChange = useCallback(
        (field: Field, typedValue: string) => {
            dispatch(setInitialUSDPrices({ field, typedValue }));

            if (!typedValue) return

            if (field === Field.CURRENCY_A) {
                setUserBaseCurrencyUSD(typedValue);
                const priceB = initialUSDPrices.CURRENCY_B || quotePriceUSD?.toSignificant(5)
                if (priceB) {
                    startPriceHandler(String(+typedValue / +priceB));
                    setUserQuoteCurrencyToken(String(+typedValue / +priceB));
                    dispatch(setInitialTokenPrice({ typedValue: String(+typedValue / +priceB) }));
                }
            }

            if (field === Field.CURRENCY_B) {
                setUserQuoteCurrencyUSD(typedValue);
                const priceA = initialUSDPrices.CURRENCY_A || basePriceUSD?.toSignificant(5)
                if (priceA) {
                    startPriceHandler(String(+priceA / +typedValue));
                    setUserQuoteCurrencyToken(String(+priceA / +typedValue));
                    dispatch(setInitialTokenPrice({ typedValue: String(+priceA / +typedValue) }));
                }
            }
        },
        [basePriceUSD, quotePriceUSD, initialUSDPrices]
    );

    const handleTokenChange = useCallback(
        (typedValue: string) => {
            dispatch(setInitialTokenPrice({ typedValue }));
            setUserQuoteCurrencyToken(typedValue);

            startPriceHandler(typedValue);
            setUserQuoteCurrencyToken(typedValue);

            const usdA = initialUSDPrices.CURRENCY_A;
            const usdB = initialUSDPrices.CURRENCY_B;

            if (!typedValue) return

            if (usdA) {
                const newUSDA = (+usdA * +typedValue) / +initialTokenPrice;
                dispatch(setInitialUSDPrices({ field: Field.CURRENCY_A, typedValue: String(newUSDA) }));
                setUserBaseCurrencyUSD(String(newUSDA));
                startPriceHandler(String(newUSDA));
            }

            if (usdB) {
                const newUSDB = (+usdB * +typedValue) / +initialTokenPrice;
                dispatch(setInitialUSDPrices({ field: Field.CURRENCY_B, typedValue: String(newUSDB) }));
                setUserQuoteCurrencyUSD(String(newUSDB));
                startPriceHandler(String(newUSDB));
            }
        },
        [userBaseCurrencyUSD, userQuoteCurrencyUSD, initialTokenPrice, initialUSDPrices, handleUSDChange]
    );

    useEffect(() => {
        if (initialTokenPrice) {
            startPriceHandler(initialTokenPrice);
            setUserQuoteCurrencyToken(initialTokenPrice);
        }
    }, [initialTokenPrice]);

    useEffect(() => {
        dispatch(updateSelectedPreset({ preset: null }));
    }, [priceFormat]);

    return (
        <div className={"f starting-price-wrapper c p-1"} style={{ width: "542px", backgroundColor: "#26343f" }}>
            <div className={"flex-s-between"}>
                {isLocked ? <span className={"auto-fetched"}>✨ Prices were auto-fetched</span> : <span className={"not-auto-fetched"}>{`Can't auto-fetch prices.`}</span>}
            </div>
            <div className={"br-8 mt-1 f c"}>
                <div className={`f ${priceFormat === PriceFormats.TOKEN ? "reverse" : "c"}`}>
                    {priceFormat === PriceFormats.TOKEN ? (
                        <TokenPrice
                            baseCurrency={currencyA}
                            quoteCurrency={currencyB}
                            basePrice={basePriceUSD}
                            quotePrice={quotePriceUSD}
                            isLocked={isLocked}
                            userQuoteCurrencyToken={initialTokenPrice}
                            changeQuotePriceHandler={(v: string) => handleTokenChange(v)}
                            isSelected={priceFormat === PriceFormats.TOKEN}
                        ></TokenPrice>
                    ) : (
                        <USDPrice
                            baseCurrency={currencyA}
                            quoteCurrency={currencyB}
                            basePrice={basePriceUSD}
                            quotePrice={quotePriceUSD}
                            isLocked={isLocked}
                            userBaseCurrencyUSD={initialUSDPrices.CURRENCY_A}
                            userQuoteCurrencyUSD={initialUSDPrices.CURRENCY_B}
                            changeBaseCurrencyUSDHandler={(v: string) => handleUSDChange(Field.CURRENCY_A, v)}
                            changeQuoteCurrencyUSDHandler={(v: string) => handleUSDChange(Field.CURRENCY_B, v)}
                            isSelected={priceFormat === PriceFormats.USD}
                        ></USDPrice>
                    )}
                </div>
            </div>
        </div>
    );
}
