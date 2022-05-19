import { useMemo } from "react";
import { Token } from "@uniswap/sdk-core";
import DoubleCurrencyLogo from "../../components/DoubleLogo";
import { SupportedChainId } from "../../constants/chains";
import "./index.scss";

interface PoolInfoHeaderProps {
    token0: Token | undefined;
    token1: Token | undefined;
    fee: string;
    collectedFees: string;
}

export function PoolInfoHeader({ token0, token1, fee, collectedFees }: PoolInfoHeaderProps) {
    const poolTitle = useMemo(() => {
        if (!token1 || !token0) return [];
        if (token0.symbol === "USDC") {
            return [token1.symbol, token0.symbol];
        }
        return [token0.symbol, token1.symbol];
    }, [token0, token1]);

    return (
        <div className={"b mb-1"}>
            <div className={"flex-s-between info-pool-header"}>
                <div className={"f f-ac mxs_w-100"}>
                    <span className={"fs-15 flex-s-between ml-15"}>
                        <span className={"mr-05"}>
                            <DoubleCurrencyLogo
                                currency0={token0 && new Token(SupportedChainId.POLYGON, token0.address, 18, token0?.symbol)}
                                currency1={token1 && new Token(SupportedChainId.POLYGON, token1.address, 18, token1?.symbol)}
                                size={30}
                            />
                        </span>
                        <span className="info-pool-header__pair">
                            {poolTitle[0] || "..."} / {poolTitle[1] || "..."}
                        </span>
                    </span>
                    <span className={"ml-1 br-8 fee-badge c-p mxs_ml-a"}>{`${+fee / 10000}%`}</span>
                </div>
                {+collectedFees !== 0 && (
                    <span className={"ml-a mxs_w-100 mxs_mt-1"}>
                        Total Collected Fees: <span className={"c-p"}>${Math.round(+collectedFees) || " <0.001"}</span>
                    </span>
                )}
            </div>
            <span />
        </div>
    );
}
