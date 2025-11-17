'use client';

import { useState, useCallback } from 'react';
import { EventService } from '@/lib/services/event.service';
import { Event, PaginationMeta } from '@/lib/api-types';

export interface UseOrganizedEventsState {
    events: Event[];
    pagination: PaginationMeta | null;
    isLoading: boolean;
    error: string | null;
}

export interface UseOrganizedEventsActions {
    loadOrganizedEvents: (params?: {
        page?: number;
        size?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc'
    }) => Promise<void>;
    refreshOrganizedEvents: () => Promise<void>;
    clearError: () => void;
}

export function useOrganizedEvents(): UseOrganizedEventsState & UseOrganizedEventsActions {
    const [events, setEvents] = useState<Event[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load organized events
    const loadOrganizedEvents = useCallback(async (params?: {
        page?: number;
        size?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc'
    }) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await EventService.getMyOrganizedEvents(params);

            if (response.success && response.data) {
                setEvents(response.data.events || []);
                setPagination(response.data.pagination || null);
            } else {
                throw new Error(response.message || 'Failed to load organized events');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to load organized events';
            setError(errorMessage);
            console.error('Error loading organized events:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Refresh organized events (reload with current params)
    const refreshOrganizedEvents = useCallback(async () => {
        await loadOrganizedEvents();
    }, [loadOrganizedEvents]);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        events,
        pagination,
        isLoading,
        error,
        loadOrganizedEvents,
        refreshOrganizedEvents,
        clearError,
    };
}
