'use client';

import { useState, useCallback } from 'react';
import { SearchService, NearbySearchParams, NearbyEvent, NearbyClub, BalancedSearchResponse } from '@/lib/services/search.service';
import { resolveLocation, getStoredLocation, SavedLocation } from '@/lib/location';
import { toast } from '@/hooks/use-toast';

export interface UseSearchState {
  // Loading states
  isSearching: boolean;
  isLoadingNearby: boolean;
  isLoadingCategories: boolean;
  isGettingLocation: boolean;

  // Data states
  events: NearbyEvent[];
  clubs: NearbyClub[];
  categories: string[];
  balancedResults: BalancedSearchResponse | null;
  nearbyResults: {
    events?: NearbyEvent[];
    clubs?: NearbyClub[];
  } | null;

  // Location state
  currentLocation: SavedLocation | null;
  
  // Error states
  error: string | null;
  locationError: string | null;
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
  
  const [events, setEvents] = useState<NearbyEvent[]>([]);
  const [clubs, setClubs] = useState<NearbyClub[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [balancedResults, setBalancedResults] = useState<BalancedSearchResponse | null>(null);
  const [nearbyResults, setNearbyResults] = useState<{
    events?: NearbyEvent[];
    clubs?: NearbyClub[];
  } | null>(null);
  
  const [currentLocation, setCurrentLocation] = useState<SavedLocation | null>(
    getStoredLocation()
  );
  
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

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
              const location: SavedLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                radius: 5000,
                label: 'Current Location'
              };
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
      
      const searchParams: NearbySearchParams = {
        lat: params.lat || location.latitude,
        lng: params.lng || location.longitude,
        radius: params.radius || location.radius || 5000,
        category: params.category
      };

      const response = await SearchService.findNearbyAll(searchParams);
      if (response.success && response.data) {
        setNearbyResults(response.data);
      } else {
        setNearbyResults(null);
        if (response.message) {
          setError(response.message);
        }
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
    setError(null);
    setLocationError(null);
  }, []);

  // Clear error
  const clearError = useCallback((): void => {
    setError(null);
    setLocationError(null);
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
    currentLocation,
    error,
    locationError,

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
  };
}