'use client';

import { useState, useCallback, useEffect } from 'react';
import { SearchService, NearbySearchParams, NearbyClub } from '@/lib/services/search.service';
import { PublicSearchService } from '@/lib/services/public.service';
import { isGuestMode } from '@/lib/api-client-public';
import { resolveLocation, getStoredLocation, DEFAULT_RADIUS } from '@/lib/location';
import { useToast } from '@/hooks/use-toast';

interface UseNearbyClubsState {
    clubs: NearbyClub[];
    loading: boolean;
    error: string | null;
    hasLocation: boolean;
}

interface UseNearbyClubsActions {
    fetchNearbyClubs: (params?: Partial<NearbySearchParams>) => Promise<void>;
    clearClubs: () => void;
    clearError: () => void;
    refetchWithLocation: () => Promise<void>;
}

export function useNearbyClubs(): UseNearbyClubsState & UseNearbyClubsActions {
    const [clubs, setClubs] = useState<NearbyClub[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasLocation, setHasLocation] = useState(false);
    const { toast } = useToast();

    // Check for location on mount
    useEffect(() => {
        const location = getStoredLocation();
        setHasLocation(!!location && location.lat !== undefined && location.lng !== undefined);
    }, []);

    const fetchNearbyClubs = useCallback(async (params: Partial<NearbySearchParams> = {}) => {
        setLoading(true);
        setError(null);

        try {
            // Get current location
            const currentLocation = getStoredLocation() || resolveLocation();

            if (!currentLocation?.lat || !currentLocation?.lng) {
                throw new Error('Location not available. Please enable location services or select a location.');
            }

            const searchParams: NearbySearchParams = {
                lat: params.lat || currentLocation.lat,
                lng: params.lng || currentLocation.lng,
                radius: params.radius || currentLocation.radius || DEFAULT_RADIUS,
                category: params.category
            };

            let clubsData: NearbyClub[] = [];

            if (isGuestMode()) {
                // Use public API for guests
                clubsData = await PublicSearchService.findNearbyClubs(searchParams);
            } else {
                // Use authenticated API
                const response = await SearchService.findNearbyClubs(searchParams);
                if (response.success && response.data) {
                    clubsData = response.data;
                } else {
                    throw new Error(response.message || 'Failed to fetch nearby clubs');
                }
            }

            setClubs(clubsData || []);

            if (clubsData.length === 0) {
                setError('No clubs found in your area. Try increasing the search radius.');
            }

        } catch (err: any) {
            console.error('Error fetching nearby clubs:', err);
            setError(err.message || 'Failed to fetch nearby clubs');
            setClubs([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearClubs = useCallback(() => {
        setClubs([]);
        setError(null);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const refetchWithLocation = useCallback(async () => {
        const location = getStoredLocation();
        if (location?.lat && location?.lng) {
            setHasLocation(true);
            await fetchNearbyClubs({
                lat: location.lat,
                lng: location.lng,
                radius: location.radius || DEFAULT_RADIUS
            });
        } else {
            setHasLocation(false);
            setError('Location not available. Please select a location first.');
        }
    }, [fetchNearbyClubs]);

    return {
        clubs,
        loading,
        error,
        hasLocation,
        fetchNearbyClubs,
        clearClubs,
        clearError,
        refetchWithLocation
    };
}