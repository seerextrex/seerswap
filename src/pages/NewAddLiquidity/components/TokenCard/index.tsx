import { WrappedCurrency } from "models/types";
import { Token, Currency } from "@uniswap/sdk-core";

import "./index.scss";
import CurrencyLogo from "components/CurrencyLogo";
import { ChevronRight } from "react-feather";
import { useCallback, useState } from "react";
import CurrencySearchModal from "components/SearchModal/CurrencySearchModal";

interface ITokenCard {
    handleTokenSelection: (currency: Currency) => void;
    currency: Currency | null | undefined;
    otherCurrency: Currency | null | undefined;
}

export function TokenCard({ handleTokenSelection, currency, otherCurrency }: ITokenCard) {
    const [selectModal, toggleSelectModal] = useState(false);

    const handleDismissSearch = useCallback(() => {
        toggleSelectModal(false);
    }, [toggleSelectModal]);

    return (
        <div className="token-card p-1">
            {selectModal && (
                <CurrencySearchModal
                    isOpen={selectModal}
                    onDismiss={handleDismissSearch}
                    onCurrencySelect={handleTokenSelection}
                    selectedCurrency={currency}
                    otherSelectedCurrency={otherCurrency}
                    showCommonBases={true}
                    showCurrencyAmount={true}
                    disableNonToken={true}
                ></CurrencySearchModal>
            )}
            <div className="f mb-1">
                <div className="token-card-logo">
                    <CurrencyLogo size={"35px"} currency={currency as WrappedCurrency}></CurrencyLogo>
                </div>
                <div className={"f f-ac ml-1"}>{currency ? currency.name : ""}</div>
            </div>
            <div className="token-card-selector">
                <button className="token-card-selector__btn f f-ac w-100 f-jb" onClick={() => toggleSelectModal(true)}>
                    <span>{currency ? currency.symbol : "Select a token"}</span>
                    <span className="token-card-selector__btn-chevron">
                        <ChevronRight className="ml-05" size={18} />
                    </span>
                </button>
            </div>
        </div>
    );
}
