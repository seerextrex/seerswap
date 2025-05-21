import React from "react";
// @ts-ignore
import { useAccount } from "wagmi";
import { stringToColour } from "../../utils/stringToColour";
import { specialTokens } from "./SpecialTokens";
import { StyledImgLogo, StyledLogo } from "./styled";
import { WrappedCurrency } from "../../models/types";

import AlgebraConfig from "algebra.config";

export const getTokenLogoURL = (address: string) => `https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/${address}/logo.png`;

export default function CurrencyLogo({ currency, size = "24px", style, ...rest }: { currency?: WrappedCurrency & { logoURI?: string; logo?: string }; size?: string; style?: React.CSSProperties }) {
    const { chain } = useAccount();
    const chainId = chain?.id;

    let logo;

    if (chainId === AlgebraConfig.CHAIN_PARAMS.chainId) {
        logo = AlgebraConfig.CHAIN_PARAMS.nativeCurrency.logo;
    }

    if (!currency) return <div />;

    if (currency.address?.toLowerCase() in specialTokens || currency.address in specialTokens) {
        return <StyledImgLogo src={specialTokens[currency.address.toLowerCase()] || specialTokens[currency.address]} size={size} style={style} {...rest} />;
    }

    if (currency.isNative) {
        return <StyledImgLogo src={logo} size={size} style={style} {...rest} />;
    }

    if (currency.logoURI) {
        return <StyledImgLogo src={currency.logoURI} size={size} style={style} {...rest} />;
    }

    return (
        <StyledLogo
            size={size}
            style={{
                ...style,
                background: stringToColour(currency.symbol).background,
                color: stringToColour(currency.symbol).text,
                border: stringToColour(currency.symbol).border,

                fontSize: size === "18px" ? "8px" : size === "24px" ? "12px" : "10px",
            }}
            {...rest}
        >
            {currency.symbol?.slice(0, 2)}
        </StyledLogo>
    );
}
