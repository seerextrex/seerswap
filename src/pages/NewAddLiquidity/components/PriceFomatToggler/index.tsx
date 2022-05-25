import { Trans } from "@lingui/macro";
import Toggle from "components/Toggle";
import { useState } from "react";
import "./index.scss";

export enum PriceFormats {
    TOKEN,
    USD,
}

interface IPriceFormatToggler {
    handlePriceFormat: (format: PriceFormats) => void;
}

export function PriceFormatToggler({ handlePriceFormat }: IPriceFormatToggler) {
    const [inputType, setInputType] = useState(PriceFormats.TOKEN);

    return (
        <div className="f">
            <Toggle
                isActive={!!inputType}
                toggle={() => {
                    handlePriceFormat(+!inputType);
                    setInputType(+!inputType);
                }}
                checked={<Trans>{"USD"}</Trans>}
                unchecked={<Trans>{"Tokens"}</Trans>}
            />
        </div>
    );
}
