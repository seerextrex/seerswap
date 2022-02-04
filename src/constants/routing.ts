// a list of tokens by chain
import { Currency, Token } from '@uniswap/sdk-core'
import { SupportedChainId } from './chains'
import {
    ALGEBRA_POLYGON,
    ExtendedEther,
    RUBIC_POLYGON,
    USDC_POLYGON,
    USDT_POLYGON,
    WETH_POLYGON,
    WMATIC_EXTENDED
} from './tokens'

type ChainTokenList = {
    readonly [chainId: number]: Token[]
}

type ChainCurrencyList = {
    readonly [chainId: number]: Currency[]
}

const WETH_ONLY: ChainTokenList = Object.fromEntries(
    Object.entries(WMATIC_EXTENDED).map(([key, value]) => [key, [value]])
)

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
    ...WETH_ONLY,
    [SupportedChainId.POLYGON]: [...WETH_ONLY[SupportedChainId.POLYGON], USDC_POLYGON, USDT_POLYGON, WETH_POLYGON]
}
export const ADDITIONAL_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {}
/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {}

/**
 * Shows up in the currency select for swap and add liquidity
 */
export const COMMON_BASES: ChainCurrencyList = {
    [SupportedChainId.POLYGON]: [
        ExtendedEther.onChain(SupportedChainId.POLYGON),
        USDC_POLYGON,
        WMATIC_EXTENDED[SupportedChainId.POLYGON],
        ALGEBRA_POLYGON,
        WETH_POLYGON,
        USDT_POLYGON,
        RUBIC_POLYGON
    ]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
    ...WETH_ONLY,
    [SupportedChainId.POLYGON]: [...WETH_ONLY[SupportedChainId.POLYGON], USDC_POLYGON, USDT_POLYGON, WETH_POLYGON]
}
export const PINNED_PAIRS: { readonly [chainId: number]: [Token, Token][] } = {
    [SupportedChainId.POLYGON]: [
        [USDC_POLYGON, USDT_POLYGON]
    ]
}
