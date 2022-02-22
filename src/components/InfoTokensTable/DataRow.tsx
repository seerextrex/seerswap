import { FormattedToken } from '../../models/interfaces'
import { CurrencyRow, CurrencyRowWrapper, LabelTitleStyled, LinkWrapper, ResponsiveGrid, ResponsiveLogo } from './styled'
import { Label } from '../Text'
import { HideMedium, MediumOnly } from '../../theme'
import HoverInlineText from '../HoverInlineText'
import { ExternalLink } from 'react-feather'
import { formatDollarAmount } from '../../utils/numbers'
import React from 'react'
import { RowFixed } from '../Row'
import Percent from '../Percent'
import { Token } from '@uniswap/sdk-core'
import { SupportedChainId } from '../../constants/chains'
import { WrappedCurrency } from '../../models/types'

interface DataRowProps {
    tokenData: FormattedToken;
    index: number
}

export const DataRow = ({ tokenData, index }: DataRowProps) => {
    return (
        <ResponsiveGrid
            style={{ borderBottom: '1px solid rgba(225, 229, 239, 0.18)', paddingBottom: '1rem' }}>
            <Label>{index + 1}</Label>
            <Label>
                <LinkWrapper
                    href={`https://polygonscan.com/address/${tokenData.address}`}
                    rel='noopener noreferrer'
                    target='_blank'
                >
                    <CurrencyRowWrapper>
                        <CurrencyRow>
                            <ResponsiveLogo currency={new Token(SupportedChainId.POLYGON, tokenData.address, 18, tokenData.symbol) as WrappedCurrency} />
                        </CurrencyRow>
                        <MediumOnly>
                            <Label>{tokenData.symbol}</Label>
                        </MediumOnly>
                        <HideMedium>
                            <RowFixed>
                                <HoverInlineText text={tokenData.name} maxCharacters={18} />
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
            <LabelTitleStyled center end={1} fontWeight={400}>
                {formatDollarAmount(tokenData.priceUSD, 3)}
            </LabelTitleStyled>
            <LabelTitleStyled center end={1} fontWeight={400}>
                <Percent value={tokenData.priceUSDChange} fontWeight={400} />
            </LabelTitleStyled>
            <LabelTitleStyled center end={1} fontWeight={400}>
                {formatDollarAmount(tokenData.volumeUSD)}
            </LabelTitleStyled>
            <LabelTitleStyled center end={1} fontWeight={400}>
                {formatDollarAmount(tokenData.tvlUSD)}
            </LabelTitleStyled>
        </ResponsiveGrid>
    )
}
