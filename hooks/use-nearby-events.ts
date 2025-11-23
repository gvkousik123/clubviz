'use client';

import { useState, useCallback, useEffect } from 'react';
import { SearchService, NearbySearchParams, NearbyEvent } from '@/lib/services/search.service';
import { PublicSearchService } from '@/lib/services/public.service';
import { isGuestMode } from '@/lib/api-client-public';
import { resolveLocation, getStoredLocation, DEFAULT_RADIUS } from '@/lib/location';
import { useToast } from '@/hooks/use-toast';

interface UseNearbyEventsState {
    events: NearbyEvent[];
    loading: boolean;
    error: string | null;
    hasLocation: boolean;
}

interface UseNearbyEventsActions {
    fetchNearbyEvents: (params?: Partial<NearbySearchParams>) => Promise<void>;
    clearEvents: () => void;
    clearError: () => void;
    refetchWithLocation: () => Promise<void>;
}

export function useNearbyEvents(): UseNearbyEventsState & UseNearbyEventsActions {
    const [events, setEvents] = useState<NearbyEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasLocation, setHasLocation] = useState(false);
    const { toast } = useToast();

    // Check for location on mount
    useEffect(() => {
        const location = getStoredLocation();
        setHasLocation(!!location && location.lat !== undefined && location.lng !== undefined);
    }, []);

    const fetchNearbyEvents = useCallback(async (params: Partial<NearbySearchParams> = {}) => {
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

            let eventsData: NearbyEvent[] = [];

            if (isGuestMode()) {
                // Use public API for guests
                eventsData = await PublicSearchService.findNearbyEvents(searchParams);
            } else {
                // Use authenticated API
                const response = await SearchService.findNearbyEvents(searchParams);
                if (response.success && response.data) {
                    eventsData = response.data;
                } else {
                    throw new Error(response.message || 'Failed to fetch nearby events');
                }
            }

            setEvents(eventsData || []);

            if (eventsData.length === 0) {
                setError('No events found in your area. Try increasing the search radius.');
            }

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