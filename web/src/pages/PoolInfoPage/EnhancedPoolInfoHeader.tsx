import { useMemo, useState } from "react";
import { Token } from "@uniswap/sdk-core";
import DoubleCurrencyLogo from "../../components/DoubleLogo";
import { getOutcomeName, formatIpfsUrl } from "../../utils/market";
import "./index.scss";
import { Trans } from "@lingui/macro";
import AlgebraConfig from "algebra.config";
import { NavLink } from "react-router-dom";

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

interface EnhancedPoolInfoHeaderProps {
    token0: Token | undefined;
    token1: Token | undefined;
    fee: string;
    collectedFees: string;
    poolResult?: any;
}

const OutcomeTokenDisplay = ({ 
    token, 
    market, 
    isToken0 
}: { 
    token: Token | undefined; 
    market: MarketData | null | undefined;
    isToken0: boolean;
}) => {
    const [imageError, setImageError] = useState(false);
    
    const { outcomeName, outcomeImage } = useMemo(() => {
        if (!token || !market) {
            return { outcomeName: null, outcomeImage: null };
        }
        
        const name = getOutcomeName(market as any, token.address);
        
        // Get the outcome image if available
        let image: string | null = null;
        if (market.image?.[0]?.cidOutcomes && name && market.outcomes) {
            const outcomeIndex = market.outcomes.indexOf(name);
            if (outcomeIndex >= 0 && market.image[0].cidOutcomes[outcomeIndex]) {
                image = formatIpfsUrl(market.image[0].cidOutcomes[outcomeIndex]);
            }
        }
        
        return { outcomeName: name, outcomeImage: image };
    }, [token, market]);
    
    const displayName = outcomeName || token?.symbol || "...";
    
    return (
        <div className="outcome-token-display">
            {outcomeImage && !imageError ? (
                <img 
                    src={outcomeImage} 
                    alt={displayName}
                    className="outcome-token-image"
                    onError={() => setImageError(true)}
                />
            ) : (
                <div className="outcome-token-placeholder">
                    {displayName.slice(0, 1).toUpperCase()}
                </div>
            )}
            <span className="outcome-token-name">{displayName}</span>
        </div>
    );
};

export function EnhancedPoolInfoHeader({ 
    token0, 
    token1, 
    fee, 
    collectedFees,
    poolResult
}: EnhancedPoolInfoHeaderProps) {
    const [marketImageError, setMarketImageError] = useState(false);
    
    // Get market from poolResult
    const market0 = poolResult?.market0;
    const market1 = poolResult?.market1;
    
    // Determine which market corresponds to which token
    const token0Market = market0;
    const token1Market = market1;
    
    // Get market image for header
    const marketImage = useMemo(() => {
        const market = market0 || market1;
        if (market?.image?.[0]?.cidMarket) {
            return formatIpfsUrl(market.image[0].cidMarket);
        }
        return null;
    }, [market0, market1]);
    
    const marketName = (market0 || market1)?.marketName || "";

    return (
        <div className="enhanced-pool-header b mb-1">
            <div className="flex-s-between info-pool-header">
                <div className="f f-ac mxs_w-100">
                    {marketImage && !marketImageError && (
                        <div className="market-image-wrapper mr-1">
                            <img 
                                src={marketImage} 
                                alt={marketName}
                                className="market-main-image"
                                onError={() => setMarketImageError(true)}
                            />
                        </div>
                    )}
                    
                    <div className="pool-tokens-display">
                        <div className="pool-pair-wrapper">
                            <OutcomeTokenDisplay 
                                token={token0} 
                                market={token0Market} 
                                isToken0={true}
                            />
                            <span className="pair-separator">/</span>
                            <OutcomeTokenDisplay 
                                token={token1} 
                                market={token1Market} 
                                isToken0={false}
                            />
                        </div>
                        {marketName && (
                            <div className="market-name-subtitle">
                                {marketName}
                            </div>
                        )}
                    </div>
                    
                    <span className="ml-1 br-8 fee-badge c-p mxs_ml-a">{`${+fee / 10000}%`}</span>
                </div>
                
                <div>
                    <NavLink 
                        className="btn primary p-05 br-8 mr-1" 
                        to={`/add/${token0?.address}/${token1?.address}/select-pair`}
                    >
                        Add liquidity
                    </NavLink>
                    {+collectedFees !== 0 && (
                        <span className="ml-a mxs_w-100 mxs_mt-1">
                            <Trans>
                                Total Collected Fees: <span className="c-p">${Math.round(+collectedFees) || " <0.001"}</span>
                            </Trans>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}