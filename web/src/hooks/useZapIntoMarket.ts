import { useCallback, useState } from 'react';
import { Token, CurrencyAmount, Percent } from '@uniswap/sdk-core';
import { TickMath } from 'lib/src';
import { useAccount, useSendCalls, useWalletClient, usePublicClient } from 'wagmi';
import { encodeFunctionData, Address, erc20Abi, decodeEventLog } from 'viem';
import { readContract, waitForCallsStatus } from '@wagmi/core';
import { wagmiConfig } from '../wagmi.config';
import { Market, Pool, getPoolTokensForMarket } from '../utils/market';
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, FARMING_CENTER, MARKET_ZAP } from '../constants/addresses';
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
  farms?: any[]; // Farm data for each pool to stake into
  autoStake?: boolean; // Whether to automatically stake NFTs into farms
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
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'tokenId', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;

// Farming Center ABI for staking
const FARMING_CENTER_ABI = [
  {
    inputs: [
      {
        components: [
          { name: 'rewardToken', type: 'address' },
          { name: 'bonusRewardToken', type: 'address' },
          { name: 'pool', type: 'address' },
          { name: 'startTime', type: 'uint256' },
          { name: 'endTime', type: 'uint256' }
        ],
        name: 'key',
        type: 'tuple'
      },
      { name: 'tokenId', type: 'uint256' },
      { name: 'tokensLocked', type: 'uint256' }
    ],
    name: 'enterFarming',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'data', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', type: 'bytes[]' }],
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

// Market Zap Simple Contract ABI - KISS principle
const MARKET_ZAP_ABI = [
  {
    inputs: [
      { name: 'market', type: 'address' },
      { name: 'collateralToken', type: 'address' },
      { name: 'splitAmount', type: 'uint256' },
      { name: 'pools', type: 'address[]' },
      { name: 'minLiquidities', type: 'uint256[]' },
      { name: 'slippageBps', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
      { name: 'rewardTokens', type: 'address[]' },
      { name: 'endTimes', type: 'uint256[]' }
    ],
    name: 'zap',
    outputs: [{ name: 'tokenIds', type: 'uint256[]' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;

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
    if (!account || !chainId) {
      throw new Error('Wallet not connected');
    }
    
    // Check if Market Zap contract is deployed
    const marketZapAddress = MARKET_ZAP[chainId];
    const useContract = marketZapAddress && marketZapAddress !== '0x0000000000000000000000000000000000000000';
    
    if (useContract && walletClient) {
      // Use the atomic Zap contract if available
      return await zapViaContract(params);
    } else if (typeof sendCallsAsync === 'function') {
      // Fall back to batched transactions
      return await zapViaBatching(params);
    } else {
      throw new Error('Neither Zap contract nor batch calls are available');
    }
  }, [account, chainId, sendCallsAsync, walletClient, publicClient]);
  
  // Zap via smart contract (atomic, preferred)
  const zapViaContract = useCallback(async (params: ZapIntoMarketParams) => {
    if (!walletClient || !chainId || !publicClient) {
      throw new Error('Wallet client not available');
    }
    
    const marketZapAddress = MARKET_ZAP[chainId];
    if (!marketZapAddress || marketZapAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error('Market Zap contract not deployed on this chain');
    }
    
    const {
      market,
      collateralToken,
      amount,
      validPools,
      slippageTolerance,
      deadline,
      farms = [],
      autoStake = false
    } = params;
    
    setLoading(true);
    
    try {
      const totalAmount = BigInt(amount.quotient.toString());
      const txDeadline = deadline ? BigInt(deadline) : BigInt(Math.floor(Date.now() / 1000) + 3600);
      
      // Calculate optimal split amount off-chain
      const SCALE = 10n ** 18n;
      let sumOfRatiosScaled = 0n;
      const poolRatios: bigint[] = [];
      
      // Get current price ratios for each pool
      for (const pool of validPools) {
        try {
          const globalState = await publicClient.readContract({
            address: pool.id as Address,
            abi: POOL_ABI,
            functionName: 'globalState'
          });
          
          const sqrtPriceX96 = globalState[0];
          const isToken0Outcome = pool.token0.id.toLowerCase() !== collateralToken.address.toLowerCase();
          const collateralRatioScaled = calculateFullRangeRatio(sqrtPriceX96, isToken0Outcome);
          
          poolRatios.push(collateralRatioScaled);
          sumOfRatiosScaled += collateralRatioScaled;
        } catch (error) {
          console.error(`Failed to get price for pool ${pool.id}, using 1:1 ratio`);
          poolRatios.push(SCALE); // Default to 1:1 ratio
          sumOfRatiosScaled += SCALE;
        }
      }
      
      // Calculate optimal split: splitAmount = totalAmount * SCALE / (SCALE + sum(ratios))
      const divisorScaled = SCALE + sumOfRatiosScaled;
      const splitAmount = (totalAmount * SCALE * 98n) / (divisorScaled * 100n); // 98% safety factor
      
      console.log('Calculated optimal split:', {
        totalAmount: totalAmount.toString(),
        splitAmount: splitAmount.toString(),
        sumOfRatios: (sumOfRatiosScaled / (10n ** 16n)).toString() + '%',
        poolCount: validPools.length
      });
      
      // Calculate minimum liquidity amounts per pool
      // Use the split amount as base, adjusted by pool ratio
      const minLiquidities = poolRatios.map(ratio => {
        // Expected liquidity is proportional to the geometric mean of amounts
        // For full range, this is roughly sqrt(outcomeAmount * collateralAmount)
        // outcomeAmount = splitAmount, collateralAmount = splitAmount * ratio / SCALE
        const collateralForPool = (splitAmount * ratio) / SCALE;
        // Approximate liquidity = sqrt(splitAmount * collateralForPool)
        // Apply slippage tolerance
        const slippageBps = BigInt(Math.floor(slippageTolerance.numerator.toString() * 10000n / slippageTolerance.denominator.toString()));
        const minLiquidity = (splitAmount * (10000n - slippageBps)) / 10000n;
        return minLiquidity / 2n; // Conservative estimate
      });
      
      // Convert slippage tolerance to basis points
      const slippageBps = BigInt(Math.floor(slippageTolerance.numerator.toString() * 10000n / slippageTolerance.denominator.toString()));
      
      // First approve the zap contract for the split amount only
      const collateralAddress = collateralToken.address as Address;
      const approveTx = await walletClient.writeContract({
        address: collateralAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [marketZapAddress as Address, splitAmount],
        chain: chain
      });
      
      console.log('Approving Market Zap contract for', splitAmount.toString(), 'collateral...');
      await publicClient.waitForTransactionReceipt({ 
        hash: approveTx,
        confirmations: 1 
      });
      
      // Prepare reward tokens and end times (address(0) means no farming for that pool)
      const rewardTokens: Address[] = [];
      const endTimes: bigint[] = [];
      
      for (const pool of validPools) {
        if (autoStake && farms && farms.length > 0) {
          const farm = farms.find(f => f.pool?.id?.toLowerCase() === pool.id.toLowerCase());
          if (farm) {
            rewardTokens.push(farm.rewardToken as Address);
            endTimes.push(BigInt(farm.endTime || farm.endTimeImplied || 2147483647));
          } else {
            // No farm for this pool, NFT will be sent to user
            rewardTokens.push('0x0000000000000000000000000000000000000000' as Address);
            endTimes.push(0n);
          }
        } else {
          // Not staking, all NFTs go to user
          rewardTokens.push('0x0000000000000000000000000000000000000000' as Address);
          endTimes.push(0n);
        }
      }
      
      // Execute the unified zap function
      console.log('Executing zap via MarketZapSimple contract...');
      if (autoStake && farms && farms.length > 0) {
        console.log('Auto-staking enabled for pools with farms');
      }
      
      const zapTx = await walletClient.writeContract({
        address: marketZapAddress as Address,
        abi: MARKET_ZAP_ABI,
        functionName: 'zap',
        args: [
          market.id as Address,
          collateralAddress,
          splitAmount,
          validPools.map(p => p.id as Address),
          minLiquidities,
          slippageBps,
          txDeadline,
          rewardTokens,
          endTimes
        ],
        chain: chain
      });
      
      console.log('Zap transaction hash:', zapTx);
      
      console.log('Waiting for zap transaction confirmation...');
      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash: zapTx,
        confirmations: 1 
      });
      console.log('Zap completed successfully!', receipt);
      
      setLoading(false);
      return zapTx;
      
    } catch (error) {
      setLoading(false);
      console.error('Zap contract execution failed:', error);
      throw error;
    }
  }, [chainId, walletClient, publicClient, chain]);
  
  // Original batched implementation (fallback)
  const zapViaBatching = useCallback(async (params: ZapIntoMarketParams) => {
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
      // splitPosition gives us splitAmount of EACH outcome token
      // We need splitAmount of collateral to perform the split
      // Additionally, we need collateral to pair with the outcome tokens for liquidity
      // For each pool: we get splitAmount of outcome, need (ratioScaled/SCALE) * splitAmount of collateral
      // Total: splitAmount (for split) + splitAmount * sum(ratios)/SCALE (for pairing)
      // splitAmount * (1 + sum(ratios)/SCALE) = totalAmount
      // splitAmount = totalAmount * SCALE / (SCALE + sum(ratios))
      
      const divisorScaled = SCALE + sumOfRatiosScaled;
      // Apply 98% factor for safety margin to account for rounding and fees
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
        
        // Calculate tick range for true full range position
        // This provides liquidity across the entire possible price range
        const tickSpacing = pool.tickSpacing ? Number(pool.tickSpacing) : 60;
        
        // Always use the full tick range, adjusted for tick spacing
        const tickLower = Math.ceil(TickMath.MIN_TICK / tickSpacing) * tickSpacing;
        const tickUpper = Math.floor(TickMath.MAX_TICK / tickSpacing) * tickSpacing;
        
        // Prepare mint parameters with slippage protection
        // Calculate the desired amounts for token0 and token1 based on token ordering
        const amount0Desired = isToken0Outcome ? outcomeAmountForPool : collateralAmountForPool;
        const amount1Desired = isToken0Outcome ? collateralAmountForPool : outcomeAmountForPool;
        
        // Calculate minimum amounts with slippage protection
        // For full-range positions, apply slippage tolerance to desired amounts
        const slippageMultiplier = 10000n - BigInt(Math.floor(Number(slippageTolerance.numerator.toString())));
        const slippageDivisor = BigInt(slippageTolerance.denominator.toString());
        
        // Apply slippage tolerance (e.g., if 0.5% slippage, multiply by 9950/10000)
        const amount0Min = (amount0Desired * slippageMultiplier) / slippageDivisor;
        const amount1Min = (amount1Desired * slippageMultiplier) / slippageDivisor;
        
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
      
      // Step 3: Execute multicall and optionally stake into farms
      let liquidityTxHash: `0x${string}` | undefined;
      const mintedTokenIds: bigint[] = [];
      
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
          
          // Wait for confirmation and get receipt to extract NFT IDs
          if (publicClient) {
            console.log('Waiting for liquidity transaction confirmation...');
            const receipt = await publicClient.waitForTransactionReceipt({ 
              hash: liquidityTxHash,
              confirmations: 1 
            });
            console.log('Liquidity transaction confirmed');
            
            // Extract NFT token IDs from the receipt logs
            // Look for Transfer events from address(0) which indicate minting
            const transferEventSignature = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
            
            for (const log of receipt.logs) {
              if (log.topics && log.topics[0] === transferEventSignature && 
                  log.address.toLowerCase() === positionManagerAddress.toLowerCase() &&
                  log.topics[1] === '0x0000000000000000000000000000000000000000000000000000000000000000') {
                // This is a mint event (from address 0)
                // topics[3] contains the tokenId
                if (log.topics[3]) {
                  const tokenId = BigInt(log.topics[3]);
                  mintedTokenIds.push(tokenId);
                  console.log('Minted NFT token ID:', tokenId.toString());
                }
              }
            }
            
            // Step 4: If autoStake is enabled and we have farms data, stake the NFTs
            if (params.autoStake && params.farms && params.farms.length > 0 && mintedTokenIds.length > 0) {
              console.log('\nStep 4: Auto-staking NFTs into farms');
              
              const farmingCenterAddress = FARMING_CENTER[chainId];
              if (!farmingCenterAddress) {
                console.warn('Farming center not configured for this chain, skipping auto-stake');
              } else {
                // Create a map of pool ID to farm data for quick lookup
                const poolToFarmMap = new Map<string, any>();
                for (const farm of params.farms) {
                  if (farm.pool?.id) {
                    poolToFarmMap.set(farm.pool.id.toLowerCase(), farm);
                  }
                }
                
                // Prepare farming calls
                const farmingCalls: Execution[] = [];
                
                // Match each minted NFT to its corresponding farm
                for (let i = 0; i < mintedTokenIds.length && i < poolConfigs.length; i++) {
                  const tokenId = mintedTokenIds[i];
                  const poolConfig = poolConfigs[i];
                  const farm = poolToFarmMap.get(poolConfig.pool.id.toLowerCase());
                  
                  if (farm) {
                    console.log(`Preparing to stake NFT ${tokenId} into farm for pool ${poolConfig.pool.id}`);
                    
                    // First approve the NFT for farming center
                    farmingCalls.push({
                      to: positionManagerAddress as Address,
                      value: 0n,
                      data: encodeFunctionData({
                        abi: POSITION_MANAGER_ABI,
                        functionName: 'approve',
                        args: [farmingCenterAddress as Address, tokenId]
                      })
                    });
                    
                    // Then enter farming (eternal farming, no tier)
                    const farmKey = {
                      rewardToken: farm.rewardToken as Address,
                      bonusRewardToken: farm.bonusRewardToken || farm.rewardToken as Address,
                      pool: poolConfig.pool.id as Address,
                      startTime: BigInt(farm.startTime || 0),
                      endTime: BigInt(farm.endTime || farm.endTimeImplied || 2147483647) // Max uint32 if no end time
                    };
                    
                    farmingCalls.push({
                      to: farmingCenterAddress as Address,
                      value: 0n,
                      data: encodeFunctionData({
                        abi: FARMING_CENTER_ABI,
                        functionName: 'enterFarming',
                        args: [farmKey, tokenId, 0n] // 0n for tokensLocked (no tier)
                      })
                    });
                  } else {
                    console.warn(`No farm found for pool ${poolConfig.pool.id}, NFT ${tokenId} will not be staked`);
                  }
                }
                
                // Execute farming operations in batches
                if (farmingCalls.length > 0) {
                  console.log(`Executing ${farmingCalls.length} farming operations`);
                  
                  // Split into batches for MetaMask limit
                  const farmingBatches: Execution[][] = [];
                  for (let i = 0; i < farmingCalls.length; i += BATCH_SIZE) {
                    farmingBatches.push(farmingCalls.slice(i, i + BATCH_SIZE));
                  }
                  
                  for (let i = 0; i < farmingBatches.length; i++) {
                    const batch = farmingBatches[i];
                    console.log(`Executing farming batch ${i + 1}/${farmingBatches.length} with ${batch.length} calls`);
                    
                    try {
                      const result = await sendCallsAsync({ calls: batch });
                      const callsId = result.id;
                      results.push(callsId);
                      console.log(`Farming batch ${i + 1} calls ID:`, callsId);
                      
                      // Wait for confirmation
                      console.log(`Waiting for farming batch ${i + 1} confirmation...`);
                      const callsResult = await waitForCallsStatus(wagmiConfig, {
                        id: callsId,
                        timeout: 30000
                      });
                      
                      if (!callsResult.receipts || callsResult.receipts.length === 0) {
                        console.error(`No receipts for farming batch ${i + 1}, staking may have failed`);
                      } else {
                        console.log(`Farming batch ${i + 1} confirmed`);
                      }
                    } catch (error) {
                      console.error(`Failed to execute farming batch ${i + 1}:`, error);
                      console.log('Note: NFTs were minted successfully but staking failed. You can stake manually.');
                    }
                  }
                  
                  console.log('All farming operations completed');
                }
              }
            }
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