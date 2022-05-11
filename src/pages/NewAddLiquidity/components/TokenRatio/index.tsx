import { Token } from "@uniswap/sdk-core";

import "./index.scss";

interface ITokenRatio {
    token0: Token;
    token1: Token;
    token0Ratio: number;
    token1Ratio: number;
}

export function TokenRatio({ token0, token1, token0Ratio, token1Ratio }: ITokenRatio) {
    return (
        <div className="f full-h pos-r">
            <div className="full-h" style={{ width: "40px", height: "280px", borderRadius: "8px", background: "grey" }}>
                <div className="full-w" style={{ height: "50%", background: "blue", borderRadius: "6px 6px 0 0" }}></div>
                <div className="full-w" style={{ height: "50%", background: "cyan", borderRadius: "0 0 6px 6px" }}></div>
            </div>
            <div className="ml-05">
                <div>
                    <div>{token0.symbol}</div>
                    <div>{token0Ratio}%</div>
                </div>
                <div style={{ position: "absolute", top: "50%" }}>
                    <div>{token1.symbol}</div>
                    <div>{token1Ratio}%</div>
                </div>
            </div>
        </div>
    );
}
