import { ChartBadge, FarmingLink, LabelStyled, LinkWrapper, ResponsiveGrid } from './styled'
import { BarChart2, ExternalLink } from 'react-feather'
import { formatDollarAmount, formatPercent } from '../../utils/numbers'
import React, { useMemo } from 'react'
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

    const poolTitle = useMemo(() => {
        if (!poolData.token1 || !poolData.token0) return []
        if (poolData.token0.symbol === 'USDC') {
            return [poolData.token1.symbol, poolData.token0.symbol]
        }
        return [poolData.token0.symbol, poolData.token1.symbol]
    }, [poolData.token0, poolData.token1])

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
                                {poolTitle[0]}/{poolTitle[1]}
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
                <LabelStyled center end={1} fontWeight={400}>
                    {formatDollarAmount(poolData.volumeUSD)}
                </LabelStyled>
                <LabelStyled center end={1} fontWeight={400}>
                    {formatDollarAmount(poolData.volumeUSDWeek)}
                </LabelStyled>
                <LabelStyled center end={1} fontWeight={400}>
                    {formatDollarAmount(+poolData.totalValueLockedUSD)}
                </LabelStyled>
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
