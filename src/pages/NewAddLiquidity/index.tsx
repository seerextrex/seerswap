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
            <div className="select-pair">
                <SelectPair />
            </div>
            <div className="select-range">
                <SelectRange />
            </div>
            <div className="enter-ammounts">
                <EnterAmounts />
            </div>
            <div className="stepper">
                <Stepper step={1} />
            </div>
        </div>
    );
}
