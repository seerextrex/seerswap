import { Result, useSingleCallResult, useSingleContractMultipleData, NEVER_RELOAD } from "state/multicall/hooks";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useV3NFTPositionManagerContract } from "./useContract";
import { useFarmingSubgraph } from "./useFarmingSubgraph";
import { PositionPool } from "../models/interfaces";
import usePrevious, { usePreviousNonEmptyArray } from "./usePrevious";
import { useAccount } from 'wagmi';
import { safeConvertToBigInt, deepEqual } from "../utils/bigintUtils";

// Production-mode logger that only logs in development
const logger = {
    debug: (process.env.NODE_ENV === 'development')
        ? (...args: any[]) => console.debug(...args)
        : () => { /* no-op in production */ },
    warn: (...args: any[]) => console.warn(...args),
    error: (...args: any[]) => console.error(...args),
};

// Add a simple array equality check function
function areArraysEqual<T>(a: T[] | undefined, b: T[] | undefined, compareFn?: (itemA: T, itemB: T) => boolean): boolean {
    if (a === b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;

    if (compareFn) {
        return a.every((item, index) => compareFn(item, b[index]));
    }

    return a.every((item, index) => item === b[index]);
}

interface UseV3PositionsResults {
    loading: boolean;
    positions: PositionPool[] | undefined;
    uniqueTokenAddresses: string[] | undefined; // Added to track unique token addresses
}

function useV3PositionsFromTokenIds(tokenIds: bigint[] | undefined): UseV3PositionsResults {
    const positionManager = useV3NFTPositionManagerContract();

    // Stabilize inputs array for tokenIds
    const stableTokenIds = useMemo(() => {
        if (!tokenIds) return undefined;
        return [...tokenIds].sort((a, b) => Number(a - b));
    }, [tokenIds]);

    const inputs = useMemo(() => (stableTokenIds ? stableTokenIds.map((tokenId) => [tokenId.toString()]) : []), [stableTokenIds]);
    const results = useSingleContractMultipleData(positionManager, "positions", inputs, NEVER_RELOAD);

    const loading = useMemo(() => results.some(({ loading }) => loading), [results]);

    const { address: account } = useAccount();
    const prevAccount = usePrevious(account);

    // Process position data from results
    const [positions, uniqueTokenAddresses] = useMemo(() => {
        if (!stableTokenIds || stableTokenIds.length === 0) {
            return [stableTokenIds ? [] : undefined, []];
        }

        const processedPositions: PositionPool[] = [];
        const tokenAddresses = new Set<string>();

        results.forEach((call, i) => {
            if (i >= stableTokenIds.length) return; // Safety check

            const tokenId = stableTokenIds[i];
            if (call.valid && !call.loading && !call.error && call.result) {
                const positionData = call.result;
                try {
                    // Add token addresses to the set
                    const token0 = positionData[2];
                    const token1 = positionData[3];
                    if (token0) tokenAddresses.add(token0.toLowerCase());
                    if (token1) tokenAddresses.add(token1.toLowerCase());

                    processedPositions.push({
                        tokenId,
                        nonce: safeConvertToBigInt(positionData[0]),
                        operator: positionData[1],
                        token0: positionData[2],
                        token1: positionData[3],
                        fee: undefined,
                        tickLower: Number(positionData[4]),
                        tickUpper: Number(positionData[5]),
                        liquidity: safeConvertToBigInt(positionData[6]),
                        feeGrowthInside0LastX128: safeConvertToBigInt(positionData[7]),
                        feeGrowthInside1LastX128: safeConvertToBigInt(positionData[8]),
                        tokensOwed0: safeConvertToBigInt(positionData[9]),
                        tokensOwed1: safeConvertToBigInt(positionData[10]),
                    } as PositionPool);
                } catch (e) {
                    logger.error(`Error converting position data for tokenId ${tokenId}:`, e);
                }
            } else if (call.error) {
                logger.warn(`Error in call result for tokenId ${tokenId}:`, call.error);
            }
        });

        return [processedPositions, Array.from(tokenAddresses)];
    }, [stableTokenIds, results]);

    const prevPositions = usePreviousNonEmptyArray(positions || []);
    const prevTokenAddresses = usePrevious(uniqueTokenAddresses);

    // Handle changes in account or data
    return useMemo(() => {
        // When account changes, always use the new data
        if (prevAccount !== account) {
            return { loading, positions, uniqueTokenAddresses };
        }

        // If we have positions, use them
        if (positions && positions.length > 0) {
            return { loading, positions, uniqueTokenAddresses };
        }

        // If positions is empty but we're still loading, return loading state
        if (loading) {
            return { loading, positions, uniqueTokenAddresses: prevTokenAddresses };
        }

        // If no new positions but we had previous ones and tokenIds changed length
        if (stableTokenIds && prevPositions && stableTokenIds.length !== prevPositions.length && !loading) {
            return { loading: false, positions: [], uniqueTokenAddresses: [] };
        }

        // If no positions but we had previous ones, use previous
        if ((!positions || positions.length === 0) && prevPositions && prevPositions.length > 0 && !loading) {
            return { loading: false, positions: prevPositions, uniqueTokenAddresses: prevTokenAddresses || [] };
        }

        // Default fallback
        return { loading, positions, uniqueTokenAddresses };
    }, [loading, positions, uniqueTokenAddresses, account, prevAccount, prevPositions, prevTokenAddresses, stableTokenIds]);
}

interface UseV3PositionResults {
    loading: boolean;
    position: PositionPool | undefined;
    uniqueTokenAddresses: string[] | undefined;
}

export function useV3PositionFromTokenId(tokenId: bigint | undefined): UseV3PositionResults {
    const result = useV3PositionsFromTokenIds(tokenId ? [tokenId] : undefined);
    return {
        loading: result.loading,
        position: result.positions?.[0],
        uniqueTokenAddresses: result.uniqueTokenAddresses
    };
}

export function useV3Positions(passedAccount: string | null | undefined): UseV3PositionsResults {
    const positionManager = useV3NFTPositionManagerContract();
    const { address: currentConnectedAccount } = useAccount();
    const accountToUse = passedAccount ?? currentConnectedAccount;

    // Cache the previous account to detect changes
    const prevAccountRef = useRef<string | null | undefined>();

    // Get balance of NFT tokens
    const { loading: balanceLoading, result: balanceResult } = useSingleCallResult(
        positionManager,
        "balanceOf",
        [accountToUse ?? undefined],
        NEVER_RELOAD
    );

    const {
        fetchPositionsOnFarmer: { positionsOnFarmer: farmingPositionsData, fetchPositionsOnFarmerFn },
    } = useFarmingSubgraph();

    const accountBalance: number | undefined = balanceResult?.[0]
        ? Number(safeConvertToBigInt(balanceResult[0]))
        : undefined;

    // Fetch farming positions only when account changes to avoid unnecessary refreshes
    useEffect(() => {
        if (accountToUse && accountToUse !== prevAccountRef.current) {
            fetchPositionsOnFarmerFn(accountToUse);
            prevAccountRef.current = accountToUse;
        }
    }, [accountToUse, fetchPositionsOnFarmerFn]);

    // Create token request arguments
    const tokenIdsArgs = useMemo(() => {
        if (!accountBalance || !accountToUse) return [];

        const requests: Array<[string, number]> = [];
        for (let i = 0; i < accountBalance; i++) {
            requests.push([accountToUse, i]);
        }
        return requests;
    }, [accountToUse, accountBalance]);

    // Get token IDs owned by the account
    const tokenIdResults = useSingleContractMultipleData(
        positionManager,
        "tokenOfOwnerByIndex",
        tokenIdsArgs,
        NEVER_RELOAD
    );

    const someTokenIdsLoading = useMemo(
        () => tokenIdResults.some(({ loading }) => loading),
        [tokenIdResults]
    );

    // Process wallet token IDs
    const walletTokenIds = useMemo(() => {
        if (!accountToUse || !tokenIdResults.length) return [];

        return tokenIdResults
            .map(({ result }) => result)
            .filter((result): result is Result => !!result && result.length > 0 && result[0] !== undefined)
            .map((result) => safeConvertToBigInt(result[0]))
            .filter(id => id > 0n);
    }, [accountToUse, tokenIdResults]);

    // Get position details for wallet tokens
    const { positions, loading: positionsLoading, uniqueTokenAddresses: walletTokenAddresses } = useV3PositionsFromTokenIds(walletTokenIds);

    // Process transferred positions for farming
    const transferredTokenIds = useMemo(() => {
        if (!farmingPositionsData?.transferredPositionsIds) return [];

        try {
            return farmingPositionsData.transferredPositionsIds.map(id => safeConvertToBigInt(id));
        } catch (e) {
            logger.error("Error converting transferredPositionIds to BigInt:", e);
            return [];
        }
    }, [farmingPositionsData]);

    // Get position details for transferred tokens
    const { positions: farmingPositions, loading: farmingPositionsLoading, uniqueTokenAddresses: farmingTokenAddresses } =
        useV3PositionsFromTokenIds(transferredTokenIds);

    // Process old transferred positions
    const oldTransferredTokenIds = useMemo(() => {
        if (!farmingPositionsData?.oldTransferredPositionsIds) return [];

        try {
            return farmingPositionsData.oldTransferredPositionsIds.map(id => safeConvertToBigInt(id));
        } catch (e) {
            logger.error("Error converting oldTransferredPositionsIds to BigInt:", e);
            return [];
        }
    }, [farmingPositionsData]);

    // Get position details for old transferred tokens
    const { positions: oldFarmingPositions, loading: oldFarmingPositionsLoading, uniqueTokenAddresses: oldFarmingTokenAddresses } =
        useV3PositionsFromTokenIds(oldTransferredTokenIds);

    const prevCombinedPositionsRef = useRef<PositionPool[] | undefined>();

    // Create array of all unique token addresses from all positions
    const allUniqueTokenAddresses = useMemo(() => {
        const allAddresses = new Set<string>();

        // Add addresses from each source
        [walletTokenAddresses, farmingTokenAddresses, oldFarmingTokenAddresses].forEach(addresses => {
            if (addresses) {
                addresses.forEach(addr => allAddresses.add(addr));
            }
        });

        return Array.from(allAddresses);
    }, [walletTokenAddresses, farmingTokenAddresses, oldFarmingTokenAddresses]);

    // Combine all positions
    const combinedPositions = useMemo(() => {
        if (!positions && !farmingPositions && !oldFarmingPositions) {
            // If all inputs are undefined (e.g. initial load before any data), 
            // return undefined, or the previous state if it existed (to avoid flicker to empty)
            return prevCombinedPositionsRef.current === undefined ? undefined : prevCombinedPositionsRef.current;
        }

        const newCombined = [
            ...(positions || []),
            ...(farmingPositions || []).map(position => ({
                ...position,
                onFarming: true,
            })),
            ...(oldFarmingPositions || []).map(position => ({
                ...position,
                oldFarming: true,
            })),
        ].sort((a, b) => Number(a.tokenId) - Number(b.tokenId)); // Add sort for consistent ordering before deepEqual

        // Check if combined positions are the same as previous
        if (prevCombinedPositionsRef.current &&
            prevCombinedPositionsRef.current.length === newCombined.length &&
            deepEqual(prevCombinedPositionsRef.current, newCombined)) {
            return prevCombinedPositionsRef.current;
        }

        prevCombinedPositionsRef.current = newCombined;
        return newCombined;
    }, [
        positions,
        farmingPositions,
        oldFarmingPositions
    ]);

    return {
        loading: someTokenIdsLoading || balanceLoading || positionsLoading ||
            farmingPositionsLoading || oldFarmingPositionsLoading,
        positions: combinedPositions,
        uniqueTokenAddresses: allUniqueTokenAddresses
    };
}
