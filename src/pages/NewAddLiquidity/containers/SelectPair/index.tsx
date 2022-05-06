import { PoolStats } from "pages/NewAddLiquidity/components/PoolStats";
import { PopularPairs } from "pages/NewAddLiquidity/components/PopularPairs";
import { TokenCard } from "pages/NewAddLiquidity/components/TokenCard";
import { useCallback } from "react";
import "./index.scss";

export function SelectPair() {
    const popularPairs: any[] = [];
    const farmings: any[] = [];

    const fee = 0.3;
    const apr = 33;

    const handleTokenSelection = useCallback((e) => {}, []);

    return (
        <div className="select-pair-wrapper">
            <div className="token-pairs-wrapper f">
                <TokenCard token={undefined} handleTokenSelection={handleTokenSelection}></TokenCard>
                <div>PLUS</div>
                <TokenCard token={undefined} handleTokenSelection={handleTokenSelection}></TokenCard>
                <PoolStats fee={fee} apr={apr}></PoolStats>
            </div>
            <PopularPairs pairs={popularPairs} farmings={farmings}></PopularPairs>
        </div>
    );
}
