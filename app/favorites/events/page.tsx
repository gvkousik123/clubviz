'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart } from 'lucide-react';

export default function FavoriteEventsPage() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    // Mock favorite events data
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
            title: 'Wow Wednesday with DJ Shade',
            venue: 'DABO, Airport Road',
            date: 'APR 06',
            category: 'Bollywood & Bollytech',
            image: '/night-party-event-poster-with-purple-and-pink-neon.jpg',
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
                    <div className="grid gap-4">
                        {favoriteEvents.map((event) => (
                            <div key={event.id} className="w-full max-w-[222px] mx-auto">
                                <div className="bg-[#003c3d] rounded-t-[20px] rounded-b-[20px] overflow-hidden border border-[#0ed7e2]/30">
                                    <div className="relative">
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-[180px] object-cover"
                                        />
                                        <div className="absolute top-0 right-0 bg-gradient-to-b from-black to-[#00c0ca] text-white text-xs font-bold px-2 py-3 rounded-bl-[28px] min-h-[45px] flex items-center">
                                            {event.date}
                                        </div>
                                        <button className="absolute top-4 right-4 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center">
                                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                                        </button>
                                    </div>
                                    <div className="p-4 space-y-2">
                                        <h3 className="text-white font-bold text-sm leading-tight">{event.title}</h3>
                                        <p className="text-white/70 text-xs">{event.venue}</p>
                                    </div>
                                    <div className="px-4 pb-4">
                                        <div className="bg-[#0d7377] text-white text-xs font-medium px-3 py-2 rounded-full text-center">
                                            {event.category}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-white/70 text-lg">No favorite events yet</p>
                        <p className="text-white/50 text-sm mt-2">Add events to your favorites to see them here</p>
                    </div>
                )}
            </div>
        </div>
    );
}