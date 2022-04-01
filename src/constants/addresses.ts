import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x955B95b8532fe75DDCf2161f61127Be74A768158'
}

export const POOL_DEPLOYER_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0x4439199c3743161ca22bB8F8B6deC5bF6fF65b04'
}

export const QUOTER_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x805488DaA81c1b9e7C5cE3f1DCeA28F21448EC6A'
}

export const SWAP_ROUTER_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x59a662Ed724F19AD019307126CbEBdcF4b57d6B1'
}

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0x3B22094a64D3D6801a27Db4e58ac0B859A4C066d'
}

export const MULTICALL_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0x8C97D1566eD686249b6E818E664aCe873ccfE442'
}

export const V3_MIGRATOR_ADDRESSES: AddressMap = {
    [SupportedChainId.POLYGON]: '0xFe3BEcd788320465ab649015F34F7771220A88b2'
}

export const REAL_STAKER_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0x32CFF674763b06B983C0D55Ef2e41B84D16855bb'
}

export const FINITE_FARMING: AddressMap = {
    [SupportedChainId.POLYGON]: '0xb7875b8Dc8f49c2D6BBb658905dBF88843B54Da8'
}

export const INFINITE_FARMING_ADDRESS: AddressMap = {
    [SupportedChainId.POLYGON]: '0x9ff6aB647a7FEFa9CEb7918C2B034c3ED2C3FFF6'
}

export const FARMING_CENTER: AddressMap = {
    [SupportedChainId.POLYGON]: '0x5b1803B6a3Ee361dF563BB0FF11B92Ce3F16Ac4e'
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
