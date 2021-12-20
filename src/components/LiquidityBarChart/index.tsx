import { useEffect, useMemo, useRef, useState } from 'react'
import { useInfoTickData } from '../../hooks/subgraph/useInfoTickData'
import BarChart from './BarChart'

// import { isAddress } from 'ethers'

import styled from 'styled-components/macro'

import { isMobile } from 'react-device-detect'
import Loader from '../Loader'
import { TickMath } from '@uniswap/v3-sdk'
import { FeeAmount } from '../../hooks/computePoolAddress'

import JSBI from 'jsbi'
import { isAddress } from '../../utils'

import { Token, CurrencyAmount } from '@uniswap/sdk-core'
import { Pool } from '../../lib/src'

import { BigNumber } from '@ethersproject/bignumber'

const Wrapper = styled.div`
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 10px;
  background-color: #052445;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-left: -1.3rem;
    margin-right: -1.3rem;
    width: unset;
    border-radius: 20px;
  `}
`
const MockLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 360px;
  padding: 0 16px;
  max-width: 1000px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `}
`

export default function LiquidityBarChart({
  data,
  token0,
  token1,
  refreshing,
}: {
  data: any
  token0: string
  token1: string
  refreshing: boolean
}) {
  // const [poolTickData, updatePoolTickData] = usePoolTickData(address)

  //   const [ticksToFetch, setTicksToFetch] = useState(INITIAL_TICKS_TO_FETCH)
  //   const amountTicks = ticksToFetch * 2 + 1

  const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1)

  const [processedData, setProcessedData] = useState(null)
  const ref = useRef(null)

  const formattedAddress0 = isAddress(data?.token0?.address)
  const formattedAddress1 = isAddress(data?.token1?.address)

  // parsed tokens
  const _token0 = useMemo(() => {
    return data && formattedAddress0 && formattedAddress1
      ? new Token(1, formattedAddress0, data.token0.decimals)
      : undefined
  }, [formattedAddress0, formattedAddress1, data])

  const _token1 = useMemo(() => {
    return data && formattedAddress1 && formattedAddress1
      ? new Token(1, formattedAddress1, data.token1.decimals)
      : undefined
  }, [formattedAddress1, data])

  useEffect(() => {
    if (!data || !data.ticksProcessed) return

    async function processTicks() {
      const _data = await Promise.all(
        data.ticksProcessed.map(async (t, i) => {
          const active = t.tickIdx === data.activeTickIdx
          const sqrtPriceX96 = TickMath.getSqrtRatioAtTick(t.tickIdx)
          const mockTicks = [
            {
              index: t.tickIdx - 60,
              liquidityGross: t.liquidityGross,
              liquidityNet: JSBI.multiply(t.liquidityNet, JSBI.BigInt('-1')),
            },
            {
              index: t.tickIdx,
              liquidityGross: t.liquidityGross,
              liquidityNet: t.liquidityNet,
            },
          ]
          const pool =
            token0 && token1
              ? new Pool(_token0, _token1, 500, sqrtPriceX96, t.liquidityActive, t.tickIdx, mockTicks)
              : undefined
          const nextSqrtX96 = data.ticksProcessed[i - 1]
            ? TickMath.getSqrtRatioAtTick(data.ticksProcessed[i - 1].tickIdx)
            : undefined
          const maxAmountToken0 = token0 ? CurrencyAmount.fromRawAmount(_token0, MAX_UINT128.toString()) : undefined
          const outputRes0 =
            pool && maxAmountToken0 ? await pool.getOutputAmount(maxAmountToken0, nextSqrtX96) : undefined

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
            token1: token1,
          }
        })
      )

      setProcessedData(_data)
    }

    processTicks()
  }, [data, token0, token1])

  const formattedData = useMemo(() => {
    if (!processedData) return undefined

    return processedData
  }, [processedData])

  return (
    <Wrapper ref={ref}>
      {refreshing ? (
        <MockLoading>
          <Loader stroke={'white'} size={'25px'} />
        </MockLoading>
      ) : (
        <BarChart
          data={formattedData || undefined}
          dimensions={{
            width: isMobile ? ref?.current?.offsetWidth || 0 : 850,
            height: 300,
            margin: { top: 30, right: 0, bottom: isMobile ? 70 : 30, left: 0 },
          }}
          isMobile={isMobile}
        />
      )}
    </Wrapper>
  )
}
