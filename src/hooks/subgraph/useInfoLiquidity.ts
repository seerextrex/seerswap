import { SubgraphResponse } from "models/interfaces"
import { useState } from "react"
import { FETCH_POPULAR_POOLS } from "utils/graphql-queries"
import { useClients } from "./useClients"

export function useInfoLiquidity() {

    const { dataClient } = useClients()

    const [popularPools, setPopularPools] = useState<[string, string][] | undefined>()
    const [popularPoolsLoading, setPopularPoolsLoading] = useState<boolean>(false)

    async function fetchPopularPools() {

        try {

            setPopularPoolsLoading(true)

            const { data: { pools }, error: error } = await dataClient.query<SubgraphResponse<any[]>>({
                query: FETCH_POPULAR_POOLS(),
                fetchPolicy: 'network-only'
            })

            if (error) {
                return
            }

            setPopularPools(pools.map(({ token0, token1 }) => [token0.id.toLowerCase(), token1.id.toLowerCase()]))

        } catch (err) {
            console.error('total stats failed', err)
            // setTotalStats('Failed')
        }
        setPopularPoolsLoading(false)
    }

    return {
        fetchPopularPools: { popularPools, popularPoolsLoading, fetchPopularPoolsFn: fetchPopularPools }
    }
}