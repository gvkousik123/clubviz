'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bookmark } from 'lucide-react';

export default function FavoriteClubsPage() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    const handleBookmark = (clubId: number) => {
        console.log('Toggle bookmark for club:', clubId);
    };

    const handleOpenNow = (clubId: number) => {
        console.log('Open club details:', clubId);
    };

    // Mock favorite clubs data matching the design
    const favoriteClubs = [
        {
            id: 1,
            name: 'DABO',
            address: '6, New Manish Nagar, Somalwada',
            openTime: 'Open until 1:30 am',
            rating: 4.2,
            image: '/crowded-nightclub-with-red-lighting-and-people-dan.jpg',
            currentEvent: 'Timeless Tuesdays Ft. DJ Xpensive',
        },
        {
            id: 2,
            name: 'LORD OF THE DRINKS',
            address: 'Ground floor, Poonam mall VIP road',
            openTime: 'Open until 1:30 am',
            rating: 4.2,
            image: '/upscale-bar-interior-with-bottles.jpg',
            currentEvent: 'Typical Tuesdays Ft. DJ Xeroo',
            offer: 'Buy 1 get 1 on IFML Drinks',
        },
        {
            id: 3,
            name: 'SAGA ROOFTOP',
            address: 'Rooftop, Central Avenue',
            openTime: 'Open until 2:00 am',
            rating: 4.2,
            image: '/upscale-club-interior-with-blue-lighting.jpg',
            currentEvent: 'Midnight Magic Ft. DJ Zara',
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
                        FAVOURITE CLUBS
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-8 space-y-6">
                {favoriteClubs.length > 0 ? (
                    <div className="space-y-6">
                        {favoriteClubs.map((club) => (
                            <div key={club.id} className="relative rounded-[25px] overflow-hidden border border-teal-400/30">
                                {/* Club Image */}
                                <div className="relative h-48">
                                    <img
                                        src={club.image}
                                        alt={club.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                                    {/* Bookmark Button */}
                                    <button
                                        onClick={() => handleBookmark(club.id)}
                                        className="absolute top-4 right-4 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 transition-all duration-300"
                                    >
                                        <Bookmark size={16} className="text-teal-400 fill-teal-400" />
                                    </button>

                                    {/* Rating Badge */}
                                    <div className="absolute bottom-4 right-4 bg-cyan-600 text-white text-sm font-bold px-2 py-1 rounded">
                                        {club.rating}
                                    </div>
                                </div>

                                {/* Club Details */}
                                <div className="bg-[#222831] p-4 space-y-3">
                                    {/* Club Name and Address */}
                                    <div>
                                        <h3 className="text-white font-bold text-xl mb-1">{club.name}</h3>
                                        <p className="text-white/70 text-sm">{club.address}</p>
                                        <p className="text-white/70 text-sm">{club.openTime}</p>
                                    </div>

                                    {/* Current Event */}
                                    <div className="bg-[#0d7377] rounded-lg p-3">
                                        <p className="text-white font-medium text-sm">{club.currentEvent}</p>
                                    </div>

                                    {/* Special Offer (if available) */}
                                    {club.offer && (
                                        <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-lg p-3">
                                            <p className="text-white font-medium text-sm">{club.offer}</p>
                                        </div>
                                    )}

                                    {/* Open Now Button */}
                                    <button
                                        onClick={() => handleOpenNow(club.id)}
                                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-between px-4"
                                    >
                                        <span>Open Now</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Bookmark className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-white/70 text-lg">No favorite clubs yet</p>
                        <p className="text-white/50 text-sm mt-2">Add clubs to your favorites to see them here</p>
                    </div>
                )}
            </div>
        </div>
    );
}