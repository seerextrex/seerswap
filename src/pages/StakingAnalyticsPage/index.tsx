import StakingAnalyticsChart from '../../components/StakingAnalyticsChart'
import React, { useEffect } from 'react'
import { useInfoSubgraph } from '../../hooks/subgraph/useInfoSubgraph'
import Loader from '../../components/Loader'
import { ArrowLeft } from 'react-feather'
import { BackButton, ChartCard, ChartHint, ChartTitle, ChartTitleLeft, ChartTitleRight, ChartTitleWrapper, ColorRect, ColorTextWrapper, LoaderWrapper, StakingAnalyticsPageWrapper } from './styled'

const chartsInfo = [
    {
        title: 'APR',
        type: 'apr',
        hint: 'Yearly percentage of profits at the current rate of rewards'
    },
    { title: 'ALGB Balance', type: 'ALGBbalance', hint: 'Total amount of staked ALGB' },
    {
        title: 'Staked ALGB',
        type: 'currentStakedAmount',
        hint: 'Amount of newly-staked ALGB per day'
    },
    { title: 'xALGB Total Supply', type: 'xALGBtotalSupply', hint: 'Total amount of minted xALGB' },
    {
        title: 'ALGB from the Vault',
        type: 'ALGBfromVault',
        hint: 'Amount of ALGB fees sent as rewards'
    },
    {
        title: ['xALGB Minted', 'xALGB Burned'],
        type: 'xALGBminted',
        hint: ['Amount of newly-minted xALGB per day', 'Amount of newly-burned xALGB per day ']
    }
]
const chart1Color = '#1f8bcd'
const chart2Color = '#d90ebb'

export default function StakingAnalyticsPage() {
    const {
        fetchStakedHistory: {
            fetchStakingHistoryFn,
            historiesLoading,
            stakeHistoriesResult
        }
    } = useInfoSubgraph()

    useEffect(() => {
        fetchStakingHistoryFn()
    }, [])

    return (
        <StakingAnalyticsPageWrapper>
            <BackButton to={'/staking'}><ArrowLeft size={'16px'} /> <p>Staking</p>
            </BackButton>
            {chartsInfo.map((item, i) =>
                <ChartCard key={i}>
                    {item.type === 'xALGBminted' ?
                        <ChartTitleWrapper>
                            <ChartTitleLeft>
                                <ColorTextWrapper>
                                    <ColorRect stroke={chart1Color} />
                                    <ChartTitle
                                        style={{ marginLeft: '.5rem' }}>{item.title[0]}</ChartTitle>
                                </ColorTextWrapper>
                                <ChartHint>{item.hint[0]}</ChartHint>
                            </ChartTitleLeft>
                            <ChartTitleRight>
                                <ColorTextWrapper>
                                    <ColorRect stroke={chart2Color} />
                                    <ChartTitle
                                        style={{ marginLeft: '.5rem' }}>{item.title[1]}</ChartTitle>
                                </ColorTextWrapper>
                                <ChartHint>{item.hint[1]}</ChartHint>
                            </ChartTitleRight>
                        </ChartTitleWrapper>
                        :
                        <>
                            <ChartTitle>{item.title}</ChartTitle>
                            <ChartHint>{item.hint}</ChartHint>
                        </>
                    }
                    {historiesLoading ?
                        <LoaderWrapper>
                            <Loader size={'35px'} stroke={'white'} />
                        </LoaderWrapper> :
                        <StakingAnalyticsChart
                            stakeHistoriesResult={stakeHistoriesResult}
                            type={item.type}
                            colors={[chart1Color, chart2Color]} />
                    }
                </ChartCard>)
            }
        </StakingAnalyticsPageWrapper>
    )
}
