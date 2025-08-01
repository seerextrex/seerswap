import { useCallback, useContext } from "react";
import { Currency, Price } from "@uniswap/sdk-core";
import { Text } from "rebass";
import { StyledPriceContainer } from "./styled";
import { ThemeContext } from "styled-components/macro";
import { ReactComponent as DoubleArrow } from "../../assets/svg/double-arrow.svg";
// import { useLingui } from "@lingui/react"; // Temporarily commented out

interface TradePriceProps {
    price: Price<Currency, Currency>;
    showInverted: boolean;
    setShowInverted: (showInverted: boolean) => void;
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
    const theme = useContext(ThemeContext);
    // const { t } = useLingui(); // Temporarily commented out

    const formattedPrice = showInverted ? price?.invert()?.toSignificant(6) : price?.toSignificant(6);

    // Corrected label and labelInverted declarations and temporarily removed i18n
    const baseSymbol = price?.baseCurrency?.symbol ?? '';
    const quoteSymbol = price?.quoteCurrency?.symbol ?? '';

    const labelStr = showInverted ? `${quoteSymbol} per ${baseSymbol}` : `${baseSymbol} per ${quoteSymbol}`;
    const labelInvertedStr = showInverted ? baseSymbol : quoteSymbol;

    const flipPrice = useCallback(() => setShowInverted(!showInverted), [setShowInverted, showInverted]);

    const priceText = formattedPrice ? `1 ${labelInvertedStr} = ${formattedPrice}` : "-";
    const text = `${priceText} ${labelStr}`;

    return (
        <StyledPriceContainer
            onClick={flipPrice}
            title={text}
            style={{ width: "100%", padding: "2.5rem 1rem 1.5rem 1rem", marginTop: "-25px", borderBottomLeftRadius: "20px", borderBottomRightRadius: "20px", background: "rgba(43,45,59,.3)" }}
        >
            <div style={{ alignItems: "center", display: "flex", width: "100%", justifyContent: "space-between" }}>
                <Text fontWeight={500} fontSize={14} color={theme.text1}>
                    Price:
                </Text>
                <Text fontWeight={500} fontSize={14} color={theme.text1} style={{ display: "flex" }}>
                    {text}
                    <DoubleArrow style={{ marginLeft: "5px", color: theme.primary2 }} />
                </Text>
            </div>
        </StyledPriceContainer>
    );
}
