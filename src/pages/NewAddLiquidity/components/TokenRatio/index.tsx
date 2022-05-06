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
        <div className="f">
            <div></div>
            <div>
                <div>
                    <div>{token0.symbol}</div>
                    <div>{token0Ratio}</div>
                </div>
                <div>
                    <div>{token1.symbol}</div>
                    <div>{token1Ratio}</div>
                </div>
            </div>
        </div>
    );
}
