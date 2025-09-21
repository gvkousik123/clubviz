'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % 5);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const clubStories = [
        { id: 1, name: 'CLU', logo: '/placeholder-logo.svg' },
        { id: 2, name: 'DABO', logo: '/placeholder-logo.svg' },
        { id: 3, name: 'BARREL', logo: '/placeholder-logo.svg' },
        { id: 4, name: 'SOCIAL', logo: '/placeholder-logo.svg' },
        { id: 5, name: 'HITCHKI', logo: '/placeholder-logo.svg' },
    ];

    const venues = [
        {
            id: 1,
            name: 'DABO',
            rating: 4.2,
            openUntil: '1:30 am',
            image: '/purple-neon-club-interior.jpg',
            isFavorite: false
        },
        {
            id: 2,
            name: 'CAFE MOJO',
            rating: 4.1,
            openUntil: '2:00 am',
            image: '/red-neon-lounge-interior.jpg',
            isFavorite: true
        }
    ];

    const events = [
        {
            id: 1,
            date: { month: 'APR', day: '04' },
            image: '/night-party-event-poster-with-purple-and-pink-neon.jpg',
            title: 'Freaky Friday',
            dj: 'with DJ Alexxx',
            location: 'DABO, Airport Road',
            genre: 'Techno & Bollytech',
            isFavorite: false
        },
        {
            id: 2,
            date: { month: 'APR', day: '04' },
            image: '/dj-woman-with-headphones-and-sunglasses-in-neon-li.jpg',
            title: 'Wow Wednesday',
            dj: 'with DJ Shade',
            location: 'DABO, Airport Road',
            genre: 'Bollywood & Bollytech',
            isFavorite: true
        }
    ];

    return (
        <main className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Header with location and profile icon */}
            <header className="flex justify-between items-center px-6 pt-12 pb-6">
                <div className="flex items-center">
                    <div className="text-blue-400 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="flex items-center">
                        <span className="text-xl font-semibold text-white">Dharampeth</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-white/80" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <Link href="/profile">
                    <div className="rounded-full p-3 bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                </Link>
            </header>

            {/* Search Bar */}
            <div className="px-6 mb-8 flex">
                <div className="flex-1 bg-blue-500/10 backdrop-blur-sm rounded-2xl flex items-center px-5 py-4 border border-blue-500/20 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/60 mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <span className="text-white/60 text-lg">Search</span>
                </div>
                <button className="ml-4 rounded-2xl bg-blue-500/10 backdrop-blur-sm p-4 border border-blue-500/20 shadow-lg hover:bg-blue-500/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>

            {/* Vibe Meter Section */}
            <div className="px-6 mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-white">Vibe Meter</h2>
                <div className="flex space-x-6 overflow-x-auto scrollbar-hide py-2">
                    {clubStories.map((club) => (
                        <Link href={`/story/${club.id}`} key={club.id}>
                            <div className="flex flex-col items-center min-w-[90px]">
                                <div className="w-20 h-20 rounded-full border-3 border-blue-400 p-1 mb-3 shadow-lg">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                        <span className="text-sm font-semibold text-gray-700">Acme In</span>
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-white text-center">{club.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Featured Event Section */}
            <div className="px-6 mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-white">Featured Event</h2>
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl overflow-hidden relative h-52 shadow-xl">
                    <Image
                        src="/dj-event-poster-with-woman-dj-and-neon-lighting.jpg"
                        alt="Featured Event"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">DJ Night Special</h3>
                                <p className="text-white/90 text-base">Tonight at DABO</p>
                            </div>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl text-base font-semibold transition-colors shadow-lg">
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Venue List Section */}
            <div className="px-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-white">Venue List</h2>
                    <Link href="/venue-list" className="text-blue-400 hover:text-blue-300 text-base font-medium transition-colors">
                        See all
                    </Link>
                </div>
                <div className="space-y-5">
                    {venues.map((venue) => (
                        <Link href={`/venues/${venue.id}`} key={venue.id}>
                            <div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/20 flex items-center shadow-lg hover:bg-blue-500/15 transition-colors">
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden mr-4 shadow-md">
                                    <Image
                                        src={venue.image}
                                        alt={venue.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-white text-lg mb-2">{venue.name}</h3>
                                    <div className="flex items-center text-white/70 text-base">
                                        <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="mr-3 font-medium">{venue.rating}</span>
                                        <span>Open until {venue.openUntil}</span>
                                    </div>
                                </div>
                                <button className="p-3">
                                    <svg className={`w-6 h-6 ${venue.isFavorite ? 'text-red-400 fill-red-400' : 'text-white/40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Events Section */}
            <div className="px-6 mb-24">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-white">Events</h2>
                    <Link href="/events" className="text-blue-400 hover:text-blue-300 text-base font-medium transition-colors">
                        See all
                    </Link>
                </div>
                <div className="space-y-6">
                    {events.map((event) => (
                        <Link href={`/events/${event.id}`} key={event.id}>
                            <div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue-500/20 shadow-lg hover:bg-blue-500/15 transition-colors">
                                <div className="relative h-48">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl px-3 py-2 text-center min-w-[70px] shadow-lg">
                                        <div className="text-blue-400 text-sm font-medium">{event.date.month}</div>
                                        <div className="text-white text-xl font-bold leading-tight">{event.date.day}</div>
                                    </div>
                                    <button className="absolute top-4 right-4 p-3 rounded-full bg-black/40 backdrop-blur-sm">
                                        <svg className={`w-6 h-6 ${event.isFavorite ? 'text-red-400 fill-red-400' : 'text-white/80'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                                    <p className="text-blue-400 text-base mb-3 font-medium">{event.dj}</p>
                                    <p className="text-white/70 text-base mb-2">{event.location}</p>
                                    <p className="text-white/50 text-sm">{event.genre}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
