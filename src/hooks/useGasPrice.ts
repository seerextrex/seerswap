import { useState } from "react"


export function useGasPrice() {

    const [gasPrice, setGasPrice] = useState(null)
    const [gasPriceLoading, setGasPriceLoading] = useState(null)

    async function fetchGasPrice() {

        setGasPriceLoading(true)

        try {
            const gasPriceReq = await fetch('https://gasstation-mainnet.matic.network/')
            const { safeLow, standard, fast, fastest, blockTimestamp } = await gasPriceReq.json()
            setGasPrice(fast)
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