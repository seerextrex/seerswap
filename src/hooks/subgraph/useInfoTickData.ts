import { useCallback, useState } from "react";
import { FETCH_POOL, FETCH_TICKS } from "../../utils/graphql-queries";
import { useClients } from "./useClients";

import keyBy from 'lodash.keyby'

import { TickMath, tickToPrice } from '@uniswap/v3-sdk'
import { Token } from '@uniswap/sdk-core'

import JSBI from 'jsbi'

export function useInfoTickData() {

    const { dataClient } = useClients()

    const numSurroundingTicks = 300
    const PRICE_FIXED_DIGITS = 8

    const [ticksResult, setTicksResult] = useState(null);
    const [ticksLoading, setTicksLoading] = useState(null);

    async function fetchInitializedTicks(poolAddress, tickIdxLowerBound, tickIdxUpperBound) {

        let surroundingTicks = []
        let surroundingTicksResult = []

        let skip = 0
        do {
            const { data, error, loading } = await dataClient.query({
                query: FETCH_TICKS(),
                fetchPolicy: 'cache-first',
                variables: {
                    poolAddress,
                    tickIdxLowerBound,
                    tickIdxUpperBound,
                    skip,
                },
            })

            console.log('DATAAAAAAA', data)

            if (loading) {
                continue
            }

            if (error) {
                return { error: Boolean(error), loading, ticks: surroundingTicksResult }
            }

            surroundingTicks = data.ticks
            surroundingTicksResult = surroundingTicksResult.concat(surroundingTicks)
            skip += 1000
        } while (surroundingTicks.length > 0)

        return { ticks: surroundingTicksResult, loading: false, error: false }

    }

    async function fetchTicksSurroundingPrice(pool: string) {

        setTicksLoading(true)

        try {

            const { data: { pools }, error } = await dataClient.query({
                query: FETCH_POOL(pool)
            })

            if (error) throw new Error(`${error.name} ${error.message}`)

            const {
                tick: poolCurrentTick,
                liquidity,
                token0: { id: token0Address, decimals: token0Decimals },
                token1: { id: token1Address, decimals: token1Decimals },
            } = pools[0]

            const poolCurrentTickIdx = parseInt(poolCurrentTick)
            const tickSpacing = 60

            // The pools current tick isn't necessarily a tick that can actually be initialized.
            // Find the nearest valid tick given the tick spacing.
            const activeTickIdx = Math.floor(poolCurrentTickIdx / tickSpacing) * tickSpacing

            // Our search bounds must take into account fee spacing. i.e. for fee tier 1%, only
            // ticks with index 200, 400, 600, etc can be active.
            const tickIdxLowerBound = activeTickIdx - numSurroundingTicks * tickSpacing
            const tickIdxUpperBound = activeTickIdx + numSurroundingTicks * tickSpacing

            const initializedTicksResult = await fetchInitializedTicks(pool, tickIdxLowerBound, tickIdxUpperBound)
            if (initializedTicksResult.error || initializedTicksResult.loading) {
                return {
                    error: initializedTicksResult.error,
                    loading: initializedTicksResult.loading,
                }
            }

            const { ticks: initializedTicks } = initializedTicksResult

            const tickIdxToInitializedTick = keyBy(initializedTicks, 'tickIdx')

            const token0 = new Token(1, token0Address, parseInt(token0Decimals))
            const token1 = new Token(1, token1Address, parseInt(token1Decimals))

            // console.log({ activeTickIdx, poolCurrentTickIdx }, 'Active ticks')

            // If the pool's tick is MIN_TICK (-887272), then when we find the closest
            // initializable tick to its left, the value would be smaller than MIN_TICK.
            // In this case we must ensure that the prices shown never go below/above.
            // what actual possible from the protocol.
            let activeTickIdxForPrice = activeTickIdx
            if (activeTickIdxForPrice < TickMath.MIN_TICK) {
                activeTickIdxForPrice = TickMath.MIN_TICK
            }
            if (activeTickIdxForPrice > TickMath.MAX_TICK) {
                activeTickIdxForPrice = TickMath.MAX_TICK
            }

            const activeTickProcessed = {
                liquidityActive: JSBI.BigInt(liquidity),
                tickIdx: activeTickIdx,
                liquidityNet: JSBI.BigInt(0),
                price0: tickToPrice(token0, token1, activeTickIdxForPrice).toFixed(PRICE_FIXED_DIGITS),
                price1: tickToPrice(token1, token0, activeTickIdxForPrice).toFixed(PRICE_FIXED_DIGITS),
                liquidityGross: JSBI.BigInt(0),
            }

            // If our active tick happens to be initialized (i.e. there is a position that starts or
            // ends at that tick), ensure we set the gross and net.
            // correctly.
            const activeTick = tickIdxToInitializedTick[activeTickIdx]
            if (activeTick) {
                activeTickProcessed.liquidityGross = JSBI.BigInt(activeTick.liquidityGross)
                activeTickProcessed.liquidityNet = JSBI.BigInt(activeTick.liquidityNet)
            }

            enum Direction {
                ASC,
                DESC,
            }

            // Computes the numSurroundingTicks above or below the active tick.
            const computeSurroundingTicks = (
                activeTickProcessed,
                tickSpacing: number,
                numSurroundingTicks: number,
                direction: Direction
            ) => {
                let previousTickProcessed = {
                    ...activeTickProcessed,
                }

                // Iterate outwards (either up or down depending on 'Direction') from the active tick,
                // building active liquidity for every tick.
                let processedTicks = []
                for (let i = 0; i < numSurroundingTicks; i++) {
                    const currentTickIdx =
                        direction == Direction.ASC
                            ? previousTickProcessed.tickIdx + tickSpacing
                            : previousTickProcessed.tickIdx - tickSpacing

                    if (currentTickIdx < TickMath.MIN_TICK || currentTickIdx > TickMath.MAX_TICK) {
                        break
                    }

                    const currentTickProcessed = {
                        liquidityActive: previousTickProcessed.liquidityActive,
                        tickIdx: currentTickIdx,
                        liquidityNet: JSBI.BigInt(0),
                        price0: tickToPrice(token0, token1, currentTickIdx).toFixed(PRICE_FIXED_DIGITS),
                        price1: tickToPrice(token1, token0, currentTickIdx).toFixed(PRICE_FIXED_DIGITS),
                        liquidityGross: JSBI.BigInt(0),
                    }

                    // Check if there is an initialized tick at our current tick.
                    // If so copy the gross and net liquidity from the initialized tick.
                    const currentInitializedTick = tickIdxToInitializedTick[currentTickIdx.toString()]
                    if (currentInitializedTick) {
                        currentTickProcessed.liquidityGross = JSBI.BigInt(currentInitializedTick.liquidityGross)
                        currentTickProcessed.liquidityNet = JSBI.BigInt(currentInitializedTick.liquidityNet)
                    }

                    // Update the active liquidity.
                    // If we are iterating ascending and we found an initialized tick we immediately apply
                    // it to the current processed tick we are building.
                    // If we are iterating descending, we don't want to apply the net liquidity until the following tick.
                    if (direction == Direction.ASC && currentInitializedTick) {
                        currentTickProcessed.liquidityActive = JSBI.add(
                            previousTickProcessed.liquidityActive,
                            JSBI.BigInt(currentInitializedTick.liquidityNet)
                        )
                    } else if (direction == Direction.DESC && JSBI.notEqual(previousTickProcessed.liquidityNet, JSBI.BigInt(0))) {
                        // We are iterating descending, so look at the previous tick and apply any net liquidity.
                        currentTickProcessed.liquidityActive = JSBI.subtract(
                            previousTickProcessed.liquidityActive,
                            previousTickProcessed.liquidityNet
                        )
                    }

                    processedTicks.push(currentTickProcessed)
                    previousTickProcessed = currentTickProcessed
                }

                if (direction == Direction.DESC) {
                    processedTicks = processedTicks.reverse()
                }

                return processedTicks
            }

            const subsequentTicks = computeSurroundingTicks(
                activeTickProcessed,
                tickSpacing,
                numSurroundingTicks,
                Direction.ASC
            )

            const previousTicks = computeSurroundingTicks(
                activeTickProcessed,
                tickSpacing,
                numSurroundingTicks,
                Direction.DESC
            )

            const ticksProcessed = previousTicks.concat(activeTickProcessed).concat(subsequentTicks)

            setTicksResult({
                ticksProcessed,
                tickSpacing,
                activeTickIdx
            })

        } catch (err) {

        }

        setTicksLoading(false)

    }

    return {
        fetchTicksSurroundingPrice: { ticksResult, ticksLoading, fetchTicksSurroundingPriceFn: fetchTicksSurroundingPrice }
    }

}