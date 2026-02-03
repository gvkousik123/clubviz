'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, User, SlidersHorizontal, MapPin, Heart } from 'lucide-react';
import type { EventListItem } from '@/lib/services/event.service';
import { useToast } from '@/hooks/use-toast';
import { EventsListSkeleton } from '@/components/ui/skeleton-loaders';
import { PublicEventService } from '@/lib/services/public.service';

export default function EventsListPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [events, setEvents] = useState<EventListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const fetchEvents = async () => {
        setLoading(true);

        try {
            const response = await PublicEventService.getPublicEvents({
                page: 0,
                size: 50,
                sortBy: 'startDateTime',
                sortOrder: 'asc',
                status: 'UPCOMING'
            });

            if (response && response.content) {
                setEvents(response.content);
            } else {
                setEvents([]);
            }
        } catch (err) {
            console.error('💥 Failed to load events', err);
            toast({
                title: "Error loading events",
                description: "Could not fetch latest events.",
                variant: "destructive"
            });
            setEvents([]);
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

    const handleGoBack = () => {
        router.back();
    };

    const handleSearch = () => {
        fetchEvents();
    };

    const handleEventClick = (eventId: string) => {
        router.push(`/event/${eventId}`);
    };

    useEffect(() => {
        fetchEvents();
        loadFavorites();
    }, []);

    // Filter events by selected date
    const getEventsForSelectedDate = () => {
        return events.filter(event => {
            const eventDate = new Date(event.startDateTime);
            return eventDate.getDate() === selectedDate.getDate() &&
                eventDate.getMonth() === selectedDate.getMonth() &&
                eventDate.getFullYear() === selectedDate.getFullYear();
        });
    };

    const filteredEvents = getEventsForSelectedDate();

    // Generate date range for calendar (today + 7 days)
    const getDateRange = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const dateRange = getDateRange();

    const getEventFallbackImage = (index: number) => {
        const eventImages = [
            '/event list/Rectangle 1.jpg',
            '/event list/Rectangle 2.jpg',
            '/event list/Rectangle 3.jpg',
            '/event list/Rectangle 4.jpg',
            '/event list/Rectangle 5.jpg',
            '/event list/Rectangle 12249.jpg'
        ];
        return eventImages[index % eventImages.length];
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

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
                                <Search className="w-[21px] h-[21px] text-white" />
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
                <div className="w-full space-y-6 pt-[18vh] pb-8">
                    {/* Calendar Picker */}
                    <section className="w-full px-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white text-base font-semibold">Select Date</h2>
                        </div>
                        <div className="overflow-x-auto scrollbar-hide">
                            <div className="flex gap-3 pb-2">
                                {dateRange.map((date, index) => {
                                    const isSelected = selectedDate.getDate() === date.getDate() &&
                                        selectedDate.getMonth() === date.getMonth() &&
                                        selectedDate.getFullYear() === date.getFullYear();
                                    const day = date.getDate();
                                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedDate(new Date(date))}
                                            className={`flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-xl transition-all flex-shrink-0 border ${isSelected
                                                ? 'bg-[#14FFEC] border-[#14FFEC] text-black'
                                                : 'bg-[#0D1F1F] border-[#14FFEC]/30 text-white hover:border-[#14FFEC]'
                                                }`}
                                        >
                                            <span className="text-xs font-semibold uppercase">{dayName}</span>
                                            <span className="text-lg font-bold">{day}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* All Events Section */}
                    <section className="w-full px-5">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white text-base font-semibold">All Events</h2>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <EventsListSkeleton count={3} />
                            ) : events.length === 0 ? (
                                <div className="text-white/60 text-sm text-center py-12 bg-[#0D1F1F] rounded-lg border border-white/10">
                                    No events available
                                </div>
                            ) : (
                                events.map((event, index) => (
                                    <div
                                        key={event.id}
                                        onClick={() => handleEventClick(event.id)}
                                        className="w-full bg-[#021A1A] rounded-[20px] overflow-hidden flex cursor-pointer border border-white/5 h-[120px] hover:border-[#14FFEC]/50 transition-all"
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
                                                <div className="flex-1">
                                                    <span className="text-xs text-[#14FFEC] font-bold uppercase mb-1 block">
                                                        {new Date(event.startDateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                    </span>
                                                    <h3 className="text-white text-sm font-bold leading-tight line-clamp-2 mb-1">
                                                        {event.title}
                                                    </h3>
                                                    <p className="text-white/50 text-xs truncate flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {event.location || event.clubName}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(event.id);
                                                    }}
                                                    className={`flex-shrink-0 ml-2 transition-colors ${favorites.includes(event.id)
                                                        ? 'text-[#14FFEC]'
                                                        : 'text-white/30 hover:text-[#14FFEC]'
                                                        }`}
                                                >
                                                    <Heart className="w-4 h-4" fill={favorites.includes(event.id) ? 'currentColor' : 'none'} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Events on Selected Date Section */}
                    {filteredEvents.length > 0 && (
                        <section className="w-full px-5 border-t border-[#14FFEC]/20 pt-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-white text-base font-semibold">
                                    {isToday(selectedDate) ? 'Today\'s Events' : `Events on ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {filteredEvents.map((event, index) => (
                                    <div
                                        key={event.id}
                                        onClick={() => handleEventClick(event.id)}
                                        className="w-full bg-[#14FFEC]/10 rounded-[20px] overflow-hidden flex cursor-pointer border border-[#14FFEC]/30 h-[120px] hover:border-[#14FFEC] transition-all"
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
                                                <div className="flex-1">
                                                    <span className="text-xs text-[#14FFEC] font-bold uppercase mb-1 block">
                                                        {new Date(event.startDateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                    </span>
                                                    <h3 className="text-white text-sm font-bold leading-tight line-clamp-2 mb-1">
                                                        {event.title}
                                                    </h3>
                                                    <p className="text-white/50 text-xs truncate flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {event.location || event.clubName}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(event.id);
                                                    }}
                                                    className={`flex-shrink-0 ml-2 transition-colors ${favorites.includes(event.id)
                                                        ? 'text-[#14FFEC]'
                                                        : 'text-white/30 hover:text-[#14FFEC]'
                                                        }`}
                                                >
                                                    <Heart className="w-4 h-4" fill={favorites.includes(event.id) ? 'currentColor' : 'none'} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
            );
}
