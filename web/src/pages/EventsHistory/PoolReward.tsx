import React from 'react'
import DoubleCurrencyLogo from '../../components/DoubleLogo'

interface PoolRewardProps {
    pool: any
}

export default function PoolReward({ pool }: PoolRewardProps) {
    return (
        <div className={'f f-ac'}>
            <div>
                <DoubleCurrencyLogo
                    currency0={pool.token1}
                    currency1={pool.token0}
                    size={32}
                    margin
                />
            </div>
            <div className={'ml-05'}>
                <div>{pool.token0.symbol}</div>
                <div>{pool.token1.symbol}</div>
            </div>
        </div>
    )
};
