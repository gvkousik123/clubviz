'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SidebarMenu from '@/components/ui/sidebar-menu';

// Mock data for vibe meter
const vibeMeterData = [
    { id: 1, name: 'CLUB', logo: '/logo/club-logo.svg', color: 'border-cyan-400' },
    { id: 2, name: 'Elite', logo: '/logo/elite-logo.svg', color: 'border-green-400' },
    { id: 3, name: 'Escape', logo: '/logo/escape-logo.svg', color: 'border-yellow-400' },
    { id: 4, name: 'Nitro', logo: '/logo/nitro-logo.svg', color: 'border-orange-400' },
    { id: 5, name: 'KITCHEN', logo: '/logo/kitchen-logo.svg', color: 'border-red-400' },
];

// Mock data for venues
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
        <div className="min-h-screen bg-gradient-to-b from-[#0d7377] to-[#222831] font-['Poppins']">
            {/* Header */}
            <div className="w-full bg-gradient-to-r from-teal-600 to-teal-500 rounded-bl-[30px] rounded-br-[30px] pb-4">
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
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-white" />
                            <span className="text-white font-medium">Dharampeth</span>
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <User className="w-6 h-6 text-white" />
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

                    {/* Location Dropdown */}
                    <div className="mt-4">
                        <Link href="/location/select">
                            <div className="inline-flex items-center gap-2 bg-[#222831] rounded-[25px] px-4 py-2 hover:bg-[#2a2a38] transition-all duration-300">
                                <span className="text-white font-bold text-sm">Nagpur</span>
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-6 space-y-8">
                {/* Hero Banner */}
                <div className="relative h-[262px] rounded-t-[30px] rounded-b-[30px] overflow-hidden shadow-lg">
                    <img
                        src="/dj-woman-with-headphones-and-sunglasses-in-neon-li.jpg"
                        alt="DJ Event"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                        <span className="bg-black/40 text-white text-xs px-2 py-1 rounded">SPONSORED</span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                        <div className="text-white">
                            <p className="text-xs opacity-80">MUSIC BY</p>
                            <p className="font-bold">DJ MARTIN</p>
                        </div>
                    </div>
                    <div className="absolute bottom-4 right-4">
                        <div className="text-white text-right">
                            <p className="text-xs opacity-80">HOSTED BY</p>
                            <p className="font-bold">DJ AMIL</p>
                        </div>
                    </div>
                    <div className="absolute top-4 right-4">
                        <Link href="/booking/review">
                            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-3 py-1 rounded-full">
                                BOOK NOW
                            </Button>
                        </Link>
                    </div>
                    {/* Pagination dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
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
                            <Button className="w-full bg-purple-600/20 border border-purple-400/40 text-purple-400 text-xs py-3 rounded-2xl hover:bg-purple-600/30 transition-all">
                                Start Booking
                            </Button>
                        </Link>
                        <Link href="/ticket/view">
                            <Button className="w-full bg-primary-600/20 border border-primary-400/40 text-primary-400 text-xs py-3 rounded-2xl hover:bg-primary-600/30 transition-all">
                                View Ticket
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <Link href="/ticket/complete">
                            <Button className="w-full bg-green-600/20 border border-green-400/40 text-green-400 text-xs py-3 rounded-2xl hover:bg-green-600/30 transition-all">
                                Book Complete
                            </Button>
                        </Link>
                        <Link href="/ticket/cancel">
                            <Button className="w-full bg-red-600/20 border border-red-400/40 text-red-400 text-xs py-3 rounded-2xl hover:bg-red-600/30 transition-all">
                                Cancel Test
                            </Button>
                        </Link>
                        <Link href="/booking/form">
                            <Button className="w-full bg-orange-600/20 border border-orange-400/40 text-orange-400 text-xs py-3 rounded-2xl hover:bg-orange-600/30 transition-all">
                                Booking Form
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <Link href="/profile/edit">
                            <Button className="w-full bg-teal-600/20 border border-teal-400/40 text-teal-400 text-xs py-3 rounded-2xl hover:bg-teal-600/30 transition-all">
                                Edit Profile
                            </Button>
                        </Link>
                        <Link href="/payment/options">
                            <Button className="w-full bg-blue-600/20 border border-blue-400/40 text-blue-400 text-xs py-3 rounded-2xl hover:bg-blue-600/30 transition-all">
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
                                className={`flex-shrink-0 w-16 h-16 rounded-full border-2 ${club.color} bg-black/80 flex items-center justify-center hover:scale-105 transition-transform`}
                            >
                                <span className="text-white text-xs font-bold text-center leading-tight">
                                    {club.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Venue List Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-white font-semibold text-base whitespace-nowrap">Venue List</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
                        <Link href="/venues" className="text-cyan-400 text-sm font-medium whitespace-nowrap">
                            View All
                        </Link>
                    </div>
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-4 pb-2" style={{ width: 'max-content' }}>
                            {venueData.map((venue) => (
                                <div key={venue.id} className="flex-shrink-0 w-[336px] relative">
                                    <div className="relative h-[197px] rounded-t-[30px] rounded-b-[30px] border border-[#0c898b] overflow-hidden">
                                        <img
                                            src={venue.image}
                                            alt={venue.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                        <div className="absolute bottom-4 left-4">
                                            <h3 className="text-white font-bold text-2xl">{venue.name}</h3>
                                            <p className="text-white/80 text-sm">{venue.openTime}</p>
                                        </div>
                                        <div className="absolute bottom-4 right-4">
                                            <div className="bg-cyan-600 text-white text-sm font-bold px-2 py-1 rounded">
                                                {venue.rating}
                                            </div>
                                        </div>
                                        <button className="absolute top-4 right-4 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
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
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-4 pb-2" style={{ width: 'max-content' }}>
                            {eventData.map((event) => (
                                <div key={event.id} className="flex-shrink-0 w-[222px]">
                                    <div className="bg-[#003c3d] rounded-t-[20px] rounded-b-[20px] overflow-hidden border border-[#0ed7e2]/30">
                                        <div className="relative">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-[180px] object-cover"
                                            />
                                            <div className="absolute top-0 right-0 bg-gradient-to-b from-black to-[#00c0ca] text-white text-xs font-bold px-2 py-3 rounded-bl-[28px] min-h-[45px] flex items-center">
                                                {event.date}
                                            </div>
                                            <button className="absolute top-4 right-4 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="p-4 space-y-2">
                                            <h3 className="text-white font-bold text-sm leading-tight">{event.title}</h3>
                                            <p className="text-white/70 text-xs">{event.venue}</p>
                                        </div>
                                        <div className="px-4 pb-4">
                                            <div className="bg-[#0d7377] text-white text-xs font-medium px-3 py-2 rounded-full text-center">
                                                {event.category}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-[#003c3d] rounded-t-[20px] rounded-b-[20px] p-6 space-y-6 shadow-lg">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-cyan-400 rounded-full"></div>
                            <h1 className="text-[#0b000f] text-2xl font-normal tracking-[0.28em]">CLUBWIZ</h1>
                        </div>
                        <p className="text-white text-sm leading-relaxed max-w-[300px] mx-auto">
                            Dive into the ultimate party scene discover lit club nights, epic events, and non-stop vibes all in one place!
                        </p>
                    </div>

                    <div className="flex justify-center gap-6">
                        <div className="w-6 h-6 bg-white/20 rounded"></div>
                        <div className="w-6 h-6 bg-white/20 rounded"></div>
                        <div className="w-6 h-6 bg-white/20 rounded"></div>
                        <div className="w-6 h-6 bg-white/20 rounded"></div>
                    </div>

                    <div className="bg-[#0d7377] rounded-lg p-4 space-y-3">
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
            </div>

            {/* Sidebar Menu */}
            <SidebarMenu isOpen={isSidebarOpen} onClose={handleSidebarClose} />
        </div>
    );
};

export default HomePage;
