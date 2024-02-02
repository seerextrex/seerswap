import React, { useEffect, useMemo, useState } from "react";
import Loader from "../Loader";
import Table from "../Table";
import { formatDollarAmount, formatPercent } from "../../utils/numbers";
import "../Table/index.scss";
import "./index.scss";
import { Pool } from "./PoolRow";
import { Apr } from "./AprHeader";
import { useHandleSort } from "../../hooks/useHandleSort";
import { useHandleArrow } from "../../hooks/useHandleArrow";
import TableHeader from "../Table/TableHeader";
import { t, Trans } from "@lingui/macro";
import { ExternalLink } from "react-feather";

const MERKL_GNOSIS_CHAIN_URL = "https://merkl.angle.money/?times=active%2Cfuture%2C&phrase=&chains=100%2C";

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
    {
        title: t`TVL`,
        value: "tvlUSD",
    },
    {
        title: t`Volume 7D`,
        value: "volumeUSDWeek",
    },
    {
        title: t`Volume 24H`,
        value: "volumeUSD",
    },
    // {
    //     title: t`Volume 1M`,
    //     value: "volumeUSDMonth",
    // },
    // {
    //     title: t`Txs 24H`,
    //     value: "txCount",
    // },
    {
        title: t`🚀 APR`,
        value: "apr",
    },
    {
        title: t`🔥 Farming`,
        value: "farmingApr",
    },
];

export function InfoPools({ data, fetchHandler, blocksFetched }: InfoPoolsProps) {
    const [sortField, setSortField] = useState("tvlUSD");
    const [sortIndex, setSortIndex] = useState(1);
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
                const farming =
                    el.farmingApr > 0 ? (
                        <>
                            <a
                                href={MERKL_GNOSIS_CHAIN_URL}
                                target="_blank"
                                data-apr={el.farmingApr > 0}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <span style={{ color: "var(--green)", marginRight: "5px" }}>{formatPercent(el.farmingApr)}</span> <ExternalLink size={16} color={"var(--green)"} />
                            </a>
                        </>
                    ) : (
                        <span>-</span>
                    );

                return [
                    {
                        title: pool,
                        value: el.address,
                    },

                    {
                        title: formatDollarAmount(el.tvlUSD),
                        value: el.tvlUSD,
                    },
                    {
                        title: formatDollarAmount(el.volumeUSDWeek),
                        value: el.volumeUSDWeek,
                    },
                    {
                        title: formatDollarAmount(el.volumeUSD),
                        value: el.volumeUSD,
                    },
                    {
                        title: apr,
                        value: el.apr,
                    },
                    {
                        title: farming,
                        value: el.farmingApr,
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
                <Table gridClass={"grid-pools-table"} sortIndex={sortIndex} sortDirection={sortDirection} sortField={sortField} data={_data}>
                    <TableHeader arrow={arrow} sortFields={sortFields} handleSort={handleSort} gridClass={"grid-pools-table"}>
                        <span className={"table-header__item"}>
                            <Trans>Pool</Trans>
                        </span>
                        <span className={"table-header__item table-header__item--center"}>
                            <Trans>TVL</Trans>
                        </span>
                        <span className={"table-header__item table-header__item--center"}>
                            <Trans>Volume 7D</Trans>
                        </span>
                        <span className={"table-header__item table-header__item--center"}>
                            <Trans>Volume 24H</Trans>
                        </span>
                        <span className={"table-header__item table-header__item--center"}>
                            <Apr />
                        </span>
                        <span className={"table-header__item table-header__item--center"}>
                            <Trans>🔥 Farming</Trans>
                        </span>
                    </TableHeader>
                </Table>
            </div>
        </div>
    );
}
