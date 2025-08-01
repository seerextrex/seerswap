import { useEffect, useMemo } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { useBlockNumber } from "../application/hooks";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchedLogs, fetchedLogsError, fetchingLogs } from "./slice";
import { EventFilter, keyToFilter } from "./utils";
import { publicClientToProvider } from "../../utils/ethersAdapters";

export default function Updater(): null {
    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state.logs);
    const { chain } = useAccount();
    const chainId = chain?.id;
    const publicClient = usePublicClient({ chainId });
    const provider = publicClient ? publicClientToProvider(publicClient) : undefined;

    const blockNumber = useBlockNumber();

    const filtersNeedFetch: EventFilter[] = useMemo(() => {
        if (!chainId || typeof blockNumber !== "number") return [];

        const active = state[chainId];
        if (!active) return [];

        return Object.keys(active)
            .filter((key) => {
                const { fetchingBlockNumber, results, listeners } = active[key];
                if (listeners === 0) return false;
                if (typeof fetchingBlockNumber === "number" && fetchingBlockNumber >= blockNumber) return false;
                if (results && typeof results.blockNumber === "number" && results.blockNumber >= blockNumber) return false;
                return true;
            })
            .map((key) => keyToFilter(key));
    }, [blockNumber, chainId, state]);

    useEffect(() => {
        if (!provider || !chainId || typeof blockNumber !== "number" || filtersNeedFetch.length === 0) return;

        dispatch(fetchingLogs({ chainId, filters: filtersNeedFetch, blockNumber }));
        filtersNeedFetch.forEach((filter) => {
            provider
                .getLogs({
                    ...filter,
                    fromBlock: 0,
                    toBlock: blockNumber,
                })
                .then((logs) => {
                    dispatch(
                        fetchedLogs({
                            chainId,
                            filter,
                            results: { logs, blockNumber },
                        })
                    );
                })
                .catch((error) => {
                    console.error("Failed to get logs", filter, error);
                    dispatch(
                        fetchedLogsError({
                            chainId,
                            filter,
                            blockNumber,
                        })
                    );
                });
        });
    }, [blockNumber, chainId, dispatch, filtersNeedFetch, provider]);

    return null;
}
