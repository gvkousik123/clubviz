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
        <div className="min-h-screen bg-[#1e2328] text-white">
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

            {/* Filter Section */}
            <div className="px-6 py-4">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                    <button className="flex items-center gap-2 bg-[#2d343a] border border-cyan-400 text-cyan-400 px-4 py-2 rounded-full whitespace-nowrap hover:bg-cyan-400/10 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                        </svg>
                        Filter
                    </button>
                    <button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2 rounded-full whitespace-nowrap hover:brightness-110 transition-all">
                        Events Today
                    </button>
                    <button className="bg-[#2d343a] border border-white/20 text-white px-6 py-2 rounded-full whitespace-nowrap hover:bg-white/5 transition-colors">
                        Events This Week
                    </button>
                </div>
            </div>

            {/* Events Section Headers */}
            <div className="px-6">
                <h2 className="text-white font-semibold text-lg mb-4">Events today</h2>
            </div>

            {/* Main Content */}
            <div className="px-6 space-y-4">
                {/* Events Today Grid */}
                <div className="flex gap-4 overflow-x-auto scrollbar-hide" style={{ width: 'max-content' }}>
                    {events.slice(0, 2).map((event, index) => (
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
                                                <div className="text-sm font-bold">{event.date.split(' ')[1] || event.date}</div>
                                            </div>
                                        </div>
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
                </div>                {/* Events This Week Section */}
                <div className="mt-8">
                    <h2 className="text-white font-semibold text-lg mb-4">Events this week</h2>
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide" style={{ width: 'max-content' }}>
                        {events.slice(0, 2).map((event, index) => (
                            <div key={`week-${event.id}`} className="flex-shrink-0 w-[222px]">
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
                                                    <div className="text-sm font-bold">{event.date.split(' ')[1] || event.date}</div>
                                                </div>
                                            </div>
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
                </div>                {/* All Events Section */}
                <div className="mt-8">
                    <h2 className="text-white font-semibold text-lg mb-4">All Events</h2>
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide" style={{ width: 'max-content' }}>
                        {events.map((event, index) => (
                            <div key={`all-${event.id}`} className="flex-shrink-0 w-[222px]">
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
                                                    <div className="text-sm font-bold">{event.date.split(' ')[1] || event.date}</div>
                                                </div>
                                            </div>
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
            </div>
        </div>
    );
}