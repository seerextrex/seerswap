import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useClients } from "../../hooks/subgraph/useClients";
import { ONE_ETERNAL_FARMING, ONE_FARMING_EVENT } from "../../utils/graphql-queries";
import { isFarming } from "./actions";


export function useFarmingActionsHandlers(): {
    onIsFarming: () => void
    // onIsFarmingGet: () => boolean
} {

    const dispatch = useAppDispatch()
    const { farmingClient } = useClients()
    const { startTime } = useAppSelector(state => state.farming)

    const isFarmingAdd = useCallback(async () => {
        try {
            const { data: { incentives }, error } = await farmingClient.query({
                query: ONE_FARMING_EVENT(),
                fetchPolicy: 'network-only'
            })

            if (error) {
                return
            }

            const { data: { eternalFarmings }, error: eternalError } = await farmingClient.query({
                query: ONE_ETERNAL_FARMING(),
                fetchPolicy: 'network-only'
            })

            if (eternalError) {
                return
            }

            dispatch(isFarming({ startTime: incentives[0]?.startTime, endTime: incentives[0]?.endTime, eternalFarmings: !!eternalFarmings[0] }))
        } catch (e) {
            console.log(e)
        }

    }, [dispatch])

    // const isFarmingGet = useCallback( () => {
    //     try {
    //         if (startTime.trim() !== ''){
    //             return true
    //         }
    //     return startTime
    //     } catch (e) {
    //         console.log(e)
    //         return false
    //     }
    //
    // }, [startTime])

    return {
        onIsFarming: isFarmingAdd
        // onIsFarmingGet: isFarmingGet
    }
}
