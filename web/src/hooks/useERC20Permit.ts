import JSBI from "jsbi";
import { Currency, CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core";
import { Trade as V2Trade } from "@uniswap/v2-sdk";
import { Trade as V3Trade } from "lib/src";
import { Signature } from "ethers";
import { useMemo, useState } from "react";
import { SWAP_ROUTER_ADDRESSES } from "../constants/addresses";
import { useSingleCallResult } from "../state/multicall/hooks";
import { useAccount, useWalletClient, useConfig } from 'wagmi';
import { useEIP2612Contract } from "./useContract";
import { signTypedData as signTypedDataAction } from "wagmi/actions";
import useTransactionDeadline from "./useTransactionDeadline";

enum PermitType {
    AMOUNT = 1,
    ALLOWED = 2,
}

// 20 minutes to submit after signing
const PERMIT_VALIDITY_BUFFER = 20 * 60;

interface PermitInfo {
    type: PermitType;
    name: string;
    // version is optional, and if omitted, will not be included in the domain
    version?: string;
}

// todo: read this information from extensions on token lists or elsewhere (permit registry?)
const PERMITTABLE_TOKENS: {
    [chainId: number]: {
        [checksummedTokenAddress: string]: PermitInfo;
    };
} = {};

export enum UseERC20PermitState {
    // returned for any reason, e.g. it is an argent wallet, or the currency does not support it
    NOT_APPLICABLE,
    LOADING,
    NOT_SIGNED,
    SIGNED,
}

interface BaseSignatureData {
    v: number;
    r: string;
    s: string;
    deadline: number;
    nonce: number;
    owner: string;
    spender: string;
    chainId: number;
    tokenAddress: string;
    permitType: PermitType;
}

interface StandardSignatureData extends BaseSignatureData {
    amount: string;
}

interface AllowedSignatureData extends BaseSignatureData {
    allowed: true;
}

export type SignatureData = StandardSignatureData | AllowedSignatureData;

const EIP712_DOMAIN_TYPE_NO_VERSION = [
    { name: "name", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
] as const;

const EIP712_DOMAIN_TYPE = [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
] as const;

const EIP2612_TYPE = [
    { name: "owner", type: "address" },
    { name: "spender", type: "address" },
    { name: "value", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
] as const;

const PERMIT_ALLOWED_TYPE = [
    { name: "holder", type: "address" },
    { name: "spender", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "expiry", type: "uint256" },
    { name: "allowed", type: "bool" },
];

function useERC20Permit(
    currencyAmount: CurrencyAmount<Currency> | null | undefined,
    spender: string | null | undefined,
    overridePermitInfo: PermitInfo | undefined | null
): {
    signatureData: SignatureData | null;
    state: UseERC20PermitState;
    gatherPermitSignature: null | (() => Promise<void>);
} {
    const { address: account, chainId } = useAccount();
    const { data: walletClient } = useWalletClient({ chainId });
    const config = useConfig();
    const transactionDeadline = useTransactionDeadline();
    const tokenAddress = currencyAmount?.currency?.isToken ? currencyAmount.currency.address : undefined;
    const eip2612Contract = useEIP2612Contract(tokenAddress);
    const nonceInputs = useMemo(() => [account ?? undefined], [account]);
    const tokenNonceState = useSingleCallResult(eip2612Contract, "nonces", nonceInputs);
    const permitInfo = overridePermitInfo ?? (chainId && tokenAddress ? PERMITTABLE_TOKENS[chainId]?.[tokenAddress] : undefined);

    const [signatureData, setSignatureData] = useState<SignatureData | null>(null);

    return useMemo(() => {
        const deadlineNumber = typeof transactionDeadline === 'bigint' ? Number(transactionDeadline) : transactionDeadline;

        if (!currencyAmount || !eip2612Contract || !account || !chainId || !deadlineNumber || !walletClient || !tokenNonceState.valid || !tokenAddress || !spender || !permitInfo) {
            return {
                state: UseERC20PermitState.NOT_APPLICABLE,
                signatureData: null,
                gatherPermitSignature: null,
            };
        }

        const nonceResult = tokenNonceState.result?.[0];
        const nonceNumber = typeof nonceResult === 'bigint' ? Number(nonceResult) : (nonceResult as any)?.toNumber?.();

        if (tokenNonceState.loading || typeof nonceNumber !== "number") {
            return {
                state: UseERC20PermitState.LOADING,
                signatureData: null,
                gatherPermitSignature: null,
            };
        }

        const isSignatureDataValid =
            signatureData &&
            signatureData.owner === account &&
            signatureData.deadline >= deadlineNumber &&
            signatureData.tokenAddress === tokenAddress &&
            signatureData.nonce === nonceNumber &&
            signatureData.spender === spender &&
            ("allowed" in signatureData || JSBI.equal(JSBI.BigInt(signatureData.amount), currencyAmount.quotient));

        return {
            state: isSignatureDataValid ? UseERC20PermitState.SIGNED : UseERC20PermitState.NOT_SIGNED,
            signatureData: isSignatureDataValid ? signatureData : null,
            gatherPermitSignature: async function gatherPermitSignature() {
                const allowed = permitInfo.type === PermitType.ALLOWED;
                const signatureDeadline = deadlineNumber + PERMIT_VALIDITY_BUFFER;
                const value = currencyAmount.quotient.toString();

                const message = allowed
                    ? {
                        holder: account,
                        spender,
                        allowed,
                        nonce: nonceNumber,
                        expiry: signatureDeadline,
                    }
                    : {
                        owner: account,
                        spender,
                        value,
                        nonce: nonceNumber,
                        deadline: signatureDeadline,
                    };

                // Define types for viem's signTypedData
                const permitSpecificTypes = {
                    Permit: allowed ? PERMIT_ALLOWED_TYPE : EIP2612_TYPE,
                } as const;

                try {
                    let rawSignature;
                    if (permitInfo.version) {
                        const domain = {
                            name: permitInfo.name,
                            version: permitInfo.version,
                            verifyingContract: tokenAddress as `0x${string}`,
                            chainId: BigInt(chainId),
                        };
                        rawSignature = await signTypedDataAction(config, {
                            account: account as `0x${string}`,
                            domain,
                            types: { ...permitSpecificTypes, EIP712Domain: EIP712_DOMAIN_TYPE },
                            primaryType: "Permit",
                            message: message as any,
                        });
                    } else {
                        const domain = {
                            name: permitInfo.name,
                            verifyingContract: tokenAddress as `0x${string}`,
                            chainId: BigInt(chainId),
                        };
                        rawSignature = await signTypedDataAction(config, {
                            account: account as `0x${string}`,
                            domain,
                            types: { ...permitSpecificTypes, EIP712Domain: EIP712_DOMAIN_TYPE_NO_VERSION },
                            primaryType: "Permit",
                            message: message as any,
                        });
                    }

                    const sig = Signature.from(rawSignature);

                    setSignatureData({
                        v: sig.v,
                        r: sig.r,
                        s: sig.s,
                        deadline: signatureDeadline,
                        ...(allowed ? { allowed } : { amount: value }),
                        nonce: nonceNumber,
                        chainId,
                        owner: account,
                        spender,
                        tokenAddress,
                        permitType: permitInfo.type,
                    });
                } catch (error) {
                    console.error("Error signing typed data", error);
                }
            },
        };
    }, [
        currencyAmount,
        eip2612Contract,
        account,
        chainId,
        transactionDeadline,
        walletClient,
        tokenNonceState.loading,
        tokenNonceState.valid,
        tokenNonceState.result,
        tokenAddress,
        spender,
        permitInfo,
        signatureData,
    ]);
}

const REMOVE_V2_LIQUIDITY_PERMIT_INFO: PermitInfo = {
    version: "1",
    name: "Swapr",
    type: PermitType.AMOUNT,
};

export function useV2LiquidityTokenPermit(liquidityAmount: CurrencyAmount<Token> | null | undefined, spender: string | null | undefined) {
    return useERC20Permit(liquidityAmount, spender, REMOVE_V2_LIQUIDITY_PERMIT_INFO);
}

export function useERC20PermitFromTrade(trade: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType> | undefined, allowedSlippage: Percent) {
    const { chainId } = useAccount();
    const swapRouterAddress = chainId ? SWAP_ROUTER_ADDRESSES[chainId] : undefined;
    const amountToApprove = useMemo(() => (trade ? trade.maximumAmountIn(allowedSlippage) : undefined), [trade, allowedSlippage]);

    return useERC20Permit(amountToApprove, swapRouterAddress, undefined);
}
