import { RouteComponentProps } from "react-router-dom";
import { Stepper } from "./components/Stepper";
import { EnterAmounts } from "./containers/EnterAmounts";
import { SelectPair } from "./containers/SelectPair";
import { SelectRange } from "./containers/SelectRange";
import { LiquidityToolbar } from "./containers/LiquidityToolbar";

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
            <div className="add-liquidity-page__title">Add liquidity</div>
            <div className="add-liquidity-page__toolbar">
                <LiquidityToolbar></LiquidityToolbar>
            </div>
            <div className="add-liquidity-page__steps">
                <div className="f f-ac mv-1">
                    <div className="f f-ac f-jc" style={{ borderRadius: "50%", width: "25px", height: "25px", background: "blue" }}>
                        1
                    </div>
                    <div className="ml-1">Select pair</div>
                </div>
                <div className="select-pair">
                    <SelectPair />
                </div>
                <div className="f f-ac mv-1">
                    <div className="f f-ac f-jc" style={{ borderRadius: "50%", width: "25px", height: "25px", background: "blue" }}>
                        2
                    </div>
                    <div className="ml-1">Select range</div>
                </div>
                <div className="select-range">
                    <SelectRange />
                </div>
                <div className="f f-ac mv-1">
                    <div className="f f-ac f-jc" style={{ borderRadius: "50%", width: "25px", height: "25px", background: "blue" }}>
                        3
                    </div>
                    <div className="ml-1">Enter an amount</div>
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
