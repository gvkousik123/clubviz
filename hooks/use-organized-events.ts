'use client';

import { useState, useCallback } from 'react';
import { EventService, EventListItem } from '@/lib/services/event.service';

export interface UseOrganizedEventsState {
    events: EventListItem[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
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
    const [events, setEvents] = useState<EventListItem[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
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
                setEvents(response.data.content || []);
                setTotalElements(response.data.totalElements || 0);
                setTotalPages(response.data.totalPages || 0);
                setCurrentPage(response.data.currentPage || 0);
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
        totalElements,
        totalPages,
        currentPage,
        isLoading,
        error,
        loadOrganizedEvents,
        refreshOrganizedEvents,
        clearError,
    };
}
