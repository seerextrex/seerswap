import { Currency } from "@uniswap/sdk-core";

import AlgebraConfig from "algebra.config";

export function currencyId(currency: Currency, chainId: number): string {
    let chainSymbol = AlgebraConfig.CHAIN_PARAMS.nativeCurrency.symbol;

    if (chainId === AlgebraConfig.CHAIN_PARAMS.chainId) {
        chainSymbol = AlgebraConfig.CHAIN_PARAMS.nativeCurrency.symbol;
    }

    if (currency.isNative) return chainSymbol;
    if (currency.isToken) return currency.address;
    throw new Error("invalid currency");
}
