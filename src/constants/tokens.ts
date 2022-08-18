import { Token } from '@uniswap/sdk-core'
import { Matic } from '../lib/src/entities/matic'
import { SupportedChainId } from './chains'
import { WDOGE } from '../lib/src/entities/wmatic'

export const USDC_DOGECHAIN = new Token(
    SupportedChainId.DOGECHAIN,
    '0x765277EebeCA2e31912C9946eAe1021199B39C61',
    6,
    'USDC',
    'USDC'
)

export const WMATIC_EXTENDED: { [chainId: number]: Token } = {
    ...WDOGE
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
