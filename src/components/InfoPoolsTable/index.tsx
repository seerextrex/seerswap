import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { TYPE } from 'theme'
import { GreyBadge } from 'components/Card'
import Loader, { LoadingRows } from 'components/Loader'
import { AutoColumn } from 'components/Column'
import { RowFixed } from 'components/Row'
import { formatDollarAmount, formatPercent } from 'utils/numbers'
import { PoolData } from 'state/pools/reducer'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { feeTierPercent } from 'utils'
import { Label } from 'components/Text'
import useTheme from 'hooks/useTheme'
import { useActiveWeb3React } from '../../hooks/web3'
import { BarChart2, ExternalLink } from 'react-feather'
import {
  ResponsiveGrid,
  Arrow,
  ChartBadge,
  ClickableTextStyled,
  LabelStyled,
  LinkWrapper,
  Wrapper,
  PageButtons
} from './styled'

const SORT_FIELD = {
  feeTier: 'feeTier',
  volumeUSD: 'volumeUSD',
  tvlUSD: 'tvlUSD',
  volumeUSDWeek: 'volumeUSDWeek',
  feesUSD: 'feesUSD',
  apr: 'apr'
}

export const POOL_HIDE = [
  '0x86d257cdb7bc9c0df10e84c8709697f92770b335',
  '0xf8dbd52488978a79dfe6ffbd81a01fc5948bf9ee',
  '0x8fe8d9bb8eeba3ed688069c3d6b556c9ca258248'
]

const DataRow = ({ poolData, index }: { poolData: PoolData; index: number }) => {
  const { chainId } = useActiveWeb3React()

  return (
    <div>
      <ResponsiveGrid style={{ borderBottom: '1px solid rgba(225, 229, 239, 0.18)', paddingBottom: '1rem' }}>
        <LabelStyled fontWeight={400}>{index + 1}</LabelStyled>
        <LabelStyled fontWeight={400}>
          <RowFixed>
            <DoubleCurrencyLogo address0={poolData.token0.address} address1={poolData.token1.address} />
            <LinkWrapper href={`https://polygonscan.com/address/${poolData.address}`}
                         rel='noopener noreferrer'
                         target='_blank'>
              <TYPE.label ml='8px'>
                {poolData.token0.symbol}/{poolData.token1.symbol}
              </TYPE.label>
              <ExternalLink size={16} color={'white'} />
            </LinkWrapper>
            <GreyBadge ml='10px' fontSize='14px' style={{ backgroundColor: '#02365e' }}>
              {feeTierPercent(poolData.fee)}
            </GreyBadge>
            <ChartBadge to={`/info/pools/${poolData.address}`} style={{ textDecoration: 'none' }}>
              <BarChart2 size={18} stroke={'white'} />
            </ChartBadge>

          </RowFixed>
        </LabelStyled>
        <LabelStyled end={1} fontWeight={400}>
          {formatDollarAmount(poolData.volumeUSD)}
        </LabelStyled>
        <LabelStyled end={1} fontWeight={400}>
          {formatDollarAmount(poolData.volumeUSDWeek)}
        </LabelStyled>
        <LabelStyled end={1} fontWeight={400}>
          {formatDollarAmount(poolData.totalValueLockedUSD)}
        </LabelStyled>
        {/* <LabelStyled end={1} fontWeight={400}>
          {formatDollarAmount(poolData.feesUSD)}
        </LabelStyled> */}
        <LabelStyled end={1} fontWeight={400}>
          {formatPercent(poolData.apr)}
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
  const [sortField, setSortField] = useState(SORT_FIELD.tvlUSD)
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
            return a[sortField as keyof PoolData] > b[sortField as keyof PoolData]
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

  return (
    <Wrapper style={{ borderRadius: '8px' }}>
      {sortedPools.length > 0 ? (
        <AutoColumn gap='16px'>
          <ResponsiveGrid style={{ borderBottom: '1px solid rgba(225, 229, 239, 0.18)', paddingBottom: '1rem' }}>
            <Label color={'#dedede'}>#</Label>
            <ClickableTextStyled color={'#dedede'} onClick={() => handleSort(SORT_FIELD.feeTier)}>
              Pool {arrow(SORT_FIELD.feeTier)}
            </ClickableTextStyled>
            <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.volumeUSD)}>
              Volume 24H {arrow(SORT_FIELD.volumeUSD)}
            </ClickableTextStyled>
            <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}>
              Volume 7D {arrow(SORT_FIELD.volumeUSDWeek)}
            </ClickableTextStyled>
            <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.tvlUSD)}>
              TVL {arrow(SORT_FIELD.tvlUSD)}
            </ClickableTextStyled>
            {/* <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.feesUSD)}>
              Fees 24H {arrow(SORT_FIELD.feesUSD)}
            </ClickableTextStyled> */}
            <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.apr)}>
              APR {arrow(SORT_FIELD.apr)}
              {/* <AprInfo title={'based on 24h volume'}>?</AprInfo> */}
            </ClickableTextStyled>
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
