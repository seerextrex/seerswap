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
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} />
            <Text fontWeight={500} fontSize={20}>
              {!currency0 || !currency1 ? (
                <Dots>
                  <Trans>Loading</Trans>
                </Dots>
              ) : (
                `${currency0.symbol}/${currency1.symbol}`
              )}
            </Text>

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
          <RowFixed gap="8px" style={{ minWidth: '110px' }}>
            <ButtonEmpty
              padding="0px 35px 0px 0px"
              $borderRadius="12px"
              width="fit-content"
              as={Link}
              to={`/migrate/${liquidityToken.address}`}
            >
              <Trans>Migrate</Trans>
            </ButtonEmpty>
          </RowFixed>
        </FixedHeightRow>
      </AutoColumn>
    </StyledPositionCard>
  )
}
