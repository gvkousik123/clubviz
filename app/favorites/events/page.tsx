'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bookmark, Share2 } from 'lucide-react';
import { useDragScroll } from '@/hooks/use-drag-scroll';

export default function FavoriteEventsPage() {
    const router = useRouter();
    const dragScrollRef = useDragScroll();

    const handleGoBack = () => {
        router.back();
    };

    const handleBookmark = (eventId: number) => {
        // Handle bookmark toggle
        console.log('Toggle bookmark for event:', eventId);
    };

    const handleShare = (eventId: number) => {
        // Handle share functionality
        console.log('Share event:', eventId);
    };

    // Mock favorite events data with horizontal layout
    const favoriteEvents = [
        {
            id: 1,
            title: 'Freaky Friday with DJ Alexxx',
            venue: 'DABO, Airport Road',
            date: 'APR 04',
            category: 'Techno & Bollytech',
            image: '/dj-event-poster-with-woman-dj-and-neon-lighting.jpg',
        },
        {
            id: 2,
            title: 'Freaky Friday with DJ Alexxx',
            venue: 'DABO, Airport Road',
            date: 'APR 04',
            category: 'Techno & Bollytech',
            image: '/night-party-event-poster-with-purple-and-pink-neon.jpg',
        },
        {
            id: 3,
            title: 'Freaky Friday with DJ Alexxx',
            venue: 'DABO, Airport Road',
            date: 'APR 04',
            category: 'Techno & Bollytech',
            image: '/dj-woman-with-headphones-and-sunglasses-in-neon-li.jpg',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0d7377] to-[#222831] text-white">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-b-[30px] pb-8">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 pt-4 pb-2">
                    <div className="text-white text-sm font-semibold">9:41</div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-3 bg-white/60 rounded-sm"></div>
                        <div className="w-4 h-3 bg-white/60 rounded-sm"></div>
                        <div className="w-6 h-3 bg-white border border-white/60 rounded-sm"></div>
                    </div>
                </div>

                <div className="flex items-center justify-between px-6 pt-4">
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
            <div className="px-6 py-8 space-y-6">
                {favoriteEvents.length > 0 ? (
                    <div className="space-y-4">
                        {favoriteEvents.map((event) => (
                            <div key={event.id} className="flex bg-[#222831] rounded-[25px] overflow-hidden border border-teal-400/30">
                                {/* Event Date Badge */}
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-24 h-24 object-cover"
                                    />
                                    <div className="absolute top-2 left-2 bg-gray-800/80 text-white text-xs font-bold px-2 py-1 rounded">
                                        <div className="text-center">
                                            <div className="text-xs opacity-70">APR</div>
                                            <div className="text-sm">04</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Event Details */}
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-white font-bold text-sm leading-tight mb-1">
                                            {event.title}
                                        </h3>
                                        <p className="text-white/70 text-xs mb-2">{event.venue}</p>
                                    </div>
                                    <div className="bg-[#0d7377] text-white text-xs font-medium px-3 py-1 rounded-full text-center w-fit">
                                        {event.category}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col justify-center items-center px-4 space-y-3">
                                    <button
                                        onClick={() => handleBookmark(event.id)}
                                        className="w-8 h-8 bg-teal-600/20 border border-teal-400/40 rounded-full flex items-center justify-center hover:bg-teal-600/30 transition-all duration-300"
                                    >
                                        <Bookmark size={16} className="text-teal-400 fill-teal-400" />
                                    </button>
                                    <button
                                        onClick={() => handleShare(event.id)}
                                        className="w-8 h-8 bg-teal-600/20 border border-teal-400/40 rounded-full flex items-center justify-center hover:bg-teal-600/30 transition-all duration-300"
                                    >
                                        <Share2 size={16} className="text-teal-400" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Bookmark className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-white/70 text-lg">No favorite events yet</p>
                        <p className="text-white/50 text-sm mt-2">Add events to your favorites to see them here</p>
                    </div>
                )}
            </div>
        </div>
    );
}