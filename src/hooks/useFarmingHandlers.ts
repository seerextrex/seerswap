import NON_FUN_POS_MAN from "abis/non-fun-pos-man.json";
import FARMING_CENTER_ABI from "abis/farming-center.json";
import { Contract, Interface, TransactionResponse } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { FARMING_CENTER, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from "../constants/addresses";
import { useTransactionAdder } from "../state/transactions/hooks";
import { useAccount, useWalletClient } from "wagmi";
import { walletClientToSigner } from "../utils/ethersAdapters";
import { toHex } from "../lib/src";
import { useAppSelector } from "../state/hooks";
import { GAS_PRICE_MULTIPLIER } from "./useGasPrice";
import { DefaultFarming, DefaultFarmingWithError, GetRewardsHashInterface, GetRewardsHashInterfaceWithError } from "../models/interfaces";
import { FarmingType } from "../models/enums";

import { t } from "@lingui/macro";

const MAX_UINT_128 = (1n << 128n) - 1n;

export function useFarmingHandlers() {
    const { address: account, chain } = useAccount();
    const chainId = chain?.id;
    const { data: walletClient } = useWalletClient({ chainId });
    const signer = useMemo(() => walletClient ? walletClientToSigner(walletClient) : undefined, [walletClient]);

    const farmingCenterInterface = useMemo(() => new Interface(FARMING_CENTER_ABI), []);
    const nftInterface = useMemo(() => new Interface(NON_FUN_POS_MAN), []);

    const gasPrice = useAppSelector((state) => {
        if (!state.application.gasPrice.fetched) return 36;
        return state.application.gasPrice.override ? 36 : state.application.gasPrice.fetched;
    });

    const addTransaction = useTransactionAdder();

    const [approvedHash, setApproved] = useState<DefaultFarming | DefaultFarmingWithError | string>({ hash: null, id: null });
    const [transferedHash, setTransfered] = useState<DefaultFarming | DefaultFarmingWithError | string>({ hash: null, id: null });
    const [farmedHash, setFarmed] = useState<DefaultFarming | DefaultFarmingWithError | string>({ hash: null, id: null });
    const [getRewardsHash, setGetRewards] = useState<GetRewardsHashInterface | GetRewardsHashInterfaceWithError | string>({ hash: null, id: null, farmingType: null });
    const [eternalCollectRewardHash, setEternalCollectReward] = useState<DefaultFarming | DefaultFarmingWithError | string>({ hash: null, id: null });
    const [withdrawnHash, setWithdrawn] = useState<DefaultFarming | DefaultFarmingWithError | string>({ hash: null, id: null });
    const [claimRewardHash, setClaimReward] = useState<GetRewardsHashInterfaceWithError | string>({ hash: null, id: null, farmingType: null, error: null });
    const [sendNFTL2Hash, setSendNFTL2] = useState<DefaultFarming | DefaultFarmingWithError | string>({ hash: null, id: null });
    const [claimHash, setClaimHash] = useState<DefaultFarmingWithError | string>({ hash: null, id: null, error: null });

    //exit from basic farming and claim than
    const claimRewardsHandler = useCallback(
        async (
            token: string,
            {
                limitRewardToken,
                limitBonusRewardToken,
                pool,
                limitStartTime,
                limitEndTime,
                eternalRewardToken,
                eternalBonusRewardToken,
                eternalStartTime,
                eternalEndTime,
                eternalBonusEarned,
                eternalEarned,
                limitBonusEarned,
                limitEarned,
            }: any,
            farmingType: FarmingType
        ) => {
            if (!account || !signer || !chainId) return;

            setClaimReward({ hash: null, id: token, farmingType, error: null });

            const farmingCenterContract = new Contract(FARMING_CENTER[chainId], farmingCenterInterface, signer);

            try {
                let callDatas: string[] = [];
                let result: TransactionResponse;

                if (farmingType === FarmingType.ETERNAL) {
                    callDatas = [
                        farmingCenterInterface.encodeFunctionData("exitFarming", [[eternalRewardToken.id, eternalBonusRewardToken.id, pool.id, +eternalStartTime, +eternalEndTime], +token, false]),
                    ];

                    if (Boolean(+eternalEarned)) {
                        callDatas.push(farmingCenterInterface.encodeFunctionData("claimReward", [eternalRewardToken.id, account, 0n, MAX_UINT_128]));
                    }

                    if (Boolean(+eternalBonusEarned)) {
                        callDatas.push(farmingCenterInterface.encodeFunctionData("claimReward", [eternalBonusRewardToken.id, account, 0n, MAX_UINT_128]));
                    }

                    result = await farmingCenterContract.multicall(callDatas, { gasPrice: BigInt(gasPrice) * BigInt(GAS_PRICE_MULTIPLIER), gasLimit: 350000n });
                } else {
                    callDatas = [farmingCenterInterface.encodeFunctionData("exitFarming", [[limitRewardToken.id, limitBonusRewardToken.id, pool.id, +limitStartTime, +limitEndTime], +token, true])];

                    if (Boolean(+limitEarned)) {
                        callDatas.push(farmingCenterInterface.encodeFunctionData("claimReward", [limitRewardToken.id, account, MAX_UINT_128, 0n]));
                    }

                    if (Boolean(+limitBonusEarned)) {
                        callDatas.push(farmingCenterInterface.encodeFunctionData("claimReward", [limitBonusRewardToken.id, account, MAX_UINT_128, 0n]));
                    }

                    result = await farmingCenterContract.multicall(callDatas, { gasPrice: BigInt(gasPrice) * BigInt(GAS_PRICE_MULTIPLIER), gasLimit: 350000n });
                }

                addTransaction(result, {
                    summary: t`Claiming reward`,
                });

                setClaimReward({ hash: result.hash, id: token, farmingType: farmingType === FarmingType.ETERNAL ? FarmingType.ETERNAL : FarmingType.LIMIT, error: null });
            } catch (err: any) {
                setClaimReward({ hash: null, id: token, farmingType, error: err.message || "failed" });
                if (err.code !== 4001) {
                    console.error("Claiming rewards error:", err);
                }
            }
        },
        [account, chainId, signer, gasPrice, addTransaction, farmingCenterInterface]
    );

    //collect rewards and claim than
    const eternalCollectRewardHandler = useCallback(
        async (token: string, { pool, eternalRewardToken, eternalBonusRewardToken, eternalStartTime, eternalEndTime }: any) => {
            if (!account || !signer || !chainId) return;

            setEternalCollectReward({ hash: null, id: token });
            const farmingCenterContract = new Contract(FARMING_CENTER[chainId], farmingCenterInterface, signer);

            try {
                const collectRewardsCallData = farmingCenterInterface.encodeFunctionData("collectRewards", [
                    [eternalRewardToken.id, eternalBonusRewardToken.id, pool.id, +eternalStartTime, +eternalEndTime],
                    +token,
                ]);
                const claimReward1CallData = farmingCenterInterface.encodeFunctionData("claimReward", [eternalRewardToken.id, account, 0n, MAX_UINT_128]);
                const claimReward2CallData = farmingCenterInterface.encodeFunctionData("claimReward", [eternalBonusRewardToken.id, account, 0n, MAX_UINT_128]);

                const callDatas = [collectRewardsCallData];
                if (eternalRewardToken.id.toLowerCase() !== eternalBonusRewardToken.id.toLowerCase()) {
                    callDatas.push(claimReward1CallData, claimReward2CallData);
                } else {
                    callDatas.push(claimReward1CallData);
                }
                const result: TransactionResponse = await farmingCenterContract.multicall(callDatas, { gasPrice: BigInt(gasPrice) * BigInt(GAS_PRICE_MULTIPLIER) });

                addTransaction(result, {
                    summary: t`Claiming reward`,
                });

                setEternalCollectReward({ hash: result.hash, id: token });
            } catch (err: any) {
                setEternalCollectReward({ hash: null, id: token, error: err.message || "failed" });
                console.error("Eternal collect reward error:", err);
            }
        },
        [account, chainId, signer, gasPrice, addTransaction, farmingCenterInterface]
    );

    const claimReward = useCallback(
        async (tokenRewardAddress: string) => {
            if (!account || !signer || !chainId) return;
            setClaimHash({ hash: null, id: tokenRewardAddress, error: null });
            const farmingCenterContract = new Contract(FARMING_CENTER[chainId], farmingCenterInterface, signer);

            try {
                const result: TransactionResponse = await farmingCenterContract.claimReward(tokenRewardAddress, account, MAX_UINT_128, MAX_UINT_128, { gasPrice: BigInt(gasPrice) * BigInt(GAS_PRICE_MULTIPLIER) });

                setClaimHash({ hash: result.hash, id: tokenRewardAddress, error: null });
                addTransaction(result, {
                    summary: t`Claiming reward`,
                });
            } catch (e: any) {
                setClaimHash({ hash: null, id: tokenRewardAddress, error: e.message || "failed" });
                console.error("Claim reward error:", e);
            }
        },
        [account, chainId, signer, gasPrice, addTransaction]
    );

    //exit from basic farming before the start
    const exitHandler = useCallback(
        async (token: string, { limitRewardToken, limitBonusRewardToken, pool, limitStartTime, limitEndTime }: any, eventType: FarmingType) => {
            if (!account || !signer || !chainId) return;

            setGetRewards({ hash: null, id: token, farmingType: eventType });
            const farmingCenterContract = new Contract(FARMING_CENTER[chainId], farmingCenterInterface, signer);

            try {
                const isLimitFarming = eventType === FarmingType.LIMIT;
                const result: TransactionResponse = await farmingCenterContract.exitFarming([limitRewardToken.id, limitBonusRewardToken.id, pool.id, +limitStartTime, +limitEndTime], +token, isLimitFarming, {
                    gasPrice: BigInt(gasPrice) * BigInt(GAS_PRICE_MULTIPLIER),
                });

                addTransaction(result, {
                    summary: t`Rewards were claimed!`,
                });

                setGetRewards({ hash: result.hash, id: token, farmingType: eventType });
            } catch (err: any) {
                setGetRewards({ hash: null, id: token, farmingType: eventType, error: err.message || "failed" });
                console.error("Exit farming error:", err);
            }
        },
        [account, chainId, signer, gasPrice, addTransaction]
    );

    const withdrawHandler = useCallback(
        async (token: string) => {
            if (!account || !signer || !chainId) return;
            setWithdrawn({ hash: null, id: token });
            const farmingCenterContract = new Contract(FARMING_CENTER[chainId], farmingCenterInterface, signer);

            try {
                const result = await farmingCenterContract.withdrawToken(token, account, "0x", {
                    gasPrice: BigInt(gasPrice) * BigInt(GAS_PRICE_MULTIPLIER),
                });

                addTransaction(result, {
                    summary: t`NFT #${token} was withdrawn!`,
                });

                setWithdrawn({ hash: result.hash, id: token });
            } catch (err: any) {
                setWithdrawn({ hash: null, id: token, error: err.message || "failed" });
                console.error("Withdraw token error:", err);
            }
        },
        [account, chainId, signer, gasPrice, addTransaction]
    );

    const farmHandler = useCallback(
        async (selectedNFT: { id: string }, { rewardToken, bonusRewardToken, pool, startTime, endTime }: any, eventType: FarmingType, selectedTier: string | number | null) => {
            if (!account || !selectedNFT || !signer || !chainId) return;

            setFarmed({ hash: null, id: selectedNFT.id });
            const nftContract = new Contract(NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId], nftInterface, signer);
            const farmingContract = new Contract(FARMING_CENTER[chainId], farmingCenterInterface, signer);

            try {
                const approvedSpender = await nftContract.getApproved(selectedNFT.id);
                const needsApproval = approvedSpender !== FARMING_CENTER[chainId];

                const callDatas: string[] = [];
                const tierAmount = selectedTier ? BigInt(selectedTier.toString()) : 0n;
                const isLimitFarming = eventType === FarmingType.LIMIT;

                let enterFarmingCalldata: string;

                if (isLimitFarming) {
                    enterFarmingCalldata = farmingCenterInterface.encodeFunctionData("enterFarming", [
                        [rewardToken, bonusRewardToken, pool, +startTime, +endTime],
                        selectedNFT.id,
                        tierAmount,
                        true, // isLimitFarming - this is the 4-argument version
                    ]);
                } else { // Eternal farming
                    enterFarmingCalldata = farmingCenterInterface.encodeFunctionData("enterFarming", [
                        [rewardToken, bonusRewardToken, pool, +startTime, +endTime],
                        selectedNFT.id,
                        tierAmount,
                        // No boolean for isLimitFarming - this is the 3-argument version
                    ]);
                }

                if (needsApproval) {
                    callDatas.push(nftInterface.encodeFunctionData("approve", [FARMING_CENTER[chainId], selectedNFT.id]));
                }
                callDatas.push(enterFarmingCalldata);

                let result: TransactionResponse;
                if (callDatas.length > 1) {
                    result = await farmingContract.multicall(callDatas, { gasPrice: BigInt(gasPrice) * BigInt(GAS_PRICE_MULTIPLIER), gasLimit: 400000n });
                } else {
                    if (isLimitFarming) {
                        result = await farmingContract.enterFarming(
                            [rewardToken, bonusRewardToken, pool, +startTime, +endTime],
                            selectedNFT.id,
                            tierAmount,
                            true,
                            { gasPrice: BigInt(gasPrice) * BigInt(GAS_PRICE_MULTIPLIER), gasLimit: 250000n }
                        );
                    } else {
                        result = await farmingContract.enterFarming(
                            [rewardToken, bonusRewardToken, pool, +startTime, +endTime],
                            selectedNFT.id,
                            tierAmount,
                            { gasPrice: BigInt(gasPrice) * BigInt(GAS_PRICE_MULTIPLIER), gasLimit: 250000n }
                        );
                    }
                }

                addTransaction(result, {
                    summary: t`Farming NFT #${selectedNFT.id}`,
                });

                setFarmed({ hash: result.hash, id: selectedNFT.id });
            } catch (err: any) {
                setFarmed({ hash: null, id: selectedNFT.id, error: err.message || "failed" });
                console.error("Farm handler error:", err);
            }
        },
        [account, chainId, gasPrice, signer, addTransaction, farmingCenterInterface, nftInterface]
    );

    const approveHandler = useCallback(
        async (selectedNFT: { id: string }) => {
            if (!account || !selectedNFT || !chainId || !signer) return;
            setApproved({ hash: null, id: selectedNFT.id });
            const nftContract = new Contract(NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId], nftInterface, signer);

            try {
                const result = await nftContract.approve(FARMING_CENTER[chainId], selectedNFT.id, { gasPrice: BigInt(gasPrice) * BigInt(GAS_PRICE_MULTIPLIER) });

                addTransaction(result, {
                    summary: t`Approved NFT #${selectedNFT.id} for farming`,
                });
                setApproved({ hash: result.hash, id: selectedNFT.id });
            } catch (err: any) {
                setApproved({ hash: null, id: selectedNFT.id, error: err.message || "failed" });
                console.error("Approve handler error:", err);
            }
        },
        [account, chainId, gasPrice, signer, addTransaction, nftInterface]
    );

    const sendNFTToL2Handler = useCallback(
        async (tokenId: string) => {
            if (!account || !tokenId || !chainId || !signer) return;
            setSendNFTL2({ hash: null, id: tokenId });
            // This assumes the farming center contract IS the NFT contract or part of a bridge.
            // If the NFT is managed by NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, this should be:
            // const nftContract = new Contract(NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId], nftInterface, signer);
            // result = await nftContract.safeTransferFrom(account, <L2_BRIDGE_ADDRESS>, tokenId, ...);
            const contractToUse = new Contract(FARMING_CENTER[chainId], farmingCenterInterface, signer);

            try {
                const result = await contractToUse.safeTransferFrom(account, FARMING_CENTER[chainId], tokenId, { // Assuming FARMING_CENTER[chainId] is the L2 bridge/recipient on L1
                    gasPrice: BigInt(gasPrice) * BigInt(GAS_PRICE_MULTIPLIER),
                });

                addTransaction(result, {
                    summary: t`Sent NFT #${tokenId} to L2`,
                });
                setSendNFTL2({ hash: result.hash, id: tokenId });
            } catch (err: any) {
                setSendNFTL2({ hash: null, id: tokenId, error: err.message || "failed" });
                console.error("Send NFT to L2 error:", err);
            }
        },
        [account, chainId, gasPrice, signer, addTransaction, farmingCenterInterface]
    );

    const transferNFTFromFarmingCenterHandler = useCallback(async (to: string, tokenId: string) => {
        if (!account || !signer || !chainId) return;

        setSendNFTL2({ hash: null, id: tokenId });
        const farmingCenterContract = new Contract(FARMING_CENTER[chainId], farmingCenterInterface, signer);

        try {
            const result = await farmingCenterContract.safeTransferFrom(account, to, tokenId, {
                gasPrice: BigInt(gasPrice) * BigInt(GAS_PRICE_MULTIPLIER),
            });

            addTransaction(result, {
                summary: t`NFT #${tokenId} was sent to ${to}`,
            });

            setSendNFTL2({ hash: result.hash, id: tokenId });

        } catch (err: any) {
            setSendNFTL2({ hash: null, id: tokenId, error: err.message || "failed" });
            console.error("Send NFT error:", err);
        }
    }, [account, chainId, signer, gasPrice, addTransaction, farmingCenterInterface]);

    return {
        claimRewardsHandler,
        eternalCollectRewardHandler,
        claimReward,
        exitHandler,
        withdrawHandler,
        farmHandler,
        approveHandler,
        sendNFTToL2Handler,
        transferNFTFromFarmingCenterHandler,
        approvedHash,
        transferedHash,
        farmedHash,
        getRewardsHash,
        eternalCollectRewardHash,
        withdrawnHash,
        claimRewardHash,
        sendNFTL2Hash,
        claimHash,
    };
}
