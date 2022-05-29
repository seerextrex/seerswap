import { Currency } from '@uniswap/sdk-core'
import { USDC_POLYGON } from 'constants/tokens';
import useUSDCPrice from 'hooks/useUSDCPrice';
import { useMemo } from 'react';
import { Bound } from 'state/mint/v3/actions';
import { IDerivedMintInfo, useActivePreset } from 'state/mint/v3/hooks';
import { Presets } from 'state/mint/v3/reducer';
import { PriceFormats } from '../PriceFomatToggler';

import "./index.scss";

interface IStepper {
    completedSteps: number[];
    stepLinks: { link: string, title: string }[]
    currencyA: Currency | undefined;
    currencyB: Currency | undefined;
    mintInfo: IDerivedMintInfo;
    end: boolean;
    priceFormat: PriceFormats
}

export function Stepper({completedSteps, stepLinks, currencyA, currencyB, mintInfo, end, priceFormat}: IStepper) {

    const baseTokenUSD = useUSDCPrice(currencyA)
    const rangeTokenUSD = useUSDCPrice(currencyB)

    const isUSD = useMemo(() => {
        return priceFormat === PriceFormats.USD
    }, [priceFormat])

    const isUSDCB = useMemo(() => {
        return currencyB && currencyB.wrapped.address === USDC_POLYGON.address
    }, [currencyB])

    const isUSDCA = useMemo(() => {
        return currencyA && currencyA.wrapped.address === USDC_POLYGON.address
    }, [currencyA])

    const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = mintInfo.pricesAtTicks;

    const isSorted = useMemo(() => {
        return currencyA && currencyB && currencyA.wrapped.sortsBefore(currencyB.wrapped);
    }, [currencyA, currencyB]);

    const leftPrice = useMemo(() => {
        return isSorted ? priceLower : priceUpper?.invert();
    }, [isSorted, priceLower, priceUpper]);

    const rightPrice = useMemo(() => {
        return isSorted ? priceUpper : priceLower?.invert();
    }, [isSorted, priceUpper, priceLower]);

    const preset = useActivePreset()

    const steps = useMemo(() => {
        
        const _steps = stepLinks.map(el => el.title)

        if (!currencyA || !currencyB || !mintInfo) return _steps

        if (currencyA && currencyB && completedSteps.length >= 1) {
            _steps[0] = `${currencyA.symbol} / ${currencyB.symbol}`
        }
        
        if (mintInfo.noLiquidity) {

            if (mintInfo.price && rangeTokenUSD && completedSteps.length >= 2) {
                _steps[1] = `Initial price: 1 ${currencyA.symbol} = ${isUSD ? '$' : ''}${isUSD ? ( (isSorted ? +mintInfo.price.toSignificant(8) : +mintInfo.price.invert().toSignificant(8)) * +rangeTokenUSD.toSignificant(8)).toFixed(4) : isSorted ? mintInfo.price.toSignificant(5) : mintInfo.price.invert().toSignificant(5)} ${isUSD ? '' : ` ${currencyB.symbol}`}`
            }

            if (mintInfo.price && !rangeTokenUSD && completedSteps.length >= 2) {
                _steps[1] = `Initial price: 1 ${currencyA.symbol} = ${isSorted ? +mintInfo.price.toSignificant(8) : +mintInfo.price.invert().toSignificant(8)} ${currencyB.symbol}`
            }

            if (leftPrice && rightPrice && completedSteps.length >= 3) {
                if (preset !== Presets.FULL) {
                    _steps[2] = `Range: ${isUSD && rangeTokenUSD ? '$ ' : ''}${isUSD && rangeTokenUSD && !isUSDCB ? (+leftPrice.toSignificant(8) * +rangeTokenUSD.toSignificant(8)).toFixed(6).slice(0, -1) : +leftPrice.toSignificant(8)} — ${isUSD && rangeTokenUSD ? '$ ' : ''}${isUSD && rangeTokenUSD && !isUSDCB ? (+leftPrice.toSignificant(8) * +rangeTokenUSD.toSignificant(8)).toFixed(6).slice(0, -1) : rightPrice.toSignificant(8)}`
                } else {
                    _steps[2] = 'Range: 0 — ∞'
                }
            }
        
            if (baseTokenUSD && rangeTokenUSD && mintInfo.parsedAmounts.CURRENCY_A && mintInfo.parsedAmounts.CURRENCY_B && end) {
                
                const parsedA = Number(mintInfo.parsedAmounts.CURRENCY_A.toSignificant(5))
                const parsedB = Number(mintInfo.parsedAmounts.CURRENCY_B.toSignificant(5))

                let tokenA
                let tokenB

                if (isUSD) {

                    const tokenAUSD = Number(baseTokenUSD.toSignificant(5))
                    const tokenBUSD = Number(rangeTokenUSD.toSignificant(5))

                    tokenA = isUSDCA ? parsedA : parsedA * tokenAUSD
                    tokenB = isUSDCB ? parsedB : parsedB * tokenBUSD

                    _steps[3] = `$ ${tokenA + tokenB}`

                } else {
                    tokenA = parsedA
                    tokenB = parsedB

                    _steps[3] = `${tokenA} ${currencyA.symbol}, ${tokenB} ${currencyB.symbol}`

                }

            }

        } else {

            if (leftPrice && rightPrice && completedSteps.length >= 2) {
                if (preset !== Presets.FULL) {
                    _steps[1] = `Range: ${isUSD ? '$ ' : ''}${isUSD && rangeTokenUSD && !isUSDCB ? (+leftPrice.toSignificant(8) * +rangeTokenUSD.toSignificant(8)).toFixed(6).slice(0, -1) : Number(leftPrice.toSignificant(8)).toFixed(4)} — ${isUSD ? '$ ' : ''}${isUSD && rangeTokenUSD && !isUSDCB ? (+rightPrice.toSignificant(8) * +rangeTokenUSD.toSignificant(8)).toFixed(6).slice(0, -1) : Number(rightPrice.toSignificant(8)).toFixed(4)}`
                } else {
                    _steps[1] = 'Range: 0 — ∞'
                }
            }
        
            if (baseTokenUSD && rangeTokenUSD && mintInfo.parsedAmounts.CURRENCY_A && mintInfo.parsedAmounts.CURRENCY_B && end) {
                
                const parsedA = Number(mintInfo.parsedAmounts.CURRENCY_A.toSignificant(5))
                const parsedB = Number(mintInfo.parsedAmounts.CURRENCY_B.toSignificant(5))

                let tokenA
                let tokenB

                if (isUSD) {

                    const tokenAUSD = Number(baseTokenUSD.toSignificant(5))
                    const tokenBUSD = Number(rangeTokenUSD.toSignificant(5))

                    tokenA = isUSDCA ? parsedA : parsedA * tokenAUSD
                    tokenB = isUSDCB ? parsedB : parsedB * tokenBUSD

                    _steps[2] = `$ ${tokenA + tokenB}`

                } else {
                    tokenA = parsedA
                    tokenB = parsedB

                    _steps[2] = `${tokenA} ${currencyA.symbol}, ${tokenB} ${currencyB.symbol}`

                }

            }


        }

        return _steps

    }, [completedSteps, stepLinks, currencyA, currencyB, mintInfo, isUSD, rangeTokenUSD])

    return (
        <div className="f w-100" style={{ justifyContent: "space-between" }}>
            {steps.map((el, i) => (
                <div className="f f-ac">
                    <div className={`stepper__circle mr-1 f f-ac f-jc ${i === completedSteps.length && !end ? 'current' : ''} ${completedSteps.length - 1 >= i || end ? "done" : ""} `}>{i + 1}</div>
                    <div className={`${i === completedSteps.length && !end ? 'stepper__circle-current' : ''}`} >{el}</div>
                </div>
            ))}
        </div>
    );
}
