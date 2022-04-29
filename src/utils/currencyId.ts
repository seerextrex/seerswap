import { Currency } from '@uniswap/sdk-core'

export function currencyId(currency: Currency, chainId: number): string {
    let chainSymbol = 'MATIC'

    if (chainId === 80001) {
        chainSymbol = 'MATIC'
    }

    if (currency.isNative) return chainSymbol
    if (currency.isToken) return currency.address
    throw new Error('invalid currency')
}
