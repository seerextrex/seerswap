import { Token } from '@uniswap/sdk-core'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components/macro'
import { Trans } from '@lingui/macro'
import { NavLink } from 'react-router-dom'

import { unwrappedToken } from '../../utils/unwrappedToken'
import { ButtonEmpty } from '../Button'
import { transparentize } from 'polished'
import { CardNoise } from '../earn/styled'
import { ArrowLeft } from 'react-feather'

import { useColor } from '../../hooks/useColor'

import { LightCard } from '../Card'
import { AutoColumn } from '../Column'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowFixed, AutoRow } from '../Row'
import { Dots } from '../swap/styleds'
import { FixedHeightRow } from '.'
import Badge, { BadgeVariant } from 'components/Badge'

const StyledPositionCard = styled(LightCard)<{ bgColor: any }>`
  border: none;
  background: ${({ theme, bgColor }) =>
    `radial-gradient(91.85% 100% at 1.84% 0%, ${transparentize(0.8, bgColor)} 0%, ${theme.bg3} 100%) `};
  position: relative;
  overflow: hidden;
  @media screen and (min-width: 501px) {
    padding: 2rem;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 2rem;
    `};
`
const RowFixedStyled = styled(RowFixed)`
  min-height: 55px;
  justify-content: space-between;
  flex-direction: column;
  @media screen and (min-width: 501px) {
    justify-content: center;
  }
`

const TextStyled = styled(Text)`
  margin-left: 0 !important;
`
const ArrowBack = styled(NavLink)`
  z-index: 100;
  text-decoration: none;
  color: white;
  position: absolute;
  left: 3%;
  top: 5%;
`

interface PositionCardProps {
  tokenA: Token
  tokenB: Token
  liquidityToken: Token
  border?: string
}

export default function SushiPositionCard({ tokenA, tokenB, liquidityToken, border }: PositionCardProps) {
  const currency0 = unwrappedToken(tokenA)
  const currency1 = unwrappedToken(tokenB)

  const backgroundColor = useColor(tokenA)

  return (
    <StyledPositionCard border={border} bgColor={backgroundColor}>
      <ArrowBack to={'/pool/v2/find'}>
        <ArrowLeft />
      </ArrowBack>
      <CardNoise />
      <AutoColumn gap="12px">
        <FixedHeightRow>
          <AutoRow gap="8px">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} />
            <TextStyled fontWeight={500} fontSize={20}>
              {!currency0 || !currency1 ? (
                <Dots>
                  <Trans>Loading</Trans>
                </Dots>
              ) : (
                `${currency0.symbol}/${currency1.symbol}`
              )}
            </TextStyled>
            <Badge
              variant={BadgeVariant.WARNING}
              ref={(element) => {
                if (element) {
                  element.style.setProperty('margin-left', 'auto', 'important')
                  element.style.setProperty('margin-right', '6rem', 'important')
                }
              }}
              style={{
                backgroundColor: '#48062b',
                color: '#f241a5',
                minWidth: '100px',
              }}
            >
              SushiSwap
            </Badge>
          </AutoRow>
          <RowFixedStyled gap="8px" style={{ minWidth: '110px' }}>
            <ButtonEmpty
              padding="0px 35px 0px 0px"
              $borderRadius="12px"
              width="fit-content"
              as={Link}
              to={`/migrate/${liquidityToken.address}`}
            >
              <Trans>Migrate</Trans>
            </ButtonEmpty>
          </RowFixedStyled>
        </FixedHeightRow>
      </AutoColumn>
    </StyledPositionCard>
  )
}
