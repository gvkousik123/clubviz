'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, Loader2 } from 'lucide-react';
import PageHeader from '@/components/common/page-header';
import { toast } from '@/hooks/use-toast';
import { EventService } from '@/lib/services/event.service';
import { EventsListSkeleton } from '@/components/ui/skeleton-loaders';
import { EventCard } from '@/components/events/event-card';

export default function FavoriteEventsPage() {
    const router = useRouter();
    const [favoriteEvents, setFavoriteEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const eventImages = [
        '/venue/Screenshot 2024-12-10 195651.png',
        '/venue/Screenshot 2024-12-10 195852.png',
        '/venue/Screenshot 2024-12-10 200154.png'
    ];

    const getEventFallbackImage = (index: number) => {
        return eventImages[index % eventImages.length];
    };

    const formatEventDate = (dateStr: string) => {
        if (!dateStr) return '';
        try {
            const d = new Date(dateStr);
            const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
            const day = d.getDate().toString().padStart(2, '0');
            return `${month} ${day}`;
        } catch {
            return '';
        }
    };

    const loadFavoriteEvents = async () => {
        setLoading(true);
        try {
            const response: any = await EventService.getFavoriteEvents({ page: 0, size: 50 });
            // Handle different response formats
            const events = response?.events || response?.content || response?.data?.events || response?.data?.content || [];
            setFavoriteEvents(events);
        } catch (error: any) {
            console.error('Error loading favorite events:', error);
            setFavoriteEvents([]);
            if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
                toast({
                    title: 'Login Required',
                    description: 'Please login to see your favorite events.',
                    variant: 'destructive',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFavoriteEvents();
    }, []);

    const handleShare = (eventId: string) => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this event!',
                url: `${window.location.origin}/event/${eventId}`
            });
        } else {
            navigator.clipboard.writeText(`${window.location.origin}/event/${eventId}`);
            toast({
                title: "Link copied!",
                description: "Event link copied to clipboard.",
            });
        }
    };

    const handleRemoveFavorite = async (eventId: string) => {
        try {
            await EventService.removeFromFavorites(eventId);
            setFavoriteEvents(prev => prev.filter(e => e.id !== eventId));
            toast({
                title: "Removed from favorites",
                description: "Event removed from your favorites.",
            });
        } catch (error: any) {
            console.error('Error removing favorite:', error);
            toast({
                title: 'Error',
                description: 'Failed to remove from favorites.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#031414] overflow-hidden">
            <PageHeader title="FAVOURITE EVENTS" />

            {/* Event Cards */}
            <div className="px-8 space-y-10 pt-[20vh]">
                {loading ? (
                    <EventsListSkeleton count={4} />
                ) : favoriteEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Bookmark className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-white text-lg font-semibold mb-2">No Favorite Events</h3>
                        <p className="text-gray-400 text-sm">Start adding events to your favorites to see them here.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 pb-10">
                        {favoriteEvents.map((event, index) => {
                            const formattedDate = {
                                day: event.startDateTime ? new Date(event.startDateTime).getDate().toString().padStart(2, '0') : '00',
                                month: event.startDateTime ? new Date(event.startDateTime).toLocaleString('en-US', { month: 'short' }).toUpperCase() : 'JAN'
                            };
                            return (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    href={`/event/${event.id}`}
                                    fallbackImage={getEventFallbackImage(index)}
                                    formattedDate={formattedDate}
                                    isFavorite={true}
                                    onToggleFavorite={handleRemoveFavorite}
                                    className="w-full"
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}