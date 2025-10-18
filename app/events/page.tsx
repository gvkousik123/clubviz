'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, User, SlidersHorizontal } from 'lucide-react';
import type { Event } from '@/lib/api-types';
import { useToast } from '@/hooks/use-toast';
import { EventCard } from '@/components/events/event-card';
import { EventListCard } from '@/components/events/event-list-card';


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

    const handleSearch = () => {
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
        }
    };

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        // Add filtering logic here based on the selected filter
        console.log('Filter changed to:', filter);
    };

    useEffect(() => {
        fetchEvents();
        loadFavorites();
    }, []);

    const fetchEvents = async () => {
        // Use local dummy events for now (no API calls)
        setLoading(true);
        setError(null);
        try {
            // Simulate a short delay to preserve loading UI
            await new Promise((res) => setTimeout(res, 250));
            setEvents(DUMMY_EVENTS);
        } catch (err) {
            console.error('Error loading dummy events:', err);
            setError('Failed to load events.');
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
                {/* Header with Gradient Background - Same as Home Page */}
                <header className="relative bg-gradient-to-b from-[#222831] to-[#11B9AB] rounded-b-[30px] px-5 pb-6 pt-12 z-50">
                    {/* Header with Back Arrow and Profile */}
                    <div className="flex items-center justify-between mb-6">
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
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-10 px-4 py-2 bg-white/20 rounded-[23px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center gap-2">
                            <Search className="w-[21px] h-[21px] text-white" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent text-white text-base font-bold tracking-[0.5px] placeholder-white outline-none"
                            />
                        </div>
                        <div className="w-10 h-10 bg-white/20 rounded-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center">
                            <SlidersHorizontal className="w-[21px] h-[21px] text-white" />
                        </div>
                    </div>
                </header>

                {/* Filter Section */}
                <div className="relative px-6 py-5">
                    <div
                        className="w-full h-full py-5 relative overflow-hidden flex justify-end items-end gap-3"
                        style={{
                            background: 'linear-gradient(180deg, #021313 0%, rgba(34, 40, 49, 0) 100%)'
                        }}
                    >
                        {/* Filter Button */}
                        <div className="flex-shrink-0">
                            <button
                                onClick={() => handleFilterChange('filter')}
                                className="h-10 px-3.5 py-2 bg-[#004342] overflow-hidden rounded-[23px] border border-[#14FFEC] flex items-center justify-center gap-2 hover:bg-[#005F57] transition-colors"
                            >
                                <div className="w-4 h-2 border border-white rounded-sm"></div>
                                <div className="text-white text-sm font-extrabold tracking-[0.5px]">Filter</div>
                            </button>
                        </div>

                        {/* Scrollable Filter Options */}
                        <div className="flex-1 overflow-hidden">
                            <div className="px-0.5 overflow-x-auto flex items-center gap-2 scrollbar-hide">
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

                        {/* Gradient Fade on Right */}
                        <div
                            className="absolute right-0 top-8 w-8 h-[59px] pointer-events-none"
                            style={{
                                background: 'linear-gradient(270deg, #021313 0%, rgba(2, 19, 19, 0) 100%)'
                            }}
                        ></div>
                    </div>
                </div>

                {/* Events Section Headers */}
                <div className="px-5">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-white text-base font-semibold">Events today</h2>
                        <Link href="/events" className="text-[#14FFEC] text-base font-medium">View All</Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-5 space-y-8">
                    {/* Events Today Section */}
                    <section>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {eventsTodayList.length === 0 ? (
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-white/60 w-full">
                                    No events available for today.
                                </div>
                            ) : (
                                eventsTodayList.map((event, index) => (
                                    <EventListCard
                                        key={`today-${event.id ?? index}`}
                                        event={event}
                                        href={`/event/${event.title.toLowerCase().replace(/\s+/g, '-')}`}
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
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white text-base font-semibold">Events this week</h2>
                            <Link href="/events" className="text-[#14FFEC] text-base font-medium">View All</Link>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {eventsThisWeekList.length === 0 ? (
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-white/60 w-full">
                                    No events scheduled for later this week.
                                </div>
                            ) : (
                                eventsThisWeekList.map((event, index) => (
                                    <EventListCard
                                        key={`week-${event.id ?? index}`}
                                        event={event}
                                        href={`/event/${event.title.toLowerCase().replace(/\s+/g, '-')}`}
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
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-white text-base font-semibold">All Events</h2>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
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
                </div>
            </div>
        </div>
    );
}