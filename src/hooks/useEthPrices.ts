import { useBlocksFromTimestamps } from "./blocks";
import { useDeltaTimestamps } from "../utils/queries";
import { useEffect, useMemo, useState } from "react";
import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import { useClients } from "./subgraph/useClients";
import { useAccount } from "wagmi";

import AlgebraConfig from "algebra.config";

export interface EthPrices {
    current: number;
    oneDay: number;
    twoDay: number;
    oneWeek: number;
}

async function fetchEthPrices(blocks: [number, number, number, number], client: ApolloClient<NormalizedCacheObject>): Promise<{ data: EthPrices | undefined; error: boolean }> {
    try {

        return {
            data: {
                current: 1,
                oneDay: 1,
                twoDay: 1,
                oneWeek: 1,
            },
            error: false,
        };
    } catch (e) {
        console.log(e);
        return {
            data: undefined,
            error: true,
        };
    }
}

/**
 * returns eth prices at current, 24h, 48h, and 1w intervals
 */
export function useEthPrices(): EthPrices | undefined {
    const [prices, setPrices] = useState<{ [network: string]: EthPrices | undefined }>();
    const [error, setError] = useState(false);
    const { dataClient } = useClients();

    const [t24, t48, tWeek] = useDeltaTimestamps();
    const timestamps = useMemo(() => [t24, t48, tWeek], [t24, t48, tWeek]);
    const { blocks, error: blockError } = useBlocksFromTimestamps(timestamps);

    // index on active network
    const { chain } = useAccount();
    const chainId = chain?.id;
    const indexedPrices = prices?.[chainId ?? AlgebraConfig.CHAIN_PARAMS.chainId];

    const formattedBlocks = useMemo(() => {
        if (blocks) {
            return blocks
                .reverse()
                .sort((a, b) => +b.timestamp - +a.timestamp)
                .map((b) => b.number);
        }
        return undefined;
    }, [blocks]);

    useEffect(() => {
        async function fetch() {
            const { data, error } = await fetchEthPrices(formattedBlocks as [number, number, number, number], dataClient);
            if (error || blockError) {
                setError(true);
            } else if (data) {
                setPrices({
                    [chainId ?? AlgebraConfig.CHAIN_PARAMS.chainId]: data,
                });
            }
        }

        if (!indexedPrices && !error && formattedBlocks) {
            fetch();
        }
    }, [error, prices, formattedBlocks, blockError, dataClient, indexedPrices, chainId]);

    return prices?.[chainId ?? AlgebraConfig.CHAIN_PARAMS.chainId];
}
