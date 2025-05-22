import { Result, useSingleCallResult, useSingleContractMultipleData, NEVER_RELOAD } from "state/multicall/hooks";
import { useEffect, useMemo, useRef, useCallback } from "react";
import { useV3NFTPositionManagerContract } from "./useContract";
import { useFarmingSubgraph } from "./useFarmingSubgraph";
import { PositionPool } from "../models/interfaces";
import usePrevious, { usePreviousNonEmptyArray } from "./usePrevious";
import { useAccount } from 'wagmi';
import { safeConvertToBigInt, deepEqual, createStableBigIntArray } from "../utils/bigintUtils";

// Production-mode logger that only logs in development
const logger = {
    debug: (process.env.NODE_ENV === 'development')
        ? (...args: any[]) => console.debug(...args)
        : () => { },
    warn: (...args: any[]) => console.warn(...args),
    error: (...args: any[]) => console.error(...args),
};

interface UseV3PositionsResults {
    loading: boolean;
    positions: PositionPool[] | undefined;
}

function useV3PositionsFromTokenIds(tokenIds: bigint[] | undefined): UseV3PositionsResults {
    const positionManager = useV3NFTPositionManagerContract();
    const inputs = useMemo(() => (tokenIds ? tokenIds.map((tokenId) => [tokenId.toString()]) : []), [tokenIds]);
    const results = useSingleContractMultipleData(positionManager, "positions", inputs, NEVER_RELOAD);

    const loading = useMemo(() => results.some(({ loading }) => loading), [results]);

    const { address: account } = useAccount();
    const prevAccount = usePrevious(account);

    // Process position data from results
    const positions = useMemo(() => {
        if (!tokenIds || tokenIds.length === 0) {
            return tokenIds ? [] : undefined;
        }

        const processedPositions: PositionPool[] = [];

        results.forEach((call, i) => {
            if (i >= tokenIds.length) return; // Safety check

            const tokenId = tokenIds[i];
            if (call.valid && !call.loading && !call.error && call.result) {
                const positionData = call.result;
                try {
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

        return processedPositions;
    }, [tokenIds, results]);

    const prevPositions = usePreviousNonEmptyArray(positions || []);

    // Handle changes in account or data
    return useMemo(() => {
        // When account changes, always use the new data
        if (prevAccount !== account) {
            return { loading, positions };
        }

        // If we have positions, use them
        if (positions && positions.length > 0) {
            return { loading, positions };
        }

        // If positions is empty but we're still loading, return loading state
        if (loading) {
            return { loading, positions };
        }

        // If no new positions but we had previous ones and tokenIds changed length
        if (tokenIds && prevPositions && tokenIds.length !== prevPositions.length && !loading) {
            return { loading: false, positions: [] };
        }

        // If no positions but we had previous ones, use previous
        if ((!positions || positions.length === 0) && prevPositions && prevPositions.length > 0 && !loading) {
            return { loading: false, positions: prevPositions };
        }

        // Default fallback
        return { loading, positions };
    }, [loading, positions, account, prevAccount, prevPositions, tokenIds?.length]);
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
    const { address: currentConnectedAccount } = useAccount();
    const accountToUse = passedAccount ?? currentConnectedAccount;

    // Get balance of NFT tokens
    const { loading: balanceLoading, result: balanceResult } = useSingleCallResult(
        positionManager,
        "balanceOf",
        [accountToUse ?? undefined],
        { blocksPerFetch: 3 }
    );

    const {
        fetchPositionsOnFarmer: { positionsOnFarmer: farmingPositionsData, positionsOnFarmerLoading, fetchPositionsOnFarmerFn },
    } = useFarmingSubgraph();

    const accountBalance: number | undefined = balanceResult?.[0]
        ? Number(safeConvertToBigInt(balanceResult[0]))
        : undefined;

    // Fetch farming positions
    useEffect(() => {
        if (accountToUse) {
            fetchPositionsOnFarmerFn(accountToUse);
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
    const { positions, loading: positionsLoading } = useV3PositionsFromTokenIds(walletTokenIds);

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
    const { positions: farmingPositions, loading: farmingPositionsLoading } =
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
    const { positions: oldFarmingPositions, loading: oldFarmingPositionsLoading } =
        useV3PositionsFromTokenIds(oldTransferredTokenIds);

    // Combine all positions
    const combinedPositions = useMemo(() => {
        if (!positions && !farmingPositions && !oldFarmingPositions) {
            return undefined;
        }

        return [
            ...(positions || []),
            ...(farmingPositions || []).map(position => ({
                ...position,
                onFarming: true,
            })),
            ...(oldFarmingPositions || []).map(position => ({
                ...position,
                oldFarming: true,
            })),
        ];
    }, [
        positions,
        farmingPositions,
        oldFarmingPositions
    ]);

    return {
        loading: someTokenIdsLoading || balanceLoading || positionsLoading ||
            farmingPositionsLoading || oldFarmingPositionsLoading,
        positions: combinedPositions,
    };
}
