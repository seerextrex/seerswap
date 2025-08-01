import { id as ethersId } from "ethers";
import { useMemo } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { publicClientToProvider } from "../utils/ethersAdapters";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { updateDynamicFee } from "../state/mint/v3/actions";
import { AppState } from "../state";

export function useDynamicFeeValue() {
    return useAppSelector((state: AppState) => state.mintV3.dynamicFee);
}

export function usePoolDynamicFee(address: string) {
    const { chain } = useAccount();
    const chainId = chain?.id;
    const publicClient = usePublicClient({ chainId });
    const provider = useMemo(() => publicClient ? publicClientToProvider(publicClient) : undefined, [publicClient]);

    const dispatch = useAppDispatch();

    const swapEventCallback = (e: any) => {
        dispatch(updateDynamicFee({ dynamicFee: e }));
    };

    return useMemo(() => {
        if (!provider || !chainId || !address) return undefined;

        const filter = {
            address,
            topics: [ethersId("Swap(address,address,int256,int256,uint160,uint128,int24)")],
        };

        provider.on(filter, swapEventCallback);
        return () => {
            provider.removeListener(filter, swapEventCallback);
        };
    }, [chainId, provider, address, dispatch]);
}
