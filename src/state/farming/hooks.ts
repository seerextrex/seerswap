import {useCallback} from "react";
import {useAppDispatch, useAppSelector} from "../hooks";
import {useClients} from "../../hooks/subgraph/useClients";
import {ONE_FARMING_EVENT} from "../../utils/graphql-queries";
import {isFarming} from "./actions";


export function useFarmingActionsHandlers(): {
    onIsFarming: () => void
    onIsFarmingGet: () => true
} {

    const dispatch = useAppDispatch()
    const {farmingClient} = useClients()
    const {startTime} = useAppSelector(state => state.farming)

    const isFarmingAdd = useCallback(async () => {
        try {
            const {data: {incentives}, error: error} = await farmingClient.query({
                query: ONE_FARMING_EVENT(),
                fetchPolicy: 'cache-first'
            })
           dispatch(isFarming(incentives[0]))
        } catch (e) {
            console.log(e)
        }

    }, [dispatch])

    const isFarmingGet = useCallback( () => {
        try {
            if (startTime.trim() !== ''){
                return true
            }
        return startTime
        } catch (e) {
            console.log(e)
            return false
        }

    }, [startTime])

    return {
        onIsFarming: isFarmingAdd,
        onIsFarmingGet: isFarmingGet
    }
}