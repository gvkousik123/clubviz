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
        <div className="min-h-screen bg-[#0a2e30] text-white">
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
            <div className="px-4 py-6 space-y-8">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-4 pb-16" style={{ width: 'max-content' }}>
                        {clubs.map((club) => (
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
                                            <p className="text-white/90 text-sm">{club.hours}</p>
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
                                                toggleFavorite(club.id);
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
            </div>
        </div>
    );
}