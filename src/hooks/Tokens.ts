import { Currency, Token } from "@uniswap/sdk-core";
import { useMemo, useRef } from "react";
import { createTokenFilterFunction } from "../components/SearchModal/filtering";
import { ExtendedEther, WXDAI_EXTENDED } from "../constants/tokens";
import { TokenAddressMap, useAllLists, useCombinedActiveList, useInactiveListUrls } from "../state/lists/hooks";
import { WrappedTokenInfo } from "../state/lists/wrappedTokenInfo";
import { NEVER_RELOAD, useSingleCallResult } from "../state/multicall/hooks";
import { useUserAddedTokens } from "../state/user/hooks";
import { isAddress } from "../utils";

import { useAccount } from "wagmi";
import { decodeBytes32String, getBytes } from "ethers";
import { useBytes32TokenContract, useTokenContract } from "./useContract";

import AlgebraConfig from "algebra.config";

// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(tokenMap: TokenAddressMap, includeUserAdded: boolean): { [address: string]: Token } {
    const { chain } = useAccount();
    const userAddedTokens = useUserAddedTokens();

    return useMemo(() => {
        if (!chain?.id) return {};

        // reduce to just tokens
        const mapWithoutUrls = Object.keys(tokenMap[chain.id] ?? {}).reduce<{ [address: string]: Token }>((newMap, address) => {
            newMap[address] = tokenMap[chain.id][address].token;
            return newMap;
        }, {});

        if (includeUserAdded) {
            return (
                userAddedTokens
                    // reduce into all ALL_TOKENS filtered by the current chain
                    .reduce<{ [address: string]: Token }>(
                        (tokenMap, token) => {
                            tokenMap[token.address] = token;
                            return tokenMap;
                        },
                        // must make a copy because reduce modifies the map, and we do not
                        // want to make a copy in every iteration
                        { ...mapWithoutUrls }
                    )
            );
        }

        return mapWithoutUrls;
    }, [chain?.id, userAddedTokens, tokenMap, includeUserAdded]);
}

export function useAllTokens(): { [address: string]: Token } {
    const allTokens = useCombinedActiveList();
    return useTokensFromMap(allTokens, true);
}

export function useSearchInactiveTokenLists(search: string | undefined, minResults = 10): WrappedTokenInfo[] {
    const lists = useAllLists();
    const inactiveUrls = useInactiveListUrls();
    const { chain } = useAccount();
    const activeTokens = useAllTokens();

    return useMemo(() => {
        if (!search || search.trim().length === 0) return [];
        const tokenFilter = createTokenFilterFunction(search);
        const result: WrappedTokenInfo[] = [];
        const addressSet: { [address: string]: true } = {};
        for (const url of inactiveUrls) {
            const list = lists[url].current;
            if (!list) continue;
            for (const tokenInfo of list.tokens) {
                if (tokenInfo.chainId === chain?.id && tokenFilter(tokenInfo)) {
                    const wrapped: WrappedTokenInfo = new WrappedTokenInfo(tokenInfo, list);
                    if (!(wrapped.address in activeTokens) && !addressSet[wrapped.address]) {
                        addressSet[wrapped.address] = true;
                        result.push(wrapped);
                        if (result.length >= minResults) return result;
                    }
                }
            }
        }
        return result;
    }, [activeTokens, chain?.id, inactiveUrls, lists, minResults, search]);
}

export function useIsTokenActive(token: Token | undefined | null): boolean {
    const activeTokens = useAllTokens();

    if (!activeTokens || !token) {
        return false;
    }

    return !!activeTokens[token.address];
}

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: Currency | undefined | null): boolean {
    const userAddedTokens = useUserAddedTokens();

    if (!currency) {
        return false;
    }

    return !!userAddedTokens.find((token) => currency.equals(token));
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/;

function parseStringOrBytes32(str: string | undefined, bytes32: string | undefined, defaultValue: string): string {
    // console.log(`parseStringOrBytes32: str='${str}', bytes32='${bytes32}', defaultValue='${defaultValue}'`);
    const result = str && str.length > 0
        ? str
        : // need to check for proper bytes string and valid terminator
        bytes32 && BYTES32_REGEX.test(bytes32) && getBytes(bytes32)[31] === 0
            ? decodeBytes32String(bytes32)
            : defaultValue;
    // if (result === defaultValue) {
    //     console.log(`parseStringOrBytes32: Defaulted! str='${str}', typeof str: ${typeof str}, bytes32='${bytes32}', result='${result}'`);
    // }
    if (result === defaultValue && defaultValue !== '' && str !== undefined && str !== '') {
        console.warn(`parseStringOrBytes32: Outputting default value '${defaultValue}' despite non-empty input str='${str}' (length ${str?.length}). Str type: ${typeof str}. Bytes32 input: '${bytes32}'`);
    }
    return result;
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): Token | undefined | null {
    const { chain } = useAccount();
    const tokens = useAllTokens();
    // const stableTokenRef = useRef<Token | undefined | null>(undefined); // Cache for the token object REMOVED

    const address = isAddress(tokenAddress);
    const _lowkeyAddress = useMemo(() => {
        if (!address) return;

        return address.toLowerCase();
    }, [tokenAddress, address]);

    const tokenContract = useTokenContract(address ? address : undefined, false);
    const tokenContractBytes32 = useBytes32TokenContract(address ? address : undefined, false);
    const token: Token | undefined = address ? tokens[address] : undefined;

    const tokenName = useSingleCallResult(token ? undefined : tokenContract, "name", undefined, NEVER_RELOAD);
    const tokenNameBytes32 = useSingleCallResult(token ? undefined : tokenContractBytes32, "name", undefined, NEVER_RELOAD);

    const symbol = useSingleCallResult(token ? undefined : tokenContract, "symbol", undefined, NEVER_RELOAD);
    const symbolBytes32 = useSingleCallResult(token ? undefined : tokenContractBytes32, "symbol", undefined, NEVER_RELOAD);

    const decimals = useSingleCallResult(token ? undefined : tokenContract, "decimals", undefined, NEVER_RELOAD);

    const newCalculatedToken = useMemo(() => {
        if (token) return token;
        if (!chain?.id || !address || !_lowkeyAddress) return undefined;
        if (_lowkeyAddress in AlgebraConfig.DEFAULT_TOKEN_LIST.defaultTokens) {
            const defaultConfig = AlgebraConfig.DEFAULT_TOKEN_LIST.defaultTokens[_lowkeyAddress];
            return new Token(
                chain.id,
                address,
                defaultConfig.decimals,
                defaultConfig.symbol,
                defaultConfig.name
            );
        }
        if (decimals.loading || symbol.loading || tokenName.loading) return null; // Still loading
        if (decimals.result) {
            return new Token(
                chain.id,
                address,
                Number(decimals.result[0]),
                parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], "UNKNOWN"),
                parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], "Unknown Token")
            );
        }
        return undefined; // Not found, not loading, no valid data
    }, [
        token, chain?.id, address, _lowkeyAddress,
        decimals.loading, decimals.result,
        symbol.loading, symbol.result, symbolBytes32.result,
        tokenName.loading, tokenName.result, tokenNameBytes32.result
    ]);

    return newCalculatedToken; // MODIFIED - directly return newCalculatedToken
}

export function useCurrency(currencyId: string | undefined): Currency | null | undefined {
    const { chain } = useAccount();
    let isETH;
    if (chain?.id === AlgebraConfig.CHAIN_PARAMS.chainId) {
        isETH = currencyId?.toUpperCase() === AlgebraConfig.CHAIN_PARAMS.nativeCurrency.symbol;
    }

    const token = useToken(isETH ? undefined : currencyId);
    const extendedEther = useMemo(() => (chain?.id ? ExtendedEther.onChain(chain.id) : undefined), [chain?.id]);
    const weth = chain?.id ? WXDAI_EXTENDED[chain.id] : undefined;
    if (weth?.address?.toLowerCase() === currencyId?.toLowerCase()) return weth;
    return isETH ? extendedEther : token;
}
