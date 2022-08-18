import React, { useEffect, useMemo, useState } from "react";
import Loader from "../Loader";
import Table from "../Table";
import { formatDollarAmount, formatPercent } from "../../utils/numbers";
import "../Table/index.scss";
import "./index.scss";
import { NavLink } from "react-router-dom";
import { Pool } from "./PoolRow";
import { Apr } from "./AprHeader";
import { useHandleSort } from "../../hooks/useHandleSort";
import { useHandleArrow } from "../../hooks/useHandleArrow";
import TableHeader from "../Table/TableHeader";
import { t, Trans } from "@lingui/macro";

interface InfoPoolsProps {
    data: any;
    refreshing: boolean;
    fetchHandler: () => any;
    blocksFetched: boolean;
}

const sortFields = [
    {
        title: t`Pool`,
        value: "pool",
    },
    // {
    //     title: t`Volume 7D`,
    //     value: "volumeUSDWeek",
    // },
    // {
    //     title: t`Volume 1M`,
    //     value: "volumeUSDMonth",
    // },
    {
        title: t`TVL`,
        value: "tvlUSD",
    },
];

export function InfoPools({ data, fetchHandler, blocksFetched }: InfoPoolsProps) {
    const [sortField, setSortField] = useState("tvlUSD");
    const [sortIndex, setSortIndex] = useState(2);
    const [sortDirection, setSortDirection] = useState<boolean>(true);
    const handleSort = useHandleSort(sortField, sortDirection, setSortDirection, setSortField, setSortIndex);
    const arrow = useHandleArrow(sortField, sortIndex, sortDirection);

    useEffect(() => {
        if (blocksFetched) {
            fetchHandler();
        }
    }, [blocksFetched]);

    const _data = useMemo(() => {
        return (
            data &&
            data.map((el: any, i: any) => {
                const pool = Pool({ token0: el.token0, token1: el.token1, fee: el.fee, address: el.address });
                const apr = el.apr > 0 ? <span style={{ color: "var(--green)" }}>{formatPercent(el.apr)}</span> : <span>-</span>;

                return [
                    {
                        title: pool,
                        value: el.address,
                    },
                    // {
                    //     title: formatDollarAmount(el.volumeUSDWeek),
                    //     value: el.volumeUSDWeek,
                    // },
                    // {
                    //     title: formatDollarAmount(el.volumeUSDMonth),
                    //     value: el.volumeUSDMonth,
                    // },
                    {
                        title: formatDollarAmount(el.totalValueLockedUSD),
                        value: el.totalValueLockedUSD,
                    },
                ];
            })
        );
    }, [data]);

    if (!data)
        return (
            <div className={"mock-loader"}>
                <Loader stroke={"white"} size={"25px"} />
            </div>
        );

    return (
        <div style={{ overflow: "auto" }}>
            <div className={"w-100 pools-table-wrapper"}>
                <Table gridClass={"grid-pools-table"} sortIndex={sortIndex} sortDirection={sortDirection} sortField={sortField} data={_data.slice(0, 8)}>
                    <TableHeader arrow={() => {}} sortFields={sortFields} handleSort={() => {}} gridClass={"grid-pools-table"}>
                        <span className={"table-header__item"}>
                            <Trans>Pool</Trans>
                        </span>
                        {/* <span className={"table-header__item table-header__item--center"}>
                            <Trans>Volume 7D</Trans>
                        </span>
                        <span className={"table-header__item table-header__item--center"}>
                            <Trans>Volume 1M</Trans>
                        </span> */}
                        <span className={"table-header__item table-header__item--center"}>
                            <Trans>TVL</Trans>
                        </span>
                    </TableHeader>
                </Table>
            </div>
        </div>
    );
}
