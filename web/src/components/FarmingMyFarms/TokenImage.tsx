import React, { useState, useCallback, memo } from "react";
import { TokenImageProps } from "./types";
import SDAI_LOGO from "../../assets/images/sdai-logo.svg";

export const TokenImage = memo(({ imageUrl, tokenSymbol, size = 24 }: TokenImageProps) => {
    const [hasError, setHasError] = useState(false);

    const handleImageError = useCallback(() => {
        setHasError(true);
    }, []);

    const handleImageLoad = useCallback(() => {
        setHasError(false);
    }, []);

    // Special case for sDAI token
    if (tokenSymbol === 'sDAI') {
        return (
            <div className="token-image-container" style={{ width: size, height: size }}>
                <img
                    src={SDAI_LOGO}
                    alt={tokenSymbol}
                    className="token-image"
                    style={{ width: size, height: size }}
                />
            </div>
        );
    }

    if (!imageUrl || hasError) {
        return (
            <div
                className="token-image-placeholder"
                style={{ width: size, height: size, fontSize: Math.max(8, size * 0.4) }}
            >
                {tokenSymbol ? tokenSymbol.slice(0, 2).toUpperCase() : '??'}
            </div>
        );
    }

    return (
        <div className="token-image-container" style={{ width: size, height: size }}>
            <img
                src={imageUrl}
                alt={tokenSymbol}
                className="token-image"
                style={{ width: size, height: size }}
                onError={handleImageError}
                onLoad={handleImageLoad}
            />
        </div>
    );
});