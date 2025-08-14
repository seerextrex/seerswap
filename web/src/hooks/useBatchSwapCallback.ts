import { useCallback, useMemo } from "react";
import { useAccount, useSendCalls } from "wagmi";
import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { wagmiConfig } from "../wagmi.config";
import { useTransactionAdder } from "../state/transactions/hooks";
import { SWAP_ROUTER_ADDRESSES } from "../constants/addresses";
import { useEIP7702Support, type Execution } from "./useEIP7702Support";
import { Currency, CurrencyAmount, Percent, TradeType } from "@uniswap/sdk-core";
import { Trade as V3Trade } from "lib/src";
import { Address, erc20Abi, encodeFunctionData } from "viem";
import { t } from "@lingui/macro";
import { SwapRouter } from "../lib/src";
import useTransactionDeadline from "./useTransactionDeadline";
import useENS from "./useENS";
import { SignatureData } from "./useERC20Permit";
import { ApprovalState } from "./useApproveCallback";
import SWAP_ROUTER_ABI from "../abis/swap-router.json";

enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface BatchSwapResult {
  hash: `0x${string}`;
}

/**
 * Returns a function that will execute a swap with optional batched approval
 * using EIP-7702 when supported, or falling back to sequential transactions
 */
export function useBatchSwapCallback(
  trade: V3Trade<Currency, Currency, TradeType> | undefined,
  allowedSlippage: Percent,
  recipientAddressOrName: string | null,
  signatureData: SignatureData | undefined | null,
  approvalState?: ApprovalState,
  approveAmount?: CurrencyAmount<Currency>
): { 
  state: SwapCallbackState; 
  callback: null | (() => Promise<string>); 
  error: string | null;
  supports7702: boolean;
} {
  const { address: account, chain } = useAccount();
  const chainId = chain?.id;
  const supports7702 = useEIP7702Support();
  const { sendCallsAsync } = useSendCalls();
  const addTransaction = useTransactionAdder();
  const deadline = useTransactionDeadline();
  
  const { address: recipientAddress } = useENS(recipientAddressOrName);
  const recipient = recipientAddressOrName === null ? account : recipientAddress;

  const callback = useCallback(async (): Promise<string> => {
    if (!trade || !account || !chainId || !recipient || !deadline) {
      throw new Error("Missing required parameters for swap");
    }

    const swapRouterAddress = SWAP_ROUTER_ADDRESSES[chainId] as Address;
    if (!swapRouterAddress) {
      throw new Error("Swap router not found for this chain");
    }

    const inputCurrency = trade.inputAmount.currency;
    const outputCurrency = trade.outputAmount.currency;
    
    // Check if we need approval and can use EIP-7702
    const needsApproval = approvalState === ApprovalState.NOT_APPROVED && 
                          inputCurrency.isToken && 
                          approveAmount && 
                          !approveAmount.equalTo(0);
    
    const canUseBatch = supports7702 && !!sendCallsAsync && needsApproval;

    try {
      if (canUseBatch) {
        console.log("🚀 Using EIP-7702 batch execution for approve + swap");
        
        const calls: Execution[] = [];
        
        // Add approval call
        if (needsApproval && inputCurrency.isToken && approveAmount) {
          calls.push({
            to: inputCurrency.address as Address,
            value: 0n,
            data: encodeFunctionData({
              abi: erc20Abi,
              functionName: 'approve',
              args: [swapRouterAddress, BigInt(approveAmount.quotient.toString())],
            }),
          });
        }
        
        // Add swap call
        const deadlineString = typeof deadline === 'bigint' ? deadline.toString() : String(deadline);
        const swapParams = SwapRouter.swapCallParameters(trade, {
          feeOnTransfer: false,
          recipient,
          slippageTolerance: allowedSlippage,
          deadline: deadlineString,
          ...(signatureData
            ? {
                inputTokenPermit:
                  "allowed" in signatureData
                    ? {
                        expiry: signatureData.deadline,
                        nonce: signatureData.nonce,
                        s: signatureData.s,
                        r: signatureData.r,
                        v: signatureData.v as any,
                      }
                    : {
                        deadline: signatureData.deadline,
                        amount: signatureData.amount,
                        s: signatureData.s,
                        r: signatureData.r,
                        v: signatureData.v as any,
                      },
              }
            : {}),
        });
        
        calls.push({
          to: swapRouterAddress,
          value: BigInt(swapParams.value),
          data: swapParams.calldata as `0x${string}`,
        });
        
        // Execute all calls atomically
        const result = await sendCallsAsync({ calls });
        const hash = result.id as `0x${string}`;
        
        // Add transaction to history
        const inputSymbol = inputCurrency.symbol || 'Unknown';
        const outputSymbol = outputCurrency.symbol || 'Unknown';
        const inputAmount = trade.inputAmount.toSignificant(3);
        const outputAmount = trade.outputAmount.toSignificant(3);
        
        addTransaction({ hash } as any, {
          summary: needsApproval 
            ? t`Approved and swapped ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol} (batched)`
            : t`Swapped ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol} (batched)`,
        });
        
        console.log(`✅ EIP-7702 batch execution completed: ${calls.length} operations in 1 transaction`);
        return hash;
        
      } else {
        // Fallback: Execute regular swap (approval should be done separately)
        console.log("Using standard swap execution");
        
        if (needsApproval) {
          throw new Error("Token approval required. Please approve before swapping.");
        }
        
        const deadlineString = typeof deadline === 'bigint' ? deadline.toString() : String(deadline);
        const swapParams = SwapRouter.swapCallParameters(trade, {
          feeOnTransfer: false,
          recipient,
          slippageTolerance: allowedSlippage,
          deadline: deadlineString,
          ...(signatureData
            ? {
                inputTokenPermit:
                  "allowed" in signatureData
                    ? {
                        expiry: signatureData.deadline,
                        nonce: signatureData.nonce,
                        s: signatureData.s,
                        r: signatureData.r,
                        v: signatureData.v as any,
                      }
                    : {
                        deadline: signatureData.deadline,
                        amount: signatureData.amount,
                        s: signatureData.s,
                        r: signatureData.r,
                        v: signatureData.v as any,
                      },
              }
            : {}),
        });
        
        // Execute swap using writeContract
        const hash = await writeContract(wagmiConfig, {
          address: swapRouterAddress,
          abi: SWAP_ROUTER_ABI,
          functionName: 'multicall',
          args: [[swapParams.calldata]],
          value: BigInt(swapParams.value),
        } as any);
        
        // Add transaction to history
        const inputSymbol = inputCurrency.symbol || 'Unknown';
        const outputSymbol = outputCurrency.symbol || 'Unknown';
        const inputAmount = trade.inputAmount.toSignificant(3);
        const outputAmount = trade.outputAmount.toSignificant(3);
        
        addTransaction({ hash } as any, {
          summary: t`Swapped ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`,
        });
        
        return hash;
      }
      
    } catch (error: any) {
      console.error("Batch swap error:", error);
      
      // Re-throw with user-friendly message
      if (error.code === 4001) {
        throw new Error("Transaction rejected by user");
      } else if (error.message?.includes("insufficient funds")) {
        throw new Error("Insufficient funds for swap");
      } else if (error.message?.includes("sendCalls")) {
        throw new Error("Batch transactions not supported by wallet");
      }
      
      throw error;
    }
  }, [
    trade,
    account,
    chainId,
    recipient,
    deadline,
    supports7702,
    sendCallsAsync,
    approvalState,
    approveAmount,
    allowedSlippage,
    signatureData,
    addTransaction
  ]);

  return useMemo(() => {
    if (!trade || !account || !chainId) {
      return {
        state: SwapCallbackState.INVALID,
        callback: null,
        error: "Missing dependencies",
        supports7702,
      };
    }
    
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return {
          state: SwapCallbackState.INVALID,
          callback: null,
          error: "Invalid recipient",
          supports7702,
        };
      } else {
        return { 
          state: SwapCallbackState.LOADING, 
          callback: null, 
          error: null,
          supports7702,
        };
      }
    }

    return {
      state: SwapCallbackState.VALID,
      callback,
      error: null,
      supports7702,
    };
  }, [trade, account, chainId, recipient, recipientAddressOrName, callback, supports7702]);
}