import { ZERO_PERCENT } from "constants/misc";
import useTransactionDeadline from "hooks/useTransactionDeadline";
import { useAccount } from "wagmi";
import { useUserSlippageToleranceWithDefault } from "state/user/hooks";
import { Percent, Currency } from "@uniswap/sdk-core";
import { useMemo, useState } from "react";
import { IDerivedMintInfo } from "state/mint/v3/hooks";
import { ApprovalState, useApproveCallback } from "hooks/useApproveCallback";
import { Field } from "state/mint/actions";
import { useIsNetworkFailedImmediate } from "hooks/useIsNetworkFailed";
import { useBatchLiquidityAddition } from "hooks/useBatchLiquidityAddition";
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from "constants/addresses";
import Loader from "components/Loader";
import { t, Trans } from "@lingui/macro";

interface IBatchAddLiquidityButton {
    baseCurrency: Currency | undefined;
    quoteCurrency: Currency | undefined;
    mintInfo: IDerivedMintInfo;
    handleAddLiquidity: () => void;
    title: string;
    setRejected?: (rejected: boolean) => void;
    useBatchExecution?: boolean;
}

const DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE = new Percent(50, 10_000);

export function BatchAddLiquidityButton({ 
    baseCurrency, 
    quoteCurrency, 
    mintInfo, 
    handleAddLiquidity, 
    title, 
    setRejected,
    useBatchExecution = false
}: IBatchAddLiquidityButton) {
    const { address: account, chain } = useAccount();
    const chainId = chain?.id;

    const deadline = useTransactionDeadline();
    const isNetworkFailed = useIsNetworkFailedImmediate();
    const allowedSlippage = useUserSlippageToleranceWithDefault(
        mintInfo.outOfRange ? ZERO_PERCENT : DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE
    );

    // Traditional approval hooks (for fallback)
    const [approvalA] = useApproveCallback(
        mintInfo.parsedAmounts[Field.CURRENCY_A], 
        chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined
    );
    const [approvalB] = useApproveCallback(
        mintInfo.parsedAmounts[Field.CURRENCY_B], 
        chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined
    );

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
    useMemo(async () => {
        if (useBatchExecution && baseCurrency && quoteCurrency && mintInfo.parsedAmounts) {
            const shouldBatch = await shouldUseBatchExecution(baseCurrency, quoteCurrency, mintInfo);
            setShouldUseBatch(shouldBatch);
        } else {
            setShouldUseBatch(false);
        }
    }, [useBatchExecution, baseCurrency, quoteCurrency, mintInfo, shouldUseBatchExecution]);

    // Ready state depends on whether we're using batch execution or not
    const isReady = useMemo(() => {
        if (shouldUseBatch === null) return false; // Still checking

        const baseConditions = Boolean(
            !mintInfo.errorMessage &&
            !mintInfo.invalidRange &&
            !batchState.isLoading &&
            !isNetworkFailed
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
        batchState.isLoading,
        isNetworkFailed,
        approvalA,
        approvalB
    ]);

    async function onAdd() {
        if (!chainId || !account || !baseCurrency || !quoteCurrency || !deadline) return;

        if (!mintInfo.position) {
            console.error("No position to add liquidity");
            return;
        }

        setRejected && setRejected(false);
        resetBatchState();

        try {
            if (shouldUseBatch) {
                // Use batch execution
                await executeBatchAddLiquidity(
                    baseCurrency,
                    quoteCurrency,
                    mintInfo,
                    allowedSlippage,
                    deadline.toString()
                );
                handleAddLiquidity();
            } else {
                // Fall back to original implementation
                // This would be the existing AddLiquidityButton logic
                console.log("Using traditional add liquidity flow");
                handleAddLiquidity();
            }
        } catch (error: any) {
            console.error("Add liquidity failed:", error);
            setRejected && setRejected(true);
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
        <button 
            className="btn primary ml-a" 
            disabled={!isReady} 
            onClick={onAdd}
        >
            {getButtonContent()}
        </button>
    );
}