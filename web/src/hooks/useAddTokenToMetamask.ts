import { getTokenLogoURL } from "../components/CurrencyLogo";
import { Currency, Token } from "@uniswap/sdk-core";
import { useCallback, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { type WatchAssetParameters, type Address } from "viem";
import { watchAsset } from 'viem/actions';

export default function useAddTokenToMetamask(currencyToAdd: Currency | undefined): {
    addToken: () => void;
    success: boolean | undefined;
} {
    const { chain } = useAccount();
    const chainId = chain?.id;
    const { data: walletClient } = useWalletClient({ chainId });

    const token: Token | undefined = currencyToAdd?.wrapped;

    const [success, setSuccess] = useState<boolean | undefined>();

    const addToken = useCallback(() => {
        if (walletClient && token && token.symbol) {
            const params: WatchAssetParameters = {
                type: 'ERC20',
                options: {
                    address: token.address as Address,
                    symbol: token.symbol,
                    decimals: token.decimals,
                    image: getTokenLogoURL(token.address),
                }
            };
            watchAsset(walletClient, params)
                .then((success) => {
                    setSuccess(success);
                })
                .catch(() => setSuccess(false));
        } else {
            setSuccess(false);
        }
    }, [walletClient, token]);

    return { addToken, success };
}
