export enum SupportedChainId {
    DOGECHAIN = 2000
}

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
    SupportedChainId.DOGECHAIN
]

export const L1_CHAIN_IDS = [] as const

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number]

export const L2_CHAIN_IDS = [] as const

export type SupportedL2ChainId = typeof L2_CHAIN_IDS[number]

interface L1ChainInfo {
    readonly label: string
}

interface L2ChainInfo extends L1ChainInfo {
    readonly bridge: string
    readonly logoUrl: string
}

type ChainInfo = { readonly [chainId: number]: L1ChainInfo | L2ChainInfo } & {
    readonly [chainId in SupportedL2ChainId]: L2ChainInfo
} &
    { readonly [chainId in SupportedL1ChainId]: L1ChainInfo }

export const CHAIN_INFO: ChainInfo = {
    [SupportedChainId.DOGECHAIN]: {
        label: 'Dogechain'
    }
}
