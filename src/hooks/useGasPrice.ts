import { useState } from 'react'

export const GAS_PRICE_MULTIPLIER = 1_000_000_000

export function useGasPrice() {
    const [gasPrice, setGasPrice] = useState<{ fetched: null | number, override: boolean }>({ fetched: null, override: false })
    const [gasPriceLoading, setGasPriceLoading] = useState<boolean>(false)

    async function fetchGasPrice() {

        setGasPriceLoading(true)

        try {
            // const gasPriceReq = await fetch('https://gasstation-mainnet.matic.network/')
            // const { standard } = await gasPriceReq.json()
            setGasPrice({ fetched: 50, override: false })
        } catch (err: any) {
            console.error('Gas price fetching failed', err.code, err.message)
        }
        setGasPriceLoading(false)
    }

    return { fetchGasPrice, gasPrice, gasPriceLoading }
}
