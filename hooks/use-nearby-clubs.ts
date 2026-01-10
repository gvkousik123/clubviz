'use client';

import { useState, useCallback, useEffect } from 'react';
import { SearchService, NearbySearchParamsV2, SearchClubV2 } from '@/lib/services/search.service';
import { resolveLocation, getStoredLocation, DEFAULT_RADIUS } from '@/lib/location';
import { useToast } from '@/hooks/use-toast';

interface UseNearbyClubsState {
    clubs: SearchClubV2[];
    loading: boolean;
    error: string | null;
    hasLocation: boolean;
}

interface UseNearbyClubsActions {
    fetchNearbyClubs: (params?: Partial<NearbySearchParamsV2> & { radius?: number }) => Promise<void>;
    clearClubs: () => void;
    clearError: () => void;
    refetchWithLocation: () => Promise<void>;
}

export function useNearbyClubs(): UseNearbyClubsState & UseNearbyClubsActions {
    const [clubs, setClubs] = useState<SearchClubV2[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasLocation, setHasLocation] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const location = getStoredLocation();
        setHasLocation(!!location && location.lat !== undefined && location.lng !== undefined);
    }, []);

    const fetchNearbyClubs = useCallback(async (params: Partial<NearbySearchParamsV2> & { radius?: number } = {}) => {
        setLoading(true);
        setError(null);

        try {
            const currentLocation = getStoredLocation() || resolveLocation();

            if (!currentLocation?.lat || !currentLocation?.lng) {
                throw new Error('Location not available. Please enable location services or select a location.');
            }

            const searchParams: NearbySearchParamsV2 = {
                lat: params.lat || currentLocation.lat,
                lng: params.lng || currentLocation.lng,
                radiusKm: params.radiusKm ?? (params.radius ? params.radius / 1000 : 5)
            };

            const response = await SearchService.nearbySearch(searchParams);
            setClubs(response.clubs || []);

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
