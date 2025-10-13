'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bookmark, Share2 } from 'lucide-react';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import { EventService } from '@/lib/services/event.service';
import { Event } from '@/lib/api-types';
import { toast } from '@/hooks/use-toast';

export default function FavoriteEventsPage() {
    const router = useRouter();
    const dragScrollRef = useDragScroll();
    const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch favorite events on component mount
    useEffect(() => {
        const fetchFavoriteEvents = async () => {
            setLoading(true);
            try {
                const response = await EventService.getFavoriteEvents();

                if (response.success && response.data) {
                    setFavoriteEvents(response.data);
                } else {
                    throw new Error(response.message || 'Failed to fetch favorite events');
                }
            } catch (error) {
                console.error('Error fetching favorite events:', error);
                toast({
                    title: "Error",
                    description: "Failed to load favorite events. Please try again.",
                    variant: "destructive",
                });
                setFavoriteEvents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteEvents();
    }, []);

    const handleGoBack = () => {
        router.back();
    };

    const handleBookmark = async (eventId: string) => {
        try {
            await EventService.removeFromFavorites(eventId);
            // Remove from local state
            setFavoriteEvents(prev => prev.filter(event => event.id !== eventId));
            toast({
                title: "Success",
                description: "Event removed from favorites.",
            });
        } catch (error) {
            console.error('Error removing favorite:', error);
            toast({
                title: "Error",
                description: "Failed to remove from favorites. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleShare = (eventId: string) => {
        // Handle share functionality
        if (navigator.share) {
            navigator.share({
                title: 'Check out this event!',
                url: `${window.location.origin}/event/${eventId}`
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(`${window.location.origin}/event/${eventId}`);
            toast({
                title: "Link copied!",
                description: "Event link copied to clipboard.",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0d7377] to-[#222831] text-white">
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
                        FAVOURITE EVENTS
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-6 space-y-8">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
                        <span className="ml-3 text-white">Loading your favorite events...</span>
                    </div>
                ) : favoriteEvents.length > 0 ? (
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-4 pb-2" style={{ width: 'max-content' }}>
                            {favoriteEvents.map((event) => (
                                <div key={event.id} className="flex-shrink-0 w-[222px]">
                                    <Link href={`/event/${event.title.toLowerCase().replace(/\s+/g, '-')}`}>
                                        <div className="bg-teal-900/20 rounded-[20px] overflow-hidden relative"
                                            style={{
                                                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)'
                                            }}>
                                            {/* Image Section */}
                                            <div className="relative">
                                                <img
                                                    src={event.images?.[0] || '/gallery/Frame 1000001124.jpg'}
                                                    alt={event.title}
                                                    className="w-full h-[200px] object-cover border-2 border-teal-400/30 rounded-t-[20px]"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/gallery/Frame 1000001124.jpg';
                                                    }}
                                                />
                                                {/* Date Badge */}
                                                <div className="absolute top-3 right-3 bg-gradient-to-b from-teal-600 to-teal-700 text-white text-xs font-bold px-2 py-1 rounded-lg min-w-[45px]">
                                                    <div className="text-center">
                                                        <div className="text-[10px] opacity-70">APR</div>
                                                        <div className="text-sm font-bold">04</div>
                                                    </div>
                                                </div>

                                                {/* Favorite Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleBookmark(event.id);
                                                    }}
                                                    className="absolute top-3 left-3 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 transition-all duration-300"
                                                >
                                                    <Bookmark size={16} className="text-teal-400 fill-teal-400" />
                                                </button>
                                            </div>

                                            {/* Content Section */}
                                            <div className="p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <h3 className="text-white font-bold text-base leading-tight mb-1">{event.title}</h3>
                                                        <p className="text-white/70 text-sm">{event.club?.name || 'Venue TBA'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Full-width Teal Highlight Section */}
                                            <div className="header-gradient text-white text-sm font-medium px-3 py-2 w-full">
                                                <div className="text-center">
                                                    {event.musicGenres?.join(', ') || 'Various Genres'}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-white text-xl font-semibold mb-2">No Favorite Events</h3>
                        <p className="text-gray-400">You haven't added any events to your favorites yet.</p>
                        <Link href="/events" className="inline-block mt-4 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                            Explore Events
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}