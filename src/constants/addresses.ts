import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x84d3C79b7Bf2B0F8a9b9a1c513b046Faa9204aF9'
}

export const POOL_DEPLOYER_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0x936586d2D345eF595DF059a2a5D94Ec0DcC5062A'
}

export const QUOTER_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0xC80b5Bd5399F92a3ec1D8316D095cd4a0F391524'
}

export const SWAP_ROUTER_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0xd8B777185c4B2904c6C38c799e5E47Dfecdd5cF3'
}

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x00A04d5564FE26958AaB34DfBbcE1840394669E3'
}

export const MULTICALL_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0x42D3C85F449e5DBd136a4A21D336661Feed3CD7a'
}

export const V3_MIGRATOR_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x249085f160208D1B91d1f6FC5d8726c9DEB5c9b2'
}

export const REAL_STAKER_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0x32CFF674763b06B983C0D55Ef2e41B84D16855bb'
}

export const FINITE_FARMING: AddressMap = {
    [SupportedChainId.POLYGON]: '0xF510C674014B8231a41D46AB56814889641e3E9d'
}

export const INFINITE_FARMING_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0x283531436D953fe8139a7f49c4a681f1e5BD2B56'
}

export const FARMING_CENTER: AddressMap = {
    [SupportedChainId.POLYGON]: '0x88206eacB27784c92CfF0C3A55483F0C9107e2E6'
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
