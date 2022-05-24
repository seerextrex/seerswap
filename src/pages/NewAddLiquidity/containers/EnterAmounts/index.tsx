import { TokenAmountCard } from "pages/NewAddLiquidity/components/TokenAmountCard";
import { TokenRatio } from "pages/NewAddLiquidity/components/TokenRatio";

import { Currency, CurrencyAmount, Token } from "@uniswap/sdk-core";

import "./index.scss";
import { Field } from "state/mint/actions";
import { IDerivedMintInfo, useV3MintActionHandlers, useV3MintState } from "state/mint/v3/hooks";
import { useUSDCValue } from "hooks/useUSDCPrice";
import { maxAmountSpend } from "utils/maxAmountSpend";
import { ApprovalState, useApproveCallback } from "hooks/useApproveCallback";
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from "constants/addresses";
import { useActiveWeb3React } from "hooks/web3";
import { Position } from "@uniswap/v3-sdk";
import { Bound } from "state/mint/v3/actions";
import { useMemo } from "react";
import { tryParseAmount } from "state/swap/hooks";

interface IEnterAmounts {
    currencyA: Currency | undefined | null;
    currencyB: Currency | undefined | null;
    mintInfo: IDerivedMintInfo;
}

export function EnterAmounts({ currencyA, currencyB, mintInfo }: IEnterAmounts) {
    const { chainId } = useActiveWeb3React();

    const { independentField, typedValue, startPriceTypedValue } = useV3MintState();

    const { onFieldAInput, onFieldBInput } = useV3MintActionHandlers(mintInfo.noLiquidity);

    // get formatted amounts
    const formattedAmounts = {
        [independentField]: typedValue,
        [mintInfo.dependentField]: mintInfo.parsedAmounts[mintInfo.dependentField]?.toSignificant(6) ?? "",
    };

    const usdcValues = {
        [Field.CURRENCY_A]: useUSDCValue(mintInfo.parsedAmounts[Field.CURRENCY_A]),
        [Field.CURRENCY_B]: useUSDCValue(mintInfo.parsedAmounts[Field.CURRENCY_B]),
    };

    // get the max amounts user can add
    const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce((accumulator, field) => {
        return {
            ...accumulator,
            [field]: maxAmountSpend(mintInfo.currencyBalances[field]),
        };
    }, {});

    const atMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce((accumulator, field) => {
        return {
            ...accumulator,
            [field]: maxAmounts[field]?.equalTo(mintInfo.parsedAmounts[field] ?? "0"),
        };
    }, {});

    // check whether the user has approved the router on the tokens
    const [approvalA, approveACallback] = useApproveCallback(mintInfo.parsedAmounts[Field.CURRENCY_A], chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined);
    const [approvalB, approveBCallback] = useApproveCallback(mintInfo.parsedAmounts[Field.CURRENCY_B], chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined);

    const showApprovalA = approvalA !== ApprovalState.APPROVED && !!mintInfo.parsedAmounts[Field.CURRENCY_A];
    const showApprovalB = approvalB !== ApprovalState.APPROVED && !!mintInfo.parsedAmounts[Field.CURRENCY_B];

    const [token0Ratio, token1Ratio] = useMemo(() => {
        const usdcA = usdcValues[Field.CURRENCY_A];
        const usdcB = usdcValues[Field.CURRENCY_B];

        if (!usdcA && !usdcB) return ["0", "0"];

        if (!usdcA && usdcB) return ["0", "100"];

        if (!usdcB && usdcA) return ["100", "0"];

        if (usdcA && usdcB) {
            const totalSum = usdcA.add(usdcB);
            const token0 = usdcA.multiply(100000000).divide(totalSum).toSignificant(3);
            const token1 = usdcB.multiply(100000000).divide(totalSum).toSignificant(3);

            return [token0, token1];
        }

        return ["0", "0"];
    }, [currencyA, currencyB, mintInfo]);

    return (
        <div className="f">
            <div className="f c">
                <div className="mb-1" style={{ overflow: "hidden", borderRadius: "8px" }}>
                    <TokenAmountCard
                        currency={currencyA}
                        value={formattedAmounts[Field.CURRENCY_A]}
                        fiatValue={usdcValues[Field.CURRENCY_A]}
                        handleInput={onFieldAInput}
                        handleMax={() => onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? "")}
                        approved={!showApprovalA}
                        disabled={true}
                        isMax={!!atMaxAmounts[Field.CURRENCY_A]}
                        error={"Not enough USDC"}
                    />
                </div>
                <div>
                    <TokenAmountCard
                        currency={currencyB}
                        value={formattedAmounts[Field.CURRENCY_B]}
                        fiatValue={usdcValues[Field.CURRENCY_B]}
                        handleInput={onFieldBInput}
                        handleMax={() => onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? "")}
                        approved={!showApprovalB}
                        disabled={false}
                        isMax={!!atMaxAmounts[Field.CURRENCY_B]}
                        error={null}
                    />
                </div>
            </div>
            <div className="full-h ml-2">
                <TokenRatio currencyA={currencyA} currencyB={currencyB} token0Ratio={token0Ratio} token1Ratio={token1Ratio} />
            </div>
        </div>
    );
}
