import { Trans } from "@lingui/macro";
import { Token } from "@uniswap/sdk-core";
import { Divide } from "react-feather";

import "./index.scss";

interface ITokenRatio {
    token0: Token;
    token1: Token;
    token0Ratio: number;
    token1Ratio: number;
}

export function TokenRatio({ token0, token1, token0Ratio, token1Ratio }: ITokenRatio) {
    return (
        <div className={"preset-ranges-wrapper pl-1"}>
            <div className="mb-1 f f-ac">
                <Divide style={{ display: "block", fill: "currentcolor" }} size={15} />
                <span className="ml-05">
                    <Trans>Token ratio</Trans>
                </span>
            </div>
            <div className="f full-h pos-r">
                <div className="full-h f" style={{ width: "280px", height: "20px", borderRadius: "8px", background: "grey" }}>
                    <div className="full-h" style={{ width: "30%", background: "#707eff", borderRadius: "8px 0 0 8px" }}></div>
                    <div className="full-h" style={{ width: "70%", background: "#ec92ff", borderRadius: "0 8px 8px 0" }}></div>
                </div>
                {/* <div className="ml-05">
                    <div>
                        <div>{token0.symbol}</div>
                        <div>{token0Ratio}%</div>
                    </div>
                    <div style={{ position: "absolute", top: "50%" }}>
                        <div>{token1.symbol}</div>
                        <div>{token1Ratio}%</div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}
