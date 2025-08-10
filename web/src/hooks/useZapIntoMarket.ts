import { useCallback, useState } from 'react';
import { Token, CurrencyAmount, Percent } from '@uniswap/sdk-core';
import { TickMath } from 'lib/src';
import { useAccount, useSendCalls, useWalletClient, usePublicClient } from 'wagmi';
import { encodeFunctionData, Address, erc20Abi } from 'viem';
import { readContract, waitForCallsStatus } from '@wagmi/core';
import { wagmiConfig } from '../wagmi.config';
import { Market, Pool, getPoolTokensForMarket } from '../utils/market';
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from '../constants/addresses';
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

// Seer Router ABI for splitPosition that handles wrapping automatically
const ROUTER_ABI = [
  {
    inputs: [
      { name: 'collateralToken', type: 'address' },
      { name: 'market', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'splitPosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;

// Router addresses for each chain
const ROUTER_ADDRESSES: { [chainId: number]: Address } = {
  100: '0xeC9048b59b3467415b1a38F63416407eA0c70fB8', // Gnosis
  11155111: '0x6E31039abF8d248aBed57E307C9E1b7530c269E2', // Sepolia 
  1: '0x96D3f147C085993f75287f46A6aEEA5ee1881234' // Mainnet
};

// Algebra Position Manager ABI for adding liquidity
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

// Pool ABI to get current price
const POOL_ABI = [
  {
    inputs: [],
    name: 'globalState',
    outputs: [
      { name: 'price', type: 'uint160' },
      { name: 'tick', type: 'int24' },
      { name: 'fee', type: 'uint16' },
      { name: 'timepointIndex', type: 'uint16' },
      { name: 'communityFeeToken0', type: 'uint8' },
      { name: 'communityFeeToken1', type: 'uint8' },
      { name: 'unlocked', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// MetaMask has a limit of 10 calls per batch for EIP-7702
const BATCH_SIZE = 10;

/**
 * Calculate the amount of collateral needed for a full range position
 * Returns the ratio scaled by 1e18 for precision
 */
function calculateFullRangeRatio(sqrtPriceX96: bigint, isToken0Outcome: boolean): bigint {
  // sqrtPriceX96 = sqrt(price) * 2^96
  // price = (sqrtPriceX96)^2 / 2^192
  // To maintain precision, we'll work with scaled values
  
  const Q96 = 2n ** 96n;
  const SCALE = 10n ** 18n; // Use 1e18 scaling for ratio
  
  // Calculate price = (sqrtPriceX96)^2 / 2^192
  // Then scale by 1e18 for precision
  // price_scaled = (sqrtPriceX96^2 * 1e18) / 2^192
  const sqrtPriceSquared = sqrtPriceX96 * sqrtPriceX96;
  const priceScaled = (sqrtPriceSquared * SCALE) / (Q96 * Q96);
  
  if (isToken0Outcome) {
    // token0 is outcome, token1 is collateral
    // The ratio collateral/outcome is the price
    return priceScaled;
  } else {
    // token0 is collateral, token1 is outcome  
    // The ratio collateral/outcome is 1/price
    // Return SCALE^2 / priceScaled to get the inverse
    if (priceScaled === 0n) return SCALE; // Avoid division by zero
    return (SCALE * SCALE) / priceScaled;
  }
}

export function useZapIntoMarket() {
  const { address: account, chain } = useAccount();
  const chainId = chain?.id;
  const [loading, setLoading] = useState(false);
  const supports7702 = useEIP7702Support();
  const { sendCallsAsync } = useSendCalls();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

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
      const routerAddress = ROUTER_ADDRESSES[chainId];

      if (!positionManagerAddress || !routerAddress) {
        throw new Error('Required contract addresses not configured for this chain');
      }

      const collateralAddress = collateralToken.address as Address;
      const totalAmount = BigInt(amount.quotient.toString());
      
      // Step 1: Calculate how much to split based on pool ratios
      // IMPORTANT: splitPosition gives us the SAME amount of EACH outcome token
      // So if we split 100 collateral with 3 outcomes, we get 100 of outcome1, 100 of outcome2, 100 of outcome3
      
      const SCALE = 10n ** 18n; // Use 1e18 scaling for ratios
      let sumOfRatiosScaled = 0n;
      const poolConfigs: { 
        pool: Pool; 
        ratioScaled: bigint; // Ratio scaled by 1e18
        isToken0Outcome: boolean;
        outcomeTokenAddress: Address;
        poolTokens: any;
      }[] = [];
      
      // First pass: calculate sum of ratios for valid pools
      for (const allocation of params.poolAllocations) {
        const pool = allocation.pool;
        const poolTokens = getPoolTokensForMarket(pool, market);
        if (!poolTokens) continue;
        
        // Skip invalid outcome pools
        if (!poolTokens.outcomeName || 
            poolTokens.outcomeName.toLowerCase() === 'invalid' || 
            poolTokens.outcomeName.toLowerCase().includes('invalid')) {
          continue;
        }
        
        const isToken0Outcome = pool.token0.id.toLowerCase() === poolTokens.outcomeToken.id.toLowerCase();
        const outcomeTokenAddress = (isToken0Outcome ? pool.token0.id : pool.token1.id) as Address;
        const collateralTokenAddress = (isToken0Outcome ? pool.token1.id : pool.token0.id) as Address;
        
        // Verify this pool uses our collateral
        if (collateralTokenAddress.toLowerCase() !== collateralAddress.toLowerCase()) {
          console.log(`Pool ${pool.id} doesn't use our collateral token, skipping`);
          continue;
        }
        
        // Get pool's current price to calculate ratio
        const poolContract = {
          address: pool.id as Address,
          abi: POOL_ABI,
          functionName: 'globalState' as const
        };
        
        try {
          const globalState = await readContract(wagmiConfig, poolContract);
          const sqrtPriceX96 = globalState[0];
          const collateralRatioScaled = calculateFullRangeRatio(sqrtPriceX96, isToken0Outcome);
          
          poolConfigs.push({
            pool,
            ratioScaled: collateralRatioScaled,
            isToken0Outcome,
            outcomeTokenAddress,
            poolTokens
          });
          
          sumOfRatiosScaled += collateralRatioScaled;
        } catch (error) {
          console.error(`Failed to get price for pool ${pool.id}:`, error);
          // Use a default ratio if we can't get the price (1:1)
          poolConfigs.push({
            pool,
            ratioScaled: SCALE, // 1.0 scaled
            isToken0Outcome,
            outcomeTokenAddress,
            poolTokens
          });
          sumOfRatiosScaled += SCALE;
        }
      }
      
      // Check if we found any valid pools
      if (poolConfigs.length === 0) {
        setLoading(false);
        throw new Error('No valid pools found for the selected market and collateral token. Make sure pools exist for non-invalid outcomes.');
      }
      
      // Calculate the optimal split amount
      // We'll receive splitAmount of EACH outcome token
      // For each pool, we need (ratioScaled/SCALE) * splitAmount of collateral
      // Total collateral needed = splitAmount * sum(ratios)/SCALE
      // So: splitAmount + splitAmount * sum(ratios)/SCALE = totalAmount
      // splitAmount * (1 + sum(ratios)/SCALE) = totalAmount
      // splitAmount * (SCALE + sum(ratios))/SCALE = totalAmount
      // splitAmount = totalAmount * SCALE / (SCALE + sum(ratios))
      
      const divisorScaled = SCALE + sumOfRatiosScaled;
      // Apply 98% factor for safety margin (98/100)
      const splitAmount = (totalAmount * SCALE * 98n) / (divisorScaled * 100n);
      const collateralReserved = totalAmount - splitAmount;
      
      console.log('Zap calculation:', {
        totalAmount: totalAmount.toString(),
        sumOfRatiosScaled: sumOfRatiosScaled.toString(),
        divisorScaled: divisorScaled.toString(),
        splitAmount: splitAmount.toString(),
        collateralReserved: collateralReserved.toString(),
        poolCount: poolConfigs.length
      });

      // We need to structure calls carefully:
      // First batch: Approve collateral for router + splitPosition (creates outcome tokens)
      // Second batch onwards: Approve outcome tokens and collateral for position manager
      
      const firstBatchCalls: Execution[] = [];
      const approvalCalls: Execution[] = [];
      
      // Step 2: Approve router for collateral (goes in first batch)
      firstBatchCalls.push({
        to: collateralAddress,
        value: 0n,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: 'approve',
          args: [routerAddress, splitAmount]
        })
      });

      // Step 3: Split position (goes in first batch)
      if (!market.id) {
        throw new Error('Market address not available');
      }
      
      firstBatchCalls.push({
        to: routerAddress,
        value: 0n,
        data: encodeFunctionData({
          abi: ROUTER_ABI,
          functionName: 'splitPosition',
          args: [
            collateralAddress,
            market.id as Address,
            splitAmount
          ]
        })
      });

      // Step 4: Approve all tokens and prepare mint calls
      const mintCalls: `0x${string}`[] = [];
      const txDeadline = deadline ? BigInt(deadline) : BigInt(Math.floor(Date.now() / 1000) + 3600);
      
      // We need to calculate the total collateral needed across all pools
      let totalCollateralNeeded = 0n;
      
      for (const config of poolConfigs) {
        const { pool, ratioScaled, isToken0Outcome, outcomeTokenAddress } = config;
        
        // After split, we have splitAmount of this outcome token
        // We need (ratioScaled/SCALE) * splitAmount of collateral to match it
        const outcomeAmountForPool = splitAmount;
        const collateralAmountForPool = (splitAmount * ratioScaled) / SCALE;
        
        // Accumulate total collateral needed
        totalCollateralNeeded += collateralAmountForPool;
        
        console.log(`Pool ${pool.id}:`, {
          outcomeToken: outcomeTokenAddress,
          isToken0Outcome,
          ratioScaled: ratioScaled.toString(),
          outcomeAmount: outcomeAmountForPool.toString(),
          collateralAmount: collateralAmountForPool.toString()
        });
        
        // Approve outcome token (goes in second batch after split)
        approvalCalls.push({
          to: outcomeTokenAddress,
          value: 0n,
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: 'approve',
            args: [positionManagerAddress as Address, outcomeAmountForPool]
          })
        });
        
        // Calculate tick range for prediction market "full range"
        // Full range means outcome token price from 0 to 1 collateral
        const tickSpacing = pool.tickSpacing ? Number(pool.tickSpacing) : 60;
        
        let tickLower: number;
        let tickUpper: number;
        
        if (isToken0Outcome) {
          // token0 is outcome, token1 is collateral
          // Price represents collateral/outcome
          // We want range [0, 1] collateral per outcome
          // tick = 0 corresponds to price = 1
          // MIN_TICK corresponds to price ≈ 0
          tickLower = Math.ceil(TickMath.MIN_TICK / tickSpacing) * tickSpacing;
          tickUpper = 0; // Price = 1 at tick 0
        } else {
          // token0 is collateral, token1 is outcome
          // Price represents outcome/collateral  
          // We want range [1, ∞] outcome per collateral
          // tick = 0 corresponds to price = 1
          // MAX_TICK corresponds to price ≈ ∞ (outcome worthless)
          tickLower = 0; // Price = 1 at tick 0
          tickUpper = Math.floor(TickMath.MAX_TICK / tickSpacing) * tickSpacing;
        }
        
        // Prepare mint parameters with slippage protection
        // Calculate the desired amounts for token0 and token1 based on token ordering
        const amount0Desired = isToken0Outcome ? outcomeAmountForPool : collateralAmountForPool;
        const amount1Desired = isToken0Outcome ? collateralAmountForPool : outcomeAmountForPool;
        
        // For full-range positions, the actual amounts used can be VERY different
        // from the desired amounts because liquidity is distributed across the entire range
        // Setting minimums to 0 to avoid slippage reverts
        // TODO: Calculate proper minimums based on liquidity math for full-range positions
        const amount0Min = 0n;
        const amount1Min = 0n;
        
        console.log(`Mint params for pool ${pool.id}:`, {
          tickLower,
          tickUpper,
          token0: pool.token0.id,
          token1: pool.token1.id,
          isToken0Outcome,
          amount0Desired: amount0Desired.toString(),
          amount1Desired: amount1Desired.toString(),
          amount0Min: amount0Min.toString(),
          amount1Min: amount1Min.toString(),
          slippagePct: `${slippageTolerance.toFixed(2)}%`,
        });
        
        mintCalls.push(encodeFunctionData({
          abi: POSITION_MANAGER_ABI,
          functionName: 'mint',
          args: [{
            token0: pool.token0.id as Address,
            token1: pool.token1.id as Address,
            tickLower,
            tickUpper,
            amount0Desired,
            amount1Desired,
            amount0Min,
            amount1Min,
            recipient: account,
            deadline: txDeadline
          }]
        }));
      }
      
      // Add a single approval for the total collateral needed across all pools
      console.log('Total collateral needed for all pools:', totalCollateralNeeded.toString());
      
      // Only approve collateral if we actually need some
      if (totalCollateralNeeded > 0n) {
        approvalCalls.push({
          to: collateralAddress,
          value: 0n,
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: 'approve',
            args: [positionManagerAddress as Address, totalCollateralNeeded]
          })
        });
      }
      
      // Step 5: DON'T add multicall to the batch - we'll execute it separately
      // This allows better debugging on block explorers
      
      // Execute all calls using EIP-7702 batching
      if (!supports7702) {
        throw new Error('EIP-7702 not supported. This feature requires batch transaction support.');
      }

      console.log('Executing zap - Part 1: Split Position');
      console.log('- Total input:', totalAmount.toString());
      console.log('- Amount to split:', splitAmount.toString());
      console.log('- Collateral reserved:', collateralReserved.toString());
      console.log('- Number of pools:', poolConfigs.length);
      
      const results: string[] = [];
      
      // Execute first batch: collateral approval + splitPosition
      console.log(`Step 1: Executing splitPosition batch with ${firstBatchCalls.length} calls`);
      try {
        const result = await sendCallsAsync({ calls: firstBatchCalls });
        const callsId = result.id;
        results.push(callsId);
        console.log('SplitPosition calls ID:', callsId);
        
        // Wait for the calls to be confirmed
        console.log('Waiting for splitPosition confirmation...');
        const callsResult = await waitForCallsStatus(wagmiConfig, {
          id: callsId,
          timeout: 30000 // 30 second timeout
        });
        
        if (!callsResult.receipts || callsResult.receipts.length === 0) {
          throw new Error('No receipts received for splitPosition batch');
        }
        
        console.log('SplitPosition confirmed, outcome tokens created');
      } catch (error) {
        console.error('SplitPosition failed:', error);
        throw new Error(`Failed to execute splitPosition: ${error}`);
      }
      
      // Now execute approval calls in batches
      if (approvalCalls.length > 0) {
        console.log(`\nStep 2: Executing ${approvalCalls.length} approval calls for liquidity provision`);
        
        // Split approval calls into batches to handle MetaMask's limit
        const approvalBatches: Execution[][] = [];
        for (let i = 0; i < approvalCalls.length; i += BATCH_SIZE) {
          approvalBatches.push(approvalCalls.slice(i, i + BATCH_SIZE));
        }
        
        console.log(`Splitting ${approvalCalls.length} approval calls into ${approvalBatches.length} batch(es)`);
        
        // Process each approval batch sequentially
        for (let i = 0; i < approvalBatches.length; i++) {
          const batch = approvalBatches[i];
          console.log(`Executing approval batch ${i + 1}/${approvalBatches.length} with ${batch.length} calls`);
          
          try {
            const result = await sendCallsAsync({ calls: batch });
            const callsId = result.id;
            results.push(callsId);
            console.log(`Approval batch ${i + 1} calls ID:`, callsId);
            
            // Wait for this batch to be confirmed before proceeding to the next
            console.log(`Waiting for approval batch ${i + 1} confirmation...`);
            const callsResult = await waitForCallsStatus(wagmiConfig, {
              id: callsId,
              timeout: 30000 // 30 second timeout
            });
            
            if (!callsResult.receipts || callsResult.receipts.length === 0) {
              throw new Error(`No receipts received for approval batch ${i + 1}`);
            }
            
            console.log(`Approval batch ${i + 1} confirmed`);
          } catch (error) {
            console.error(`Approval batch ${i + 1} failed:`, error);
            throw new Error(`Failed to execute approval batch ${i + 1}/${approvalBatches.length}: ${error}`);
          }
        }
        
        console.log('All approvals confirmed');
      }
      
      // Step 3: Execute multicall as a regular transaction (not 7702 batched)
      let liquidityTxHash: `0x${string}` | undefined;
      
      if (mintCalls.length > 0) {
        console.log(`\nStep 3: Adding liquidity with ${mintCalls.length} mint operations via regular multicall`);
        
        if (!walletClient) {
          throw new Error('Wallet client not available for liquidity transaction');
        }
        
        try {
          // Execute multicall as a regular transaction
          const multicallTx = await walletClient.writeContract({
            address: positionManagerAddress as Address,
            abi: POSITION_MANAGER_ABI,
            functionName: 'multicall',
            args: [mintCalls],
            chain: chain
          });
          
          liquidityTxHash = multicallTx;
          console.log('Liquidity multicall transaction hash:', liquidityTxHash);
          
          // Wait for confirmation
          if (publicClient) {
            console.log('Waiting for liquidity transaction confirmation...');
            await publicClient.waitForTransactionReceipt({ 
              hash: liquidityTxHash,
              confirmations: 1 
            });
            console.log('Liquidity transaction confirmed');
          }
        } catch (error) {
          console.error('Failed to execute liquidity multicall:', error);
          console.error('Note: Approvals and split were successful. You may need to manually add liquidity.');
          throw new Error(`Liquidity provision failed: ${error}. Tokens were split and approved successfully.`);
        }
      } else {
        console.warn('No valid pools found for liquidity provision');
      }

      setLoading(false);
      
      // Return the liquidity tx hash if available, otherwise the last batch hash
      return liquidityTxHash || results[results.length - 1] as `0x${string}`;

    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, [account, chainId, chain, supports7702, sendCallsAsync, walletClient, publicClient]);

  return {
    zapIntoMarket,
    loading
  };
}