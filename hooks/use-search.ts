'use client';

import { useState, useCallback } from 'react';
import {
  SearchService,
  NearbySearchParams,
  SearchEvent,
  SearchClub,
  BalancedSearchResponse,
  NearbyAllResponse,
  NearbyDetailsResponse,
} from '@/lib/services/search.service';
import { resolveLocation, getStoredLocation, SavedLocation, DEFAULT_RADIUS, persistCustomLocation } from '@/lib/location';
import { toast } from '@/hooks/use-toast';

export interface UseSearchState {
  // Loading states
  isSearching: boolean;
  isLoadingNearby: boolean;
  isLoadingCategories: boolean;
  isGettingLocation: boolean;

  // Data states
  events: SearchEvent[];
  clubs: SearchClub[];
  categories: string[];
  balancedResults: BalancedSearchResponse | null;
  nearbyResults: NearbyAllResponse | null;
  nearbyDetails: NearbyDetailsResponse | null;

  // Location state
  currentLocation: SavedLocation | null;

  // Error states
  error: string | null;
  locationError: string | null;
  isLoadingNearbyDetails: boolean;
}

export interface UseSearchActions {
  // Search actions
  searchEvents: (query: string) => Promise<void>;
  searchClubs: (query: string) => Promise<void>;
  searchBalanced: (query: string) => Promise<void>;
  searchNearby: (params?: Partial<NearbySearchParams>) => Promise<void>;

  // Location actions
  getCurrentLocation: () => Promise<SavedLocation>;
  refreshLocation: () => Promise<void>;

  // Category actions
  loadCategories: () => Promise<void>;

  // Universal search
  universalSearch: (query: string) => Promise<void>;
  fetchNearbyDetails: (params: { id?: string; placeId?: string }) => Promise<NearbyDetailsResponse | null>;

  // Utility actions
  clearResults: () => void;
  clearError: () => void;
}

export function useSearch(): UseSearchState & UseSearchActions {
  // State
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingNearby, setIsLoadingNearby] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [events, setEvents] = useState<SearchEvent[]>([]);
  const [clubs, setClubs] = useState<SearchClub[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [balancedResults, setBalancedResults] = useState<BalancedSearchResponse | null>(null);
  const [nearbyResults, setNearbyResults] = useState<NearbyAllResponse | null>(null);
  const [nearbyDetails, setNearbyDetails] = useState<NearbyDetailsResponse | null>(null);

  const [currentLocation, setCurrentLocation] = useState<SavedLocation | null>(
    getStoredLocation() || (typeof window === 'undefined' ? null : resolveLocation())
  );

  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingNearbyDetails, setIsLoadingNearbyDetails] = useState(false);

  // Get current location with geolocation fallback
  const getCurrentLocation = useCallback(async (): Promise<SavedLocation> => {
    setIsGettingLocation(true);
    setLocationError(null);

    try {
      // First try stored location
      const stored = getStoredLocation();
      if (stored) {
        setCurrentLocation(stored);
        setIsGettingLocation(false);
        return stored;
      }

      // Try to get current geolocation
      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const location = persistCustomLocation({
                name: 'Current Location',
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }, 'geo');
              setCurrentLocation(location);
              setIsGettingLocation(false);
              resolve(location);
            },
            (geoError) => {
              console.warn('Geolocation failed:', geoError);
              const fallback = resolveLocation();
              setCurrentLocation(fallback);
              setLocationError('Unable to get your exact location. Using default location.');
              setIsGettingLocation(false);
              resolve(fallback);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000 // 5 minutes
            }
          );
        });
      } else {
        // Geolocation not supported
        const fallback = resolveLocation();
        setCurrentLocation(fallback);
        setLocationError('Geolocation not supported. Using default location.');
        setIsGettingLocation(false);
        return fallback;
      }
    } catch (error) {
      console.error('Error getting location:', error);
      const fallback = resolveLocation();
      setCurrentLocation(fallback);
      setLocationError('Failed to get location. Using default location.');
      setIsGettingLocation(false);
      return fallback;
    }
  }, []);

  // Refresh location
  const refreshLocation = useCallback(async (): Promise<void> => {
    await getCurrentLocation();
  }, [getCurrentLocation]);

  // Search events
  const searchEvents = useCallback(async (query: string): Promise<void> => {
    if (!query.trim()) {
      setError('Search query is required');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await SearchService.searchEvents(query.trim());
      if (response.success && response.data) {
        setEvents(response.data);
      } else {
        setEvents([]);
        if (response.message) {
          setError(response.message);
        }
      }
    } catch (error: any) {
      console.error('Search events error:', error);
      setError(error.message || 'Failed to search events');
      setEvents([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Search clubs
  const searchClubs = useCallback(async (query: string): Promise<void> => {
    if (!query.trim()) {
      setError('Search query is required');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await SearchService.searchClubs(query.trim());
      if (response.success && response.data) {
        setClubs(response.data);
      } else {
        setClubs([]);
        if (response.message) {
          setError(response.message);
        }
      }
    } catch (error: any) {
      console.error('Search clubs error:', error);
      setError(error.message || 'Failed to search clubs');
      setClubs([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Balanced search
  const searchBalanced = useCallback(async (query: string): Promise<void> => {
    if (!query.trim()) {
      setError('Search query is required');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await SearchService.searchBalanced(query.trim());
      if (response.success && response.data) {
        setBalancedResults(response.data);
      } else {
        setBalancedResults(null);
        if (response.message) {
          setError(response.message);
        }
      }
    } catch (error: any) {
      console.error('Balanced search error:', error);
      setError(error.message || 'Failed to perform balanced search');
      setBalancedResults(null);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Search nearby with location
  const searchNearby = useCallback(async (params: Partial<NearbySearchParams> = {}): Promise<void> => {
    setIsLoadingNearby(true);
    setError(null);

    try {
      // Get location if not provided
      const location = await getCurrentLocation();
      const lat = params.lat ?? location?.lat ?? location?.latitude;
      const lng = params.lng ?? location?.lng ?? location?.longitude;
      if (typeof lat !== 'number' || typeof lng !== 'number') {
        throw new Error('Unable to determine coordinates for nearby search');
      }

      const searchParams: NearbySearchParams = {
        lat,
        lng,
        radius: params.radius || location?.radius || DEFAULT_RADIUS,
        category: params.category
      };

      // Simple in-memory/localStorage cache (5 min TTL) to avoid refetching identical coordinates repeatedly
      const CACHE_KEY = 'clubviz.nearbyCache';
      const now = Date.now();
      const cacheId = `${searchParams.lat}:${searchParams.lng}:${searchParams.radius}:${searchParams.category || 'all'}`;
      if (typeof window !== 'undefined') {
        try {
          const rawCache = window.localStorage.getItem(CACHE_KEY);
          if (rawCache) {
            const parsed: { id: string; timestamp: number; payload: NearbyAllResponse } = JSON.parse(rawCache);
            // Reuse cache only if id matches and data is fresh (<5 minutes) AND has results
            if (parsed.id === cacheId && (now - parsed.timestamp) < 5 * 60 * 1000) {
              if (parsed.payload?.results?.length > 0) {
                console.log('[searchNearby] Using cached results:', parsed.payload.results.length);
                setNearbyResults(parsed.payload);
                setIsLoadingNearby(false);
                return;
              }
            }
          }
        } catch (e) {
          console.warn('Nearby cache read failed:', e);
        }
      }

      const response = await SearchService.findNearbyAll(searchParams);
      if (response) {
        // API returns data directly, not wrapped in ApiResponse structure
        const raw: any = (response as any).data || response;
        console.log('[searchNearby] API response:', { clubs: raw.clubs?.length, events: raw.events?.length, metadata: raw.metadata });
        // Normalize metadata (API may return `metadata` instead of `meta`)
        const metadata = raw.metadata || raw.meta || {};
        const meta: NearbySearchMeta = {
          radius: metadata.radius ?? searchParams.radius,
          category: metadata.category ?? searchParams.category,
          center: {
            lat: metadata.latitude ?? searchParams.lat,
            lng: metadata.longitude ?? searchParams.lng,
          },
          total: (metadata.clubsCount || 0) + (metadata.eventsCount || 0),
          fetchedAt: new Date().toISOString(),
        };

        // Build unified summary list for UI
        const results: NearbyResultSummary[] = [];
        if (Array.isArray(raw.clubs)) {
          raw.clubs.forEach((club: any) => {
            const map = club.locationMap;
            const summary: NearbyResultSummary = {
              id: club.id,
              name: club.name,
              description: club.description,
              address: club.locationText?.fullAddress || club.locationText?.address1,
              lat: typeof map?.[1] === 'number' ? map[1] : meta.center.lat,
              lng: typeof map?.[0] === 'number' ? map[0] : meta.center.lng,
              type: 'club',
              category: club.category || 'Club',
              metadata: { rating: club.rating, isActive: club.isActive },
            };
            results.push(summary);
          });
        }
        if (Array.isArray(raw.events)) {
          raw.events.forEach((event: any) => {
            const map = event.locationMap;
            const summary: NearbyResultSummary = {
              id: event.id,
              name: event.title,
              description: event.description,
              address: event.location || event.locationText,
              lat: typeof map?.[1] === 'number' ? map[1] : meta.center.lat,
              lng: typeof map?.[0] === 'number' ? map[0] : meta.center.lng,
              type: 'event',
              category: 'Event',
              metadata: { start: event.startDateTime, end: event.endDateTime },
            };
            results.push(summary);
          });
        }

        console.log('[searchNearby] Normalized results:', results.length, results.map((r: NearbyResultSummary) => r.name));

        const normalized: NearbyAllResponse = {
          clubs: raw.clubs || [],
          events: raw.events || [],
          results,
          meta,
        };
        setNearbyResults(normalized);
        console.log('[searchNearby] State updated with', results.length, 'results');

        // Persist cache
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(CACHE_KEY, JSON.stringify({ id: cacheId, timestamp: now, payload: normalized }));
            console.log('[searchNearby] Cache written for:', cacheId);
          } catch (e) {
            console.warn('Nearby cache write failed:', e);
          }
        }
      } else {
        setNearbyResults(null);
        // response is the unwrapped data, not ApiResponse
        console.warn('[searchNearby] No data in response');
      }
    } catch (error: any) {
      console.error('Nearby search error:', error);
      setError(error.message || 'Failed to search nearby locations');
      setNearbyResults(null);
    } finally {
      setIsLoadingNearby(false);
    }
  }, [getCurrentLocation]);

  // Load categories
  const loadCategories = useCallback(async (): Promise<void> => {
    setIsLoadingCategories(true);
    setError(null);

    try {
      const response = await SearchService.getSearchCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        // Set default categories if API fails
        setCategories(['CLUBS', 'EVENTS']);
        if (response.message) {
          console.warn('Categories API failed:', response.message);
        }
      }
    } catch (error: any) {
      console.error('Load categories error:', error);
      // Set default categories on error
      setCategories(['CLUBS', 'EVENTS']);
      toast({
        title: 'Categories Error',
        description: 'Failed to load categories. Using defaults.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  // Universal search (search events, clubs, and balanced results)
  const universalSearch = useCallback(async (query: string): Promise<void> => {
    if (!query.trim()) {
      setError('Search query is required');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Execute all searches in parallel
      const [eventsResponse, clubsResponse, balancedResponse] = await Promise.allSettled([
        SearchService.searchEvents(query.trim()),
        SearchService.searchClubs(query.trim()),
        SearchService.searchBalanced(query.trim())
      ]);

      // Handle events results
      if (eventsResponse.status === 'fulfilled' && eventsResponse.value.success) {
        setEvents(eventsResponse.value.data || []);
      } else {
        setEvents([]);
      }

      // Handle clubs results
      if (clubsResponse.status === 'fulfilled' && clubsResponse.value.success) {
        setClubs(clubsResponse.value.data || []);
      } else {
        setClubs([]);
      }

      // Handle balanced results
      if (balancedResponse.status === 'fulfilled' && balancedResponse.value.success) {
        setBalancedResults(balancedResponse.value.data || null);
      } else {
        setBalancedResults(null);
      }

      // Show success message
      toast({
        title: 'Search Complete',
        description: `Found results for "${query}"`,
      });

    } catch (error: any) {
      console.error('Universal search error:', error);
      setError(error.message || 'Failed to perform search');
      setEvents([]);
      setClubs([]);
      setBalancedResults(null);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Clear results
  const clearResults = useCallback((): void => {
    setEvents([]);
    setClubs([]);
    setBalancedResults(null);
    setNearbyResults(null);
    setNearbyDetails(null);
    setError(null);
    setLocationError(null);
  }, []);

  // Clear error
  const clearError = useCallback((): void => {
    setError(null);
    setLocationError(null);
  }, []);

  const fetchNearbyDetails = useCallback(async (params: { id?: string; placeId?: string }): Promise<NearbyDetailsResponse | null> => {
    if (!params.id && !params.placeId) {
      setError('Missing place identifier');
      return null;
    }

    setIsLoadingNearbyDetails(true);
    try {
      const response = await SearchService.getNearbyDetails({
        id: params.id,
        place_id: params.placeId,
      });
      if (response.success && response.data) {
        setNearbyDetails(response.data);
        return response.data;
      }
      setNearbyDetails(null);
      if (response.message) {
        setError(response.message);
      }
      return null;
    } catch (error: any) {
      console.error('Nearby details error:', error);
      setNearbyDetails(null);
      setError(error.message || 'Failed to load nearby details');
      throw error;
    } finally {
      setIsLoadingNearbyDetails(false);
    }
  }, []);

  return {
    // State
    isSearching,
    isLoadingNearby,
    isLoadingCategories,
    isGettingLocation,
    events,
    clubs,
    categories,
    balancedResults,
    nearbyResults,
    nearbyDetails,
    currentLocation,
    error,
    locationError,
    isLoadingNearbyDetails,

    // Actions
    searchEvents,
    searchClubs,
    searchBalanced,
    searchNearby,
    getCurrentLocation,
    refreshLocation,
    loadCategories,
    universalSearch,
    clearResults,
    clearError,
    fetchNearbyDetails,
  };
}