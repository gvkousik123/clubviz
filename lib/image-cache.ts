/**
 * Simple in-memory image loading cache
 * Prevents duplicate image requests and improves performance
 */

class ImageLoadingCache {
  private loadingSet: Set<string> = new Set();
  private loadedSet: Set<string> = new Set();
  private failedSet: Set<string> = new Set();

  /**
   * Check if an image URL is currently loading
   */
  isLoading(url: string): boolean {
    return this.loadingSet.has(url);
  }

  /**
   * Mark an image as loading
   */
  markLoading(url: string): void {
    this.loadingSet.add(url);
  }

  /**
   * Mark an image as successfully loaded
   */
  markLoaded(url: string): void {
    this.loadingSet.delete(url);
    this.loadedSet.add(url);
    this.failedSet.delete(url);
  }

  /**
   * Mark an image as failed
   */
  markFailed(url: string): void {
    this.loadingSet.delete(url);
    this.failedSet.add(url);
  }

  /**
   * Check if an image has been successfully loaded
   */
  isLoaded(url: string): boolean {
    return this.loadedSet.has(url);
  }

  /**
   * Check if an image failed to load
   */
  hasFailed(url: string): boolean {
    return this.failedSet.has(url);
  }

  /**
   * Get status of an image
   */
  getStatus(url: string): 'loading' | 'loaded' | 'failed' | 'pending' {
    if (this.loadingSet.has(url)) return 'loading';
    if (this.loadedSet.has(url)) return 'loaded';
    if (this.failedSet.has(url)) return 'failed';
    return 'pending';
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.loadingSet.clear();
    this.loadedSet.clear();
    this.failedSet.clear();
  }
}

export const imageLoadingCache = new ImageLoadingCache();
