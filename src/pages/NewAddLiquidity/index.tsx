import { useCurrency } from "hooks/Tokens";
import { useIsNetworkFailedImmediate } from "hooks/useIsNetworkFailed";
import usePrevious from "hooks/usePrevious";
import { useActiveWeb3React } from "hooks/web3";
import { useCallback, useEffect, useMemo } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useV3DerivedMintInfo, useV3MintState, useV3MintActionHandlers, useRangeHopCallbacks } from "state/mint/v3/hooks";
import { currencyId } from "utils/currencyId";
import { Stepper } from "./components/Stepper";
import { EnterAmounts } from "./containers/EnterAmounts";
import { SelectPair } from "./containers/SelectPair";
import { SelectRange } from "./containers/SelectRange";

import { Currency, CurrencyAmount } from "@uniswap/sdk-core";

import "./index.scss";
import { WMATIC_EXTENDED } from "constants/tokens";
import { Bound } from "state/mint/v3/actions";
import LiquidityChartRangeInput from "components/LiquidityChartRangeInput";
import { Field } from "state/mint/actions";
import { maxAmountSpend } from "utils/maxAmountSpend";
import { useUSDCValue } from "hooks/useUSDCPrice";
import { ApprovalState, useApproveCallback } from "hooks/useApproveCallback";
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from "constants/addresses";
import { PriceFormatToggler } from "./components/PriceFomatToggler";
import { AddLiquidityButton } from "./containers/AddLiquidityButton";
import { Check } from "react-feather";

export function NewAddLiquidityPage({
    match: {
        params: { currencyIdA, currencyIdB },
    },
    history,
}: RouteComponentProps<{
    currencyIdA?: string;
    currencyIdB?: string;
}>) {
    const { chainId } = useActiveWeb3React();

    // const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected
    // const expertMode = useIsExpertMode()
    // const addTransaction = useTransactionAdder()
    // const positionManager = useV3NFTPositionManagerContract()

    // check for existing position if tokenId in url
    // const { position: existingPositionDetails, loading: positionLoading } = useV3PositionFromTokenId(tokenId ? BigNumber.from(tokenId) : undefined)

    // const networkFailed = useIsNetworkFailed()

    // const hasExistingPosition = !!existingPositionDetails && !positionLoading
    // const { position: existingPosition } = useDerivedPositionInfo(existingPositionDetails)
    const feeAmount = 100;

    useEffect(() => {
        onFieldAInput("");
        onFieldBInput("");
        onLeftRangeInput("");
        onRightRangeInput("");
    }, [currencyIdA, currencyIdB]);

    const baseCurrency = useCurrency(currencyIdA);
    const currencyB = useCurrency(currencyIdB);
    // prevent an error if they input ETH/WETH
    //TODO
    const quoteCurrency = baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB;

    const derivedMintInfo = useV3DerivedMintInfo(baseCurrency ?? undefined, quoteCurrency ?? undefined, feeAmount, baseCurrency ?? undefined, undefined);
    const prevDerivedMintInfo = usePrevious({ ...derivedMintInfo });

    const mintInfo = useMemo(() => {
        if ((!derivedMintInfo.pool || !derivedMintInfo.price || derivedMintInfo.noLiquidity) && prevDerivedMintInfo) {
            return {
                ...prevDerivedMintInfo,
            };
        }
        return {
            ...derivedMintInfo,
        };
    }, [derivedMintInfo, baseCurrency, quoteCurrency]);

    const { onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, onStartPriceInput } = useV3MintActionHandlers(mintInfo.noLiquidity);

    const handleCurrencySelect = useCallback(
        (currencyNew: Currency, currencyIdOther?: string): (string | undefined)[] => {
            const currencyIdNew = currencyId(currencyNew, chainId || 137);

            let chainSymbol;

            if (chainId === 137) {
                chainSymbol = "MATIC";
            }

            if (currencyIdNew.toLowerCase() === currencyIdOther?.toLowerCase()) {
                // not ideal, but for now clobber the other if the currency ids are equal
                return [currencyIdNew, undefined];
            } else {
                // prevent weth + eth
                const isETHOrWETHNew = currencyIdNew === chainSymbol || (chainId !== undefined && currencyIdNew === WMATIC_EXTENDED[chainId]?.address);
                const isETHOrWETHOther = currencyIdOther !== undefined && (currencyIdOther === chainSymbol || (chainId !== undefined && currencyIdOther === WMATIC_EXTENDED[chainId]?.address));

                if (isETHOrWETHNew && isETHOrWETHOther) {
                    return [currencyIdNew, undefined];
                } else {
                    return [currencyIdNew, currencyIdOther];
                }
            }
        },
        [chainId]
    );

    const handleCurrencyASelect = useCallback(
        (currencyANew: Currency) => {
            const [idA, idB] = handleCurrencySelect(currencyANew, currencyIdB);
            if (idB === undefined) {
                history.push(`/new-add/${idA}`);
            } else {
                history.push(`/new-add/${idA}/${idB}`);
            }
        },
        [handleCurrencySelect, currencyIdB, history]
    );

    const handleCurrencyBSelect = useCallback(
        (currencyBNew: Currency) => {
            const [idB, idA] = handleCurrencySelect(currencyBNew, currencyIdA);
            if (idA === undefined) {
                history.push(`/new-add/${idB}`);
            } else {
                history.push(`/new-add/${idA}/${idB}`);
            }
        },
        [handleCurrencySelect, currencyIdA, history]
    );

    const handleCurrencySwap = useCallback(() => {
        history.push(`/new-add/${currencyIdB}/${currencyIdA}`);
    }, [history, handleCurrencySelect, currencyIdA, currencyIdB]);

    const handlePopularPairSelection = useCallback((pair: [string, string]) => {
        history.push(`/new-add/${pair[0]}/${pair[1]}`);
    }, []);

    const handlePriceFormat = useCallback(() => {}, []);

    const step1 = useMemo(() => {
        return baseCurrency && quoteCurrency;
    }, [baseCurrency, quoteCurrency]);

    const step2 = useMemo(() => {
        return mintInfo.lowerPrice && mintInfo.upperPrice && !mintInfo.invalidRange;
    }, [mintInfo]);

    const step3 = useMemo(() => {
        if (mintInfo.outOfRange) {
            return mintInfo.parsedAmounts[Field.CURRENCY_A] || mintInfo.parsedAmounts[Field.CURRENCY_B];
        }
        return mintInfo.parsedAmounts[Field.CURRENCY_A] && mintInfo.parsedAmounts[Field.CURRENCY_B];
    }, [mintInfo]);

    return (
        <div className="add-liquidity-page">
            <div className="add-liquidity-page__header f">
                <span className="add-liquidity-page__header-title">Add liquidity</span>
                <span className="ml-a">
                    <span className="mr-1">
                        <PriceFormatToggler handlePriceFormat={handlePriceFormat} />
                    </span>
                    {/* <span>Settings</span> */}
                </span>
            </div>
            <div className="add-liquidity-page__steps">
                <div className="f f-ac mt-2 mb-1">
                    <div className={`add-liquidity-page__step-circle ${step1 ? "done" : ""} f f-ac f-jc`}>{step1 ? <Check stroke={"white"} strokeWidth={3} size={15} /> : "1"}</div>
                    <div className="add-liquidity-page__step-title ml-1">Select pair</div>
                </div>
                <div className="select-pair">
                    <SelectPair
                        baseCurrency={baseCurrency}
                        quoteCurrency={quoteCurrency}
                        mintInfo={mintInfo}
                        handleCurrencySwap={handleCurrencySwap}
                        handleCurrencyASelect={handleCurrencyASelect}
                        handleCurrencyBSelect={handleCurrencyBSelect}
                        handlePopularPairSelection={handlePopularPairSelection}
                    />
                </div>
                <div className="f f-ac mt-2 mb-1">
                    <div className={`add-liquidity-page__step-circle ${step2 ? "done" : ""} f f-ac f-jc`}>{step2 ? <Check stroke={"white"} strokeWidth={3} size={15} /> : "2"}</div>
                    <div className="add-liquidity-page__step-title ml-1">Select range</div>
                </div>
                <div className="select-range">
                    <SelectRange currencyA={baseCurrency} currencyB={quoteCurrency} mintInfo={mintInfo} disabled={!step1} />
                </div>
                <div className="f f-ac mt-2 mb-1">
                    <div className={`add-liquidity-page__step-circle ${step3 ? "done" : ""} f f-ac f-jc`}>{step3 ? <Check stroke={"white"} strokeWidth={3} size={15} /> : "3"}</div>
                    <div className="add-liquidity-page__step-title ml-1">Enter an amount</div>
                </div>
                <div className="enter-ammounts">
                    <EnterAmounts currencyA={baseCurrency ?? undefined} currencyB={currencyB ?? undefined} mintInfo={mintInfo} />
                </div>
                <div className="add-buttons mt-2">
                    <Stepper step={1} />
                    <AddLiquidityButton baseCurrency={baseCurrency ?? undefined} quoteCurrency={quoteCurrency ?? undefined} mintInfo={mintInfo} />
                </div>
            </div>
            {/* <div className="add-liquidity-page__stepper">
                <Stepper step={1} />
            </div> */}
        </div>
    );
}
