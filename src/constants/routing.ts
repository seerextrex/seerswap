// a list of tokens by chain
import { Currency, Token } from '@uniswap/sdk-core'
import { SupportedChainId } from './chains'
import { DOGEDRAGON_DOGECHAIN, ETH_DOGECHAIN, ExtendedEther, USDC_DOGECHAIN, USDT_DOGECHAIN, WBTC_DOGECHAIN, WMATIC_EXTENDED } from './tokens'

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
    [SupportedChainId.DOGECHAIN]: [...WETH_ONLY[SupportedChainId.DOGECHAIN], DOGEDRAGON_DOGECHAIN, USDC_DOGECHAIN,
        USDT_DOGECHAIN,
        WBTC_DOGECHAIN,
        ETH_DOGECHAIN]
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
    [SupportedChainId.DOGECHAIN]: [
        ExtendedEther.onChain(SupportedChainId.DOGECHAIN),
        WMATIC_EXTENDED[SupportedChainId.DOGECHAIN],
        DOGEDRAGON_DOGECHAIN,
        USDC_DOGECHAIN,
        USDT_DOGECHAIN,
        WBTC_DOGECHAIN,
        ETH_DOGECHAIN
    ]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
    ...WETH_ONLY,
    [SupportedChainId.DOGECHAIN]: [...WETH_ONLY[SupportedChainId.DOGECHAIN], DOGEDRAGON_DOGECHAIN, USDC_DOGECHAIN, USDT_DOGECHAIN, WBTC_DOGECHAIN, ETH_DOGECHAIN]
}
export const PINNED_PAIRS: { readonly [chainId: number]: [Token, Token][] } = {
    [SupportedChainId.DOGECHAIN]: [
    ]
}
