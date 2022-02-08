import React, { useCallback, useState, useMemo, useEffect } from 'react'
import styled, { css } from 'styled-components/macro'
import { Link, NavLink } from 'react-router-dom'
import { TYPE } from 'theme'
import { DarkGreyCard, GreyBadge } from 'components/Card'
import Loader, { LoadingRows } from 'components/Loader'
import { AutoColumn } from 'components/Column'
import { RowFixed } from 'components/Row'
import { formatDollarAmount, formatPercent } from 'utils/numbers'
import { PoolData } from 'state/pools/reducer'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { feeTierPercent } from 'utils'
import { ClickableText, Label } from 'components/Text'
import useTheme from 'hooks/useTheme'
import { useActiveWeb3React } from '../../hooks/web3'
import { BarChart2, ExternalLink, HelpCircle } from 'react-feather'
import { log } from 'util'

export const PageButtons = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.2em;
    margin-bottom: 0.5em;
`

export const Arrow = styled.div<{ faded: boolean }>`
    color: white;
    opacity: ${(props) => (props.faded ? 0.3 : 1)};
    padding: 0 20px;
    user-select: none;

    :hover {
        cursor: pointer;
    }
`

const LabelStyled = styled(Label)`
  font-size: 14px;
  justify-content: ${({ center }) => (center ? 'center' : 'flex-start')};
`

const ClickableTextStyled = styled(ClickableText)`
  font-size: 14px;
  align-items: center;
  justify-content: ${({ center }) => (center ? 'center' : 'flex-start')};
  text-align: start;

  &:hover {
    opacity: 1;
  }
`

const Wrapper = styled(DarkGreyCard)`
    width: 100%;
    background-color: rgba(60, 97, 126, 0.5);
    ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: 900px;
  `};
`

const ResponsiveGrid = styled.div`
    display: grid;
    position: relative;
    grid-gap: 1em;
    align-items: center;

  grid-template-columns: 20px 2.3fr repeat(5, 1fr);

  @media screen and (max-width: 1000px) {
    grid-template-columns: 20px 2.1fr repeat(5, 1fr);
  }

    //@media screen and (max-width: 500px) {
    //  grid-template-columns: 20px 1.5fr repeat(1, 1fr);
    //  & :nth-child(5) {
    //    display: none;
    //  }
    //}
    //
    //@media screen and (max-width: 480px) {
    //  grid-template-columns: 2.5fr repeat(1, 1fr);
    //  > *:nth-child(1) {
    //    display: none;
    //  }
    //}
`

const ChartBadge = styled(NavLink)`
    background: #36f;
    margin-left: 10px;
    border-radius: 6px;
    padding: 2px 3px;

    & > * {
        display: block;
    }
`

const AprInfo = styled.span`
    background-color: #02365e;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 10px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 0;
    z-index: 101;
`

const LinkWrapper = styled.a`
    display: flex;
    text-decoration: none;

    svg {
        margin-left: 8px;
    }
`

const HelperDropdown = styled.span`
  position: absolute;
  display: none;
  right: 0;
  font-size: 12px;
  bottom: -2.5rem;
  padding: 7px 9px;
  white-space: nowrap;
  background: white;
  border-radius: 4px;
  color: black;
  z-index: 30;
`
const HelperDropdownPart = styled.span`
  padding: 2px 6px;
  background-color: #d6d6d6;
  border-radius: 4px;
  color: #2d2d2d;
`

const APRWrapper = styled.span`
  position: relative;
  &:hover {
    & > ${HelperDropdown} {
      display: block;
    }
  }
`

const FarmingLink = styled(NavLink)<{ apr: boolean }>`
  color: white;
  text-decoration: none;

  ${({ apr }) =>
    apr &&
    css`
      padding: 4px;
      border-radius: 3px;
      color: white;
      background-color: #36f;
      text-decoration: underline;

      &:hover {
        color: #01ffff;
      }
    `}
`

const SORT_FIELD = {
  feeTier: 'feeTier',
  volumeUSD: 'volumeUSD',
  tvlUSD: 'tvlUSD',
  volumeUSDWeek: 'volumeUSDWeek',
  feesUSD: 'feesUSD',
  apr: 'apr',
  farmingApr: 'farmingApr',
}

export const POOL_HIDE = [
    '0x86d257cdb7bc9c0df10e84c8709697f92770b335',
    '0xf8dbd52488978a79dfe6ffbd81a01fc5948bf9ee',
    '0x8fe8d9bb8eeba3ed688069c3d6b556c9ca258248'
]

const DataRow = ({ poolData, index }: { poolData: PoolData; index: number }) => {
    const { chainId } = useActiveWeb3React()

  const poolTitle = useMemo(() => {
    if (poolData.token0.symbol === 'USDC') {
      return poolData.token1.symbol + '/' + poolData.token0.symbol
    }
    return poolData.token0.symbol + '/' + poolData.token1.symbol
  }, [poolData])
  return (
    <div>
      <ResponsiveGrid style={{ borderBottom: '1px solid rgba(225, 229, 239, 0.18)', paddingBottom: '1rem' }}>
        <LabelStyled fontWeight={400}>{index + 1}</LabelStyled>
        <LabelStyled fontWeight={400}>
          <RowFixed>
            <DoubleCurrencyLogo address0={poolData.token0.address} address1={poolData.token1.address} />
            <LinkWrapper
              href={`https://polygonscan.com/address/${poolData.address}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <TYPE.label ml="8px">{poolTitle}</TYPE.label>
              <ExternalLink size={16} color={'white'} />
            </LinkWrapper>
            <GreyBadge
              ml="10px"
              fontSize="14px"
              style={{ backgroundColor: '#02365e', whiteSpace: 'nowrap', maxHeight: 'none' }}
            >
              {feeTierPercent(poolData.fee)}
            </GreyBadge>
            <ChartBadge to={`/info/pools/${poolData.address}`} style={{ textDecoration: 'none' }}>
              <BarChart2 size={18} stroke={'white'} />
            </ChartBadge>
          </RowFixed>
        </LabelStyled>
        <LabelStyled center end={1} fontWeight={400}>
          {formatDollarAmount(poolData.volumeUSD)}
        </LabelStyled>
        <LabelStyled center end={1} fontWeight={400}>
          {formatDollarAmount(poolData.volumeUSDWeek)}
        </LabelStyled>
        <LabelStyled center end={1} fontWeight={400}>
          {formatDollarAmount(poolData.totalValueLockedUSD)}
        </LabelStyled>
        {/* <LabelStyled end={1} fontWeight={400}>
          {formatDollarAmount(poolData.feesUSD)}
        </LabelStyled> */}
        <LabelStyled center end={1} fontWeight={400}>
          {poolData.apr > 0 ? <span style={{ color: '#33FF89' }}>{formatPercent(poolData.apr)}</span> : <span>-</span>}
        </LabelStyled>
        <LabelStyled center end={1} fontWeight={400}>
          {poolData.farmingApr > 0 ? (
            <FarmingLink to={'/farming/infinite-farms'} apr={poolData.farmingApr > 0}>
              {formatPercent(poolData.farmingApr)}
            </FarmingLink>
          ) : (
            <span>-</span>
          )}
        </LabelStyled>
      </ResponsiveGrid>
    </div>
  )
}

const MAX_ITEMS = 10

export default function InfoPoolsTable({
    poolDatas,
    maxItems = MAX_ITEMS
}: {
    poolDatas: PoolData[]
    maxItems?: number
}) {
    // theming
    const theme = useTheme()

    // for sorting
    const [sortField, setSortField] = useState(SORT_FIELD.volumeUSD)
    const [sortDirection, setSortDirection] = useState<boolean>(true)

    // pagination
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)

    useEffect(() => {
        let extraPages = 1
        if (poolDatas.length % maxItems === 0) {
            extraPages = 0
        }
        setMaxPage(Math.floor(poolDatas.length / maxItems) + extraPages)
    }, [maxItems, poolDatas])

    const sortedPools = useMemo(() => {
        if (!Array.isArray(poolDatas)) return []

        return poolDatas
            ? poolDatas
                .filter((x) => !!x && !POOL_HIDE.includes(x.address))
                .sort((a, b) => {
                    if (a && b) {
                        return +a[sortField as keyof PoolData] > +b[sortField as keyof PoolData]
                            ? (sortDirection ? -1 : 1) * 1
                            : (sortDirection ? -1 : 1) * -1
                    } else {
                        return -1
                    }
                })
                .slice(maxItems * (page - 1), page * maxItems)
            : []
    }, [maxItems, page, poolDatas, sortDirection, sortField])

    const handleSort = useCallback(
        (newField: string) => {
            setSortField(newField)
            setSortDirection(sortField !== newField ? true : !sortDirection)
        },
        [sortDirection, sortField]
    )

    const arrow = useCallback(
        (field: string) => {
            return sortField === field ? (!sortDirection ? '↑' : '↓') : ''
        },
        [sortDirection, sortField]
    )

    if (!poolDatas) {
        return <Loader />
    }

  const arrow = useCallback(
    (field: string) => {
      return sortField === field ? (!sortDirection ? '↑' : '↓') : ''
    },
    [sortDirection, sortField]
  )

  if (!poolDatas) {
    return <Loader />
  }

  return (
    <Wrapper style={{ borderRadius: '8px' }}>
      {sortedPools.length > 0 ? (
        <AutoColumn gap="16px">
          <ResponsiveGrid style={{ borderBottom: '1px solid rgba(225, 229, 239, 0.18)', paddingBottom: '1rem' }}>
            <Label color={'#dedede'}>#</Label>
            <ClickableTextStyled color={'#dedede'} onClick={() => handleSort(SORT_FIELD.feeTier)}>
              Pool {arrow(SORT_FIELD.feeTier)}
            </ClickableTextStyled>
            <ClickableTextStyled center color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.volumeUSD)}>
              Volume 24H {arrow(SORT_FIELD.volumeUSD)}
            </ClickableTextStyled>
            <ClickableTextStyled center color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}>
              Volume 7D {arrow(SORT_FIELD.volumeUSDWeek)}
            </ClickableTextStyled>
            <ClickableTextStyled center color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.tvlUSD)}>
              TVL {arrow(SORT_FIELD.tvlUSD)}
            </ClickableTextStyled>
            {/* <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.feesUSD)}>
              Fees 24H {arrow(SORT_FIELD.feesUSD)}
            </ClickableTextStyled> */}
            <ClickableTextStyled center color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.apr)}>
              <APRWrapper style={{ display: 'flex', alignItems: 'center' }}>
                <span>🚀 APR{arrow(SORT_FIELD.apr)}</span>
                <span style={{ marginLeft: '6px' }}>
                  <HelpCircle style={{ display: 'block' }} color={'white'} size={'16px'} />
                </span>
                <HelperDropdown>
                  Based on <HelperDropdownPart>fees</HelperDropdownPart> /{' '}
                  <HelperDropdownPart>active liquidity</HelperDropdownPart>
                </HelperDropdown>
              </APRWrapper>
            </ClickableTextStyled>
            <ClickableTextStyled center color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.farmingApr)}>
              <span>🔥 Farming{arrow(SORT_FIELD.farmingApr)}</span>
            </ClickableTextStyled>
            {/* <AprInfo title={'based on 24h volume'}>?</AprInfo> */}
          </ResponsiveGrid>
          {sortedPools.map((poolData, i) => {
            if (poolData) {
              return (
                <React.Fragment key={i}>
                  <DataRow index={(page - 1) * MAX_ITEMS + i} poolData={poolData} />
                </React.Fragment>
              )
            }
            return null
          })}
          <PageButtons>
            <div
              onClick={() => {
                setPage(page === 1 ? page : page - 1)
              }}
            >
              <Arrow faded={page === 1 ? true : false}>←</Arrow>
            </div>
            <TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
            <div
              onClick={() => {
                setPage(page === maxPage ? page : page + 1)
              }}
            >
              <Arrow faded={page === maxPage ? true : false}>→</Arrow>
            </div>
          </PageButtons>
        </AutoColumn>
      ) : (
        <LoadingRows>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </LoadingRows>
      )}
    </Wrapper>
  )
}
