import { useCallback, useState } from 'react';
import { Token, CurrencyAmount, Percent } from '@uniswap/sdk-core';
import { TickMath, nearestUsableTick, NonfungiblePositionManager, Position } from 'lib/src';
import { useAccount, useSendCalls } from 'wagmi';
import { encodeFunctionData, Address, erc20Abi } from 'viem';
import { wagmiConfig } from '../wagmi.config';
import { Market, Pool, getPoolTokensForMarket } from '../utils/market';
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, CONDITIONAL_TOKENS_ADDRESS } from '../constants/addresses';
import { useEIP7702Support, type Execution } from './useEIP7702Support';

interface PoolAllocation {
  pool: Pool;
  amount: CurrencyAmount<Token>;
}

interface ZapIntoMarketParams {
  market: Market;
  collateralToken: Token;
  amount: CurrencyAmount<Token>;
  poolAllocations: PoolAllocation[];
  validPools: Pool[];
  slippageTolerance: Percent;
  deadline?: string;
}

// ConditionalTokens ABI for splitPosition
const CONDITIONAL_TOKENS_ABI = [
  {
    inputs: [
      { name: 'collateralToken', type: 'address' },
      { name: 'parentCollectionId', type: 'bytes32' },
      { name: 'conditionId', type: 'bytes32' },
      { name: 'partition', type: 'uint256[]' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'splitPosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;

// Position Manager ABI for adding liquidity
const POSITION_MANAGER_ABI = [
  {
    inputs: [{ name: 'data', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', type: 'bytes[]' }],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          { name: 'token0', type: 'address' },
          { name: 'token1', type: 'address' },
          { name: 'fee', type: 'uint24' },
          { name: 'tickLower', type: 'int24' },
          { name: 'tickUpper', type: 'int24' },
          { name: 'amount0Desired', type: 'uint256' },
          { name: 'amount1Desired', type: 'uint256' },
          { name: 'amount0Min', type: 'uint256' },
          { name: 'amount1Min', type: 'uint256' },
          { name: 'recipient', type: 'address' },
          { name: 'deadline', type: 'uint256' }
        ],
        name: 'params',
        type: 'tuple'
      }
    ],
    name: 'mint',
    outputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'liquidity', type: 'uint128' },
      { name: 'amount0', type: 'uint256' },
      { name: 'amount1', type: 'uint256' }
    ],
    stateMutability: 'payable',
    type: 'function'
  }
] as const;

// Helper to get tick spacing based on fee tier
function getTickSpacing(fee: number): number {
  switch(fee) {
    case 100: // 0.01%
      return 1;
    case 500: // 0.05%
      return 10;
    case 3000: // 0.3%
      return 60;
    case 10000: // 1%
      return 200;
    default:
      return 60; // Default to 0.3% tier
  }
}


export function useZapIntoMarket() {
  const { address: account, chain } = useAccount();
  const chainId = chain?.id;
  const [loading, setLoading] = useState(false);
  const supports7702 = useEIP7702Support();
  const { sendCallsAsync } = useSendCalls();

  const zapIntoMarket = useCallback(async (params: ZapIntoMarketParams) => {
    if (!account || !chainId || !sendCallsAsync) {
      throw new Error('Wallet not connected or batch calls not supported');
    }

    const {
      market,
      collateralToken,
      amount,
      validPools,
      slippageTolerance,
      deadline
    } = params;

    setLoading(true);

    try {
      const calls: Execution[] = [];
      const positionManagerAddress = NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId];
      const conditionalTokensAddress = CONDITIONAL_TOKENS_ADDRESS[chainId];

      if (!positionManagerAddress || !conditionalTokensAddress) {
        throw new Error('Required contract addresses not configured for this chain');
      }

      // Step 1: Approve collateral token to ConditionalTokens contract
      const collateralAddress = collateralToken.address as Address;
      calls.push({
        to: collateralAddress,
        value: 0n,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: 'approve',
          args: [conditionalTokensAddress as Address, BigInt(amount.quotient.toString())]
        })
      });

      // Step 2: Split position (mint all outcome tokens)
      // We need to get the conditionId and parentCollectionId from the market
      // For now, we'll use a simple partition that splits into all outcomes
      const numOutcomes = market.outcomes?.length || 2;
      const partition = Array.from({ length: numOutcomes }, (_, i) => BigInt(1 << i));
      
      // Get conditionId and parentCollectionId from market data
      if (!market.conditionId) {
        throw new Error('Market conditionId not available');
      }
      const conditionId = market.conditionId;
      const parentCollectionId = market.parentCollectionId || '0x0000000000000000000000000000000000000000000000000000000000000000';
      
      calls.push({
        to: conditionalTokensAddress as Address,
        value: 0n,
        data: encodeFunctionData({
          abi: CONDITIONAL_TOKENS_ABI,
          functionName: 'splitPosition',
          args: [
            collateralAddress,
            parentCollectionId as `0x${string}`,
            conditionId as `0x${string}`,
            partition,
            BigInt(amount.quotient.toString())
          ]
        })
      });

      // Step 3: Approve all outcome tokens and prepare mint calls for multicall
      const mintCalls: `0x${string}`[] = [];
      const txDeadline = deadline ? BigInt(deadline) : BigInt(Math.floor(Date.now() / 1000) + 3600);
      
      for (const pool of validPools) {
        const poolTokens = getPoolTokensForMarket(pool, market);
        if (!poolTokens) continue;

        const { outcomeToken, collateralToken: poolCollateral } = poolTokens;
        
        // Find the allocation for this pool from the calculated allocations
        const allocation = params.poolAllocations.find(a => a.pool.id === pool.id);
        if (!allocation) {
          console.warn(`No allocation found for pool ${pool.id}, skipping`);
          continue;
        }
        
        // Determine token order
        const isToken0Outcome = pool.token0.id.toLowerCase() === outcomeToken.id.toLowerCase();
        
        // Get tick spacing based on fee tier
        const feeAmount = Number(pool.fee) as 100 | 500 | 3000 | 10000;
        const tickSpacing = getTickSpacing(feeAmount);
        
        // Calculate full range ticks (0 to 1 collateral price)
        // Full range means from MIN_TICK to MAX_TICK
        const tickLower = nearestUsableTick(TickMath.MIN_TICK, tickSpacing);
        const tickUpper = nearestUsableTick(TickMath.MAX_TICK, tickSpacing);

        // Use the allocation amount from the TVL-proportional calculation
        const outcomeAmount = BigInt(allocation.amount.quotient.toString());
        
        // Approve outcome token to position manager
        const outcomeTokenAddress = (isToken0Outcome ? pool.token0.id : pool.token1.id) as Address;
        calls.push({
          to: outcomeTokenAddress,
          value: 0n,
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: 'approve',
            args: [positionManagerAddress as Address, outcomeAmount]
          })
        });

        // Calculate minimum amounts with slippage protection
        const slippageMultiplier = 1 - parseFloat(slippageTolerance.toFixed(4));
        const minOutcomeAmount = BigInt(Math.floor(Number(outcomeAmount) * slippageMultiplier));
        
        // Prepare mint call for multicall
        mintCalls.push(encodeFunctionData({
          abi: POSITION_MANAGER_ABI,
          functionName: 'mint',
          args: [{
            token0: pool.token0.id as Address,
            token1: pool.token1.id as Address,
            fee: Number(pool.fee) as 100 | 500 | 3000 | 10000,
            tickLower,
            tickUpper,
            amount0Desired: isToken0Outcome ? outcomeAmount : 0n,
            amount1Desired: isToken0Outcome ? 0n : outcomeAmount,
            amount0Min: isToken0Outcome ? minOutcomeAmount : 0n,
            amount1Min: isToken0Outcome ? 0n : minOutcomeAmount,
            recipient: account,
            deadline: txDeadline
          }]
        }));
      }
      
      // Step 4: Execute all mint calls via multicall
      if (mintCalls.length > 0) {
        calls.push({
          to: positionManagerAddress as Address,
          value: 0n,
          data: encodeFunctionData({
            abi: POSITION_MANAGER_ABI,
            functionName: 'multicall',
            args: [mintCalls]
          })
        });
      }

      // Execute all calls using EIP-7702 batching
      if (!supports7702) {
        throw new Error('EIP-7702 not supported. This feature requires batch transaction support.');
      }

      console.log('Executing zap with', calls.length, 'calls');
      const result = await sendCallsAsync({ calls });
      
      // Extract the transaction hash from the result
      const txHash = result.id as `0x${string}`;

      setLoading(false);
      return txHash;

    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, [account, chainId, supports7702, sendCallsAsync]);

  return {
    zapIntoMarket,
    loading
  };
}