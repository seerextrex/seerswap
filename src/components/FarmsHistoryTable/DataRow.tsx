import { LabelStyled, ResponsiveGrid } from './styled'
import CurrencyLogo from '../CurrencyLogo'
import React from 'react'
import { Token } from '@uniswap/sdk-core'
import { SupportedChainId } from '../../constants/chains'
import { WrappedCurrency } from '../../models/types'

export default function DataRow({ eventData, index }: { eventData: any; index: number }) {
    return (
        <div>
            <ResponsiveGrid style={{ borderBottom: '1px solid rgba(225, 229, 239, 0.18)', paddingBottom: '1rem' }}>
                <LabelStyled fontWeight={400}>{index + 1}</LabelStyled>
                <LabelStyled fontWeight={400}>
                    <div>
                        <CurrencyLogo size='35px' currency={ new Token(SupportedChainId.POLYGON, eventData.pool.token0.address, 18) as WrappedCurrency} />
                        <CurrencyLogo
                            size='35px'
                            style={{ marginLeft: '-10px' }}
                            currency={ new Token(SupportedChainId.POLYGON, eventData.pool.token1.address, 18) as WrappedCurrency}
                        />
                    </div>
                    <div style={{ marginLeft: '10px' }}>
                        <div>{eventData.pool.token0.symbol}</div>
                        <div>{eventData.pool.token1.symbol}</div>
                    </div>
                </LabelStyled>
                <LabelStyled end={1} fontWeight={400}>
                    <CurrencyLogo
                        size='35px'
                        currency={ new Token(SupportedChainId.POLYGON, eventData.rewardToken.address, 18, eventData.rewardToken.symbol) as WrappedCurrency}
                    />
                    <div style={{ marginLeft: '10px' }}>
                        <div>{eventData.reward}</div>
                        <div>{eventData.rewardToken.symbol} </div>
                    </div>
                </LabelStyled>
                <LabelStyled end={1} fontWeight={400}>
                    <CurrencyLogo
                        size='35px'
                        currency={ new Token(SupportedChainId.POLYGON, eventData.bonusRewardToken.address, 18, eventData.bonusRewardToken.symbol) as WrappedCurrency}
                    />
                    <div style={{ marginLeft: '10px' }}>
                        <div>{eventData.bonusReward}</div>
                        <div>{eventData.bonusRewardToken.symbol} </div>
                    </div>
                </LabelStyled>
                <LabelStyled end={1} fontWeight={400}>
                    {eventData.participants}
                </LabelStyled>
                <LabelStyled end={1} fontWeight={400}>
                    <span style={{ color: '#33FF89' }}>{eventData.apr}%</span>
                </LabelStyled>
                <LabelStyled end={1} fontWeight={400}>
                    {`${eventData.startStr} — ${eventData.end}`}
                </LabelStyled>
            </ResponsiveGrid>
        </div>
    )
}
