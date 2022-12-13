import { Token } from '@uniswap/sdk-core'
import AlgebraConfig from "algebra.config"

/**
 * Known WETH9 implementation addresses, used in our implementation of Ether#wrapped
 */
export const WNATIVE: { [chainId: number]: Token } = {
    [AlgebraConfig.CHAIN_PARAMS.chainId]: new Token(AlgebraConfig.CHAIN_PARAMS.chainId, AlgebraConfig.CHAIN_PARAMS.wrappedNativeCurrency.address, AlgebraConfig.CHAIN_PARAMS.wrappedNativeCurrency.decimals, AlgebraConfig.CHAIN_PARAMS.wrappedNativeCurrency.symbol, AlgebraConfig.CHAIN_PARAMS.wrappedNativeCurrency.name)
}
