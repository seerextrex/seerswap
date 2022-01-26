import StakingAnalyticsChart from '../../components/StakingAnalyticsChart'
import {useEffect} from "react";
import {useInfoSubgraph} from "../../hooks/subgraph/useInfoSubgraph";
import Loader from "../../components/Loader";
import React from 'react'
import {ArrowLeft} from "react-feather"
import {ChartCard, ChartHint, ChartTitle, LoaderWrapper, StakingAnalyticsPageWrapper, BackButton} from './styled'

const chartsInfo = [
    {title: 'xALGB Minted', type: 'xALGBminted', hint: 'Amount of newly-minted xALGB per day '},
    // {title: 'ALGB From Vault', type: 'ALGBfromVault'},
    {title: 'Staked ALGB', type: 'currentStakedAmount', hint: 'Amount of newly-staked ALGB per day'},
    {title: 'xALGB Total Supply', type: 'xALGBtotalSupply', hint: 'Total amount of minted xALGB'},
    // {title: 'APR', type: 'apr'},
    {title: 'ALGBbalance', type: 'ALGBbalance', hint: 'Total amount of staked ALGB'}
]

export default function StakingAnalyticsPage() {
    const {fetchStakedHistory: {fetchStakingHistoryFn, historiesLoading, stakeHistoriesResult}} = useInfoSubgraph()

    useEffect(() => {
        fetchStakingHistoryFn()
    }, [])

    return (
        <StakingAnalyticsPageWrapper>
            <BackButton to={'/staking'}><ArrowLeft size={'16px'}/> <p>Staking</p>
            </BackButton>
            {chartsInfo.map((item, i) =>
                    <ChartCard key={i}>
                        <ChartTitle>{item.title}</ChartTitle>
                        <ChartHint>{item.hint}</ChartHint>
                        {historiesLoading ?
                            <LoaderWrapper>
                                <Loader size={'35px'} stroke={'white'}/>
                            </LoaderWrapper> :
                            <StakingAnalyticsChart
                                stakeHistoriesResult={stakeHistoriesResult}
                                type={item.type}/>
                        }
                    </ChartCard>
            )}
        </StakingAnalyticsPageWrapper>
    )
}