import React, { useEffect, useMemo, useState } from "react";
import AutoColumn from "../../shared/components/AutoColumn";
import { DataRow } from "./DataRow";
import PageButtons from "./PageButtons";

const MAX_ITEMS = 10;

interface TableBodyProps {
    data: any;
    maxItems: number;
    sortField: string;
    sortIndex: number;
    sortDirection: boolean;
    gridClass: string;
    header: any;
}

const TableBody = ({ data, maxItems = MAX_ITEMS, sortField, sortIndex, sortDirection, gridClass, header }: TableBodyProps) => {
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);

    useEffect(() => {
        let extraPages = 1;
        if (data.length % maxItems === 0) {
            extraPages = 0;
        }
        setMaxPage(Math.floor(data.length / maxItems) + extraPages);
    }, [maxItems, data]);

    const sortedPools = useMemo(() => {
        if (!Array.isArray(data)) return [];

        return data
            ? data
                  .sort((a, b) => {
                      if (a && b) {
                          return +a[sortIndex].value > +b[sortIndex].value ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1;
                      } else {
                          return -1;
                      }
                  })
                  .slice(maxItems * (page - 1), page * maxItems)
            : [];
    }, [maxItems, page, data, sortDirection, sortField, sortIndex]);

    return (
        <>
            {sortedPools.length > 0 ? (
                <AutoColumn gap={"0"}>
                    {sortedPools.map((poolData, i) => poolData && <DataRow data={poolData} key={i} grid={gridClass} header={header.props.children} rowId={(page - 1) * MAX_ITEMS + (i + 1)} />)}
                    <PageButtons page={page} maxPage={maxPage} setPage={setPage} />
                </AutoColumn>
            ) : null}
        </>
    );
};

export default TableBody;
