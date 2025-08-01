// a list of tokens by chain
import { Currency, Token } from "@uniswap/sdk-core";
import { DEFAULT_TOKENS, TOKENS_FOR_MULTIHOP, ExtendedEther, WXDAI_EXTENDED } from "./tokens";

import AlgebraConfig from "algebra.config";

type ChainTokenList = {
    readonly [chainId: number]: Token[];
};

type ChainCurrencyList = {
    readonly [chainId: number]: Currency[];
};

const WETH_ONLY: ChainTokenList = Object.fromEntries(Object.entries(WXDAI_EXTENDED).map(([key, value]) => [key, [value]]));

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
    ...WETH_ONLY,
    [AlgebraConfig.CHAIN_PARAMS.chainId]: [...WETH_ONLY[AlgebraConfig.CHAIN_PARAMS.chainId], ...TOKENS_FOR_MULTIHOP],
};
export const ADDITIONAL_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {};
/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {};

/**
 * Shows up in the currency select for swap and add liquidity
 */
export const COMMON_BASES: ChainCurrencyList = {
    [AlgebraConfig.CHAIN_PARAMS.chainId]: [ExtendedEther.onChain(AlgebraConfig.CHAIN_PARAMS.chainId).wrapped, ...DEFAULT_TOKENS],
};

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
    ...WETH_ONLY,
    [AlgebraConfig.CHAIN_PARAMS.chainId]: [...WETH_ONLY[AlgebraConfig.CHAIN_PARAMS.chainId], ...TOKENS_FOR_MULTIHOP],
};
export const PINNED_PAIRS: { readonly [chainId: number]: [Token, Token][] } = {
    [AlgebraConfig.CHAIN_PARAMS.chainId]: [],
};
