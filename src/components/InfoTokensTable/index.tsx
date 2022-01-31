import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { TYPE } from 'theme'
import { TokenData } from '../../state/tokens/reducer'
import Loader, { LoadingRows } from 'components/Loader'
import { AutoColumn } from 'components/Column'
import { RowFixed } from 'components/Row'
import { formatDollarAmount } from 'utils/numbers'
import Percent from 'components/Percent'
import { Label } from '../Text'
import HoverInlineText from '../HoverInlineText'
import useTheme from 'hooks/useTheme'
import { ExternalLink } from 'react-feather'
import { HideMedium, MediumOnly } from '../../theme'
import {
  ResponsiveGrid,
  ClickableTextStyled,
  LinkWrapper,
  Wrapper,
  CurrencyRow,
  CurrencyRowWrapper,
  ResponsiveLogo,
  LabelTitleStyled
} from './styled'
import { Arrow, PageButtons } from '../InfoPoolsTable/styled'

export const TOKEN_HIDE = []

const DataRow = ({ tokenData, index }: { tokenData: TokenData; index: number }) => {
  const theme = useTheme()

  return (
    <ResponsiveGrid style={{ borderBottom: '1px solid rgba(225, 229, 239, 0.18)', paddingBottom: '1rem' }}>
      <Label>{index + 1}</Label>
      <Label>
        <LinkWrapper
          href={`https://polygonscan.com/address/${tokenData.address}`}
          rel='noopener noreferrer'
          target='_blank'
        >
          <CurrencyRowWrapper>
            <CurrencyRow>
              <ResponsiveLogo currency={{ address: tokenData.address, symbol: tokenData.symbol }} />
            </CurrencyRow>
            <MediumOnly>
              <Label>{tokenData.symbol}</Label>
            </MediumOnly>
            <HideMedium>
              <RowFixed>
                <HoverInlineText text={tokenData.name} />
                <Label ml='8px' color={'#dedede'}>
                  ({tokenData.symbol})
                </Label>
              </RowFixed>
            </HideMedium>
            <div style={{ marginLeft: '8px' }}>
              <ExternalLink size={16} color={'white'} />
            </div>
          </CurrencyRowWrapper>
        </LinkWrapper>
      </Label>
      <LabelTitleStyled end={1} fontWeight={400}>
        {formatDollarAmount(tokenData.priceUSD, 3)}
      </LabelTitleStyled>
      <LabelTitleStyled end={1} fontWeight={400}>
        <Percent value={tokenData.priceUSDChange} fontWeight={400} />
      </LabelTitleStyled>
      <LabelTitleStyled end={1} fontWeight={400}>
        {formatDollarAmount(tokenData.volumeUSD)}
      </LabelTitleStyled>
      <LabelTitleStyled end={1} fontWeight={400}>
        {formatDollarAmount(tokenData.tvlUSD)}
      </LabelTitleStyled>
    </ResponsiveGrid>
  )
}

const SORT_FIELD = {
  name: 'name',
  volumeUSD: 'volumeUSD',
  tvlUSD: 'tvlUSD',
  priceUSD: 'priceUSD',
  priceUSDChange: 'priceUSDChange',
  priceUSDChangeWeek: 'priceUSDChangeWeek'
}

const MAX_ITEMS = 10

export default function InfoTokensTable({
                                          tokenDatas,
                                          maxItems = MAX_ITEMS
                                        }: {
  tokenDatas: TokenData[] | undefined
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
    if (tokenDatas) {
      if (tokenDatas.length % maxItems === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(tokenDatas.length / maxItems) + extraPages)
    }
  }, [maxItems, tokenDatas])

  const sortedTokens = useMemo(() => {
    if (!Array.isArray(tokenDatas)) return []

    return tokenDatas
      ? tokenDatas
        .filter((x) => !!x && !TOKEN_HIDE.includes(x.address))
        .sort((a, b) => {
          if (a && b) {
            return a[sortField as keyof TokenData] > b[sortField as keyof TokenData]
              ? (sortDirection ? -1 : 1) * 1
              : (sortDirection ? -1 : 1) * -1
          } else {
            return -1
          }
        })
        .slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [tokenDatas, maxItems, page, sortDirection, sortField])

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

  if (!tokenDatas) {
    return <Loader />
  }

  return (
    <Wrapper style={{ borderRadius: '8px' }}>
      {sortedTokens.length > 0 ? (
        <AutoColumn gap='16px'>
          <ResponsiveGrid style={{ borderBottom: '1px solid rgba(225, 229, 239, 0.18)', paddingBottom: '1rem' }}>
            <Label color={'#dedede'}>#</Label>
            <ClickableTextStyled color={'#dedede'} onClick={() => handleSort(SORT_FIELD.name)}>
              Name {arrow(SORT_FIELD.name)}
            </ClickableTextStyled>
            <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.priceUSD)}>
              Price {arrow(SORT_FIELD.priceUSD)}
            </ClickableTextStyled>
            <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.priceUSDChange)}>
              Price Change {arrow(SORT_FIELD.priceUSDChange)}
            </ClickableTextStyled>
            {/* <ClickableText end={1} onClick={() => handleSort(SORT_FIELD.priceUSDChangeWeek)}>
            7d {arrow(SORT_FIELD.priceUSDChangeWeek)}
          </ClickableText> */}
            <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.volumeUSD)}>
              Volume 24H {arrow(SORT_FIELD.volumeUSD)}
            </ClickableTextStyled>
            <ClickableTextStyled color={'#dedede'} end={1} onClick={() => handleSort(SORT_FIELD.tvlUSD)}>
              TVL {arrow(SORT_FIELD.tvlUSD)}
            </ClickableTextStyled>
          </ResponsiveGrid>

          {sortedTokens.map((data, i) => {
            if (data) {
              return (
                <React.Fragment key={i}>
                  <DataRow index={(page - 1) * MAX_ITEMS + i} tokenData={data} />
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
