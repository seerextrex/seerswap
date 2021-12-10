import { getCreate2Address } from '@ethersproject/address'
import { keccak256, pack } from '@ethersproject/solidity'
import { Trans } from '@lingui/macro'
import { Token } from '@uniswap/sdk-core'
import { Pair } from '@uniswap/v2-sdk'
import MigrateSushiPositionCard from 'components/PositionCard/Sushi'
import MigrateV2PositionCard from 'components/PositionCard/V2'
import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import { PairState, useV2Pairs } from 'hooks/useV2Pairs'
import { ReactNode, useContext, useMemo } from 'react'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components/macro'

import { LightCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import QuestionHelper from '../../components/QuestionHelper'
import { AutoRow } from '../../components/Row'
import { Dots } from '../../components/swap/styleds'
import { V2_FACTORY_ADDRESSES } from '../../constants/addresses'
import { useIsNetworkFailed } from '../../hooks/useIsNetworkFailed'
import usePrevious, { usePreviousNonEmptyArray } from '../../hooks/usePrevious'
import { useActiveWeb3React } from '../../hooks/web3'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { BackArrow, StyledInternalLink, TYPE } from '../../theme'
import { BodyWrapper } from '../AppBody'

const MigrateSushiPositionCardStyled = styled(MigrateSushiPositionCard)`
`
import { Helmet } from 'react-helmet'

function EmptyState({ message }: { message: ReactNode }) {
  return (
    <AutoColumn style={{ minHeight: 200, justifyContent: 'center', alignItems: 'center' }}>
      <TYPE.body>{message}</TYPE.body>
    </AutoColumn>
  )
}

// quick hack because sushi init code hash is different
const computeSushiPairAddress = ({ tokenA, tokenB }: { tokenA: Token; tokenB: Token }): string => {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
  return getCreate2Address(
    '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
    keccak256(['bytes'], [pack(['address', 'address'], [token0.address, token1.address])]),
    '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303'
  )
}

/**
 * Given two tokens return the sushiswap liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
function toSushiLiquidityToken([tokenA, tokenB]: [Token, Token]): Token {
  return new Token(tokenA.chainId, computeSushiPairAddress({ tokenA, tokenB }), 18, 'SLP', 'SushiSwap LP Token')
}

export default function MigrateV2() {
  const theme = useContext(ThemeContext)
  const { account, chainId } = useActiveWeb3React()

  const networkFailed = useIsNetworkFailed()

  const v2FactoryAddress = chainId ? V2_FACTORY_ADDRESSES[chainId] : undefined

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

  // calculate v2 + sushi pair contract addresses for all token pairs
  const tokenPairsWithLiquidityTokens = useMemo(() => {
    return trackedTokenPairs.map((tokens) => {
      // sushi liquidity token or null
      const sushiLiquidityToken = chainId === 137 || chainId === 42 ? toSushiLiquidityToken(tokens) : null

      return {
        v2liquidityToken: v2FactoryAddress ? toV2LiquidityToken(tokens) : undefined,
        sushiLiquidityToken,
        tokens,
      }
    })
  }, [trackedTokenPairs, chainId, v2FactoryAddress])

  //  get pair liquidity token addresses for balance-fetching purposes
  const allLiquidityTokens = useMemo(() => {
    const v2 = tokenPairsWithLiquidityTokens.map(({ v2liquidityToken }) => v2liquidityToken)
    const sushi = tokenPairsWithLiquidityTokens
      .map(({ sushiLiquidityToken }) => sushiLiquidityToken)
      .filter((token): token is Token => !!token)

    return [...v2, ...sushi]
  }, [tokenPairsWithLiquidityTokens])

  // fetch pair balances
  const [pairBalances, fetchingPairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    allLiquidityTokens
  )

  // filter for v2 liquidity tokens that the user has a balance in
  const tokenPairsWithV2Balance = useMemo(() => {
    if (fetchingPairBalances) return []

    return tokenPairsWithLiquidityTokens
      .filter(({ v2liquidityToken }) => v2liquidityToken && pairBalances[v2liquidityToken.address]?.greaterThan(0))
      .map((tokenPairsWithLiquidityTokens) => tokenPairsWithLiquidityTokens.tokens)
  }, [fetchingPairBalances, tokenPairsWithLiquidityTokens, pairBalances])

  // filter for v2 liquidity tokens that the user has a balance in
  const tokenPairsWithSushiBalance = useMemo(() => {
    if (fetchingPairBalances) return []

    return tokenPairsWithLiquidityTokens
      .filter(
        ({ sushiLiquidityToken }) => !!sushiLiquidityToken && pairBalances[sushiLiquidityToken.address]?.greaterThan(0)
      )
      .map((tokenPairsWithLiquidityTokens) => tokenPairsWithLiquidityTokens.tokens)
  }, [fetchingPairBalances, tokenPairsWithLiquidityTokens, pairBalances])

  const v2Pairs = useV2Pairs(tokenPairsWithV2Balance)
  const previousv2Pairs = usePreviousNonEmptyArray(v2Pairs)
  const _v2Pairs = useMemo(() => {
    if (v2Pairs.length === 0 && previousv2Pairs) {
      return previousv2Pairs
    }

    return v2Pairs
  }, [v2Pairs])

  const v2SushiPairs = useV2Pairs(tokenPairsWithSushiBalance, true)
  const previousv2SushiPairs = usePreviousNonEmptyArray(v2SushiPairs)
  const _v2SushiPairs = useMemo(() => {
    if (v2SushiPairs.length === 0 && previousv2SushiPairs) {
      return previousv2SushiPairs
    }

    return v2SushiPairs
  }, [v2SushiPairs])

  const v2IsLoading =
    fetchingPairBalances ||
    v2Pairs.some(([pairState]) => pairState === PairState.LOADING) ||
    v2SushiPairs.some(([pairState]) => pairState === PairState.LOADING)

  return (
    <>
      <Helmet>
        <title>Algebra — Migrate Liquidity</title>
      </Helmet>
      <BodyWrapper style={{ padding: 24 }}>
        <AutoColumn gap="16px">
          <AutoRow style={{ alignItems: 'center', justifyContent: 'center' }} gap="8px">
            <TYPE.mediumHeader>Migrate Liquidity</TYPE.mediumHeader>
          </AutoRow>

          <TYPE.body style={{ marginBottom: 8, fontWeight: 400, textAlign: 'center' }}>
            Click Migrate to transfer your liquidity from SushiSwap or QuickSwap to Algebra.
          </TYPE.body>

          {!account ? (
            <LightCard padding="40px">
              <TYPE.body color={theme.text3} textAlign="center">
                Connect to a wallet to view your liquidity.
              </TYPE.body>
            </LightCard>
          ) : v2IsLoading && !networkFailed ? (
            <LightCard padding="40px">
              <TYPE.body color={theme.text3} textAlign="center">
                <Dots>Loading</Dots>
              </TYPE.body>
            </LightCard>
          ) : _v2Pairs.filter(([, pair]) => !!pair).length > 0 ||
            _v2SushiPairs.filter(([, pair]) => !!pair).length > 0 ? (
            <>
              {_v2Pairs.filter(([, pair]) => !!pair).length > 0 && (
                <>
                  {_v2Pairs
                    .filter(([, pair]) => !!pair)
                    .map(([, pair]) => (
                      <MigrateV2PositionCard key={(pair as Pair).liquidityToken.address} pair={pair as Pair} />
                    ))}
                </>
              )}
              {_v2SushiPairs.filter(([, pair]) => !!pair).length > 0 && (
                <>
                  {_v2SushiPairs
                    .filter(([, pair]) => !!pair)
                    .map(([, pair]) => (
                      <MigrateV2PositionCard
                        key={(pair as Pair).liquidityToken.address}
                        sushi={true}
                        pair={pair as Pair}
                      />
                    ))}
                </>
              )}
            </>
          ) : (
            <EmptyState message={'No liquidity found.'} />
          )}
          <AutoColumn justify={'center'} gap="md">
            <Text textAlign="center" fontSize={14} style={{ padding: '.5rem 0 .5rem 0' }}>
              Don’t see one of your pools?{' '}
              <StyledInternalLink id="import-pool-link" to={'/pool/find'}>
                Find it.
              </StyledInternalLink>
            </Text>
          </AutoColumn>
        </AutoColumn>
      </BodyWrapper>
      <SwitchLocaleLink />
    </>
  )
}
