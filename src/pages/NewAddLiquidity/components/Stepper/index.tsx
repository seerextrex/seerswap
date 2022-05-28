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
}

export function Stepper({completedSteps, stepLinks, currencyA, currencyB, mintInfo}: IStepper) {

    // const steps = ["Select a pair", "Select a range", "Enter an amounts"];

    const steps = useMemo(() => {
        
        const _steps = stepLinks.map(el => el.title)

        if (currencyA && currencyB && completedSteps.length >= 1) {
            _steps[0] = `${currencyA.symbol} + ${currencyB.symbol}`
        } 

        if (mintInfo.lowerPrice && mintInfo.upperPrice && completedSteps.length >= 2) {
            _steps[1] = `Range: ${mintInfo.lowerPrice.toSignificant(5)} - ${mintInfo.upperPrice.toSignificant(5)}`
        }
        
        if (mintInfo.parsedAmounts.CURRENCY_A && mintInfo.parsedAmounts.CURRENCY_B && completedSteps.length >= 3) {
            _steps[2] = '21'
        }

        return _steps

    }, [completedSteps, stepLinks, currencyA, currencyB, mintInfo])

    return (
        <div className="f w-100" style={{ justifyContent: "space-between" }}>
            {steps.map((el, i) => (
                <div className="f f-ac">
                    <div className={`stepper__circle mr-1 f f-ac f-jc ${i === completedSteps.length ? 'current' : ''} ${completedSteps.length - 1 >= i ? "done" : ""} `}>{i + 1}</div>
                    <div className={`${i === completedSteps.length ? 'stepper__circle-current' : ''}`} >{el}</div>
                </div>
            ))}
        </div>
    );
}
