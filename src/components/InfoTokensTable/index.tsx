import React, { useState, useMemo, useCallback, useEffect } from 'react'
import styled from 'styled-components/macro'
import { ExtraSmallOnly, HideExtraSmall, TYPE } from 'theme'
import { DarkGreyCard } from 'components/Card'
import { TokenData } from '../../state/tokens/reducer'
import Loader, { LoadingRows } from 'components/Loader'
import { Link } from 'react-router-dom'
import { AutoColumn } from 'components/Column'
import CurrencyLogo from 'components/CurrencyLogo'
import { RowFixed } from 'components/Row'
import { formatDollarAmount } from 'utils/numbers'
import Percent from 'components/Percent'
import { Label, ClickableText } from '../Text'
import HoverInlineText from '../HoverInlineText'
import useTheme from 'hooks/useTheme'
import { ExternalLink } from 'react-feather'

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

const Wrapper = styled(DarkGreyCard)`
  width: 100%;
  background-color: #202635;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-width: 600px;
  `};
`

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  grid-template-columns: 20px 3fr repeat(4, 1fr);

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
     grid-template-columns: 20px 2fr repeat(4, 1fr);
  `};

  //@media screen and (max-width: 900px) {
  //  grid-template-columns: 20px 1.5fr repeat(3, 1fr);
  //  & :nth-child(4) {
  //    display: none;
  //  }
  //}
  //
  //@media screen and (max-width: 800px) {
  //  grid-template-columns: 20px 1.5fr repeat(2, 1fr);
  //  & :nth-child(6) {
  //    display: none;
  //  }
  //}

  //@media screen and (max-width: 670px) {
  //  grid-template-columns: repeat(2, 1fr);
  //  > *:first-child {
  //    display: none;
  //  }
  //  > *:nth-child(3) {
  //    display: none;
  //  }
  //}
`

const LinkWrapper = styled.a`
  display: flex;
  text-decoration: none;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const ResponsiveLogo = styled(CurrencyLogo)`
  @media screen and (max-width: 670px) {
    width: 16px;
    height: 16px;
  }
`

export const TOKEN_HIDE = []

const DataRow = ({ tokenData, index }: { tokenData: TokenData; index: number }) => {
  const theme = useTheme()

  return (
    <ResponsiveGrid style={{ borderBottom: '1px solid #151b2c', paddingBottom: '1rem' }}>
      <Label>{index + 1}</Label>
      <Label>
        <LinkWrapper
          href={`https://polygonscan.com/address/${tokenData.address}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <RowFixed>
            <ResponsiveLogo address={tokenData.address} />
          </RowFixed>
          <ExtraSmallOnly style={{ marginLeft: '6px' }}>
            <Label ml="8px">{tokenData.symbol}</Label>
          </ExtraSmallOnly>
          <HideExtraSmall style={{ marginLeft: '10px' }}>
            <RowFixed>
              <HoverInlineText text={tokenData.name} />
              <Label ml="8px" color={theme.text3}>
                ({tokenData.symbol})
              </Label>
            </RowFixed>
          </HideExtraSmall>
          <div style={{ marginLeft: '8px' }}>
            <ExternalLink size={16} color={'white'} />
          </div>
        </LinkWrapper>
      </Label>
      <Label end={1} fontWeight={400}>
        {formatDollarAmount(tokenData.priceUSD)}
      </Label>
      <Label end={1} fontWeight={400}>
        <Percent value={tokenData.priceUSDChange} fontWeight={400} />
      </Label>
      <Label end={1} fontWeight={400}>
        {formatDollarAmount(tokenData.volumeUSD)}
      </Label>
      <Label end={1} fontWeight={400}>
        {formatDollarAmount(tokenData.tvlUSD)}
      </Label>
    </ResponsiveGrid>
  )
}

const SORT_FIELD = {
  name: 'name',
  volumeUSD: 'volumeUSD',
  tvlUSD: 'tvlUSD',
  priceUSD: 'priceUSD',
  priceUSDChange: 'priceUSDChange',
  priceUSDChangeWeek: 'priceUSDChangeWeek',
}

const MAX_ITEMS = 10

export default function InfoTokensTable({
  tokenDatas,
  maxItems = MAX_ITEMS,
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
        <AutoColumn gap="16px">
          <ResponsiveGrid style={{ borderBottom: '1px solid #151b2c', paddingBottom: '1rem' }}>
            <Label color={theme.text2}>#</Label>
            <ClickableText color={theme.text2} onClick={() => handleSort(SORT_FIELD.name)}>
              Name {arrow(SORT_FIELD.name)}
            </ClickableText>
            <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.priceUSD)}>
              Price {arrow(SORT_FIELD.priceUSD)}
            </ClickableText>
            <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.priceUSDChange)}>
              Price Change {arrow(SORT_FIELD.priceUSDChange)}
            </ClickableText>
            {/* <ClickableText end={1} onClick={() => handleSort(SORT_FIELD.priceUSDChangeWeek)}>
            7d {arrow(SORT_FIELD.priceUSDChangeWeek)}
          </ClickableText> */}
            <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.volumeUSD)}>
              Volume 24H {arrow(SORT_FIELD.volumeUSD)}
            </ClickableText>
            <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.tvlUSD)}>
              TVL {arrow(SORT_FIELD.tvlUSD)}
            </ClickableText>
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
