import { Token, Ether } from '@uniswap/sdk-core'
import { Matic } from '../lib/src/entities/matic'
import { SupportedChainId } from './chains'
import { WMATIC } from '../lib/src/entities/wmatic'

// export const USDC_BINANCE = new Token(
//   SupportedChainId.BINANCE,
//   '0x37792237f932004b9f07BB55C3a3ad77e3BF4ca1',
//   8,
//   'USDC',
//   'USD//C'
// )

export const WETH_POLYGON = new Token(
  SupportedChainId.POLYGON,
  '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  18,
  'WETH',
  'Wrapped ETH'
)

export const USDT_POLYGON = new Token(
  SupportedChainId.POLYGON,
  '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  6,
  'USDT',
  'USD//T'
)

export const USDC_POLYGON = new Token(
  SupportedChainId.POLYGON,
  '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  6,
  'USDC',
  'USD//C'
)

export const ALGEBRA_POLYGON = new Token(
  SupportedChainId.POLYGON,
  '0x0169eC1f8f639B32Eec6D923e24C2A2ff45B9DD6',
  18,
  'ALGB',
  'Algebra'
)

export const RUBIC_POLYGON = new Token(
  SupportedChainId.POLYGON,
  '0xc3cffdaf8f3fdf07da6d5e3a89b8723d5e385ff8',
  18,
  'RBC',
  'Rubic'
)

export const ONE_POLYGON = new Token(
  SupportedChainId.POLYGON,
  '0x6b7a87899490ece95443e979ca9485cbe7e71522',
  18,
  'ONE',
  'ONE'
)

export const IRIS_POLYGON = new Token(
  SupportedChainId.POLYGON,
  '0xdab35042e63e93cc8556c9bae482e5415b5ac4b1',
  18,
  'IRIS',
  'Iris'
)


export const WMATIC_EXTENDED: { [chainId: number]: Token } = {
  ...WMATIC
}

export class ExtendedEther extends Matic {
  public get wrapped(): Token {
    if (this.chainId in WMATIC_EXTENDED) return WMATIC_EXTENDED[this.chainId]
    throw new Error('Unsupported chain ID')
  }

  private static _cachedEther: { [chainId: number]: ExtendedEther } = {}

  public static onChain(chainId: number): ExtendedEther {
    return this._cachedEther[chainId] ?? (this._cachedEther[chainId] = new ExtendedEther(chainId))
  }
}
