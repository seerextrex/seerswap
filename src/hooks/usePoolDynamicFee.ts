import { utils } from 'ethers'
import { useMemo } from 'react'
import { useActiveWeb3React } from './web3'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { updateDynamicFee } from '../state/mint/v3/actions'
import { AppState } from '../state'


export function useDynamicFeeValue() {
    return useAppSelector((state: AppState) => state.mintV3.dynamicFee)
}

export function usePoolDynamicFee(
    address: string
) {

    const { library, chainId } = useActiveWeb3React()

    const dispatch = useAppDispatch()

    const swapEventCallback = (e: any) => {
        dispatch(updateDynamicFee({ dynamicFee: e }))
    }

    return useMemo(() => {
        if (!library || !chainId || !address) return undefined

        // setState({ chainId, blockNumber: null })

        const filter = {
            address,
            topics: [
                utils.id('Swap(address,address,int256,int256,uint160,uint128,int24)')
            ]
        }

        library.on(filter, swapEventCallback)
        // library.on('block', blockNumberCallback)
        return () => {
            library.removeListener(filter, swapEventCallback)
        }

    }, [chainId, library, address])

}
