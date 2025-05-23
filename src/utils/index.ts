import { getAddress, ZeroAddress, Contract, JsonRpcSigner, BrowserProvider, Provider } from "ethers";
import { Token } from "@uniswap/sdk-core";
import { FeeAmount } from "@uniswap/v3-sdk/dist/";
import { TokenAddressMap } from "../state/lists/hooks";

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
    try {
        return getAddress(value);
    } catch {
        return false;
    }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
    const parsed = isAddress(address);
    if (!parsed) {
        throw Error(`Invalid 'address' parameter '${address}'.`);
    }
    return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

// account is not optional
function getSigner(provider: Provider, account: string): JsonRpcSigner {
    // For BrowserProvider instances, use the getSigner method
    if (provider instanceof BrowserProvider) {
        // Need to handle this asynchronously in the component that uses it
        return new JsonRpcSigner(provider as any, account);
    }

    // For other providers, try to create a signer directly
    // This might not work for all provider types
    return new JsonRpcSigner(provider as any, account);
}

// account is optional
function getProviderOrSigner(provider: Provider, account?: string): Provider | JsonRpcSigner {
    return account ? getSigner(provider, account) : provider;
}

// account is optional
export function getContract(address: string, ABI: any, provider: Provider, account?: string): Contract {
    if (!isAddress(address) || address === ZeroAddress) {
        throw Error(`Invalid 'address' parameter '${address}'.`);
    }

    return new Contract(address, ABI, getProviderOrSigner(provider, account) as any);
}

export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export function isTokenOnList(tokenAddressMap: TokenAddressMap, token?: Token): boolean {
    return Boolean(token?.isToken && tokenAddressMap[token.chainId]?.[token.address]);
}

export function formattedFeeAmount(feeAmount: FeeAmount): number {
    return feeAmount / 10000;
}

export function feeTierPercent(fee: number): string {
    return (fee / 10000).toFixed(4) + "%";
}
