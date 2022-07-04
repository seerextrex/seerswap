import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x59a662Ed724F19AD019307126CbEBdcF4b57d6B1'
}

export const POOL_DEPLOYER_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0x805488DaA81c1b9e7C5cE3f1DCeA28F21448EC6A'
}

export const QUOTER_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0xd265f57c36AC60d3F7931eC5c7396966F0C246A7'
}

export const SWAP_ROUTER_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0xFe3BEcd788320465ab649015F34F7771220A88b2'
}

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x4A3BC48C156384f9564Fd65A53a2f3D534D8f2b7'
}

export const MULTICALL_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0x13fcE0acbe6Fb11641ab753212550574CaD31415'
}

export const V3_MIGRATOR_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x15fCbF9bC0797567053A8265b7E6f4eC43EA7327'
}

export const REAL_STAKER_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0x32CFF674763b06B983C0D55Ef2e41B84D16855bb'
}

export const FINITE_FARMING: AddressMap = {
    [SupportedChainId.POLYGON]: '0x7064C7Bb85979f008212877c4CE41285ddf5374C'
}

export const INFINITE_FARMING_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0x2650e9EFe6D841622aA627cb9e493a8B8b2f9D7A'
}

export const FARMING_CENTER: AddressMap = {
    [SupportedChainId.POLYGON]: '0x8FFf6402215870Cbb8CB216C7A587Cb17D524B81'
}

export const V2_FACTORY_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32'
}

export const V2_ROUTER_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506'
}

export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
}

export const SOCKS_CONTROLLER_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x65770b5283117639760beA3F867b69b3697a91dd'
}
