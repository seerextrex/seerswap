import { TokenAmountCard } from "pages/NewAddLiquidity/components/TokenAmountCard";
import { TokenRatio } from "pages/NewAddLiquidity/components/TokenRatio";
import "./index.scss";

export function EnterAmounts() {
    return (
        <div className="f">
            <div className="f c">
                <div className="mb-1" style={{ overflow: "hidden", borderRadius: "8px" }}>
                    <TokenAmountCard token={""} approved={true} disabled={true} />
                </div>
                <div>
                    <TokenAmountCard token={""} approved={false} disabled={false} />
                </div>
            </div>
            <div className="full-h ml-2">
                {/* @ts-ignore */}
                <TokenRatio token0={{ symbol: "USDC" }} token1={{ symbol: "WETH" }} token0Ratio={50} token1Ratio={50} />
            </div>
        </div>
    );
}
