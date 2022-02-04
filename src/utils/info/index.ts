import { Token } from '@uniswap/sdk-core'

const WETH_ADDRESSES = ['0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270']

/**
 * gets the amount difference plus the % change in change itself (second order change)
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 * @param {*} value48HoursAgo
 */
export const get2DayChange = (valueNow: string, value24HoursAgo: string, value48HoursAgo: string): [number, number] => {
    // get volume info for both 24 hour periods
    const currentChange = parseFloat(valueNow) - parseFloat(value24HoursAgo)
    const previousChange = parseFloat(value24HoursAgo) - parseFloat(value48HoursAgo)
    const adjustedPercentChange = ((currentChange - previousChange) / previousChange) * 100
    if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
        return [currentChange, 0]
    }
    return [currentChange, adjustedPercentChange]
}

/**
 * get standard percent change between two values
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 */
export const getPercentChange = (valueNow: string | undefined, value24HoursAgo: string | undefined): number => {
    if (valueNow && value24HoursAgo) {
        const change = ((parseFloat(valueNow) - parseFloat(value24HoursAgo)) / parseFloat(value24HoursAgo)) * 100
        if (isFinite(change)) return change
    }
    return 0
}

export interface SerializedToken {
    chainId: number
    address: string
    decimals: number
    symbol?: string
    name?: string
}

export function serializeToken(token: Token): SerializedToken {
    return {
        chainId: token.chainId,
        address: token.address,
        decimals: token.decimals,
        symbol: token.symbol,
        name: token.name
    }
}

export function deserializeToken(serializedToken: SerializedToken): Token {
    return new Token(
        serializedToken.chainId,
        serializedToken.address,
        serializedToken.decimals,
        serializedToken.symbol,
        serializedToken.name
    )
}

export function formatTokenSymbol(address: string, symbol: string) {
    if (WETH_ADDRESSES.includes(address)) {
        return 'MATIC'
    }
    return symbol
}

export function formatTokenName(address: string, name: string) {
    if (WETH_ADDRESSES.includes(address)) {
        return 'Matic'
    }
    return name
}
