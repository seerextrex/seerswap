import { Token } from '@uniswap/sdk-core'

/**
 * Known WETH9 implementation addresses, used in our implementation of Ether#wrapped
 */
export const WDOGE: { [chainId: number]: Token } = {
    [2000]: new Token(2000, '0xB7ddC6414bf4F5515b52D8BdD69973Ae205ff101', 18, 'WWDOGE', 'Wrapped WDOGE')
}
