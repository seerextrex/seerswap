import { isAddress } from "@ethersproject/address";
import React, { useCallback, useEffect, useMemo, useState, memo } from "react";
import { Frown, ChevronDown, ChevronUp } from "react-feather";
import { useFarmingHandlers } from "../../hooks/useFarmingHandlers";
import { useAccount } from "wagmi";
import { useAllTransactions } from "../../state/transactions/hooks";
import Loader from "../Loader";
import Modal from "../Modal";
import { Deposit, RewardInterface, UnfarmingInterface, DefaultFarming, DefaultFarmingWithError } from "../../models/interfaces";
import { FarmingType } from "../../models/enums";
import { getCountdownTime } from "../../utils/time";
import { getProgress } from "../../utils/getProgress";
import { CheckOut } from "./CheckOut";
import { Link, useLocation } from "react-router-dom";
import { useSortedRecentTransactions } from "../../hooks/useSortedRecentTransactions";
import { formatDollarAmount } from "../../utils/numbers";
import { Market, Image } from "../../state/data/generated";
import SDAI_LOGO from "../../assets/images/sdai-logo.svg";
import "./index.scss";
import ModalBody from "./ModalBody";
import PositionHeader from "./PositionHeader";
import PositionCardBodyHeader from "./PositionCardBodyHeader";
import PositionCardBodyStat from "./PositionCardBodyStat";
import { t, Trans } from "@lingui/macro";

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

    const [sendModal, setSendModal] = useState<string | null>(null);
    const [recipient, setRecipient] = useState<string>("");
    const [sending, setSending] = useState<UnfarmingInterface>({ id: null, state: null });
    const [shallowPositions, setShallowPositions] = useState<Deposit[] | null>(null);
    const [gettingReward, setGettingReward] = useState<RewardInterface>({ id: null, state: null, farmingType: null });
    const [eternalCollectReward, setEternalCollectReward] = useState<UnfarmingInterface>({ id: null, state: null });
    const [unfarming, setUnfarming] = useState<UnfarmingInterface>({ id: null, state: null });

    // Market grouping state
    const [expandedMarkets, setExpandedMarkets] = useState<Set<string>>(new Set());
    const [sortBy, setSortBy] = useState<'name' | 'tvl' | 'positions'>('tvl');

    const allTransactions = useAllTransactions();
    const sortedRecentTransactions = useSortedRecentTransactions();
    const { hash } = useLocation();

    const confirmed = useMemo(() => sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash), [sortedRecentTransactions, allTransactions]);

    const farmedNFTs = useMemo(() => {
        if (!shallowPositions) return;
        const _positions = shallowPositions.filter((v) => v.onFarmingCenter);
        return _positions.length > 0 ? _positions : [];
    }, [shallowPositions]);

    // Group positions by market
    const groupedPositions = useMemo(() => {
        if (!farmedNFTs || farmedNFTs.length === 0) return {};

        const poolTVLMap = new Map<string, number>(); // Track unique pool TVLs

        const groups = farmedNFTs.reduce((groups: any, position: any) => {
            const marketName = position.pool?.market0?.marketName || 'Unknown Market';
            const marketId = position.pool?.market0?.id || 'unknown';
            const marketKey = `${marketId}-${marketName}`;

            if (!groups[marketKey]) {
                groups[marketKey] = {
                    marketName,
                    marketId,
                    market: position.pool?.market0 as Market | undefined,
                    positions: [],
                    poolIds: new Set<string>()
                };
            }

            groups[marketKey].positions.push(position);

            // Track unique pools for TVL calculation
            const poolId = position.pool?.id;
            if (poolId && !groups[marketKey].poolIds.has(poolId)) {
                groups[marketKey].poolIds.add(poolId);
                const poolTVL = parseFloat(position.pool?.totalValueLockedUSD || '0');
                if (poolTVL > 0) {
                    poolTVLMap.set(poolId, poolTVL);
                }
            }

            return groups;
        }, {});

        // Calculate total TVL for each market
        Object.values(groups).forEach((group: any) => {
            group.totalTVL = Array.from(group.poolIds).reduce((total: number, poolId) => {
                return total + (poolTVLMap.get(poolId as string) || 0);
            }, 0);
            // Remove the poolIds set as we don't need it in the final object
            delete group.poolIds;
        });

        return groups;
    }, [farmedNFTs]);

    const sortedMarketKeys = useMemo(() => {
        const keys = Object.keys(groupedPositions).sort((a, b) => {
            const marketA = groupedPositions[a];
            const marketB = groupedPositions[b];

            // Always put "Unknown Market" at the end regardless of sort criteria
            if (marketA.marketName === 'Unknown Market' && marketB.marketName !== 'Unknown Market') return 1;
            if (marketA.marketName !== 'Unknown Market' && marketB.marketName === 'Unknown Market') return -1;

            switch (sortBy) {
                case 'tvl':
                    // Sort by TVL (descending - highest first)
                    return (marketB.totalTVL || 0) - (marketA.totalTVL || 0);

                case 'positions':
                    // Sort by number of positions (descending - most first)
                    return (marketB.positions?.length || 0) - (marketA.positions?.length || 0);

                case 'name':
                default:
                    // Sort alphabetically by name
                    return marketA.marketName.localeCompare(marketB.marketName);
            }
        });

        return keys;
    }, [groupedPositions, sortBy]);

    const toggleMarket = (marketKey: string) => {
        const newExpanded = new Set(expandedMarkets);
        if (newExpanded.has(marketKey)) {
            newExpanded.delete(marketKey);
        } else {
            newExpanded.add(marketKey);
        }
        setExpandedMarkets(newExpanded);
    };

    const toggleAllMarkets = () => {
        if (expandedMarkets.size === sortedMarketKeys.length) {
            // Collapse all
            setExpandedMarkets(new Set());
        } else {
            // Expand all
            setExpandedMarkets(new Set(sortedMarketKeys));
        }
    };

    // Token Image Component
    const TokenImage = memo(({ imageUrl, tokenSymbol, size = 24 }: { imageUrl: string | null; tokenSymbol: string; size?: number }) => {
        const [hasError, setHasError] = useState(false);

        const handleImageError = useCallback(() => {
            setHasError(true);
        }, []);

        const handleImageLoad = useCallback(() => {
            setHasError(false);
        }, []);

        // Special case for sDAI token
        if (tokenSymbol === 'sDAI') {
            return (
                <div className="token-image-container" style={{ width: size, height: size }}>
                    <img
                        src={SDAI_LOGO}
                        alt={tokenSymbol}
                        className="token-image"
                        style={{ width: size, height: size }}
                    />
                </div>
            );
        }

        if (!imageUrl || hasError) {
            return (
                <div
                    className="token-image-placeholder"
                    style={{ width: size, height: size, fontSize: Math.max(8, size * 0.4) }}
                >
                    {tokenSymbol.slice(0, 2).toUpperCase()}
                </div>
            );
        }

        return (
            <div className="token-image-container" style={{ width: size, height: size }}>
                <img
                    src={imageUrl}
                    alt={tokenSymbol}
                    className="token-image"
                    style={{ width: size, height: size }}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                />
            </div>
        );
    });

    // Market Image Component
    const MarketImage = memo(({ market, marketName }: { market: any; marketName: string }) => {
        const [hasError, setHasError] = useState(false);

        const marketImageUrl = useMemo(() => {
            if (!market?.image?.[0]?.cidMarket) return null;
            return `https://ipfs.io${market.image[0].cidMarket}`;
        }, [market?.image]);

        const handleImageError = useCallback(() => {
            setHasError(true);
        }, []);

        if (!marketImageUrl || hasError) {
            return (
                <div className="my-farms__market-image-placeholder">
                    {marketName.slice(0, 1).toUpperCase()}
                </div>
            );
        }

        return (
            <div className="my-farms__market-image-container">
                <img
                    src={marketImageUrl}
                    alt={marketName}
                    className="my-farms__market-image"
                    onError={handleImageError}
                />
            </div>
        );
    });

    const sendNFTHandler = useCallback(
        (v: any) => {
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
                            {sortedMarketKeys.length > 1 && (
                                <div className="my-farms__controls">
                                    <div className="my-farms__sort-controls">
                                        <span className="my-farms__sort-label">Sort by:</span>
                                        <select
                                            className="my-farms__sort-select"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as 'name' | 'tvl' | 'positions')}
                                        >
                                            <option value="tvl">TVL (Highest)</option>
                                            <option value="positions">Positions (Most)</option>
                                            <option value="name">Name (A-Z)</option>
                                        </select>
                                    </div>
                                    <button
                                        className="my-farms__toggle-all"
                                        onClick={toggleAllMarkets}
                                    >
                                        {expandedMarkets.size === sortedMarketKeys.length ? (
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
                                const isExpanded = expandedMarkets.has(marketKey);

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
                                                    </h3>
                                                    <span className="my-farms__market-count">
                                                        {marketGroup.positions.length} position{marketGroup.positions.length !== 1 ? 's' : ''}
                                                        {marketGroup.totalTVL > 0 && (
                                                            <span className="my-farms__market-tvl">
                                                                • {formatDollarAmount(marketGroup.totalTVL)} TVL
                                                            </span>
                                                        )}
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
                                            {marketGroup.positions.map((el: any, i: number) => {
                                                const date = new Date(+el.enteredInEternalFarming * 1000).toLocaleString();

                                                return (
                                                    <div className={"my-farms__position-card p-1 br-12 mb-1"} key={i} data-navigatedto={hash == `#${el.id}`}>
                                                        <PositionHeader el={el} setUnstaking={setUnfarming} setSendModal={setSendModal} unstaking={unfarming} withdrawHandler={withdrawHandler} />
                                                        <div className={"f cg-1 rg-1 mxs_fd-c"}>
                                                            <div className={"my-farms__position-card__body w-100 p-1 br-8"}>
                                                                <PositionCardBodyHeader
                                                                    farmingType={FarmingType.ETERNAL}
                                                                    date={date}
                                                                    enteredInEternalFarming={el.enteredInEternalFarming}
                                                                    eternalFarming={el.eternalFarming}
                                                                    el={el}
                                                                />
                                                                {el.eternalFarming ? (
                                                                    <>
                                                                        <PositionCardBodyStat
                                                                            rewardToken={el.eternalRewardToken}
                                                                            earned={el.eternalEarned}
                                                                            bonusEarned={el.eternalBonusEarned}
                                                                            bonusRewardToken={el.eternalBonusRewardToken}
                                                                        />
                                                                        <div className={"f mxs_fd-c w-100"}>
                                                                            <button
                                                                                className={"btn primary w-100 b br-8 pv-075"}
                                                                                disabled={
                                                                                    (eternalCollectReward.id === el.id && eternalCollectReward.state !== "done") ||
                                                                                    (el.eternalEarned == 0 && el.eternalBonusEarned == 0)
                                                                                }
                                                                                onClick={() => {
                                                                                    setEternalCollectReward({
                                                                                        id: el.id,
                                                                                        state: "pending",
                                                                                    });
                                                                                    eternalCollectRewardHandler(el.id, { ...el });
                                                                                }}
                                                                            >
                                                                                {eternalCollectReward && eternalCollectReward.id === el.id && eternalCollectReward.state !== "done" ? (
                                                                                    <div className={"f f-jc f-ac cg-05"}>
                                                                                        <Loader size={"18px"} stroke={"var(--white)"} />
                                                                                        <Trans>Collecting</Trans>
                                                                                    </div>
                                                                                ) : (
                                                                                    <span>
                                                                                        <Trans>Collect rewards</Trans>
                                                                                    </span>
                                                                                )}
                                                                            </button>
                                                                            <button
                                                                                className={"btn primary w-100 b br-8 ml-1 mxs_ml-0 mxs_mt-1 pv-075"}
                                                                                disabled={gettingReward.id === el.id && gettingReward.farmingType === FarmingType.ETERNAL && gettingReward.state !== "done"}
                                                                                onClick={() => {
                                                                                    setGettingReward({
                                                                                        id: el.id,
                                                                                        state: "pending",
                                                                                        farmingType: FarmingType.ETERNAL,
                                                                                    });
                                                                                    claimRewardsHandler(el.id, { ...el }, FarmingType.ETERNAL);
                                                                                }}
                                                                            >
                                                                                {gettingReward && gettingReward.id === el.id && gettingReward.farmingType === FarmingType.ETERNAL && gettingReward.state !== "done" ? (
                                                                                    <div className={"f f-jc f-ac cg-05"}>
                                                                                        <Loader size={"18px"} stroke={"var(--white)"} />
                                                                                        <Trans>Withdrawing</Trans>
                                                                                    </div>
                                                                                ) : (
                                                                                    <span>
                                                                                        <Trans>Withdraw</Trans>
                                                                                    </span>
                                                                                )}
                                                                            </button>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className={"my-farms__position-card__empty f c f-ac f-jc"}>
                                                                        {el.eternalAvailable ? (
                                                                            <CheckOut link={"infinite-farms"} />
                                                                        ) : (
                                                                            <div>
                                                                                <Trans>No infinite farms for now</Trans>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : farmedNFTs && farmedNFTs.length > 0 ? (
                        // Fallback: render positions ungrouped if no market data
                        <div>
                            {farmedNFTs.map((el, i) => {
                                const date = new Date(+el.enteredInEternalFarming * 1000).toLocaleString();

                                return (
                                    <div className={"my-farms__position-card p-1 br-12 mb-1"} key={i} data-navigatedto={hash == `#${el.id}`}>
                                        <PositionHeader el={el} setUnstaking={setUnfarming} setSendModal={setSendModal} unstaking={unfarming} withdrawHandler={withdrawHandler} />
                                        <div className={"f cg-1 rg-1 mxs_fd-c"}>
                                            <div className={"my-farms__position-card__body w-100 p-1 br-8"}>
                                                <PositionCardBodyHeader
                                                    farmingType={FarmingType.ETERNAL}
                                                    date={date}
                                                    enteredInEternalFarming={el.enteredInEternalFarming}
                                                    eternalFarming={el.eternalFarming}
                                                    el={el}
                                                />
                                                {el.eternalFarming ? (
                                                    <>
                                                        <PositionCardBodyStat
                                                            rewardToken={el.eternalRewardToken}
                                                            earned={el.eternalEarned}
                                                            bonusEarned={el.eternalBonusEarned}
                                                            bonusRewardToken={el.eternalBonusRewardToken}
                                                        />
                                                        <div className={"f mxs_fd-c w-100"}>
                                                            <button
                                                                className={"btn primary w-100 b br-8 pv-075"}
                                                                disabled={
                                                                    (eternalCollectReward.id === el.id && eternalCollectReward.state !== "done") ||
                                                                    (el.eternalEarned == 0 && el.eternalBonusEarned == 0)
                                                                }
                                                                onClick={() => {
                                                                    setEternalCollectReward({
                                                                        id: el.id,
                                                                        state: "pending",
                                                                    });
                                                                    eternalCollectRewardHandler(el.id, { ...el });
                                                                }}
                                                            >
                                                                {eternalCollectReward && eternalCollectReward.id === el.id && eternalCollectReward.state !== "done" ? (
                                                                    <div className={"f f-jc f-ac cg-05"}>
                                                                        <Loader size={"18px"} stroke={"var(--white)"} />
                                                                        <Trans>Collecting</Trans>
                                                                    </div>
                                                                ) : (
                                                                    <span>
                                                                        <Trans>Collect rewards</Trans>
                                                                    </span>
                                                                )}
                                                            </button>
                                                            <button
                                                                className={"btn primary w-100 b br-8 ml-1 mxs_ml-0 mxs_mt-1 pv-075"}
                                                                disabled={gettingReward.id === el.id && gettingReward.farmingType === FarmingType.ETERNAL && gettingReward.state !== "done"}
                                                                onClick={() => {
                                                                    setGettingReward({
                                                                        id: el.id,
                                                                        state: "pending",
                                                                        farmingType: FarmingType.ETERNAL,
                                                                    });
                                                                    claimRewardsHandler(el.id, { ...el }, FarmingType.ETERNAL);
                                                                }}
                                                            >
                                                                {gettingReward && gettingReward.id === el.id && gettingReward.farmingType === FarmingType.ETERNAL && gettingReward.state !== "done" ? (
                                                                    <div className={"f f-jc f-ac cg-05"}>
                                                                        <Loader size={"18px"} stroke={"var(--white)"} />
                                                                        <Trans>Withdrawing</Trans>
                                                                    </div>
                                                                ) : (
                                                                    <span>
                                                                        <Trans>Withdraw</Trans>
                                                                    </span>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className={"my-farms__position-card__empty f c f-ac f-jc"}>
                                                        {el.eternalAvailable ? (
                                                            <CheckOut link={"infinite-farms"} />
                                                        ) : (
                                                            <div>
                                                                <Trans>No infinite farms for now</Trans>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}
                </>
            ) : null}
        </>
    );
}
