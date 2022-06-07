import StakingAnalyticsChart from '../../components/StakingAnalyticsChart'
import React, { useEffect } from 'react'
import { useInfoSubgraph } from '../../hooks/subgraph/useInfoSubgraph'
import Loader from '../../components/Loader'
import { ArrowLeft } from 'react-feather'
import { chartTypes } from '../../models/enums'
import { NavLink } from 'react-router-dom'
import './index.scss'

const chartsInfo = [
    {
        title: 'APR',
        type: chartTypes.APR,
        hint: 'Yearly percentage of profits at the current rate of rewards'
    },
    {
        title: 'ALGB Balance',
        type: chartTypes.ALGB_BALANCE,
        hint: 'Total amount of staked ALGB'
    },
    {
        title: 'Staked ALGB',
        type: chartTypes.CURRENCY_STAKED_AMOUNT,
        hint: 'Amount of newly-staked ALGB per day'
    },
    {
        title: 'xALGB Total Supply',
        type: chartTypes.XALGB_TOTAL_SUPPLY,
        hint: 'Total amount of minted xALGB'
    },
    {
        title: 'ALGB from the Vault',
        type: chartTypes.ALGB_FROM_VAULT,
        hint: 'Amount of ALGB fees sent as rewards'
    },
    {
        title: ['xALGB Minted', 'xALGB Burned'],
        type: chartTypes.XALGB_MINTED,
        hint: ['Amount of newly-minted xALGB per day', 'Amount of newly-burned xALGB per day ']
    }
]
const chart1Color = 'var(--primary)'
const chart2Color = 'var(--red)'

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
        <div className={'w-100 maw-1180 mb-3'}>
            <NavLink className={'c-p f hover-op trans-op w-fc'} to={'/staking'}><ArrowLeft size={'16px'} /><p className={'ml-05'}>Staking</p></NavLink>
            {chartsInfo.map((item, i) =>
                <div className={'stacking-chart-card br-24 pv-1 ph-2 mv-1 mxs_ph-1'} key={i}>
                    {item.type === 'xALGBminted' ?
                        <div className={'stacking-chart-card__color-text'}>
                            <div>
                                <div className={'f f-ac'}>
                                    <div className={'stacking-chart-card__color-rect'} data-stroke={'first'} />
                                    <h2 className={'ml-05 fs-15'}>{item.title[0]}</h2>
                                </div>
                                <p className={'mt-025'}>{item.hint[0]}</p>
                            </div>
                            <div className={'ml-2'}>
                                <div className={'f f-ac'}>
                                    <div className={'stacking-chart-card__color-rect'} data-stroke={'second'} />
                                    <h2 className={'ml-05 fs-15'}>{item.title[1]}</h2>
                                </div>
                                <p className={'mt-025'}>{item.hint[1]}</p>
                            </div>
                        </div>
                        :
                        <>
                            <h2 className={'fs-15'}>{item.title}</h2>
                            <p className={'mt-025'}>{item.hint}</p>
                        </>
                    }
                    {historiesLoading ?
                        <div className={'stacking-chart-card__loader br-12 mt-1'}>
                            <Loader size={'35px'} stroke={'white'} />
                        </div> :
                        <StakingAnalyticsChart
                            stakeHistoriesResult={stakeHistoriesResult}
                            type={item.type}
                            colors={[chart1Color, chart2Color]} />
                    }
                </div>)
            }
        </div>
    )
}
