import { useEffect, useMemo } from "react";
import { Position } from "lib/src";
import DoubleCurrencyLogo from "components/DoubleLogo";
import { usePool } from "hooks/usePools";
import { useToken } from "hooks/Tokens";
import { Price, Token } from "@uniswap/sdk-core";
import { formatTickPrice } from "utils/formatTickPrice";
import Loader from "components/Loader";
import { unwrappedToken } from "utils/unwrappedToken";
import { STABLE_TOKENS, WMATIC_EXTENDED } from "../../constants/tokens";
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
    //TODO
    // const bases = [...Object.values(WMATIC_EXTENDED), WBTC]
    const bases = [...Object.values(WMATIC_EXTENDED)];
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

export default function PositionListItem({ positionDetails, newestPosition, highlightNewest }: PositionListItemProps) {
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
    }, [positionDetails]);

    const token0 = useToken(_token0Address);
    const token1 = useToken(_token1Address);

    const currency0 = token0 ? unwrappedToken(token0) : undefined;
    const currency1 = token1 ? unwrappedToken(token1) : undefined;

    // construct Position from details returned
    const [, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined);
    const prevPool = usePrevious(pool);
    const _pool = useMemo(() => {
        if (!pool && prevPool) {
            return prevPool;
        }
        return pool;
    }, [pool]);

    const position = useMemo(() => {
        if (_pool) {
            return new Position({
                pool: _pool,
                liquidity: _liquidity.toString(),
                tickLower: _tickLower,
                tickUpper: _tickUpper,
            });
        }
        return undefined;
    }, [_liquidity, _pool, _tickLower, _tickUpper]);

    const tickAtLimit = useIsTickAtLimit(_tickLower, _tickUpper);

    // prices
    const { priceLower, priceUpper, quote, base } = getPriceOrderingFromPositionForUI(position);
    const currencyQuote = quote && unwrappedToken(quote);
    const currencyBase = base && unwrappedToken(base);

    // check if price is within range
    const outOfRange: boolean = _pool ? _pool.tickCurrent < _tickLower || _pool.tickCurrent >= _tickUpper : false;

    const positionSummaryLink = `/pool/${positionDetails.tokenId}${_onFarming ? "?onFarming=true" : ""}`;

    const farmingLink = `/farming/farms#${positionDetails.tokenId}`;

    const isNewest = newestPosition ? newestPosition === +positionDetails.tokenId : undefined;

    const removed = _liquidity?.eq(0);

    useEffect(() => {
        if (newestPosition && highlightNewest) {
            dispatch(setShowNewestPosition({ showNewestPosition: false }));
            document.querySelector("#newest")?.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    return (
        <NavLink className={"w-100"} to={positionSummaryLink} id={isNewest && highlightNewest ? "newest" : ""}>
            <Card isDark={false} classes={"br-24 p-1 mv-05"}>
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
                        ) : (
                            <div />
                        )}
                        <RangeBadge removed={removed} inRange={!outOfRange} />
                    </div>
                </div>

                {priceLower && priceUpper ? (
                    <div className={"position-list-item__bottom f fs-085 mt-025 c-w mt-05 mxs_fd-c mxs_f-ac"}>
                        <div className={"f mxs_mb-05"}>
                            <div className={"position-list-item__prefix mr-025"}>
                                <Trans>Min:</Trans>
                            </div>
                            <span className={"position-list-item__amount"}>
                                <Trans>{`${formatTickPrice(priceLower, tickAtLimit, Bound.LOWER)} ${currencyQuote?.symbol} per ${currencyBase?.symbol}`}</Trans>
                            </span>
                        </div>
                        <div className={"position-list-item__arrow mh-05"}>⟷</div>
                        <div className={"f"}>
                            <span className={"position-list-item__prefix mh-025"}>
                                <Trans>Max:</Trans>
                            </span>
                            <span className={"position-list-item__amount"}>
                                <Trans>{`${formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER)} ${currencyQuote?.symbol} per ${currencyBase?.symbol}`}</Trans>
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className={"f c f-ac f-jc w-100"}>
                        <Loader size={"1rem"} stroke={"var(--white)"} />
                    </div>
                )}
            </Card>
        </NavLink>
    );
}
