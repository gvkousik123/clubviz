'use client';

import { useState, useCallback, useEffect } from 'react';
import { SearchService, NearbySearchParamsV2, SearchEventV2 } from '@/lib/services/search.service';
import { resolveLocation, getStoredLocation, DEFAULT_RADIUS } from '@/lib/location';
import { useToast } from '@/hooks/use-toast';

interface UseNearbyEventsState {
    events: SearchEventV2[];
    loading: boolean;
    error: string | null;
    hasLocation: boolean;
}

interface UseNearbyEventsActions {
    fetchNearbyEvents: (params?: Partial<NearbySearchParamsV2> & { radius?: number }) => Promise<void>;
    clearEvents: () => void;
    clearError: () => void;
    refetchWithLocation: () => Promise<void>;
}

export function useNearbyEvents(): UseNearbyEventsState & UseNearbyEventsActions {
    const [events, setEvents] = useState<SearchEventV2[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasLocation, setHasLocation] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const location = getStoredLocation();
        setHasLocation(!!location && location.lat !== undefined && location.lng !== undefined);
    }, []);

    const fetchNearbyEvents = useCallback(async (params: Partial<NearbySearchParamsV2> & { radius?: number } = {}) => {
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
            setEvents(response.events || []);

        } catch (err: any) {
            console.error('Error fetching nearby events:', err);
            setError(err.message || 'Failed to fetch nearby events');
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearEvents = useCallback(() => {
        setEvents([]);
        setError(null);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const refetchWithLocation = useCallback(async () => {
        const location = getStoredLocation();
        if (location?.lat && location?.lng) {
            setHasLocation(true);
            await fetchNearbyEvents({
                lat: location.lat,
                lng: location.lng,
                radius: location.radius || DEFAULT_RADIUS
            });
        } else {
            setHasLocation(false);
            setError('Location not available. Please select a location first.');
        }
    }, [fetchNearbyEvents]);

    return {
        events,
        loading,
        error,
        hasLocation,
        fetchNearbyEvents,
        clearEvents,
        clearError,
        refetchWithLocation
    };
}
