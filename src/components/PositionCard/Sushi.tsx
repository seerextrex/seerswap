import { Token } from '@uniswap/sdk-core'
import { Link } from 'react-router-dom'
import { Trans } from '@lingui/macro'

import { unwrappedToken } from '../../utils/unwrappedToken'
import { ButtonEmpty } from '../Button'
import { CardNoise } from '../earn/styled'
import { ArrowLeft } from 'react-feather'

import { useColor } from '../../hooks/useColor'

import { AutoColumn } from '../Column'
import DoubleCurrencyLogo from '../DoubleLogo'
import { AutoRow } from '../Row'
import { Dots } from '../swap/styled'
import Badge, { BadgeVariant } from 'components/Badge'
import { ArrowBack, FixedHeightRow, RowFixedStyled, StyledSushiPositionCard, TextStyled } from './styled'


interface PositionCardProps {
    tokenA: Token
    tokenB: Token
    liquidityToken: Token
    border?: string
}

export default function SushiPositionCard({
    tokenA,
    tokenB,
    liquidityToken,
    border
}: PositionCardProps) {
    const currency0 = unwrappedToken(tokenA)
    const currency1 = unwrappedToken(tokenB)

    const backgroundColor = useColor(tokenA)

    return (
        <StyledSushiPositionCard border={border} bgColor={backgroundColor}>
            <ArrowBack to={'/pool/v2/find'}>
                <ArrowLeft />
            </ArrowBack>
            <CardNoise />
            <AutoColumn gap='12px'>
                <FixedHeightRow>
                    <AutoRow gap='8px'>
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
                                minWidth: '100px'
                            }}
                        >
                            SushiSwap
                        </Badge>
                    </AutoRow>
                    <RowFixedStyled gap='8px' style={{ minWidth: '110px' }}>
                        <ButtonEmpty
                            padding='0px 35px 0px 0px'
                            $borderRadius='12px'
                            width='fit-content'
                            as={Link}
                            to={`/migrate/${liquidityToken.address}`}
                        >
                            <Trans>Migrate</Trans>
                        </ButtonEmpty>
                    </RowFixedStyled>
                </FixedHeightRow>
            </AutoColumn>
        </StyledSushiPositionCard>
    )
}
