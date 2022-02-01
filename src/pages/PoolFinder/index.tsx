import { Trans } from '@lingui/macro'
import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus } from 'react-feather'
import { useLocation } from 'react-router'
import { Text } from 'rebass'
import { ButtonDropdownLight } from '../../components/Button'
import { LightCard } from '../../components/Card'
import { BlueCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import CurrencyLogo from '../../components/CurrencyLogo'
import { FindPoolTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row from '../../components/Row'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import { ExtendedEther } from '../../constants/tokens'
import usePrevious from '../../hooks/usePrevious'
import { PairState, useV2Pair } from '../../hooks/useV2Pairs'
import { useActiveWeb3React } from '../../hooks/web3'
import { usePairAdder } from '../../state/user/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { TYPE } from '../../theme'
import AppBody from '../AppBody'
import { Dots } from '../Pool/styleds'
import { Helmet } from 'react-helmet'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function PoolFinder() {
  const query = useQuery()

  const { account, chainId } = useActiveWeb3React()

  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

  const [currency0, setCurrency0] = useState<Currency | null>(() => (chainId ? ExtendedEther.onChain(chainId) : null))
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  const [pairState, pair] = useV2Pair(currency0 ?? undefined, currency1 ?? undefined)
  const [sushiPairState, sushiPair] = useV2Pair(currency0 ?? undefined, currency1 ?? undefined, true)

  const [prevPairState, prevPair] = usePrevious([pairState, pair]) || []
  const [_pairState, _pair] = useMemo(() => {
    if (!pairState && !pair && prevPairState && prevPair) {
      return [prevPairState, prevPair]
    }
    return [pairState, pair]
  }, [pairState, pair])

  const [prevSushiPairState, prevSushiPair] = usePrevious([sushiPairState, sushiPair]) || []
  const [_sushiPairState, _sushiPair] = useMemo(() => {
    if (!sushiPairState && !sushiPair && prevSushiPairState && prevSushiPair) {
      return [prevSushiPairState, prevSushiPair]
    }
    return [sushiPairState, sushiPair]
  }, [sushiPairState, sushiPair])

  const addPair = usePairAdder()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
    if (sushiPair) {
      addPair(sushiPair)
    }
  }, [pair, sushiPair, addPair])

  const position: CurrencyAmount<Token> | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const prevPosition = usePrevious(position)
  const _position = useMemo(() => {
    if (!position && prevPosition) {
      return prevPosition
    }
    return position
  }, [position])

  const hasPosition = Boolean(_position && JSBI.greaterThan(_position.quotient, JSBI.BigInt(0)))
  const prevHasPosition = usePrevious(hasPosition)
  const _hasPosition = useMemo(() => {
    if (!hasPosition && prevHasPosition) {
      return prevHasPosition
    }
    return hasPosition
  }, [hasPosition])

  const sushiPosition: CurrencyAmount<Token> | undefined = useTokenBalance(
    account ?? undefined,
    sushiPair?.liquidityToken
  )
  const prevSushiPosition = usePrevious(sushiPosition)
  const _sushiPosition = useMemo(() => {
    if (!sushiPosition && prevSushiPosition) {
      return prevSushiPosition
    }
    return sushiPosition
  }, [sushiPosition])

  const hasSushiPosition = Boolean(_sushiPosition && JSBI.greaterThan(_sushiPosition.quotient, JSBI.BigInt(0)))
  const prevHasSushiPosition = usePrevious(hasSushiPosition)
  const _hasSushiPosition = useMemo(() => {
    if (!hasSushiPosition && prevHasSushiPosition) {
      return prevHasSushiPosition
    }
    return hasSushiPosition
  }, [hasSushiPosition])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField]
  )

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false)
  }, [setShowSearch])

  return (
    <>
      <Helmet>
        <title>Algebra — Find Pool</title>
      </Helmet>
      <AppBody style={{ padding: '10px 30px' }}>
        <FindPoolTabs origin={query.get('origin') ?? '/migrate'} />
        <AutoColumn style={{ padding: '1rem' }} gap="md">
          <BlueCard style={{ backgroundColor: '#3d76a9' }}>
            <AutoColumn gap="10px">
              <TYPE.link fontWeight={400} color={'primaryText1'}>
                <Trans>Select a token to find your liquidity on SushiSwap or QuickSwap.</Trans>
              </TYPE.link>
            </AutoColumn>
          </BlueCard>
          <ButtonDropdownLight
            onClick={() => {
              setShowSearch(true)
              setActiveField(Fields.TOKEN0)
            }}
          >
            {currency0 ? (
              <Row>
                <CurrencyLogo currency={currency0} />
                <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                  {currency0.symbol}
                </Text>
              </Row>
            ) : (
              <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                <Trans>Select a token</Trans>
              </Text>
            )}
          </ButtonDropdownLight>

          <ColumnCenter>
            <Plus size="16" color="white" />
          </ColumnCenter>

          <ButtonDropdownLight
            onClick={() => {
              setShowSearch(true)
              setActiveField(Fields.TOKEN1)
            }}
          >
            {currency1 ? (
              <Row>
                <CurrencyLogo currency={currency1} />
                <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                  {currency1.symbol}
                </Text>
              </Row>
            ) : (
              <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                <Trans>Select a token</Trans>
              </Text>
            )}
          </ButtonDropdownLight>

          {_hasPosition ||
            (_hasSushiPosition && (
              <ColumnCenter
                style={{ justifyItems: 'center', backgroundColor: '', padding: '12px 0px', borderRadius: '12px' }}
              >
                <Text textAlign="center" fontWeight={500}>
                  <Trans>Pool Found!</Trans>
                </Text>
              </ColumnCenter>
            ))}
          {currency0 && currency1 ? (
            _pairState === PairState.EXISTS || _sushiPairState === PairState.EXISTS ? (
              <>
                {_sushiPairState === PairState.EXISTS ? (
                  _hasSushiPosition &&
                  _sushiPair && <MinimalPositionCard sushi={true} pair={_sushiPair} border="1px solid #CED0D9" />
                ) : (
                  <></>
                )}
                {_pairState === PairState.EXISTS ? (
                  _hasPosition && _pair && <MinimalPositionCard pair={_pair} border="1px solid #CED0D9" />
                ) : (
                  <></>
                )}
              </>
            ) : _pairState === PairState.INVALID && _sushiPairState === PairState.INVALID ? (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center" fontWeight={500}>
                    <Trans>Invalid pair.</Trans>
                  </Text>
                </AutoColumn>
              </LightCard>
            ) : _pairState === PairState.LOADING || _sushiPairState === PairState.LOADING ? (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center">
                    <Trans>Loading</Trans>
                    <Dots />
                  </Text>
                </AutoColumn>
              </LightCard>
            ) : null
          ) : null}
        </AutoColumn>

        <CurrencySearchModal
          isOpen={showSearch}
          onCurrencySelect={handleCurrencySelect}
          onDismiss={handleSearchDismiss}
          showCommonBases
          selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
        />
      </AppBody>
      <SwitchLocaleLink />
    </>
  )
}
