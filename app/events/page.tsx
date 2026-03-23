'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, User, SlidersHorizontal, MapPin, Heart, Loader2, X } from 'lucide-react';
import { EventService } from '@/lib/services/event.service';
import type { EventListItem } from '@/lib/services/event.service';
import { useToast } from '@/hooks/use-toast';
import { EventsListSkeleton } from '@/components/ui/skeleton-loaders';
import { PublicEventService } from '@/lib/services/public.service';
import { SearchService, NearbySearchParamsV2, SearchEventV2 } from '@/lib/services/search.service';
import { LocationPickerModal } from '@/components/common/location-picker-modal';
import { STORAGE_KEYS } from '@/lib/constants/storage';
import { getStoredLocation } from '@/lib/location';
import { getEventImageUrl, getEventLocation } from '@/lib/utils';
import { filterFutureEvents } from '@/lib/date-utils';

export default function EventsListPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [events, setEvents] = useState<EventListItem[]>([]);
    const [allEvents, setAllEvents] = useState<EventListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [searchingNearby, setSearchingNearby] = useState(false);
    const [currentSearchLocation, setCurrentSearchLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
    const fetchEvents = async () => {
        setLoading(true);

        try {
            // Fetch only UPCOMING events (no past events)
            const upcomingResponse = await PublicEventService.getPublicEvents({
                page: 0,
                size: 50,
                sortBy: 'startDateTime',
                sortOrder: 'asc',
                status: 'UPCOMING'
            });

            // Map only upcoming events
            const upcomingEvents: EventListItem[] = [];
            
            if (upcomingResponse && upcomingResponse.content) {
                upcomingEvents.push(...upcomingResponse.content.map((event) => ({
                    ...event,
                    imageUrl: event.imageUrl || '/event list/Rectangle 1.jpg',
                    clubId: event.clubId || '',
                    clubName: event.clubName || '',
                    clubLogo: event.clubLogo || '',
                    organizerName: event.organizerName || ''
                })));
            }

            // Filter out past events based on IST timezone
            const futureEvents = filterFutureEvents(upcomingEvents);

            setAllEvents(futureEvents);
            setEvents(futureEvents);
        } catch (err) {
            console.error('💥 Failed to load events', err);
            toast({
                title: "Error loading events",
                description: "Could not fetch latest events.",
                variant: "destructive"
            });
            setEvents([]);
            setAllEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const loadFavorites = async () => {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.accessToken);
            if (!token) return;
            const response = await EventService.getFavoriteEvents({ page: 0, size: 100 });
            const favEvents = response?.content || response?.events || [];
            const ids = favEvents.map((e: any) => e.id || e.eventId).filter(Boolean);
            setFavorites(ids);
        } catch (error) {
            console.error('Error loading favorites:', error);
            // fallback to localStorage
            try {
                const saved = localStorage.getItem('favoriteEvents');
                if (saved) setFavorites(JSON.parse(saved));
            } catch (_) {}
        }
    };

    const toggleFavorite = async (eventId: string) => {
        try {
            const token = localStorage.getItem(STORAGE_KEYS.accessToken);
            if (!token) {
                toast({ title: 'Login required', description: 'Please sign in to favorite events', variant: 'destructive' });
                return;
            }

            const isFav = favorites.includes(eventId);
            if (isFav) {
                await EventService.removeFromFavorites(eventId);
                setFavorites(prev => prev.filter(id => id !== eventId));
                toast({ title: 'Removed from favorites', description: 'Event removed from your favorites' });
            } else {
                await EventService.addToFavorites(eventId);
                setFavorites(prev => [...prev, eventId]);
                toast({ title: 'Added to favorites', description: 'Event added to your favorites' });
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast({ title: 'Error', description: 'Failed to update favorites', variant: 'destructive' });
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    const handleSearch = async () => {
        // Check if we have user coordinates (from stored location or browser)
        const storedLocation = getStoredLocation();
        
        if (!storedLocation || !storedLocation.lat || !storedLocation.lng) {
            // No location available - show location picker
            setShowLocationPicker(true);
            return;
        }

        // We have coordinates - perform nearby search
        await performNearbySearch(storedLocation);
    };

    const performNearbySearch = async (location: { lat: number; lng: number; label?: string }) => {
        setSearchingNearby(true);
        try {
            const nearbyParams: NearbySearchParamsV2 = {
                lat: location.lat,
                lng: location.lng,
                page: 0,
                size: 50,
            };

            const response = await SearchService.nearbySearch(nearbyParams);
            
            if (response && response.events && response.events.length > 0) {
                const mappedEvents: EventListItem[] = response.events.map((event: SearchEventV2) => ({
                    id: event.id,
                    title: event.title || 'Event',
                    startDateTime: event.startDateTime,
                    location: getEventLocation(event),
                    imageUrl: getEventImageUrl(event, '/event list/Rectangle 1.jpg'),
                    clubId: event.id,
                    clubName: '',
                    clubLogo: '',
                    organizerName: event.eventOrganizer || ''
                }));
                
                // Filter out past events based on IST timezone
                const futureEvents = filterFutureEvents(mappedEvents);
                
                setEvents(futureEvents);
                setCurrentSearchLocation({
                    lat: location.lat,
                    lng: location.lng,
                    name: location.label || 'Selected Location'
                });
                
                toast({
                    title: 'Search complete',
                    description: `Found ${futureEvents.length} events nearby`,
                });
            } else {
                setEvents([]);
                toast({
                    title: 'No events found',
                    description: 'No events found in this area. Try expanding your search radius.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('💥 Error performing nearby search:', error);
            toast({
                title: 'Search failed',
                description: 'Could not search nearby events. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setSearchingNearby(false);
        }
    };

    const handleLocationSelected = async (coords: { lat: number; lng: number }, locationName: string) => {
        setShowLocationPicker(false);
        setCurrentSearchLocation({
            lat: coords.lat,
            lng: coords.lng,
            name: locationName
        });
        await performNearbySearch(coords);
    };

    const handleEventClick = (eventId: string) => {
        router.push(`/event/${eventId}`);
    };

    useEffect(() => {
        fetchEvents();
        loadFavorites();
    }, []);

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

    // Filter events by date range
    const getEventsForDateRange = () => {
        if (!startDate && !endDate) return [];

        return events.filter(event => {
            const eventDate = new Date(event.startDateTime);
            eventDate.setHours(0, 0, 0, 0);

            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            if (start) start.setHours(0, 0, 0, 0);
            if (end) end.setHours(23, 59, 59, 999);

            if (start && end) {
                return eventDate >= start && eventDate <= end;
            } else if (start) {
                return eventDate >= start;
            } else if (end) {
                return eventDate <= end;
            }
            return false;
        });
    };

    const rangeFilteredEvents = getEventsForDateRange();
    const hasDateSelection = startDate !== null || endDate !== null;

    return (
        <div className="min-h-screen bg-[#031313] text-white">
            <LocationPickerModal
                isOpen={showLocationPicker}
                onClose={() => setShowLocationPicker(false)}
                onSelectLocation={handleLocationSelected}
            />
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
                                disabled={loading || searchingNearby || !searchQuery.trim()}
                                className="disabled:opacity-50 flex-shrink-0"
                                title="Search nearby events"
                            >
                                {loading || searchingNearby ? (
                                    <Loader2 className="w-[21px] h-[21px] text-white animate-spin" />
                                ) : (
                                    <MapPin className="w-[21px] h-[21px] text-[#14FFEC]" />
                                )}
                            </button>
                            <input
                                type="text"
                                placeholder="Search nearby events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                                className="flex-1 bg-transparent text-white text-base font-bold tracking-[0.5px] placeholder-white outline-none min-w-0"
                                disabled={loading || searchingNearby}
                            />
                        </div>
                        <button className="w-10 h-10 bg-white/20 rounded-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center flex-shrink-0">
                            <SlidersHorizontal className="w-[21px] h-[21px] text-white" />
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <div className="w-full space-y-6 pt-[18vh] pb-8">
                    {/* Current Search Location Display */}
                    {currentSearchLocation && (
                        <section className="w-full px-5">
                            <div className="bg-[#14FFEC]/10 border border-[#14FFEC] rounded-xl p-3 flex items-center gap-3">
                                <MapPin size={18} className="text-[#14FFEC] flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[#14FFEC] text-sm font-semibold">
                                        Searching from: {currentSearchLocation.name}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setCurrentSearchLocation(null)}
                                    className="text-[#14FFEC] hover:text-white transition-colors flex-shrink-0"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </section>
                    )}

                    {/* Calendar Date Range Picker - REMOVED per BUG-U02 */}

                    {/* Event Filter Tabs - REMOVED: Only showing upcoming events */}

                    {/* Calendar Date Range Picker - REMOVED per BUG-U02 */}

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
                                events.map((event, index) => {
                                    const eventDate = new Date(event.startDateTime);
                                    const dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
                                    const timeStr = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

                                    return (
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
                                                            {dateStr} • {timeStr}
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
                                    );
                                })
                            )}
                        </div>
                    </section>

                    {/* Filtered Events Section */}
                    {hasDateSelection && rangeFilteredEvents.length > 0 && (
                        <section className="w-full px-5 border-t border-[#14FFEC]/20 pt-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-white text-base font-semibold">
                                    Events in Selected Range
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {rangeFilteredEvents.map((event, index) => {
                                    const eventDate = new Date(event.startDateTime);
                                    const dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
                                    const timeStr = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

                                    return (
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
                                                            {dateStr} • {timeStr}
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
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
