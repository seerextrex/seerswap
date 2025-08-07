import { isAddress } from "@ethersproject/address";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Frown, ChevronDown, ChevronUp } from "react-feather";
import { useFarmingHandlers } from "../../hooks/useFarmingHandlers";
import { useBatchRewardsClaiming } from "../../hooks/useBatchRewardsClaiming";
import { useAccount } from "wagmi";
import { useAllTransactions } from "../../state/transactions/hooks";
import Loader from "../Loader";
import Modal from "../Modal";
import { Deposit, RewardInterface, UnfarmingInterface, DefaultFarming, DefaultFarmingWithError } from "../../models/interfaces";
import { FarmingType } from "../../models/enums";
import { useLocation } from "react-router-dom";
import { useSortedRecentTransactions } from "../../hooks/useSortedRecentTransactions";
import { formatDollarAmount } from "../../utils/numbers";
import { formatReward } from "../../utils/formatReward";
import { Market, Token } from "../../state/data/generated";
import { detectConditionalMarketRelationship } from "../../utils/markets";
import { calculateFarmingPositionValue, calculateTotalFarmingValue } from "../../utils/farmingPositionSimpleSDK";
import "./index.scss";
import ModalBody from "./ModalBody";
import { Trans } from "@lingui/macro";
import { 
    TokenImage,
    MarketImage,
    PositionCard,
    useGroupedFarmingPositions,
    useOutcomeGrouping,
    useHierarchicalExpandState
} from "./components";

interface FarmingMyFarmsProps {
    data: Deposit[] | null;
    refreshing: boolean;
    now: number;
    fetchHandler: () => any;
}

export function FarmingMyFarms({ data, refreshing, now, fetchHandler }: FarmingMyFarmsProps) {
    const { address: account } = useAccount();

    const {
        getRewardsHash,
        transferNFTFromFarmingCenterHandler,
        eternalCollectRewardHandler,
        withdrawHandler,
        exitHandler,
        claimRewardsHandler,
        claimRewardHash,
        transferedHash,
        eternalCollectRewardHash,
        withdrawnHash,
    } = useFarmingHandlers() || {};

    const {
        executeBatchClaim,
        getClaimablePositions,
        getTotalClaimableRewards,
        batchClaimState,
        resetBatchClaimState,
        supports7702,
    } = useBatchRewardsClaiming();

    const [sendModal, setSendModal] = useState<string | null>(null);
    const [recipient, setRecipient] = useState<string>("");
    const [sending, setSending] = useState<UnfarmingInterface>({ id: null, state: null });
    const [shallowPositions, setShallowPositions] = useState<Deposit[] | null>(null);
    const [gettingReward, setGettingReward] = useState<RewardInterface>({ id: null, state: null, farmingType: null });
    const [eternalCollectReward, setEternalCollectReward] = useState<UnfarmingInterface>({ id: null, state: null });
    const [unfarming, setUnfarming] = useState<UnfarmingInterface>({ id: null, state: null });

    // Consolidated expand/collapse state management
    const expandState = useHierarchicalExpandState();

    const allTransactions = useAllTransactions();
    const sortedRecentTransactions = useSortedRecentTransactions();
    const { hash } = useLocation();

    const confirmed = useMemo(() => sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash), [sortedRecentTransactions, allTransactions]);

    const farmedNFTs = useMemo(() => {
        if (!shallowPositions) return;
        const _positions = shallowPositions.filter((v) => v.onFarmingCenter);
        return _positions.length > 0 ? _positions : [];
    }, [shallowPositions]);

    // Calculate claimable positions and total rewards
    const claimablePositions = useMemo(() => {
        if (!farmedNFTs) return [];
        return getClaimablePositions(farmedNFTs);
    }, [farmedNFTs, getClaimablePositions]);

    const totalClaimableRewards = useMemo(() => {
        if (!farmedNFTs) return 0;
        return getTotalClaimableRewards(farmedNFTs);
    }, [farmedNFTs, getTotalClaimableRewards]);
    
    // Calculate total portfolio value
    const totalPortfolioValue = useMemo(() => {
        if (!farmedNFTs) return 0;
        return calculateTotalFarmingValue(farmedNFTs);
    }, [farmedNFTs]);

    // Handle batch claim
    const handleBatchClaim = useCallback(async () => {
        if (!farmedNFTs || claimablePositions.length === 0) return;
        
        try {
            await executeBatchClaim(farmedNFTs);
        } catch (error) {
            console.error("Batch claim failed:", error);
        }
    }, [farmedNFTs, claimablePositions.length, executeBatchClaim]);


    // Use the grouped farming positions hook
    const { groupedPositions, sortedMarketKeys, sortBy, setSortBy } = useGroupedFarmingPositions({
        positions: farmedNFTs || null,
        isConditionalMarketPool: detectConditionalMarketRelationship,
    });

    // Initialize outcome grouping hook at the top level
    const { groupPositionsByOutcome: groupByOutcome } = useOutcomeGrouping({ 
        market: null // We'll pass the market when calling the function
    });

    // Delegate to consolidated state management
    const toggleMarket = expandState.toggleMarket;
    const toggleChildMarket = expandState.toggleChildMarket;
    const toggleOutcome = expandState.toggleOutcome;

    const toggleAllMarkets = () => {
        if (expandState.markets.expandedKeys.size === sortedMarketKeys.length) {
            // Collapse all
            expandState.collapseAllHierarchy();
        } else {
            // Expand all parent markets and child markets
            const allChildKeys: string[] = [];
            sortedMarketKeys.forEach(parentKey => {
                const parentGroup = groupedPositions[parentKey];
                if (parentGroup.isParent) {
                    Object.keys(parentGroup.childMarkets).forEach(childKey => {
                        allChildKeys.push(childKey);
                    });
                }
            });
            // Don't auto-expand outcomes to keep UI cleaner
            expandState.expandAllHierarchy(sortedMarketKeys, allChildKeys);
        }
    };



    const sendNFTHandler = useCallback(
        (v: Deposit) => {
            if (!isAddress(recipient) || recipient === account) {
                return;
            }
            if (transferNFTFromFarmingCenterHandler) {
                transferNFTFromFarmingCenterHandler(recipient, v.id);
                setSending({ id: v.id, state: "pending" });
            }
        },
        [recipient, account, transferNFTFromFarmingCenterHandler]
    );

    // PositionCard action handlers
    const handleUnfarm = useCallback((id: string) => {
        setUnfarming({ id, state: "pending" });
    }, []);

    const handleSendModal = useCallback((id: string) => {
        setSendModal(id);
    }, []);

    const handleCollectReward = useCallback((id: string, position: Deposit) => {
        setEternalCollectReward({ id, state: "pending" });
        if (eternalCollectRewardHandler) {
            eternalCollectRewardHandler(id, { ...position });
        }
    }, [eternalCollectRewardHandler]);

    const handleClaimRewards = useCallback((id: string, position: Deposit) => {
        setGettingReward({ id, state: "pending", farmingType: FarmingType.ETERNAL });
        if (claimRewardsHandler) {
            claimRewardsHandler(id, { ...position }, FarmingType.ETERNAL);
        }
    }, [claimRewardsHandler]);

    useEffect(() => {
        fetchHandler();
    }, [account]);

    useEffect(() => {
        setShallowPositions(data);
    }, [data]);

    useEffect(() => {
        if (!sending.state || sending.state !== 'pending' || !sending.id) return;

        if (typeof transferedHash === "string") {
            console.error("Send NFT Error (raw string from transferedHash):", transferedHash);
            setSending({ id: sending.id, state: "error" });
        } else if (transferedHash && typeof transferedHash === 'object' && 'hash' in transferedHash && transferedHash.hash && confirmed.includes(String(transferedHash.hash))) {
            if (transferedHash.id === sending.id) {
                setSending({ id: transferedHash.id, state: "done" });
                if (shallowPositions) {
                    setShallowPositions(shallowPositions.filter((el) => el.id !== transferedHash.id));
                }
            }
        } else if (transferedHash && typeof transferedHash === 'object' && 'error' in transferedHash && transferedHash.error && transferedHash.id === sending.id) {
            const errorObj = transferedHash as DefaultFarmingWithError;
            console.error("Send NFT Error (from transferedHash.error):", errorObj.error);
            setSending({ id: sending.id, state: "error" });
        }
    }, [transferedHash, confirmed, shallowPositions, sending.id, sending.state]);

    useEffect(() => {
        if (!eternalCollectReward.state) return;

        if (typeof eternalCollectRewardHash === "string") {
            setEternalCollectReward({ id: null, state: null });
        } else if (eternalCollectRewardHash && confirmed.includes(String(eternalCollectRewardHash.hash))) {
            setEternalCollectReward({ id: eternalCollectRewardHash.id, state: "done" });
            if (!shallowPositions) return;
            setShallowPositions(
                shallowPositions.map((el) => {
                    if (el.id === eternalCollectRewardHash.id) {
                        el.eternalEarned = 0;
                        el.eternalBonusEarned = 0;
                    }
                    return el;
                })
            );
        }
    }, [eternalCollectRewardHash, confirmed]);

    useEffect(() => {
        if (!unfarming.state) return;

        if (typeof withdrawnHash === "string") {
            setUnfarming({ id: null, state: null });
        } else if (withdrawnHash && confirmed.includes(String(withdrawnHash.hash))) {
            setUnfarming({ id: withdrawnHash.id, state: "done" });
            if (!shallowPositions) return;
            setShallowPositions(
                shallowPositions.map((el) => {
                    if (el.id === withdrawnHash.id) {
                        el.onFarmingCenter = false;
                    }
                    return el;
                })
            );
        }
    }, [withdrawnHash, confirmed]);

    useEffect(() => {
        if (!gettingReward.state) return;

        if (typeof claimRewardHash === "string") {
            setGettingReward({ id: null, state: null, farmingType: null });
        } else if (claimRewardHash && confirmed.includes(String(claimRewardHash.hash))) {
            setGettingReward({
                id: claimRewardHash.id,
                state: "done",
                farmingType: claimRewardHash.farmingType,
            });
            if (!shallowPositions) return;
            setShallowPositions(
                shallowPositions.map((el) => {
                    if (el.id === claimRewardHash.id) {
                        if (claimRewardHash.farmingType === FarmingType.LIMIT) {
                            el.limitFarming = null;
                        } else {
                            el.eternalFarming = null;
                        }
                    }
                    return el;
                })
            );
        }
    }, [claimRewardHash, confirmed]);

    useEffect(() => {
        if (!gettingReward.state) return;

        if (typeof getRewardsHash === "string") {
            setGettingReward({ id: null, state: null, farmingType: null });
        } else if (getRewardsHash && confirmed.includes(String(getRewardsHash.hash))) {
            setGettingReward({
                id: getRewardsHash.id,
                state: "done",
                farmingType: getRewardsHash.farmingType,
            });
            if (!shallowPositions) return;
            setShallowPositions(
                shallowPositions.map((el) => {
                    if (el.id === getRewardsHash.id) {
                        if (getRewardsHash.farmingType === FarmingType.LIMIT) {
                            el.limitFarming = null;
                        } else {
                            el.eternalFarming = null;
                        }
                    }
                    return el;
                })
            );
        }
    }, [getRewardsHash, confirmed]);

    // Handle batch claim success
    useEffect(() => {
        if (batchClaimState.hash && confirmed.includes(batchClaimState.hash)) {
            // Update positions to reflect claimed rewards
            if (shallowPositions) {
                const updatedPositions = shallowPositions.map((position) => {
                    if (getClaimablePositions([position]).length > 0) {
                        // Reset earned rewards for this position
                        return {
                            ...position,
                            eternalEarned: 0,
                            eternalBonusEarned: 0,
                            limitEarned: 0,
                            limitBonusEarned: 0,
                        };
                    }
                    return position;
                });
                setShallowPositions(updatedPositions);
            }
            // Reset batch claim state after successful confirmation
            resetBatchClaimState();
        }
    }, [batchClaimState.hash, confirmed, shallowPositions, getClaimablePositions, resetBatchClaimState]);

    return (
        <>
            <Modal
                isOpen={Boolean(sendModal)}
                onDismiss={() => {
                    if (sending.state !== "pending") {
                        setSendModal(null);
                        setRecipient("");
                        setTimeout(() => setSending({ id: null, state: null }));
                    }
                }}
            >
                <ModalBody
                    recipient={recipient}
                    setRecipient={setRecipient}
                    sendModal={sendModal}
                    sending={sending}
                    setSending={setSending}
                    sendNFTHandler={sendNFTHandler}
                    account={account ?? undefined}
                />
            </Modal>
            {refreshing || !shallowPositions ? (
                <div className={"my-farms__loader flex-s-between f-jc"}>
                    <Loader stroke={"white"} size={"1.5rem"} />
                </div>
            ) : shallowPositions && shallowPositions.length === 0 ? (
                <div className={"my-farms__loader flex-s-between f c f-jc"}>
                    <Frown size={35} stroke={"white"} />
                    <div className={"mt-1"}>
                        <Trans>No farms</Trans>
                    </div>
                </div>
            ) : shallowPositions && shallowPositions.length !== 0 ? (
                <>
                    {farmedNFTs && sortedMarketKeys.length > 0 ? (
                        <div className="my-farms__container">
                            {/* Portfolio summary */}
                            <div className="my-farms__portfolio-summary" style={{
                                padding: '1rem',
                                marginBottom: '1rem',
                                background: 'var(--bg2)',
                                borderRadius: '12px',
                                fontSize: '1.2rem',
                                fontWeight: '600'
                            }}>
                                <div>Total Portfolio Value: {formatDollarAmount(totalPortfolioValue)}</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: '400', marginTop: '0.5rem' }}>
                                    {farmedNFTs.length} farming position{farmedNFTs.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                            
                            {/* Batch claim controls */}
                            <div className="my-farms__batch-controls">
                                {claimablePositions.length > 0 && (
                                    <div className="my-farms__batch-claim-section">
                                        <div className="my-farms__batch-claim-info">
                                            <span className="my-farms__claimable-summary">
                                                {claimablePositions.length} position{claimablePositions.length !== 1 ? 's' : ''} with {formatReward(totalClaimableRewards)} SEER-LPP claimable
                                                {supports7702 && (
                                                    <span className="my-farms__eip7702-badge" title="EIP-7702 batch transactions supported">
                                                        ⚡ Batch Ready
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        <button
                                            className="my-farms__claim-all-btn btn primary"
                                            onClick={handleBatchClaim}
                                            disabled={batchClaimState.isLoading || claimablePositions.length === 0}
                                        >
                                            {batchClaimState.isLoading ? (
                                                <div className="f f-jc f-ac cg-05">
                                                    <Loader size="18px" stroke="var(--white)" />
                                                    <Trans>Claiming All...</Trans>
                                                </div>
                                            ) : (
                                                <Trans>Claim All Rewards</Trans>
                                            )}
                                        </button>
                                        {batchClaimState.error && (
                                            <div className="my-farms__error-message">
                                                {batchClaimState.error}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            {sortedMarketKeys.length > 1 && (
                                <div className="my-farms__controls">
                                    <div className="my-farms__sort-controls">
                                        <span className="my-farms__sort-label">Sort by:</span>
                                        <select
                                            className="my-farms__sort-select"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as 'name' | 'tvl' | 'positions' | 'rewards')}
                                        >
                                            <option value="tvl">TVL (Highest)</option>
                                            <option value="positions">Positions (Most)</option>
                                            <option value="rewards">Rewards Earned (Highest)</option>
                                            <option value="name">Name (A-Z)</option>
                                        </select>
                                    </div>
                                    <button
                                        className="my-farms__toggle-all"
                                        onClick={toggleAllMarkets}
                                    >
                                        {expandState.markets.expandedKeys.size === sortedMarketKeys.length ? (
                                            <>
                                                <ChevronUp size={16} />
                                                <Trans>Collapse All</Trans>
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown size={16} />
                                                <Trans>Expand All</Trans>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                            {sortedMarketKeys.map((marketKey) => {
                                const marketGroup = groupedPositions[marketKey];
                                const isExpanded = expandState.markets.isExpanded(marketKey);

                                return (
                                    <div key={marketKey} className="my-farms__market-group">
                                        <div
                                            className="my-farms__market-header"
                                            onClick={() => toggleMarket(marketKey)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    toggleMarket(marketKey);
                                                }
                                            }}
                                        >
                                            <div className="my-farms__market-info">
                                                <MarketImage
                                                    market={marketGroup.market}
                                                    marketName={marketGroup.marketName}
                                                />
                                                <div className="my-farms__market-text">
                                                    <h3 className="my-farms__market-title">
                                                        {marketGroup.marketName}
                                                        {marketGroup.isParent && Object.keys(marketGroup.childMarkets).length > 0 && (
                                                            <span className="my-farms__parent-market-badge">
                                                                <Trans>Parent Market</Trans>
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <span className="my-farms__market-count">
                                                        {(() => {
                                                            const directPositions = marketGroup.positions.length;
                                                            const childPositions = Object.values(marketGroup.childMarkets).reduce((sum: number, child: any) => sum + child.positions.length, 0);
                                                            const totalPositions = directPositions + childPositions;

                                                            if (marketGroup.isParent && childPositions > 0) {
                                                                return `${totalPositions} position${totalPositions !== 1 ? 's' : ''} (${directPositions} direct, ${childPositions} in child markets)`;
                                                            } else {
                                                                return `${directPositions} position${directPositions !== 1 ? 's' : ''}`;
                                                            }
                                                        })()}
                                                        <span className="my-farms__market-tvl" style={{ fontWeight: '600' }}>
                                                            • Value: {formatDollarAmount(marketGroup.totalTVL)}
                                                        </span>
                                                        <span className="my-farms__market-rewards">
                                                            • {formatReward(marketGroup.totalEarnedRewards)} SEER-LPP earned
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="my-farms__market-toggle">
                                                {isExpanded ? (
                                                    <ChevronUp size={20} />
                                                ) : (
                                                    <ChevronDown size={20} />
                                                )}
                                            </div>
                                        </div>
                                        <div className={`my-farms__market-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
                                            {/* Group and render positions by outcome */}
                                            {(() => {
                                                const outcomeGroups = groupByOutcome(marketGroup.positions, marketGroup.market);
                                                
                                                if (outcomeGroups.size === 0) {
                                                    return <div className="my-farms__no-positions"><Trans>No positions in this market</Trans></div>;
                                                }
                                                
                                                return Array.from(outcomeGroups.entries()).map(([outcomeId, outcomeData]) => {
                                                    const outcomeKey = `${marketKey}-outcome-${outcomeId}`;
                                                    const isOutcomeExpanded = expandState.outcomes.isExpanded(outcomeKey);
                                                    const totalOutcomeValue = calculateTotalFarmingValue(outcomeData.positions);
                                                    const totalOutcomeRewards = outcomeData.positions.reduce((sum, pos) => {
                                                        const eternalEarned = parseFloat(String(pos.eternalEarned || '0'));
                                                        const eternalBonusEarned = parseFloat(String(pos.eternalBonusEarned || '0'));
                                                        return sum + eternalEarned + eternalBonusEarned;
                                                    }, 0);
                                                    
                                                    return (
                                                        <div key={outcomeId} className="my-farms__outcome-group">
                                                            <div 
                                                                className="my-farms__outcome-header"
                                                                onClick={() => toggleOutcome(outcomeKey)}
                                                                role="button"
                                                                tabIndex={0}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                                        e.preventDefault();
                                                                        toggleOutcome(outcomeKey);
                                                                    }
                                                                }}
                                                            >
                                                                <div className="my-farms__outcome-info">
                                                                    <TokenImage 
                                                                        imageUrl={outcomeData.imageUrl} 
                                                                        tokenSymbol={outcomeData.name} 
                                                                        size={28} 
                                                                    />
                                                                    <span className="my-farms__outcome-name">{outcomeData.name}</span>
                                                                    <span className="my-farms__outcome-stats">
                                                                        {outcomeData.positions.length} position{outcomeData.positions.length !== 1 ? 's' : ''}
                                                                        <span style={{ fontWeight: '600' }}> • Value: {formatDollarAmount(totalOutcomeValue)}</span>
                                                                        {totalOutcomeRewards > 0 && (
                                                                            <span> • {formatReward(totalOutcomeRewards)} earned</span>
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="my-farms__outcome-toggle">
                                                                    {isOutcomeExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                                </div>
                                                            </div>
                                                            <div className={`my-farms__outcome-content ${isOutcomeExpanded ? 'expanded' : 'collapsed'}`}>
                                                                {outcomeData.positions.map((position, i) => (
                                                                    <PositionCard
                                                                        key={i}
                                                                        position={position}
                                                                        onUnfarm={handleUnfarm}
                                                                        onSendModal={handleSendModal}
                                                                        onCollectReward={handleCollectReward}
                                                                        onClaimRewards={handleClaimRewards}
                                                                        eternalCollectReward={eternalCollectReward}
                                                                        gettingReward={gettingReward}
                                                                        unfarming={unfarming}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                });
                                            })()}

                                            {/* Render child markets if this is a parent market */}
                                            {marketGroup.isParent && Object.keys(marketGroup.childMarkets).length > 0 && (
                                                <div className="my-farms__child-markets">
                                                    {Object.entries(marketGroup.childMarkets).map(([childKey, childGroup]: [string, any]) => {
                                                        const isChildExpanded = expandState.childMarkets.isExpanded(childKey);

                                                        return (
                                                            <div key={childKey} className="my-farms__child-market-group">
                                                                <div
                                                                    className="my-farms__child-market-header"
                                                                    onClick={() => toggleChildMarket(childKey)}
                                                                    role="button"
                                                                    tabIndex={0}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                                            e.preventDefault();
                                                                            toggleChildMarket(childKey);
                                                                        }
                                                                    }}
                                                                >
                                                                    <div className="my-farms__child-market-info">
                                                                        <MarketImage
                                                                            market={childGroup.market}
                                                                            marketName={childGroup.marketName}
                                                                        />
                                                                        <div className="my-farms__child-market-text">
                                                                            <h4 className="my-farms__child-market-title">
                                                                                {childGroup.marketName}
                                                                                <span className="my-farms__child-market-badge">
                                                                                    <Trans>Child Market</Trans>
                                                                                </span>
                                                                            </h4>
                                                                            <span className="my-farms__child-market-count">
                                                                                {childGroup.positions.length} position{childGroup.positions.length !== 1 ? 's' : ''}
                                                                                <span className="my-farms__child-market-tvl" style={{ fontWeight: '600' }}>
                                                                                    • Value: {formatDollarAmount(childGroup.totalTVL)}
                                                                                </span>
                                                                                <span className="my-farms__child-market-rewards">
                                                                                    • {formatReward(childGroup.totalEarnedRewards)} SEER-LPP earned
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="my-farms__child-market-toggle">
                                                                        {isChildExpanded ? (
                                                                            <ChevronUp size={16} />
                                                                        ) : (
                                                                            <ChevronDown size={16} />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className={`my-farms__child-market-content ${isChildExpanded ? 'expanded' : 'collapsed'}`}>
                                                                    {(() => {
                                                                        const outcomeGroups = groupByOutcome(childGroup.positions, childGroup.market, marketGroup.market);
                                                                        
                                                                        if (outcomeGroups.size === 0) {
                                                                            return <div className="my-farms__no-positions"><Trans>No positions in this child market</Trans></div>;
                                                                        }
                                                                        
                                                                        return Array.from(outcomeGroups.entries()).map(([outcomeId, outcomeData]) => {
                                                                            const outcomeKey = `${childKey}-outcome-${outcomeId}`;
                                                                            const isOutcomeExpanded = expandState.outcomes.isExpanded(outcomeKey);
                                                                            const totalOutcomeValue = calculateTotalFarmingValue(outcomeData.positions);
                                                                            const totalOutcomeRewards = outcomeData.positions.reduce((sum, pos) => {
                                                                                const eternalEarned = parseFloat(String(pos.eternalEarned || '0'));
                                                                                const eternalBonusEarned = parseFloat(String(pos.eternalBonusEarned || '0'));
                                                                                return sum + eternalEarned + eternalBonusEarned;
                                                                            }, 0);
                                                                            
                                                                            return (
                                                                                <div key={outcomeId} className="my-farms__outcome-group">
                                                                                    <div 
                                                                                        className="my-farms__outcome-header"
                                                                                        onClick={() => toggleOutcome(outcomeKey)}
                                                                                        role="button"
                                                                                        tabIndex={0}
                                                                                        onKeyDown={(e) => {
                                                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                                                e.preventDefault();
                                                                                                toggleOutcome(outcomeKey);
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        <div className="my-farms__outcome-info">
                                                                                            <TokenImage 
                                                                                                imageUrl={outcomeData.imageUrl} 
                                                                                                tokenSymbol={outcomeData.name} 
                                                                                                size={28} 
                                                                                            />
                                                                                            <span className="my-farms__outcome-name">{outcomeData.name}</span>
                                                                                            <span className="my-farms__outcome-stats">
                                                                                                {outcomeData.positions.length} position{outcomeData.positions.length !== 1 ? 's' : ''}
                                                                                                <span style={{ fontWeight: '600' }}> • Value: {formatDollarAmount(totalOutcomeValue)}</span>
                                                                                                {totalOutcomeRewards > 0 && (
                                                                                                    <span> • {formatReward(totalOutcomeRewards)} earned</span>
                                                                                                )}
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="my-farms__outcome-toggle">
                                                                                            {isOutcomeExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className={`my-farms__outcome-content ${isOutcomeExpanded ? 'expanded' : 'collapsed'}`}>
                                                                                        {outcomeData.positions.map((position, i) => (
                                                                                            <PositionCard
                                                                                                key={i}
                                                                                                position={position}
                                                                                                parentMarket={marketGroup.market}
                                                                                                onUnfarm={handleUnfarm}
                                                                                                onSendModal={handleSendModal}
                                                                                                onCollectReward={handleCollectReward}
                                                                                                onClaimRewards={handleClaimRewards}
                                                                                                eternalCollectReward={eternalCollectReward}
                                                                                                gettingReward={gettingReward}
                                                                                                unfarming={unfarming}
                                                                                            />
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        });
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : farmedNFTs && farmedNFTs.length > 0 ? (
                        // Fallback: render positions ungrouped if no market data
                        <div>
                            {farmedNFTs.map((position, i) => (
                                <PositionCard
                                    key={i}
                                    position={position}
                                    onUnfarm={handleUnfarm}
                                    onSendModal={handleSendModal}
                                    onCollectReward={handleCollectReward}
                                    onClaimRewards={handleClaimRewards}
                                    eternalCollectReward={eternalCollectReward}
                                    gettingReward={gettingReward}
                                    unfarming={unfarming}
                                />
                            ))}
                        </div>
                    ) : null}
                </>
            ) : null}
        </>
    );
}
