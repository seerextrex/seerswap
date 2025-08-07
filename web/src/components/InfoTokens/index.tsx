import React, { useEffect, useMemo, useState } from "react";
import Loader from "../Loader";
import { useHandleSort } from "../../hooks/useHandleSort";
import { formatDollarAmount } from "../../utils/numbers";
import Percent from "../Percent";
import "./index.scss";
import { useHandleArrow } from "../../hooks/useHandleArrow";
import { TokenRow } from "./TokenRow";
import { EnhancedTokenRow } from "./EnhancedTokenRow";
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
        title: t`Volume 24H`,
        value: "volumeUSD",
    },
    {
        title: t`TVL`,
        value: "tvlUSD",
    },
];

export function InfoTokens({ data, fetchHandler, blocksFetched }: InfoTokensProps) {
    const [sortField, setSortField] = useState<string>("tvlUSD");
    const [sortDirection, setSortDirection] = useState<boolean>(true);
    const [sortIndex, setSortIndex] = useState<number>(4);

    const handleSort = useHandleSort(sortField, sortDirection, setSortDirection, setSortField, setSortIndex);
    const arrow = useHandleArrow(sortField, sortIndex, sortDirection);

    useEffect(() => {
        if (blocksFetched) {
            fetchHandler();
        }
    }, [blocksFetched]);

    // Find sDAI token price
    const sdaiPrice = useMemo(() => {
        if (!data) return null;
        const sdaiToken = data.find((token: any) => 
            token.address?.toLowerCase() === "0xaf204776c7245bf4147c2612bf6e5972ee483701" ||
            token.symbol?.toLowerCase() === "sdai"
        );
        return sdaiToken?.priceUSD || null;
    }, [data]);

    const _data = useMemo(() => {
        return (
            data &&
            data.map((el: any, i: number) => {
                const token = <EnhancedTokenRow 
                    address={el.address} 
                    symbol={el.symbol} 
                    name={el.name}
                    market={el.market}
                />;

                // Calculate price in sDAI
                const priceInSdai = sdaiPrice && el.priceUSD ? el.priceUSD / sdaiPrice : el.priceUSD;
                
                // Special case for sDAI itself - show USD value
                const isSdai = el.address?.toLowerCase() === "0xaf204776c7245bf4147c2612bf6e5972ee483701" || 
                               el.symbol?.toLowerCase() === "sdai";
                
                const priceDisplay = isSdai 
                    ? formatDollarAmount(el.priceUSD, 3)
                    : (sdaiPrice ? `${(priceInSdai || 0).toFixed(4)} sDAI` : formatDollarAmount(el.priceUSD, 3));

                return [
                    {
                        title: token,
                        value: el.address,
                    },
                    {
                        title: priceDisplay,
                        value: priceInSdai || el.priceUSD,
                    },
                    {
                        title: <Percent key={i} value={el.priceUSDChange} fontWeight={400} />,
                        value: el.priceUSDChange,
                    },
                    {
                        title: formatDollarAmount(el.volumeUSD),
                        value: el.volumeUSD,
                    },
                    {
                        title: formatDollarAmount(el.tvlUSD),
                        value: el.tvlUSD,
                    },
                ];
            })
        );
    }, [data, sdaiPrice]);

    if (!data)
        return (
            <div className={"mock-loader"}>
                <Loader stroke={"white"} size={"25px"} />
            </div>
        );
    return (
        <div style={{ overflow: "overlay" }}>
            <div className={"tokens-table-wrapper"}>
                <Table gridClass={"grid-tokens-table"} sortIndex={sortIndex} sortField={sortField} sortDirection={sortDirection} data={_data}>
                <TableHeader gridClass={"grid-tokens-table"} sortFields={sortFields} handleSort={handleSort} arrow={arrow}>
                        <span className={"table-header__item"}>
                            <Trans>Name</Trans>
                        </span>
                        <span className={"table-header__item table-header__item--center"}>
                            <Trans>Price</Trans>
                        </span>
                        <span className={"table-header__item table-header__item--center"}>
                            <Trans>Price Change</Trans>
                        </span>
                        <span className={"table-header__item table-header__item--center"}>
                            <Trans>Volume 24H</Trans>
                        </span>
                        <span className={"table-header__item table-header__item--center"}>
                            <Trans>TVL</Trans>
                        </span>
                    </TableHeader>
                </Table>
            </div>
        </div>
    );
}
