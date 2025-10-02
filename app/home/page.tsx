'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SidebarMenu from '@/components/ui/sidebar-menu';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import { ClubVizLogo } from '@/components/auth/logo';

// Mock data for vibe meter
const vibeMeterData = [
    { id: 1, name: 'DABO', logo: '/crowded-nightclub-with-red-lighting-and-people-dan.jpg', color: 'border-cyan-400' },
    { id: 2, name: 'Elite', logo: '/upscale-club-interior-with-blue-lighting.jpg', color: 'border-cyan-400' },
    { id: 3, name: 'Escape', logo: '/purple-neon-club-interior.jpg', color: 'border-cyan-400' },
    { id: 4, name: 'Nitro', logo: '/red-neon-lounge-interior.jpg', color: 'border-cyan-400' },
    { id: 5, name: 'GARAGE', logo: '/upscale-bar-interior-with-bottles.jpg', color: 'border-cyan-400' },
];

const venueData = [
    {
        id: 1,
        name: 'DABO',
        openTime: 'Open until 1:30 am',
        rating: 4.2,
        image: '/crowded-nightclub-with-red-lighting-and-people-dan.jpg',
        isFavorite: false,
    },
    {
        id: 2,
        name: 'GARAGE',
        openTime: 'Open until 2:00 am',
        rating: 4.5,
        image: '/purple-neon-club-interior.jpg',
        isFavorite: false,
    },
];

// Mock data for banner slides
const bannerSlides = [
    {
        id: 1,
        image: '/dj-woman-with-headphones-and-sunglasses-in-neon-li.jpg',
        musicBy: 'DJ MARTIN',
        hostedBy: 'DJ AMIL',
        sponsor: 'SPONSORED',
        bookingLink: '/booking'
    },
    {
        id: 2,
        image: '/dj-event-poster-with-woman-dj-and-neon-lighting.jpg',
        musicBy: 'DJ ALEXXX',
        hostedBy: 'CLUB ELITE',
        sponsor: 'FEATURED',
        bookingLink: '/booking'
    },
    {
        id: 3,
        image: '/night-party-event-poster-with-purple-and-pink-neon.jpg',
        musicBy: 'DJ SHADE',
        hostedBy: 'GARAGE CLUB',
        sponsor: 'TRENDING',
        bookingLink: '/booking'
    },
    {
        id: 4,
        image: '/purple-neon-club-interior.jpg',
        musicBy: 'DJ STORM',
        hostedBy: 'NITRO CLUB',
        sponsor: 'POPULAR',
        bookingLink: '/booking'
    },
    {
        id: 5,
        image: '/crowded-nightclub-with-red-lighting-and-people-dan.jpg',
        musicBy: 'DJ VIBE',
        hostedBy: 'ESCAPE',
        sponsor: 'EXCLUSIVE',
        bookingLink: '/booking'
    }
];

// Mock data for events
const eventData = [
    {
        id: 1,
        title: 'Freaky Friday with DJ Alexxx',
        venue: 'DABO, Airport Road',
        date: 'APR 04',
        category: 'Techno & Bollytech',
        image: '/dj-event-poster-with-woman-dj-and-neon-lighting.jpg',
        isFavorite: false,
    },
    {
        id: 2,
        title: 'Wow Wednesday with DJ Shade',
        venue: 'DABO, Airport Road',
        date: 'APR 06',
        category: 'Bollywood & Bollytech',
        image: '/night-party-event-poster-with-purple-and-pink-neon.jpg',
        isFavorite: false,
    },
];

const HomePage: React.FC = () => {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
    const venueScrollRef = useDragScroll();
    const eventScrollRef = useDragScroll();
    const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);

    // Auto-scroll functionality
    useEffect(() => {
        if (!isAutoScrollPaused) {
            autoScrollTimer.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
            }, 4000); // Auto-scroll every 4 seconds
        }

        return () => {
            if (autoScrollTimer.current) {
                clearInterval(autoScrollTimer.current);
            }
        };
    }, [isAutoScrollPaused]);

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
    };

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    };

    const handleBannerTouch = () => {
        setIsAutoScrollPaused(true);
        setTimeout(() => setIsAutoScrollPaused(false), 5000); // Resume after 5 seconds
    };

    const handleVibeMeterClick = (clubId: number) => {
        router.push('/story');
    };

    const handleMenuClick = () => {
        setIsSidebarOpen(true);
    };

    const handleSidebarClose = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#0a2e30] font-['Poppins']">
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 z-40 w-full bg-gradient-to-r from-teal-600 to-teal-500 rounded-bl-[30px] rounded-br-[30px] pb-4">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 pt-4 pb-2">
                    <div className="text-white text-sm font-semibold">9:41</div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-3 bg-white/60 rounded-sm"></div>
                        <div className="w-4 h-3 bg-white/60 rounded-sm"></div>
                        <div className="w-6 h-3 bg-white border border-white/60 rounded-sm"></div>
                    </div>
                </div>

                {/* Main Header */}
                <div className="px-4 pb-4">
                    <div className="flex justify-between items-center mb-4">
                        <ClubVizLogo size="sm" variant="text" />
                        <Link href="/account">
                            <User className="w-6 h-6 text-white hover:text-cyan-300 transition-colors cursor-pointer" />
                        </Link>
                    </div>

                    {/* Search Bar and Menu */}
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search"
                                className="w-full pl-10 pr-4 py-2 bg-neutral-800 border-none rounded-[23px] text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400"
                            />
                        </div>
                        <Button
                            onClick={handleMenuClick}
                            size="icon"
                            className="w-9 h-9 bg-[#222831] hover:bg-[#2a2a38] rounded-[23px] border-none"
                        >
                            <Menu className="w-4 h-4 text-white" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-32 px-4 py-6 space-y-8">
                {/* Hero Banner with Auto-scroll */}
                <div
                    className="relative h-[262px] rounded-[20px] overflow-hidden shadow-lg"
                    onTouchStart={handleBannerTouch}
                    onMouseEnter={() => setIsAutoScrollPaused(true)}
                    onMouseLeave={() => setIsAutoScrollPaused(false)}
                >
                    {/* Banner Slides Container */}
                    <div
                        className="flex transition-transform duration-500 ease-in-out w-full h-full"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {bannerSlides.map((slide) => (
                            <div key={slide.id} className="relative w-full h-full flex-shrink-0">
                                <img
                                    src={slide.image}
                                    alt="DJ Event"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                {/* Content Overlay */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-black/40 text-white text-xs px-2 py-1 rounded">{slide.sponsor}</span>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <div className="text-white">
                                        <p className="text-xs opacity-80">MUSIC BY</p>
                                        <p className="font-bold">{slide.musicBy}</p>
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-4">
                                    <div className="text-white text-right">
                                        <p className="text-xs opacity-80">HOSTED BY</p>
                                        <p className="font-bold">{slide.hostedBy}</p>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <Link href={slide.bookingLink}>
                                        <Button className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-3 py-1 rounded-full">
                                            BOOK NOW
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrevSlide}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-all duration-200"
                    >
                        <ChevronLeft className="w-4 h-4 text-white" />
                    </button>
                    <button
                        onClick={handleNextSlide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-all duration-200"
                    >
                        <ChevronRight className="w-4 h-4 text-white" />
                    </button>

                    {/* Pagination dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="flex gap-1">
                            {bannerSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Access (Development Testing) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-white font-semibold text-base whitespace-nowrap">Quick Access</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <Link href="/booking/review">
                            <Button className="w-full bg-purple-600/20 border border-purple-400/40 text-purple-400 text-xs py-3 rounded-[16px] hover:bg-purple-600/30 transition-all">
                                Start Booking
                            </Button>
                        </Link>
                        <Link href="/ticket/view">
                            <Button className="w-full bg-primary-600/20 border border-primary-400/40 text-primary-400 text-xs py-3 rounded-[16px] hover:bg-primary-600/30 transition-all">
                                View Ticket
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <Link href="/ticket/complete">
                            <Button className="w-full bg-green-600/20 border border-green-400/40 text-green-400 text-xs py-3 rounded-[16px] hover:bg-green-600/30 transition-all">
                                Book Complete
                            </Button>
                        </Link>
                        <Link href="/ticket/cancel">
                            <Button className="w-full bg-red-600/20 border border-red-400/40 text-red-400 text-xs py-3 rounded-[16px] hover:bg-red-600/30 transition-all">
                                Cancel Test
                            </Button>
                        </Link>
                        <Link href="/booking/form">
                            <Button className="w-full bg-orange-600/20 border border-orange-400/40 text-orange-400 text-xs py-3 rounded-[16px] hover:bg-orange-600/30 transition-all">
                                Booking Form
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <Link href="/profile/edit">
                            <Button className="w-full bg-teal-600/20 border border-teal-400/40 text-teal-400 text-xs py-3 rounded-[16px] hover:bg-teal-600/30 transition-all">
                                Edit Profile
                            </Button>
                        </Link>
                        <Link href="/payment/options">
                            <Button className="w-full bg-blue-600/20 border border-blue-400/40 text-blue-400 text-xs py-3 rounded-[16px] hover:bg-blue-600/30 transition-all">
                                Payment Options
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Vibe Meter Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-white font-semibold text-base whitespace-nowrap">Vibe Meter</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
                    </div>
                    <div className="flex gap-4 pb-2">
                        {vibeMeterData.map((club) => (
                            <button
                                key={club.id}
                                onClick={() => handleVibeMeterClick(club.id)}
                                className={`flex-shrink-0 w-16 h-16 rounded-full border-2 ${club.color} bg-black/80 flex items-center justify-center hover:scale-105 transition-transform p-2`}
                            >
                                <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                                    <img
                                        src={club.logo}
                                        alt={club.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback to text if image fails to load
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                                parent.innerHTML = `<span class="text-white text-xs font-bold text-center leading-tight">${club.name}</span>`;
                                            }
                                        }}
                                    />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Venue List Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-white font-semibold text-base whitespace-nowrap">Venue List</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
                        <Link href="/clubs" className="text-cyan-400 text-sm font-medium whitespace-nowrap">
                            View All
                        </Link>
                    </div>
                    <div ref={venueScrollRef} className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-4 pb-16" style={{ width: 'max-content' }}>
                            {venueData.map((venue) => (
                                <Link key={venue.id} href={`/club/${venue.name.toLowerCase()}`}>
                                    <div className="flex-shrink-0 w-[336px] relative cursor-pointer transform transition-all duration-300 hover:scale-105">
                                        <div className="relative h-[197px] rounded-[20px] border border-[#0c898b] bg-[#1a2f32]">
                                            <div className="rounded-[20px] overflow-hidden h-full">
                                                <img
                                                    src={venue.image}
                                                    alt={venue.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                            </div>

                                            {/* Glass effect card that extends beyond main card */}
                                            <div className="absolute -bottom-8 left-2 right-2 glassmorphism-strong border border-white/20 p-5 rounded-2xl h-20 z-10">
                                                <h3 className="text-white font-bold text-xl mb-2">{venue.name}</h3>
                                                <p className="text-white/90 text-sm">{venue.openTime}</p>
                                            </div>

                                            <div className="absolute bottom-4 right-4 z-20">
                                                <div className="glassmorphism text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                                                    {venue.rating}
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    // Handle favorite toggle
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

                {/* Event List Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-white font-semibold text-base whitespace-nowrap">Event List</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
                        <Link href="/events" className="text-cyan-400 text-sm font-medium whitespace-nowrap">
                            View All
                        </Link>
                    </div>
                    <div ref={eventScrollRef} className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-4 pb-2" style={{ width: 'max-content' }}>
                            {eventData.map((event) => (
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 space-y-6 ">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <ClubVizLogo size="sm" variant="full" />
                    </div>
                    <p className="text-white text-sm leading-relaxed max-w-[300px] mx-auto">
                        Dive into the ultimate party scene discover lit club nights, epic events, and non-stop vibes all in one place!
                    </p>
                </div>

                <div className="flex justify-center gap-6">
                    <div className="w-6 h-6 bg-white/20 rounded-lg"></div>
                    <div className="w-6 h-6 bg-white/20 rounded-lg"></div>
                    <div className="w-6 h-6 bg-white/20 rounded-lg"></div>
                    <div className="w-6 h-6 bg-white/20 rounded-lg"></div>
                </div>

                <div className="bg-[#0d7377] rounded-[16px] p-4 space-y-3 mx-6">
                    <div className="flex items-center gap-3 text-white text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span>contact@clubwiz.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-white text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>Location Details</span>
                    </div>
                    <div className="flex items-center gap-3 text-white text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" clipRule="evenodd" />
                        </svg>
                        <span>Terms & Condition</span>
                    </div>
                    <div className="flex items-center gap-3 text-white text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" clipRule="evenodd" />
                        </svg>
                        <span>Privacy Policy</span>
                    </div>
                </div>

                <p className="text-white text-xs text-center opacity-80">
                    Copy rights reserved with clubwiz.com
                </p>
            </div>

            {/* Sidebar Menu */}
            <SidebarMenu isOpen={isSidebarOpen} onClose={handleSidebarClose} />
        </div>
    );
};

export default HomePage;
