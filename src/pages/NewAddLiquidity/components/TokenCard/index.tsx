import { WrappedCurrency } from "models/types";
import { Token } from "@uniswap/sdk-core";

import "./index.scss";
import CurrencyLogo from "components/CurrencyLogo";
import { ChevronRight } from "react-feather";

interface ITokenCard {
    handleTokenSelection: (id: string) => void;
    token: WrappedCurrency | undefined;
}

export function TokenCard({ handleTokenSelection, token }: ITokenCard) {
    return (
        <div className="token-card p-1">
            <div className="token-card-logo mb-1">
                <CurrencyLogo currency={token}></CurrencyLogo>
            </div>
            <div className="token-card-selector">
                <button className="token-card-selector__btn f f-ac w-100 f-jb" onClick={() => handleTokenSelection("")}>
                    <span>Select a token</span>
                    <span className="token-card-selector__btn-chevron">
                        <ChevronRight className="ml-05" size={18} />
                    </span>
                </button>
            </div>
        </div>
    );
}
