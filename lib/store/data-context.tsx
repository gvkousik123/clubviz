'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { dataStore, CACHE_KEYS, CACHE_DURATION, CACHE_DURATION_SHORT, ClubData, EventData, StoryData, PaginationInfo } from './data-store';
import { PublicClubService, PublicEventService } from '@/lib/services/public.service';
import { StoryService } from '@/lib/services/story.service';
import { filterUpcomingEvents } from '@/lib/utils';

// ==================== STATE TYPES ====================

interface DataState {
    // Clubs
    clubs: ClubData[];
    clubsLoading: boolean;
    clubsPagination: PaginationInfo | null;
    clubsError: string | null;

    // Events
    events: EventData[];
    eventsLoading: boolean;
    eventsPagination: PaginationInfo | null;
    eventsError: string | null;

    // Stories
    stories: StoryData[];
    storiesLoading: boolean;
    storiesPagination: PaginationInfo | null;
    storiesError: string | null;

    // Individual details cache
    clubDetails: Record<string, ClubData>;
    eventDetails: Record<string, EventData>;

    // Global loading state
    isInitialized: boolean;
    isHydrated: boolean;
}

type DataAction =
    | { type: 'SET_CLUBS'; payload: { content: ClubData[]; pagination: PaginationInfo } }
    | { type: 'SET_CLUBS_LOADING'; payload: boolean }
    | { type: 'SET_CLUBS_ERROR'; payload: string | null }
    | { type: 'SET_EVENTS'; payload: { content: EventData[]; pagination: PaginationInfo } }
    | { type: 'SET_EVENTS_LOADING'; payload: boolean }
    | { type: 'SET_EVENTS_ERROR'; payload: string | null }
    | { type: 'SET_STORIES'; payload: { content: StoryData[]; pagination: PaginationInfo } }
    | { type: 'SET_STORIES_LOADING'; payload: boolean }
    | { type: 'SET_STORIES_ERROR'; payload: string | null }
    | { type: 'SET_CLUB_DETAIL'; payload: { id: string; data: ClubData } }
    | { type: 'SET_EVENT_DETAIL'; payload: { id: string; data: EventData } }
    | { type: 'SET_INITIALIZED'; payload: boolean }
    | { type: 'SET_HYDRATED'; payload: boolean }
    | { type: 'RESET' };

// ==================== INITIAL STATE ====================

const initialState: DataState = {
    clubs: [],
    clubsLoading: false,
    clubsPagination: null,
    clubsError: null,

    events: [],
    eventsLoading: false,
    eventsPagination: null,
    eventsError: null,

    stories: [],
    storiesLoading: false,
    storiesPagination: null,
    storiesError: null,

    clubDetails: {},
    eventDetails: {},

    isInitialized: false,
    isHydrated: false,
};

// ==================== REDUCER ====================

function dataReducer(state: DataState, action: DataAction): DataState {
    switch (action.type) {
        case 'SET_CLUBS':
            return {
                ...state,
                clubs: action.payload.content,
                clubsPagination: action.payload.pagination,
                clubsError: null,
            };
        case 'SET_CLUBS_LOADING':
            return { ...state, clubsLoading: action.payload };
        case 'SET_CLUBS_ERROR':
            return { ...state, clubsError: action.payload };

        case 'SET_EVENTS':
            return {
                ...state,
                events: action.payload.content,
                eventsPagination: action.payload.pagination,
                eventsError: null,
            };
        case 'SET_EVENTS_LOADING':
            return { ...state, eventsLoading: action.payload };
        case 'SET_EVENTS_ERROR':
            return { ...state, eventsError: action.payload };

        case 'SET_STORIES':
            return {
                ...state,
                stories: action.payload.content,
                storiesPagination: action.payload.pagination,
                storiesError: null,
            };
        case 'SET_STORIES_LOADING':
            return { ...state, storiesLoading: action.payload };
        case 'SET_STORIES_ERROR':
            return { ...state, storiesError: action.payload };

        case 'SET_CLUB_DETAIL':
            return {
                ...state,
                clubDetails: {
                    ...state.clubDetails,
                    [action.payload.id]: action.payload.data,
                },
            };
        case 'SET_EVENT_DETAIL':
            return {
                ...state,
                eventDetails: {
                    ...state.eventDetails,
                    [action.payload.id]: action.payload.data,
                },
            };

        case 'SET_INITIALIZED':
            return { ...state, isInitialized: action.payload };
        case 'SET_HYDRATED':
            return { ...state, isHydrated: action.payload };

        case 'RESET':
            return initialState;

        default:
            return state;
    }
}

// ==================== CONTEXT ====================

interface DataContextValue extends DataState {
    // Actions
    fetchClubs: (force?: boolean, coords?: { latitude: number; longitude: number }) => Promise<void>;
    fetchEvents: (force?: boolean, coords?: { latitude: number; longitude: number }) => Promise<void>;
    fetchStories: (force?: boolean) => Promise<void>;
    fetchClubById: (id: string, force?: boolean) => Promise<ClubData | null>;
    fetchEventById: (id: string, force?: boolean) => Promise<EventData | null>;
    initializeData: (coords?: { latitude: number; longitude: number }) => Promise<void>;
    refreshAll: (coords?: { latitude: number; longitude: number }) => Promise<void>;
    clearCache: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

// ==================== PROVIDER ====================

interface DataProviderProps {
    children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
    const [state, dispatch] = useReducer(dataReducer, initialState);

    // ==================== FETCH CLUBS ====================

    const fetchClubs = useCallback(async (force = false, coords?: { latitude: number; longitude: number }) => {
        // Check cache first (unless forced)
        if (!force && dataStore.isValid(CACHE_KEYS.CLUBS_LIST) && state.clubs.length > 0) {
            console.log('📦 Using cached clubs data');
            return;
        }

        dispatch({ type: 'SET_CLUBS_LOADING', payload: true });

        try {
            const data: any = await dataStore.dedupedRequest(
                CACHE_KEYS.CLUBS_LIST,
                async () => {
                    const params: any = {
                        page: 0,
                        size: 20,
                        sortBy: 'createdAt',
                        sortDirection: 'desc'
                    };
                    // Include coordinates if available
                    if (coords?.latitude && coords?.longitude) {
                        params.latitude = coords.latitude;
                        params.longitude = coords.longitude;
                    }
                    const response = await PublicClubService.getPublicClubsList(params);
                    return response;
                },
                CACHE_DURATION
            );

            if (data?.content && data.content.length > 0) {
                dispatch({
                    type: 'SET_CLUBS',
                    payload: {
                        content: data.content as ClubData[],
                        pagination: {
                            page: data.currentPage || 0,
                            totalPages: data.totalPages || 1,
                            totalElements: data.totalElements || data.content.length,
                            hasNext: data.hasNext || false,
                            hasPrevious: data.hasPrevious || false,
                        }
                    }
                });
            } else if (coords?.latitude && coords?.longitude) {
                // Location-based search returned nothing — retry without coordinates to show all clubs
                console.log('📍 No clubs found near location, falling back to all clubs...');
                dataStore.invalidate(CACHE_KEYS.CLUBS_LIST);
                const fallbackData: any = await dataStore.dedupedRequest(
                    CACHE_KEYS.CLUBS_LIST,
                    async () => {
                        const fallbackParams: any = {
                            page: 0,
                            size: 20,
                            sortBy: 'createdAt',
                            sortDirection: 'desc'
                        };
                        const response = await PublicClubService.getPublicClubsList(fallbackParams);
                        return response;
                    },
                    CACHE_DURATION
                );

                if (fallbackData?.content) {
                    dispatch({
                        type: 'SET_CLUBS',
                        payload: {
                            content: fallbackData.content as ClubData[],
                            pagination: {
                                page: fallbackData.currentPage || 0,
                                totalPages: fallbackData.totalPages || 1,
                                totalElements: fallbackData.totalElements || fallbackData.content.length,
                                hasNext: fallbackData.hasNext || false,
                                hasPrevious: fallbackData.hasPrevious || false,
                            }
                        }
                    });
                }
            }
        } catch (error: any) {
            console.error('Failed to fetch clubs:', error);
            dispatch({ type: 'SET_CLUBS_ERROR', payload: error.message });
        } finally {
            dispatch({ type: 'SET_CLUBS_LOADING', payload: false });
        }
    }, [state.clubs.length]);

    // ==================== FETCH EVENTS ====================

    const fetchEvents = useCallback(async (force = false, coords?: { latitude: number; longitude: number }) => {
        if (!force && dataStore.isValid(CACHE_KEYS.EVENTS_LIST) && state.events.length > 0) {
            console.log('📦 Using cached events data');
            return;
        }

        dispatch({ type: 'SET_EVENTS_LOADING', payload: true });

        try {
            const data: any = await dataStore.dedupedRequest(
                CACHE_KEYS.EVENTS_LIST,
                async () => {
                    const params: any = {
                        page: 0,
                        size: 20,
                        sortBy: 'startDateTime',
                        sortOrder: 'asc'
                    };
                    // Include coordinates if available
                    if (coords?.latitude && coords?.longitude) {
                        params.latitude = coords.latitude;
                        params.longitude = coords.longitude;
                    }
                    const response = await PublicEventService.getPublicEvents(params);
                    return response;
                },
                CACHE_DURATION
            );

            if (data?.content && data.content.length > 0) {
                // Filter to only show upcoming events
                const upcomingEvents = filterUpcomingEvents(data.content);
                
                dispatch({
                    type: 'SET_EVENTS',
                    payload: {
                        content: upcomingEvents as EventData[],
                        pagination: {
                            page: data.currentPage || 0,
                            totalPages: data.totalPages || 1,
                            totalElements: upcomingEvents.length,
                            hasNext: data.hasNext || false,
                            hasPrevious: data.hasPrevious || false,
                        }
                    }
                });
            } else if (coords?.latitude && coords?.longitude) {
                // Location-based search returned nothing — retry without coordinates to show all events
                console.log('📍 No events found near location, falling back to all events...');
                dataStore.invalidate(CACHE_KEYS.EVENTS_LIST);
                const fallbackData: any = await dataStore.dedupedRequest(
                    CACHE_KEYS.EVENTS_LIST,
                    async () => {
                        const fallbackParams: any = {
                            page: 0,
                            size: 20,
                            sortBy: 'startDateTime',
                            sortOrder: 'asc'
                        };
                        const response = await PublicEventService.getPublicEvents(fallbackParams);
                        return response;
                    },
                    CACHE_DURATION
                );

                if (fallbackData?.content) {
                    // Filter to only show upcoming events
                    const upcomingEvents = filterUpcomingEvents(fallbackData.content);
                    
                    dispatch({
                        type: 'SET_EVENTS',
                        payload: {
                            content: upcomingEvents as EventData[],
                            pagination: {
                                page: fallbackData.currentPage || 0,
                                totalPages: fallbackData.totalPages || 1,
                                totalElements: upcomingEvents.length,
                                hasNext: fallbackData.hasNext || false,
                                hasPrevious: fallbackData.hasPrevious || false,
                            }
                        }
                    });
                }
            }
        } catch (error: any) {
            console.error('Failed to fetch events:', error);
            dispatch({ type: 'SET_EVENTS_ERROR', payload: error.message });
        } finally {
            dispatch({ type: 'SET_EVENTS_LOADING', payload: false });
        }
    }, [state.events.length]);

    // ==================== FETCH STORIES ====================

    const fetchStories = useCallback(async (force = false) => {
        if (!force && dataStore.isValid(CACHE_KEYS.STORIES_LIST) && state.stories.length > 0) {
            console.log('📦 Using cached stories data');
            return;
        }

        dispatch({ type: 'SET_STORIES_LOADING', payload: true });

        try {
            const data: any = await dataStore.dedupedRequest(
                CACHE_KEYS.STORIES_LIST,
                async () => {
                    const response = await StoryService.getStories(0, 20);
                    return response;
                },
                CACHE_DURATION_SHORT // Stories change more frequently
            );

            // Handle different response formats
            let content: StoryData[] = [];
            if (Array.isArray(data?.content)) {
                content = data.content;
            } else if (data?.success && Array.isArray(data?.data?.content)) {
                content = data.data.content;
            }

            if (content.length > 0) {
                dispatch({
                    type: 'SET_STORIES',
                    payload: {
                        content,
                        pagination: {
                            page: data?.currentPage || 0,
                            totalPages: data?.totalPages || 1,
                            totalElements: data?.totalElements || content.length,
                            hasNext: data?.hasNext || false,
                            hasPrevious: data?.hasPrevious || false,
                        }
                    }
                });
            }
        } catch (error: any) {
            console.error('Failed to fetch stories:', error);
            dispatch({ type: 'SET_STORIES_ERROR', payload: error.message });
        } finally {
            dispatch({ type: 'SET_STORIES_LOADING', payload: false });
        }
    }, [state.stories.length]);

    // ==================== FETCH CLUB BY ID ====================

    const fetchClubById = useCallback(async (id: string, force = false): Promise<ClubData | null> => {
        const cacheKey = CACHE_KEYS.clubDetail(id);

        // Check in-memory state first
        if (!force && state.clubDetails[id]) {
            console.log(`📦 Using cached club detail: ${id}`);
            return state.clubDetails[id];
        }

        try {
            const data: any = await dataStore.dedupedRequest(
                cacheKey,
                async () => {
                    const response = await PublicClubService.getPublicClubById(id);
                    return response;
                },
                CACHE_DURATION
            );

            if (data) {
                dispatch({ type: 'SET_CLUB_DETAIL', payload: { id, data: data as ClubData } });
                return data as ClubData;
            }
            return null;
        } catch (error: any) {
            console.error(`Failed to fetch club ${id}:`, error);
            return null;
        }
    }, [state.clubDetails]);

    // ==================== FETCH EVENT BY ID ====================

    const fetchEventById = useCallback(async (id: string, force = false): Promise<EventData | null> => {
        const cacheKey = CACHE_KEYS.eventDetail(id);

        if (!force && state.eventDetails[id]) {
            console.log(`📦 Using cached event detail: ${id}`);
            return state.eventDetails[id];
        }

        try {
            const data: any = await dataStore.dedupedRequest(
                cacheKey,
                async () => {
                    const response = await PublicEventService.getPublicEventById(id);
                    return response;
                },
                CACHE_DURATION
            );

            if (data) {
                dispatch({ type: 'SET_EVENT_DETAIL', payload: { id, data: data as EventData } });
                return data as EventData;
            }
            return null;
        } catch (error: any) {
            console.error(`Failed to fetch event ${id}:`, error);
            return null;
        }
    }, [state.eventDetails]);

    // ==================== INITIALIZE DATA ====================

    const initializeData = useCallback(async (coords?: { latitude: number; longitude: number }) => {
        if (state.isInitialized) {
            console.log('📦 Data already initialized, using cache');
            return;
        }

        console.log('🚀 Initializing app data...', coords ? `with coords: ${coords.latitude}, ${coords.longitude}` : 'without coords');

        // Fetch all data in parallel
        await Promise.all([
            fetchClubs(false, coords),
            fetchEvents(false, coords),
            fetchStories(),
        ]);

        dispatch({ type: 'SET_INITIALIZED', payload: true });
        console.log('✅ App data initialized');
    }, [state.isInitialized, fetchClubs, fetchEvents, fetchStories]);

    // ==================== REFRESH ALL ====================

    const refreshAll = useCallback(async (coords?: { latitude: number; longitude: number }) => {
        console.log('🔄 Refreshing all data...');
        dataStore.clear();
        dispatch({ type: 'RESET' });

        await Promise.all([
            fetchClubs(true, coords),
            fetchEvents(true, coords),
            fetchStories(true),
        ]);

        dispatch({ type: 'SET_INITIALIZED', payload: true });
    }, [fetchClubs, fetchEvents, fetchStories]);

    // ==================== CLEAR CACHE ====================

    const clearCache = useCallback(() => {
        dataStore.clear();
        dispatch({ type: 'RESET' });
    }, []);

    // ==================== HYDRATION ====================

    useEffect(() => {
        dispatch({ type: 'SET_HYDRATED', payload: true });
    }, []);

    // ==================== CONTEXT VALUE ====================

    const value: DataContextValue = {
        ...state,
        fetchClubs,
        fetchEvents,
        fetchStories,
        fetchClubById,
        fetchEventById,
        initializeData,
        refreshAll,
        clearCache,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}

// ==================== HOOKS ====================

/**
 * Main hook to access the data context
 */
export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}

/**
 * Hook to get clubs data with auto-fetch
 */
export function useClubsData() {
    const { clubs, clubsLoading, clubsError, clubsPagination, fetchClubs } = useData();

    useEffect(() => {
        if (clubs.length === 0 && !clubsLoading) {
            fetchClubs();
        }
    }, [clubs.length, clubsLoading, fetchClubs]);

    return { clubs, loading: clubsLoading, error: clubsError, pagination: clubsPagination, refetch: () => fetchClubs(true) };
}

/**
 * Hook to get events data with auto-fetch
 */
export function useEventsData() {
    const { events, eventsLoading, eventsError, eventsPagination, fetchEvents } = useData();

    useEffect(() => {
        if (events.length === 0 && !eventsLoading) {
            fetchEvents();
        }
    }, [events.length, eventsLoading, fetchEvents]);

    return { events, loading: eventsLoading, error: eventsError, pagination: eventsPagination, refetch: () => fetchEvents(true) };
}

/**
 * Hook to get stories data with auto-fetch
 */
export function useStoriesData() {
    const { stories, storiesLoading, storiesError, storiesPagination, fetchStories } = useData();

    useEffect(() => {
        if (stories.length === 0 && !storiesLoading) {
            fetchStories();
        }
    }, [stories.length, storiesLoading, fetchStories]);

    return { stories, loading: storiesLoading, error: storiesError, pagination: storiesPagination, refetch: () => fetchStories(true) };
}

/**
 * Hook to get club detail by ID
 */
export function useClubDetail(id: string | null) {
    const { clubDetails, fetchClubById } = useData();
    const [loading, setLoading] = React.useState(id ? !clubDetails[id] : false);
    const [error, setError] = React.useState<string | null>(null);

    const club = id ? clubDetails[id] : null;

    useEffect(() => {
        if (id && !club) {
            setLoading(true);
            setError(null);
            fetchClubById(id)
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [id, club, fetchClubById]);

    return { club, loading, error, refetch: () => id ? fetchClubById(id, true) : Promise.resolve(null) };
}

/**
 * Hook to get event detail by ID
 */
export function useEventDetail(id: string | null) {
    const { eventDetails, fetchEventById } = useData();
    const [loading, setLoading] = React.useState(id ? !eventDetails[id] : false);
    const [error, setError] = React.useState<string | null>(null);

    const event = id ? eventDetails[id] : null;

    useEffect(() => {
        if (id && !event) {
            setLoading(true);
            setError(null);
            fetchEventById(id)
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [id, event, fetchEventById]);

    return { event, loading, error, refetch: () => id ? fetchEventById(id, true) : Promise.resolve(null) };
}
