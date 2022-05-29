import { Check, Lock } from "react-feather";

import { Currency, CurrencyAmount, Token } from "@uniswap/sdk-core";

import "./index.scss";
import CurrencyLogo from "components/CurrencyLogo";
import { WrappedCurrency } from "models/types";
import { useCurrencyBalance } from "state/wallet/hooks";
import { useActiveWeb3React } from "hooks/web3";
import useUSDCPrice, { useUSDCValue } from "hooks/useUSDCPrice";
import { useCallback, useEffect, useMemo, useState } from "react";
import Input from "components/NumericalInput";
import Loader from "components/Loader";
import { PriceFormats } from "../PriceFomatToggler";
import { tryParseAmount } from "state/swap/hooks";
import { useBestV3TradeExactIn } from "hooks/useBestV3Trade";
import { USDC_POLYGON } from "constants/tokens";

interface ITokenAmountCard {
    currency: Currency | undefined | null;
    value: string;
    fiatValue: CurrencyAmount<Token> | null;
    handleMax: () => void;
    handleInput: (value: string) => void;
    showApproval: boolean | undefined;
    handleApprove: () => void;
    isApproving: boolean;
    disabled: boolean;
    locked: boolean;
    isMax: boolean;
    error: string | undefined;
    priceFormat: PriceFormats
}

export function TokenAmountCard({ currency, value, fiatValue, handleMax, handleInput, showApproval, handleApprove, isApproving, disabled, locked, isMax, error, priceFormat }: ITokenAmountCard) {
    const { account } = useActiveWeb3React();

    const balance = useCurrencyBalance(account ?? undefined, currency ?? undefined);
    const balanceUSD = useUSDCValue(balance)

    const [localValue, setLocalValue] = useState("");
    const [useLocalValue, setUseLocalValue] = useState(false);

    const valueUSD = useUSDCValue(tryParseAmount(value, currency?.wrapped))
    const tokenValue = useBestV3TradeExactIn(tryParseAmount('1', USDC_POLYGON), currency?.wrapped)

    const isUSD = useMemo(() => {
        return priceFormat === PriceFormats.USD
    }, [priceFormat])

    const handleOnFocus = () => {
        setUseLocalValue(true);
    };

    const handleOnBlur = useCallback(() => {
        setUseLocalValue(false);
    }, [localValue, handleInput]);

    const handleUserInput = useCallback(
        (val) => {
            setLocalValue(val.trim());
            if (currency && isUSD && tokenValue && tokenValue.trade) {

                if (currency.wrapped.address === USDC_POLYGON.address) {
                    handleInput(val.trim());
                } else {
                    handleInput(String((val.trim() * +tokenValue.trade.outputAmount.toSignificant(5)).toFixed(3)));
                }
            } else if (!isUSD) {
                handleInput(val.trim())
            }
        },
        [handleInput, localValue, tokenValue, isUSD]
    );

    useEffect(() => {
        if (localValue && useLocalValue) return 

        if (isUSD && valueUSD) {
            setLocalValue(valueUSD.toSignificant(5))
        }
        if (!isUSD && value) {
            setLocalValue(value)
        }
    }, [isUSD, localValue, value, valueUSD])

    const balanceString = useMemo(() => {
        if (!balance || !currency) return <Loader stroke={"white"} />;

        const _balance = isUSD && balanceUSD ? balanceUSD.toSignificant(5) : balance.toSignificant(5);

        if (_balance.split(".")[0].length > 10) {
            return `${isUSD ? '$ ' : ''}${_balance.slice(0, 7)}...${isUSD ? '' : ` ${currency.symbol}`}`;
        }

        if (+balance.toFixed() === 0) {
            return `${isUSD ? '$ ' : ''}0${isUSD ? '' : ` ${currency.symbol}`}`;
        }
        if (+balance.toFixed() < 0.0001) {
            return `< ${isUSD ? '$ ' : ''}0.0001${ isUSD ? '' : ` ${currency.symbol}`}`;
        }

        return `${isUSD ? '$ ' : ''}${_balance}${ isUSD ? '' : ` ${currency.symbol}`}`;
    }, [balance, isUSD, fiatValue, currency]);

    return (
        <div className="token-amount-card-wrapper p-1 f c pos-r">
            {locked && (
                <div className="token-amount-card__locked w-100 full-h pos-a f c f-ac f-jc">
                    <div>Price is outside specified price range.</div>
                    <div className="mt-05">Single-asset deposit only.</div>
                </div>
            )}
            <div className="f f-ac mb-1" style={{ pointerEvents: locked ? "none" : "unset" }}>
                <div className="token-amount-card__logo">
                    <CurrencyLogo size={"35px"} currency={currency as WrappedCurrency}></CurrencyLogo>
                </div>
                <div className="ml-1">
                    <div className="f f-ac">
                        <span className="mr-05">Balance: </span>
                        <span>{balanceString}</span>
                    </div>
                    <div>
                        <button onClick={handleMax} disabled={isMax} className="token-amount-card__max-btn">
                            MAX
                        </button>
                    </div>
                </div>
                <div className="ml-a">
                    {showApproval ? (
                        isApproving ? (
                            <button className="token-amount-card__approve-btn f f-ac" disabled>
                                <Loader style={{ marginRight: "3px" }} stroke="white" />
                                <span>Approving</span>
                            </button>
                        ) : (
                            <button className="token-amount-card__approve-btn" onClick={handleApprove}>
                                Approve
                            </button>
                        )
                    ) : showApproval !== undefined ? (
                        <div className="token-amount-card__approved f f-ac">
                            <span>
                                <Check size={16} />
                            </span>
                            <span className="fs-085" style={{ marginLeft: "3px" }}>
                                Approved
                            </span>
                        </div>
                    ) : null}
                </div>
            </div>
            <div className="f pos-r f-ac">
                {isUSD && <label htmlFor={`amount-${currency?.symbol}`} className="token-amount-card__usd">$</label>}
                <Input value={localValue} id={`amount-${currency?.symbol}`} disabled={locked} onFocus={handleOnFocus} onBlur={handleOnBlur} onUserInput={handleUserInput} className={`token-amount-card__input ${isUSD ? 'is-usd' : ''} mb-05 w-100`} placeholder="Enter an amount" />
            </div>
            {error && <div className="token-amount-card__error mt-05">{error}</div>}
        </div>
    );
}
