import { PoolStats } from "pages/NewAddLiquidity/components/PoolStats";
import { PopularPairs } from "pages/NewAddLiquidity/components/PopularPairs";
import { TokenCard } from "pages/NewAddLiquidity/components/TokenCard";
import { useCallback } from "react";
import { Plus } from "react-feather";
import "./index.scss";

export function SelectPair() {
    const popularPairs: any[] = [
        ["0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"],
        ["0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"],
        ["0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"],
        ["0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"],
    ];
    const farmings: any[] = [["0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"]];

    const fee = 0.3;
    const apr = 33;

    const handleTokenSelection = useCallback((e) => {}, []);

    return (
        <div className="select-pair-wrapper f">
            <div className="token-pairs-wrapper f c">
                <div className="f">
                    <TokenCard token={undefined} handleTokenSelection={handleTokenSelection}></TokenCard>
                    <div className="token-pairs-plus mh-1 mt-a mb-a f f-ac f-jc">
                        <Plus size={18} />
                    </div>
                    <TokenCard token={undefined} handleTokenSelection={handleTokenSelection}></TokenCard>
                </div>
                <div className="mt-1">
                    <PoolStats fee={fee} apr={apr}></PoolStats>
                </div>
            </div>
            <div className="token-pairs__popular-wrapper mh-2">
                <PopularPairs pairs={popularPairs} farmings={farmings}></PopularPairs>
            </div>
        </div>
    );
}
