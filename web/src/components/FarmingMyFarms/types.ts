import { Market, Token, Pool } from "../../state/data/generated";
import { Deposit, UnfarmingInterface, RewardInterface } from "../../models/interfaces";
import { TokenSubgraph } from "../../models/interfaces/responseSubgraph";
import { ConditionalMarketRelationship } from "../../utils/markets";

export interface OutcomeGroupData {
    token: TokenSubgraph;
    positions: Deposit[];
    name: string;
    imageUrl: string | null;
}

export interface ChildMarketGroup {
    marketName: string;
    marketId: string;
    market?: Market;
    positions: Deposit[];
    totalEarnedRewards: number;
    isChild: true;
    parentKey: string;
}

export interface MarketGroup {
    marketName: string;
    marketId: string;
    market?: Market;
    positions: Deposit[];
    totalEarnedRewards: number;
    isParent: boolean;
    childMarkets: Record<string, ChildMarketGroup>;
}

export interface GroupedPositions {
    [marketKey: string]: MarketGroup;
}

export interface TokenImageProps {
    imageUrl: string | null;
    tokenSymbol: string;
    size?: number;
}

export interface MarketImageProps {
    market: Market | null | undefined;
    marketName: string;
}

export interface PositionCardProps {
    position: Deposit;
    marketKey?: string;
    parentMarket?: Market | null;
    onUnfarm: (id: string) => void;
    onSendModal: (id: string) => void;
    onCollectReward: (id: string, position: Deposit) => void;
    onClaimRewards: (id: string, position: Deposit) => void;
    eternalCollectReward: UnfarmingInterface;
    gettingReward: RewardInterface;
    unfarming: UnfarmingInterface;
}

export interface UseGroupedFarmingPositionsParams {
    positions: Deposit[] | null;
    isConditionalMarketPool: (position: Deposit) => ConditionalMarketRelationship | null;
}

export interface UseGroupedFarmingPositionsResult {
    groupedPositions: GroupedPositions;
    sortedMarketKeys: string[];
    sortBy: 'name' | 'positions' | 'rewards';
    setSortBy: (sortBy: 'name' | 'positions' | 'rewards') => void;
}

export interface UseOutcomeGroupingParams {
    market?: Market | null | undefined;
    parentMarket?: Market | null;
}

export interface UseOutcomeGroupingResult {
    groupPositionsByOutcome: (positions: Deposit[], market?: Market | null, parentMarket?: Market | null) => Map<string, OutcomeGroupData>;
    getOutcomeName: (tokenId: string, market?: Market | null, parentMarket?: Market | null) => string | null;
    findTokenImageUrl: (tokenId: string, market?: Market | null) => string | null;
}