// import { BigNumber } from '@ethersproject/bignumber' // Removed ethers v5 BigNumber

// add 20% 
export function calculateGasMargin(chainId: number, value: bigint, swap?: boolean): bigint { // value is now bigint, returns bigint

    if (swap) {
        return value * (10000n + 2000n) / 10000n; // bigint arithmetic
    }

    return value * (10000n + 2000n) / 10000n; // bigint arithmetic

    // The commented out optimism logic would also need to be updated if re-enabled
    // e.g., return chainId === SupportedChainId.OPTIMISM ... ? value : value * 12000n / 10000n;
}
