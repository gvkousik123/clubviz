'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, User, SlidersHorizontal, MapPin, Loader2 } from 'lucide-react';
import type { Event } from '@/lib/api-types';
import { useToast } from '@/hooks/use-toast';
import { EventCard } from '@/components/events/event-card';
import { EventListCard } from '@/components/events/event-list-card';
import FilterPopup from '@/components/common/filter-popup';
import { EVENT_FILTER_SECTIONS } from '@/lib/filter-config';
import { useSearch } from '@/hooks/use-search';
import { useEventList } from '@/hooks/use-event-list';
import { EventService } from '@/lib/services/event.service';


// Dummy events used for local development (no API calls)
const DUMMY_EVENTS: Event[] = [
    {
        id: 'evt-1',
        title: 'Boiler Room: Sunset Sessions',
        description: 'An intimate DJ session with ambient beats to close out the week.',
        clubId: 'club-1',
        coverImage: '/event page going people/cover1.jpg',
        imageUrl: '/event list/Rectangle 1.jpg',
        images: ['/event list/Rectangle 1.jpg'],
        location: 'Boiler Room, Downtown',
        startDateTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        endDateTime: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
        isPublic: true,
        requiresApproval: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'evt-2',
        title: 'Tipsy Tuesday: Havana Nights',
        description: 'Salsa, cocktails and a lively crowd. Dress code: Tropical Chic.',
        clubId: 'club-2',
        coverImage: '/event page going people/cover2.jpg',
        imageUrl: '/event list/Rectangle 2.jpg',
        images: ['/event list/Rectangle 2.jpg'],
        location: 'Tipsy Tuesday Club',
        startDateTime: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
        endDateTime: new Date(Date.now() + 1000 * 60 * 60 * 50).toISOString(),
        isPublic: true,
        requiresApproval: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'evt-3',
        title: 'Dabo Live: House Takeover',
        description: 'Big room house bangers with Dabo on the console.',
        clubId: 'club-3',
        coverImage: '/event page going people/cover3.jpg',
        imageUrl: '/event list/Rectangle 3.jpg',
        images: ['/event list/Rectangle 3.jpg'],
        location: 'Dabo Club',
        startDateTime: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
        endDateTime: new Date(Date.now() + 1000 * 60 * 60 * 75).toISOString(),
        isPublic: true,
        requiresApproval: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'evt-4',
        title: 'Open Mic Night',
        description: 'Local artists and up-and-coming talent. Free entry before 9pm.',
        clubId: 'club-4',
        coverImage: '/event page going people/cover4.jpg',
        imageUrl: '/event list/Rectangle 4.jpg',
        images: ['/event list/Rectangle 4.jpg'],
        location: 'Raasta Stage',
        startDateTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        endDateTime: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
        isPublic: true,
        requiresApproval: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'evt-5',
        title: 'Gallery Night: Visual Vibes',
        description: 'An evening of arts, installations and curated music.',
        clubId: 'club-5',
        coverImage: '/event page going people/cover5.jpg',
        imageUrl: '/event list/Rectangle 5.jpg',
        images: ['/event list/Rectangle 5.jpg'],
        location: 'ArtSpace',
        startDateTime: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
        endDateTime: new Date(Date.now() + 1000 * 60 * 60 * 9).toISOString(),
        isPublic: true,
        requiresApproval: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

export default function EventsListPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>('events-today');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});

    // Search functionality
    const {
        isSearching,
        isLoadingNearby,
        events: searchEvents,
        nearbyResults,
        currentLocation,
        locationError,
        searchEvents: performEventSearch,
        searchNearby,
        getCurrentLocation,
        clearResults,
        clearError,
    } = useSearch();

    // Event list functionality
    const {
        isLoadingList,
        eventList,
        loadEventList,
        refreshEventList,
    } = useEventList();

    // Event list images for fallbacks
    const eventImages = [
        '/event list/Rectangle 1.jpg',
        '/event list/Rectangle 2.jpg',
        '/event list/Rectangle 3.jpg',
        '/event list/Rectangle 4.jpg',
        '/event list/Rectangle 5.jpg',
        '/event list/Rectangle 12249.jpg'
    ];

    const getEventFallbackImage = (index: number) => {
        return eventImages[index % eventImages.length];
    };

    const handleGoBack = () => {
        router.back();
    };

    const handleSearch = async () => {
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
            try {
                await performEventSearch(searchQuery.trim());
                // Update the local events state with search results
                if (searchEvents.length > 0) {
                    // Convert SearchEvent[] to Event[] format for compatibility
                    const convertedEvents: Event[] = searchEvents.map((event, index) => ({
                        id: event.id,
                        title: event.title,
                        description: event.description || '',
                        clubId: event.club?.id || '',
                        coverImage: event.imageUrl || getEventFallbackImage(index),
                        imageUrl: event.imageUrl || getEventFallbackImage(index),
                        images: [event.imageUrl || getEventFallbackImage(index)],
                        location: event.location || '',
                        startDateTime: event.startDateTime,
                        endDateTime: event.endDateTime,
                        isPublic: event.isPublic,
                        requiresApproval: event.requiresApproval,
                        createdAt: event.createdAt,
                        updatedAt: event.updatedAt,
                    }));
                    setEvents(convertedEvents);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Search failed:', error);
                toast({
                    title: 'Search Failed',
                    description: 'Unable to search events. Please try again.',
                    variant: 'destructive',
                });
            }
        }
    };

    const handleNearbySearch = async () => {
        try {
            setLoading(true);
            await searchNearby();

            if (nearbyResults?.events && nearbyResults.events.length > 0) {
                // Convert nearby events to Event[] format
                const convertedEvents: Event[] = nearbyResults.events.map((event, index) => ({
                    id: event.id,
                    title: event.title,
                    description: event.description || '',
                    clubId: event.club?.id || '',
                    coverImage: event.imageUrl || getEventFallbackImage(index),
                    imageUrl: event.imageUrl || getEventFallbackImage(index),
                    images: [event.imageUrl || getEventFallbackImage(index)],
                    location: event.location || '',
                    startDateTime: event.startDateTime,
                    endDateTime: event.endDateTime,
                    isPublic: event.isPublic,
                    requiresApproval: event.requiresApproval,
                    createdAt: event.createdAt,
                    updatedAt: event.updatedAt,
                }));
                setEvents(convertedEvents);
            }
        } catch (error) {
            console.error('Nearby search failed:', error);
            toast({
                title: 'Nearby Search Failed',
                description: 'Unable to find nearby events. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filter: string) => {
        if (filter === 'filter') {
            setIsFilterOpen(true);
        } else {
            setActiveFilter(filter);
            console.log('Filter changed to:', filter);
        }
    };

    const handleFilterApply = (filters: Record<string, any>) => {
        setAppliedFilters(filters);
        console.log('Applied filters:', filters);
        // Here you would apply the filters to your events data
    };

    const handleFilterClose = () => {
        setIsFilterOpen(false);
    };

    useEffect(() => {
        fetchEvents();
        loadFavorites();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            // Call the actual API to get events
            const response = await EventService.getEventList({
                page: 0,
                size: 20,
                sortBy: 'startDateTime',
                sortOrder: 'asc',
                status: 'UPCOMING'
            });

            if (response.success && response.data?.content) {
                // Convert API response to Event[] format with proper mapping
                const apiEvents: Event[] = response.data.content.map((event, index) => ({
                    id: event.id,
                    title: event.title.length > 25 ? event.title.substring(0, 25) + '...' : event.title,
                    description: event.shortDescription || '',
                    clubId: event.clubId || '',
                    coverImage: getEventFallbackImage(index), // Always use static images
                    imageUrl: getEventFallbackImage(index), // Always use static images
                    images: [getEventFallbackImage(index)], // Always use static images
                    location: event.location && event.location.length > 20 ?
                        event.location.substring(0, 20) + '...' :
                        (event.location || event.clubName || ''),
                    startDateTime: event.startDateTime,
                    endDateTime: event.endDateTime,
                    isPublic: event.isPublic,
                    requiresApproval: event.requiresApproval,
                    createdAt: event.formattedDate || new Date().toISOString(),
                    updatedAt: event.formattedDate || new Date().toISOString(),
                }));
                setEvents(apiEvents);
            } else {
                // Fallback to dummy data if API fails
                setEvents(DUMMY_EVENTS);
                if (response.message) {
                    console.warn('API returned message:', response.message);
                }
            }
        } catch (err: any) {
            console.error('Error loading events:', err);
            // Use dummy data as fallback
            setEvents(DUMMY_EVENTS);
            setError(err.message || 'Failed to load events');
            toast({
                title: 'Using cached data',
                description: err.message || 'Could not fetch latest events. Showing sample data.',
                variant: 'default',
            });
        } finally {
            setLoading(false);
        }
    };

    const loadFavorites = () => {
        try {
            const saved = localStorage.getItem('favoriteEvents');
            if (saved) {
                setFavorites(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    };

    const toggleFavorite = (eventId: string) => {
        try {
            const newFavorites = favorites.includes(eventId)
                ? favorites.filter(id => id !== eventId)
                : [...favorites, eventId];

            setFavorites(newFavorites);
            localStorage.setItem('favoriteEvents', JSON.stringify(newFavorites));

            toast({
                title: favorites.includes(eventId) ? 'Removed from favorites' : 'Added to favorites',
                description: favorites.includes(eventId)
                    ? 'Event removed from your favorites'
                    : 'Event added to your favorites',
            });
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast({
                title: 'Error',
                description: 'Failed to update favorites',
                variant: 'destructive',
            });
        }
    };

    const formatEventDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString('en', { month: 'short' }).toUpperCase();
            return { day, month };
        } catch {
            return { day: '00', month: 'XXX' };
        }
    };

    const eventsTodayList = events.slice(0, 4);
    const eventsThisWeekList = events.slice(2, 6);

    // Filter events based on active filter
    const getFilteredEvents = () => {
        switch (activeFilter) {
            case 'events-today':
                return eventsTodayList;
            case 'events-this-week':
                return eventsThisWeekList;
            case 'distance':
                // Add distance-based filtering logic
                return events;
            case 'previously-visited':
                // Add previously visited filtering logic
                return events;
            case 'popularity':
                // Add popularity-based filtering logic
                return events;
            default:
                return events;
        }
    };

    const filteredEvents = getFilteredEvents();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1e2328] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto"></div>
                    <p className="mt-4 text-lg">Loading events...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#1e2328] text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 text-lg mb-4">{error}</p>
                    <button
                        onClick={fetchEvents}
                        className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#031313] text-white">
            <div className="relative mx-auto max-w-[430px]">
                {/* Fixed Header with Gradient Background */}
                <header className="fixed top-0 left-0 w-full max-w-[430px] mx-auto h-[16vh] bg-gradient-to-b from-[#222831] to-[#11B9AB] rounded-b-[30px] px-5 pb-6 pt-4 z-50 flex flex-col justify-between">
                    {/* Header with Back Arrow and Profile */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleGoBack}
                                className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                            >
                                <ArrowLeft size={24} className="text-white" />
                            </button>
                            <h1 className="text-white text-base font-bold tracking-wide">
                                ALL EVENTS
                            </h1>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-10 px-4 py-2 bg-white/20 rounded-[23px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center gap-2">
                            <button
                                onClick={handleSearch}
                                disabled={isSearching || !searchQuery.trim()}
                                className="disabled:opacity-50"
                            >
                                {isSearching ? (
                                    <Loader2 className="w-[21px] h-[21px] text-white animate-spin" />
                                ) : (
                                    <Search className="w-[21px] h-[21px] text-white" />
                                )}
                            </button>
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                                className="flex-1 bg-transparent text-white text-base font-bold tracking-[0.5px] placeholder-white outline-none"
                                disabled={isSearching}
                            />
                        </div>
                        <button
                            onClick={handleNearbySearch}
                            disabled={isLoadingNearby}
                            className="w-10 h-10 bg-white/20 rounded-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center disabled:opacity-50"
                            title="Find nearby events"
                        >
                            {isLoadingNearby ? (
                                <Loader2 className="w-[21px] h-[21px] text-white animate-spin" />
                            ) : (
                                <MapPin className="w-[21px] h-[21px] text-white" />
                            )}
                        </button>
                        <div className="w-10 h-10 bg-white/20 rounded-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center">
                            <SlidersHorizontal className="w-[21px] h-[21px] text-white" />
                        </div>
                    </div>
                </header>

                {/* Location & Error Information */}
                {(currentLocation || locationError) && (
                    <div className="fixed top-[15vh] left-0 w-full max-w-[430px] mx-auto z-40 px-5">
                        {currentLocation && (
                            <div className="text-xs text-white/70 text-center mb-1">
                                📍 {currentLocation.label || currentLocation.city || `${currentLocation.latitude.toFixed(2)}, ${currentLocation.longitude.toFixed(2)}`}
                            </div>
                        )}
                        {locationError && (
                            <div className="text-xs text-yellow-300 text-center mb-1">
                                ⚠️ {locationError}
                            </div>
                        )}
                    </div>
                )}

                {/* Filter Section */}
                <div className="fixed top-[16vh] left-0 w-full max-w-[430px] mx-auto h-[6vh] bg-[#031313] z-30">
                    <div className="w-full py-5 flex items-center bg-gradient-to-b from-[#021313] to-transparent">
                        {/* Filter Button - fixed at left */}
                        <div className="flex-shrink-0 pl-5 pr-3">
                            <button
                                onClick={() => handleFilterChange('filter')}
                                className="flex items-center gap-[10px] bg-[#004342] rounded-[23px] border border-[#14FFEC] px-4 py-2 hover:bg-[#005F57] transition-colors"
                                style={{ width: 'auto', height: '40px', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}
                                data-filter="close"
                            >
                                {/* Filter SVG icon */}
                                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.5 4H16.5M0.5 12H10.5" stroke="white" strokeLinecap="round" />
                                    <path d="M0.5 4C0.5 5.65685 1.84315 7 3.5 7C5.15685 7 6.5 5.65685 6.5 4C6.5 2.34315 5.15685 1 3.5 1C1.84315 1 0.5 2.34315 0.5 4Z" stroke="white" strokeLinecap="round" />
                                    <path d="M10.5 12C10.5 13.6569 11.8431 15 13.5 15C15.1569 15 16.5 13.6569 16.5 12C16.5 10.3431 15.1569 9 13.5 9C11.8431 9 10.5 10.3431 10.5 12Z" stroke="white" strokeLinecap="round" />
                                </svg>
                                <span style={{ color: 'white', fontSize: '14px', fontFamily: 'Manrope', fontWeight: 800, lineHeight: '16px', letterSpacing: '0.5px' }}>Filter</span>
                            </button>
                        </div>
                        {/* Scrollable Filter Options - scroll left, fill remaining width */}
                        <div className="flex-1 overflow-x-auto scrollbar-hide pr-5">
                            <div className="flex items-center gap-2 min-w-max">
                                <button
                                    onClick={() => handleFilterChange('events-today')}
                                    className={`h-10 px-4 py-2 rounded-[25px] border flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors ${activeFilter === 'events-today'
                                        ? 'bg-[#14FFEC] border-[#004342] text-black font-bold'
                                        : 'bg-[#005F57] border-[#14FFEC] text-white font-bold hover:bg-[#007A6B]'
                                        }`}
                                >
                                    <div className="text-sm tracking-[0.5px]">Events Today</div>
                                </button>
                                <button
                                    onClick={() => handleFilterChange('events-this-week')}
                                    className={`h-10 px-4 py-2 rounded-[25px] border flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors ${activeFilter === 'events-this-week'
                                        ? 'bg-[#14FFEC] border-[#004342] text-black font-bold'
                                        : 'bg-[#004342] border-[#14FFEC] text-white font-bold hover:bg-[#005F57]'
                                        }`}
                                >
                                    <div className="text-sm tracking-[0.5px]">Events This Week</div>
                                </button>
                                <button
                                    onClick={() => handleFilterChange('distance')}
                                    className={`h-10 px-4 py-2 rounded-[25px] border flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors ${activeFilter === 'distance'
                                        ? 'bg-[#14FFEC] border-[#004342] text-black font-bold'
                                        : 'bg-[#004342] border-[#14FFEC] text-white font-bold hover:bg-[#005F57]'
                                        }`}
                                >
                                    <div className="text-sm tracking-[0.5px]">Distance</div>
                                </button>
                                <button
                                    onClick={() => handleFilterChange('previously-visited')}
                                    className={`h-10 px-4 py-2 rounded-[25px] border flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors ${activeFilter === 'previously-visited'
                                        ? 'bg-[#14FFEC] border-[#004342] text-black font-bold'
                                        : 'bg-[#004342] border-[#14FFEC] text-white font-bold hover:bg-[#005F57]'
                                        }`}
                                >
                                    <div className="text-sm tracking-[0.5px]">Previously Visited</div>
                                </button>
                                <button
                                    onClick={() => handleFilterChange('popularity')}
                                    className={`h-10 px-4 py-2 rounded-[25px] border flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors ${activeFilter === 'popularity'
                                        ? 'bg-[#14FFEC] border-[#004342] text-black font-bold'
                                        : 'bg-[#004342] border-[#14FFEC] text-white font-bold hover:bg-[#005F57]'
                                        }`}
                                >
                                    <div className="text-sm tracking-[0.5px]">Popularity</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Events Section Headers */}
                <div className="w-full px-5 pt-[24vh]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-white text-base font-semibold">Events today</h2>
                        <Link href="/events" className="text-[#14FFEC] text-base font-medium">View All</Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full px-5 space-y-8">
                    {/* Events Today Section */}
                    <section className="w-full">
                        <div className="w-full flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {eventsTodayList.length === 0 ? (
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-white/60 w-full">
                                    No events available for today.
                                </div>
                            ) : (
                                eventsTodayList.map((event, index) => (
                                    <EventListCard
                                        key={`today-${event.id ?? index}`}
                                        event={event}
                                        href="/event/timeless-tuesday"
                                        fallbackImage={getEventFallbackImage(index)}
                                        formattedDate={formatEventDate(event.startDateTime)}
                                        isFavorite={favorites.includes(event.id)}
                                        onToggleFavorite={toggleFavorite}
                                    />
                                ))
                            )}
                        </div>
                    </section>
                    {/* Events This Week Section */}
                    <section className="w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white text-base font-semibold">Events this week</h2>
                            <Link href="/events" className="text-[#14FFEC] text-base font-medium">View All</Link>
                        </div>
                        <div className="w-full flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {eventsThisWeekList.length === 0 ? (
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-white/60 w-full">
                                    No events scheduled for later this week.
                                </div>
                            ) : (
                                eventsThisWeekList.map((event, index) => (
                                    <EventListCard
                                        key={`week-${event.id ?? index}`}
                                        event={event}
                                        href="/event/timeless-tuesday"
                                        fallbackImage={getEventFallbackImage(index + 10)}
                                        formattedDate={formatEventDate(event.startDateTime)}
                                        isFavorite={favorites.includes(event.id)}
                                        onToggleFavorite={toggleFavorite}
                                    />
                                ))
                            )}
                        </div>
                    </section>
                    {/* All Events Section */}
                    <section className="w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white text-base font-semibold">All Events</h2>
                        </div>
                        <div className="w-full flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                            {events.length === 0 ? (
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-white/60 w-full">
                                    We couldn’t find any events right now. Check back soon!
                                </div>
                            ) : (
                                <div className="space-y-5 pb-6 w-full">
                                    {events.map((event, index) => (
                                        <EventCard
                                            key={`all-${event.id ?? index}`}
                                            event={event}
                                            href={`/event/${event.title.toLowerCase().replace(/\s+/g, '-')}`}
                                            fallbackImage={getEventFallbackImage(index)}
                                            formattedDate={formatEventDate(event.startDateTime)}
                                            isFavorite={favorites.includes(event.id)}
                                            onToggleFavorite={toggleFavorite}
                                            className="w-full"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {/* Filter Popup */}
            <FilterPopup
                isOpen={isFilterOpen}
                onClose={handleFilterClose}
                onApply={handleFilterApply}
                sections={EVENT_FILTER_SECTIONS}
            />
        </div>
    );
}