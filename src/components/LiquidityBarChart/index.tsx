import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import BarChart from './BarChart'
import { isMobile } from 'react-device-detect'
import Loader from '../Loader'
import { TickMath } from '@uniswap/v3-sdk'
import { computePoolAddress } from '../../hooks/computePoolAddress'
import JSBI from 'jsbi'
import { isAddress } from '../../utils'
import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { Pool } from '../../lib/src'
import { BigNumber } from '@ethersproject/bignumber'
import { POOL_DEPLOYER_ADDRESS } from '../../constants/addresses'
import { MockLoading, Wrapper, ZoomButton, ZoomButtonsWrapper } from './styled'
import { SupportedChainId } from '../../constants/chains'
import { LiquidityChartData, ProcessedData } from '../../models/interfaces'
import './index.scss'

interface LiquidityBarChartProps {
    data: LiquidityChartData
    token0: string
    token1: string
    refreshing: boolean
}

export default function LiquidityBarChart({ data, token0, token1, refreshing }: LiquidityBarChartProps) {
    const [zoom, setZoom] = useState(5)

    const MAX_ZOOM = 10

    const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1)

    const [processedData, setProcessedData] = useState<ProcessedData[] | null>(null)
    const ref = useRef<HTMLDivElement>(null)

    const formattedAddress0 = isAddress(data?.token0?.address)
    const formattedAddress1 = isAddress(data?.token1?.address)

    // parsed tokens
    const _token0 = useMemo(() => {
        return data && formattedAddress0 && formattedAddress1
            ? new Token(SupportedChainId.POLYGON, formattedAddress0, +data.token0.decimals) : undefined
    }, [formattedAddress0, formattedAddress1, data])

    const _token1 = useMemo(() => {
        return data && formattedAddress0 && formattedAddress1
            ? new Token(SupportedChainId.POLYGON, formattedAddress1, +data.token1.decimals) : undefined
    }, [formattedAddress1, data])

    useEffect(() => {
        if (!data || !data.ticksProcessed) return

        async function processTicks() {
            const _data = await Promise.all(
                data.ticksProcessed.map(async (t: any, i: number) => {
                    const active = t.tickIdx === data.activeTickIdx
                    const sqrtPriceX96 = TickMath.getSqrtRatioAtTick(t.tickIdx)
                    const mockTicks = [
                        {
                            index: t.tickIdx - 60,
                            liquidityGross: t.liquidityGross,
                            liquidityNet: JSBI.multiply(t.liquidityNet, JSBI.BigInt('-1'))
                        },
                        {
                            index: t.tickIdx,
                            liquidityGross: t.liquidityGross,
                            liquidityNet: t.liquidityNet
                        }
                    ]
                    const pool = _token0 && _token1 ? new Pool(_token0, _token1, 500, sqrtPriceX96, t.liquidityActive, t.tickIdx, mockTicks) : undefined
                    const nextSqrtX96 = data.ticksProcessed[i - 1] ? TickMath.getSqrtRatioAtTick(data.ticksProcessed[i - 1].tickIdx) : undefined

                    const isBad = _token0 && _token1 &&
                        ['0x49c1c3ac4f301ad71f788398c0de919c35eaf565', '0xc3c4074fbc2d504fb8ccd28e3ae46914a1ecc5ed']
                            .includes(computePoolAddress({
                                poolDeployer: POOL_DEPLOYER_ADDRESS[137],
                                tokenA: _token0,
                                tokenB: _token1
                            }).toLowerCase())

                    const maxAmountToken0 = _token0 ? CurrencyAmount.fromRawAmount(isBad ? _token1 : _token0, MAX_UINT128.toString()) : undefined
                    const outputRes0 = pool && maxAmountToken0 ? await pool.getOutputAmount(maxAmountToken0, nextSqrtX96) : undefined

                    const token1Amount = outputRes0?.[0] as CurrencyAmount<Token> | undefined

                    const amount0 = token1Amount ? parseFloat(token1Amount.toExact()) * parseFloat(t.price1) : 0
                    const amount1 = token1Amount ? parseFloat(token1Amount.toExact()) : 0

                    return {
                        index: i,
                        isCurrent: active,
                        activeLiquidity: parseFloat(t.liquidityActive.toString()),
                        price0: parseFloat(t.price0),
                        price1: parseFloat(t.price1),
                        tvlToken0: amount0,
                        tvlToken1: amount1,
                        token0: token0,
                        token1: token1
                    }
                })
            )
            setProcessedData(_data)
        }

        processTicks()
    }, [data, token0, token1])

    const formattedData = useMemo(() => {
        if (!processedData) return undefined
        if (processedData && processedData.length === 0) return undefined

        if (zoom === 1) return processedData

        const middle = Math.round(processedData.length / 2)
        const chunkLength = Math.round(processedData.length / zoom)

        return processedData.slice(middle - chunkLength, middle + chunkLength)
    }, [processedData, zoom])

    const activeTickIdx = useMemo(() => {
        if (!formattedData) return

        let idx
        for (const i of formattedData) {
            if (i.isCurrent) {
                idx = i.index
            }
        }

        return idx
    }, [formattedData, zoom])

    const handleZoomIn = useCallback(() => {
        if (zoom < MAX_ZOOM) {
            setZoom(zoom + 1)
        }
    }, [processedData, zoom])

    const handleZoomOut = useCallback(() => {
        if (zoom > 0) {
            setZoom(zoom - 1)
        }
    }, [processedData, zoom])

    return (
        <div className={'w-100 liquidity-chart'} ref={ref}>
            {refreshing ? (
                <div className={'liquidity-chart__mock-loader'}>
                    <Loader stroke={'white'} size={'25px'} />
                </div>
            ) : (
                <>
                    <div className={'liquidity-chart__zoom-buttons'}>
                        <button className={'liquidity-chart__zoom-buttons__button'} disabled={zoom === MAX_ZOOM} onClick={handleZoomIn}>
                            +
                        </button>
                        <button className={'liquidity-chart__zoom-buttons__button'} disabled={zoom === 2} onClick={handleZoomOut}>
                            -
                        </button>
                    </div>
                    <BarChart
                        data={formattedData || undefined}
                        activeTickIdx={activeTickIdx}
                        dimensions={{
                            width: isMobile ? ref && ref.current && ref.current.offsetWidth - 10 || 0 : 1020,
                            height: 400,
                            margin: { top: 30, right: 20, bottom: isMobile ? 70 : 30, left: 50 }
                        }}
                        isMobile={isMobile}
                    />
                </>
            )}
        </div>
    )
}
