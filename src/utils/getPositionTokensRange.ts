export function getPositionTokensSortRange(token0Range: number[], token1Range: number[]) {
    return [
        token0Range.sort((a, b) => a - b),
        token1Range.sort((a, b) => a - b)
    ]
}
