import { Trans } from "@lingui/macro";
import { Currency } from "@uniswap/sdk-core";
import { Divide } from "react-feather";

import "./index.scss";

interface ITokenRatio {
    currencyA: Currency | null | undefined;
    currencyB: Currency | null | undefined;
    token0Ratio: string;
    token1Ratio: string;
}

export function TokenRatio({ currencyA, currencyB, token0Ratio, token1Ratio }: ITokenRatio) {
    console.log(token0Ratio, token1Ratio);
    return (
        <div className={"preset-ranges-wrapper pl-1"}>
            <div className="mb-1 f f-ac">
                <Divide style={{ display: "block", fill: "currentcolor" }} size={15} />
                <span className="ml-05">
                    <Trans>Token ratio</Trans>
                </span>
            </div>
            <div className="f full-h pos-r">
                <div className="token-ratio full-h f" style={{ width: "280px", height: "20px", borderRadius: "8px", background: "grey" }}>
                    <div className="token-ratio__part full-h" style={{ width: `${token0Ratio}%`, background: "#707eff", borderRadius: "8px 0 0 8px" }}></div>
                    <div className="token-ratio__part full-h" style={{ width: `${token1Ratio}%`, background: "#ec92ff", borderRadius: "0 8px 8px 0" }}></div>
                </div>
            </div>
            <div className="mt-1">
                <div className="f mb-1">
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#707eff" }}></div>
                    <div className="ml-05">{currencyA?.symbol}</div>
                    <div className="ml-a">{`${token0Ratio}%`}</div>
                </div>
                <div className="f">
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#ec92ff" }}></div>
                    <div className="ml-05">{currencyB?.symbol}</div>
                    <div className="ml-a">{`${token1Ratio}%`}</div>
                </div>
            </div>
        </div>
    );
}
