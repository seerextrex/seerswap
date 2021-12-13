import { POOL_DEPLOYER_ADDRESS } from '../constants/addresses'
import { Token, Currency } from '@uniswap/sdk-core'
import { useMemo } from 'react'
import { useActiveWeb3React } from './web3'
import { useMultipleContractSingleData } from '../state/multicall/hooks'

import { Pool, FeeAmount } from 'lib/src'
import { Interface } from '@ethersproject/abi'
import abi from '../abis/pool.json'
import { computePoolAddress } from './computePoolAddress'
import { usePoolDynamicFee } from "./usePoolDynamicFee"

const POOL_STATE_INTERFACE = new Interface(abi)

export enum PoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePools(
  poolKeys: [Currency | undefined, Currency | undefined][]
): [PoolState, Pool | null][] {
  const { chainId } = useActiveWeb3React()

  const transformed: ([Token, Token] | null)[] = useMemo(() => {
    return poolKeys.map(([currencyA, currencyB]) => {
      if (!chainId || !currencyA || !currencyB) return null

      const tokenA = currencyA?.wrapped
      const tokenB = currencyB?.wrapped
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return null
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [token0, token1]
    })
  }, [chainId, poolKeys])

  const poolAddresses: (string | undefined)[] = useMemo(() => {
    const poolDeployerAddress = chainId && POOL_DEPLOYER_ADDRESS[chainId]

    return transformed.map((value) => {
      if (!poolDeployerAddress || !value) return undefined
      return computePoolAddress({
        poolDeployer: poolDeployerAddress,
        tokenA: value[0],
        tokenB: value[1]
      })
    })
  }, [chainId, transformed])

  const globalState0s = useMultipleContractSingleData(poolAddresses, POOL_STATE_INTERFACE, 'globalState')
  const liquidities = useMultipleContractSingleData(poolAddresses, POOL_STATE_INTERFACE, 'liquidity')

  return useMemo(() => {
    return poolKeys.map((_key, index) => {
      const [token0, token1] = transformed[index] ?? []
      if (!token0 || !token1) return [PoolState.INVALID, null]

      const { result: globalState, loading: globalStateLoading, valid: globalStateValid } = globalState0s[index]
      const { result: liquidity, loading: liquidityLoading, valid: liquidityValid } = liquidities[index]

      if (!globalStateValid || !liquidityValid) return [PoolState.INVALID, null]
      if (globalStateLoading || liquidityLoading) return [PoolState.LOADING, null]

      if (!globalState || !liquidity) return [PoolState.NOT_EXISTS, null]

      if (!globalState.price || globalState.price.eq(0)) return [PoolState.NOT_EXISTS, null]

      try {
        return [PoolState.EXISTS, new Pool(token0, token1, globalState.fee, globalState.price, liquidity[0], globalState.tick)]
      } catch (error) {
        return [PoolState.NOT_EXISTS, null]
      }
    })
  }, [liquidities, poolKeys, globalState0s, transformed])
}

export function usePool(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  // feeAmount: FeeAmount | undefined
): [PoolState, Pool | null] {
  const poolKeys: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [[currencyA, currencyB]],
    [currencyA, currencyB]
  )

  return usePools(poolKeys)[0]
}

