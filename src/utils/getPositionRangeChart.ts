import { PriceRangeChart, PriceRangeClosed } from '../models/interfaces'


export function getPositionRangeChart(data: PriceRangeClosed, startObj?: { [key: string]: { timestamp: string, liquidity: string }[] }): PriceRangeChart | null {
    let res = {}

    if (Object.values(data).length === 0) return null

    //TODO BIGNUMBER?
    for (const key in data) {
        const entry = data[key][0]
        const lowerT0 = +entry.position.tickLower.price0 * 10 ** (+entry.position.token0.decimals - +entry.position.token1.decimals)
        const lowerT1 = +entry.position.tickLower.price1 * 10 ** (+entry.position.token1.decimals - +entry.position.token0.decimals)
        const upperT0 = +entry.position.tickUpper.price0 * 10 ** (+entry.position.token0.decimals - +entry.position.token1.decimals)
        const upperT1 = +entry.position.tickUpper.price1 * 10 ** (+entry.position.token1.decimals - +entry.position.token0.decimals)

        if (startObj && (+startObj[entry.position.id][0].timestamp - +entry.timestamp < 36000)) break

        res = {
            ...res,
            [entry.position.id]: {
                token0Range: [lowerT0, upperT0],
                token1Range: [lowerT1, upperT1],
                startTime: entry.timestamp,
                endTime: startObj && startObj[entry.position.id][0].timestamp
            }
        }
    }

    return res as PriceRangeChart
}
