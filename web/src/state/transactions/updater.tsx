import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { useAccount, usePublicClient } from "wagmi";
import { retry, RetryableError, RetryOptions } from "../../utils/retry";
import { updateBlockNumber } from "../application/actions";
import { useAddPopup, useBlockNumber } from "../application/hooks";
import { checkedTransaction, finalizeTransaction } from "./actions";
import { publicClientToProvider } from "../../utils/ethersAdapters";
import { ZeroAddress } from "ethers";

interface TxInterface {
    addedTime: number;
    receipt?: Record<string, any>;
    lastCheckedBlockNumber?: number;
}

export function shouldCheck(lastBlockNumber: number, tx: TxInterface): boolean {
    if (tx.receipt) return false;
    if (!tx.lastCheckedBlockNumber) return true;
    const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber;
    if (blocksSinceCheck < 1) return false;
    const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60;
    if (minutesPending > 60) {
        // every 10 blocks if pending for longer than an hour
        return blocksSinceCheck > 9;
    } else if (minutesPending > 5) {
        // every 3 blocks if pending more than 5 minutes
        return blocksSinceCheck > 2;
    } else {
        // otherwise every block
        return true;
    }
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = { n: 1, minWait: 0, maxWait: 0 };

export default function Updater(): null {
    const { chain } = useAccount();
    const chainId = chain?.id;
    const publicClient = usePublicClient({ chainId });
    const provider = publicClient ? publicClientToProvider(publicClient) : undefined;

    const lastBlockNumber = useBlockNumber();

    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state.transactions);

    const transactions = useMemo(() => (chainId ? state[chainId] ?? {} : {}), [chainId, state]);

    // show popup on confirm
    const addPopup = useAddPopup();

    const getReceipt = useCallback(
        (hash: string) => {
            if (!provider || !chainId) throw new Error("No provider or chainId");
            return retry(
                () =>
                    provider.getTransactionReceipt(hash).then((receipt) => {
                        if (receipt === null) {
                            console.debug("Retrying for hash", hash);
                            throw new RetryableError();
                        }
                        return receipt;
                    }),
                DEFAULT_RETRY_OPTIONS
            );
        },
        [chainId, provider]
    );

    useEffect(() => {
        if (!chainId || !provider || !lastBlockNumber) return;

        const cancels = Object.keys(transactions)
            .filter((hash) => shouldCheck(lastBlockNumber, transactions[hash]))
            .map((hash) => {
                const { promise, cancel } = getReceipt(hash);
                promise
                    .then((receipt) => {
                        if (receipt) {
                            dispatch(
                                finalizeTransaction({
                                    chainId,
                                    hash,
                                    receipt: {
                                        blockHash: receipt.blockHash ?? ZeroAddress,
                                        blockNumber: receipt.blockNumber ?? 0,
                                        contractAddress: receipt.contractAddress ?? ZeroAddress,
                                        from: receipt.from ?? ZeroAddress,
                                        status: receipt.status === null ? 0 : receipt.status,
                                        to: receipt.to ?? ZeroAddress,
                                        transactionHash: receipt.hash,
                                        transactionIndex: receipt.index,
                                    },
                                })
                            );

                            addPopup(
                                {
                                    txn: {
                                        hash,
                                        success: receipt.status === 1,
                                        summary: transactions[hash]?.summary,
                                    },
                                },
                                hash
                            );

                            // the receipt was fetched before the block, fast forward to that block to trigger balance updates
                            if (receipt.blockNumber > lastBlockNumber) {
                                dispatch(
                                    updateBlockNumber({
                                        chainId,
                                        blockNumber: receipt.blockNumber,
                                    })
                                );
                            }
                        } else {
                            dispatch(
                                checkedTransaction({
                                    chainId,
                                    hash,
                                    blockNumber: lastBlockNumber,
                                })
                            );
                        }
                    })
                    .catch((error) => {
                        if (!error.isCancelledError) {
                            // console.error(`Failed to check transaction hash: ${hash}`, error)
                        }
                    });
                return cancel;
            });

        return () => {
            cancels.forEach((cancel) => cancel());
        };
    }, [chainId, provider, transactions, lastBlockNumber, dispatch, addPopup, getReceipt]);

    return null;
}
