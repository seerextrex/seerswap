import { Currency, Token } from "@uniswap/sdk-core";
import { useMemo } from "react";
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST, CUSTOM_BASES } from "../constants/routing";
import { useAccount } from "wagmi";

export function useAllCurrencyCombinations(currencyA?: Currency, currencyB?: Currency): [Token, Token][] {
    const { chain, status } = useAccount();
    const actualChainId = status === 'connected' ? chain?.id : undefined;

    const [tokenA, tokenB] = useMemo(() => {
        if (!actualChainId || !currencyA || !currencyB) {
            return [undefined, undefined];
        }
        return [currencyA.wrapped, currencyB.wrapped];
    }, [actualChainId, currencyA, currencyB]);

    const bases: Token[] = useMemo(() => {
        if (!actualChainId || !tokenA || !tokenB) {
            return [];
        }

        const common = BASES_TO_CHECK_TRADES_AGAINST[actualChainId] ?? [];
        const additionalA = ADDITIONAL_BASES[actualChainId]?.[tokenA.address] ?? [];
        const additionalB = ADDITIONAL_BASES[actualChainId]?.[tokenB.address] ?? [];

        return [...common, ...additionalA, ...additionalB];
    }, [actualChainId, tokenA, tokenB]);

    const basePairs: [Token, Token][] = useMemo(() => {
        return bases.flatMap((base): [Token, Token][] => bases.map((otherBase) => [base, otherBase])).filter(([t0, t1]) => !t0.equals(t1));
    }, [bases]);

    return useMemo(
        () => {
            if (!tokenA || !tokenB || !actualChainId) {
                return [];
            }

            return [
                // the direct pair
                [tokenA, tokenB] as [Token, Token],
                // token A against all bases
                ...bases.map((base): [Token, Token] => [tokenA, base]),
                // token B against all bases
                ...bases.map((base): [Token, Token] => [tokenB, base]),
                // each base against all bases
                ...basePairs,
            ]
                // filter out invalid pairs comprised of the same asset (e.g. WETH<>WETH)
                .filter(([t0, t1]) => !t0.equals(t1))
                // filter out duplicate pairs
                .filter(([t0, t1], i, otherPairs) => {
                    const firstIndexInOtherPairs = otherPairs.findIndex(([t0Other, t1Other]) => {
                        return (t0.equals(t0Other) && t1.equals(t1Other)) || (t0.equals(t1Other) && t1.equals(t0Other));
                    });
                    return firstIndexInOtherPairs === i;
                })
                // optionally filter out some pairs for tokens with custom bases defined
                .filter(([tA, tB]) => {
                    if (!actualChainId) return true;
                    const customBases = CUSTOM_BASES[actualChainId];

                    const customBasesA: Token[] | undefined = customBases?.[tA.address];
                    const customBasesB: Token[] | undefined = customBases?.[tB.address];

                    if (!customBasesA && !customBasesB) return true;

                    if (customBasesA && !customBasesA.find((base) => tB.equals(base))) return false;
                    if (customBasesB && !customBasesB.find((base) => tA.equals(base))) return false;

                    return true;
                });
        },
        [tokenA, tokenB, bases, basePairs, actualChainId]
    );
}
