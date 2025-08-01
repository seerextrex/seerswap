import { BigNumber } from "@ethersproject/bignumber";
import { t } from "@lingui/macro";
import { Trade as V3Trade } from "lib/src";
import { Currency, Percent, TradeType } from "@uniswap/sdk-core";
import { useMemo } from "react";
import { SWAP_ROUTER_ADDRESSES } from "../constants/addresses";
import { calculateGasMargin } from "../utils/calculateGasMargin";
import { getTradeVersion } from "../utils/getTradeVersion";
import { useTransactionAdder } from "../state/transactions/hooks";
import { isAddress, shortenAddress } from "../utils";
import isZero from "../utils/isZero";
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { publicClientToProvider, walletClientToSigner } from '../utils/ethersAdapters';
import { SignatureData } from "./useERC20Permit";
import useTransactionDeadline from "./useTransactionDeadline";
import useENS from "./useENS";
import { Version } from "./useToggledVersion";
import { SwapRouter } from "../lib/src";
import { GAS_PRICE_MULTIPLIER } from "./useGasPrice";
import { useAppSelector } from "../state/hooks";
import { Contract, Signer, TransactionRequest, Provider } from "ethers";

enum SwapCallbackState {
    INVALID,
    LOADING,
    VALID,
}

interface SwapCall {
    address: string;
    calldata: string;
    value: string;
}

interface SwapCallEstimate {
    call: SwapCall;
}

interface SuccessfulCall extends SwapCallEstimate {
    call: SwapCall;
    gasEstimate: bigint;
}

interface FailedCall extends SwapCallEstimate {
    call: SwapCall;
    error: Error;
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName the ENS name or address of the recipient of the swap output
 * @param signatureData the signature data of the permit of the input token amount, if available
 */
function useSwapCallArguments(
    trade: V3Trade<Currency, Currency, TradeType> | undefined,
    allowedSlippage: Percent,
    recipientAddressOrName: string | null,
    signatureData: SignatureData | null | undefined
): SwapCall[] {
    const { address: account, chainId } = useAccount();

    const { address: recipientAddress } = useENS(recipientAddressOrName);
    const recipient = recipientAddressOrName === null ? account : recipientAddress;
    const deadline = useTransactionDeadline();

    return useMemo(() => {
        if (!trade || !recipient || !account || !chainId || !deadline) return [];

        // --- BEGIN DEBUG LOG --- G
        console.log("[Debug: useSwapCallArguments] Trade object:", JSON.parse(JSON.stringify(trade, (key, value) =>
            typeof value === 'bigint'
                ? value.toString()
                : value // return everything else unchanged
        )));
        // --- END DEBUG LOG ---

        const swapRouterAddress = chainId ? SWAP_ROUTER_ADDRESSES[chainId] : undefined;

        if (!swapRouterAddress) return [];

        const swapMethods: any[] = [];

        const deadlineString = typeof deadline === 'bigint' ? deadline.toString() : String(deadline);

        swapMethods.push(
            SwapRouter.swapCallParameters(trade, {
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
            })
        );

        // --- BEGIN DEBUG LOG ---
        if (swapMethods[0]) {
            console.log("[Debug: useSwapCallArguments] swapMethods[0] (feeOnTransfer: false):", { calldata: swapMethods[0].calldata, value: swapMethods[0].value });
        }
        // --- END DEBUG LOG ---

        if (trade.tradeType === TradeType.EXACT_INPUT) {
            swapMethods.push(
                SwapRouter.swapCallParameters(trade, {
                    feeOnTransfer: true,
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
                                        v: signatureData.v as any
                                    }
                                    : {
                                        deadline: signatureData.deadline,
                                        amount: signatureData.amount,
                                        s: signatureData.s,
                                        r: signatureData.r,
                                        v: signatureData.v as any
                                    },
                        }
                        : {}),
                })
            );
            // --- BEGIN DEBUG LOG ---
            if (swapMethods[1]) {
                console.log("[Debug: useSwapCallArguments] swapMethods[1] (feeOnTransfer: true):", { calldata: swapMethods[1].calldata, value: swapMethods[1].value });
            }
            // --- END DEBUG LOG ---
        }

        return swapMethods.map(({ calldata, value }) => {
            return {
                address: swapRouterAddress,
                calldata,
                value,
            };
        });
    }, [account, allowedSlippage, chainId, deadline, recipient, signatureData, trade]);
}

/**
 * This is hacking out the revert reason from the ethers provider thrown error however it can.
 * This object seems to be undocumented by ethers.
 * @param error an error from the ethers provider
 */
function swapErrorToUserReadableMessage(error: any): string {
    let reason: string | undefined;
    while (Boolean(error)) {
        reason = error.reason ?? error.message ?? reason;
        error = error.error ?? error.data?.originalError ?? error.cause;
    }

    if (reason?.indexOf("execution reverted: ") === 0) reason = reason.substr("execution reverted: ".length);

    switch (reason) {
        case "UniswapV2Router: EXPIRED":
            return t`The transaction could not be sent because the deadline has passed. Please check that your transaction deadline is not too low.`;
        case "UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT":
        case "UniswapV2Router: EXCESSIVE_INPUT_AMOUNT":
            return t`This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.`;
        case "TransferHelper: TRANSFER_FROM_FAILED":
            return t`The input token cannot be transferred. There may be an issue with the input token.`;
        case "UniswapV2: TRANSFER_FAILED":
            return t`The output token cannot be transferred. There may be an issue with the output token.`;
        case "UniswapV2: K":
            return t`The SeerSwap invariant x*y=k was not satisfied by the swap. This usually means one of the tokens you are swapping incorporates custom behavior on transfer.`;
        case "Too little received":
        case "Too much requested":
        case "STF":
            return t`This transaction will not succeed due to price movement. Try increasing your slippage tolerance. Note: rebase tokens are incompatible with Swapr`;
        case "TF":
            return t`The output token cannot be transferred. There may be an issue with the output token. Note: rebase tokens are incompatible with Swapr.`;
        default:
            if (reason?.indexOf("undefined is not an object") !== -1) {
                console.error(error, reason);
                return t`An error occurred when trying to execute this swap. You may need to increase your slippage tolerance. If that does not work, there may be an incompatibility with the token you are trading. Note: rebase tokens are incompatible with Swapr.`;
            }
            return t`Unknown error${reason ? `: "${reason}"` : ""}. Try increasing your slippage tolerance. Note: rebase tokens are incompatible with Swapr.`;
    }
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
    trade: V3Trade<Currency, Currency, TradeType> | undefined,
    allowedSlippage: Percent,
    recipientAddressOrName: string | null,
    signatureData: SignatureData | undefined | null
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
    const { address: account, chainId } = useAccount();
    const publicClient = usePublicClient({ chainId });
    const { data: walletClient } = useWalletClient({ chainId });

    const swapCalls = useSwapCallArguments(trade, allowedSlippage, recipientAddressOrName, signatureData);
    const addTransaction = useTransactionAdder();

    // Get the gas price in GWEI from the Redux store
    const gasPriceInGwei = useAppSelector((state) => {
        if (!state.application.gasPrice.fetched) return 36; // Default to 36 GWEI
        return state.application.gasPrice.override ? 36 : state.application.gasPrice.fetched;
    });

    const { address: recipientAddress } = useENS(recipientAddressOrName);
    const recipient = recipientAddressOrName === null ? account : recipientAddress;

    return useMemo(() => {
        if (!trade || !account || !chainId || !publicClient) {
            return {
                state: SwapCallbackState.INVALID,
                callback: null,
                error: "Missing dependencies",
            };
        }
        if (!recipient) {
            if (recipientAddressOrName !== null) {
                return {
                    state: SwapCallbackState.INVALID,
                    callback: null,
                    error: "Invalid recipient",
                };
            } else {
                return { state: SwapCallbackState.LOADING, callback: null, error: null };
            }
        }

        const ethersProvider = publicClientToProvider(publicClient);
        let ethersSigner: Signer | undefined;
        if (walletClient && account) {
            ethersSigner = walletClientToSigner(walletClient);
        }

        if (!ethersSigner) {
            return { state: SwapCallbackState.INVALID, callback: null, error: "Wallet not connected or signer unavailable" };
        }
        const finalSigner = ethersSigner;

        return {
            state: SwapCallbackState.VALID,
            callback: async function onSwap(): Promise<string> {
                const estimatedCalls: SwapCallEstimate[] = await Promise.all(
                    swapCalls.map((call) => {
                        const { address, calldata, value } = call;
                        const tx: TransactionRequest = {
                            from: account,
                            to: address,
                            data: calldata,
                            ...(value && !isZero(value) ? { value: value } : {}),
                        };
                        // Attempt to estimate gas
                        return finalSigner.estimateGas(tx)
                            .then((gasEstimate) => {
                                console.debug("Gas estimate successful", call, gasEstimate);
                                return { call, gasEstimate };
                            })
                            .catch((gasError) => {
                                console.debug("Gas estimate failed, attempting eth_call to extract error for debugging", call, gasError);
                                // Fallback to eth_call ONLY for error reporting, not for gas estimation itself
                                return ethersProvider.call(tx)
                                    .then((result) => {
                                        console.debug("eth_call successful after failed estimateGas (unexpected for gas estimation strategy)", call, gasError, result);
                                        // Return an error here, as eth_call is not a substitute for estimateGas
                                        return { call, error: new Error(t`Gas estimation failed. The transaction might fail or require a manual gas limit.`) };
                                    })
                                    .catch((callError) => {
                                        console.debug("eth_call also failed", call, callError);
                                        return { call, error: new Error(swapErrorToUserReadableMessage(callError)) }; // Use the error from eth_call if estimateGas also failed
                                    });
                            });
                    })
                );

                // Ensure we have at least one successful gas estimation
                const successfulEstimation = estimatedCalls.find((el): el is SuccessfulCall => "gasEstimate" in el && el.gasEstimate !== undefined);

                if (!successfulEstimation) {
                    const errorCalls = estimatedCalls.filter((call): call is FailedCall => "error" in call);
                    if (errorCalls.length > 0 && errorCalls[0].error) {
                        // Prioritize showing the first error encountered during estimation attempts
                        throw errorCalls[0].error;
                    }
                    throw new Error(t`Unable to estimate gas for the swap. The transaction may fail.`);
                }

                const { call, gasEstimate } = successfulEstimation;

                // --- BEGIN DEBUG LOG ---
                console.log("[Debug: useSwapCallback] gasPriceInGwei from Redux:", gasPriceInGwei.toString());
                const calculatedGasPrice = BigInt(gasPriceInGwei) * BigInt(GAS_PRICE_MULTIPLIER); // GWEI to WEI
                console.log("[Debug: useSwapCallback] Calculated gasPrice for transaction (Wei):", calculatedGasPrice.toString());
                // --- END DEBUG LOG ---

                const tx = {
                    from: account,
                    to: call.address,
                    data: call.calldata,
                    gasLimit: calculateGasMargin(chainId, gasEstimate),
                    ...(call.value && !isZero(call.value) ? { value: call.value } : {}),
                    gasPrice: calculatedGasPrice // Use the correctly calculated gas price in Wei
                };

                // --- BEGIN DEBUG LOG ---
                console.log("[Debug: useSwapCallback] Final transaction object to be sent:", JSON.parse(JSON.stringify(tx, (key, value) =>
                    typeof value === 'bigint' ? value.toString() : value
                )));
                // --- END DEBUG LOG ---

                const response = await finalSigner.sendTransaction(tx);

                const inputSymbol = trade.inputAmount.currency.symbol;
                const outputSymbol = trade.outputAmount.currency.symbol;
                const inputAmount = trade.inputAmount.toSignificant(3);
                const outputAmount = trade.outputAmount.toSignificant(3);

                let baseSummary = '';
                let recipientSummary = '';

                if (inputSymbol && outputSymbol) {
                    baseSummary = t`Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`;
                    recipientSummary =
                        recipient === account || !recipient
                            ? baseSummary
                            : t`${baseSummary} to ${(recipientAddressOrName && isAddress(recipientAddressOrName) ? shortenAddress(recipientAddressOrName) : recipientAddressOrName) || ''}`;
                }

                const tradeVersion = getTradeVersion(trade);
                const finalSummary = tradeVersion === Version.v3
                    ? recipientSummary
                    : tradeVersion
                        ? `${recipientSummary} on ${tradeVersion.toString()}`
                        : recipientSummary;

                addTransaction(response, {
                    summary: finalSummary,
                });

                return response.hash;
            },
            error: null,
        };
    }, [trade, account, chainId, publicClient, walletClient, recipient, recipientAddressOrName, swapCalls, addTransaction, gasPriceInGwei]);
}
