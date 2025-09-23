'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart } from 'lucide-react';

export default function FavoriteClubsPage() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    // Mock favorite clubs data
    const favoriteClubs = [
        {
            id: 1,
            name: 'DABO',
            openTime: 'Open until 1:30 am',
            rating: 4.2,
            image: '/crowded-nightclub-with-red-lighting-and-people-dan.jpg',
        },
        {
            id: 2,
            name: 'GARAGE',
            openTime: 'Open until 2:00 am',
            rating: 4.5,
            image: '/purple-neon-club-interior.jpg',
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
                    <div className="space-y-4">
                        {favoriteClubs.map((club) => (
                            <div key={club.id} className="w-full max-w-[336px] mx-auto">
                                <div className="relative h-[197px] rounded-t-[30px] rounded-b-[30px] border border-[#0c898b] overflow-hidden">
                                    <img
                                        src={club.image}
                                        alt={club.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <h3 className="text-white font-bold text-2xl">{club.name}</h3>
                                        <p className="text-white/80 text-sm">{club.openTime}</p>
                                    </div>
                                    <div className="absolute bottom-4 right-4">
                                        <div className="bg-cyan-600 text-white text-sm font-bold px-2 py-1 rounded">
                                            {club.rating}
                                        </div>
                                    </div>
                                    <button className="absolute top-4 right-4 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center">
                                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-white/70 text-lg">No favorite clubs yet</p>
                        <p className="text-white/50 text-sm mt-2">Add clubs to your favorites to see them here</p>
                    </div>
                )}
            </div>
        </div>
    );
}