import { useMemo } from 'react'
import { ArrowLeft } from 'react-feather'
import {
    Header,
    Navigation,
    PoolCollectedFees,
    PoolFee,
    PoolInfoWrapper,
    PoolTitle
} from './styled'

export function PoolInfoHeader({
    token0,
    token1,
    fee,
    collectedFees
}: {
    token0: any;
    token1: any;
    fee: string;
    collectedFees: string;
}) {
    const poolTitle = useMemo(() => {
        if (!token1 || !token0) return []
        if (token0.symbol === 'USDC') {
            return [token1.symbol, token0.symbol]
        }
        return [token0.symbol, token1.symbol]
    }, [token0, token1])

    return (
        <Header>
            <Navigation to={'/info/pools'}>
                <ArrowLeft style={{ marginRight: '8px' }} size={15} />
                <span>Back to pools table</span>
            </Navigation>
            <PoolInfoWrapper>
                <PoolTitle>
                    {poolTitle[0] || '...'} / {poolTitle[1] || '...'}
                </PoolTitle>
                <PoolFee>{`${+fee / 10000}%`}</PoolFee>
                <PoolCollectedFees>
                    Total Collected Fees: ${Math.round(+collectedFees) || '...'}
                </PoolCollectedFees>
            </PoolInfoWrapper>
            <span />
        </Header>
    )
}
