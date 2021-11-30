import { Currency } from '@uniswap/sdk-core'
import { useActiveWeb3React } from '../hooks/web3'

export function currencyId(currency: Currency, chainId: number): string {
  let chainSymbol = 'MATIC';

  if (chainId === 137) {
    chainSymbol = 'MATIC'
  }

  if (currency.isNative) return chainSymbol
  if (currency.isToken) return currency.address
  throw new Error('invalid currency')
}
