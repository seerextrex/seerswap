import React, { useMemo, useRef } from 'react'
import Chart from './Chart'
import Loader from '../Loader'
import { ChartType } from '../../models/enums'
import { isMobile, isTablet } from 'react-device-detect'
import { MockLoading, ToggleToken, TokenInfo, Wrapper } from './styled'
import { FeeChart, FeeSubgraph, PoolHourData } from '../../models/interfaces'
import { ChartToken } from '../../models/enums/poolInfoPage'
import { Trans } from '@lingui/macro'
import { Token } from '@uniswap/sdk-core'
import Toggle from '../Toggle'

interface FeeChartRangeInputProps {
    fetchedData: {
        data: FeeSubgraph[] | PoolHourData[]
        previousData: FeeSubgraph[] | PoolHourData[]
    } | undefined | string
    refreshing: boolean
    id: string
    span: number
    type: number
    token: number
    token1: Token | undefined
    token0: Token | undefined
    setToken: (a: number) => void
}

export default function FeeChartRangeInput({ fetchedData, refreshing, span, type, token, token1, token0, setToken }: FeeChartRangeInputProps) {

    const ref = useRef<HTMLDivElement>(null)

    const formattedData: FeeChart = useMemo(() => {
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
        const field = type === ChartType.PRICE ? token === ChartToken.TOKEN0 ? 'token0Price' : 'token1Price' : type === ChartType.TVL ? 'tvlUSD' : type === ChartType.VOLUME ? isUntracked ? 'untrackedVolumeUSD' : 'volumeUSD' : 'feesUSD'

        if (type === ChartType.FEES) {
            return {
                data: fetchedData.data.map((el) => {
                    if ('fee' in el) {
                        return {
                            timestamp: new Date(+el.timestamp * 1000),
                            value: +el.fee / +el.changesCount / 10000
                        }
                    }
                    return {
                        timestamp: new Date(),
                        value: 0
                    }
                }),
                previousData: fetchedData.previousData.map((el) => {
                    if ('fee' in el) {
                        return {
                            timestamp: new Date(+el.timestamp * 1000),
                            value: +el.fee / +el.changesCount / 10000
                        }
                    }
                    return {
                        timestamp: new Date(),
                        value: 0
                    }
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
                    return {
                        timestamp: new Date(),
                        value: 0
                    }
                }),
                previousData: fetchedData.previousData.map((el) => {
                    if ('volumeUSD' in el) {
                        return {
                            timestamp: new Date(el.periodStartUnix * 1000),
                            value: +el[field]
                        }
                    }
                    return {
                        timestamp: new Date(),
                        value: 0
                    }
                })
            }
        }
    }, [fetchedData, token])


    // useEffect(() => console.log(fetchedData?.previousData), [fetchedData?.previousData])
    return (
        <Wrapper ref={ref}>
            {refreshing ?
                <MockLoading>
                    <Loader stroke={'white'} size={'25px'} />
                </MockLoading> :
                <>
                    {
                        type === ChartType.PRICE &&
                        <TokenInfo>
                            {token === ChartToken.TOKEN0 ? token0?.symbol : token1?.symbol}
                        </TokenInfo>
                    }
                    {
                        type === ChartType.PRICE &&
                        <ToggleToken>
                            <Toggle
                                isActive={!!token}
                                toggle={() => setToken(token === ChartToken.TOKEN0 ? 1 : 0)}
                                checked={<Trans>{token0?.symbol}</Trans>}
                                unchecked={<Trans>{token1?.symbol}</Trans>}
                            />
                        </ToggleToken>
                    }
                    <Chart
                        feeData={formattedData}
                        dimensions={{
                            width: isTablet || isMobile ? ref && ref.current && ref.current.offsetWidth - 80 || 0 : 810,
                            height: isTablet || isMobile ? 200 : 300,
                            margin: { top: 30, right: 20, bottom: isMobile ? 70 : 30, left: 50 }
                        }}
                        tokens={{ token0: token0?.symbol, token1: token1?.symbol }}
                        isMobile={isMobile}
                        span={span}
                        type={type}
                        token={token}
                    />
                </>

            }
        </Wrapper>
    )
}
