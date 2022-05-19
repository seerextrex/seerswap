import { RouteComponentProps } from "react-router-dom";
import { Stepper } from "./components/Stepper";
import { EnterAmounts } from "./containers/EnterAmounts";
import { SelectPair } from "./containers/SelectPair";
import { SelectRange } from "./containers/SelectRange";

import "./index.scss";

export function NewAddLiquidityPage({
    match: {
        params: { currencyIdA, currencyIdB },
    },
    history,
}: RouteComponentProps<{
    currencyIdA?: string;
    currencyIdB?: string;
}>) {
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
                    <SelectPair />
                </div>
                <div className="f f-ac mt-2 mb-1">
                    <div className="add-liquidity-page__step-circle f f-ac f-jc">2</div>
                    <div className="add-liquidity-page__step-title ml-1">Select range</div>
                </div>
                <div className="select-range">
                    <SelectRange />
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
            <div className="add-liquidity-page__stepper">
                <Stepper step={1} />
            </div>
        </div>
    );
}
