import { useState, useCallback, useEffect, useMemo } from 'react';
import { imageLoadingCache } from '@/lib/image-cache';

/**
 * Hook for optimized image loading with caching
 * Prevents duplicate image requests and handles fallbacks efficiently
 */
export function useOptimizedImage(
  imageUrl: string | undefined,
  fallbackUrl: string = '/placeholder/image.png'
) {
  const [displayUrl, setDisplayUrl] = useState(imageUrl || fallbackUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Determine which URL to show
  const urlToUse = useMemo(() => {
    if (!imageUrl) return fallbackUrl;
    
    // Check cache status
    const status = imageLoadingCache.getStatus(imageUrl);
    if (status === 'failed' || imageUrl.includes('placeholder') || imageUrl.includes('example.com')) {
      return fallbackUrl;
    }
    
    return imageUrl;
  }, [imageUrl, fallbackUrl]);

  useEffect(() => {
    if (!urlToUse || urlToUse === fallbackUrl) {
      setIsLoading(false);
      setDisplayUrl(urlToUse);
      return;
    }

    // Check if already cached
    const cacheStatus = imageLoadingCache.getStatus(urlToUse);
    if (cacheStatus === 'loaded') {
      setDisplayUrl(urlToUse);
      setIsLoading(false);
      setError(false);
      return;
    }

    if (cacheStatus === 'failed') {
      setDisplayUrl(fallbackUrl);
      setIsLoading(false);
      setError(true);
      return;
    }

    // Mark as loading if not already
    if (cacheStatus === 'pending') {
      imageLoadingCache.markLoading(urlToUse);
    }

    // Preload image
    const img = new Image();
    img.onload = () => {
      imageLoadingCache.markLoaded(urlToUse);
      setDisplayUrl(urlToUse);
      setIsLoading(false);
      setError(false);
    };
    img.onerror = () => {
      imageLoadingCache.markFailed(urlToUse);
      setDisplayUrl(fallbackUrl);
      setIsLoading(false);
      setError(true);
    };
    img.src = urlToUse;
  }, [urlToUse, fallbackUrl]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== fallbackUrl) {
      imageLoadingCache.markFailed(target.src);
      target.src = fallbackUrl;
      setError(true);
    }
  }, [fallbackUrl]);

  return { displayUrl, isLoading, error, handleImageError };
}

/**
 * Hook for handling multiple images in a gallery
 */
export function useOptimizedImages(
  imageUrls: (string | undefined)[],
  fallbackUrl: string = '/placeholder/image.png'
) {
  const [displayUrls, setDisplayUrls] = useState(imageUrls.map(url => url || fallbackUrl));
  const loadedCount = displayUrls.filter(url => imageLoadingCache.isLoaded(url)).length;

  useEffect(() => {
    // Preload all images
    const preloadImages = async () => {
      const results = imageUrls.map(url => {
        if (!url) return fallbackUrl;

        const cacheStatus = imageLoadingCache.getStatus(url);
        if (cacheStatus === 'loaded') return url;
        if (cacheStatus === 'failed') return fallbackUrl;

        return new Promise<string>(resolve => {
          const img = new Image();
          img.onload = () => {
            imageLoadingCache.markLoaded(url);
            resolve(url);
          };
          img.onerror = () => {
            imageLoadingCache.markFailed(url);
            resolve(fallbackUrl);
          };
          img.src = url;
        });
      });

      const resolved = await Promise.all(results);
      setDisplayUrls(resolved);
    };

    preloadImages();
  }, [imageUrls, fallbackUrl]);

  return { displayUrls, loadedCount, totalCount: imageUrls.length };
}
