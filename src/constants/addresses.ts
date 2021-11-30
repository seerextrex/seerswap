import { FACTORY_ADDRESS as V2_FACTORY_ADDRESS } from '@uniswap/v2-sdk'
import { constructSameAddressMap } from '../utils/constructSameAddressMap'
import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0xDE06B9980087B1c91904ef18aD0db6aC731F088d'
}

export const POOL_DEPLOYER_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0xD028fbf1FB3d46F23Fd4adD0978623820B5FDB5C'
}

export const QUOTER_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x185ff5E4597fabE76dcC99Fbd8287d9cD72ad80F'
}

export const SWAP_ROUTER_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x71E6CF257a3cBdC39308c52C39e3FdcE3B1De820'
}

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0xF96F8EAc702515156Dab971E480f99460bC0502C'
}

export const MULTICALL_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0x4f2caE8469A0F2E8654fE3db6DaA70E299ba9c2B'
}

export const V3_MIGRATOR_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x602bf7e6b6788Fdc97aab1dF8B9Ed8A0E0edE1Bd',
}

export const STAKER_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0xFB78Fed89a9e053a0A3eFb0F5EB5C85DbBb12d8b'
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