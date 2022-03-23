import { t } from "@lingui/macro";
import React from "react";
import { escapeRegExp } from "../../utils";
import { StyledInput } from "./styled";

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

interface InputProps {
    value: string | number;
    onUserInput: (input: string) => void;
    error?: boolean;
    fontSize?: string;
    align?: "right" | "left";
    prependSymbol?: string | undefined;
}

export const Input = React.memo(function InnerInput({ value, onUserInput, placeholder, prependSymbol, ...rest }: InputProps & Omit<React.HTMLProps<HTMLInputElement>, "ref" | "onChange" | "as">) {
    const enforcer = (nextUserInput: string) => {
        if (nextUserInput === "" || inputRegex.test(escapeRegExp(nextUserInput.trim()))) {
            onUserInput(nextUserInput);
        }
    };

    return (
        <StyledInput
            {...rest}
            value={prependSymbol && value ? prependSymbol + value : value}
            onChange={(event) => {
                if (prependSymbol) {
                    const value = event.target.value;

                    // cut off prepended symbol
                    const formattedValue = value.toString().includes(prependSymbol) ? value.toString().slice(1, value.toString().length + 1) : value;

                    // replace commas with periods, because uniswap exclusively uses period as the decimal separator
                    enforcer(formattedValue.replace(/,/g, "."));
                } else {
                    enforcer(event.target.value.replace(/,/g, "."));
                }
            }}
            // universal input options
            inputMode="decimal"
            autoComplete="off"
            autoCorrect="off"
            // text-specific options
            type="text"
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder={placeholder || t`Enter an amount`}
            minLength={1}
            maxLength={79}
            spellCheck="false"
        />
    );
});
export default Input;
