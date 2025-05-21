import { Pool, Position } from 'lib/src'
import { usePool } from 'hooks/usePools'
import { useCurrency } from './Tokens'
import { PositionPool } from '../models/interfaces'

export function useDerivedPositionInfo(positionDetails: PositionPool | undefined): {
    position: Position | undefined
    pool: Pool | undefined
} {
    console.log('[useDerivedPositionInfo] CALLED with positionDetails:', positionDetails ? 'DEFINED' : 'UNDEFINED');

    const currency0 = useCurrency(positionDetails?.token0)
    const currency1 = useCurrency(positionDetails?.token1)
    console.log('[useDerivedPositionInfo] positionDetails:', positionDetails);
    console.log('[useDerivedPositionInfo] currency0:', currency0);
    console.log('[useDerivedPositionInfo] currency1:', currency1);

    // construct pool data
    const [poolState, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined)

    console.log('[useDerivedPositionInfo] poolState:', poolState);
    console.log('[useDerivedPositionInfo] pool:', pool);

    let _position: Position | undefined = undefined
    if (pool && positionDetails) {
        _position = new Position({
            pool,
            liquidity: positionDetails.liquidity.toString(),
            tickLower: positionDetails.tickLower,
            tickUpper: positionDetails.tickUpper
        })
    }

    return {
        position: _position,
        pool: pool ?? undefined
    }
}
