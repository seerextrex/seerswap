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

export const ETH_DOGECHAIN = new Token(
    SupportedChainId.DOGECHAIN,
    '0xb44a9b6905af7c801311e8f4e76932ee959c663c',
    18,
    'ETH',
    'Ether'
)

export const USDT_DOGECHAIN = new Token(
    SupportedChainId.DOGECHAIN,
    '0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D',
    18,
    'USDT',
    'USDT'
)

export const WBTC_DOGECHAIN = new Token(
    SupportedChainId.DOGECHAIN,
    '0xfA9343C3897324496A05fC75abeD6bAC29f8A40f',
    18,
    'WBTC',
    'Wrapped Bitcoin'
)

export const DOGEDRAGON_DOGECHAIN = new Token(
    SupportedChainId.DOGECHAIN,
    '0x582DaEF1F36D6009f64b74519cFD612a8467Be18',
    18,
    'DD',
    'Doge Dragon'
)

export const QUICKNEW_DOGECHAIN = new Token(
    SupportedChainId.DOGECHAIN,
    '0xb12c13e66AdE1F72f71834f2FC5082Db8C091358',
    18,
    'QUICK',
    'QuickSwap'
)

export const MATIC_DOGECHAIN = new Token(
    SupportedChainId.DOGECHAIN,
    '0xDC42728B0eA910349ed3c6e1c9Dc06b5FB591f98',
    18,
    'MATIC',
    'Matic'
)

export const DC_DOGECHAIN = new Token(
    SupportedChainId.DOGECHAIN,
    '0x7b4328c127b85369d9f82ca0503b000d09cf9180',
    18,
    'DC',
    'Dogechain Token'
)

export const DOGIRA = new Token(
    SupportedChainId.DOGECHAIN,
    '0xf480f38c366daac4305dc484b2ad7a496ff00cea',
    9,
    'DOGIRA',
    'Dogira'
)

export const DCGOD_DOGECHAIN = new Token(
    SupportedChainId.DOGECHAIN,
    '0x91cd28e57b92e34124c4540ee376c581d188b53e',
    18,
    'DCGOD',
    'DCGod'
)

export const MAI_DOGECHAIN = new Token(
    SupportedChainId.DOGECHAIN,
    '0xb84df10966a5d7e1ab46d9276f55d57bd336afc7',
    18,
    'MAI',
    'Mai Stablecoin'
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
