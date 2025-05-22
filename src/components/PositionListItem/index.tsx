import { useEffect, useMemo, memo } from "react";
import { Position } from "lib/src";
import DoubleCurrencyLogo from "components/DoubleLogo";
import { usePool } from "hooks/usePools";
import { useToken } from "hooks/Tokens";
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
import { NEVER_RELOAD } from "../../state/multicall/hooks";

// Production-mode logger that only logs in development
const logger = {
    debug: (process.env.NODE_ENV === 'development')
        ? (...args: any[]) => console.debug(...args)
        : () => { },
    warn: (...args: any[]) => console.warn(...args),
    error: (...args: any[]) => console.error(...args),
};

interface PositionListItemProps {
    positionDetails: PositionPool;
    newestPosition?: number | undefined;
    highlightNewest?: boolean;
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

    // if token0 is a dollar-stable asset, set it as the quote token
    const stables = [...STABLE_TOKENS];
    if (stables.some((stable) => stable.equals(token0))) {
        return {
            priceLower: position.token0PriceUpper.invert(),
            priceUpper: position.token0PriceLower.invert(),
            quote: token0,
            base: token1,
        };
    }

    // if token1 is an ETH-/BTC-stable asset, set it as the base token
    const bases = [...Object.values(WXDAI_EXTENDED)];
    if (bases.some((base) => base.equals(token1))) {
        return {
            priceLower: position.token0PriceUpper.invert(),
            priceUpper: position.token0PriceLower.invert(),
            quote: token0,
            base: token1,
        };
    }

    // if both prices are below 1, invert
    if (position.token0PriceUpper.lessThan(1)) {
        return {
            priceLower: position.token0PriceUpper.invert(),
            priceUpper: position.token0PriceLower.invert(),
            quote: token0,
            base: token1,
        };
    }

    // otherwise, just return the default
    return {
        priceLower: position.token0PriceLower,
        priceUpper: position.token0PriceUpper,
        quote: token1,
        base: token0,
    };
}

function PositionListItemInner({ positionDetails, newestPosition, highlightNewest }: PositionListItemProps) {
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

    logger.debug('[PositionListItem] token0:', _token0Address, 'token1:', _token1Address);

    const token0 = useToken(_token0Address);
    const token1 = useToken(_token1Address);

    const currency0 = useMemo(() =>
        token0 ? unwrappedToken(token0) : undefined,
        [token0]
    );

    const currency1 = useMemo(() =>
        token1 ? unwrappedToken(token1) : undefined,
        [token1]
    );

    // construct Position from details returned
    // Ensure currencies are defined before calling usePool
    const [poolState, pool] = usePool(
        currency0 && currency1 ? currency0 : undefined,
        currency0 && currency1 ? currency1 : undefined,
        NEVER_RELOAD
    );

    const prevPool = usePrevious(pool);
    const _pool = useMemo(() => {
        if (!pool && prevPool) {
            return prevPool;
        }
        return pool;
    }, [pool, prevPool]);

    const position = useMemo(() => {
        if (!_pool || _liquidity === undefined) return undefined;

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
    }, [_pool, _liquidity, _tickLower, _tickUpper]);

    const tickAtLimit = useIsTickAtLimit(_tickLower, _tickUpper);

    // prices
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

    // check if price is within range
    const outOfRange: boolean = useMemo(() =>
        _pool ? _pool.tickCurrent < _tickLower || _pool.tickCurrent >= _tickUpper : false,
        [_pool, _tickLower, _tickUpper]
    );

    const positionSummaryLink = useMemo(() =>
        `/pool/${positionDetails.tokenId}${_onFarming ? "?onFarming=true" : ""}`,
        [positionDetails.tokenId, _onFarming]
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

    if (!currency0 || !currency1) {
        return (
            <Card isDark={false} classes={"br-24 mv-05 card-bg-hover position-list-card"}>
                <div className={"f c f-ac f-jc w-100 h-100 p-1"}>
                    <Loader size={"1.5rem"} stroke={"var(--text-primary)"} />
                    <span className={"ml-05 c-text-primary fs-085"}><Trans>Loading token data...</Trans></span>
                </div>
            </Card>
        );
    }

    return (
        <NavLink className={"w-100"} to={positionSummaryLink} id={isNewest && highlightNewest ? "newest" : ""}>
            <Card isDark={false} classes={"br-24 mv-05 card-bg-hover position-list-card"}>
                <div className={"position-list-item__header f f-ac"}>
                    <div className={"f f-ac"}>
                        <DoubleCurrencyLogo currency0={currencyBase} currency1={currencyQuote} size={24} margin />
                        <div className={"b fs-125 mh-05 c-w"}>
                            &nbsp;{currencyQuote?.symbol}&nbsp;/&nbsp;{currencyBase?.symbol}
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
                        ) : removed ? (
                            <RangeBadge removed={true} inRange={false} />
                        ) : outOfRange ? (
                            <RangeBadge
                                removed={false}
                                inRange={false}
                            />
                        ) : (
                            <RangeBadge
                                removed={false}
                                inRange={true}
                            />
                        )}
                    </div>
                </div>
                <div className={"position-list-item__info f mxs_fd-c justify-between"}>
                    <div className={"position-list-item__info__col"}>
                        <div className={"f-jb f-wrap"}>
                            <span className={"position-list-item__info__col__text-sec"}>
                                <Trans>Price range</Trans>
                            </span>
                        </div>
                        <div className={"f-jb mxs_fw-wrap"}>
                            <div className={"mr-1 mxs_mb-05"}>
                                <div className={"position-list-item__info__col__text-main nowrap"}>
                                    {formatTickPrice(priceLower, tickAtLimit, Bound.LOWER)}
                                </div>
                                <div className={"position-list-item__info__col__text-sec"}>
                                    <Trans>{currencyQuote?.symbol} per {currencyBase?.symbol}</Trans>
                                </div>
                            </div>
                            <div className={"position-list-item__info__arrow mxs_hide"}>{"->"}</div>
                            <div className={"ml-1 mxs_mb-05"}>
                                <div className={"position-list-item__info__col__text-main nowrap"}>
                                    {formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER)}
                                </div>
                                <div className={"position-list-item__info__col__text-sec"}>
                                    <Trans>{currencyQuote?.symbol} per {currencyBase?.symbol}</Trans>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </NavLink>
    );
}

// Memoize the component to prevent unnecessary re-renders
const PositionListItem = memo(PositionListItemInner);
export default PositionListItem;
