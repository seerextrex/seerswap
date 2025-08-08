import AlgebraConfig from "algebra.config"

type AddressMap = { [chainId: number]: string }

export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
    [AlgebraConfig.CHAIN_PARAMS.chainId]: AlgebraConfig.V3_CONTRACTS.FACTORY_ADDRESS
}

export const POOL_DEPLOYER_ADDRESS: AddressMap = {
    [AlgebraConfig.CHAIN_PARAMS.chainId]: AlgebraConfig.V3_CONTRACTS.POOL_DEPLOYER_ADDRESS
}

export const QUOTER_ADDRESSES: AddressMap = {
    [AlgebraConfig.CHAIN_PARAMS.chainId]: AlgebraConfig.V3_CONTRACTS.QUOTER_ADDRESS
}

export const SWAP_ROUTER_ADDRESSES: AddressMap = {
    [AlgebraConfig.CHAIN_PARAMS.chainId]: AlgebraConfig.V3_CONTRACTS.SWAP_ROUTER_ADDRESS
}

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {
    [AlgebraConfig.CHAIN_PARAMS.chainId]: AlgebraConfig.V3_CONTRACTS.NONFUNGIBLE_POSITION_MANAGER_ADDRESS
}

export const MULTICALL_ADDRESS: AddressMap = {
    [AlgebraConfig.CHAIN_PARAMS.chainId]: AlgebraConfig.V3_CONTRACTS.MULTICALL_ADDRESS
}

export const V3_MIGRATOR_ADDRESSES: AddressMap = {
    [AlgebraConfig.CHAIN_PARAMS.chainId]: AlgebraConfig.V3_CONTRACTS.MIGRATOR_ADDRESS
}

export const FINITE_FARMING: AddressMap = {
    [AlgebraConfig.CHAIN_PARAMS.chainId]: AlgebraConfig.V3_CONTRACTS.LIMIT_FARMING_ADDRESS
}

export const INFINITE_FARMING_ADDRESS: AddressMap = {
    [AlgebraConfig.CHAIN_PARAMS.chainId]: AlgebraConfig.V3_CONTRACTS.ETERNAL_FARMING_ADDRESS
}

export const FARMING_CENTER: AddressMap = {
    [AlgebraConfig.CHAIN_PARAMS.chainId]: AlgebraConfig.V3_CONTRACTS.FARMING_CENTER_ADDRESS
}

export const V2_FACTORY_ADDRESSES: AddressMap = {
    [AlgebraConfig.CHAIN_PARAMS.chainId]: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32'
}

export const V2_ROUTER_ADDRESS: AddressMap = {
    [AlgebraConfig.CHAIN_PARAMS.chainId]: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506'
}

// ConditionalTokens contract for prediction markets
export const CONDITIONAL_TOKENS_ADDRESS: AddressMap = {
    100: '0xCeAfDD6bc0bEF976fdCd1112955828E00543c0Ce', // Gnosis Chain
    1: '0xC59b0e4De5F1248C1140964E0fF287B192407E0C', // Mainnet (if different)
    [AlgebraConfig.CHAIN_PARAMS.chainId]: '0xCeAfDD6bc0bEF976fdCd1112955828E00543c0Ce' // Default to Gnosis
}

export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
    [AlgebraConfig.CHAIN_PARAMS.chainId]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
}

export const SOCKS_CONTROLLER_ADDRESSES: AddressMap = {
    [AlgebraConfig.CHAIN_PARAMS.chainId]: '0x65770b5283117639760beA3F867b69b3697a91dd'
}