import { Token } from "@uniswap/sdk-core";
import { useMultipleContractSingleData, NEVER_RELOAD } from "../state/multicall/hooks";
import { useMemo } from "react";
import { isAddress } from "../utils";
import { useTokenContract } from "./useContract";
import { decodeBytes32String, getBytes, Interface } from "ethers";
import ERC20_ABI from "../abis/erc20.json";

const ERC20_INTERFACE = new Interface(ERC20_ABI);

// Cache token data across component instances
const tokenCache = new Map<string, Token>();

export function useTokensBatch(addresses: (string | undefined)[]): (Token | undefined)[] {
    // Filter and normalize addresses
    const validAddresses = useMemo(() => {
        return addresses
            .map(addr => addr && isAddress(addr))
            .filter((addr): addr is string => !!addr);
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

    return useMemo(() => {
        return addresses.map((address, index) => {
            if (!address || !isAddress(address)) return undefined;

            // Check cache first
            const cached = tokenCache.get(address.toLowerCase());
            if (cached) return cached;

            // Find the index in validAddresses
            const validIndex = validAddresses.findIndex(addr => addr.toLowerCase() === address.toLowerCase());
            if (validIndex === -1) return undefined;

            const nameResult = nameResults[validIndex];
            const symbolResult = symbolResults[validIndex];
            const decimalsResult = decimalsResults[validIndex];

            // If any result is loading or invalid, return undefined
            if (
                !nameResult?.valid || nameResult.loading ||
                !symbolResult?.valid || symbolResult.loading ||
                !decimalsResult?.valid || decimalsResult.loading
            ) {
                return undefined;
            }

            try {
                const name = nameResult.result?.[0];
                const symbol = symbolResult.result?.[0];
                const decimals = decimalsResult.result?.[0];

                if (!name || !symbol || decimals === undefined) return undefined;

                // Handle bytes32 encoded strings
                const parsedName = typeof name === 'string' ? name : parseBytes32String(name);
                const parsedSymbol = typeof symbol === 'string' ? symbol : parseBytes32String(symbol);

                const token = new Token(
                    100, // Gnosis chain ID
                    address,
                    decimals,
                    parsedSymbol,
                    parsedName
                );

                // Cache the token
                tokenCache.set(address.toLowerCase(), token);

                return token;
            } catch (error) {
                console.error(`Error creating token for address ${address}:`, error);
                return undefined;
            }
        });
    }, [addresses, validAddresses, nameResults, symbolResults, decimalsResults]);
}

function parseBytes32String(value: any): string {
    try {
        // If it's already a string, return it
        if (typeof value === 'string' && !value.startsWith('0x')) {
            return value;
        }
        // Otherwise try to decode as bytes32
        return decodeBytes32String(value);
    } catch {
        // If decoding fails, try to convert raw bytes
        try {
            const bytes = getBytes(value);
            // Remove null bytes
            const filtered = bytes.filter(b => b !== 0);
            return new TextDecoder().decode(new Uint8Array(filtered));
        } catch {
            return 'Unknown';
        }
    }
} 