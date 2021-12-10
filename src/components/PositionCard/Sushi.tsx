import { Token } from '@uniswap/sdk-core'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components/macro'
import { Trans } from '@lingui/macro'

import { unwrappedToken } from '../../utils/unwrappedToken'
import { ButtonEmpty } from '../Button'
import { transparentize } from 'polished'
import { CardNoise } from '../earn/styled'

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
      <CardNoise />
      <AutoColumn gap="12px">
        <FixedHeightRow>
          <AutoRow gap="8px">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
            <TextStyled fontWeight={500} fontSize={window.innerWidth < 501 ? 18 : 20}>
              {!currency0 || !currency1 ? (
                <Dots>
                  <Trans>Loading</Trans>
                </Dots>
              ) : (
                `${currency0.symbol}/${currency1.symbol}`
              )}
            </TextStyled>

            {window.innerWidth > 501 ? <Badge variant={BadgeVariant.WARNING} style={{ backgroundColor: '#48062b', color: '#f241a5' }}>
              SushiSwap
            </Badge> : null}
          </AutoRow>
          <RowFixedStyled gap="8px">
            {window.innerWidth < 501 ? <Badge variant={BadgeVariant.WARNING} style={{ backgroundColor: '#48062b', color: '#f241a5' }}>
              SushiSwap
            </Badge> : null}
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
