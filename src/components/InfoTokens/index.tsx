import React, { useEffect, useMemo, useState } from "react";
import Loader from "../Loader";
import { useHandleSort } from "../../hooks/useHandleSort";
import { formatDollarAmount } from "../../utils/numbers";
import Percent from "../Percent";
import "./index.scss";
import { useHandleArrow } from "../../hooks/useHandleArrow";
import { TokenRow } from "./TokenRow";
import Table from "../Table";
import TableHeader from "../Table/TableHeader";
import { t, Trans } from "@lingui/macro";

interface InfoTokensProps {
    data: any;
    refreshing: boolean;
    fetchHandler: () => any;
    blocksFetched: boolean;
}

const sortFields = [
    {
        title: t`Name`,
        value: "name",
    },
    {
        title: t`Price`,
        value: "priceUSD",
    },
    {
        title: t`Price Change`,
        value: "priceUSDChange",
    },
    {
        title: t`TVL`,
        value: "tvlUSD",
    },
];

export function InfoTokens({ data, fetchHandler, blocksFetched }: InfoTokensProps) {
    const [sortField, setSortField] = useState<string>("tvlUSD");
    const [sortDirection, setSortDirection] = useState<boolean>(true);
    const [sortIndex, setSortIndex] = useState<number>(1);

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
            data.map((el: any, i: number) => {
                const token = TokenRow({ address: el.address, symbol: el.symbol, name: el.name });

                return [
                    {
                        title: token,
                        value: el.address,
                    },
                    {
                        title: formatDollarAmount(el.priceUSD, 3),
                        value: el.priceUSD,
                    },
                    // {
                    //     title: <Percent key={i} value={el.priceUSDChange} fontWeight={400} />,
                    //     value: el.priceUSDChange,
                    // },
                    {
                        title: formatDollarAmount(el.tvlUSD),
                        value: el.tvlUSD,
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
        <div style={{ overflow: "overlay" }}>
            <div className={"tokens-table-wrapper"}>
                <Table gridClass={"grid-tokens-table"} sortIndex={sortIndex} sortField={sortField} sortDirection={sortDirection} data={_data.slice(0, 8)}>
                    <TableHeader gridClass={"grid-tokens-table"} sortFields={sortFields} handleSort={() => {}} arrow={() => {}}>
                        <span className={"table-header__item"}>
                            <Trans>Name</Trans>
                        </span>
                        <span className={"table-header__item table-header__item--center"}>
                            <Trans>Price</Trans>
                        </span>
                        {/* <span className={"table-header__item table-header__item--center"}>
                            <Trans>Price Change</Trans>
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
