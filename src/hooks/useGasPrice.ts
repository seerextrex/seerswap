import { useState } from "react"

export const GAS_PRICE_MULTIPLIER = 1000000000;

export function useGasPrice() {

    const [gasPrice, setGasPrice] = useState({fetched: null, override: null})
    const [gasPriceLoading, setGasPriceLoading] = useState(null)

    async function fetchGasPrice() {

        setGasPriceLoading(true)

        try {
            const gasPriceReq = await fetch('https://gasstation-mainnet.matic.network/')
            const { standard } = await gasPriceReq.json()
            setGasPrice({fetched: standard, override: standard < 70})
        } catch (err) {
            console.error('Gas price fetching failed', err.code, err.message)
        }

        setGasPriceLoading(false)

    }


    return {
        fetchGasPrice,
        gasPrice,
        gasPriceLoading
    }
}