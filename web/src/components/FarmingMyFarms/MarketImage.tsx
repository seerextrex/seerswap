import React, { useState, useCallback, useMemo, memo } from "react";
import { MarketImageProps } from "./types";

export const MarketImage = memo(({ market, marketName }: MarketImageProps) => {
    const [hasError, setHasError] = useState(false);

    const marketImageUrl = useMemo(() => {
        if (!market?.image?.[0]?.cidMarket) return null;
        return `https://ipfs.io${market.image[0].cidMarket}`;
    }, [market?.image]);

    const handleImageError = useCallback(() => {
        setHasError(true);
    }, []);

    if (!marketImageUrl || hasError) {
        return (
            <div className="my-farms__market-image-placeholder">
                {marketName ? marketName.slice(0, 1).toUpperCase() : '?'}
            </div>
        );
    }

    return (
        <div className="my-farms__market-image-container">
            <img
                src={marketImageUrl}
                alt={marketName}
                className="my-farms__market-image"
                onError={handleImageError}
            />
        </div>
    );
});