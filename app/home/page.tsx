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
    { id: 1, image: '/venue/Screenshot 2024-12-10 195651.png', musicBy: 'DJ ALEXXX', hostedBy: 'DABO CLUB', sponsor: 'SPONSORED', bookingLink: '/booking' },
    { id: 2, image: '/venue/Screenshot 2024-12-10 195852.png', musicBy: 'DJ SHADE', hostedBy: 'GARAGE CLUB', sponsor: 'TRENDING', bookingLink: '/booking' },
    { id: 3, image: '/venue/Screenshot 2024-12-10 200154.png', musicBy: 'DJ VIBE', hostedBy: 'ELITE CLUB', sponsor: 'FEATURED', bookingLink: '/booking' },
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
                    <section className="relative w-full h-[262px]">
                        <div data-property-1="Default" className="w-full h-full relative shadow-[0px_4px_5.6px_rgba(20,255,236,0.11)] overflow-hidden rounded-b-[30px]">
                            {/* All carousel slides with different positions */}
                            <div
                                className="w-[430px] h-[262px] absolute transition-transform duration-500 ease-in-out"
                                style={{
                                    left: "0px",
                                    top: "0px",
                                    transform: currentSlide === 0 ? 'translateX(0)' : 'translateX(-9999px)'
                                }}
                            >
                                <img className="w-[430px] h-[262px] absolute left-0 top-0 bg-gradient-to-b from-transparent to-black/70 border-t border-black" src={heroSlides[0].image} alt={heroSlides[0].musicBy} />
                                <div className="w-[430px] h-[129px] absolute left-0 top-0 bg-gradient-to-b from-black/70 to-transparent"></div>
                                <div className="w-[40px] h-[54px] pb-2 px-[1px] absolute left-[430px] top-[193px] transform rotate-90 origin-top-left bg-[rgba(30,98,102,0.5)] shadow-[0px_0px_10px_rgba(233.78,233.78,233.78,0.25)] rounded-bl-[25px] rounded-br-[25px] border-l border-r border-b border-white backdrop-blur-sm flex flex-col justify-center items-center gap-[10px]">
                                    <div className="transform -rotate-90 origin-top-left text-center justify-center flex flex-col text-white text-xs font-bold font-['Manrope'] leading-[15px] break-words">BOOK<br />NOW</div>
                                </div>
                                <div className="w-[74px] h-[30px] absolute left-[31px] top-[38px]">
                                    <div className="w-[74px] h-[30px] absolute left-0 top-0 bg-[rgba(212.01,212.01,212.01,0.1)] rounded-[6px] border border-white/50 backdrop-blur-[17.5px]"></div>
                                    <div className="absolute left-3 top-[7px] text-center justify-center flex flex-col text-white text-xs font-bold font-['Manrope'] leading-[15px] break-words">{heroSlides[0].sponsor}</div>
                                </div>
                            </div>

                            <div
                                className="w-[430px] h-[262px] absolute transition-transform duration-500 ease-in-out"
                                style={{
                                    left: "0px",
                                    top: "0px",
                                    transform: currentSlide === 1 ? 'translateX(0)' : 'translateX(-9999px)'
                                }}
                            >
                                <img className="w-[430px] h-[262px] absolute left-0 top-0" src={heroSlides[1].image} alt={heroSlides[1].musicBy} />
                                <div className="w-[430px] h-[129px] absolute left-0 top-0 bg-gradient-to-b from-black/70 to-transparent"></div>
                                <div className="w-[40px] h-[54px] pb-2 px-[1px] absolute left-[430px] top-[193px] transform rotate-90 origin-top-left bg-[rgba(30,98,102,0.5)] shadow-[0px_0px_10px_rgba(233.78,233.78,233.78,0.25)] rounded-bl-[25px] rounded-br-[25px] border-l border-r border-b border-white backdrop-blur-sm flex flex-col justify-center items-center gap-[10px]">
                                    <div className="transform -rotate-90 origin-top-left text-center justify-center flex flex-col text-white text-xs font-bold font-['Manrope'] leading-[15px] break-words">BOOK<br />NOW</div>
                                </div>
                                <div className="w-[74px] h-[30px] absolute left-[31px] top-[38px]">
                                    <div className="w-[74px] h-[30px] absolute left-0 top-0 bg-[rgba(212.01,212.01,212.01,0.1)] rounded-[6px] border border-white/50 backdrop-blur-[17.5px]"></div>
                                    <div className="absolute left-3 top-[7px] text-center justify-center flex flex-col text-white text-xs font-bold font-['Manrope'] leading-[15px] break-words">{heroSlides[1].sponsor}</div>
                                </div>
                            </div>

                            <div
                                className="w-[430px] h-[262px] absolute transition-transform duration-500 ease-in-out"
                                style={{
                                    left: "0px",
                                    top: "0px",
                                    transform: currentSlide === 2 ? 'translateX(0)' : 'translateX(-9999px)'
                                }}
                            >
                                <img className="w-[430px] h-[262px] absolute left-0 top-0" src={heroSlides[2].image} alt={heroSlides[2].musicBy} />
                                <div className="w-[430px] h-[129px] absolute left-0 top-0 bg-gradient-to-b from-black/70 to-transparent"></div>
                                <div className="w-[40px] h-[54px] pb-2 px-[1px] absolute left-[430px] top-[193px] transform rotate-90 origin-top-left bg-[rgba(30,98,102,0.5)] shadow-[0px_0px_10px_rgba(233.78,233.78,233.78,0.25)] rounded-bl-[25px] rounded-br-[25px] border-l border-r border-b border-white backdrop-blur-sm flex flex-col justify-center items-center gap-[10px]">
                                    <div className="transform -rotate-90 origin-top-left text-center justify-center flex flex-col text-white text-xs font-bold font-['Manrope'] leading-[15px] break-words">BOOK<br />NOW</div>
                                </div>
                                <div className="w-[74px] h-[30px] absolute left-[31px] top-[38px]">
                                    <div className="w-[74px] h-[30px] absolute left-0 top-0 bg-[rgba(212.01,212.01,212.01,0.1)] rounded-[6px] border border-white/50 backdrop-blur-[17.5px]"></div>
                                    <div className="absolute left-3 top-[7px] text-center justify-center flex flex-col text-white text-xs font-bold font-['Manrope'] leading-[15px] break-words">{heroSlides[2].sponsor}</div>
                                </div>
                            </div>

                            {/* Pagination Dots */}
                            <div className="w-[90px] h-[19px] p-2 absolute left-[170px] top-[225px] bg-white/10 rounded-[28px] border border-white backdrop-blur-[5px] flex justify-center items-center gap-[5px]">
                                {heroSlides.map((_, index) => (
                                    <div key={index} className="w-[12px] h-[12px] relative">
                                        <div
                                            className={`w-[12px] h-[12px] absolute left-0 top-0 rounded-full ${index === currentSlide ? 'bg-white' : 'border border-white'}`}
                                            onClick={() => setCurrentSlide(index)}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Vibe Meter */}
                    <section className="px-5">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white text-base font-semibold">Vibe Meter</h2>
                        </div>
                        <div className="pl-4 pr-4 overflow-x-auto flex items-center justify-start gap-4">
                            {vibeMeterFallback.map((user) => (
                                <div key={user.id} className="flex flex-col items-center gap-2">
                                    <div className="w-[72px] h-[72px] relative">
                                        <div className="w-[72px] h-[72px] absolute left-0 top-0 rounded-full border-2 border-[#14FFEC]"></div>
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="w-[64px] h-[64px] absolute left-1 top-1 rounded-full border border-white"
                                        />
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
                                    <div className="w-[336px] h-[169px] relative overflow-hidden rounded-[15px]">
                                        <img
                                            src={club.image}
                                            alt={club.name}
                                            className="w-[336px] h-[197px] absolute left-0 top-0 rounded-[11px]"
                                        />
                                        <div className="w-[336px] h-[169px] absolute left-0 top-0 bg-gradient-to-b from-black via-black/50 to-transparent overflow-hidden rounded-[10px]">
                                            <div className="w-[39px] h-[39px] absolute left-[281px] top-[17px] bg-[rgba(212.01,212.01,212.01,0.10)] overflow-hidden rounded-[22px] backdrop-blur-[17.5px] flex justify-center items-center">
                                                <Heart className="w-6 h-6 text-[#14FFEC]" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-[30px] h-[30px] absolute left-[250px] top-[110px] bg-[#008479] overflow-hidden rounded-[17px]">
                                        <div className="absolute left-[4px] top-[5px] flex justify-center flex-col text-white text-[13px] font-['Manrope'] font-extrabold leading-[20px] tracking-[0.13px] break-words">
                                            {club.rating}
                                        </div>
                                    </div>
                                    <div className="w-[128px] h-[43px] absolute left-[33px] top-[144px] flex justify-start items-center gap-[29px]">
                                        <div className="w-[208px] flex flex-col justify-center items-start gap-2">
                                            <div className="self-stretch h-[20px] flex justify-center flex-col text-[#14FFEC] text-2xl font-normal font-['Anton SC'] leading-[20px] tracking-[1.2px] break-words">
                                                {club.name}
                                            </div>
                                            <div className="self-stretch h-[12px] flex justify-center flex-col text-white text-[13px] font-['Manrope'] font-semibold leading-[20px] tracking-[0.13px] break-words">
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