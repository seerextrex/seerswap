import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ExternalLink } from "react-feather";
import { TYPE } from "../../theme";
import { feeTierPercent } from "../../utils";
import { getOutcomeName, formatIpfsUrl } from "../../utils/market";
import AlgebraConfig from "algebra.config";

interface MarketData {
    id: string;
    marketName: string;
    outcomes?: string[];
    wrappedTokensString?: string | string[];
    image?: Array<{
        id: string;
        cidMarket: string;
        cidOutcomes: string[];
    }>;
}

interface EnhancedPoolCellProps {
    token0: any;
    token1: any;
    market0?: MarketData;
    market1?: MarketData;
    fee: string;
    address: string;
}

// This is a React component that can use hooks
export const EnhancedPoolCell = ({ token0, token1, market0, market1, fee, address }: EnhancedPoolCellProps) => {
    const [imageError, setImageError] = useState(false);
    
    // Get market information
    const market = market0 || market1;
    const marketImage = market?.image?.[0]?.cidMarket 
        ? formatIpfsUrl(market.image[0].cidMarket)
        : null;
    
    // Get outcome names
    const token0DisplayName = (() => {
        if (market0) {
            const outcomeName = getOutcomeName(market0 as any, token0.id);
            return outcomeName || token0.symbol;
        }
        return token0?.symbol || "...";
    })();
    
    const token1DisplayName = (() => {
        if (market1) {
            const outcomeName = getOutcomeName(market1 as any, token1.id);
            return outcomeName || token1.symbol;
        }
        return token1?.symbol || "...";
    })();
    
    // Arrange pool title
    const poolTitle = (() => {
        if (!token1 || !token0) return ["...", "..."];
        if (token0.symbol === "USDC") {
            return [token1DisplayName, token0DisplayName];
        }
        return [token0DisplayName, token1DisplayName];
    })();

    return (
        <div className="enhanced-pool-row f f-jc f-ac">
            <NavLink className="link f-ac" to={`/info/pools/${address}`}>
                {marketImage && !imageError ? (
                    <img 
                        src={marketImage} 
                        alt={market?.marketName || "Market"}
                        className="pool-market-image"
                        style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "6px",
                            marginRight: "8px",
                            objectFit: "cover",
                            border: "1px solid rgba(255, 255, 255, 0.1)"
                        }}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div 
                        className="pool-market-placeholder"
                        style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "6px",
                            marginRight: "8px",
                            background: "linear-gradient(135deg, rgba(79, 227, 193, 0.2) 0%, rgba(79, 227, 193, 0.1) 100%)",
                            border: "1px solid rgba(79, 227, 193, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            color: "var(--primary)"
                        }}
                    >
                        {market?.marketName ? market.marketName.slice(0, 1).toUpperCase() : "?"}
                    </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <TYPE.label style={{ marginBottom: "2px" }}>
                        {poolTitle[0]} / {poolTitle[1]}
                    </TYPE.label>
                    {market?.marketName && (
                        <TYPE.small style={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.5)" }}>
                            {market.marketName.length > 30 
                                ? market.marketName.slice(0, 30) + "..." 
                                : market.marketName}
                        </TYPE.small>
                    )}
                </div>
            </NavLink>
            <span className="fee-badge ml-05 mr-05">{feeTierPercent(+fee)}</span>
            <a 
                className="hover-op trans-op" 
                href={`${AlgebraConfig.CHAIN_PARAMS.blockExplorerURL}/address/${address}`} 
                rel="noopener noreferrer" 
                target="_blank"
            >
                <ExternalLink size={16} color="var(--white)" />
            </a>
        </div>
    );
};