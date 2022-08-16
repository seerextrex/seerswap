import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { blockClient, client } from '../../apollo/client'
import { SupportedChainId } from '../../constants/chains'
import { useActiveWeb3React } from '../web3'

export function useBlockClient(): ApolloClient<NormalizedCacheObject> {
    const { chainId } = useActiveWeb3React()
    switch (chainId) {
        case SupportedChainId.DOGECHAIN:
            return blockClient
        default:
            return blockClient
    }
}

export function useDataClient(): ApolloClient<NormalizedCacheObject> {
    const { chainId } = useActiveWeb3React()
    switch (chainId) {
        case SupportedChainId.DOGECHAIN:
            return client
        default:
            return client
    }
}

export function useClients(): {
    dataClient: ApolloClient<NormalizedCacheObject>
    blockClient: ApolloClient<NormalizedCacheObject>
} {
    const dataClient = useDataClient()
    const blockClient = useBlockClient()

    return {
        dataClient,
        blockClient,
    }
}
