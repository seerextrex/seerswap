import invariant from "tiny-invariant";
import { Currency, NativeCurrency, Token } from "@uniswap/sdk-core";
import { WNATIVE } from "./wnative";
import AlgebraConfig from "algebra.config";

/**
 * Ether is the main usage of a 'native' currency, i.e. for Ethereum mainnet and all testnets
 */
export class Xdai extends NativeCurrency {
    private static _etherCache: { [chainId: number]: Xdai } = {};

    protected constructor(chainId: number) {
        super(chainId, AlgebraConfig.CHAIN_PARAMS.nativeCurrency.decimals, AlgebraConfig.CHAIN_PARAMS.nativeCurrency.symbol, AlgebraConfig.CHAIN_PARAMS.nativeCurrency.name);
    }

    public get wrapped(): Token {
        const weth9 = WNATIVE[this.chainId];
        invariant(!!weth9, "WRAPPED");
        return weth9;
    }

    public static onChain(chainId: number): Xdai {
        return this._etherCache[chainId] ?? (this._etherCache[chainId] = new Xdai(chainId));
    }

    public equals(other: Currency): boolean {
        return other.isNative && other.chainId === this.chainId;
    }
}
