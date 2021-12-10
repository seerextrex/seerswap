import { useMemo } from 'react'
import { Position } from 'lib/src'
import Badge from 'components/Badge'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { usePool } from 'hooks/usePools'
import { useToken } from 'hooks/Tokens'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'
import { HideSmall, MEDIA_WIDTHS, SmallOnly } from 'theme'
import { PositionDetails } from 'types/position'
import { Price, Token, Percent } from '@uniswap/sdk-core'
import { formatTickPrice } from 'utils/formatTickPrice'
import Loader from 'components/Loader'
import { unwrappedToken } from 'utils/unwrappedToken'
import RangeBadge from 'components/Badge/RangeBadge'
import { RowBetween } from 'components/Row'
import HoverInlineText from 'components/HoverInlineText'
import { USDC_POLYGON, USDT_POLYGON, WMATIC_EXTENDED } from '../../constants/tokens'
import { Trans } from '@lingui/macro'
import useIsTickAtLimit from 'hooks/useIsTickAtLimit'
import { Bound } from 'state/mint/v3/actions'

import { ArrowRight } from 'react-feather'
import usePrevious from '../../hooks/usePrevious'

const LinkRow = styled(Link)`
  align-items: center;
  border-radius: 20px;
  display: flex;
  cursor: pointer;
  user-select: none;
  display: flex;
  flex-direction: column;

  justify-content: space-between;
  color: ${({ theme }) => theme.text1};
  margin: 8px 0;
  padding: 16px;
  text-decoration: none;
  font-weight: 500;
  // background-color: ${({ theme }) => theme.bg1};
  background-color: rgba(5, 4, 11, 0.7);

  &:last-of-type {
    margin: 8px 0 0 0;
  }
  & > div:not(:first-child) {
    text-align: center;
  }

  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    /* flex-direction: row; */
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    row-gap: 12px;
  `};

  ${({ onFarming }) =>
    onFarming &&
    css`
      border: 1px solid #702498;
      background-color: rgba(25, 24, 30, 0.7);
    `}
`

const BadgeText = styled.div`
  font-weight: 500;
  font-size: 14px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 12px;
  `};
`

const OnFarmingBadge = styled(Link)`
  display: flex;
  align-items: center;
  padding: 4px 6px;
  background-color: #702498;
  color: white;
  font-size: 14px;
  border-radius: 6px;
  text-decoration: none;
`

const DataLineItem = styled.div`
  font-size: 14px;
`

const RangeLineItem = styled(DataLineItem)`
  display: flex;
  flex-direction: row;
  align-items: center;

  margin-top: 4px;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  background-color: ${({ theme }) => theme.bg2};
    border-radius: 12px;
    padding: 8px 0;
`};
`

const DoubleArrow = styled.span`
  margin: 0 2px;
  color: ${({ theme }) => theme.text3};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 4px;
    padding: 20px;
  `};
`

const RangeText = styled.span`
  /* background-color: ${({ theme }) => theme.bg2}; */
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
`

const ExtentsText = styled.span`
  color: ${({ theme }) => theme.text3};
  font-size: 14px;
  margin-right: 4px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const PrimaryPositionIdData = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  > * {
    margin-right: 8px;
  }
`

const DataText = styled.div`
  font-weight: 600;
  font-size: 18px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
  `};
`

interface PositionListItemProps {
  positionDetails: PositionDetails
}

export function getPriceOrderingFromPositionForUI(position?: Position): {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
} {
  if (!position) {
    return {}
  }

  const token0 = position.amount0.currency
  const token1 = position.amount1.currency

  // if token0 is a dollar-stable asset, set it as the quote token
  // const stables = [USDC_BINANCE, USDC_KOVAN]
  const stables = [USDC_POLYGON, USDT_POLYGON]
  if (stables.some((stable) => stable.equals(token0))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // if token1 is an ETH-/BTC-stable asset, set it as the base token
  //TODO
  // const bases = [...Object.values(WMATIC_EXTENDED), WBTC]
  const bases = [...Object.values(WMATIC_EXTENDED)]
  if (bases.some((base) => base.equals(token1))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // if both prices are below 1, invert
  if (position.token0PriceUpper.lessThan(1)) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // otherwise, just return the default
  return {
    priceLower: position.token0PriceLower,
    priceUpper: position.token0PriceUpper,
    quote: token1,
    base: token0,
  }
}

export default function PositionListItem({ positionDetails }: PositionListItemProps) {
  const {
    token0: token0Address,
    token1: token1Address,
    fee: feeAmount,
    liquidity,
    tickLower,
    tickUpper,
    onFarming,
  } = positionDetails || {}

  const prevPositionDetails = usePrevious({ ...positionDetails })
  const {
    token0: _token0Address,
    token1: _token1Address,
    fee: _feeAmount,
    liquidity: _liquidity,
    tickLower: _tickLower,
    tickUpper: _tickUpper,
    onFarming: _onFarming,
  } = useMemo(() => {
    if (!positionDetails && prevPositionDetails && prevPositionDetails.liquidity) {
      return { ...prevPositionDetails }
    }
    return { ...positionDetails }
  }, [positionDetails])

  const token0 = useToken(_token0Address)
  const token1 = useToken(_token1Address)

  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  // construct Position from details returned
  const [, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined, _feeAmount)
  const prevPool = usePrevious(pool)
  const _pool = useMemo(() => {
    if (!pool && prevPool) {
      return prevPool
    }
    return pool
  }, [pool])

  const position = useMemo(() => {
    if (_pool) {
      return new Position({
        pool: _pool,
        liquidity: _liquidity.toString(),
        tickLower: _tickLower,
        tickUpper: _tickUpper,
      })
    }
    return undefined
  }, [_liquidity, _pool, _tickLower, _tickUpper])

  const tickAtLimit = useIsTickAtLimit(_tickLower, _tickUpper)

  // prices
  const { priceLower, priceUpper, quote, base } = getPriceOrderingFromPositionForUI(position)

  const currencyQuote = quote && unwrappedToken(quote)
  const currencyBase = base && unwrappedToken(base)

  // check if price is within range
  const outOfRange: boolean = _pool ? _pool.tickCurrent < _tickLower || _pool.tickCurrent >= _tickUpper : false

  const positionSummaryLink = '/pool/' + positionDetails.tokenId

  const farmingLink = `/farming/farms#${positionDetails.tokenId}`

  const removed = _liquidity?.eq(0)

  return (
    <LinkRow to={positionSummaryLink} onFarming={_onFarming}>
      <RowBetween>
        <PrimaryPositionIdData>
          <DoubleCurrencyLogo currency0={currencyBase} currency1={currencyQuote} size={18} margin />
          <DataText>
            &nbsp;{currencyQuote?.symbol}&nbsp;/&nbsp;{currencyBase?.symbol}
          </DataText>
          &nbsp;
          {/* <Badge>
            <BadgeText><Trans>{new Percent(feeAmount, 1_000_000).toSignificant()}%</Trans></BadgeText>
          </Badge> */}
          {_onFarming && (
            <OnFarmingBadge to={farmingLink}>
              <span>Farming</span>
              <ArrowRight size={14} color={'white'} style={{ marginLeft: '5px' }} />
            </OnFarmingBadge>
          )}
        </PrimaryPositionIdData>
        <RangeBadge removed={removed} inRange={!outOfRange} />
      </RowBetween>

      {priceLower && priceUpper ? (
        <RangeLineItem>
          <RangeText>
            <ExtentsText>
              <Trans>Min: </Trans>
            </ExtentsText>
            <Trans>
              {formatTickPrice(priceLower, tickAtLimit, Bound.LOWER)} <HoverInlineText text={currencyQuote?.symbol} />{' '}
              per <HoverInlineText text={currencyBase?.symbol ?? ''} />
            </Trans>
          </RangeText>{' '}
          <HideSmall>
            <DoubleArrow>⟷</DoubleArrow>{' '}
          </HideSmall>
          <SmallOnly>
            <DoubleArrow>⟷</DoubleArrow>{' '}
          </SmallOnly>
          <RangeText>
            <ExtentsText>
              <Trans>Max:</Trans>
            </ExtentsText>
            <Trans>
              {formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER)} <HoverInlineText text={currencyQuote?.symbol} />{' '}
              per <HoverInlineText maxCharacters={10} text={currencyBase?.symbol} />
            </Trans>
          </RangeText>
        </RangeLineItem>
      ) : (
        <Loader />
      )}
    </LinkRow>
  )
}
