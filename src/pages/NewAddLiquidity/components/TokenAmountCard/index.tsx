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

interface ITokenAmountCard {
    currency: Currency | undefined | null;
    value: string;
    fiatValue: CurrencyAmount<Token> | null;
    handleMax: () => void;
    handleInput: (value: string) => void;
    approved: boolean;
    disabled: boolean;
    isMax: boolean;
    error: string | null;
}

export function TokenAmountCard({ currency, value, fiatValue, handleMax, handleInput, approved, disabled, isMax, error }: ITokenAmountCard) {
    const { account } = useActiveWeb3React();

    const balance = useCurrencyBalance(account ?? undefined, currency ?? undefined);

    const currentPrice = useUSDCPrice(currency ?? undefined);

    const balanceString = useMemo(() => {
        if (!balance) return "Loading...";

        const _balance = balance.toFixed();

        if (_balance.split(".")[0].length > 10) {
            return _balance.slice(0, 7) + "...";
        }

        if (+balance.toFixed() === 0) {
            return "0";
        }
        if (+balance.toFixed() < 0.0001) {
            return "< 0.0001";
        }

        return +balance.toFixed(3);
    }, [balance]);

    return (
        <div className="token-amount-card-wrapper p-1 f c">
            <div className="f f-ac mb-1">
                <div className="token-amount-card__logo">
                    <CurrencyLogo size={"35px"} currency={currency as WrappedCurrency}></CurrencyLogo>
                </div>
                <div className="ml-1">
                    <div>{`Balance: ${balanceString} ${currency?.symbol}`}</div>
                    <div>
                        <button onClick={handleMax} disabled={isMax} className="token-amount-card__max-btn">
                            MAX
                        </button>
                    </div>
                </div>
                <div className="ml-a">
                    {approved ? (
                        <div className="token-amount-card__approved f f-ac">
                            <span>
                                <Check size={16} />
                            </span>
                            <span className="fs-085" style={{ marginLeft: "3px" }}>
                                Approved
                            </span>
                        </div>
                    ) : (
                        <button className="token-amount-card__approve-btn">Approve</button>
                    )}
                </div>
            </div>
            <div>
                <Input value={value} onUserInput={handleInput} className="token-amount-card__input mb-05 w-100" placeholder="Enter an amount" />
                {error && <div className="token-amount-card__error mb-05">Not enough</div>}
            </div>
            <div className="token-amount-card__usd-price">{`~ $${fiatValue?.toSignificant(5)}`}</div>
        </div>
    );
}
