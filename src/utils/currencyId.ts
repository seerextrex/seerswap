import { Currency } from '@uniswap/sdk-core'

export function currencyId(currency: Currency, chainId: number): string {
    let chainSymbol = 'WDOGE'

    if (chainId === 2000) {
        chainSymbol = 'WDOGE'
    }

    if (currency.isNative) return chainSymbol
    if (currency.isToken) return currency.address
    throw new Error('invalid currency')
}
