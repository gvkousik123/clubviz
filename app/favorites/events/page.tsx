'use client';

import React from 'react';
import Link from 'next/link';
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
            <div className="px-4 py-6 space-y-8">
                {favoriteEvents.length > 0 ? (
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
                                                    src={event.image}
                                                    alt={event.title}
                                                    className="w-full h-[200px] object-cover border-2 border-teal-400/30 rounded-t-[20px]"
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
                                                        <p className="text-white/70 text-sm">{event.venue}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Full-width Teal Highlight Section */}
                                            <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white text-sm font-medium px-3 py-2 w-full">
                                                <div className="text-center">
                                                    {event.category}
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
                        <Bookmark className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-white/70 text-lg">No favorite events yet</p>
                        <p className="text-white/50 text-sm mt-2">Add events to your favorites to see them here</p>
                    </div>
                )}
            </div>
        </div>
    );
}