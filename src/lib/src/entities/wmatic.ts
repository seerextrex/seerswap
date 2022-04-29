import { Token } from '@uniswap/sdk-core'

/**
 * Known WETH9 implementation addresses, used in our implementation of Ether#wrapped
 */
export const WMATIC: { [chainId: number]: Token } = {
    [80001]: new Token(80001, '0x5e716825c2368000dF026372173b4C4dc2cE8A8B', 18, 'WMATIC', 'Wrapped Matic')
}
