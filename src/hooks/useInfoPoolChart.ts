import { providers } from "ethers";
import { useState } from "react";
import { FETCH_POOL } from "../utils/graphql-queries";
import { useClients } from "./subgraph/useClients";
import { useActiveWeb3React } from "./web3"


export function useInfoPoolChart() {

    const { chainId, account } = useActiveWeb3React()

    const { dataClient, farmingClient } = useClients()

    const [poolLoading, setPoolLoading] = useState(null)
    const [poolResult, setPoolResult] = useState(null)

    const provider = window.ethereum ? new providers.Web3Provider(window.ethereum) : undefined

    async function fetchPool(poolId: string) {
        try {

            setPoolLoading(true)

            const { data: { pools }, error } = (await dataClient.query({
                query: FETCH_POOL(poolId)
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