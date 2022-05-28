import { Currency } from '@uniswap/sdk-core'
import { useMemo } from 'react';
import { IDerivedMintInfo } from 'state/mint/v3/hooks';

import "./index.scss";

interface IStepper {
    completedSteps: number[];
    stepLinks: { link: string, title: string }[]
    currencyA: Currency | undefined;
    currencyB: Currency | undefined;
    mintInfo: IDerivedMintInfo;
    end: boolean;
}

export function Stepper({completedSteps, stepLinks, currencyA, currencyB, mintInfo, end}: IStepper) {

    console.log(mintInfo.parsedAmounts.CURRENCY_A?.toSignificant(5), mintInfo.parsedAmounts.CURRENCY_B?.toSignificant(5))

    const steps = useMemo(() => {
        
        const _steps = stepLinks.map(el => el.title)

        if (!currencyA || !currencyB || !mintInfo) return _steps

        if (currencyA && currencyB && completedSteps.length >= 1) {
            _steps[0] = `${currencyA.symbol} + ${currencyB.symbol}`
        } 

        if (mintInfo.noLiquidity) {

            if (mintInfo.price && completedSteps.length >= 2) {
                _steps[1] = `Initial price: ${mintInfo.price.toSignificant(5)}`
            }

            if (mintInfo.lowerPrice && mintInfo.upperPrice && completedSteps.length >= 3) {
                _steps[2] = `Range: ${mintInfo.lowerPrice.toSignificant(5)} — ${mintInfo.upperPrice.toSignificant(5)}`
            }
        
            if (mintInfo.parsedAmounts.CURRENCY_A && mintInfo.parsedAmounts.CURRENCY_B && end) {
                _steps[3] = 'asdas'
            }

        } else {

            if (mintInfo.lowerPrice && mintInfo.upperPrice && completedSteps.length >= 2) {
                _steps[1] = `Range: ${mintInfo.lowerPrice.toSignificant(5)} — ${mintInfo.upperPrice.toSignificant(5)}`
            }
        
            if (mintInfo.parsedAmounts.CURRENCY_A && mintInfo.parsedAmounts.CURRENCY_B && end) {
                _steps[2] = `${mintInfo.parsedAmounts.CURRENCY_A.toSignificant(5)} ${currencyA.symbol}, ${mintInfo.parsedAmounts.CURRENCY_B.toSignificant(5)} ${currencyB.symbol}`
            }


        }

        return _steps

    }, [completedSteps, stepLinks, currencyA, currencyB, mintInfo])

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
