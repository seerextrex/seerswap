import { useCallback, useEffect, useState, useMemo } from "react";
import { api, CHAIN_TAG } from "state/data/enhanced";
import { useAppDispatch } from "state/hooks";
import useDebounce from "../../hooks/useDebounce";
import useIsWindowVisible from "../../hooks/useIsWindowVisible";
import { useAccount, usePublicClient } from "wagmi";
import { updateBlockNumber } from "./actions";
import { publicClientToProvider } from "../../utils/ethersAdapters";

function useQueryCacheInvalidator() {
    const { chain } = useAccount();
    const currentChainId = chain?.id;
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(api.util.invalidateTags([CHAIN_TAG]));
    }, [currentChainId, dispatch]);
}

export default function Updater(): null {
    const { chain } = useAccount();
    const currentChainId = chain?.id;
    const publicClient = usePublicClient({ chainId: currentChainId });
    const dispatch = useAppDispatch();
    const windowVisible = useIsWindowVisible();

    const provider = useMemo(() => {
        if (!publicClient) return undefined;
        try {
            return publicClientToProvider(publicClient);
        } catch (error) {
            console.error("ApplicationUpdater: Error creating provider from publicClient", error);
            return undefined;
        }
    }, [publicClient]);

    const [internalState, setInternalState] = useState<{ chainId: number | undefined; blockNumber: number | null }>(() => ({
        chainId: currentChainId,
        blockNumber: null,
    }));

    useQueryCacheInvalidator();

    useEffect(() => {
        setInternalState(prevState => {
            if (prevState.chainId !== currentChainId) {
                console.log(`ApplicationUpdater: Chain ID changed from ${prevState.chainId} to ${currentChainId}. Resetting block number.`);
                return { chainId: currentChainId, blockNumber: null };
            }
            return prevState;
        });
    }, [currentChainId]);

    const blockNumberCallback = useCallback(
        (blockNumber: number) => {
            setInternalState((prevState) => {
                if (prevState.chainId === internalState.chainId) {
                    if (typeof prevState.blockNumber !== "number" || blockNumber > prevState.blockNumber) {
                        return { ...prevState, blockNumber };
                    }
                }
                return prevState;
            });
        },
        [internalState.chainId]
    );

    useEffect(() => {
        if (!provider || !internalState.chainId || !windowVisible) return undefined;

        console.log(`ApplicationUpdater: Setting up block listeners for chainId: ${internalState.chainId}`);

        provider
            .getBlockNumber()
            .then(blockNumberCallback)
            .catch((error) => console.error(`ApplicationUpdater: Failed to get initial block number for chainId: ${internalState.chainId}`, error));

        provider.on("block", blockNumberCallback);
        return () => {
            console.log(`ApplicationUpdater: Removing block listeners for chainId: ${internalState.chainId}`);
            provider.removeListener("block", blockNumberCallback);
        };
    }, [provider, internalState.chainId, blockNumberCallback, windowVisible]);

    const debouncedInternalState = useDebounce(internalState, 100);

    useEffect(() => {
        if (!debouncedInternalState.chainId || typeof debouncedInternalState.blockNumber !== 'number' || !windowVisible) {
            return;
        }
        dispatch(
            updateBlockNumber({
                chainId: debouncedInternalState.chainId,
                blockNumber: debouncedInternalState.blockNumber,
            })
        );
    }, [windowVisible, dispatch, debouncedInternalState.blockNumber, debouncedInternalState.chainId]);

    return null;
}
