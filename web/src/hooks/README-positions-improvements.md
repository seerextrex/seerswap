# Positions Page Performance Improvements

## Overview
This document outlines the improvements made to the positions page to enhance performance and add market-centric display functionality.

## Key Improvements

### 1. Performance Enhancements
- **Replaced multiple RPC calls with single GraphQL query**: Previously made N+1 blockchain calls, now uses one subgraph query
- **Estimated 10-50x faster initial load time**: From seconds to milliseconds
- **Reduced network overhead**: Eliminates multicall batching requirements

### 2. New Features
- **Market-centric view toggle**: Switch between traditional list view and market-grouped display
- **Position grouping by market**: Positions organized by their associated prediction markets
- **Enhanced position cards**: Display outcome names and market context similar to farms page
- **Pagination support**: Handles large numbers of positions efficiently

### 3. Code Quality Improvements
- **Type-safe implementation**: Uses generated GraphQL types from codegen
- **Better error handling**: Specific error messages for network and query failures
- **Comprehensive documentation**: Added JSDoc comments with important warnings

## Available Hooks

### 1. `useSubgraphPositions` (Basic)
Located in: `hooks/useSubgraphPositions.ts`
- Simple hook for fetching all user positions
- Manual type definitions (legacy)

### 2. `useSubgraphPositionsV2` (Recommended)
Located in: `hooks/useSubgraphPositionsV2.ts`
- Uses generated RTK Query hooks
- Type-safe with generated GraphQL types
- Better integration with Redux store

### 3. `useSubgraphPositionsPaginated` 
Located in: `hooks/useSubgraphPositionsPaginated.ts`
- Supports pagination for users with many positions
- Loads 20 positions at a time
- Includes `loadMore()` function

## Usage Examples

### Basic Usage
```typescript
import { useSubgraphPositions } from 'hooks/useSubgraphPositionsV2';

function MyComponent() {
  const { positions, loading, error, refetch } = useSubgraphPositions();
  
  if (loading) return <Loader />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  
  return <PositionList positions={positions} />;
}
```

### Market-Grouped Display
```typescript
import { useSubgraphPositionsByMarket } from 'hooks/useSubgraphPositionsV2';

function MarketView() {
  const { positionsByMarket, loading } = useSubgraphPositionsByMarket();
  
  return <MarketPositionsView positionsByMarket={positionsByMarket} />;
}
```

### With Pagination
```typescript
import { useSubgraphPositionsPaginated } from 'hooks/useSubgraphPositionsPaginated';

function PaginatedPositions() {
  const { positions, loading, hasMore, loadMore } = useSubgraphPositionsPaginated();
  
  return (
    <>
      <PositionList positions={positions} />
      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          Load More
        </button>
      )}
    </>
  );
}
```

## Important Limitations

### 1. Data Staleness
- Subgraph data may lag 1-2 minutes behind blockchain state
- Consider adding UI indicators for potential delays

### 2. Missing Fields
The following fields are not available from the subgraph and use default values:
- `nonce`: Always 0n
- `operator`: Always zero address
- `tokensOwed0/1`: Always 0n (requires RPC call for real-time data)

### 3. TokenId Parsing
- Current implementation parses tokenId from position ID string (format: "tokenId#blockNumber")
- This is fragile and assumes subgraph format won't change
- Consider requesting tokenId as separate field in subgraph schema

## Future Improvements

1. **Hybrid Approach**: Fetch critical real-time data (like `tokensOwed`) via RPC for accuracy
2. **Skeleton Loaders**: Add loading skeletons for better UX
3. **Infinite Scroll**: Implement infinite scroll for seamless pagination
4. **Cache Management**: Implement proper cache invalidation strategies
5. **WebSocket Updates**: Add real-time position updates via WebSocket subscriptions

## Migration Guide

To migrate from the old implementation:

1. Replace imports:
   ```typescript
   // Old
   import { useV3Positions } from 'hooks/useV3Positions';
   
   // New
   import { useSubgraphPositions } from 'hooks/useSubgraphPositionsV2';
   ```

2. Update component logic:
   ```typescript
   // Old - positions might be undefined during loading
   const { positions, loading } = useV3Positions(account);
   
   // New - includes error handling
   const { positions, loading, error, refetch } = useSubgraphPositions(account);
   ```

3. Handle the extended position type:
   ```typescript
   // New positions include pool and market data
   position.pool?.market0?.marketName
   position.pool?.totalValueLockedUSD
   ```