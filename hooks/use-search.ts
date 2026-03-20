'use client';

import { useState, useCallback } from 'react';
import {
    SearchService,
    SearchV2Response,
    SearchClubV2,
    SearchEventV2,
    NearbySearchParamsV2,
    AutocompleteSuggestion,
    AdvancedSearchParams
} from '@/lib/services/search.service';
import { resolveLocation, getStoredLocation, SavedLocation, DEFAULT_RADIUS, persistCustomLocation } from '@/lib/location';
import { toast } from '@/hooks/use-toast';

// Export types compatible with UI
export interface NearbyResultSummary {
    id: string;
    name: string;
    description?: string;
    address?: string;
    lat: number;
    lng: number;
    type: 'CLUB' | 'EVENT';
    imageUrl?: string;
    place_id?: string; // For compatibility
    metadata?: any;
}

export interface UseSearchState {
    isSearching: boolean;
    isLoadingNearby: boolean;
    isLoadingCategories: boolean; // keep for compat
    isGettingLocation: boolean; // keep for compat

    searchResults: SearchV2Response | null;
    autocompleteSuggestions: AutocompleteSuggestion[];

    // Adapted for UI
    nearbyResults: { results: NearbyResultSummary[] } | null;
    nearbyDetails: any | null; // compat

    events: SearchEventV2[];
    clubs: SearchClubV2[];
    categories: string[]; // compat
    balancedResults: any | null; // compat

    currentLocation: SavedLocation | null;
    error: string | null;
    locationError: string | null; // compat
    isLoadingNearbyDetails: boolean; // compat
}

export interface UseSearchActions {
    searchNearby: (params?: Partial<NearbySearchParamsV2> & { radius?: number, category?: string }) => Promise<void>;
    universalSearch: (query: string) => Promise<void>;
    searchQuick: (query: string, searchType?: 'ALL' | 'CLUBS_ONLY' | 'EVENTS_ONLY') => Promise<void>;
    searchAdvanced: (params: AdvancedSearchParams) => Promise<void>;
    getAutocompleteSuggestions: (query: string) => Promise<void>;
    getCurrentLocation: () => Promise<SavedLocation>;
    refreshLocation: () => Promise<void>;
    clearResults: () => void;
    clearError: () => void;
    loadCategories: () => Promise<void>; // compat
    fetchNearbyDetails: (params: { id?: string; placeId?: string }) => Promise<any | null>;
    searchEvents: (query: string) => Promise<void>; // compat
    searchClubs: (query: string) => Promise<void>; // compat
    searchBalanced: (query: string) => Promise<void>; // compat
}

export function useSearch(): UseSearchState & UseSearchActions {
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingNearby, setIsLoadingNearby] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchV2Response | null>(null);
    const [nearbyResults, setNearbyResults] = useState<{ results: NearbyResultSummary[] } | null>(null);
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<AutocompleteSuggestion[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [currentLocation, setCurrentLocation] = useState<SavedLocation | null>(
        getStoredLocation() || (typeof window === 'undefined' ? null : resolveLocation())
    );
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    const getCurrentLocation = useCallback(async (): Promise<SavedLocation> => {
        setIsGettingLocation(true);
        try {
            const stored = getStoredLocation();
            if (stored) {
                setCurrentLocation(stored);
                return stored;
            }
            if (typeof window !== 'undefined' && 'geolocation' in navigator) {
                return new Promise((resolve) => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const loc = persistCustomLocation({
                                name: 'Current Location',
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            }, 'geo');
                            setCurrentLocation(loc);
                            setIsGettingLocation(false);
                            resolve(loc);
                        },
                        () => {
                            const fallback = resolveLocation();
                            setCurrentLocation(fallback);
                            setIsGettingLocation(false);
                            resolve(fallback);
                        }
                    );
                });
            }
            const fallback = resolveLocation();
            setCurrentLocation(fallback);
            return fallback;
        } finally {
            setIsGettingLocation(false);
        }
    }, []);

    const refreshLocation = useCallback(async (): Promise<void> => {
        await getCurrentLocation();
    }, [getCurrentLocation]);

    const getAutocompleteSuggestions = useCallback(async (query: string) => {
        if (!query || query.length < 2) {
            setAutocompleteSuggestions([]);
            return;
        }
        try {
            const response = await SearchService.autocomplete(query);
            setAutocompleteSuggestions(response.suggestions || []);
        } catch (error) {
            console.error(error);
            setAutocompleteSuggestions([]);
        }
    }, []);

    const searchNearby = useCallback(async (params: Partial<NearbySearchParamsV2> & { radius?: number, category?: string } = {}) => {
        setIsLoadingNearby(true);
        setError(null);
        try {
            const location = await getCurrentLocation();
            const lat = params.lat ?? location?.lat;
            const lng = params.lng ?? location?.lng;

            if (!lat || !lng) throw new Error("Location required");

            const radiusKm = params.radiusKm ?? (params.radius ? params.radius / 1000 : 5);

            const apiParams: NearbySearchParamsV2 = {
                lat,
                lng,
                radiusKm
            };

            const response = await SearchService.nearbySearch(apiParams);
            setSearchResults(response);

            // Adapt to nearbyResults
            const summaries: NearbyResultSummary[] = [];
            
            // Only include clubs with valid coordinates
            response.clubs?.forEach(c => {
                if (c.coordinates?.latitude && c.coordinates?.longitude) {
                    summaries.push({
                        id: c.id,
                        name: c.name,
                        description: c.description,
                        address: c.address || '',
                        lat: c.coordinates.latitude,
                        lng: c.coordinates.longitude,
                        type: 'CLUB',
                        imageUrl: c.logoUrl || c.images?.[0] || '',
                        metadata: { rating: c.rating || 0, isActive: true }
                    });
                }
            });
            
            // Only include events with valid coordinates
            response.events?.forEach(e => {
                if (e.coordinates?.latitude && e.coordinates?.longitude) {
                    summaries.push({
                        id: e.id,
                        name: e.title,
                        description: e.description,
                        address: e.location || '',
                        lat: e.coordinates.latitude,
                        lng: e.coordinates.longitude,
                        type: 'EVENT',
                        imageUrl: e.imageUrl || e.images?.[0] || '',
                        metadata: { start: e.startDateTime }
                    });
                }
            });

            setNearbyResults({ results: summaries });

        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoadingNearby(false);
        }
    }, [getCurrentLocation]);

    const searchAdvanced = useCallback(async (params: AdvancedSearchParams) => {
        setIsSearching(true);
        try {
            const response = await SearchService.advancedSearch(params);
            setSearchResults(response);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const searchQuick = useCallback(async (query: string, searchType: 'ALL' | 'CLUBS_ONLY' | 'EVENTS_ONLY' = 'ALL') => {
        if (!query.trim()) return;
        setIsSearching(true);
        setError(null);
        try {
            const loc = currentLocation;
            const response = await SearchService.quickSearch({
                query: query.trim(),
                lat: loc?.lat,
                lng: loc?.lng,
                radiusKm: 50,
                searchType
            });
            setSearchResults(response);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsSearching(false);
        }
    }, [currentLocation]);

    const universalSearch = useCallback(async (query: string) => {
        if (!query.trim()) return;
        setIsSearching(true);
        setError(null);
        try {
            const loc = currentLocation;
            const response = await SearchService.advancedSearch({
                query: query.trim(),
                latitude: loc?.lat,
                longitude: loc?.lng,
                radiusKm: 50,
                searchType: 'ALL'
            });
            setSearchResults(response);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsSearching(false);
        }
    }, [currentLocation]);

    const clearResults = useCallback(() => {
        setSearchResults(null);
        setNearbyResults(null);
        setAutocompleteSuggestions([]);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
        setLocationError(null);
    }, []);

    // Stubs for backward compatibility
    const fetchNearbyDetails = useCallback(async (params: { id?: string }) => {
        // Return data from searchResults if available
        if (searchResults) {
            const club = searchResults.clubs.find(c => c.id === params.id);
            if (club) return club;
            const event = searchResults.events.find(e => e.id === params.id);
            if (event) return event;
        }
        return null;
    }, [searchResults]);

    const loadCategories = useCallback(async () => { }, []);
    const searchEvents = useCallback(async (q: string) => { await universalSearch(q); }, [universalSearch]);
    const searchClubs = useCallback(async (q: string) => { await universalSearch(q); }, [universalSearch]);
    const searchBalanced = useCallback(async (q: string) => { await universalSearch(q); }, [universalSearch]);

    return {
        isSearching,
        isLoadingNearby,
        isLoadingCategories: false,
        isGettingLocation,

        searchResults,
        autocompleteSuggestions,

        nearbyResults,
        events: searchResults?.events || [],
        clubs: searchResults?.clubs || [],
        categories: [],
        balancedResults: null,
        nearbyDetails: null,

        currentLocation,
        error,
        locationError,
        isLoadingNearbyDetails: false,

        searchNearby,
        universalSearch,
        searchQuick,
        searchAdvanced,
        getAutocompleteSuggestions,
        getCurrentLocation,
        refreshLocation,
        clearResults,
        clearError,
        loadCategories,
        fetchNearbyDetails,
        searchEvents,
        searchClubs,
        searchBalanced
    };
}
