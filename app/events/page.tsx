'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, User, Heart, Filter } from 'lucide-react';

type StaticEventCard = {
    id: string;
    title: string;
    location: string;
    startDateTime: string;
    genre: string;
    imageUrl: string;
};

const HOME_STYLE_EVENTS: StaticEventCard[] = [
    {
        id: 'event-1',
        title: 'Freaky Friday with DJ Alexxx',
        location: 'DABO, Airport Road',
        startDateTime: new Date('2025-04-04T19:30:00Z').toISOString(),
        genre: 'Techno & Bollytech',
        imageUrl: '/event list/Rectangle 1.jpg'
    },
    {
        id: 'event-2',
        title: 'Wow Wednesday with DJ Shade',
        location: 'DABO, Airport Road',
        startDateTime: new Date('2025-04-06T19:30:00Z').toISOString(),
        genre: 'Bollywood & Bollytech',
        imageUrl: '/event list/Rectangle 2.jpg'
    },
    {
        id: 'event-3',
        title: 'Saturday Night Fever',
        location: 'Garage Club',
        startDateTime: new Date('2025-04-08T20:00:00Z').toISOString(),
        genre: 'Deep house & Mellow Tech',
        imageUrl: '/event list/Rectangle 3.jpg'
    }
];

const isValidImageUrl = (url?: string) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
};

export default function EventsListPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilterTab, setActiveFilterTab] = useState<string>('filters');

    const handleGoBack = () => {
        router.back();
    };

    const handleSearch = () => { };

    const eventsToday = useMemo(() => HOME_STYLE_EVENTS, []);
    const eventsThisWeek = useMemo(() => HOME_STYLE_EVENTS, []);
    const allEvents = useMemo(() => HOME_STYLE_EVENTS, []);

    return (
        <div className="min-h-screen bg-[#031313] text-white">
            <div className="relative mx-auto max-w-[430px]">
                {/* Fixed Header with Gradient Background */}
                <header className="fixed top-0 left-0 w-full max-w-[430px] mx-auto h-[185px] bg-gradient-to-b from-[#222831] to-[#11b9ab] rounded-br-[30px] rounded-bl-[30px] border z-50 flex flex-col overflow-hidden">
                    {/* Top Section - Back Button and User Icon */}
                    <div className="flex items-start justify-between pt-[61px] pl-4 pr-4">
                        {/* Back Button */}
                        <button
                            onClick={handleGoBack}
                            className="w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <svg
                                className="w-2 h-4"
                                viewBox="0 0 8 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M7 1L1 8L7 15"
                                    stroke="#FFFFFF"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        {/* User Icon */}
                        <Link
                            href="/account"
                            className="w-10 h-10 bg-white/20 rounded-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <User className="w-5 h-5 text-white" />
                        </Link>
                    </div>

                    {/* Search Bar Section */}
                    <div className="flex items-center gap-[13px] pl-4 pr-4 pt-[13px] pb-[89px]">
                        <div className="flex-1 h-10 px-4 py-2 bg-white/20 rounded-[23px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center gap-2 min-w-0">
                            <button
                                onClick={handleSearch}
                                disabled={!searchQuery.trim()}
                                className="disabled:opacity-50 flex-shrink-0"
                            >
                                <Search className="w-[21px] h-[21px] text-white" />
                            </button>
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                                className="flex-1 bg-transparent text-white text-base font-bold tracking-[0.5px] placeholder-white/70 outline-none min-w-0"
                            />
                        </div>

                        {/* Hamburger Menu Button */}
                        <button
                            className="w-10 h-10 bg-white/20 rounded-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center gap-[3px] hover:bg-white/30 transition-colors flex-shrink-0"
                        >
                            <div className="w-[15px] h-[2px] bg-white rounded-[2px]"></div>
                            <div className="w-[19px] h-[2px] bg-white rounded-[6px]"></div>
                            <div className="w-[15px] h-[2px] bg-white rounded-[2px]"></div>
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <div className="w-full flex flex-col items-center pt-[206px] relative">
                    {/* Filter Tabs Section */}
                    <div className="w-full max-w-[430px] bg-[#031313] pt-0 pb-[21px] relative z-0 pointer-events-auto">
                        <div className="flex items-center">
                            {/* Fixed Filters Tab */}
                            <div className="flex-shrink-0 pl-4">
                                <button
                                    onClick={() => setActiveFilterTab('filters')}
                                    className={`w-[99px] h-10 flex justify-center items-center gap-2 px-3.5 py-2 rounded-[23px] border border-solid border-[#14ffec] transition-colors ${
                                        activeFilterTab === 'filters' ? 'bg-[#14ffec]' : 'bg-[#004342]'
                                    }`}
                                >
                                    <Filter className={`w-4 h-4 ${
                                        activeFilterTab === 'filters' ? 'text-[#031313]' : 'text-white'
                                    }`} />
                                    <span className={`font-extrabold text-[14px] leading-[16px] whitespace-nowrap ${
                                        activeFilterTab === 'filters' ? 'text-[#031313]' : 'text-white'
                                    }`}>
                                        Filters
                                    </span>
                                </button>
                            </div>

                            {/* Scrollable Tabs Container */}
                            <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hide">
                                <div className="flex items-center gap-[10px] pl-4 pr-4">
                                    {[
                                        { id: 'distance', label: 'Distance' },
                                        { id: 'visited', label: 'Previously visited' },
                                        { id: 'popularity', label: 'Popularity' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveFilterTab(tab.id)}
                                            className={`flex-shrink-0 h-10 flex justify-center items-center gap-2 px-3.5 py-2 rounded-[23px] border border-solid border-[#14ffec] transition-colors ${
                                                activeFilterTab === tab.id ? 'bg-[#14ffec]' : 'bg-[#004342]'
                                            }`}
                                        >
                                            <span className={`font-extrabold text-[14px] leading-[16px] whitespace-nowrap ${
                                                activeFilterTab === tab.id ? 'text-[#031313]' : 'text-white'
                                            }`}>
                                                {tab.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col items-center space-y-6 px-0 relative z-10 pb-8">
                        {[
                            { title: 'Events Today', data: eventsToday },
                            { title: 'Events This Week', data: eventsThisWeek },
                            { title: 'All Events', data: allEvents }
                        ].map((section) => (
                            <section key={section.title} className="w-full max-w-[430px]">
                                <div className="px-5 mb-3">
                                       <h2
                                           className="font-semibold"
                                           style={{
                                               fontFamily: 'Manrope',
                                               fontWeight: 600,
                                               fontSize: '16px',
                                               letterSpacing: '0.5px',
                                               lineHeight: '16px',
                                               color: '#fffeff'
                                           }}
                                       >
                                        {section.title}
                                    </h2>
                                </div>

                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide pl-5 pr-5">
                                    {section.data.map((event) => {
                                        const eventDate = new Date(event.startDateTime);
                                        const monthShort = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                                        const day = eventDate.getDate().toString().padStart(2, '0');
                                        const fallbackImage = '/event list/Rectangle 1.jpg';

                                        return (
                                            <Link key={event.id} href={`/event/${event.id}`}>
                                                <div className="w-[222px] h-[305px] flex-shrink-0 relative rounded-[20px] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity" style={{ background: 'radial-gradient(ellipse 79.96% 39.73% at 22.30% 70.24%, black 0%, #014A4B 100%)' }}>
                                                    <div className="relative">
                                                        <div
                                                            className="absolute inset-0 w-full h-[180px]"
                                                            style={{
                                                                backgroundImage: isValidImageUrl(event.imageUrl) ? `url(${event.imageUrl})` : `url(${fallbackImage})`,
                                                                backgroundSize: 'cover',
                                                                backgroundPosition: 'center',
                                                                filter: 'blur(8px)',
                                                                opacity: '0.85',
                                                                borderTopLeftRadius: '20px',
                                                                borderTopRightRadius: '20px',
                                                                borderBottomLeftRadius: '20px'
                                                            }}
                                                        />
                                                        <img
                                                            src={isValidImageUrl(event.imageUrl) ? event.imageUrl : fallbackImage}
                                                            alt={event.title}
                                                            className="relative w-full h-[180px] object-cover"
                                                            style={{
                                                                borderWidth: '1.5px',
                                                                borderStyle: 'solid',
                                                                borderColor: '#28D2DB',
                                                                borderBottomRightRadius: '0',
                                                                borderTopLeftRadius: '20px',
                                                                borderTopRightRadius: '20px',
                                                                borderBottomLeftRadius: '20px'
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="absolute right-4 top-0 w-[36px] h-[45px] px-[2px] py-[10px] bg-gradient-to-b from-black to-[#00C0CA] rounded-b-[28px] border-l border-r border-[#00C0CA] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center" style={{ borderBottom: 'none' }}>
                                                        <div className="w-[31px] text-center text-white text-[14px] font-semibold font-['Manrope'] leading-4">{monthShort}<br />{day}</div>
                                                    </div>

                                                    <div className="absolute left-[18px] right-[60px] top-[192px] h-[68px] w-36 flex flex-col gap-[3px]">
                                                        <span
                                                            className="line-clamp-2"
                                                            style={{
                                                                fontFamily: 'Anton, Anton SC, sans-serif',
                                                                fontWeight: 400,
                                                                fontSize: '24px',
                                                                letterSpacing: '0.0625em',
                                                                lineHeight: '32px',
                                                                textAlign: 'center',
                                                                color: '#ffffff'
                                                            }}
                                                        >
                                                            {event.title}
                                                        </span>
                                                        <span className="font-bold text-[12px] leading-[17px] text-[#c3c3c3] line-clamp-1">
                                                            {event.location}
                                                        </span>
                                                    </div>

                                                    <button className="absolute top-[226px] right-[18px] flex justify-center items-center" type="button" aria-label="Bookmark event">
                                                        <Heart className="w-[27px] h-[23px] text-[#14FFEC]" />
                                                    </button>

                                                    <div className="absolute bottom-0 left-0 w-[222px] h-[34px] rounded-br-[20px] rounded-bl-[20px] border-t border-solid border-[#005F57] bg-[#005F57] flex items-center justify-center">
                                                        <span className="font-bold text-[14px] leading-[17px] text-white truncate px-2">
                                                            {event.genre}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
