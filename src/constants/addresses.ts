import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x9742E5C4452ccA62ce115d302756e9150CbA36Aa'
}

export const POOL_DEPLOYER_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0xbEA5f93e3b9D1D267C8aa3FfB8dd05BC3fb12022'
}

export const QUOTER_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x3802bCA0708c0962E85e830E82e2A5eF19a418B0'
}

export const SWAP_ROUTER_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0xaC4423003024A4ec9597cd818f10DFACAeB36AC0'
}

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x5c43b3C6d5b7dF8A672db8DD66d0b5D74BAf099F'
}

export const MULTICALL_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0x4B2aD584482c19Bd637c12593D1B38793Ea5bbe4'
}

export const V3_MIGRATOR_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x15f86B4DB9F385DeD61EDDEfd8CA06f6AD448B20'
}

export const REAL_STAKER_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0x32CFF674763b06B983C0D55Ef2e41B84D16855bb'
}

export const FINITE_FARMING: AddressMap = {
    [SupportedChainId.POLYGON]: '0x210F88228151992357Aea0e2fb7f3dE9D8eC8537'
}

export const INFINITE_FARMING_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0xA55A63c7f3860d8E1D1cdb41D426B2841CD21F95'
}

export const FARMING_CENTER: AddressMap = {
    [SupportedChainId.POLYGON]: '0xB1d4784473277c162E36656fa066dfEd21B1EC89'
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
