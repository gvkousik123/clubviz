'use client';

import React from 'react';
import Link from 'next/link';
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
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-b-[30px] pb-8 pt-4">
                <div className="flex items-center justify-between px-6 pt-4 mb-6">
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
            <div className="px-4 py-6 space-y-8">
                {favoriteClubs.length > 0 ? (
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-4 pb-16" style={{ width: 'max-content' }}>
                            {favoriteClubs.map((club) => (
                                <Link key={club.id} href={`/club/${club.name.toLowerCase().replace(/\s+/g, '-')}`}>
                                    <div className="flex-shrink-0 w-[336px] relative cursor-pointer transform transition-all duration-300 hover:scale-105">
                                        <div className="relative h-[197px] rounded-[20px] border border-[#0c898b] bg-[#1a2f32]">
                                            <div className="rounded-[20px] overflow-hidden h-full">
                                                <img
                                                    src={club.image}
                                                    alt={club.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                            </div>

                                            {/* Glass effect card that extends beyond main card */}
                                            <div className="absolute -bottom-8 left-2 right-2 glassmorphism-strong border border-white/20 p-5 rounded-2xl h-20 z-10">
                                                <h3 className="text-white font-bold text-xl mb-2">{club.name}</h3>
                                                <p className="text-white/90 text-sm">{club.openTime}</p>
                                            </div>

                                            <div className="absolute bottom-4 right-4 z-20">
                                                <div className="glassmorphism text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                                                    {club.rating}
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleBookmark(club.id);
                                                }}
                                                className="absolute top-4 right-4 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 transition-all duration-300 z-20"
                                            >
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
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