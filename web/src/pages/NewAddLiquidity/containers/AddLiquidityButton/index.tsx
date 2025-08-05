import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from "constants/addresses";
import { ZERO_PERCENT } from "constants/misc";
import { useV3NFTPositionManagerContract } from "hooks/useContract";
import useTransactionDeadline from "hooks/useTransactionDeadline";
import { useAccount, useWalletClient } from "wagmi";
import { walletClientToSigner } from "../../../../utils/ethersAdapters";
import { useUserSlippageToleranceWithDefault } from "state/user/hooks";

import { NonfungiblePositionManager as NonFunPosMan } from "lib/src/nonfungiblePositionManager";

import { Percent, Currency } from "@uniswap/sdk-core";
import { calculateGasMargin } from "utils/calculateGasMargin";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { GAS_PRICE_MULTIPLIER } from "hooks/useGasPrice";
import { t, Trans } from "@lingui/macro";
import { useAllTransactions, useTransactionAdder } from "state/transactions/hooks";
import { useMemo, useState, useEffect } from "react";

import { TransactionResponse } from "ethers";
import { IDerivedMintInfo, useAddLiquidityTxHash } from "state/mint/v3/hooks";
import { ApprovalState, useApproveCallback } from "hooks/useApproveCallback";
import { Field } from "state/mint/actions";
import { useIsNetworkFailedImmediate } from "hooks/useIsNetworkFailed";
import { setAddLiquidityTxHash } from "state/mint/v3/actions";
import { useBatchLiquidityAddition } from "hooks/useBatchLiquidityAddition";
import Loader from "components/Loader";
import ReactGA from "react-ga";

interface IAddLiquidityButton {
    baseCurrency: Currency | undefined;
    quoteCurrency: Currency | undefined;
    mintInfo: IDerivedMintInfo;
    handleAddLiquidity: () => void;
    title: string;
    setRejected?: (rejected: boolean) => void;
    enableBatchExecution?: boolean;
}
const DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE = new Percent(50, 10_000);

export function AddLiquidityButton({ baseCurrency, quoteCurrency, mintInfo, handleAddLiquidity, title, setRejected, enableBatchExecution = true }: IAddLiquidityButton) {
    const { address: account, chain } = useAccount();
    const chainId = chain?.id;
    const { data: walletClient } = useWalletClient({ chainId });
    const signer = useMemo(() => walletClient ? walletClientToSigner(walletClient) : undefined, [walletClient]);

    const positionManager = useV3NFTPositionManagerContract();

    const deadline = useTransactionDeadline();

    const dispatch = useAppDispatch();

    const txHash = useAddLiquidityTxHash();

    const isNetworkFailed = useIsNetworkFailedImmediate();

    const allowedSlippage = useUserSlippageToleranceWithDefault(mintInfo.outOfRange ? ZERO_PERCENT : DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE);

    const gasPrice = useAppSelector((state) => {
        if (!state.application.gasPrice.fetched) return 36;
        return state.application.gasPrice.override ? 36 : state.application.gasPrice.fetched;
    });

    const addTransaction = useTransactionAdder();

    const [approvalA] = useApproveCallback(mintInfo.parsedAmounts[Field.CURRENCY_A], chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined);
    const [approvalB] = useApproveCallback(mintInfo.parsedAmounts[Field.CURRENCY_B], chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined);

    // Batch liquidity addition hook
    const {
        executeBatchAddLiquidity,
        shouldUseBatchExecution,
        batchState,
        resetBatchState,
        supports7702,
    } = useBatchLiquidityAddition();

    const [shouldUseBatch, setShouldUseBatch] = useState<boolean | null>(null);

    // Check if we should use batch execution
    useEffect(() => {
        const checkBatchExecution = async () => {
            if (enableBatchExecution && baseCurrency && quoteCurrency && mintInfo.parsedAmounts) {
                try {
                    const shouldBatch = await shouldUseBatchExecution(baseCurrency, quoteCurrency, mintInfo);
                    setShouldUseBatch(shouldBatch);
                } catch (error) {
                    console.error("Error checking batch execution:", error);
                    setShouldUseBatch(false);
                }
            } else {
                setShouldUseBatch(false);
            }
        };

        checkBatchExecution();
    }, [enableBatchExecution, baseCurrency, quoteCurrency, mintInfo, shouldUseBatchExecution]);

    const isReady = useMemo(() => {
        if (shouldUseBatch === null) return false; // Still checking batch execution

        const baseConditions = Boolean(
            !mintInfo.errorMessage &&
            !mintInfo.invalidRange &&
            !txHash &&
            !isNetworkFailed &&
            !batchState.isLoading
        );

        if (shouldUseBatch) {
            // For batch execution, we don't need pre-approvals
            return baseConditions;
        } else {
            // For traditional flow, we need approvals
            return Boolean(
                baseConditions &&
                (mintInfo.depositADisabled ? true : approvalA === ApprovalState.APPROVED) &&
                (mintInfo.depositBDisabled ? true : approvalB === ApprovalState.APPROVED)
            );
        }
    }, [
        shouldUseBatch,
        mintInfo.errorMessage,
        mintInfo.invalidRange,
        mintInfo.depositADisabled,
        mintInfo.depositBDisabled,
        txHash,
        isNetworkFailed,
        batchState.isLoading,
        approvalA,
        approvalB
    ]);

    async function onAdd() {
        if (!chainId || !account || !baseCurrency || !quoteCurrency || !deadline) return;

        if (!positionManager) {
            return;
        }

        if (!mintInfo.position) {
            console.error("No position to add liquidity");
            return;
        }

        setRejected && setRejected(false);
        resetBatchState();

        try {
            if (shouldUseBatch) {
                // Use batch execution
                const result = await executeBatchAddLiquidity(
                    baseCurrency,
                    quoteCurrency,
                    mintInfo,
                    allowedSlippage,
                    deadline.toString()
                );

                if (result) {
                    handleAddLiquidity();
                    dispatch(setAddLiquidityTxHash({ txHash: result.hash }));
                    ReactGA.event({ category: 'Liquidity', action: 'Add', label: 'Batch' });
                }
            } else {
                // Use traditional flow
                if (!signer) {
                    throw new Error("No signer available");
                }

                const useNative = baseCurrency.isNative ? baseCurrency : quoteCurrency.isNative ? quoteCurrency : undefined;

                const { calldata, value } = NonFunPosMan.addCallParameters(mintInfo.position, {
                    slippageTolerance: allowedSlippage,
                    recipient: account,
                    deadline: deadline.toString(),
                    useNative,
                    createPool: mintInfo.noLiquidity,
                });

                const txn: { to: string; data: string; value: string } = {
                    to: NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
                    data: calldata,
                    value,
                };

                const estimate = await signer.estimateGas(txn);
                const newTxn = {
                    ...txn,
                    gasLimit: calculateGasMargin(chainId, estimate),
                    gasPrice: BigInt(gasPrice) * BigInt(GAS_PRICE_MULTIPLIER),
                };

                const response: TransactionResponse = await signer.sendTransaction(newTxn);

                addTransaction(response, {
                    summary: mintInfo.noLiquidity
                        ? baseCurrency?.symbol && quoteCurrency?.symbol && t`Create pool and add ${baseCurrency.symbol}/${quoteCurrency.symbol} liquidity` || ''
                        : baseCurrency?.symbol && quoteCurrency?.symbol && t`Add ${baseCurrency.symbol}/${quoteCurrency.symbol} liquidity` || '',
                });

                handleAddLiquidity();
                dispatch(setAddLiquidityTxHash({ txHash: response.hash }));
                ReactGA.event({ category: 'Liquidity', action: 'Add', label: 'Traditional' });
            }
        } catch (error: any) {
            console.error("Add liquidity failed:", error);
            setRejected && setRejected(true);
            if (error?.code !== 4001) {
                console.error(error);
            }
        }
    }

    // Show batch execution status
    const getButtonContent = () => {
        if (batchState.isLoading) {
            return (
                <div className="f f-jc f-ac cg-05">
                    <Loader size="18px" stroke="var(--white)" />
                    <Trans>Adding Liquidity...</Trans>
                </div>
            );
        }

        if (shouldUseBatch) {
            return (
                <div className="f f-jc f-ac cg-05">
                    <span>{title}</span>
                    {supports7702 && (
                        <span 
                            className="batch-ready-indicator" 
                            title="EIP-7702 batch transactions supported"
                            style={{
                                background: "linear-gradient(135deg, #4CAF50, #2196F3)",
                                color: "white",
                                padding: "0.15rem 0.4rem",
                                borderRadius: "8px",
                                fontSize: "0.7rem",
                                fontWeight: "600",
                                letterSpacing: "0.5px",
                                textTransform: "uppercase",
                                marginLeft: "0.5rem"
                            }}
                        >
                            ⚡ Batch
                        </span>
                    )}
                </div>
            );
        }

        return title;
    };

    return (
        <div className="f f-fd-c">
            <button className="btn primary ml-a" disabled={!isReady} onClick={onAdd}>
                {getButtonContent()}
            </button>
            {batchState.error && (
                <div className="error-message" style={{ 
                    color: '#ff6b6b', 
                    fontSize: '0.875rem', 
                    marginTop: '0.5rem', 
                    padding: '0.5rem', 
                    background: 'rgba(255, 107, 107, 0.1)', 
                    borderRadius: '6px', 
                    border: '1px solid rgba(255, 107, 107, 0.2)' 
                }}>
                    {batchState.error}
                </div>
            )}
        </div>
    );
}
