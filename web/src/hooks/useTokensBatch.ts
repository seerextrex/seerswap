import { Token } from "@uniswap/sdk-core";
import { useMultipleContractSingleData, NEVER_RELOAD } from "../state/multicall/hooks";
import { useMemo } from "react";
import { isAddress } from "../utils";
import { Interface } from "ethers";
import ERC20_ABI from "../abis/erc20.json";
import { useAccount } from "wagmi";
import { useAllTokens } from "./Tokens";
import AlgebraConfig from "algebra.config";

const ERC20_INTERFACE = new Interface(ERC20_ABI);

// Parse string or bytes32 result
function parseStringOrBytes32(str: any, bytes32: any, fallback: string): string {
    if (str && str.length > 0) return str;
    if (bytes32 && bytes32.length > 0) {
        try {
            // Try to decode as bytes32
            const decoded = new TextDecoder('utf-8').decode(new Uint8Array(bytes32));
            return decoded.replace(/\0/g, '') || fallback;
        } catch {
            return fallback;
        }
    }
    return fallback;
}

export function useTokensBatch(addresses: (string | undefined)[]): (Token | undefined)[] {
    const { chain } = useAccount();
    const chainId = chain?.id;
    const allTokens = useAllTokens();

    // Filter and normalize addresses, remove duplicates
    const { validAddresses, addressMap } = useMemo(() => {
        const uniqueAddresses = new Set<string>();
        const addressMap = new Map<string, number[]>();

        addresses.forEach((addr, index) => {
            const validAddr = addr && isAddress(addr);
            if (validAddr) {
                const lowerAddr = validAddr.toLowerCase();
                uniqueAddresses.add(validAddr);

                if (!addressMap.has(validAddr)) {
                    addressMap.set(validAddr, []);
                }
                addressMap.get(validAddr)!.push(index);
            }
        });

        return {
            validAddresses: Array.from(uniqueAddresses),
            addressMap
        };
    }, [addresses]);

    // Get token names
    const nameResults = useMultipleContractSingleData(
        validAddresses,
        ERC20_INTERFACE,
        'name',
        undefined,
        NEVER_RELOAD
    );

    // Get token symbols  
    const symbolResults = useMultipleContractSingleData(
        validAddresses,
        ERC20_INTERFACE,
        'symbol',
        undefined,
        NEVER_RELOAD
    );

    // Get token decimals
    const decimalsResults = useMultipleContractSingleData(
        validAddresses,
        ERC20_INTERFACE,
        'decimals',
        undefined,
        NEVER_RELOAD
    );

    // Create tokens map
    const tokensMap = useMemo(() => {
        const map = new Map<string, Token | undefined>();

        if (!chainId) return map;

        validAddresses.forEach((address, index) => {
            const lowerAddr = address.toLowerCase();

            // Check if token exists in token lists first
            if (allTokens[address]) {
                map.set(address, allTokens[address]);
                return;
            }

            // Check default token list
            if (lowerAddr in AlgebraConfig.DEFAULT_TOKEN_LIST.defaultTokens) {
                const defaultConfig = AlgebraConfig.DEFAULT_TOKEN_LIST.defaultTokens[lowerAddr];
                map.set(address, new Token(
                    chainId,
                    address,
                    defaultConfig.decimals,
                    defaultConfig.symbol,
                    defaultConfig.name
                ));
                return;
            }

            // Get results from multicalls
            const nameResult = nameResults[index];
            const symbolResult = symbolResults[index];
            const decimalsResult = decimalsResults[index];

            // If still loading, set as undefined
            if (nameResult?.loading || symbolResult?.loading || decimalsResult?.loading) {
                map.set(address, undefined);
                return;
            }

            // If we have decimals, create the token
            if (decimalsResult?.result?.[0] !== undefined) {
                try {
                    const token = new Token(
                        chainId,
                        address,
                        Number(decimalsResult.result[0]),
                        parseStringOrBytes32(symbolResult?.result?.[0], null, "UNKNOWN"),
                        parseStringOrBytes32(nameResult?.result?.[0], null, "Unknown Token")
                    );
                    map.set(address, token);
                } catch (error) {
                    console.warn(`Error creating token for ${address}:`, error);
                    map.set(address, undefined);
                }
            } else {
                map.set(address, undefined);
            }
        });

        return map;
    }, [validAddresses, nameResults, symbolResults, decimalsResults, chainId, allTokens]);

    // Map back to original order
    return useMemo(() => {
        return addresses.map((address) => {
            if (!address) return undefined;
            const validAddr = isAddress(address);
            if (!validAddr) return undefined;
            return tokensMap.get(validAddr);
        });
    }, [addresses, tokensMap]);
}

// Hook to get tokens by their addresses with caching
export function useTokens(addresses: string[]): Record<string, Token | undefined> {
    const tokens = useTokensBatch(addresses);

    return useMemo(() => {
        const result: Record<string, Token | undefined> = {};
        addresses.forEach((address, index) => {
            if (address) {
                result[address] = tokens[index];
            }
        });
        return result;
    }, [addresses, tokens]);
} 