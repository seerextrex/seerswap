import { TokenAmountCard } from "pages/NewAddLiquidity/components/TokenAmountCard";
import { TokenRatio } from "pages/NewAddLiquidity/components/TokenRatio";
import "./index.scss";

export function EnterAmounts() {
    return (
        <div className="f">
            <div className="f c mr-2">
                <div className="mb-1">
                    <TokenAmountCard token={""} />
                </div>
                <div>
                    <TokenAmountCard token={""} />
                </div>
            </div>
            <div className="full-h">
                {/* @ts-ignore */}
                <TokenRatio token0={{ symbol: "USDC" }} token1={{ symbol: "WETH" }} token0Ratio={50} token1Ratio={50} />
            </div>
        </div>
    );
}
