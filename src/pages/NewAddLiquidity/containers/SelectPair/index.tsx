import { PoolStats } from "pages/NewAddLiquidity/components/PoolStats";
import { PopularPairs } from "pages/NewAddLiquidity/components/PopularPairs";
import { TokenCard } from "pages/NewAddLiquidity/components/TokenCard";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw } from "react-feather";

import { WrappedCurrency } from "models/types";
import { Token, Currency } from "@uniswap/sdk-core";

import "./index.scss";
import CurrencySearchModal from "components/SearchModal/CurrencySearchModal";
import { useFeeHourDataQuery } from "state/data/generated";
import { fetchLimitFarmTVL, fetchPoolsAPR } from "utils/api";
import { Pool } from "lib/src";
import { computePoolAddress } from "hooks/computePoolAddress";
import { POOL_DEPLOYER_ADDRESS } from "constants/addresses";
import { useInfoLiquidity } from "hooks/subgraph/useInfoLiquidity";

interface ISelectPair {
    baseCurrency: Currency | null | undefined;
    quoteCurrency: Currency | null | undefined;
    handleCurrencySwap: () => void;
    handleCurrencyASelect: (newCurrency: Currency) => void;
    handleCurrencyBSelect: (newCurrency: Currency) => void;
    noLiquidity: boolean | undefined;
    fee: number;
    pool: Pool | null | undefined;
    handlePopularPairSelection: (pair: [string, string]) => void;
}

export function SelectPair({ baseCurrency, quoteCurrency, handleCurrencySwap, handleCurrencyASelect, handleCurrencyBSelect, noLiquidity, fee, pool, handlePopularPairSelection }: ISelectPair) {
    const [aprs, setAprs] = useState<undefined | { [key: string]: number }>();

    const {
        fetchPopularPools: { popularPools, popularPoolsLoading, fetchPopularPoolsFn },
    } = useInfoLiquidity();

    useEffect(() => {
        fetchPoolsAPR().then(setAprs);
        fetchPopularPoolsFn();
    }, []);

    const farmings: any[] = [];

    const feeString = useMemo(() => {
        if (noLiquidity) return "0.01";

        return `${(fee / 10000).toFixed(3)}`;
    }, [fee, noLiquidity]);

    const aprString = useMemo(() => {
        if (!aprs || !baseCurrency || !quoteCurrency) return "Loading";

        const poolAddress = computePoolAddress({
            poolDeployer: POOL_DEPLOYER_ADDRESS[137],
            tokenA: baseCurrency.wrapped,
            tokenB: quoteCurrency.wrapped,
        }).toLowerCase();

        return aprs[poolAddress] ? aprs[poolAddress].toFixed(2) : "";
    }, [baseCurrency, quoteCurrency, aprs]);

    return (
        <div className="select-pair-wrapper f">
            <div className="token-pairs-wrapper f c">
                <div className="f">
                    <TokenCard currency={baseCurrency} otherCurrency={quoteCurrency} handleTokenSelection={handleCurrencyASelect}></TokenCard>
                    <div className={`token-pairs-plus ${baseCurrency && quoteCurrency ? "swap-btn" : ""} mh-1 mt-a mb-a f f-ac f-jc`}>
                        {baseCurrency && quoteCurrency && (
                            <div className="f f-ac f-jc full-wh" onClick={handleCurrencySwap}>
                                <RefreshCw size={16} />
                            </div>
                        )}
                        {(!baseCurrency || !quoteCurrency) && <Plus size={16} />}
                    </div>
                    <TokenCard currency={quoteCurrency} otherCurrency={baseCurrency} handleTokenSelection={handleCurrencyBSelect}></TokenCard>
                </div>
                <div className="mt-1">
                    <PoolStats fee={feeString} apr={aprString}></PoolStats>
                </div>
            </div>
            <div className="token-pairs__popular-wrapper mh-2">
                <PopularPairs handlePopularPairSelection={handlePopularPairSelection} pairs={popularPools} farmings={farmings}></PopularPairs>
            </div>
        </div>
    );
}
