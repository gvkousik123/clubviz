'use client';

import { useState, useCallback } from 'react';
import { EventService, EventListParams, EventListResponse, AttendingEventFull } from '@/lib/services/event.service';
import { toast } from '@/hooks/use-toast';

export interface UseEventListState {
  // Loading states
  isLoadingList: boolean;
  isLoadingAttending: boolean;

  // Data states
  eventList: EventListResponse | null;
  attendingEvents: AttendingEventFull[];

  // Error states
  error: string | null;
}

export interface UseEventListActions {
  // Event list actions
  loadEventList: (params?: EventListParams) => Promise<void>;
  refreshEventList: () => Promise<void>;
  
  // Attending events actions
  loadAttendingEvents: () => Promise<void>;
  refreshAttendingEvents: () => Promise<void>;
  
  // Utility actions
  clearError: () => void;
  clearData: () => void;
}

export function useEventList(): UseEventListState & UseEventListActions {
  // State
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingAttending, setIsLoadingAttending] = useState(false);
  
  const [eventList, setEventList] = useState<EventListResponse | null>(null);
  const [attendingEvents, setAttendingEvents] = useState<AttendingEventFull[]>([]);
  const [lastParams, setLastParams] = useState<EventListParams>({});
  
  const [error, setError] = useState<string | null>(null);

  // Load paginated event list
  const loadEventList = useCallback(async (params: EventListParams = {}): Promise<void> => {
    setIsLoadingList(true);
    setError(null);

    try {
      const response = await EventService.getEventList(params);
      if (response.success && response.data) {
        setEventList(response.data);
        setLastParams(params);
      } else {
        setEventList(null);
        if (response.message) {
          setError(response.message);
        }
      }
    } catch (error: any) {
      console.error('Load event list error:', error);
      setError(error.message || 'Failed to load event list');
      setEventList(null);
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  // Refresh event list with last used parameters
  const refreshEventList = useCallback(async (): Promise<void> => {
    await loadEventList(lastParams);
  }, [loadEventList, lastParams]);

  // Load attending events
  const loadAttendingEvents = useCallback(async (): Promise<void> => {
    setIsLoadingAttending(true);
    setError(null);

    try {
      const response = await EventService.getAttendingEvents();
      if (response.success && response.data) {
        setAttendingEvents(response.data);
      } else {
        setAttendingEvents([]);
        if (response.message) {
          setError(response.message);
        }
      }
    } catch (error: any) {
      console.error('Load attending events error:', error);
      setError(error.message || 'Failed to load attending events');
      setAttendingEvents([]);
    } finally {
      setIsLoadingAttending(false);
    }
  }, []);

  // Refresh attending events
  const refreshAttendingEvents = useCallback(async (): Promise<void> => {
    await loadAttendingEvents();
  }, [loadAttendingEvents]);

  // Clear error
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // Clear all data
  const clearData = useCallback((): void => {
    setEventList(null);
    setAttendingEvents([]);
    setError(null);
  }, []);

  return {
    // State
    isLoadingList,
    isLoadingAttending,
    eventList,
    attendingEvents,
    error,

    // Actions
    loadEventList,
    refreshEventList,
    loadAttendingEvents,
    refreshAttendingEvents,
    clearError,
    clearData,
  };
}