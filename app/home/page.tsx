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
    { id: 1, image: '/venue/Screenshot 2024-12-10 195651.png', musicBy: 'DJ ALEXXX', hostedBy: 'DABO CLUB', sponsor: 'SPONSERED', bookingLink: '/booking' },
    { id: 2, image: '/venue/Screenshot 2024-12-10 195852.png', musicBy: 'DJ SHADE', hostedBy: 'GARAGE CLUB', sponsor: 'TRENDING', bookingLink: '/booking' },
    { id: 3, image: '/venue/Screenshot 2024-12-10 200154.png', musicBy: 'DJ VIBE', hostedBy: 'ELITE CLUB', sponsor: 'FEATURED', bookingLink: '/booking' },
    { id: 4, image: '/venue/Screenshot 2024-12-10 195651.png', musicBy: 'DJ MARCO', hostedBy: 'ELITE LOUNGE', sponsor: 'POPULAR', bookingLink: '/booking' },
    { id: 5, image: '/venue/Screenshot 2024-12-10 195852.png', musicBy: 'DJ GROOVE', hostedBy: 'RHYTHM CLUB', sponsor: 'HOT', bookingLink: '/booking' },
];

const vibeMeterFallback = [
    { id: 'vibe1', name: 'Sarah', image: '/vibemeter/Screenshot_2025-05-16_192139-removebg-preview.png' },
    { id: 'vibe2', name: 'Michael', image: '/vibemeter/Screenshot_2025-05-16_193232-removebg-preview.png' },
    { id: 'vibe3', name: 'Jessica', image: '/vibemeter/Screenshot_2025-05-23_223510-removebg-preview.png' },
    { id: 'vibe4', name: 'Alex', image: '/vibemeter/Screenshot_2025-05-24_094641-removebg-preview.png' },
    { id: 'vibe5', name: 'Emma', image: '/vibemeter/Screenshot_2025-05-24_110818-removebg-preview.png' },
    { id: 'vibe6', name: 'Jason', image: '/vibemeter/Screenshot_2025-05-24_115115-removebg-preview.png' },
    { id: 'vibe7', name: 'Olivia', image: '/vibemeter/Screenshot_2025-05-31_121940-removebg-preview.png' },
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
                <header className="relative bg-gradient-to-b from-[#222831] to-[#11B9AB] rounded-b-[30px] px-5 pb-6 pt-12 z-50">
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
                        <div className="flex-1 h-10 px-4 py-2 bg-white/20 rounded-[23px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center gap-2">
                            <Search className="w-[21px] h-[21px] text-white" />
                            <span className="text-white text-base font-bold tracking-[0.5px]">Search</span>
                        </div>
                        <button className="w-10 h-10 bg-white/20 rounded-[23px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center relative">
                            <div className="w-[15px] h-[2px] absolute top-[15px] left-[14px] bg-white rounded-[2px]"></div>
                            <div className="w-[19px] h-[2px] absolute top-[21px] left-[12px] bg-white rounded-[6px]"></div>
                            <div className="w-[15px] h-[2px] absolute top-[27px] left-[14px] bg-white rounded-[2px]"></div>
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="px-0 pt-0 space-y-6">
                    {/* Hero Carousel */}
                    <section className="relative w-full -mt-[30px]">
                        <div data-property-1="Default" className="w-full h-full relative shadow-[0px_4px_5.6px_rgba(20,255,236,0.11)] overflow-hidden rounded-b-[30px]">
                            {/* Visible slide */}
                            <div className="w-[430px] h-[262px] relative">
                                {/* Image with gradient overlays */}
                                <img
                                    className="w-[430px] h-[262px] absolute left-0 top-0 object-cover opacity-[0.81] border-t border-black"
                                    src={heroSlides[currentSlide].image}
                                    alt={heroSlides[currentSlide].musicBy}
                                />

                                {/* Top gradient overlay */}
                                <div className="w-[430px] h-[129px] absolute left-0 top-0 bg-gradient-to-b from-black/70 to-transparent"></div>

                                {/* Bottom gradient overlay */}
                                <div className="w-[430px] h-[129px] absolute left-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                                {/* Book Now button with exact styling */}
                                <div className="absolute right-[10px] bottom-[30px] z-10 overflow-visible">
                                    <div className="w-[80px] h-[45px] flex items-center bg-[rgba(30,98,102,0.5)] rounded-l-[22px] border border-r-0 border-white backdrop-blur-[25px] shadow-[0px_0px_10px_rgba(233.78,233.78,233.78,0.25)] pl-5">
                                        <div className="text-white text-[11px] font-bold font-['Manrope'] text-left leading-tight tracking-wider whitespace-nowrap ml-[-3px]">
                                            BOOK<br />NOW
                                        </div>
                                    </div>
                                </div>

                                {/* Sponsor badge with exact styling */}
                                <div className="w-[90px] h-[28px] absolute left-[15px] top-[45px]">
                                    <div className="w-full h-full absolute left-0 top-0 bg-[rgba(212.01,212.01,212.01,0.10)] rounded-[6px] border border-[rgba(255,255,255,0.50)] backdrop-blur-[17.50px]"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold font-['Manrope'] leading-[15px] break-words">
                                        {heroSlides[currentSlide].sponsor}
                                    </div>
                                </div>

                                {/* Pagination dots with exact styling */}
                                <div className="w-[90px] h-[19px] absolute left-[170px] top-[225px] p-[8px] bg-[rgba(255,255,255,0.10)] rounded-[28px] backdrop-blur-[5px] inline-flex justify-center items-center gap-[5px]" style={{ outline: '1px solid white', outlineOffset: '-1px' }}>
                                    {heroSlides.slice(0, 5).map((_, index) => (
                                        <div key={index} className="w-[12px] h-[12px] relative" onClick={() => setCurrentSlide(index)}>
                                            <div className={`w-[12px] h-[12px] absolute left-0 top-0 rounded-[9999px] ${index === currentSlide ? 'bg-white' : 'border border-white'}`}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>                    {/* Vibe Meter */}
                    <section className="px-5 pt-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white text-lg font-medium">Vibe Meter</h2>
                        </div>
                        <div className="overflow-x-auto scrollbar-hide -mx-5 px-5">
                            <div className="flex items-center gap-4 pb-3 min-w-max">
                                {vibeMeterFallback.map((user) => (
                                    <div key={user.id} className="flex flex-col items-center gap-2">
                                        <div className="w-[72px] h-[72px] relative">
                                            <div className="w-[72px] h-[72px] absolute left-0 top-0 rounded-full border-2 border-[#14FFEC]"></div>
                                            <img
                                                src={user.image}
                                                alt={user.name}
                                                className="w-[64px] h-[64px] absolute left-[4px] top-[4px] rounded-full border border-white object-cover"
                                            />
                                        </div>
                                        <span className="text-xs text-white text-center">{user.name}</span>
                                    </div>
                                ))}
                            </div>
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
                                <div key={club.id} className="w-[336px] h-[201px] relative flex-shrink-0 mr-1">
                                    {/* Main image container with rounded top */}
                                    <div className="w-[336px] h-[169px] left-0 top-0 absolute flex-col justify-start items-start flex rounded-[15px] border-[#14FFEC] overflow-hidden">
                                        <img
                                            src={club.image}
                                            alt={club.name}
                                            className="w-full h-full object-cover absolute inset-0"
                                        />
                                        {/* White overlay effect */}
                                        <div className="w-full h-full absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                                        <div className="w-[336px] h-[169px] pl-[281px] pr-4 pt-[17px] pb-[113px] left-0 top-0 absolute justify-end items-center inline-flex bg-gradient-to-b from-black via-black/50 to-black/0 rounded-[10px] overflow-hidden">
                                            <div className="w-[39px] self-stretch bg-neutral-300/10 rounded-[22px] backdrop-blur-[35px] justify-center items-center inline-flex overflow-hidden">
                                                <Bookmark className="w-5 h-5 text-[#14FFEC]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Glassmorphism bottom section - the translucent gray area */}
                                    <div className="w-[320px] h-[85px] left-[8px] top-[125px] absolute bg-[rgba(212.01,212.01,212.01,0.10)] rounded-[15px] border  backdrop-blur-[17.50px]"></div>

                                    {/* Rating badge */}
                                    <div className="w-[30px] h-[30px] pl-1 pr-[5px] py-[5px] left-[250px] top-[110px] absolute justify-center items-center inline-flex bg-[#008378] rounded-[17px] overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                                        <div className="text-white text-[13px] font-extrabold font-['Manrope'] leading-5 tracking-[0.01em]">
                                            {club.rating}
                                        </div>
                                    </div>

                                    {/* Text content */}
                                    <div className="w-32 h-[50px] left-[33px] top-[144px] absolute justify-start items-center gap-[29px] inline-flex">
                                        <div className="w-52 flex-col justify-center items-start gap-2 inline-flex">
                                            <div className="self-stretch h-5 text-[#14FFEC] text-xl font-black font-['Manrope'] leading-5 tracking-[0.02em] first-letter:text-2xl first-letter:leading-2">
                                                {club.name}
                                            </div>
                                            <div className="self-stretch h-5 text-white text-[13px] font-semibold font-['Manrope'] leading-5 tracking-[0.01em]">
                                                {club.openTime}
                                            </div>
                                        </div>
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
                                <div key={event.id} className="w-[222px] h-[331px] flex-shrink-0 relative rounded-[20px] overflow-hidden" style={{ background: 'radial-gradient(ellipse 79.96% 39.73% at 22.30% 70.24%, black 0%, #014A4B 100%)' }}>
                                    {/* Image */}
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-[150px] object-cover"
                                    />

                                    {/* Date Badge */}
                                    <div className="w-[36px] h-[45px] px-[2px] py-[10px] left-[147px] top-0 absolute bg-gradient-to-b from-black to-[#00C0CA] rounded-b-[28px] border-l border-r border-b border-[#CDCDCD] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
                                        <div className="w-[31px] text-center text-white text-[14px] font-semibold font-['Manrope'] leading-4">APR<br />04</div>
                                    </div>

                                    {/* Content */}
                                    <div className="w-[144px] h-[68px] left-[18px] top-[217px] absolute flex flex-col justify-start items-start gap-[3px]">
                                        <div className="self-stretch h-[42px] flex flex-col justify-center text-[#E6E6E6] text-base font-bold font-['Manrope'] leading-[22px] tracking-[0.16px] break-words">{event.title}</div>
                                        <div className="w-[144px] h-[23px] flex flex-col justify-center text-[#C3C3C3] text-xs font-bold font-['Manrope'] leading-[17px] tracking-[0.12px] break-words">{event.venue}</div>
                                    </div>

                                    {/* Heart Icon */}
                                    <div className="w-[23px] h-[21px] left-[175px] top-[241px] absolute">
                                        <div className="w-[23px] h-[21px] border-2 border-[#28D2DB] rounded-sm flex items-center justify-center">
                                            <Heart className="w-4 h-4 text-[#28D2DB]" />
                                        </div>
                                    </div>

                                    {/* Category Badge */}
                                    <div className="w-[222px] h-[34px] left-0 top-[297px] absolute rounded-b-[20px] border-t border-[#0FD8E2] overflow-hidden" style={{ background: 'radial-gradient(ellipse 148.20% 1115.41% at 50.00% 50.00%, #005F57 0%, #14FFEC 100%)' }}>
                                        <div className="w-[128px] left-[47px] top-[8px] absolute flex flex-col justify-center text-white text-[14px] font-bold font-['Manrope'] leading-[17px]">{event.category}</div>
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