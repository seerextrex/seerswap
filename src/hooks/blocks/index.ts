import { ApolloClient, NormalizedCacheObject, gql } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
// GET_BLOCK_BY_TIMESTAMP_RANGE is not directly used by splitQuery if splitQuery needs a dynamic query builder.
// import { GET_BLOCK_BY_TIMESTAMP_RANGE } from "../../utils/graphql-queries"; 
import { splitQuery } from "../../utils/queries";
import { useClients } from "../subgraph/useClients";
import { useAccount } from "wagmi";

import AlgebraConfig from "algebra.config";

const ONE_DAY_UNIX = 86400;

// This function generates a dynamic GraphQL query string for a batch of timestamps.
// It's similar to the old GET_BLOCKS function.
const buildBlocksQueryForTimestamps = (timestampsToQuery: number[]): any => {
    if (!timestampsToQuery || timestampsToQuery.length === 0) {
        // Return a valid query that yields no results
        return gql`query emptyBlocks { __typename }`;
    }
    let queryString = 'query blocks {\n';
    for (const timestamp of timestampsToQuery) {
        queryString += `  t${timestamp}: blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: {timestamp_gt: ${timestamp - ONE_DAY_UNIX}, timestamp_lt: ${timestamp + ONE_DAY_UNIX}}) {\n    number\n  }\n`;
    }
    queryString += '}';
    return gql(queryString);
};

export function useBlocksFromTimestamps(
    timestamps: number[],
    blockClientOverride?: ApolloClient<NormalizedCacheObject>
): {
    blocks:
    | {
        timestamp: string;
        number: any;
    }[]
    | undefined;
    error: boolean;
} {
    const { chain } = useAccount();
    const chainId = chain?.id;
    const [blocks, setBlocks] = useState<any>();
    const [error, setError] = useState(false);

    const { blockClient } = useClients();
    const activeBlockClient = blockClientOverride ?? blockClient;

    // derive blocks based on active network
    const networkBlocks = blocks?.[chainId ?? AlgebraConfig.CHAIN_PARAMS.chainId];

    useEffect(() => {
        async function fetchData() {
            if (timestamps && timestamps.length > 0) { // Ensure timestamps exist before querying
                const results = await splitQuery(buildBlocksQueryForTimestamps, activeBlockClient, [], timestamps);
                if (results) {
                    setBlocks({ ...(blocks ?? {}), [chainId ?? AlgebraConfig.CHAIN_PARAMS.chainId]: results });
                } else {
                    setError(true);
                }
            } else {
                // Handle empty timestamps array, perhaps set empty blocks or do nothing
                setBlocks({ ...(blocks ?? {}), [chainId ?? AlgebraConfig.CHAIN_PARAMS.chainId]: {} });
            }
        }

        if (!networkBlocks && !error) {
            fetchData();
        }
    }, [timestamps, activeBlockClient, networkBlocks, error, chainId, blocks]); // Added dependencies

    const blocksFormatted = useMemo(() => {
        if (blocks?.[chainId ?? AlgebraConfig.CHAIN_PARAMS.chainId]) {
            const currentNetworkBlocks = blocks[chainId ?? AlgebraConfig.CHAIN_PARAMS.chainId];
            const formatted: any[] = [];
            for (const t in currentNetworkBlocks) {
                if (currentNetworkBlocks[t] && currentNetworkBlocks[t].length > 0) {
                    formatted.push({
                        timestamp: t.startsWith('t') ? t.substring(1) : t, // Handle if 't' prefix is missing
                        number: currentNetworkBlocks[t][0]["number"],
                    });
                }
            }
            return formatted;
        }
        return undefined;
    }, [chainId, blocks]);

    return {
        blocks: blocksFormatted,
        error,
    };
}

export async function getBlocksFromTimestamps(
    timestamps: number[],
    blockClient: ApolloClient<NormalizedCacheObject>,
    skipCount = 500 // This skipCount is likely used by splitQuery for batch sizing
) {
    if (timestamps?.length === 0) {
        return [];
    }
    // Use the dynamic query builder with splitQuery
    const fetchedData: any = await splitQuery(buildBlocksQueryForTimestamps, blockClient, [], timestamps, skipCount);

    const resultingBlocks: any[] = [];
    if (fetchedData) {
        for (const t in fetchedData) {
            if (fetchedData[t] && fetchedData[t].length > 0) {
                resultingBlocks.push({
                    timestamp: t.startsWith('t') ? t.substring(1) : t, // Handle if 't' prefix is missing
                    number: fetchedData[t][0]["number"],
                });
            }
        }
    }
    return resultingBlocks;
}
