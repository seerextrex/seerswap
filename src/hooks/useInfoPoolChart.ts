import { useState } from 'react'
import { FETCH_POOL } from '../utils/graphql-queries'
import { useClients } from './subgraph/useClients'
import { PoolChartSubgraph, SubgraphResponse } from '../models/interfaces'

export function useInfoPoolChart() {

    const { dataClient } = useClients()

    const [poolLoading, setPoolLoading] = useState<boolean | null>(null)
    const [poolResult, setPoolResult] = useState<null | PoolChartSubgraph>(null)

    async function fetchPool(poolId: string) {
        try {

            setPoolLoading(true)

            const { data: { pools }, error } = (await dataClient.query<SubgraphResponse<PoolChartSubgraph[]>>({
                query: FETCH_POOL(),
                variables: {poolId}
            }))

            if (error) throw new Error(`${error.name} ${error.message}`)

            setPoolResult(pools[0])

        } catch (err) {
            console.error('fetching pool failed', err)
            setPoolLoading(null)
        }

        setPoolLoading(false)
    }

    return {
        fetchPool: { fetchPoolFn: fetchPool, poolLoading, poolResult }
    }
}
