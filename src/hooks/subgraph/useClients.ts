import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { blockClient, client, farmingClient } from "../../apollo/client";
import { useWeb3React } from "@web3-react/core";

import AlgebraConfig from "algebra.config";

export function useBlockClient(): ApolloClient<NormalizedCacheObject> {
    const { chainId } = useWeb3React();
    switch (chainId) {
        case AlgebraConfig.CHAIN_PARAMS.chainId:
            return blockClient;
        default:
            return blockClient;
    }
}

export function useDataClient(): ApolloClient<NormalizedCacheObject> {
    const { chainId } = useWeb3React();
    switch (chainId) {
        case AlgebraConfig.CHAIN_PARAMS.chainId:
            return client;
        default:
            return client;
    }
}

export function useFarmingClient(): ApolloClient<NormalizedCacheObject> {
    const { chainId } = useWeb3React();
    switch (chainId) {
        case AlgebraConfig.CHAIN_PARAMS.chainId:
            return farmingClient;
        default:
            return farmingClient;
    }
}

export function useClients(): {
    dataClient: ApolloClient<NormalizedCacheObject>;
    farmingClient: ApolloClient<NormalizedCacheObject>;
    blockClient: ApolloClient<NormalizedCacheObject>;
} {
    const dataClient = useDataClient();
    const farmingClient = useFarmingClient();
    const blockClient = useBlockClient();

    return {
        dataClient,
        farmingClient,
        blockClient,
    };
}
