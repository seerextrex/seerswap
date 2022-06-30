import { ApolloClient, InMemoryCache } from '@apollo/client'

export const healthClient = new ApolloClient({
    uri: 'https://api.thegraph.com/index-node/graphql',
    cache: new InMemoryCache()
})

export const blockClient = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/iliaazhel/mumbai-blocks',
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
    uri: 'https://api.thegraph.com/subgraphs/name/iliaazhel/algebra',
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
<<<<<<< HEAD
    uri: 'https://api.thegraph.com/subgraphs/name/iliaazhel/algebra-farming',
=======
    uri: 'https://api.thegraph.com/subgraphs/name/iliaazhel/algebra-farming-mumbai',
>>>>>>> feature/tier-eternal-farming
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
