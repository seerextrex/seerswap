import { Token } from "@uniswap/sdk-core";

import AlgebraConfig from "algebra.config";
import { AbiCoder, getCreate2Address, solidityPackedKeccak256 } from "ethers";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export const POOL_INIT_CODE_HASH = AlgebraConfig.V3_CONTRACTS.POOL_INIT_CODE_HASH;

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum FeeAmount {
    LOW = 100,
    MEDIUM = 500,
    HIGH = 3000,
}

/**
 * The default factory tick spacings by fee amount.
 */
export const TICK_SPACINGS: { [amount in FeeAmount]: number } = {
    [FeeAmount.LOW]: 60,
    [FeeAmount.MEDIUM]: 60,
    [FeeAmount.HIGH]: 60,
};

/**
 * Computes a pool address
 * @param poolDeployer The SeerSwap sfactory address
 * @param tokenA The first token of the pair, irrespective of sort order
 * @param tokenB The second token of the pair, irrespective of sort order
 * @param fee The fee tier of the pool
 * @returns The pool address
 */
export function computePoolAddress({ poolDeployer, tokenA, tokenB, initCodeHashManualOverride }: { poolDeployer: string; tokenA: Token; tokenB: Token; initCodeHashManualOverride?: string }): string {
    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]; // does safety checks
    return getCreate2Address(poolDeployer, solidityPackedKeccak256(["bytes"], [AbiCoder.defaultAbiCoder().encode(["address", "address"], [token0.address, token1.address])]), initCodeHashManualOverride ?? POOL_INIT_CODE_HASH);
}
