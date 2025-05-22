import { Currency, CurrencyAmount, TradeType } from "@uniswap/sdk-core";
import { encodeRouteToPath, Route, Trade } from "lib/src";
import { useMemo } from "react";
import { useSingleContractMultipleData } from "../state/multicall/hooks";
import { useAllV3Routes } from "./useAllV3Routes";
import { useV3Quoter } from "./useContract";
import { useAccount } from "wagmi";
import usePrevious from "./usePrevious";
import { ListenerOptions } from "../state/multicall/hooks";

export enum V3TradeState {
    LOADING,
    INVALID,
    NO_ROUTE_FOUND,
    VALID,
    SYNCING,
}

const DEFAULT_GAS_QUOTE = 2_000_000;

/**
 * Returns the best v3 trade for a desired exact input swap
 * @param amountIn the amount to swap in
 * @param currencyOut the desired output currency
 */
export function useBestV3TradeExactIn(amountIn?: CurrencyAmount<Currency>, currencyOut?: Currency, listenerOptions?: ListenerOptions): { state: V3TradeState; trade: Trade<Currency, Currency, TradeType.EXACT_INPUT> | null } {
    const { chain } = useAccount();
    const chainId = chain?.id;
    const quoter = useV3Quoter();

    const { routes, loading: routesLoading } = useAllV3Routes(amountIn?.currency, currencyOut, listenerOptions);

    const quoteExactInInputs = useMemo(() => {
        return routes.map((route) => [encodeRouteToPath(route, false), amountIn ? `0x${amountIn.quotient.toString(16)}` : undefined]);
    }, [amountIn, routes]);

    const quotesResults = useSingleContractMultipleData(quoter, "quoteExactInput", quoteExactInInputs, {
        gasRequired: chainId ? DEFAULT_GAS_QUOTE : undefined,
        blocksPerFetch: 3,
    });

    const trade = useMemo(() => {
        if (!amountIn || !currencyOut) {
            return {
                state: V3TradeState.INVALID,
                trade: null,
            };
        }

        if (routesLoading || quotesResults.some(({ loading }) => loading)) {
            return {
                state: V3TradeState.LOADING,
                trade: null,
            };
        }

        const { bestRoute, amountOut } = quotesResults.reduce(
            (currentBest: { bestRoute: Route<Currency, Currency> | null; amountOut: bigint | null }, { result }, i) => {
                if (!result) return currentBest;

                if (currentBest.amountOut === null) {
                    return {
                        bestRoute: routes[i],
                        amountOut: result.amountOut,
                    };
                } else if (result.amountOut !== undefined && currentBest.amountOut < result.amountOut) {
                    return {
                        bestRoute: routes[i],
                        amountOut: result.amountOut,
                    };
                }

                return currentBest;
            },
            {
                bestRoute: null,
                amountOut: null,
            }
        );

        if (!bestRoute || !amountOut) {
            return {
                state: V3TradeState.NO_ROUTE_FOUND,
                trade: null,
            };
        }

        const isSyncing = quotesResults.some(({ syncing }) => syncing);

        return {
            state: isSyncing ? V3TradeState.SYNCING : V3TradeState.VALID,
            trade: Trade.createUncheckedTrade({
                route: bestRoute,
                tradeType: TradeType.EXACT_INPUT,
                inputAmount: amountIn,
                outputAmount: CurrencyAmount.fromRawAmount(currencyOut, amountOut.toString()),
            }),
        };
    }, [amountIn, currencyOut, quotesResults, routes, routesLoading]);

    const prevTrade = usePrevious(trade.trade ? trade : undefined);

    return useMemo(() => {
        if (!prevTrade) return trade;

        if (!trade.trade && prevTrade.trade) return prevTrade;

        return trade;
    }, [trade, prevTrade]);
}

/**
 * Returns the best v3 trade for a desired exact output swap
 * @param currencyIn the desired input currency
 * @param amountOut the amount to swap out
 */
export function useBestV3TradeExactOut(currencyIn?: Currency, amountOut?: CurrencyAmount<Currency>, listenerOptions?: ListenerOptions): { state: V3TradeState; trade: Trade<Currency, Currency, TradeType.EXACT_OUTPUT> | null } {
    const { chain } = useAccount();
    const chainId = chain?.id;
    const quoter = useV3Quoter();

    const { routes, loading: routesLoading } = useAllV3Routes(currencyIn, amountOut?.currency, listenerOptions);

    const quoteExactOutInputs = useMemo(() => {
        return routes.map((route) => [encodeRouteToPath(route, true), amountOut ? `0x${amountOut.quotient.toString(16)}` : undefined]);
    }, [amountOut, routes]);

    const quotesResults = useSingleContractMultipleData(quoter, "quoteExactOutput", quoteExactOutInputs, {
        gasRequired: chainId ? DEFAULT_GAS_QUOTE : undefined,
        blocksPerFetch: 3,
    });

    const trade = useMemo(() => {
        if (!amountOut || !currencyIn || quotesResults.some(({ valid }) => !valid)) {
            return {
                state: V3TradeState.INVALID,
                trade: null,
            };
        }

        if (routesLoading || quotesResults.some(({ loading }) => loading)) {
            return {
                state: V3TradeState.LOADING,
                trade: null,
            };
        }

        const { bestRoute, amountIn } = quotesResults.reduce(
            (currentBest: { bestRoute: Route<Currency, Currency> | null; amountIn: bigint | null }, { result }, i) => {
                if (!result) return currentBest;

                if (currentBest.amountIn === null) {
                    return {
                        bestRoute: routes[i],
                        amountIn: result.amountIn,
                    };
                } else if (result.amountIn !== undefined && currentBest.amountIn > result.amountIn) {
                    return {
                        bestRoute: routes[i],
                        amountIn: result.amountIn,
                    };
                }

                return currentBest;
            },
            {
                bestRoute: null,
                amountIn: null,
            }
        );

        if (!bestRoute || !amountIn) {
            return {
                state: V3TradeState.NO_ROUTE_FOUND,
                trade: null,
            };
        }

        const isSyncing = quotesResults.some(({ syncing }) => syncing);

        return {
            state: isSyncing ? V3TradeState.SYNCING : V3TradeState.VALID,
            trade: Trade.createUncheckedTrade({
                route: bestRoute,
                tradeType: TradeType.EXACT_OUTPUT,
                inputAmount: CurrencyAmount.fromRawAmount(currencyIn, amountIn.toString()),
                outputAmount: amountOut,
            }),
        };
    }, [amountOut, currencyIn, quotesResults, routes, routesLoading]);

    const prevTrade = usePrevious(trade.trade ? trade : undefined);

    return useMemo(() => {
        if (!prevTrade) return trade;

        if (!trade.trade && prevTrade.trade) return prevTrade;

        return trade;
    }, [trade]);
}
