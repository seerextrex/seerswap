import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { StatCard } from "./StatCard";
import "./index.scss";
import { t, Trans } from "@lingui/macro";
import { AlertCircle } from "react-feather";

interface InfoTotalStatsProps {
    data: any;
    isLoading: boolean;
    refreshHandler: any;
    blocksFetched: boolean;
    poolsStat: any;
}

export function InfoTotalStats({ data, isLoading, refreshHandler, blocksFetched, poolsStat }: InfoTotalStatsProps) {
    const { pathname } = useLocation();

    useEffect(() => {
        if (blocksFetched) {
        refreshHandler();
        }
    }, [blocksFetched]);

    const pool = useMemo(() => pathname.split("pools/")[1], [pathname]);

    const _data = useMemo(() => {
        if (pool) {
            let res = {
                tvlUSD: undefined,
                volumeUSD: undefined,
                txCount: undefined,
                volumeUSDMonth: undefined
            };
            poolsStat?.forEach((item: any) => {
                if (item.address.toLowerCase() === pool.toLowerCase()) {
                    res = {
                        tvlUSD: item.tvlUSD,
                        volumeUSD: item.volumeUSD,
                        volumeUSDMonth: item.volumeUSDMonth,
                        txCount: item.txCount
                    };
                }
            });
            return res;
        }
        return {
            tvlUSD: data?.tvlUSD,
            volumeUSD: data?.volumeUSD,
            volumeUSDMonth: data?.volumeUSDMonth,
            txCount: data?.txCount
        };
    }, [data, poolsStat, pool]);

    return (
        <div>
            <div className={"total-stats-wrapper"}>
                <StatCard isLoading={isLoading} data={_data?.tvlUSD} title={t`Total Value Locked`} format style={"ms_m-0 mxs_m-0"} />
                <StatCard isLoading={isLoading} data={_data?.volumeUSD} title={t`Volume 24H`} format style={"ml-1 ms_m-0 mxs_m-0"} />
                <StatCard isLoading={isLoading} data={_data?.volumeUSDMonth} title={t`Volume 1M`} format style={"ml-1 ms_m-0 mxs_m-0"} />
                <StatCard isLoading={isLoading} data={_data?.txCount} title={t`Transactions 24H`} style={"ml-1 ms_m-0 mxs_m-0"} />
            </div>
        </div>
    );
}
