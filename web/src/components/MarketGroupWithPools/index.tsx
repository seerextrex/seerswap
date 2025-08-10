import React, { memo } from 'react';
import { Market, Pool } from '../../utils/market';
import { useMarketPools } from '../../hooks/useMarketPools';
import { PositionPoolExtended } from '../../hooks/useSubgraphPositions';

interface MarketGroupWithPoolsProps {
    market: Market;
    positions: PositionPoolExtended[];
    isExpanded: boolean;
    onToggle: () => void;
    onZapClick: () => void;
    MarketGroupComponent: React.ComponentType<{
        market: Market;
        positions: PositionPoolExtended[];
        pools: Pool[];
        isExpanded: boolean;
        onToggle: () => void;
        onZapClick: () => void;
    }>;
}

export const MarketGroupWithPools = memo(({ 
    market, 
    positions, 
    isExpanded, 
    onToggle, 
    onZapClick,
    MarketGroupComponent 
}: MarketGroupWithPoolsProps) => {
    // Fetch pools for this specific market
    const { pools } = useMarketPools(market);

    return (
        <MarketGroupComponent
            market={market}
            positions={positions}
            pools={pools || []}
            isExpanded={isExpanded}
            onToggle={onToggle}
            onZapClick={onZapClick}
        />
    );
});