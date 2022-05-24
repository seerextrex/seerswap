import { Trans } from "@lingui/macro";
import { DollarSign } from "react-feather";
import "./index.scss";

export function USDPrices() {
    return (
        <div className={"preset-ranges-wrapper pl-1 mb-2"}>
            <div className="mb-1 f f-ac">
                <DollarSign style={{ display: "block" }} size={15} />
                <span className="ml-05">
                    <Trans>USD Prices</Trans>
                </span>
            </div>
            <div>
                <div className="mb-05">1 ALGB = $0.212</div>
                <div>1 ALGB = $0.212</div>
            </div>
        </div>
    );
}
