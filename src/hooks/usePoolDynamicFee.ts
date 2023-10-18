import { utils } from "ethers";
import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { updateDynamicFee } from "../state/mint/v3/actions";
import { AppState } from "../state";

export function useDynamicFeeValue() {
    return useAppSelector((state: AppState) => state.mintV3.dynamicFee);
}

export function usePoolDynamicFee(address: string) {
    const { provider, chainId } = useWeb3React();

    const dispatch = useAppDispatch();

    const swapEventCallback = (e: any) => {
        dispatch(updateDynamicFee({ dynamicFee: e }));
    };

    return useMemo(() => {
        if (!provider || !chainId || !address) return undefined;

        // setState({ chainId, blockNumber: null })

        const filter = {
            address,
            topics: [utils.id("Swap(address,address,int256,int256,uint160,uint128,int24)")],
        };

        provider.on(filter, swapEventCallback);
        // provider.on('block', blockNumberCallback)
        return () => {
            provider.removeListener(filter, swapEventCallback);
        };
    }, [chainId, provider, address]);
}
