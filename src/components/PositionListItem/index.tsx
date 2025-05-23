import { useEffect, useMemo, memo } from "react";
import { Position, Pool } from "lib/src";
import DoubleCurrencyLogo from "components/DoubleLogo";
import { PoolState, usePool } from "hooks/usePools";
import { Price, Token } from "@uniswap/sdk-core";
import { formatTickPrice } from "utils/formatTickPrice";
import JSBI from 'jsbi';
import Loader from "components/Loader";
import { unwrappedToken } from "utils/unwrappedToken";
import { STABLE_TOKENS, WXDAI_EXTENDED } from "../../constants/tokens";
import { Trans } from "@lingui/macro";
import useIsTickAtLimit from "hooks/useIsTickAtLimit";
import { Bound, setShowNewestPosition } from "state/mint/v3/actions";
import { ArrowRight } from "react-feather";
import usePrevious from "../../hooks/usePrevious";
import { PositionPool } from "../../models/interfaces";
import { NavLink } from "react-router-dom";
import Card from "../../shared/components/Card/Card";
import RangeBadge from "../Badge/RangeBadge";
import "./index.scss";
import { useAppDispatch } from "state/hooks";
import { useToken } from "../../hooks/Tokens";
import { NEVER_RELOAD } from "../../state/multicall/hooks";

// Production-mode logger that only logs in development
const logger = {
    debug: (process.env.NODE_ENV === 'development')
        ? (...args: any[]) => console.debug(...args)
        : () => { /* no-op in production */ },
    warn: (...args: any[]) => console.warn(...args),
    error: (...args: any[]) => console.error(...args),
};

interface PositionListItemProps {
    positionDetails: PositionPool;
    tokenMap?: { [address: string]: Token | null | undefined };
    areTokensLoaded?: boolean;
    poolMap?: { [key: string]: [PoolState, Pool | null] };
    newestPosition?: number | undefined;
    highlightNewest?: boolean;
    onShiftClick?: () => void;
    onClick?: () => void;
}

export function getPriceOrderingFromPositionForUI(position?: Position): {
    priceLower?: Price<Token, Token>;
    priceUpper?: Price<Token, Token>;
    quote?: Token;
    base?: Token;
} {
    if (!position) {
        return {};
    }

    const token0 = position.amount0.currency;
    const token1 = position.amount1.currency;

    // Pool price is always in terms of token1 per token0
    // We handle display here

    // if token0 is stable and token1 not, we should invert
    const stables = [WXDAI_EXTENDED[100], ...STABLE_TOKENS];
    const stable0 = stables.some((stableToken) => stableToken && stableToken.equals(token0));
    const stable1 = stables.some((stableToken) => stableToken && stableToken.equals(token1));

    if (stable0 && !stable1) {
        return {
            priceLower: position.token0PriceLower.invert(),
            priceUpper: position.token0PriceUpper.invert(),
            quote: token0,
            base: token1,
        };
    }
    // otherwise, the default
    return {
        priceLower: position.token0PriceUpper.invert(),
        priceUpper: position.token0PriceLower.invert(),
        quote: token1,
        base: token0,
    };
}

// Check if a position is closed
export function isClosed(position: Position): boolean {
    try {
        return JSBI.equal(position.liquidity, JSBI.BigInt(0));
    } catch {
        return false;
    }
}

// Check if a position is out of range
export function isOutOfRange(pool: Pool | null | undefined, tickLower?: number, tickUpper?: number): boolean {
    if (!pool || tickLower === undefined || tickUpper === undefined) return false;
    return pool.tickCurrent < tickLower || pool.tickCurrent >= tickUpper;
}

function PositionListItemInner({ positionDetails, newestPosition, highlightNewest, onShiftClick, onClick }: PositionListItemProps) {
    const dispatch = useAppDispatch();

    const prevPositionDetails = usePrevious({ ...positionDetails });
    const {
        token0: _token0Address,
        token1: _token1Address,
        liquidity: _liquidity,
        tickLower: _tickLower,
        tickUpper: _tickUpper,
        onFarming: _onFarming,
    } = useMemo(() => {
        if (!positionDetails && prevPositionDetails && prevPositionDetails.liquidity) {
            return { ...prevPositionDetails };
        }
        return { ...positionDetails };
    }, [positionDetails, prevPositionDetails]);

    // Debug only in development and only once per component
    useMemo(() => {
        if (process.env.NODE_ENV === 'development') {
            logger.debug('[PositionListItem] token0:', _token0Address, 'token1:', _token1Address);
        }
    }, [_token0Address, _token1Address]);

    // Use individual token hooks for stability
    const token0 = useToken(_token0Address);
    const token1 = useToken(_token1Address);

    const currency0 = useMemo(() => token0 ? unwrappedToken(token0) : undefined, [token0]);
    const currency1 = useMemo(() => token1 ? unwrappedToken(token1) : undefined, [token1]);

    // Use the pool hook directly with stable reference memoization and reduced fetch frequency
    const [poolState, pool] = usePool(
        currency0 ?? undefined,
        currency1 ?? undefined,
        { blocksPerFetch: 20 } // Significantly reduce fetch frequency
    );

    const prevPool = usePrevious(pool);
    const _pool = useMemo(() => {
        if (!pool && prevPool) {
            return prevPool;
        }
        return pool;
    }, [pool, prevPool]);

    const position = useMemo(() => {
        if (!_pool || _liquidity === undefined || poolState !== PoolState.EXISTS) return undefined;

        try {
            return new Position({
                pool: _pool,
                liquidity: _liquidity.toString(),
                tickLower: _tickLower,
                tickUpper: _tickUpper,
            });
        } catch (error) {
            logger.error('[PositionListItem] Error creating Position object:', error);
            return undefined;
        }
    }, [_pool, _liquidity, _tickLower, _tickUpper, poolState]);

    const tickAtLimit = useIsTickAtLimit(_tickLower, _tickUpper);

    const { priceLower, priceUpper, quote, base } = useMemo(() =>
        getPriceOrderingFromPositionForUI(position),
        [position]
    );

    const currencyQuote = useMemo(() =>
        quote ? unwrappedToken(quote) : undefined,
        [quote]
    );

    const currencyBase = useMemo(() =>
        base ? unwrappedToken(base) : undefined,
        [base]
    );

    const outOfRange: boolean = useMemo(() =>
        _pool && poolState === PoolState.EXISTS ? _pool.tickCurrent < _tickLower || _pool.tickCurrent >= _tickUpper : false,
        [_pool, _tickLower, _tickUpper, poolState]
    );

    const positionSummaryLink = useMemo(() =>
        `/pool/${positionDetails.tokenId}${_onFarming ? "?onFarming=true" : ""}`,
        [positionDetails.tokenId, _onFarming]
    );

    const positionSummaryLinkNew = useMemo(() =>
        `/positions/${positionDetails.tokenId}`,
        [positionDetails.tokenId]
    );

    const farmingLink = useMemo(() =>
        `/farming/farms#${positionDetails.tokenId}`,
        [positionDetails.tokenId]
    );

    const isNewest = useMemo(() =>
        newestPosition ? newestPosition === Number(positionDetails.tokenId) : undefined,
        [newestPosition, positionDetails.tokenId]
    );

    const removed = useMemo(() =>
        position ? JSBI.equal(position.liquidity, JSBI.BigInt(0)) : false,
        [position]
    );

    useEffect(() => {
        if (newestPosition && highlightNewest) {
            dispatch(setShowNewestPosition({ showNewestPosition: false }));
            document.querySelector("#newest")?.scrollIntoView({ behavior: "smooth" });
        }
    }, [newestPosition, highlightNewest, dispatch]);

    const isLoading = useMemo(() => {
        // Only show loading if we don't have token data yet
        if (!token0 || !token1) return true;
        // Don't show loading if we're just waiting for pool data but have tokens
        return false;
    }, [token0, token1]);

    const showFarmBadge = positionDetails.onFarming || positionDetails.oldFarming;

    if (isLoading) {
        return (
            <Card isDark={false} classes={"br-24 mv-05 card-bg-hover position-list-card"}>
                <div className={"f c f-ac f-jc w-100 h-100 p-1"}>
                    <Loader size={"1.5rem"} stroke={"var(--text-primary)"} />
                    <span className={"ml-05 c-text-primary fs-085"}><Trans>Loading token data...</Trans></span>
                </div>
            </Card>
        );
    }

    const cardContent = (
        <Card isDark={false} classes={"br-24 mv-05 card-bg-hover position-list-card"}>
            <div className={"position-list-item__header f f-ac"}>
                <div className={"f f-ac"}>
                    <DoubleCurrencyLogo currency0={currencyBase} currency1={currencyQuote} size={24} margin />
                    <div className={"b fs-125 mh-05 c-w"}>
                        &nbsp;{currencyQuote?.symbol || '...'}&nbsp;/&nbsp;{currencyBase?.symbol || '...'}
                    </div>
                    &nbsp;
                </div>
                <div className={"position-list-item__header__badges flex-s-between w-100"}>
                    {_onFarming ? (
                        <NavLink className={"flex-s-between btn primary fs-085 p-025 br-8"} to={farmingLink}>
                            <span>
                                <Trans>Farming</Trans>
                            </span>
                            <ArrowRight size={14} color={"white"} style={{ marginLeft: "5px" }} />
                        </NavLink>
                    ) : (
                        <div />
                    )}
                    <RangeBadge removed={removed} inRange={!outOfRange} />
                </div>
            </div>

            <div className={"position-list-item__bottom f fs-085 mt-025 c-w mt-05 mxs_fd-c mxs_f-ac"}>
                <div className={"f mxs_mb-05"}>
                    <div className={"position-list-item__prefix mr-025"}>
                        <Trans>Min:</Trans>
                    </div>
                    <span className={"position-list-item__amount"}>
                        <Trans>{`${formatTickPrice(priceLower, tickAtLimit, Bound.LOWER)} ${currencyQuote?.symbol || '...'} per ${currencyBase?.symbol || '...'}`}</Trans>
                    </span>
                </div>
                <div className={"position-list-item__arrow mh-05"}>⟷</div>
                <div className={"f"}>
                    <span className={"position-list-item__prefix mh-025"}>
                        <Trans>Max:</Trans>
                    </span>
                    <span className={"position-list-item__amount"}>
                        <Trans>{`${formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER)} ${currencyQuote?.symbol || '...'} per ${currencyBase?.symbol || '...'}`}</Trans>
                    </span>
                </div>
            </div>
        </Card>
    );

    if (_onFarming) {
        return (
            <div className={"w-100"} id={isNewest && highlightNewest ? "newest" : ""}>
                {cardContent}
            </div>
        );
    }

    return (
        <NavLink className={"w-100"} to={positionSummaryLink} id={isNewest && highlightNewest ? "newest" : ""}>
            {cardContent}
        </NavLink>
    );
}

// Memoize the component to prevent unnecessary re-renders
const PositionListItem = memo(PositionListItemInner);
export default PositionListItem;
