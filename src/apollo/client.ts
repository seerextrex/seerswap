import { ApolloClient, InMemoryCache } from '@apollo/client'

export const healthClient = new ApolloClient({
    uri: 'https://api.thegraph.com/index-node/graphql',
    cache: new InMemoryCache()
})

export const blockClient = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/iliaazhel/ethereum-blocks',
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache'
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        }
    }
})

export const client = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/iliaazhel/info-test',
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache'
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        }
    }
})

export const stakerClient = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/iliaazhel/staker',
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache'
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        }
    }
})

export const farmingClient = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/iliaazhel/farming-test',
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache'
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        }
    }
})

export const oldFarmingClient = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/iliaazhel/algebra-farming-t',
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache'
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
        }
    }
})