import React, { useMemo, useRef } from 'react'
import Chart from './Chart'
import Loader from '../Loader'
import { ChartType } from '../../models/enums'
import { isMobile, isTablet } from 'react-device-detect'
import { MockLoading, Wrapper } from './styled'
import { FeeSubgraph, PoolHourData } from '../../models/interfaces'

interface FeeChartRangeInputProps {
    fetchedData: {
        data: FeeSubgraph[] | PoolHourData[]
        previousData: FeeSubgraph[] | PoolHourData[]
    } | undefined | string
    refreshing: boolean
    id: string
    span: number
    type: number
}

export default function FeeChartRangeInput({ fetchedData, refreshing, span, type }: FeeChartRangeInputProps) {

    const ref = useRef<HTMLDivElement>(null)

    const formattedData = useMemo(() => {
        if (!fetchedData || typeof fetchedData === 'string') return {
            data: [],
            previousData: []
        }

        if (!fetchedData || !fetchedData.data || fetchedData.data.length === 0) return {
            data: [],
            previousData: []
        }

        const isUntracked = fetchedData.data.some((el) => {
            if ('volumeUSD' in el) {
                return +el.volumeUSD < 1 && +el.untrackedVolumeUSD >= 1
            }
            return
        })

        const field = type === ChartType.TVL ? 'tvlUSD' : type === ChartType.VOLUME ? isUntracked ? 'untrackedVolumeUSD' : 'volumeUSD' : 'feesUSD'

        if (type === ChartType.FEES) {

            return {
                data: fetchedData.data.map((el) => {
                    if ('fee' in el) {
                        return {
                            timestamp: new Date(+el.timestamp * 1000),
                            value: +el.fee / +el.changesCount / 10000
                        }
                    }
                    return
                }),
                previousData: fetchedData.previousData.map((el) => {
                    if ('fee' in el) {
                        return {
                            timestamp: new Date(+el.timestamp * 1000),
                            value: +el.fee / +el.changesCount / 10000
                        }
                    }
                    return
                })
            }
        } else {
            return {
                data: fetchedData.data.map((el) => {
                    if ('volumeUSD' in el) {
                        return {
                            timestamp: new Date(el.periodStartUnix * 1000),
                            value: +el[field]
                        }
                    }
                    return
                }),
                previousData: fetchedData.previousData.map((el) => {
                    if ('volumeUSD' in el) {
                        return {
                            timestamp: new Date(el.periodStartUnix * 1000),
                            value: +el[field]
                        }
                    }
                    return
                })
            }
        }
    }, [fetchedData])

    return (
        <Wrapper ref={ref}>
            {refreshing ?
                <MockLoading>
                    <Loader stroke={'white'} size={'25px'} />
                </MockLoading> :
                <Chart
                    feeData={formattedData}
                    dimensions={{
                        width: isTablet || isMobile ? ref && ref.current && ref.current.offsetWidth - 80 || 0 : 810,
                        height: isTablet || isMobile ? 200 : 300,
                        margin: { top: 30, right: 20, bottom: isMobile ? 70 : 30, left: 50 }
                    }}
                    isMobile={isMobile}
                    span={span}
                    type={type}
                />
            }
        </Wrapper>
    )
}
