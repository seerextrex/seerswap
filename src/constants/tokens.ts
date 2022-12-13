import { Token } from '@uniswap/sdk-core'
import { Matic } from '../lib/src/entities/matic'
import { WNATIVE } from '../lib/src/entities/wnative'

import AlgebraConfig from "algebra.config"

export const [
    DEFAULT_TOKENS,
    TOKENS_FOR_MULTIHOP,
    STABLE_TOKENS
] = [
    AlgebraConfig.DEFAULT_TOKEN_LIST.defaultTokens,
    AlgebraConfig.DEFAULT_TOKEN_LIST.tokensForMultihop,
    AlgebraConfig.DEFAULT_TOKEN_LIST.stableTokens,
].map(tokens => Object.entries(tokens).map(([address, { name, symbol, decimals }]) => new Token(AlgebraConfig.CHAIN_PARAMS.chainId, address, decimals, symbol, name)))

export const STABLE_TOKEN_FOR_USD_PRICE = new Token(
    AlgebraConfig.CHAIN_PARAMS.chainId,
    AlgebraConfig.DEFAULT_TOKEN_LIST.stableTokenForUSDPrice.address,
    AlgebraConfig.DEFAULT_TOKEN_LIST.stableTokenForUSDPrice.decimals,
    AlgebraConfig.DEFAULT_TOKEN_LIST.stableTokenForUSDPrice.symbol,
    AlgebraConfig.DEFAULT_TOKEN_LIST.stableTokenForUSDPrice.name,
)

export const WMATIC_EXTENDED: { [chainId: number]: Token } = {
    ...WNATIVE
}

export class ExtendedEther extends Matic {
    private static _cachedEther: { [chainId: number]: ExtendedEther } = {}

    public get wrapped(): Token {
        if (this.chainId in WMATIC_EXTENDED) return WMATIC_EXTENDED[this.chainId]
        throw new Error('Unsupported chain ID')
    }

    public static onChain(chainId: number): ExtendedEther {
        return this._cachedEther[chainId] ?? (this._cachedEther[chainId] = new ExtendedEther(chainId))
    }
}
