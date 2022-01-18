import StakingAnalyticsChart from '../../components/StakingAnalyticsChart'
import styled from "styled-components/macro";
import {useEffect} from "react";
import {useInfoSubgraph} from "../../hooks/subgraph/useInfoSubgraph";
import Loader from "../../components/Loader";
import React from 'react'
import { NavLink } from 'react-router-dom'
import {ArrowLeft} from "react-feather"

const StakingAnalyticsPageWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  margin-bottom: 5rem;
`
const LoaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 470px;
  margin: 2rem 0;
  background-color: #052445;
  border-radius: 16px;
`
const BackButton = styled(NavLink)`
  margin-top: 10px;
  text-decoration: none;
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  width: fit-content;
   p {
     margin:  0 0 0 5px;
   }
`

const ChartTitle = styled.h2`
  color: ${({theme}) => theme.winterDisabledButton};
`

const chartsInfo = [
    {title: 'xALGB Minted', type: 'xALGBminted'},
    {title: 'ALGB From Vault', type: 'ALGBfromVault'},
    {title: 'xALGB Total Supply', type: 'xALGBtotalSupply'},
    {title: 'APR', type: 'apr'},
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
                    <React.Fragment key={i}>
                        <ChartTitle>{item.title}</ChartTitle>
                        {historiesLoading ?
                            <LoaderWrapper>
                                <Loader size={'35px'} stroke={'white'}/>
                            </LoaderWrapper> :
                            <StakingAnalyticsChart
                                stakeHistoriesResult={stakeHistoriesResult}
                                type={item.type}/>
                        }
                    </React.Fragment>
            )}
        </StakingAnalyticsPageWrapper>

    )
}