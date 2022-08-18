import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0xe18efa058A8C8170fa82b00562FaDb1Ce3855419'
}

export const POOL_DEPLOYER_ADDRESS: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0x6C478CE4ec6AbdF178726c55439a18AbF60D93C6'
}

export const QUOTER_ADDRESSES: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0x6300FA6e6115f31f76ECc965d37a672A6fB4D93A'
}

export const SWAP_ROUTER_ADDRESSES: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0x6f6ee2AEe74CB5E0d740a3369f9DadA647A78592'
}

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0xBF4B86A53E4f0Bf2EEEe083820f0f1c2363DF157'
}

export const MULTICALL_ADDRESS: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0xDA8db60c929171B794AAa78fe8976368F3791C8c'
}

export const V3_MIGRATOR_ADDRESSES: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0xD87E1Bd21050d35751dA96A253F932C423185d23'
}

export const FINITE_FARMING: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0xdA323D105970Fe5bCD0E480a27D4bbD04Ae8dCa9'
}

export const INFINITE_FARMING_ADDRESS: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0xA8dca28065cDA20d92a8fD6F560da6F72640fCac'
}

export const FARMING_CENTER: AddressMap = {
    [SupportedChainId.DOGECHAIN]: '0x3A1017b5C8e5bb5B768A7f39548C0D528a9bE115'
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