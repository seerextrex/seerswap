import { useState, useCallback } from 'react';

interface UseImageLoaderResult {
    imageError: boolean;
    imageLoading: boolean;
    handleImageError: () => void;
    handleImageLoad: () => void;
}

export const useImageLoader = (): UseImageLoaderResult => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = useCallback(() => {
        setImageError(true);
        setImageLoading(false);
    }, []);

    const handleImageLoad = useCallback(() => {
        setImageLoading(false);
    }, []);

    return {
        imageError,
        imageLoading,
        handleImageError,
        handleImageLoad
    };
};