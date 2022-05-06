import { WrappedCurrency } from "models/types";
import { Token } from "@uniswap/sdk-core";

import "./index.scss";
import CurrencyLogo from "components/CurrencyLogo";
import { ChevronDown } from "react-feather";

interface ITokenCard {
    handleTokenSelection: (id: string) => void;
    token: WrappedCurrency | undefined;
}

export function TokenCard({ handleTokenSelection, token }: ITokenCard) {
    return (
        <div className="token-card p-1">
            <div className="token-card-logo">
                <CurrencyLogo currency={token}></CurrencyLogo>
            </div>
            <div className="token-card-selector">
                <button onClick={() => handleTokenSelection("")}>
                    <span>Select a token</span>
                    <span>
                        <ChevronDown />
                    </span>
                </button>
            </div>
        </div>
    );
}
