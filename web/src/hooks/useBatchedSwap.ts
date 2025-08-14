import { useMemo, useCallback } from 'react';
import { useAccount, useSendCalls } from 'wagmi';
import { encodeFunctionData, parseAbi, Address } from 'viem';
import { Trade as V3Trade } from 'lib/src';
import { Currency, TradeType, Percent } from '@uniswap/sdk-core';
import { SwapRouter } from '../lib/src';
import { SWAP_ROUTER_ADDRESSES } from '../constants/addresses';
import useTransactionDeadline from './useTransactionDeadline';

// ERC20 ABI for approve function
const ERC20_ABI = parseAbi([
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
]);

interface UseBatchedSwapParams {
  trade: V3Trade<Currency, Currency, TradeType> | undefined;
  allowedSlippage: Percent;
  needsApproval: boolean;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

export function useBatchedSwap({
  trade,
  allowedSlippage,
  needsApproval,
  onSuccess,
  onError,
}: UseBatchedSwapParams) {
  const { address: account, chainId } = useAccount();
  const deadline = useTransactionDeadline();
  
  const { sendCallsAsync, isPending } = useSendCalls();

  const swapRouterAddress = chainId ? SWAP_ROUTER_ADDRESSES[chainId] : undefined;

  // Build the batch of calls (approve + swap)
  const calls = useMemo(() => {
    if (!trade || !account || !swapRouterAddress || !deadline) return null;

    const batchedCalls = [];

    // Add approve call if needed
    if (needsApproval) {
      const tokenAddress = trade.inputAmount.currency.wrapped.address as Address;
      const approveAmount = trade.inputAmount.quotient.toString();
      
      const approveCalldata = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [swapRouterAddress as Address, BigInt(approveAmount)],
      });

      batchedCalls.push({
        to: tokenAddress,
        data: approveCalldata,
        value: BigInt(0),
      });
    }

    // Add swap call
    const deadlineString = typeof deadline === 'bigint' ? deadline.toString() : String(deadline);
    
    const swapParams = SwapRouter.swapCallParameters(trade, {
      feeOnTransfer: false,
      recipient: account,
      slippageTolerance: allowedSlippage,
      deadline: deadlineString,
    });

    if (swapParams) {
      batchedCalls.push({
        to: swapRouterAddress as Address,
        data: swapParams.calldata as `0x${string}`,
        value: BigInt(swapParams.value || 0),
      });
    }

    return batchedCalls;
  }, [trade, account, swapRouterAddress, deadline, needsApproval, allowedSlippage]);

  const executeBatchedSwap = useCallback(async () => {
    if (!calls || calls.length === 0) {
      onError?.(new Error('No calls to execute'));
      return;
    }

    try {
      // EIP-7702 batching is enabled by using sendCalls
      // No special capabilities needed for basic batching
      const result = await sendCallsAsync({
        calls,
        chainId,
      });

      if (result) {
        onSuccess?.(result);
      }
    } catch (error) {
      console.error('Batched swap failed:', error);
      onError?.(error as Error);
    }
  }, [calls, chainId, sendCallsAsync, onSuccess, onError]);

  return {
    executeBatchedSwap,
    isExecuting: isPending,
    canExecute: !!calls && calls.length > 0,
  };
}