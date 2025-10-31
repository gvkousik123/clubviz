'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, User, SlidersHorizontal, MapPin, Loader2 } from 'lucide-react';
import type { Event } from '@/lib/api-types';
import { useToast } from '@/hooks/use-toast';

import { useSearch } from '@/hooks/use-search';
import { useEventList } from '@/hooks/use-event-list';
import { EventService } from '@/lib/services/event.service';


export default function EventsListPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

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
                setEvents([]);
                if (response.message) {
                    console.warn('API returned message:', response.message);
                }
            }
        } catch (err: any) {
            console.error('Error loading events:', err);
            setEvents([]);
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

                {/* Main Content */}
                <div className="w-full space-y-8 pt-[18vh]">
                    {/* This Week Events */}
                    <section className="w-full">
                        <div className="flex items-center justify-between mb-6 px-5">
                            <h2 className="text-white text-base font-semibold">This Week</h2>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide pl-5">
                            {loading ? (
                                <div className="flex items-center justify-center w-full py-8">
                                    <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
                                </div>
                            ) : events.length === 0 ? (
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-white/60 w-full mr-5">
                                    No events available this week. Check back soon!
                                </div>
                            ) : (
                                events.map((event, index) => {
                                    const eventDate = new Date(event.startDateTime);
                                    const monthShort = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                                    const day = eventDate.getDate().toString().padStart(2, '0');
                                    const fallbackImage = getEventFallbackImage(index);

                                    return (
                                        <div key={event.id} className="w-[222px] h-[305px] flex-shrink-0 relative rounded-[20px] overflow-hidden" style={{ background: 'radial-gradient(ellipse 79.96% 39.73% at 22.30% 70.24%, black 0%, #014A4B 100%)' }}>
                                            {/* Image */}
                                            <div className="relative">
                                                <img
                                                    src={fallbackImage}
                                                    alt={event.title}
                                                    className="w-full h-[180px] object-cover"
                                                    style={{
                                                        borderWidth: '1.5px',
                                                        borderStyle: 'solid',
                                                        borderColor: '#28D2DB',
                                                        borderBottomRightRadius: '0',
                                                        borderTopLeftRadius: '20px',
                                                        borderTopRightRadius: '20px',
                                                        borderBottomLeftRadius: '20px',
                                                    }}
                                                />
                                            </div>

                                            {/* Date Badge */}
                                            <div className="absolute right-4 top-0 w-[36px] h-[45px] px-[2px] py-[10px] bg-gradient-to-b from-black to-[#00C0CA] rounded-b-[28px] border-l border-r border-b border-[#CDCDCD] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
                                                <div className="w-[31px] text-center text-white text-[14px] font-semibold font-['Manrope'] leading-4">{monthShort}<br />{day}</div>
                                            </div>

                                            {/* Content */}
                                            <div className="absolute left-[18px] right-[18px] top-[188px] flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-white text-[13px] font-bold font-['Manrope'] leading-[18px] mb-1 truncate">
                                                        {event.title}
                                                    </div>
                                                    <div className="text-[#C6C6C6] text-[11px] font-semibold font-['Manrope'] leading-[15px] tracking-[0.01em] truncate">
                                                        {event.location}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleFavorite(event.id);
                                                    }}
                                                    className="w-[34px] h-[34px] p-[5px] bg-neutral-300/10 rounded-[22px] backdrop-blur-[35px] flex justify-center items-center"
                                                >
                                                    <svg className="w-5 h-5 text-[#14FFEC]" fill={favorites.includes(event.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="absolute left-[18px] right-[18px] top-[249px]">
                                                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#14FFEC] to-transparent"></div>
                                            </div>

                                            <div className="absolute left-[18px] right-[18px] top-[262px] text-white text-[11px] font-bold font-['Manrope'] leading-[15px] tracking-[0.01em] truncate">
                                                {event.description || formatEventDate(event.startDateTime).day + ' ' + formatEventDate(event.startDateTime).month}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>

                    {/* Today Events */}
                    <section className="w-full">
                        <div className="flex items-center justify-between mb-6 px-5">
                            <h2 className="text-white text-base font-semibold">Today</h2>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide pl-5">
                            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-white/60 w-full mr-5">
                                No events scheduled for today
                            </div>
                        </div>
                    </section>
                </div>
            </div>


        </div>
    );
}
