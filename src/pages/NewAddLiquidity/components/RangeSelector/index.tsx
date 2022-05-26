import { Price, Token, Currency } from "@uniswap/sdk-core";
import Input from "components/NumericalInput";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Bound } from "state/mint/v3/actions";

import "./index.scss";

interface IRangeSelector {
    priceLower: Price<Token, Token> | undefined;
    priceUpper: Price<Token, Token> | undefined;
    onLeftRangeInput: (typedValue: string) => void;
    onRightRangeInput: (typedValue: string) => void;
    getDecrementLower: () => string;
    getIncrementLower: () => string;
    getDecrementUpper: () => string;
    getIncrementUpper: () => string;
    currencyA: Currency | null | undefined;
    currencyB: Currency | null | undefined;
    feeAmount: number;
    ticksAtLimit: { [bound in Bound]?: boolean | undefined };
    initial: boolean;
    disabled: boolean;
    price: Price<Token, Token> | undefined;
    invertPrice: boolean;
    isBeforePrice: boolean;
    isAfterPrice: boolean;
}

interface IRangePart {
    value: string;
    onUserInput: (value: string) => void;
    decrement: () => string;
    increment: () => string;
    decrementDisabled?: boolean;
    incrementDisabled?: boolean;
    // feeAmount?: FeeAmount;
    label?: string;
    width?: string;
    locked?: boolean; // disable input
    // title: ReactNode;
    tokenA: string | undefined;
    tokenB: string | undefined;
    initial: boolean;
    disabled: boolean;
    // style?: CSSProperties;
    title: string;
}

export function RangeSelector({
    priceLower,
    priceUpper,
    onLeftRangeInput,
    onRightRangeInput,
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
    currencyA,
    currencyB,
    feeAmount,
    ticksAtLimit,
    initial,
    disabled,
    invertPrice,
    price,
    isBeforePrice,
    isAfterPrice,
}: IRangeSelector) {
    const tokenA = (currencyA ?? undefined)?.wrapped;
    const tokenB = (currencyB ?? undefined)?.wrapped;

    const isSorted = useMemo(() => {
        return tokenA && tokenB && tokenA.sortsBefore(tokenB);
    }, [tokenA, tokenB]);

    const leftPrice = useMemo(() => {
        return isSorted ? priceLower : priceUpper?.invert();
    }, [isSorted, priceLower, priceUpper]);

    const rightPrice = useMemo(() => {
        return isSorted ? priceUpper : priceLower?.invert();
    }, [isSorted, priceUpper, priceLower]);

    const currentPrice = useMemo(() => {
        if (!price) return;

        const _price = invertPrice ? price.invert().toSignificant(5) : price.toSignificant(5);

        if (Number(_price) <= 0.0001) {
            return _price;
        } else {
            return Number(_price).toFixed(3);
        }
    }, [price]);

    return (
        <div className="f f-jb">
            <div className={`min-price`} style={{ order: isAfterPrice ? 2 : 1 }}>
                <RangePart
                    value={ticksAtLimit[Bound.LOWER] ? "0" : leftPrice?.toSignificant(5) ?? ""}
                    onUserInput={onLeftRangeInput}
                    width="100%"
                    decrement={isSorted ? getDecrementLower : getIncrementUpper}
                    increment={isSorted ? getIncrementLower : getDecrementUpper}
                    decrementDisabled={ticksAtLimit[Bound.LOWER]}
                    incrementDisabled={ticksAtLimit[Bound.LOWER]}
                    label={leftPrice ? `${currencyB?.symbol}` : "-"}
                    tokenA={currencyA?.symbol}
                    tokenB={currencyB?.symbol}
                    initial={initial}
                    disabled={disabled}
                    title={"Min price"}
                />
            </div>
            {price && (
                <div className="current-price f c f-ac" style={{ order: isAfterPrice ? 1 : isBeforePrice ? 3 : 2 }}>
                    <div className="mb-05" style={{ whiteSpace: "nowrap" }}>
                        Current price
                    </div>
                    <div className="current-price-tip ta-c">{currentPrice}</div>
                </div>
            )}
            <div className="max-price" style={{ order: isBeforePrice ? 2 : 3 }}>
                <RangePart
                    value={ticksAtLimit[Bound.UPPER] ? "∞" : rightPrice?.toSignificant(5) ?? ""}
                    onUserInput={onRightRangeInput}
                    decrement={isSorted ? getDecrementUpper : getIncrementLower}
                    increment={isSorted ? getIncrementUpper : getDecrementLower}
                    incrementDisabled={ticksAtLimit[Bound.UPPER]}
                    decrementDisabled={ticksAtLimit[Bound.UPPER]}
                    label={rightPrice ? `${currencyB?.symbol}` : "-"}
                    tokenA={currencyA?.symbol}
                    tokenB={currencyB?.symbol}
                    initial={initial}
                    disabled={disabled}
                    title={"Max price"}
                />
            </div>
        </div>
    );
}

function RangePart({ value, decrement, increment, decrementDisabled = false, incrementDisabled = false, width, locked, onUserInput, initial, disabled, title }: IRangePart) {
    // let user type value and only update parent value on blur
    const [localValue, setLocalValue] = useState("");
    const [useLocalValue, setUseLocalValue] = useState(false);

    // animation if parent value updates local value
    const handleOnFocus = () => {
        setUseLocalValue(true);
    };

    const handleOnBlur = useCallback(() => {
        setUseLocalValue(false);
    }, [localValue, onUserInput]);

    // for button clicks
    const handleDecrement = useCallback(() => {
        setUseLocalValue(false);
        onUserInput(decrement());
    }, [decrement, onUserInput]);

    const handleIncrement = useCallback(() => {
        setUseLocalValue(false);
        onUserInput(increment());
    }, [increment, onUserInput]);

    const handleInput = useCallback(
        (val) => {
            setLocalValue(val.trim());
            onUserInput(val.trim());
        },
        [onUserInput]
    );

    useEffect(() => {
        if (localValue !== value && !useLocalValue) {
            setTimeout(() => {
                setLocalValue(value); // reset local value to match parent
            }, 0);
        }
    }, [localValue, useLocalValue, value]);

    return (
        <div>
            <div className="mb-05 f f-ac">
                <div>{title}</div>
                <div className="ml-a">
                    <button onClick={handleIncrement} disabled={incrementDisabled || disabled} className="range-input__btn">
                        +
                    </button>
                    <button onClick={handleDecrement} disabled={decrementDisabled || disabled} className="range-input__btn">
                        -
                    </button>
                </div>
            </div>
            <Input value={localValue} onFocus={handleOnFocus} onBlur={handleOnBlur} className="range-input" disabled={disabled || locked} onUserInput={handleInput} placeholder="0.00" />
        </div>
    );
}
