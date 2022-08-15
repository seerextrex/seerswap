import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0xd556ED8F399b29504095E606feF34e53Df9B0c14'
}

export const POOL_DEPLOYER_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0x390e1F04BF44C33F491231E7865fF05E583813C5'
}

export const QUOTER_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x3dcD9cCB03C217C5D24d867A0142CB0fe8BDcF8B'
}

export const SWAP_ROUTER_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x1a5bC2d507465c3e343Ca4e8B5C37Dd6B580f2C2'
}

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0xe8bbDE0e17301EF1B9b1992CBfB1c9B2C2deDc97'
}

export const MULTICALL_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0x672b95814Ee72A167635291d7ac6a5f5Fd3B43AC'
}

export const V3_MIGRATOR_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x3bbFb3299f6685d1bfB1267b5F4DC045b28409E2'
}

export const REAL_STAKER_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0x32CFF674763b06B983C0D55Ef2e41B84D16855bb'
}

export const FINITE_FARMING: AddressMap = {
    [SupportedChainId.POLYGON]: '0x1fDF2A70AFc4374111E686c4708F6B66Ac1734D1'
}

export const INFINITE_FARMING_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0x9e7109c339fb292B3B261800754815116D07eA58'
}

export const FARMING_CENTER: AddressMap = {
    [SupportedChainId.POLYGON]: '0xD3712643eC7138DD09aE6322e7626ad99542Cc04'
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