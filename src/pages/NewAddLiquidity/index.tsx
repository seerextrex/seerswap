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

import { Currency } from "@uniswap/sdk-core";

import "./index.scss";
import { WMATIC_EXTENDED } from "constants/tokens";
import { Bound } from "state/mint/v3/actions";
import LiquidityChartRangeInput from "components/LiquidityChartRangeInput";

export function NewAddLiquidityPage({
    match: {
        params: { currencyIdA, currencyIdB },
    },
    history,
}: RouteComponentProps<{
    currencyIdA?: string;
    currencyIdB?: string;
}>) {
    const { account, chainId, library } = useActiveWeb3React();

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

    // mint state

    const { independentField, typedValue, startPriceTypedValue } = useV3MintState();

    // const { position: existingPositionDetails, loading: positionLoading } = useV3PositionFromTokenId(tokenId ? BigNumber.from(tokenId) : undefined);
    // const hasExistingPosition = !!existingPositionDetails && !positionLoading;
    // const { position: existingPosition } = useDerivedPositionInfo(existingPositionDetails);

    // const prevExistingPosition = usePrevious(existingPosition);

    // const _existingPosition = useMemo(() => {
    //     if (!existingPosition && prevExistingPosition) {
    //         return {
    //             ...prevExistingPosition,
    //         };
    //     }
    //     return {
    //         ...existingPosition,
    //     };
    // }, [existingPosition, baseCurrency, quoteCurrency]);

    //@ts-ignore
    const derivedMintInfo = useV3DerivedMintInfo(baseCurrency ?? undefined, quoteCurrency ?? undefined, feeAmount, baseCurrency ?? undefined, {});
    const prevDerivedMintInfo = usePrevious({ ...derivedMintInfo });

    const {
        pool,
        ticks,
        dependentField,
        price,
        pricesAtTicks,
        parsedAmounts,
        currencyBalances,
        position,
        noLiquidity,
        currencies,
        errorMessage,
        invalidRange,
        outOfRange,
        depositADisabled,
        depositBDisabled,
        invertPrice,
        ticksAtLimit,
        dynamicFee,
    } = useMemo(() => {
        if ((!derivedMintInfo.pool || !derivedMintInfo.price || derivedMintInfo.noLiquidity) && prevDerivedMintInfo) {
            return {
                ...prevDerivedMintInfo,
            };
        }
        return {
            ...derivedMintInfo,
        };
    }, [derivedMintInfo, baseCurrency, quoteCurrency]);

    const { onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, onStartPriceInput } = useV3MintActionHandlers(noLiquidity);

    const handleCurrencySelect = useCallback(
        (currencyNew: Currency, currencyIdOther?: string): (string | undefined)[] => {
            const currencyIdNew = currencyId(currencyNew, chainId || 137);

            let chainSymbol;

            if (chainId === 137) {
                chainSymbol = "MATIC";
            }

            if (currencyIdNew === currencyIdOther) {
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

    const handlePopularPairSelection = useCallback((pair: [string, string]) => {
        history.push(`/new-add/${pair[0]}/${pair[1]}`);
    }, []);

    // get value and prices at ticks
    const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks;
    const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks;

    const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper, getSetFullRange } = useRangeHopCallbacks(
        baseCurrency ?? undefined,
        quoteCurrency ?? undefined,
        dynamicFee,
        tickLower,
        tickUpper,
        pool
    );

    return (
        <div className="add-liquidity-page">
            <div className="add-liquidity-page__header f">
                <span className="add-liquidity-page__header-title">Add liquidity</span>
                <span className="ml-a">
                    <span className="mr-1">Price in</span>
                    <span>Settings</span>
                </span>
            </div>
            <div className="add-liquidity-page__steps">
                <div className="f f-ac mt-2 mb-1">
                    <div className="add-liquidity-page__step-circle f f-ac f-jc">1</div>
                    <div className="add-liquidity-page__step-title ml-1">Select pair</div>
                </div>
                <div className="select-pair">
                    <SelectPair
                        baseCurrency={baseCurrency}
                        quoteCurrency={quoteCurrency}
                        handleCurrencyASelect={handleCurrencyASelect}
                        handleCurrencyBSelect={handleCurrencyBSelect}
                        fee={dynamicFee}
                        noLiquidity={noLiquidity}
                        pool={pool}
                        handlePopularPairSelection={handlePopularPairSelection}
                    />
                </div>
                <div className="f f-ac mt-2 mb-1">
                    <div className="add-liquidity-page__step-circle f f-ac f-jc">2</div>
                    <div className="add-liquidity-page__step-title ml-1">Select range</div>
                </div>
                <div className="select-range">
                    <SelectRange
                        priceLower={priceLower}
                        priceUpper={priceUpper}
                        getDecrementLower={getDecrementLower}
                        getIncrementLower={getIncrementLower}
                        getDecrementUpper={getDecrementUpper}
                        getIncrementUpper={getIncrementUpper}
                        onLeftRangeInput={onLeftRangeInput}
                        onRightRangeInput={onRightRangeInput}
                        currencyA={baseCurrency}
                        currencyB={quoteCurrency}
                        feeAmount={dynamicFee}
                        ticksAtLimit={ticksAtLimit}
                        initial={!!noLiquidity}
                        disabled={!startPriceTypedValue && !price}
                        noLiquidity={noLiquidity}
                        price={price}
                        invertPrice={invertPrice}
                    />
                </div>
                <div className="f f-ac mt-2 mb-1">
                    <div className="add-liquidity-page__step-circle f f-ac f-jc">3</div>
                    <div className="add-liquidity-page__step-title ml-1">Enter an amount</div>
                </div>
                <div className="enter-ammounts">
                    <EnterAmounts />
                </div>
                <div className="add-buttons mt-2">
                    <button>Add liquidity</button>
                </div>
            </div>
            {/* <div className="add-liquidity-page__stepper">
                <Stepper step={1} />
            </div> */}
        </div>
    );
}
