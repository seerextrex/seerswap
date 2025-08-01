import { useEffect, useState } from "react";
import { usePublicClient, useAccount } from "wagmi";
import AlgebraConfig from "algebra.config"; // For default chainId

// Constants for block calculation on Gnosis
const ONE_DAY_UNIX = 86400;
const GNOSIS_AVG_BLOCKS_PER_DAY = 16589;

// ApolloClient, gql, splitQuery, useClients, and buildBlocksQueryForTimestamps are no longer needed by useBlocksFromTimestamps

export function useBlocksFromTimestamps(
    timestamps: number[]
): {
    blocks:
    | {
        timestamp: string;
        number: number;
    }[]
    | undefined;
    error: boolean;
    // Consider adding a loading state if consumers need it
    // loading: boolean; 
} {
    const { chain } = useAccount();
    const currentChainId = chain?.id ?? AlgebraConfig.CHAIN_PARAMS.chainId;
    const publicClient = usePublicClient({ chainId: currentChainId });

    const [calculatedBlocks, setCalculatedBlocks] = useState<Array<{ timestamp: string; number: number }> | undefined>(undefined);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (timestamps.length === 0) {
            setCalculatedBlocks([]);
            setLoading(false);
            setError(false);
            return;
        }

        if (!publicClient) {
            setLoading(true);
            // We need publicClient to proceed. If it's not available, we wait.
            // setError(true) could be an option if it's expected to be available immediately.
            return;
        }

        async function calculateBlockNumbers() {
            if (!publicClient) {
                // Should ideally not happen if the outer effect guard is working,
                // but this satisfies TS and ensures safety.
                setError(true);
                setLoading(false);
                setCalculatedBlocks(undefined);
                return;
            }
            setLoading(true);
            setError(false);

            try {
                const currentBlockNumberBigInt = await publicClient.getBlockNumber();
                const currentBlockNumber = Number(currentBlockNumberBigInt);
                const nowTimestamp = Math.floor(Date.now() / 1000);

                const newBlocks = timestamps.map(targetTimestamp => {
                    const secondsAgo = nowTimestamp - targetTimestamp;
                    // blocksToSubtract will be negative if targetTimestamp is in the future,
                    // leading to an estimated future block number.
                    const blocksToSubtract = (secondsAgo / ONE_DAY_UNIX) * GNOSIS_AVG_BLOCKS_PER_DAY;
                    const estimatedBlock = currentBlockNumber - Math.floor(blocksToSubtract);

                    return {
                        timestamp: targetTimestamp.toString(),
                        number: estimatedBlock,
                    };
                });

                setCalculatedBlocks(newBlocks);
            } catch (e) {
                console.error("Failed to fetch current block number or calculate blocks:", e);
                setError(true);
                setCalculatedBlocks(undefined);
            } finally {
                setLoading(false);
            }
        }

        calculateBlockNumbers();
    }, [timestamps, publicClient, currentChainId]);

    return {
        blocks: calculatedBlocks,
        error,
        // loading, // Expose loading state if needed by consumers
    };
}

/*
// The old getBlocksFromTimestamps function and its helper buildBlocksQueryForTimestamps relied on GraphQL.
// They are commented out as the primary hook is now refactored.
// If getBlocksFromTimestamps is still needed, it requires its own refactoring
// to use a similar calculation method or accept a PublicClient.

import { ApolloClient, NormalizedCacheObject, gql } from "@apollo/client";
import { splitQuery } from "../../utils/queries";

const buildBlocksQueryForTimestamps = (timestampsToQuery: number[]): any => {
    if (!timestampsToQuery || timestampsToQuery.length === 0) {
        return gql`query emptyBlocks { __typename }`;
    }
    let queryString = 'query blocks {\\n';
    for (const timestamp of timestampsToQuery) {
        queryString += `  t${timestamp}: blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: {timestamp_lte: ${timestamp}}) {\\n    number\\n  }\\n`;
    }
    queryString += '}';
    return gql(queryString);
};

export async function getBlocksFromTimestamps(
    timestamps: number[],
    blockClient: ApolloClient<NormalizedCacheObject>, 
    skipCount = 500 
) {
    if (timestamps?.length === 0) {
        return [];
    }
    const fetchedData: any = await splitQuery(buildBlocksQueryForTimestamps, blockClient, [], timestamps, skipCount);

    const resultingBlocks: any[] = [];
    if (fetchedData) {
        for (const t in fetchedData) {
            if (fetchedData[t] && fetchedData[t].length > 0) {
                resultingBlocks.push({
                    timestamp: t.startsWith('t') ? t.substring(1) : t,
                    number: fetchedData[t][0]["number"],
                });
            }
        }
    }
    return resultingBlocks;
}
*/
