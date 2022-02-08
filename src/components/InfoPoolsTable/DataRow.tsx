import { ChartBadge, LabelStyled, LinkWrapper, ResponsiveGrid } from './styled'
import { BarChart2, ExternalLink } from 'react-feather'
import { formatDollarAmount, formatPercent } from '../../utils/numbers'
import React from 'react'
import DoubleCurrencyLogo from '../DoubleLogo'
import { GreyBadge } from 'components/Card'
import { TYPE } from 'theme'
import { feeTierPercent } from 'utils'
import { RowFixed } from 'components/Row'
import { FormattedPool } from '../../models/interfaces'

interface DataRowProps {
    poolData: FormattedPool;
    index: number
}

export const DataRow = ({ poolData, index }: DataRowProps) => {

    return (
        <div>
            <ResponsiveGrid style={{
                borderBottom: '1px solid rgba(225, 229, 239, 0.18)',
                paddingBottom: '1rem'
            }}>
                <LabelStyled fontWeight={400}>{index + 1}</LabelStyled>
                <LabelStyled fontWeight={400}>
                    <RowFixed>
                        <DoubleCurrencyLogo address0={poolData.token0.address}
                                            address1={poolData.token1.address} />
                        <LinkWrapper href={`https://polygonscan.com/address/${poolData.address}`}
                                     rel='noopener noreferrer'
                                     target='_blank'>
                            <TYPE.label ml='8px'>
                                {poolData.token0.symbol}/{poolData.token1.symbol}
                            </TYPE.label>
                            <ExternalLink size={16} color={'white'} />
                        </LinkWrapper>
                        <GreyBadge ml='10px' fontSize='14px' style={{ backgroundColor: '#02365e' }}>
                            {feeTierPercent(+poolData.fee)}
                        </GreyBadge>
                        <ChartBadge to={`/info/pools/${poolData.address}`}
                                    style={{ textDecoration: 'none' }}>
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
                    {formatDollarAmount(+poolData.totalValueLockedUSD)}
                </LabelStyled>
                <LabelStyled end={1} fontWeight={400}>
                    {formatPercent(poolData.apr)}
                </LabelStyled>
            </ResponsiveGrid>
        </div>
    )
}
