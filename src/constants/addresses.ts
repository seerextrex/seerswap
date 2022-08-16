import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0xd2480162Aa7F02Ead7BF4C127465446150D58452'
}

export const POOL_DEPLOYER_ADDRESS: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0x56c2162254b0E4417288786eE402c2B41d4e181e'
}

export const QUOTER_ADDRESSES: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
}

export const SWAP_ROUTER_ADDRESSES: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0x4B9f4d2435Ef65559567e5DbFC1BbB37abC43B57'
}

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0x55BeE1bD3Eb9986f6d2d963278de09eE92a3eF1D'
}

export const MULTICALL_ADDRESS: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0xc7efb32470dEE601959B15f1f923e017C6A918cA'
}

export const V3_MIGRATOR_ADDRESSES: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0xF6Ad3CcF71Abb3E12beCf6b3D2a74C963859ADCd'
}

export const V2_FACTORY_ADDRESSES: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32'
}

export const V2_ROUTER_ADDRESS: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506'
}

export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
}

export const SOCKS_CONTROLLER_ADDRESSES: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0x65770b5283117639760beA3F867b69b3697a91dd'
}