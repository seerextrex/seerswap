import { useCallback, useState } from "react";
import { useAccount, useSendCalls } from "wagmi";
import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { wagmiConfig } from "../wagmi.config";
import { useTransactionAdder } from "../state/transactions/hooks";
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from "../constants/addresses";
import { useEIP7702Support, type Execution } from "./useEIP7702Support";
import { Currency, CurrencyAmount, Percent } from "@uniswap/sdk-core";
import { NonfungiblePositionManager as NonFunPosMan } from "lib/src/nonfungiblePositionManager";
import { Field } from "../state/mint/actions";
import { IDerivedMintInfo } from "../state/mint/v3/hooks";
import { Address, erc20Abi, encodeFunctionData } from "viem";
import { t } from "@lingui/macro";
import NFTPosManABI from "../pages/AddLiquidity/abi2.json";

interface BatchAddLiquidityState {
  isLoading: boolean;
  hash: string | null;
  error: string | null;
}

export function useBatchLiquidityAddition() {
  const { address: account, chain } = useAccount();
  const chainId = chain?.id;
  const supports7702 = useEIP7702Support();
  const { sendCallsAsync } = useSendCalls();
  const addTransaction = useTransactionAdder();

  const [batchState, setBatchState] = useState<BatchAddLiquidityState>({
    isLoading: false,
    hash: null,
    error: null,
  });

  const executeBatchAddLiquidity = useCallback(async (
    baseCurrency: Currency | undefined,
    quoteCurrency: Currency | undefined,
    mintInfo: IDerivedMintInfo,
    allowedSlippage: Percent,
    deadline: string
  ): Promise<{ hash: `0x${string}` } | null> => {
    if (!chainId || !account || !baseCurrency || !quoteCurrency || !mintInfo.position) {
      setBatchState({
        isLoading: false,
        hash: null,
        error: "Missing required parameters"
      });
      return null;
    }

    setBatchState({
      isLoading: true,
      hash: null,
      error: null
    });

    try {
      const nftManagerAddress = NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] as Address;

      // Check if we can use EIP-7702 atomic batching
      if (supports7702 && sendCallsAsync) {
        console.log("Using EIP-7702 atomic batch execution");
        
        const calls: Execution[] = [];
        
        // Add approval calls if needed
        const amountA = mintInfo.parsedAmounts[Field.CURRENCY_A];
        if (baseCurrency.isToken && amountA && !amountA.equalTo(0)) {
          calls.push({
            to: baseCurrency.address as Address,
            value: 0n,
            data: encodeFunctionData({
              abi: erc20Abi,
              functionName: 'approve',
              args: [nftManagerAddress, BigInt(amountA.quotient.toString())],
            }),
          });
        }
        
        const amountB = mintInfo.parsedAmounts[Field.CURRENCY_B];
        if (quoteCurrency.isToken && amountB && !amountB.equalTo(0)) {
          calls.push({
            to: quoteCurrency.address as Address,
            value: 0n,
            data: encodeFunctionData({
              abi: erc20Abi,
              functionName: 'approve',
              args: [nftManagerAddress, BigInt(amountB.quotient.toString())],
            }),
          });
        }

        // Add liquidity addition call
        const useNative = baseCurrency.isNative ? baseCurrency : quoteCurrency.isNative ? quoteCurrency : undefined;
        const { calldata, value } = NonFunPosMan.addCallParameters(mintInfo.position, {
          slippageTolerance: allowedSlippage,
          recipient: account,
          deadline: deadline,
          useNative,
          createPool: mintInfo.noLiquidity,
        });

        calls.push({
          to: nftManagerAddress,
          value: BigInt(value),
          data: calldata as `0x${string}`,
        });

        // Execute all calls atomically
        const result = await sendCallsAsync({ 
          calls,
        });
        
        // sendCallsAsync returns an object with id property (the transaction hash)
        const hash = result.id as `0x${string}`;
        
        addTransaction({ hash } as any, {
          summary: mintInfo.noLiquidity
            ? (baseCurrency?.symbol && quoteCurrency?.symbol && t`Create pool and add ${baseCurrency.symbol}/${quoteCurrency.symbol} liquidity (batched)`) || t`Create pool and add liquidity (batched)`
            : (baseCurrency?.symbol && quoteCurrency?.symbol && t`Add ${baseCurrency.symbol}/${quoteCurrency.symbol} liquidity (batched)`) || t`Add liquidity (batched)`,
        });

        setBatchState({
          isLoading: false,
          hash,
          error: null
        });

        console.log(`✅ EIP-7702 batch execution completed: ${calls.length} operations in 1 transaction`);

        return { hash };

      } else {
        // Fallback: Execute transactions sequentially
        console.log("EIP-7702 not supported, using sequential execution");
        
        const approvals: {
          token: Currency;
          amount: CurrencyAmount<Currency>;
        }[] = [];
        const amountA = mintInfo.parsedAmounts[Field.CURRENCY_A];
        const amountB = mintInfo.parsedAmounts[Field.CURRENCY_B];

        if (baseCurrency.isToken && amountA && !amountA.equalTo(0)) {
          approvals.push({ token: baseCurrency, amount: amountA });
        }
        if (quoteCurrency.isToken && amountB && !amountB.equalTo(0)) {
          approvals.push({ token: quoteCurrency, amount: amountB });
        }

        // Execute all approvals if needed
        for (const approval of approvals) {
          if (!approval.token.isToken) continue;
          
          const tokenSymbol = approval.token.symbol || 'Token';
          console.log(`Executing ${tokenSymbol} token approval...`);
          
          const approvalHash = await writeContract(wagmiConfig, {
            address: approval.token.address as Address,
            abi: erc20Abi,
            functionName: "approve",
            args: [nftManagerAddress, BigInt(approval.amount.quotient.toString())],
          } as any);

          await waitForTransactionReceipt(wagmiConfig, {
            hash: approvalHash,
            confirmations: 1,
          });

          addTransaction({ hash: approvalHash } as any, {
            summary: t`Approved ${tokenSymbol} for liquidity addition`,
          });
        }

        // Then execute liquidity addition
        const useNative = baseCurrency.isNative ? baseCurrency : quoteCurrency.isNative ? quoteCurrency : undefined;
        
        const { calldata, value } = NonFunPosMan.addCallParameters(mintInfo.position, {
          slippageTolerance: allowedSlippage,
          recipient: account,
          deadline: deadline,
          useNative,
          createPool: mintInfo.noLiquidity,
        });

        const liquidityHash = await writeContract(wagmiConfig, {
          address: nftManagerAddress,
          abi: NFTPosManABI,
          functionName: 'multicall',
          args: [[calldata]],
          value: BigInt(value),
        } as any);

        const result = { hash: liquidityHash as `0x${string}` };

        addTransaction({ hash: liquidityHash } as any, {
          summary: mintInfo.noLiquidity
            ? (baseCurrency?.symbol && quoteCurrency?.symbol && t`Create pool and add ${baseCurrency.symbol}/${quoteCurrency.symbol} liquidity`) || t`Create pool and add liquidity`
            : (baseCurrency?.symbol && quoteCurrency?.symbol && t`Add ${baseCurrency.symbol}/${quoteCurrency.symbol} liquidity`) || t`Add liquidity`,
        });

        setBatchState({
          isLoading: false,
          hash: result.hash,
          error: null
        });

        console.log(`✅ Sequential execution completed: ${approvals.length} approvals + 1 liquidity addition`);

        return result;
      }

    } catch (error: any) {
      console.error("Batch add liquidity error:", error);
      
      let userFriendlyMessage = "Failed to add liquidity";
      
      if (error.code === 4001) {
        userFriendlyMessage = "Transaction rejected by user";
      } else if (error.message?.includes("insufficient funds")) {
        userFriendlyMessage = "Insufficient funds";
      } else if (error.message?.includes("sendCalls")) {
        userFriendlyMessage = "Batch transactions not supported by wallet";
      }

      setBatchState({
        isLoading: false,
        hash: null,
        error: userFriendlyMessage
      });
      
      if (error.code !== 4001) {
        throw error;
      }
      return null;
    }
  }, [
    chainId, 
    account, 
    addTransaction,
    supports7702,
    sendCallsAsync
  ]);

  const resetBatchState = useCallback(() => {
    setBatchState({
      isLoading: false,
      hash: null,
      error: null
    });
  }, []);

  const shouldUseBatchExecution = useCallback(async (
    baseCurrency: Currency | undefined,
    quoteCurrency: Currency | undefined,
    mintInfo: IDerivedMintInfo
  ): Promise<boolean> => {
    if (!baseCurrency || !quoteCurrency || !mintInfo.parsedAmounts) return false;

    const hasTokenA = baseCurrency?.isToken && mintInfo.parsedAmounts[Field.CURRENCY_A] && !mintInfo.parsedAmounts[Field.CURRENCY_A].equalTo(0);
    const hasTokenB = quoteCurrency?.isToken && mintInfo.parsedAmounts[Field.CURRENCY_B] && !mintInfo.parsedAmounts[Field.CURRENCY_B].equalTo(0);

    return Boolean(hasTokenA || hasTokenB);
  }, []);

  return {
    executeBatchAddLiquidity,
    shouldUseBatchExecution,
    batchState,
    resetBatchState,
    supports7702,
  };
}