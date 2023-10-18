import { getTokenLogoURL } from "../components/CurrencyLogo";
import { Currency, Token } from "@uniswap/sdk-core";
import { useCallback, useState } from "react";
import { useWeb3React } from "@web3-react/core";

export default function useAddTokenToMetamask(currencyToAdd: Currency | undefined): {
    addToken: () => void;
    success: boolean | undefined;
} {
    const { connector } = useWeb3React();

    const token: Token | undefined = currencyToAdd?.wrapped;

    const [success, setSuccess] = useState<boolean | undefined>();

    const addToken = useCallback(() => {
        if (connector.watchAsset && token && token.symbol) {
            connector
                .watchAsset({
                    address: token.address,
                    symbol: token.symbol,
                    decimals: token.decimals,
                    image: getTokenLogoURL(token.address),
                })
                .then((success) => {
                    setSuccess(success);
                })
                .catch(() => setSuccess(false));
        } else {
            setSuccess(false);
        }
    }, [connector, token]);

    return { addToken, success };
}
