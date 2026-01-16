import { useState, useCallback } from 'react';
import { PublicEventService, PublicEventListResponse, PublicEventDetails, PublicEventListParams } from '@/lib/services/public.service';

interface UsePublicEventsReturn {
    // State
    events: PublicEventListResponse | null;
    eventDetails: PublicEventDetails | null;
    myRegistrations: PublicEventListResponse | null;
    loading: boolean;
    error: string | null;

    // Actions
    fetchEventsList: (params?: PublicEventListParams) => Promise<void>;
    fetchEventDetails: (id: string) => Promise<void>;
    fetchMyRegistrations: (params?: PublicEventListParams) => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

/**
 * Hook for accessing public event data without authentication
 * Provides methods to fetch event lists, details, and user registrations
 */
export const usePublicEvents = (): UsePublicEventsReturn => {
    const [events, setEvents] = useState<PublicEventListResponse | null>(null);
    const [eventDetails, setEventDetails] = useState<PublicEventDetails | null>(null);
    const [myRegistrations, setMyRegistrations] = useState<PublicEventListResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch paginated event list with optional filters
     */
    const fetchEventsList = useCallback(async (params: PublicEventListParams = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await PublicEventService.getPublicEvents(params);
            setEvents(response);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch events');
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch detailed information for a specific event
     */
    const fetchEventDetails = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await PublicEventService.getPublicEventById(id);
            setEventDetails(response);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch event details');
            console.error('Error fetching event details:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch user's registered events (requires authentication)
     */
    const fetchMyRegistrations = useCallback(async (params: PublicEventListParams = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await PublicEventService.getMyRegistrations(params);
            setMyRegistrations(response);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch registrations');
            console.error('Error fetching registrations:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Reset all state
     */
    const reset = useCallback(() => {
        setEvents(null);
        setEventDetails(null);
        setMyRegistrations(null);
        setError(null);
    }, []);

    return {
        events,
        eventDetails,
        myRegistrations,
        loading,
        error,
        fetchEventsList,
        fetchEventDetails,
        fetchMyRegistrations,
        clearError,
        reset,
    };
};
