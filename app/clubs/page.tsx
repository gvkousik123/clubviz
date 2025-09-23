'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Star } from 'lucide-react';
import { useDragScroll } from '@/hooks/use-drag-scroll';

export default function ClubsListPage() {
    const router = useRouter();
    const [favorites, setFavorites] = useState<number[]>([1, 3]);

    const handleGoBack = () => {
        router.back();
    };

    const toggleFavorite = (clubId: number) => {
        setFavorites(prev =>
            prev.includes(clubId)
                ? prev.filter(id => id !== clubId)
                : [...prev, clubId]
        );
    };

    const clubs = [
        {
            id: 1,
            name: 'DABO',
            address: '6, New Manish Nagar, Somalwada',
            hours: 'Open until 1:30 am',
            rating: 4.2,
            image: '/crowded-nightclub-with-red-lighting-and-people-dan.jpg',
            currentEvent: 'Timeless Tuesdays Ft. DJ Xpensive',
            eventColor: 'from-teal-600 to-teal-500'
        },
        {
            id: 2,
            name: 'LORD OF THE DRINKS',
            address: 'Ground floor, Poonam mall VIP road',
            hours: 'Open until 1:30 am',
            rating: 4.2,
            image: '/upscale-bar-interior-with-bottles.jpg',
            currentEvent: 'Typical Tuesdays Ft. DJ Xeroo',
            offer: 'Buy 1 get 1 on IFML Drinks',
            eventColor: 'from-teal-600 to-teal-500'
        },
        {
            id: 3,
            name: 'CLUB RAASTA',
            address: 'Civil Lines, Near High Court',
            hours: 'Open until 2:00 am',
            rating: 4.2,
            image: '/purple-neon-club-interior.jpg',
            currentEvent: 'Saturday Night Fever',
            eventColor: 'from-purple-600 to-pink-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a2f32] to-[#0a1518] text-white">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-b-[30px] pb-8">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 pt-4 pb-2">
                    <div className="text-white text-sm font-semibold">9:41</div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-2 bg-white/60 rounded-sm"></div>
                        <div className="w-4 h-2 bg-white/60 rounded-sm"></div>
                        <div className="w-4 h-2 bg-white/60 rounded-sm"></div>
                        <div className="w-6 h-3 bg-white border border-white/60 rounded-sm"></div>
                    </div>
                </div>

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
                    <Link href="/filter">
                        <button className="p-2 hover:bg-white/10 rounded-full transition-all duration-300">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                            </svg>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6 space-y-6">
                {clubs.map((club) => (
                    <Link key={club.id} href={`/club/${club.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        <div className="relative rounded-2xl overflow-hidden bg-[#1a2f32] border border-teal-600/30">
                            {/* Club Image */}
                            <div className="relative h-48">
                                <img
                                    src={club.image}
                                    alt={club.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                {/* Bookmark Icon */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toggleFavorite(club.id);
                                    }}
                                    className="absolute top-4 right-4 p-2 bg-black/40 rounded-full hover:bg-black/60 transition-all duration-300"
                                >
                                    <Bookmark
                                        size={20}
                                        className={`${favorites.includes(club.id)
                                                ? 'text-teal-400 fill-teal-400'
                                                : 'text-white'
                                            }`}
                                    />
                                </button>

                                {/* Rating Badge */}
                                <div className="absolute bottom-4 right-4 bg-teal-600 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                    {club.rating}
                                </div>

                                {/* Club Info Overlay */}
                                <div className="absolute bottom-4 left-4">
                                    <h3 className="text-white font-bold text-xl mb-1">{club.name}</h3>
                                    <p className="text-white/80 text-sm mb-1">{club.address}</p>
                                    <p className="text-white/70 text-xs">{club.hours}</p>
                                </div>
                            </div>

                            {/* Current Event Section */}
                            <div className={`bg-gradient-to-r ${club.eventColor} px-4 py-3`}>
                                <p className="text-white font-medium text-sm">{club.currentEvent}</p>
                            </div>

                            {/* Offer Section (if exists) */}
                            {club.offer && (
                                <div className="bg-gradient-to-r from-green-600/80 to-teal-600/80 px-4 py-2 flex items-center gap-2">
                                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">%</span>
                                    </div>
                                    <p className="text-white font-medium text-sm">{club.offer}</p>
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}