'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Calendar, MapPin, Users } from 'lucide-react';
import { useDragScroll } from '@/hooks/use-drag-scroll';

export default function EventsListPage() {
    const router = useRouter();
    const [favorites, setFavorites] = useState<number[]>([1, 3]);

    const handleGoBack = () => {
        router.back();
    };

    const toggleFavorite = (eventId: number) => {
        setFavorites(prev =>
            prev.includes(eventId)
                ? prev.filter(id => id !== eventId)
                : [...prev, eventId]
        );
    };

    const events = [
        {
            id: 1,
            title: 'Freaky Friday with DJ Alexxx',
            venue: 'DABO, Airport Road',
            date: 'APR 04',
            category: 'Techno & Bollytech',
            image: '/dj-event-poster-with-woman-dj-and-neon-lighting.jpg',
            time: '10:00 PM - 3:00 AM',
            attendees: '500+',
            price: '₹1,200'
        },
        {
            id: 2,
            title: 'Saturday Night Fever',
            venue: 'CLUB RAASTA, Civil Lines',
            date: 'APR 06',
            category: 'House & Progressive',
            image: '/night-party-event-poster-with-purple-and-pink-neon.jpg',
            time: '9:00 PM - 2:00 AM',
            attendees: '300+',
            price: '₹800'
        },
        {
            id: 3,
            title: 'Boiler Room ft Kratex',
            venue: 'DABO, Airport Road',
            date: 'APR 08',
            category: 'Electronic & Progressive House',
            image: '/dj-woman-with-headphones-and-sunglasses-in-neon-li.jpg',
            time: '10:00 PM - 3:00 AM',
            attendees: '600+',
            price: '₹1,500'
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
                        ALL EVENTS
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
                {events.map((event) => (
                    <Link key={event.id} href={`/event/${event.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        <div className="relative rounded-2xl overflow-hidden bg-[#1a2f32] border border-teal-600/30">
                            {/* Event Image */}
                            <div className="relative h-48">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                {/* Date Badge */}
                                <div className="absolute top-4 left-4 bg-gradient-to-b from-teal-600 to-teal-700 text-white text-xs font-bold px-3 py-2 rounded-lg">
                                    <div className="text-center">
                                        <div className="text-xs opacity-70">APR</div>
                                        <div className="text-lg">{event.date.split(' ')[1]}</div>
                                    </div>
                                </div>

                                {/* Bookmark Icon */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toggleFavorite(event.id);
                                    }}
                                    className="absolute top-4 right-4 p-2 bg-black/40 rounded-full hover:bg-black/60 transition-all duration-300"
                                >
                                    <Bookmark
                                        size={20}
                                        className={`${favorites.includes(event.id)
                                                ? 'text-teal-400 fill-teal-400'
                                                : 'text-white'
                                            }`}
                                    />
                                </button>

                                {/* Event Info Overlay */}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-white font-bold text-lg mb-2">{event.title}</h3>
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin size={14} className="text-teal-400" />
                                        <p className="text-white/80 text-sm">{event.venue}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} className="text-teal-400" />
                                                <span className="text-white/70 text-xs">{event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users size={14} className="text-teal-400" />
                                                <span className="text-white/70 text-xs">{event.attendees}</span>
                                            </div>
                                        </div>
                                        <div className="text-teal-400 font-bold text-sm">{event.price}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Category Section */}
                            <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-3">
                                <p className="text-white font-medium text-sm">{event.category}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}