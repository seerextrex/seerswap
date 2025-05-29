import { Pool, Position } from 'lib/src'
import { usePool } from 'hooks/usePools'
import { useCurrency } from './Tokens'
import { PositionPool } from '../models/interfaces'
import { useMemo } from 'react'

export function useDerivedPositionInfo(positionDetails: PositionPool | undefined): {
    position: Position | undefined
    pool: Pool | undefined
} {
    // Get currencies directly from token addresses
    const currency0 = useCurrency(positionDetails?.token0);
    const currency1 = useCurrency(positionDetails?.token1);

    // construct pool data - only call when we have both currencies
    const [poolState, pool] = usePool(
        currency0 ?? undefined,
        currency1 ?? undefined
    );

    // Memoize the position creation to prevent unnecessary recalculations
    const position = useMemo(() => {
        if (!pool || !positionDetails || !positionDetails.liquidity) {
            return undefined;
        }

        try {
            return new Position({
                pool,
                liquidity: positionDetails.liquidity.toString(),
                tickLower: positionDetails.tickLower,
                tickUpper: positionDetails.tickUpper
            });
        } catch (error) {
            console.error('[useDerivedPositionInfo] Error creating position:', error);
            return undefined;
        }
    }, [pool, positionDetails]);

    return useMemo(() => ({
        position,
        pool: pool ?? undefined
    }), [position, pool]);
}
