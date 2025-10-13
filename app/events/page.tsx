'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Calendar, MapPin, Users } from 'lucide-react';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import { EventService } from '@/lib/services/event.service';
import type { Event } from '@/lib/api-types';
import { useToast } from '@/hooks/use-toast';

export default function EventsListPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);

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

    useEffect(() => {
        fetchEvents();
        loadFavorites();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await EventService.getEvents({
                page: 1,
                limit: 50
            });
            setEvents(response.data.events);
        } catch (err) {
            setError('Failed to load events. Please try again.');
            console.error('Error fetching events:', err);
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
        <div className="min-h-screen bg-[#1e2328] text-white">
            {/* Header with Gradient Background */}
            <div className="header-gradient rounded-b-[30px] pb-8 pt-4">
                <div className="flex items-center justify-between px-6 pt-4 mb-6">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide text-center flex-1 mr-10">
                        ALL EVENTS
                    </h1>
                    <Link href="/filter">
                        <button className="p-2 hover:bg-white/10 rounded-full transition-all duration-300">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                            </svg>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Filter Section */}
            <div className="px-6 py-4">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                    <button className="flex items-center gap-2 bg-[#2d343a] border border-cyan-400 text-cyan-400 px-4 py-2 rounded-full whitespace-nowrap hover:bg-cyan-400/10 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                        </svg>
                        Filter
                    </button>
                    <button className="header-gradient text-white px-6 py-2 rounded-full whitespace-nowrap hover:brightness-110 transition-all">
                        Events Today
                    </button>
                    <button className="bg-[#2d343a] border border-white/20 text-white px-6 py-2 rounded-full whitespace-nowrap hover:bg-white/5 transition-colors">
                        Events This Week
                    </button>
                </div>
            </div>

            {/* Events Section Headers */}
            <div className="px-6">
                <h2 className="text-white font-semibold text-lg mb-4">Events today</h2>
            </div>

            {/* Main Content */}
            <div className="px-6 space-y-4">
                {/* Events Today Grid */}
                <div className="flex gap-4 overflow-x-auto scrollbar-hide" style={{ width: 'max-content' }}>
                    {events.slice(0, 2).map((event, index) => (
                        <div key={event.id} className="flex-shrink-0 w-[222px]">
                            <Link href={`/event/${event.title.toLowerCase().replace(/\s+/g, '-')}`}>
                                <div className="bg-teal-900/20 rounded-[20px] overflow-hidden relative"
                                    style={{
                                        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)'
                                    }}>
                                    {/* Image Section */}
                                    <div className="relative">
                                        <img
                                            src={event.coverImage || event.images?.[0] || getEventFallbackImage(index)}
                                            alt={event.title}
                                            className="w-full h-[200px] object-cover border-2 border-teal-400/30 rounded-t-[20px]"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = getEventFallbackImage(index);
                                            }}
                                        />
                                        {/* Date Badge */}
                                        <div className="absolute top-3 right-3 bg-gradient-to-b from-teal-600 to-teal-700 text-white text-xs font-bold px-2 py-1 rounded-lg min-w-[45px]">
                                            <div className="text-center">
                                                <div className="text-[10px] opacity-70">{formatEventDate(event.startDateTime).month}</div>
                                                <div className="text-sm font-bold">{formatEventDate(event.startDateTime).day}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-white font-bold text-base leading-tight mb-1">{event.title}</h3>
                                                <p className="text-white/70 text-sm">{event.club?.name || 'Venue TBD'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Full-width Teal Highlight Section */}
                                    <div className="header-gradient text-white text-sm font-medium px-3 py-2 w-full">
                                        <div className="text-center">
                                            {event.musicGenres?.[0] || 'Music Event'}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>                {/* Events This Week Section */}
                <div className="mt-8">
                    <h2 className="text-white font-semibold text-lg mb-4">Events this week</h2>
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide" style={{ width: 'max-content' }}>
                        {events.slice(0, 2).map((event, index) => (
                            <div key={`week-${event.id}`} className="flex-shrink-0 w-[222px]">
                                <Link href={`/event/${event.title.toLowerCase().replace(/\s+/g, '-')}`}>
                                    <div className="bg-teal-900/20 rounded-[20px] overflow-hidden relative"
                                        style={{
                                            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)'
                                        }}>
                                        {/* Image Section */}
                                        <div className="relative">
                                            <img
                                                src={event.coverImage || event.images?.[0] || getEventFallbackImage(index + 10)}
                                                alt={event.title}
                                                className="w-full h-[200px] object-cover border-2 border-teal-400/30 rounded-t-[20px]"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = getEventFallbackImage(index + 10);
                                                }}
                                            />
                                            {/* Date Badge */}
                                            <div className="absolute top-3 right-3 bg-gradient-to-b from-teal-600 to-teal-700 text-white text-xs font-bold px-2 py-1 rounded-lg min-w-[45px]">
                                                <div className="text-center">
                                                    <div className="text-[10px] opacity-70">{formatEventDate(event.startDateTime).month}</div>
                                                    <div className="text-sm font-bold">{formatEventDate(event.startDateTime).day}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="text-white font-bold text-base leading-tight mb-1">{event.title}</h3>
                                                    <p className="text-white/70 text-sm">{event.club?.name || 'Venue TBD'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Full-width Teal Highlight Section */}
                                        <div className="header-gradient text-white text-sm font-medium px-3 py-2 w-full">
                                            <div className="text-center">
                                                {event.musicGenres?.[0] || 'Music Event'}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>                {/* All Events Section */}
                <div className="mt-8">
                    <h2 className="text-white font-semibold text-lg mb-4">All Events</h2>
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide" style={{ width: 'max-content' }}>
                        {events.map((event, index) => (
                            <div key={`all-${event.id}`} className="flex-shrink-0 w-[222px]">
                                <Link href={`/event/${event.title.toLowerCase().replace(/\s+/g, '-')}`}>
                                    <div className="bg-teal-900/20 rounded-[20px] overflow-hidden relative"
                                        style={{
                                            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)'
                                        }}>
                                        {/* Image Section */}
                                        <div className="relative">
                                            <img
                                                src={event.coverImage || event.images?.[0] || getEventFallbackImage(index)}
                                                alt={event.title}
                                                className="w-full h-[200px] object-cover border-2 border-teal-400/30 rounded-t-[20px]"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = getEventFallbackImage(index);
                                                }}
                                            />
                                            {/* Date Badge */}
                                            <div className="absolute top-3 right-3 bg-gradient-to-b from-teal-600 to-teal-700 text-white text-xs font-bold px-2 py-1 rounded-lg min-w-[45px]">
                                                <div className="text-center">
                                                    <div className="text-[10px] opacity-70">{formatEventDate(event.startDateTime).month}</div>
                                                    <div className="text-sm font-bold">{formatEventDate(event.startDateTime).day}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="text-white font-bold text-base leading-tight mb-1">{event.title}</h3>
                                                    <p className="text-white/70 text-sm">{event.club?.name || 'Venue TBD'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Full-width Teal Highlight Section */}
                                        <div className="header-gradient text-white text-sm font-medium px-3 py-2 w-full">
                                            <div className="text-center">
                                                {event.musicGenres?.[0] || 'Music Event'}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}