/**
 * Global Data Store with Caching
 * 
 * Provides centralized state management and caching to:
 * - Prevent duplicate API calls
 * - Share data between pages
 * - Reduce re-renders
 * - Improve navigation performance
 */

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes default cache
const CACHE_DURATION_SHORT = 2 * 60 * 1000; // 2 minutes for frequently changing data
const CACHE_DURATION_LONG = 15 * 60 * 1000; // 15 minutes for static data

// Types
export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
}

export interface ClubData {
    id: string;
    name: string;
    description?: string;
    logo?: string | null;
    logoUrl?: string;
    image?: string;
    images?: string[];
    location?: string;
    address?: string;
    rating?: number;
    category?: string;
    isActive?: boolean;
    openTime?: string;
    [key: string]: any;
}

export interface EventData {
    id: string;
    title: string;
    description?: string;
    shortDescription?: string;
    imageUrl?: string | null;
    location?: string;
    startDateTime?: string;
    endDateTime?: string;
    clubId?: string;
    clubName?: string;
    [key: string]: any;
}

export interface StoryData {
    id: string;
    mediaUrl?: string;
    thumbnailUrl?: string;
    clubId?: string;
    clubName?: string;
    clubLogo?: string;
    [key: string]: any;
}

export interface PaginationInfo {
    page: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

// Cache store
class DataStore {
    private cache: Map<string, CacheEntry<any>> = new Map();
    private pendingRequests: Map<string, Promise<any>> = new Map();
    private subscribers: Map<string, Set<(data: any) => void>> = new Map();

    // ==================== CACHE MANAGEMENT ====================

    /**
     * Get cached data if valid
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    /**
     * Set cache data with expiration
     */
    set<T>(key: string, data: T, duration: number = CACHE_DURATION): void {
        const now = Date.now();
        this.cache.set(key, {
            data,
            timestamp: now,
            expiresAt: now + duration
        });
        this.notifySubscribers(key, data);
    }

    /**
     * Check if cache is valid
     */
    isValid(key: string): boolean {
        const entry = this.cache.get(key);
        if (!entry) return false;
        return Date.now() <= entry.expiresAt;
    }

    /**
     * Invalidate specific cache key
     */
    invalidate(key: string): void {
        this.cache.delete(key);
    }

    /**
     * Invalidate all cache keys matching a pattern
     */
    invalidatePattern(pattern: string): void {
        const regex = new RegExp(pattern);
        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear();
        this.pendingRequests.clear();
    }

    // ==================== REQUEST DEDUPLICATION ====================

    /**
     * Execute request with deduplication
     * Prevents same API from being called multiple times simultaneously
     */
    async dedupedRequest<T>(
        key: string,
        requestFn: () => Promise<T>,
        cacheDuration: number = CACHE_DURATION
    ): Promise<T> {
        // Check cache first
        const cached = this.get<T>(key);
        if (cached !== null) {
            console.log(`📦 Cache hit: ${key}`);
            return cached;
        }

        // Check if request is already pending
        const pending = this.pendingRequests.get(key);
        if (pending) {
            console.log(`⏳ Waiting for pending request: ${key}`);
            return pending;
        }

        // Execute new request
        console.log(`🌐 API call: ${key}`);
        const promise = requestFn()
            .then((data) => {
                this.set(key, data, cacheDuration);
                this.pendingRequests.delete(key);
                return data;
            })
            .catch((error) => {
                this.pendingRequests.delete(key);
                throw error;
            });

        this.pendingRequests.set(key, promise);
        return promise;
    }

    // ==================== SUBSCRIPTION SYSTEM ====================

    /**
     * Subscribe to cache updates
     */
    subscribe(key: string, callback: (data: any) => void): () => void {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set());
        }
        this.subscribers.get(key)!.add(callback);

        // Return unsubscribe function
        return () => {
            this.subscribers.get(key)?.delete(callback);
        };
    }

    /**
     * Notify subscribers of data change
     */
    private notifySubscribers(key: string, data: any): void {
        this.subscribers.get(key)?.forEach(callback => callback(data));
    }

    // ==================== SPECIFIC DATA GETTERS ====================

    // Clubs
    getClubsList(): { content: ClubData[], pagination: PaginationInfo } | null {
        return this.get('clubs:list');
    }

    getClubById(id: string): ClubData | null {
        return this.get(`clubs:detail:${id}`);
    }

    // Events
    getEventsList(): { content: EventData[], pagination: PaginationInfo } | null {
        return this.get('events:list');
    }

    getEventById(id: string): EventData | null {
        return this.get(`events:detail:${id}`);
    }

    // Stories
    getStoriesList(): { content: StoryData[], pagination: PaginationInfo } | null {
        return this.get('stories:list');
    }

    // Location
    getUserLocation(): any | null {
        return this.get('user:location');
    }

    // ==================== DEBUG ====================

    /**
     * Get cache stats for debugging
     */
    getStats() {
        const entries: { key: string; age: number; expiresIn: number }[] = [];
        const now = Date.now();

        this.cache.forEach((entry, key) => {
            entries.push({
                key,
                age: Math.round((now - entry.timestamp) / 1000),
                expiresIn: Math.round((entry.expiresAt - now) / 1000)
            });
        });

        return {
            totalEntries: this.cache.size,
            pendingRequests: this.pendingRequests.size,
            entries
        };
    }
}

// Export singleton instance
export const dataStore = new DataStore();

// Export cache duration constants
export { CACHE_DURATION, CACHE_DURATION_SHORT, CACHE_DURATION_LONG };

// Export cache keys for consistency
export const CACHE_KEYS = {
    // Lists
    CLUBS_LIST: 'clubs:list',
    EVENTS_LIST: 'events:list',
    STORIES_LIST: 'stories:list',

    // Details
    clubDetail: (id: string) => `clubs:detail:${id}`,
    eventDetail: (id: string) => `events:detail:${id}`,

    // User data
    USER_LOCATION: 'user:location',
    USER_PROFILE: 'user:profile',

    // Categories
    CLUB_CATEGORIES: 'clubs:categories',
    EVENT_CATEGORIES: 'events:categories',
};
