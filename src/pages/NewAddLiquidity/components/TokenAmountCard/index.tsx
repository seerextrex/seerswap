import { Check, Lock } from "react-feather";

import { Currency, CurrencyAmount, Token } from "@uniswap/sdk-core";

import "./index.scss";
import CurrencyLogo from "components/CurrencyLogo";
import { WrappedCurrency } from "models/types";
import { useCurrencyBalance } from "state/wallet/hooks";
import { useActiveWeb3React } from "hooks/web3";
import useUSDCPrice from "hooks/useUSDCPrice";
import { useMemo } from "react";
import Input from "components/NumericalInput";
import Loader from "components/Loader";

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
}

export function TokenAmountCard({ currency, value, fiatValue, handleMax, handleInput, showApproval, handleApprove, isApproving, disabled, locked, isMax, error }: ITokenAmountCard) {
    const { account } = useActiveWeb3React();

    const balance = useCurrencyBalance(account ?? undefined, currency ?? undefined);

    const currentPrice = useUSDCPrice(currency ?? undefined);

    const balanceString = useMemo(() => {
        if (!balance || !currency) return <Loader stroke={"white"} />;

        const _balance = balance.toFixed();

        if (_balance.split(".")[0].length > 10) {
            return `${_balance.slice(0, 7)}... ${currency.symbol}`;
        }

        if (+balance.toFixed() === 0) {
            return `0 ${currency.symbol}`;
        }
        if (+balance.toFixed() < 0.0001) {
            return `< 0.0001 ${currency.symbol}`;
        }

        return `${+balance.toFixed(3)} ${currency.symbol}`;
    }, [balance, currency]);

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
                    <div>{balanceString}</div>
                    <div>
                        <button onClick={handleMax} disabled={isMax} className="token-amount-card__max-btn">
                            MAX
                        </button>
                    </div>
                </div>
                <div className="ml-a">
                    {showApproval ? (
                        isApproving ? (
                            <button className="token-amount-card__approve-btn f" disabled>
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
            <div>
                <Input value={value} disabled={locked} onUserInput={handleInput} className="token-amount-card__input mb-05 w-100" placeholder="Enter an amount" />
            </div>
            {fiatValue && <div className="token-amount-card__usd-price">{`~ $${fiatValue.toSignificant(5)}`}</div>}
            {error && <div className="token-amount-card__error mt-05">{error}</div>}
        </div>
    );
}
