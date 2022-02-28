import React, { useEffect, useMemo } from 'react'
import Loader from '../Loader'
import './index.scss'
import Table from '../Table'
import DoubleCurrencyLogo from '../DoubleLogo'
import { Token } from '@uniswap/sdk-core'
import { SupportedChainId } from '../../constants/chains'
import { WrappedCurrency } from '../../models/types'
import { ChartBadge, FarmingLink, LinkWrapper } from '../InfoPoolsTable/styled'
import { TYPE } from '../../theme'
import { BarChart2, ExternalLink } from 'react-feather'
import { GreyBadge } from '../Card'
import { feeTierPercent } from '../../utils'
import { formatDollarAmount, formatPercent } from '../../utils/numbers'

interface InfoPoolsProps {
    data: any
    refreshing: boolean
    fetchHandler: () => any
    blocksFetched: boolean
}

const sortFields = [
    {
        title: 'Pool',
        value: 'feeTier'
    },
    {
        title: 'Volume 24H',
        value: 'volumeUSD'
    },
    {
        title: 'Volume 7D',
        value: 'tvlUSD'
    },
    {
        title: 'TVL',
        value: 'volumeUSDWeek'
    },
    {
        title: '🚀 APR',
        value: 'apr'
    },
    {
        title: '🔥 Farming',
        value: 'farmingApr'
    }
]

export const POOL_HIDE = [
    '0x86d257cdb7bc9c0df10e84c8709697f92770b335',
    '0xf8dbd52488978a79dfe6ffbd81a01fc5948bf9ee',
    '0x8fe8d9bb8eeba3ed688069c3d6b556c9ca258248'
]

const Pool = ({ token0, token1, fee, address } : any) => <div className={'f jc ac'}>
    <DoubleCurrencyLogo
        currency0={new Token(SupportedChainId.POLYGON, token0?.id, 18, token0.symbol) as WrappedCurrency}
        currency1={new Token(SupportedChainId.POLYGON, token1?.id, 18, token1.symbol) as WrappedCurrency}
        size={20} />
    <LinkWrapper href={`https://polygonscan.com/address/${address}`} rel='noopener noreferrer' target='_blank'>
        <TYPE.label ml='8px'>
            {/*{poolTitle[0]}/{poolTitle[1]}*/}
        </TYPE.label>
        <ExternalLink size={16} color={'white'} />
    </LinkWrapper>
    <GreyBadge ml='10px' fontSize='14px' style={{ backgroundColor: '#02365e' }}>
        {feeTierPercent(+fee)}
    </GreyBadge>
    <ChartBadge to={`/info/pools/${address}`}>
        <BarChart2 size={18} stroke={'white'} />
    </ChartBadge>
</div>

export function InfoPools({ data, fetchHandler, blocksFetched }: InfoPoolsProps) {

    useEffect(() => {
        if (blocksFetched) {
            fetchHandler()
        }
    }, [blocksFetched])

    const _data = useMemo(() => {
        return data && data.map((el: any, i: any) => {

            const pool = Pool({token0: el.token0, token1: el.token1, fee: el.fee, address: el.address })
            const apr = el.apr > 0 ? <span style={{ color: '#33FF89' }}>{formatPercent(el.apr)}</span> : <span>-</span>
            const farming = el.farmingApr > 0 ?
                <FarmingLink to={'/farming/infinite-farms'} apr={el.farmingApr > 0}>
                    {formatPercent(el.farmingApr)}
                </FarmingLink>
                : <span>-</span>

            return [i+1, pool, formatDollarAmount(el.volumeUSD), formatDollarAmount(el.volumeUSDWeek), formatDollarAmount(el.totalValueLockedUSD), apr, farming]
        })
    }, [data])

    console.log(_data)

    if (!data)
        return (
            <div className={'mock-loader'}>
                <Loader stroke={'white'} size={'25px'} />
            </div>
        )


    return <Table poolDatas={_data} sortFields={sortFields} />
}
