import { PositionPriceRange, PriceRangeChart } from '../models/interfaces'


export function getPositionRangeChart(data: PositionPriceRange[]): PriceRangeChart | null {
    let res = {}

    //TODO BIGNUMBER?
    data.forEach(item => {
        const lowerT0 = +item.tickLower.price0 * 10 ** (+item.token0.decimals - +item.token1.decimals)
        const lowerT1 = +item.tickLower.price1 * 10 ** (+item.token1.decimals - +item.token0.decimals)
        const upperT0 = +item.tickUpper.price0 * 10 ** (+item.token0.decimals - +item.token1.decimals)
        const upperT1 = +item.tickUpper.price1 * 10 ** (+item.token1.decimals - +item.token0.decimals)

        res = {
            ...res,
            [item.id]: {
                token0Range: [lowerT0, upperT0],
                token1Range: [lowerT1, upperT1],
                startTime: item.transaction.timestamp,
                endTime: item.closed,
                timestamps: item.timestamps
            }
        }
    })

    return res as PriceRangeChart
}
