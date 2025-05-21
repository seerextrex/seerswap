import { Result, useSingleCallResult, useSingleContractMultipleData, NEVER_RELOAD } from "state/multicall/hooks";
import { useEffect, useMemo, useRef } from "react";
import { useV3NFTPositionManagerContract } from "./useContract";
import { useFarmingSubgraph } from "./useFarmingSubgraph";
import { PositionPool } from "../models/interfaces";
import usePrevious, { usePreviousNonEmptyArray } from "./usePrevious";
import { useAccount } from 'wagmi';

interface UseV3PositionsResults {
    loading: boolean;
    positions: PositionPool[] | undefined;
}

// Helper to safely convert a value that might be an ethers v5 BigNumber to bigint
function toBigInt(value: any): bigint {
    if (typeof value === 'bigint') {
        return value;
    }
    if (value && typeof value.toString === 'function') { // Check for ethers v5 BigNumber like object
        try {
            return BigInt(value.toString());
        } catch (e) {
            console.warn("Failed to convert value to BigInt:", value, e);
            throw new Error("Invalid value for BigInt conversion");
        }
    }
    // If it's already a number string or number, BigInt constructor can handle it
    try {
        return BigInt(value);
    } catch (e) {
        console.warn("Failed to convert value to BigInt directly:", value, e);
        throw new Error("Invalid value for BigInt conversion");
    }
}

function useV3PositionsFromTokenIds(tokenIds: bigint[] | undefined): UseV3PositionsResults {
    const positionManager = useV3NFTPositionManagerContract();
    const inputs = useMemo(() => (tokenIds ? tokenIds.map((tokenId) => [tokenId.toString()]) : []), [tokenIds]);
    const results = useSingleContractMultipleData(positionManager, "positions", inputs, NEVER_RELOAD);

    console.log("[useV3PositionsFromTokenIds] Raw multicall results:", JSON.stringify(results, (key, value) => typeof value === 'bigint' ? value.toString() : value)); // Log raw results

    const loading = useMemo(() => results.some(({ loading }) => loading), [results]);
    const error = useMemo(() => results.some(({ error }) => error), [results]);

    const { address: account } = useAccount();
    const prevAccount = usePrevious(account);

    const stablePositionsRef = useRef<PositionPool[] | undefined>(undefined);

    useMemo(() => {
        let newProcessedPositions: PositionPool[] | undefined = undefined; // Start as undefined

        const resultsAreValid = results.every(call => call.result && call.valid && !call.loading && !call.error);

        if (tokenIds && tokenIds.length > 0) {
            if (!loading && !error && resultsAreValid) {
                // Data is loaded, not in error, and results are valid
                newProcessedPositions = results.map((call, i) => {
                    const tokenId = tokenIds[i];
                    const result = call.result as any;
                    try {
                        return {
                            tokenId,
                            nonce: toBigInt(result[0]),
                            operator: result[1],
                            token0: result[2],
                            token1: result[3],
                            fee: undefined,
                            tickLower: Number(result[4]),
                            tickUpper: Number(result[5]),
                            liquidity: toBigInt(result[6]),
                            feeGrowthInside0LastX128: toBigInt(result[7]),
                            feeGrowthInside1LastX128: toBigInt(result[8]),
                            tokensOwed0: toBigInt(result[9]),
                            tokensOwed1: toBigInt(result[10]),
                        } as PositionPool;
                    } catch (e) {
                        console.error(`[useV3PositionsFromTokenIds] Error converting data for tokenId ${tokenId}:`, e, 'Raw result:', JSON.stringify(result, (key, value) => typeof value === 'bigint' ? value.toString() : value));
                        return null;
                    }
                }).filter(p => p !== null) as PositionPool[];
            } else {
                // Still loading for these tokenIds, or there was an error
                // newProcessedPositions remains undefined
            }
        } else if (tokenIds && tokenIds.length === 0) {
            // Explicitly no token IDs, so positions should be empty array
            newProcessedPositions = [];
        }
        // If tokenIds is undefined (e.g. initial state), newProcessedPositions also remains undefined.

        // Only update the ref if the new state (even if undefined) is different from the current stable state
        const currentStableString = JSON.stringify(stablePositionsRef.current, (k, v) => typeof v === 'bigint' ? v.toString() : v);
        const newProcessedString = JSON.stringify(newProcessedPositions, (k, v) => typeof v === 'bigint' ? v.toString() : v);

        if (currentStableString !== newProcessedString) {
            stablePositionsRef.current = newProcessedPositions;
        }
    }, [loading, error, results, tokenIds]);

    const positions = stablePositionsRef.current;
    const prevPositions = usePreviousNonEmptyArray(positions || []);

    // console.log("[useV3PositionsFromTokenIds] Returning loading:", loading, "Returning positions:", JSON.stringify(positions, (key, value) => typeof value === 'bigint' ? value.toString() : value) );

    // This complex memoization logic for prevPositions might need review after bigint changes
    // For now, focusing on type compatibility.
    return useMemo(() => {
        // const mapToBigIntTokenId = (pos: PositionPool) => ({ ...pos, tokenId: BigInt(pos.tokenId) }); // Redundant

        if (prevAccount !== account) // Account changed, return current data for new account
            return {
                loading,
                positions: positions,
            };

        // This condition means we have new positions, and there were no previous ones, or data is loading.
        // So, return the new current positions.
        if (!prevPositions && positions || (positions && loading))
            return {
                loading,
                positions: positions,
            };

        // If tokenIds (which drives inputs) implies a different set than prevPositions, and we aren't loading new ones yet.
        // This case is tricky. If tokenIds is empty or different, and positions is not yet updated, what to show?
        // The original logic returned [], which might be correct if a filter changed.
        if (tokenIds && prevPositions && tokenIds.length !== prevPositions.length && !loading) // Only if not loading new ones
            return {
                loading: false, // Not loading because tokenIds changed, but results for *new* tokenIds aren't in yet.
                positions: [],
            };

        // If current positions are empty, but we had previous ones, and not loading new ones.
        // This implies positions were removed.
        if ((!positions || positions.length === 0) && prevPositions && prevPositions.length !== 0 && !loading)
            return {
                loading: false, // Not loading because current positions are empty.
                positions: prevPositions,
            };

        // Default case: return current data.
        return {
            loading,
            positions: positions,
        };
        // Simpler dependency array: re-run if loading state changes, or the actual positions data reference changes, or account context changes.
    }, [loading, positions, account, prevAccount, prevPositions, tokenIds]); // Added prevPositions and tokenIds back for specific conditions
}

interface UseV3PositionResults {
    loading: boolean;
    position: PositionPool | undefined;
}

export function useV3PositionFromTokenId(tokenId: bigint | undefined): UseV3PositionResults {
    const result = useV3PositionsFromTokenIds(tokenId ? [tokenId] : undefined);
    return {
        loading: result.loading,
        position: result.positions?.[0],
    };
}

export function useV3Positions(passedAccount: string | null | undefined): UseV3PositionsResults {
    const positionManager = useV3NFTPositionManagerContract();
    const { address: currentConnectedAccount } = useAccount(); // Use wagmi for connected account if passedAccount is not primary
    const accountToUse = passedAccount ?? currentConnectedAccount;

    const { loading: balanceLoading, result: balanceResult } = useSingleCallResult(positionManager, "balanceOf", [accountToUse ?? undefined], { blocksPerFetch: 3 });

    const {
        fetchPositionsOnFarmer: { positionsOnFarmer, positionsOnFarmerLoading, fetchPositionsOnFarmerFn },
    } = useFarmingSubgraph();

    const accountBalance: number | undefined = balanceResult?.[0] ? Number(toBigInt(balanceResult[0])) : undefined;

    useEffect(() => {
        if (accountToUse) {
            fetchPositionsOnFarmerFn(accountToUse);
        }
    }, [accountToUse, fetchPositionsOnFarmerFn]);

    const tokenIdsArgs = useMemo(() => {
        if (accountBalance && accountToUse) {
            const tokenRequests: any[] = [];
            for (let i = 0; i < accountBalance; i++) {
                tokenRequests.push([accountToUse, i]);
            }
            return tokenRequests;
        }
        return [];
    }, [accountToUse, accountBalance]);

    const tokenIdResults = useSingleContractMultipleData(positionManager, "tokenOfOwnerByIndex", tokenIdsArgs, NEVER_RELOAD);
    const someTokenIdsLoading = useMemo(() => tokenIdResults.some(({ loading }) => loading), [tokenIdResults]);

    const stableWalletTokenIdsRef = useRef<bigint[]>([]); // Ref for stable wallet token IDs

    useMemo(() => {
        let newWalletTokenIds: bigint[] = [];
        if (accountToUse && tokenIdResults && tokenIdResults.length > 0) {
            newWalletTokenIds = tokenIdResults
                .map(({ result }) => result)
                .filter((result): result is Result => !!result && result.length > 0 && result[0] !== undefined) // Ensure result and result[0] are valid
                .map((result) => toBigInt(result[0]))
                .filter(id => id > 0n); // Ensure IDs are positive, matching original filter in useTokensOfOwnerByIndex if it existed
        }

        // Only update the ref if the content has actually changed
        if (
            newWalletTokenIds.length !== stableWalletTokenIdsRef.current.length ||
            newWalletTokenIds.some((id, index) => id !== stableWalletTokenIdsRef.current[index])
        ) {
            stableWalletTokenIdsRef.current = newWalletTokenIds;
        }
    }, [accountToUse, tokenIdResults]); // Dependencies for calculating newWalletTokenIds

    const walletTokenIds = stableWalletTokenIdsRef.current; // Use the stable ref value

    const { positions, loading: positionsLoading } = useV3PositionsFromTokenIds(walletTokenIds); // Use stable walletTokenIds

    console.log("[useV3Positions] positionsOnFarmer from subgraph hook:", positionsOnFarmer); // LOG 1

    const stableTransferredTokenIdsRef = useRef<bigint[]>([]);
    useMemo(() => {
        let newTransferredTokenIds: bigint[] = [];
        if (positionsOnFarmer && positionsOnFarmer.transferredPositionsIds) {
            try {
                newTransferredTokenIds = positionsOnFarmer.transferredPositionsIds.map(id => toBigInt(id));
                console.log("[useV3Positions] Parsed transferredTokenIds (bigint):", newTransferredTokenIds); // LOG 2
            } catch (e) {
                console.error("[useV3Positions] Error converting transferredPositionIds to BigInt:", e);
                // newTransferredTokenIds remains []
            }
        }
        if (newTransferredTokenIds.length !== stableTransferredTokenIdsRef.current.length ||
            newTransferredTokenIds.some((id, index) => id !== stableTransferredTokenIdsRef.current[index])) {
            stableTransferredTokenIdsRef.current = newTransferredTokenIds;
        }
    }, [positionsOnFarmer]);
    const transferredTokenIds = stableTransferredTokenIdsRef.current;

    const { positions: _positionsOnFarmer, loading: _positionsOnFarmerLoading } = useV3PositionsFromTokenIds(transferredTokenIds);

    console.log("[useV3Positions] _positionsOnFarmer (details for farmed token IDs):", _positionsOnFarmer); // LOG 3

    const stableOldTransferredTokenIdsRef = useRef<bigint[]>([]);
    useMemo(() => {
        let newOldTransferredTokenIds: bigint[] = [];
        if (positionsOnFarmer && positionsOnFarmer.oldTransferredPositionsIds) {
            try {
                newOldTransferredTokenIds = positionsOnFarmer.oldTransferredPositionsIds.map(id => toBigInt(id));
            } catch (e) {
                console.error("[useV3Positions] Error converting oldTransferredPositionsIds to BigInt:", e);
                // newOldTransferredTokenIds remains []
            }
        }
        if (newOldTransferredTokenIds.length !== stableOldTransferredTokenIdsRef.current.length ||
            newOldTransferredTokenIds.some((id, index) => id !== stableOldTransferredTokenIdsRef.current[index])) {
            stableOldTransferredTokenIdsRef.current = newOldTransferredTokenIds;
        }
    }, [positionsOnFarmer]);
    const oldTransferredTokenIds = stableOldTransferredTokenIdsRef.current;

    const { positions: _positionsOnOldFarmer, loading: _positionsOnOldFarmerLoading } = useV3PositionsFromTokenIds(oldTransferredTokenIds);

    const stableCombinedPositionsRef = useRef<PositionPool[] | undefined>(undefined);

    useMemo(() => {
        let newCombinedPositions: PositionPool[] | undefined = undefined;
        if (positions && _positionsOnFarmer && _positionsOnOldFarmer) {
            newCombinedPositions = [
                ...positions, // Assuming positions itself is stable from useV3PositionsFromTokenIds
                ..._positionsOnFarmer.map((position) => ({
                    ...position,
                    onFarming: true,
                })),
                ..._positionsOnOldFarmer.map((position) => ({
                    ...position,
                    oldFarming: true,
                })),
            ];
        }

        const currentStableCombined = stableCombinedPositionsRef.current;
        let hasChanged = false;
        if (newCombinedPositions === undefined && currentStableCombined !== undefined) {
            hasChanged = true;
        } else if (newCombinedPositions !== undefined && currentStableCombined === undefined) {
            hasChanged = true;
        } else if (newCombinedPositions && currentStableCombined) {
            if (newCombinedPositions.length !== currentStableCombined.length) {
                hasChanged = true;
            } else {
                const replacer = (key: string, value: any) => typeof value === 'bigint' ? value.toString() : value;
                for (let i = 0; i < newCombinedPositions.length; i++) {
                    // Comparing stringified versions. For full safety, a proper deep-equal library might be better
                    // if PositionPool objects become more complex or contain functions.
                    if (JSON.stringify(newCombinedPositions[i], replacer) !== JSON.stringify(currentStableCombined[i], replacer)) {
                        hasChanged = true;
                        break;
                    }
                }
            }
        }

        if (hasChanged) {
            console.log("[useV3Positions] combinedPositions changed, updating stableCombinedPositionsRef");
            stableCombinedPositionsRef.current = newCombinedPositions;
        } else {
            // console.log("[useV3Positions] combinedPositions content same, not updating stableCombinedPositionsRef");
        }
    }, [positions, _positionsOnFarmer, _positionsOnOldFarmer]);

    const combinedPositions = stableCombinedPositionsRef.current;

    return {
        loading: someTokenIdsLoading || balanceLoading || positionsLoading || _positionsOnFarmerLoading || _positionsOnOldFarmerLoading,
        positions: combinedPositions,
    };
}
