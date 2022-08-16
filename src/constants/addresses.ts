import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0xd2480162Aa7F02Ead7BF4C127465446150D58452'
}

export const POOL_DEPLOYER_ADDRESS: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0x56c2162254b0E4417288786eE402c2B41d4e181e'
}

export const QUOTER_ADDRESSES: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0xd8E1E7009802c914b0d39B31Fc1759A865b727B1'
}

export const SWAP_ROUTER_ADDRESSES: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0x4aE2bD0666c76C7f39311b9B3e39b53C8D7C43Ea'
}

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0x0b012055F770AE7BB7a8303968A7Fb6088A2296e'
}

export const MULTICALL_ADDRESS: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0x23602819a9E2B1C8eC7605356D5b0F1FBB10ddA5'
}

export const V3_MIGRATOR_ADDRESSES: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0xB9aFAa5c407DdebA5098193F31CE23D21cFD9657'
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