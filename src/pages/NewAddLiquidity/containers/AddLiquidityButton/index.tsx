import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from "constants/addresses";
import { ZERO_PERCENT } from "constants/misc";
import { useV3NFTPositionManagerContract } from "hooks/useContract";
import useTransactionDeadline from "hooks/useTransactionDeadline";
import { useActiveWeb3React } from "hooks/web3";
import { useUserSlippageToleranceWithDefault } from "state/user/hooks";

import { NonfungiblePositionManager as NonFunPosMan } from "lib/src/nonfungiblePositionManager";

import { Percent, Currency } from "@uniswap/sdk-core";
import { calculateGasMargin } from "utils/calculateGasMargin";
import { useAppSelector } from "state/hooks";
import { GAS_PRICE_MULTIPLIER } from "hooks/useGasPrice";
import { t } from "@lingui/macro";
import { useAllTransactions, useTransactionAdder } from "state/transactions/hooks";
import { useMemo, useState } from "react";

import { TransactionResponse } from "@ethersproject/abstract-provider";
import { addTransaction } from "state/transactions/actions";
import { IDerivedMintInfo } from "state/mint/v3/hooks";

interface IAddLiquidityButton {
    baseCurrency: Currency | undefined;
    quoteCurrency: Currency | undefined;
    mintInfo: IDerivedMintInfo;
}

export function AddLiquidityButton({ baseCurrency, quoteCurrency, mintInfo }: IAddLiquidityButton) {
    const { chainId, library, account } = useActiveWeb3React();

    const [txHash, setTxHash] = useState<string>("");

    const positionManager = useV3NFTPositionManagerContract();

    const deadline = useTransactionDeadline();

    const DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE = new Percent(50, 10_000);

    const allowedSlippage = useUserSlippageToleranceWithDefault(mintInfo.outOfRange ? ZERO_PERCENT : DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE);

    const gasPrice = useAppSelector((state) => {
        if (!state.application.gasPrice.fetched) return 36;
        return state.application.gasPrice.override ? 36 : state.application.gasPrice.fetched;
    });

    const allTransactions = useAllTransactions();
    const addTransaction = useTransactionAdder();

    const sortedRecentTransactions = useMemo(() => {
        const txs = Object.values(allTransactions);
        return txs.filter((tx) => new Date().getTime() - tx.addedTime < 86_400_000).sort((a, b) => b.addedTime - a.addedTime);
    }, [allTransactions]);

    const confirmed = useMemo(() => sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash), [sortedRecentTransactions, allTransactions]);

    // // @ts-ignore
    // useEffect(async () => {
    //     if (confirmed.some((hash) => hash === txHash)) {
    //         history.push(`/pool`);
    //     }
    // }, [confirmed]);

    async function onAdd() {
        if (!chainId || !library || !account) return;

        if (!positionManager || !baseCurrency || !quoteCurrency) {
            return;
        }

        if (mintInfo.position && account && deadline) {
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

            library
                .getSigner()
                .estimateGas(txn)
                .then((estimate) => {
                    const newTxn = {
                        ...txn,
                        gasLimit: calculateGasMargin(chainId, estimate),
                        gasPrice: gasPrice * GAS_PRICE_MULTIPLIER,
                    };

                    return library
                        .getSigner()
                        .sendTransaction(newTxn)
                        .then((response: TransactionResponse) => {
                            addTransaction(response, {
                                summary: mintInfo.noLiquidity
                                    ? t`Create pool and add ${baseCurrency?.symbol}/${quoteCurrency?.symbol} liquidity`
                                    : t`Add ${baseCurrency?.symbol}/${quoteCurrency?.symbol} liquidity`,
                            });
                            setTxHash(response.hash);
                        });
                })
                .catch((error) => {
                    console.error("Failed to send transaction", error);
                    // we only care if the error is something _other_ than the user rejected the tx
                    if (error?.code !== 4001) {
                        console.error(error);
                    }
                });
        } else {
            return;
        }
    }

    return (
        <button className="add-buttons__liquidity" onClick={onAdd}>
            Add liquidity
        </button>
    );
}
