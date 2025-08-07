import React from "react";
import CurrencyLogo from "../CurrencyLogo";
import { Token } from "@uniswap/sdk-core";
import { WrappedCurrency } from "../../models/types";
import { HideMedium, MediumOnly } from "../../theme";
import { Label } from "../Text";
import { RowFixed } from "../Row";
import HoverInlineText from "../HoverInlineText";
import { ExternalLink } from "react-feather";
import AlgebraConfig from "algebra.config";
import { formatIpfsUrl, getOutcomeName } from "../../utils/market";
import "./EnhancedTokenRow.scss";

interface EnhancedTokenRowProps {
    address: string;
    symbol: string;
    name: string;
    market?: any;
}

export const EnhancedTokenRow: React.FC<EnhancedTokenRowProps> = ({ address, symbol, name, market }) => {
    // Get market image if available
    const marketImage = market?.image?.[0]?.cidMarket 
        ? formatIpfsUrl(market.image[0].cidMarket)
        : null;

    // Get human-readable outcome name if this is a market token
    const outcomeName = market ? getOutcomeName(market, address) : null;
    
    // Use outcome name if available, otherwise fall back to original name
    const displayName = outcomeName || name;
    const displaySymbol = outcomeName || symbol;

    return (
        <a className="link" href={`${AlgebraConfig.CHAIN_PARAMS.blockExplorerURL}/address/${address}`} rel="noopener noreferrer" target="_blank">
            <span className="enhanced-token-row hover-op trans-op">
                <span className="enhanced-token-row__content">
                    {marketImage ? (
                        <div className="enhanced-token-row__market-image">
                            <img 
                                src={marketImage} 
                                alt={market.marketName || "Market"} 
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.style.display = 'none';
                                }}
                            />
                        </div>
                    ) : (
                        <CurrencyLogo 
                            currency={new Token(AlgebraConfig.CHAIN_PARAMS.chainId, address, 18, symbol) as WrappedCurrency} 
                            size="20px" 
                        />
                    )}
                    
                    <div className="enhanced-token-row__text">
                        <MediumOnly>
                            <Label>{displaySymbol}</Label>
                        </MediumOnly>
                        <HideMedium>
                            <RowFixed>
                                <HoverInlineText text={displayName} maxCharacters={18} />
                            </RowFixed>
                        </HideMedium>
                        
                        {market && (
                            <div className="enhanced-token-row__market-name">
                                {market.marketName}
                            </div>
                        )}
                    </div>
                </span>
                <ExternalLink size={16} color="white" />
            </span>
        </a>
    );
};