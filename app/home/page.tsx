'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Search,
    Menu,
    MapPin,
    ChevronDown,
    Heart,
    Phone,
    MessageCircle,
    Instagram,
    Mail,
    User,
    SlidersHorizontal,
    ChevronLeft,
    ChevronRight,
    Bookmark
} from 'lucide-react';

// Dummy data
const heroSlides = [
    { id: 1, image: '/dj-woman-with-headphones-and-sunglasses-in-neon-li.jpg', musicBy: 'DJ ALEXXX', hostedBy: 'DABO CLUB', sponsor: 'SPONSORED', bookingLink: '/booking' },
    { id: 2, image: '/dj-event-poster-with-woman-dj-and-neon-lighting.jpg', musicBy: 'DJ SHADE', hostedBy: 'GARAGE CLUB', sponsor: 'TRENDING', bookingLink: '/booking' },
    { id: 3, image: '/night-party-event-poster-with-purple-and-pink-neon.jpg', musicBy: 'DJ VIBE', hostedBy: 'ELITE CLUB', sponsor: 'FEATURED', bookingLink: '/booking' },
];

const vibeMeterFallback = [
    { id: 'dabo', name: 'DABO', image: '/event page going people/story1.png' },
    { id: 'elite', name: 'Elite', image: '/event page going people/Story2.png' },
    { id: 'escape', name: 'Escape', image: '/event page going people/story 2.png' },
    { id: 'nitro', name: 'Nitro', image: '/event page going people/story@3x.png' },
    { id: 'garage', name: 'Garage', image: '/event page going people/Frame 3896.png' },
    { id: 'brillo', name: 'Brillo', image: '/event page going people/my account profile.png' },
];

const venueFallback = [
    { id: 'venue-1', name: 'DABO', openTime: 'Open until 1:30 am', rating: 4.2, image: '/venue/Screenshot 2024-12-10 195651.png' },
    { id: 'venue-2', name: 'Garage', openTime: 'Open until 2:00 am', rating: 4.5, image: '/venue/Screenshot 2024-12-10 195852.png' },
    { id: 'venue-3', name: 'Escape', openTime: 'Open until 12:30 am', rating: 4.3, image: '/venue/Screenshot 2024-12-10 200154.png' },
];

const eventFallback = [
    { id: 'event-1', title: 'Freaky Friday with DJ Alexxx', venue: 'DABO, Airport Road', startDateTime: new Date('2025-04-04T19:30:00Z').toISOString(), category: 'Techno & Bollytech', image: '/event list/Rectangle 1.jpg' },
    { id: 'event-2', title: 'Wow Wednesday with DJ Shade', venue: 'DABO, Airport Road', startDateTime: new Date('2025-04-06T19:30:00Z').toISOString(), category: 'Bollywood & Bollytech', image: '/event list/Rectangle 2.jpg' },
    { id: 'event-3', title: 'Saturday Night Fever', venue: 'Garage Club', startDateTime: new Date('2025-04-08T20:00:00Z').toISOString(), category: 'Deep house & Mellow Tech', image: '/event list/Rectangle 3.jpg' },
];

const HomePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
        }
    };

    return (
        <div className="min-h-screen bg-[#031313] text-white">
            <div className="relative mx-auto max-w-[430px]">
                {/* Header */}
                <header className="relative bg-gradient-to-b from-[#222831] to-[#11B9AB] rounded-b-[30px] px-5 pb-10 pt-12">
                    {/* Location and Profile */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-[#14FFEC]" />
                            <div className="text-white text-base font-bold tracking-wide">Dharampeth</div>
                            <ChevronDown className="w-3 h-3 text-white" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-10 px-4 py-2 bg-white/20 rounded-[23px] flex items-center gap-2">
                            <Search className="w-5 h-5 text-white" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="flex-1 bg-transparent text-white placeholder-white/60 outline-none text-base font-bold"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <button className="w-10 h-10 bg-white/20 rounded-[23px] flex items-center justify-center">
                            <Menu className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="px-0 pt-8 space-y-8">
                    {/* Hero Carousel */}
                    <section className="relative w-full h-[262px] rounded-b-[30px] overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {heroSlides.map((slide) => (
                                <div key={slide.id} className="w-full h-[262px] flex-shrink-0 relative">
                                    <img src={slide.image} alt={slide.musicBy} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent"></div>

                                    {/* Sponsored Badge */}
                                    <div className="absolute left-8 top-10 px-3 py-2 bg-white/10 rounded-md border border-white/50 backdrop-blur-sm">
                                        <div className="text-white text-xs font-bold">{slide.sponsor}</div>
                                    </div>

                                    {/* Book Now Button */}
                                    <div className="absolute right-0 bottom-16 w-10 h-14 bg-[#1E6266]/50 rounded-l-[25px] border-l border-b border-white backdrop-blur-sm flex items-center justify-center rotate-90 origin-bottom-right">
                                        <div className="-rotate-90 text-white text-xs font-bold text-center leading-tight">BOOK<br />NOW</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Dots */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                            {heroSlides.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white' : 'border border-white'
                                        }`}
                                    onClick={() => setCurrentSlide(index)}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Vibe Meter */}
                    <section className="px-5">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white text-base font-semibold">Vibe Meter</h2>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {vibeMeterFallback.map((user) => (
                                <div key={user.id} className="flex flex-col items-center gap-2 flex-shrink-0">
                                    <div className="w-[72px] h-[72px] rounded-full border-2 border-[#14FFEC] p-1">
                                        <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                    </div>
                                    <span className="text-xs text-white/80">{user.name}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Venue List */}
                    <section className="px-5">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white text-base font-semibold">Venue List</h2>
                            <Link href="/venues" className="text-[#14FFEC] text-base font-medium">View All</Link>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {venueFallback.map((club) => (
                                <div key={club.id} className="w-[336px] flex-shrink-0 relative">
                                    <div className="h-[169px] rounded-[15px] overflow-hidden relative">
                                        <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent">
                                            <button className="absolute right-4 top-4 w-10 h-10 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
                                                <Heart className="w-6 h-6 text-[#14FFEC]" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="absolute right-8 bottom-8 w-[30px] h-[30px] bg-[#008479] rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-extrabold">{club.rating}</span>
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="text-[#14FFEC] text-2xl font-normal">{club.name}</h3>
                                        <p className="text-white text-sm font-semibold mt-2">{club.openTime}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Event List */}
                    <section className="px-5">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white text-base font-semibold">Event List</h2>
                            <Link href="/events" className="text-[#14FFEC] text-base font-medium">View All</Link>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {eventFallback.map((event) => (
                                <div key={event.id} className="w-[222px] h-[332px] flex-shrink-0 relative rounded-[20px] overflow-hidden" style={{ background: 'radial-gradient(ellipse 79.96% 39.73% at 22.30% 70.24%, black 0%, #014A4B 100%)' }}>
                                    {/* Date Badge */}
                                    <div className="absolute right-4 top-0 w-9 px-2 py-3 bg-gradient-to-b from-black to-[#00C0CA] rounded-b-[28px] border-l border-r border-b border-[#CDCDCD] text-center">
                                        <div className="text-white text-sm font-semibold">APR<br />04</div>
                                    </div>

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3">
                                        <div>
                                            <h3 className="text-white text-base font-bold leading-tight">{event.title}</h3>
                                            <p className="text-[#C3C3C3] text-xs font-bold mt-1">{event.venue}</p>
                                        </div>
                                        <div className="w-full h-[34px] bg-gradient-to-r from-[#005F57] to-[#14FFEC] rounded-b-[20px] border-t border-[#0FD8E2] flex items-center px-6">
                                            <span className="text-white text-sm font-bold">{event.category}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="bg-gradient-to-t from-[#01413B] to-[#021313] rounded-b-[20px] px-6 py-8 space-y-6">
                        <div className="text-center">
                            <h1 className="text-[#14FFEC] text-4xl font-normal tracking-[9px]">CLUBWIZ</h1>
                            <p className="text-white text-base mt-4 leading-relaxed">
                                Dive into the ultimate party scene discover lit club nights, epic events, and non-stop vibes all in one place!
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-6">
                            <Instagram className="w-6 h-6 text-[#14FFEC]" />
                            <MessageCircle className="w-6 h-6 text-[#14FFEC]" />
                            <Phone className="w-6 h-6 text-[#14FFEC]" />
                            <Mail className="w-6 h-6 text-[#14FFEC]" />
                        </div>

                        <div className="bg-gradient-to-r from-[#174547]/20 to-[#14FFEC]/74 rounded-lg p-6 space-y-4">
                            <div className="flex items-center gap-3 text-white text-base">
                                <Mail className="w-4 h-4" />
                                <span>contact@clubwiz.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-white text-base">
                                <MapPin className="w-4 h-4" />
                                <span>Location Details</span>
                            </div>
                            <div className="flex items-center gap-3 text-white text-base">
                                <MessageCircle className="w-4 h-4" />
                                <span>Terms & Condition</span>
                            </div>
                            <div className="flex items-center gap-3 text-white text-base">
                                <Mail className="w-4 h-4" />
                                <span>Privacy Policy</span>
                            </div>
                        </div>

                        <p className="text-white/50 text-xs text-center">
                            Copy rights reserved with clubwiz.com
                        </p>
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default HomePage;