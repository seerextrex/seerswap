import { BigNumber } from '@ethersproject/bignumber'

// add 20% (except on optimism)
export function calculateGasMargin(chainId: number, value: BigNumber, swap?: boolean): BigNumber {

    if (swap) {
        return value.mul(BigNumber.from(10000 + 2000)).div(BigNumber.from(10000))
    }

    return value.mul(BigNumber.from(10000 + 2000)).div(BigNumber.from(10000))

    // return chainId === SupportedChainId.OPTIMISM || chainId === SupportedChainId.OPTIMISTIC_ || chainId === SupportedChainId.KOVAN
    //   ? value
    //   : value.mul(BigNumber.from(10000 + 2000)).div(BigNumber.from(10000))
}
