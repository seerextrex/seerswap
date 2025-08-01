import AlgebraConfig from "algebra.config"

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const POOL_INIT_CODE_HASH = AlgebraConfig.V3_CONTRACTS.POOL_INIT_CODE_HASH

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum FeeAmount {
    LOWEST = 100, // Typically 0.01% or 0.05%
    LOW = 500, // Typically 0.05%
    MEDIUM = 3000, // Typically 0.3%
    HIGH = 10000 // Typically 1%
}

/**
 * The default factory tick spacings by fee amount.
 */
export const TICK_SPACINGS: { [amount in FeeAmount]: number } = {
    [FeeAmount.LOWEST]: 10, // e.g. for 0.01% or 0.05%
    [FeeAmount.LOW]: 10,    // e.g. for 0.05%
    [FeeAmount.MEDIUM]: 60,  // e.g. for 0.3%
    [FeeAmount.HIGH]: 200   // e.g. for 1%
}
