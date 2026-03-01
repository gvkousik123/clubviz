'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { dataStore, CACHE_KEYS, CACHE_DURATION, CACHE_DURATION_SHORT, ClubData, EventData, StoryData, PaginationInfo } from './data-store';
import { PublicClubService, PublicEventService } from '@/lib/services/public.service';
import { StoryService } from '@/lib/services/story.service';

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

    const normalizePaginatedResponse = useCallback((response: any) => {
        if (!response) {
            return null;
        }

        if (Array.isArray(response)) {
            return {
                content: response,
                currentPage: 0,
                totalPages: 1,
                totalElements: response.length,
                hasNext: false,
                hasPrevious: false,
            };
        }

        if (Array.isArray(response?.content)) {
            return response;
        }

        const candidates = [
            response?.data,
            response?.data?.data,
            response?.result,
            response?.result?.data,
            response?.payload,
            response?.payload?.data,
        ];

        for (const candidate of candidates) {
            if (candidate?.content && Array.isArray(candidate.content)) {
                return candidate;
            }
        }

        return null;
    }, []);

    const normalizeClubItem = useCallback((club: any): ClubData | null => {
        const source = club?.club || club;
        if (!source) {
            return null;
        }

        const resolvedId = source.id || source.clubId || source._id || club?.id || club?.clubId || club?._id;
        if (!resolvedId) {
            return null;
        }

        return {
            ...source,
            id: String(resolvedId),
        } as ClubData;
    }, []);

    // ==================== FETCH CLUBS ====================

    const fetchClubs = useCallback(async (force = false, coords?: { latitude: number; longitude: number }) => {
        const clubsCacheKey = coords?.latitude && coords?.longitude
            ? `${CACHE_KEYS.CLUBS_LIST}:${coords.latitude}:${coords.longitude}`
            : CACHE_KEYS.CLUBS_LIST;

        // Check cache first (unless forced)
        if (!force && dataStore.isValid(clubsCacheKey) && state.clubs.length > 0) {
            console.log('📦 Using cached clubs data');
            return;
        }

        dispatch({ type: 'SET_CLUBS_LOADING', payload: true });

        try {
            const data: any = await dataStore.dedupedRequest(
                clubsCacheKey,
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
                    const fallbackParams: any = {
                        page: params.page,
                        size: params.size,
                        sortBy: params.sortBy,
                        sortDirection: params.sortDirection,
                    };

                    if (coords?.latitude && coords?.longitude) {
                        try {
                            const response = await PublicClubService.getPublicClubsList(params);
                            const normalizedResponse = normalizePaginatedResponse(response);
                            if (normalizedResponse && Array.isArray(normalizedResponse.content) && normalizedResponse.content.length > 0) {
                                return normalizedResponse;
                            }
                        } catch (error) {
                            console.warn('Location-based clubs fetch failed, falling back to global clubs list.');
                        }

                        const fallbackResponse = await PublicClubService.getPublicClubsList(fallbackParams);
                        return normalizePaginatedResponse(fallbackResponse);
                    }

                    const response = await PublicClubService.getPublicClubsList(fallbackParams);
                    return normalizePaginatedResponse(response);
                },
                CACHE_DURATION
            );

            const content = Array.isArray(data?.content)
                ? (data.content
                    .map((club: any) => normalizeClubItem(club))
                    .filter((club: ClubData | null): club is ClubData => !!club))
                : [];

            dispatch({
                type: 'SET_CLUBS',
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
        } catch (error: any) {
            console.error('Failed to fetch clubs:', error);
            dispatch({ type: 'SET_CLUBS_ERROR', payload: error.message });
        } finally {
            dispatch({ type: 'SET_CLUBS_LOADING', payload: false });
        }
    }, [state.clubs.length, normalizePaginatedResponse, normalizeClubItem]);

    // ==================== FETCH EVENTS ====================

    const fetchEvents = useCallback(async (force = false, coords?: { latitude: number; longitude: number }) => {
        const eventsCacheKey = coords?.latitude && coords?.longitude
            ? `${CACHE_KEYS.EVENTS_LIST}:${coords.latitude}:${coords.longitude}`
            : CACHE_KEYS.EVENTS_LIST;

        if (!force && dataStore.isValid(eventsCacheKey) && state.events.length > 0) {
            console.log('📦 Using cached events data');
            return;
        }

        dispatch({ type: 'SET_EVENTS_LOADING', payload: true });

        try {
            const data: any = await dataStore.dedupedRequest(
                eventsCacheKey,
                async () => {
                    const params: any = {
                        page: 0,
                        size: 20,
                        sortBy: 'startDateTime',
                        sortOrder: 'asc',
                        status: 'UPCOMING'
                    };
                    // Include coordinates if available
                    if (coords?.latitude && coords?.longitude) {
                        params.latitude = coords.latitude;
                        params.longitude = coords.longitude;
                    }
                    const fallbackParams: any = {
                        page: params.page,
                        size: params.size,
                        sortBy: params.sortBy,
                        sortOrder: params.sortOrder,
                        status: params.status,
                    };

                    if (coords?.latitude && coords?.longitude) {
                        try {
                            const response = await PublicEventService.getPublicEvents(params);
                            const normalizedResponse = normalizePaginatedResponse(response);
                            if (normalizedResponse && Array.isArray(normalizedResponse.content) && normalizedResponse.content.length > 0) {
                                return normalizedResponse;
                            }
                        } catch (error) {
                            console.warn('Location-based events fetch failed, falling back to global events list.');
                        }

                        const fallbackResponse = await PublicEventService.getPublicEvents(fallbackParams);
                        return normalizePaginatedResponse(fallbackResponse);
                    }

                    const response = await PublicEventService.getPublicEvents(fallbackParams);
                    return normalizePaginatedResponse(response);
                },
                CACHE_DURATION
            );

            const content = Array.isArray(data?.content) ? (data.content as EventData[]) : [];

            dispatch({
                type: 'SET_EVENTS',
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
        } catch (error: any) {
            console.error('Failed to fetch events:', error);
            dispatch({ type: 'SET_EVENTS_ERROR', payload: error.message });
        } finally {
            dispatch({ type: 'SET_EVENTS_LOADING', payload: false });
        }
    }, [state.events.length, normalizePaginatedResponse]);

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

            const fallbackClub = state.clubs.find((club) => String(club.id) === String(id));
            if (fallbackClub) {
                dispatch({ type: 'SET_CLUB_DETAIL', payload: { id, data: fallbackClub } });
                return fallbackClub;
            }

            return null;
        }
    }, [state.clubDetails, state.clubs]);

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
            // Normalize common response shapes: response, response.data, response.data.data, etc.
            let payload = data;
            const candidates = [data, data?.data, data?.data?.data, data?.result, data?.result?.data, data?.payload, data?.payload?.data];
            for (const candidate of candidates) {
                if (!candidate) continue;
                // If candidate looks like an event object (has id or title), use it
                if (candidate.id || candidate.title || candidate.eventId) {
                    payload = candidate;
                    break;
                }
                // Some APIs wrap the event under `event` key
                if (candidate.event && (candidate.event.id || candidate.event.title)) {
                    payload = candidate.event;
                    break;
                }
            }

            // Ensure we have common image fields populated (imageUrl or images array)
            if (payload) {
                // If API returns `images` as array of objects with `url`, normalize to plain strings
                if (Array.isArray(payload.images) && payload.images.length > 0 && typeof payload.images[0] === 'object') {
                    payload.images = payload.images.map((it: any) => it.url || it.path || it.image || it);
                }

                // If list responses used `image` or `imageUrl` under different keys, try to normalize
                if (!payload.imageUrl && payload.image) {
                    payload.imageUrl = payload.image;
                }
                if (!payload.imageUrl && payload.images && payload.images.length > 0) {
                    payload.imageUrl = payload.images[0];
                }

                dispatch({ type: 'SET_EVENT_DETAIL', payload: { id, data: payload as EventData } });
                return payload as EventData;
            }
            return null;
        } catch (error: any) {
            console.error(`Failed to fetch event ${id}:`, error);
            return null;
        }
    }, [state.eventDetails]);

    // ==================== INITIALIZE DATA ====================

    const initializeData = useCallback(async (coords?: { latitude: number; longitude: number }) => {
        const hasAnyContent = state.clubs.length > 0 || state.events.length > 0 || state.stories.length > 0;

        if (state.isInitialized && hasAnyContent) {
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
    }, [state.isInitialized, state.clubs.length, state.events.length, state.stories.length, fetchClubs, fetchEvents, fetchStories]);

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
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const club = id ? clubDetails[id] : null;

    useEffect(() => {
        if (id && !club) {
            setLoading(true);
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
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const event = id ? eventDetails[id] : null;

    useEffect(() => {
        if (id && !event) {
            setLoading(true);
            fetchEventById(id)
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [id, event, fetchEventById]);

    return { event, loading, error, refetch: () => id ? fetchEventById(id, true) : Promise.resolve(null) };
}
