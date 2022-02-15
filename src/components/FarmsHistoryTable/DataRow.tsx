import { LabelStyled, ResponsiveGrid } from './styled'
import CurrencyLogo from '../CurrencyLogo'
import React from 'react'

export default function DataRow ({ eventData, index }: { eventData: any; index: number }) {
    return (
        <div>
            <ResponsiveGrid style={{ borderBottom: '1px solid rgba(225, 229, 239, 0.18)', paddingBottom: '1rem' }}>
                <LabelStyled fontWeight={400}>{index + 1}</LabelStyled>
                <LabelStyled fontWeight={400}>
                    <div>
                        <CurrencyLogo size='35px' currency={{ address: eventData.pool.token0.address }} />
                        <CurrencyLogo
                            size='35px'
                            style={{ marginLeft: '-10px' }}
                            currency={{ address: eventData.pool.token1.address }}
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
                        currency={{ address: eventData.rewardToken.address, symbol: eventData.rewardToken.symbol }}
                    />
                    <div style={{ marginLeft: '10px' }}>
                        <div>{eventData.reward}</div>
                        <div>{eventData.rewardToken.symbol} </div>
                    </div>
                </LabelStyled>
                <LabelStyled end={1} fontWeight={400}>
                    <CurrencyLogo
                        size='35px'
                        currency={{ address: eventData.bonusRewardToken.address, symbol: eventData.bonusRewardToken.symbol }}
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
                    {eventData.apr}
                </LabelStyled>
                <LabelStyled end={1} fontWeight={400}>
                    {`${eventData.start} — ${eventData.end}`}
                </LabelStyled>
            </ResponsiveGrid>
        </div>
    )
}
