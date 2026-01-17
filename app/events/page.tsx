'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, User, SlidersHorizontal, MapPin, Loader2, Heart, ChevronRight } from 'lucide-react';
import type { EventListItem } from '@/lib/services/event.service';
import { useToast } from '@/hooks/use-toast';

import { PublicEventService } from '@/lib/services/public.service';
import { usePublicEvents } from '@/hooks/use-public-events';


export default function EventsListPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [events, setEvents] = useState<EventListItem[]>([]);
    const [myRegisteredEvents, setMyRegisteredEvents] = useState<EventListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMyEvents, setLoadingMyEvents] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [pagination, setPagination] = useState({ page: 0, hasNext: false });

    // Public events hook - uses only public APIs from API-DOCUMENTATION.json
    const publicEvents = usePublicEvents();

    const fetchEvents = async (page = 0, append = false) => {
        if (!append) setLoading(true);
        else setIsLoadingMore(true);

        try {
            // ONLY use Public API - defined in API-DOCUMENTATION.json
            // Endpoint: GET /event-management/events/list
            console.log('🔍 Fetching events with params:', { page, size: 20, sortBy: 'startDateTime', sortOrder: 'asc' });
            const response = await PublicEventService.getPublicEvents({
                page,
                size: 20,
                sortBy: 'startDateTime',
                sortOrder: 'asc',
                status: 'UPCOMING'
            });
            console.log('✅ Events API Response:', response);

            if (response && response.content) {
                const newEvents = response.content;
                console.log('📊 Received events:', newEvents.length, newEvents);
                if (append) {
                    setEvents(prev => [...prev, ...newEvents]);
                } else {
                    setEvents(newEvents);
                }
                setPagination({
                    page: response.currentPage || page,
                    hasNext: response.hasNext || false
                });
            } else {
                console.log('❌ No events in response');
                if (!append) {
                    setEvents([]);
                }
            }
        } catch (err) {
            console.error('💥 Failed to load events', err);
            if (!append) {
                toast({
                    title: "Error loading events",
                    description: "Could not fetch latest events.",
                    variant: "destructive"
                });
                setEvents([]);
            }
        } finally {
            if (!append) setLoading(false);
            else setIsLoadingMore(false);
        }
    };

    // Fetch user's registered events
    const fetchMyRegisteredEvents = async () => {
        setLoadingMyEvents(true);
        try {
            console.log('🔍 Fetching my registered events...');
            const response = await PublicEventService.getMyRegistrations({
                page: 0,
                size: 20,
                sortBy: 'startDateTime',
                sortOrder: 'asc'
            });
            console.log('✅ My Registered Events API Response:', response);

            if (response && response.content && response.content.length > 0) {
                console.log('📊 Received registered events:', response.content.length);
                setMyRegisteredEvents(response.content);
            } else {
                console.log('❌ No registered events found');
                setMyRegisteredEvents([]);
            }
        } catch (err) {
            console.error('💥 Failed to load registered events:', err);
            setMyRegisteredEvents([]);
        } finally {
            setLoadingMyEvents(false);
        }
    };

    useEffect(() => {
        fetchEvents();
        fetchMyRegisteredEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    // Fallback data for when API fails
    const eventFallback = [
        { id: 'event-1', title: 'Freaky Friday with DJ Alexxx', shortDescription: 'Techno & Bollytech', location: 'DABO, Airport Road', startDateTime: new Date('2025-04-04T19:30:00Z').toISOString(), image: '/event list/Rectangle 1.jpg' },
        { id: 'event-2', title: 'Wow Wednesday with DJ Shade', shortDescription: 'Bollywood & Bollytech', location: 'DABO, Airport Road', startDateTime: new Date('2025-04-06T19:30:00Z').toISOString(), image: '/event list/Rectangle 2.jpg' },
        { id: 'event-3', title: 'Saturday Night Fever', shortDescription: 'Deep house & Mellow Tech', location: 'Garage Club', startDateTime: new Date('2025-04-08T20:00:00Z').toISOString(), image: '/event list/Rectangle 3.jpg' },
        { id: 'event-4', title: 'Sunday Vibes', shortDescription: 'Chill & Lounge', location: 'Elite Club', startDateTime: new Date('2025-04-09T18:00:00Z').toISOString(), image: '/event list/Rectangle 4.jpg' },
        { id: 'event-5', title: 'Monday Madness', shortDescription: 'House & Techno', location: 'Rhythm Club', startDateTime: new Date('2025-04-10T20:30:00Z').toISOString(), image: '/event list/Rectangle 5.jpg' },
    ];

    const handleGoBack = () => {
        router.back();
    };

    const handleSearch = async () => {
        // Use public API for search - reload events
        fetchEvents(0, false);
    };

    const handleEventClick = (eventId: string) => {
        router.push(`/event/${eventId}`);
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

    const isValidImageUrl = (url: string) => {
        return url && url.startsWith('http') && !url.includes('null') && !url.includes('undefined');
    };

    // Helper function to get the start and end of the current week (Monday to Sunday)
    const getCurrentWeekRange = () => {
        const now = new Date();
        const currentDay = now.getDay();
        const diff = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Adjust to get Monday

        const weekStart = new Date(now.setDate(diff));
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        return { weekStart, weekEnd };
    };

    // Helper function to check if an event is in the current week
    const isEventThisWeek = (eventDate: string): boolean => {
        const { weekStart, weekEnd } = getCurrentWeekRange();
        const eventDateTime = new Date(eventDate);
        return eventDateTime >= weekStart && eventDateTime <= weekEnd;
    };

    // Get filtered events for "This Week" section
    const getThisWeekEvents = () => {
        return events.filter(event => isEventThisWeek(event.startDateTime));
    };

    useEffect(() => {
        fetchEvents();
        loadFavorites();
    }, []);

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
                        <div className="flex-1 h-10 px-4 py-2 bg-white/20 rounded-[23px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center gap-2 min-w-0">
                            <button
                                onClick={handleSearch}
                                disabled={loading || !searchQuery.trim()}
                                className="disabled:opacity-50 flex-shrink-0"
                            >
                                {loading ? (
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
                                className="flex-1 bg-transparent text-white text-base font-bold tracking-[0.5px] placeholder-white outline-none min-w-0"
                                disabled={loading}
                            />
                        </div>
                        <button className="w-10 h-10 bg-white/20 rounded-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center flex-shrink-0">
                            <SlidersHorizontal className="w-[21px] h-[21px] text-white" />
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <div className="w-full space-y-8 pt-[18vh]">
                    {/* My Registered Events */}
                    <section className="w-full">
                        <div className="flex items-center justify-between mb-6 px-5">
                            <h2 className="text-white text-base font-semibold">My Registered Events</h2>
                        </div>
                        {loadingMyEvents ? (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide pl-5">
                                <div className="flex items-center justify-center w-full py-8 text-white/50">
                                    <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...
                                </div>
                            </div>
                        ) : myRegisteredEvents.length > 0 ? (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide pl-5">
                                {myRegisteredEvents.map((event, index) => {
                                    const eventDate = new Date(event.startDateTime);
                                    const monthShort = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                                    const day = eventDate.getDate().toString().padStart(2, '0');
                                    const fallbackImage = getEventFallbackImage(index);

                                    return (
                                        <Link
                                            key={event.id}
                                            href={`/event/${event.id}`}
                                            className="w-[222px] h-[305px] flex-shrink-0 relative rounded-[20px] overflow-hidden hover:shadow-lg transition-shadow group"
                                            style={{ background: 'radial-gradient(ellipse 79.96% 39.73% at 22.30% 70.24%, black 0%, #014A4B 100%)' }}
                                        >
                                            {/* Image */}
                                            <div className="relative">
                                                <img
                                                    src={event.imageUrl || fallbackImage}
                                                    alt={event.title}
                                                    className="w-full h-[180px] object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = fallbackImage;
                                                    }}
                                                />
                                            </div>

                                            {/* Date Badge */}
                                            <div className="absolute left-3 top-3 bg-white/20 backdrop-blur-md rounded-lg px-2 py-1 text-white text-xs font-bold">
                                                <div>{monthShort}</div>
                                                <div className="text-base font-black">{day}</div>
                                            </div>

                                            {/* Glassmorphic container for content */}
                                            <div className="absolute inset-x-3 bottom-3 bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                                                <h3 className="text-white font-bold text-sm line-clamp-2 mb-1">
                                                    {event.title}
                                                </h3>
                                                <p className="text-white/70 text-xs line-clamp-1 mb-2">
                                                    {event.location}
                                                </p>
                                                <p className="text-cyan-300 text-xs font-semibold">
                                                    {event.formattedTime}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="px-5 py-8 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-white/50 text-sm text-center">
                                    No events registered yet. Register for events to see them here!
                                </p>
                            </div>
                        )}
                    </section>
                    {/* This Week Events */}
                    <section className="w-full">
                        <div className="flex items-center justify-between mb-6 px-5">
                            <h2 className="text-white text-base font-semibold">This Week</h2>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide pl-5">
                            {loading ? (
                                <div className="flex items-center justify-center w-full py-8 text-white/50">
                                    <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...
                                </div>
                            ) : events.filter(e => {
                                const d = new Date(e.startDateTime);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const nextWeek = new Date(today);
                                nextWeek.setDate(today.getDate() + 7);
                                return d >= today && d <= nextWeek;
                            }).length > 0 ? (
                                events.filter(e => {
                                    const d = new Date(e.startDateTime);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const nextWeek = new Date(today);
                                    nextWeek.setDate(today.getDate() + 7);
                                    return d >= today && d <= nextWeek;
                                }).map((event, index) => (
                                    <div
                                        key={event.id}
                                        onClick={() => handleEventClick(event.id)}
                                        className="relative min-w-[222px] h-[320px] bg-[#021A1A] rounded-[18px] overflow-hidden flex-shrink-0 cursor-pointer border border-white/5"
                                    >
                                        {/* Image */}
                                        <div className="h-[180px] w-full relative">
                                            <img
                                                src={event.imageUrl || getEventFallbackImage(index)}
                                                alt={event.title}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Gradient Overlay for Date Badge visibility */}
                                            <div className="absolute top-0 right-0 p-2">
                                                <div className="bg-black/60 backdrop-blur-md text-white rounded-lg px-2 py-1 flex flex-col items-center border border-white/10">
                                                    <span className="text-[10px] uppercase font-bold text-[#14FFEC]">
                                                        {new Date(event.startDateTime).toLocaleDateString('en-US', { month: 'short' })}
                                                    </span>
                                                    <span className="text-xl font-bold leading-none">
                                                        {new Date(event.startDateTime).getDate()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 flex flex-col justify-between h-[140px]">
                                            <div>
                                                <h3 className="text-white text-base font-bold leading-tight mb-1 line-clamp-2 font-['Manrope']">
                                                    {event.title}
                                                </h3>
                                                <div className="flex items-center gap-1 text-white/50 text-xs mb-3">
                                                    <MapPin className="w-3 h-3" />
                                                    <span className="truncate max-w-[150px]">{event.location || event.clubName || 'Location TBD'}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-white/10 pt-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-[#14FFEC] bg-[#14FFEC]/10 px-2 py-0.5 rounded-full border border-[#14FFEC]/20">
                                                        {event.eventStatusText || 'Upcoming'}
                                                    </span>
                                                </div>
                                                {/* Favorite Button Placeholder */}
                                                <button className="text-white/30 hover:text-[#14FFEC] transition-colors">
                                                    <Heart className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-white/60 text-sm py-4">No events found this week.</div>
                            )}
                        </div>
                    </section>

                    {/* Today Events */}
                    <section className="w-full">
                        <div className="flex items-center justify-between mb-6 px-5">
                            <h2 className="text-white text-base font-semibold">Today</h2>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide pl-5">
                            {loading ? (
                                <div className="flex items-center justify-center min-w-[200px] py-8 text-white/50">
                                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                </div>
                            ) : events.filter(e => {
                                const d = new Date(e.startDateTime);
                                const t = new Date();
                                return d.getDate() === t.getDate() &&
                                    d.getMonth() === t.getMonth() &&
                                    d.getFullYear() === t.getFullYear();
                            }).length > 0 ? (
                                events.filter(e => {
                                    const d = new Date(e.startDateTime);
                                    const t = new Date();
                                    return d.getDate() === t.getDate() &&
                                        d.getMonth() === t.getMonth() &&
                                        d.getFullYear() === t.getFullYear();
                                }).map((event, index) => (
                                    <div
                                        key={event.id}
                                        onClick={() => handleEventClick(event.id)}
                                        className="relative min-w-[280px] h-[160px] bg-[#021A1A] rounded-[18px] overflow-hidden flex-shrink-0 cursor-pointer border border-white/5"
                                    >
                                        {/* Image Background with Overlay */}
                                        <div className="absolute inset-0">
                                            <img
                                                src={event.imageUrl || getEventFallbackImage(index)}
                                                alt={event.title}
                                                className="w-full h-full object-cover opacity-60"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#021A1A] via-[#021A1A]/50 to-transparent" />
                                        </div>

                                        {/* Content */}
                                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <span className="text-xs text-[#14FFEC] font-bold uppercase mb-1 block">
                                                        Today • {new Date(event.startDateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                    </span>
                                                    <h3 className="text-white text-lg font-bold leading-tight mb-1 line-clamp-1">
                                                        {event.title}
                                                    </h3>
                                                    <p className="text-white/70 text-xs truncate flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {event.location || event.clubName}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-white/60 text-sm px-5 py-8 mr-5 w-full text-center bg-[#021A1A] rounded-[15px] border border-white/5">
                                    No events scheduled for today
                                </div>
                            )}
                        </div>
                    </section>

                    {/* All Events */}
                    <section className="w-full px-5">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white text-base font-semibold">All Events</h2>
                        </div>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="flex items-center justify-center w-full py-8 text-white/50">
                                    <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
                                </div>
                            ) : events.length === 0 ? (
                                <div className="text-white/60 text-sm text-center py-8">
                                    No events available
                                </div>
                            ) : (
                                events.map((event, index) => (
                                    <div
                                        key={event.id}
                                        onClick={() => handleEventClick(event.id)}
                                        className="w-full bg-[#021A1A] rounded-[20px] overflow-hidden flex cursor-pointer border border-white/5 h-[120px]"
                                    >
                                        {/* Image */}
                                        <div className="w-[120px] h-full relative flex-shrink-0">
                                            <img
                                                src={event.imageUrl || getEventFallbackImage(index)}
                                                alt={event.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-3 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-xs text-[#14FFEC] font-bold uppercase mb-1 block">
                                                        {new Date(event.startDateTime).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                    </span>
                                                    <h3 className="text-white text-base font-bold leading-tight line-clamp-2 mb-1">
                                                        {event.title}
                                                    </h3>
                                                    <p className="text-white/50 text-xs truncate flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {event.location || event.clubName}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mt-2">
                                                <div className="text-xs text-white/40">
                                                    {new Date(event.startDateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                </div>
                                                <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#14FFEC] hover:text-black transition-colors group">
                                                    <ChevronRight className="w-4 h-4 text-white group-hover:text-black" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}

                            {/* Load More Button */}
                            {pagination.hasNext && (
                                <div className="flex justify-center pt-4 pb-8">
                                    <button
                                        onClick={() => fetchEvents(pagination.page + 1, true)}
                                        disabled={isLoadingMore}
                                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isLoadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Load More
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>


        </div>
    );
}
