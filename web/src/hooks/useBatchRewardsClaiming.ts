import { useCallback, useState, useMemo } from "react";
import { Contract, Interface } from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import { walletClientToSigner } from "../utils/ethersAdapters";
import { useTransactionAdder } from "../state/transactions/hooks";
import { useAppSelector } from "../state/hooks";
import { GAS_PRICE_MULTIPLIER } from "./useGasPrice";
import { FARMING_CENTER } from "../constants/addresses";
import FARMING_CENTER_ABI from "abis/farming-center.json";
import { FarmingType } from "../models/enums";
import { Deposit } from "../models/interfaces";
import { useEIP7702Support } from "./useEIP7702Support";
import { calculateGasMargin } from "../utils/calculateGasMargin";
import { t } from "@lingui/macro";

const MAX_UINT_128 = (1n << 128n) - 1n;

interface BatchClaimState {
  isLoading: boolean;
  hash: string | null;
  error: string | null;
}

export function useBatchRewardsClaiming() {
  const { address: account, chain } = useAccount();
  const chainId = chain?.id;
  const { data: walletClient } = useWalletClient({ chainId });
  const signer = useMemo(() => walletClient ? walletClientToSigner(walletClient) : undefined, [walletClient]);
  const supports7702 = useEIP7702Support();
  
  const farmingCenterInterface = useMemo(() => new Interface(FARMING_CENTER_ABI), []);
  const addTransaction = useTransactionAdder();
  
  const gasPrice = useAppSelector((state) => {
    if (!state.application.gasPrice.fetched) return 36;
    return state.application.gasPrice.override ? 36 : state.application.gasPrice.fetched;
  });

  const [batchClaimState, setBatchClaimState] = useState<BatchClaimState>({
    isLoading: false,
    hash: null,
    error: null,
  });

  // Get all positions that have claimable rewards
  const getClaimablePositions = useCallback((positions: Deposit[]) => {
    return positions.filter(position => {
      const hasEternalRewards = position.eternalFarming && 
        (parseFloat(String(position.eternalEarned || '0')) > 0 || parseFloat(String(position.eternalBonusEarned || '0')) > 0);
      const hasLimitRewards = position.limitFarming && 
        (parseFloat(String(position.limitEarned || '0')) > 0 || parseFloat(String(position.limitBonusEarned || '0')) > 0);
      return hasEternalRewards || hasLimitRewards;
    });
  }, []);

  // Generate batch transaction calldata for claiming all rewards
  const generateBatchClaimCalldata = useCallback((positions: Deposit[]) => {
    if (!account) return [];
    
    const callDatas: string[] = [];
    const processedRewardTokens = new Set<string>();

    positions.forEach(position => {
      // Handle eternal farming rewards
      if (position.eternalFarming && 
          (parseFloat(String(position.eternalEarned || '0')) > 0 || parseFloat(String(position.eternalBonusEarned || '0')) > 0)) {
        
        // Collect rewards first
        const collectRewardsCallData = farmingCenterInterface.encodeFunctionData("collectRewards", [
          [
            position.eternalRewardToken.id,
            position.eternalBonusRewardToken.id,
            position.pool.id,
            +position.eternalStartTime,
            +position.eternalEndTime
          ],
          +position.id,
        ]);
        callDatas.push(collectRewardsCallData);

        // Claim main reward token if not already processed
        if (!processedRewardTokens.has(position.eternalRewardToken.id.toLowerCase())) {
          const claimMainRewardCallData = farmingCenterInterface.encodeFunctionData("claimReward", [
            position.eternalRewardToken.id,
            account,
            0n,
            MAX_UINT_128
          ]);
          callDatas.push(claimMainRewardCallData);
          processedRewardTokens.add(position.eternalRewardToken.id.toLowerCase());
        }

        // Claim bonus reward token if different and not already processed
        if (position.eternalRewardToken.id.toLowerCase() !== position.eternalBonusRewardToken.id.toLowerCase() &&
            !processedRewardTokens.has(position.eternalBonusRewardToken.id.toLowerCase())) {
          const claimBonusRewardCallData = farmingCenterInterface.encodeFunctionData("claimReward", [
            position.eternalBonusRewardToken.id,
            account,
            0n,
            MAX_UINT_128
          ]);
          callDatas.push(claimBonusRewardCallData);
          processedRewardTokens.add(position.eternalBonusRewardToken.id.toLowerCase());
        }
      }

      // Handle limit farming rewards
      if (position.limitFarming && 
          (parseFloat(String(position.limitEarned || '0')) > 0 || parseFloat(String(position.limitBonusEarned || '0')) > 0)) {
        
        // Exit farming and claim for limit farming
        const exitFarmingCallData = farmingCenterInterface.encodeFunctionData("exitFarming", [
          [
            position.limitRewardToken.id,
            position.limitBonusRewardToken.id,
            position.pool.id,
            +position.limitStartTime,
            +position.limitEndTime
          ],
          +position.id,
          true // isLimitFarming
        ]);
        callDatas.push(exitFarmingCallData);

        // Claim main reward token if not already processed
        if (!processedRewardTokens.has(position.limitRewardToken.id.toLowerCase())) {
          const claimMainRewardCallData = farmingCenterInterface.encodeFunctionData("claimReward", [
            position.limitRewardToken.id,
            account,
            MAX_UINT_128,
            0n
          ]);
          callDatas.push(claimMainRewardCallData);
          processedRewardTokens.add(position.limitRewardToken.id.toLowerCase());
        }

        // Claim bonus reward token if different and not already processed
        if (position.limitRewardToken.id.toLowerCase() !== position.limitBonusRewardToken.id.toLowerCase() &&
            !processedRewardTokens.has(position.limitBonusRewardToken.id.toLowerCase())) {
          const claimBonusRewardCallData = farmingCenterInterface.encodeFunctionData("claimReward", [
            position.limitBonusRewardToken.id,
            account,
            MAX_UINT_128,
            0n
          ]);
          callDatas.push(claimBonusRewardCallData);
          processedRewardTokens.add(position.limitBonusRewardToken.id.toLowerCase());
        }
      }
    });

    return callDatas;
  }, [account, farmingCenterInterface]);

  // Execute batch claim using multicall or EIP-7702 if supported
  const executeBatchClaim = useCallback(async (positions: Deposit[]) => {
    if (!account || !signer || !chainId) return;

    const claimablePositions = getClaimablePositions(positions);
    if (claimablePositions.length === 0) {
      setBatchClaimState({
        isLoading: false,
        hash: null,
        error: "No rewards to claim"
      });
      return;
    }

    setBatchClaimState({
      isLoading: true,
      hash: null,
      error: null
    });

    try {
      const callDatas = generateBatchClaimCalldata(claimablePositions);
      
      if (callDatas.length === 0) {
        throw new Error("No claim transactions to execute");
      }

      const farmingCenterContract = new Contract(FARMING_CENTER[chainId], farmingCenterInterface, signer);

      // Use accurate gas estimation for the multicall transaction
      const estimatedGas = await farmingCenterContract.multicall.estimateGas(callDatas);

      // Use multicall for batch execution
      const result = await farmingCenterContract.multicall(callDatas, {
        gasPrice: BigInt(gasPrice) * BigInt(GAS_PRICE_MULTIPLIER),
        gasLimit: calculateGasMargin(chainId, estimatedGas)
      });

      addTransaction(result, {
        summary: t`Claiming rewards from ${claimablePositions.length} position${claimablePositions.length !== 1 ? 's' : ''}`,
      });

      setBatchClaimState({
        isLoading: false,
        hash: result.hash,
        error: null
      });

      return result;
    } catch (error: any) {
      console.error("Batch claim error:", error);
      
      let userFriendlyMessage = "Failed to claim rewards";
      
      // Handle specific error types
      if (error.code === 4001) {
        userFriendlyMessage = "Transaction rejected by user";
      } else if (error.code === -32603) {
        userFriendlyMessage = "Insufficient funds for gas";
      } else if (error.message?.includes("insufficient funds")) {
        userFriendlyMessage = "Insufficient funds for gas";
      } else if (error.message?.includes("already claimed")) {
        userFriendlyMessage = "Rewards already claimed";
      } else if (error.message?.includes("no rewards")) {
        userFriendlyMessage = "No rewards available to claim";
      } else if (error.message?.includes("farming ended")) {
        userFriendlyMessage = "Farming period has ended";
      }

      setBatchClaimState({
        isLoading: false,
        hash: null,
        error: userFriendlyMessage
      });
      
      // Don't re-throw user rejections
      if (error.code !== 4001) {
        throw error;
      }
    }
  }, [account, signer, chainId, gasPrice, addTransaction, farmingCenterInterface, getClaimablePositions, generateBatchClaimCalldata]);

  // Calculate total claimable rewards
  const getTotalClaimableRewards = useCallback((positions: Deposit[]) => {
    const claimablePositions = getClaimablePositions(positions);
    
    return claimablePositions.reduce((total, position) => {
      const eternalEarned = parseFloat(String(position.eternalEarned || '0'));
      const eternalBonusEarned = parseFloat(String(position.eternalBonusEarned || '0'));
      const limitEarned = parseFloat(String(position.limitEarned || '0'));
      const limitBonusEarned = parseFloat(String(position.limitBonusEarned || '0'));
      
      return total + eternalEarned + eternalBonusEarned + limitEarned + limitBonusEarned;
    }, 0);
  }, [getClaimablePositions]);

  // Reset batch claim state
  const resetBatchClaimState = useCallback(() => {
    setBatchClaimState({
      isLoading: false,
      hash: null,
      error: null
    });
  }, []);

  return {
    executeBatchClaim,
    getClaimablePositions,
    getTotalClaimableRewards,
    batchClaimState,
    resetBatchClaimState,
    supports7702,
  };
}