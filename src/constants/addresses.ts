import { FACTORY_ADDRESS as V2_FACTORY_ADDRESS } from '@uniswap/v2-sdk'
import { constructSameAddressMap } from '../utils/constructSameAddressMap'
import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x140805d84F0b97Ce5BFc0f18BFa276cF39452062'
}

export const POOL_DEPLOYER_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0x48D23f33d9F03aE9DdAB61CB685E0104d0E6128D'
}

export const QUOTER_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x6Fb32793466176B827CfAa8822C4B0313C9a0e9A'
}

export const SWAP_ROUTER_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x82049c351c87c623D6CE001F0eB3e9dAc9f0B39b'
}

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0xDF977c1E357A66dC5bA8087eAedE5969B6F0ad5D'
}

export const MULTICALL_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0x80c13488F9bDA291aAD05dF820C05e81814Aa082'
}

export const V3_MIGRATOR_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x67a771A88c6e2e89f74CD181A757402939886362',
}

export const STAKER_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0x297D2d534675604321E3918f5b8B6d277fD4982C'
}

export const REAL_STAKER_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0x32CFF674763b06B983C0D55Ef2e41B84D16855bb'
}

export const INFINITE_FARMING_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0x7a7ad380426d4A231a3008A317D0ACC4aB1213FE'
}

export const FARMING_CENTER: AddressMap = {
  [SupportedChainId.POLYGON]: '0x9d4f5b28c9Df4CDA9981D6C3F04AC510F6C2b5Ea'
}

export const V2_FACTORY_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32'
}
export const V2_ROUTER_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506'
}

export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
}
export const SOCKS_CONTROLLER_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x65770b5283117639760beA3F867b69b3697a91dd',
}