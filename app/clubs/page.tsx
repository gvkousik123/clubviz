'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, User, SlidersHorizontal } from 'lucide-react';
import type { Club } from '@/components/clubs';
import { useToast } from '@/hooks/use-toast';
import { ClubCard } from '@/components/clubs/club-card';
import { ClubListCard } from '@/components/clubs/club-list-card';
import FilterPopup from '@/components/common/filter-popup';
import { CLUB_FILTER_SECTIONS } from '@/lib/filter-config';

// Dummy clubs data for local development
const DUMMY_CLUBS: Club[] = [
    {
        id: 'club-1',
        name: 'DABO',
        openTime: 'Open until 1:30 am',
        rating: 4.2,
        image: '/venue/Screenshot 2024-12-10 195651.png',
        address: '6, New Manish Nagar, Somalwada',
        category: 'Nightclub'
    },
    {
        id: 'club-2',
        name: 'LORD OF THE DRINKS',
        openTime: 'Open until 1:30 am',
        rating: 4.2,
        image: '/venue/Screenshot 2024-12-10 195852.png',
        address: 'Ground Floor, Poonam mall VIP road',
        category: 'Bar & Lounge'
    },
    {
        id: 'club-3',
        name: 'CAFE BARREL',
        openTime: 'Open until 1:30 am',
        rating: 4.2,
        image: '/venue/Screenshot 2024-12-10 200154.png',
        address: 'Mangalam complex, Dharampeth Nagpur',
        category: 'Cafe & Bar'
    },
    {
        id: 'club-4',
        name: 'GARAGE',
        openTime: 'Open until 2:00 am',
        rating: 4.5,
        image: '/venue/Screenshot 2024-12-10 195651.png',
        address: 'Central Avenue, Nagpur',
        category: 'Dance Club'
    },
    {
        id: 'club-5',
        name: 'ESCAPE',
        openTime: 'Open until 12:30 am',
        rating: 4.3,
        image: '/venue/Screenshot 2024-12-10 195852.png',
        address: 'Sitabuldi, Nagpur',
        category: 'Lounge'
    }
];

export default function ClubsListPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>('clubs-today');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});

    // Club images for fallbacks
    const clubImages = [
        '/venue/Screenshot 2024-12-10 195651.png',
        '/venue/Screenshot 2024-12-10 195852.png',
        '/venue/Screenshot 2024-12-10 200154.png'
    ];

    const getClubFallbackImage = (index: number) => {
        return clubImages[index % clubImages.length];
    };

    const handleGoBack = () => {
        router.back();
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
        }
    };

    const handleFilterChange = (filter: string) => {
        if (filter === 'filter') {
            setIsFilterOpen(true);
        } else {
            setActiveFilter(filter);
            console.log('Filter changed to:', filter);
        }
    };

    const handleFilterApply = (filters: Record<string, any>) => {
        setAppliedFilters(filters);
        console.log('Applied filters:', filters);
        // Here you would apply the filters to your clubs data
        // For now, we'll just log them
    };

    const handleFilterClose = () => {
        setIsFilterOpen(false);
    };

    useEffect(() => {
        loadClubs();
        loadFavorites();
    }, []);

    const loadClubs = () => {
        setLoading(true);
        // Simulate a short delay to preserve loading UI
        setTimeout(() => {
            setClubs(DUMMY_CLUBS);
            setLoading(false);
        }, 250);
    };

    const loadFavorites = () => {
        try {
            const saved = localStorage.getItem('favoriteClubs');
            if (saved) {
                setFavorites(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    };

    const toggleFavorite = (clubId: string) => {
        try {
            const newFavorites = favorites.includes(clubId)
                ? favorites.filter(id => id !== clubId)
                : [...favorites, clubId];

            setFavorites(newFavorites);
            localStorage.setItem('favoriteClubs', JSON.stringify(newFavorites));

            toast({
                title: favorites.includes(clubId) ? 'Removed from favorites' : 'Added to favorites',
                description: favorites.includes(clubId)
                    ? 'Club removed from your favorites'
                    : 'Club added to your favorites',
            });
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast({
                title: 'Error',
                description: 'Failed to update favorites',
                variant: 'destructive',
            });
        }
    };

    const clubsTodayList = clubs.slice(0, 3);
    const clubsNearbyList = clubs.slice(1, 4);

    // Filter clubs based on active filter
    const getFilteredClubs = () => {
        switch (activeFilter) {
            case 'clubs-today':
                return clubsTodayList;
            case 'clubs-nearby':
                return clubsNearbyList;
            case 'distance':
                return clubs;
            case 'previously-visited':
                return clubs;
            case 'popularity':
                return clubs;
            default:
                return clubs;
        }
    };

    const filteredClubs = getFilteredClubs();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1e2328] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto"></div>
                    <p className="mt-4 text-lg">Loading clubs...</p>
                </div>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-[#031313] text-white">
            <div className="relative mx-auto max-w-[430px]">
                {/* Header with Gradient Background - Same as Events Page */}
                <header className="relative bg-gradient-to-b from-[#222831] to-[#11B9AB] rounded-b-[30px] px-5 pb-6 pt-12 z-50">
                    {/* Header with Back Arrow and Profile */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleGoBack}
                                className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                            >
                                <ArrowLeft size={24} className="text-white" />
                            </button>
                            <h1 className="text-white text-base font-bold tracking-wide">
                                ALL CLUBS
                            </h1>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-10 px-4 py-2 bg-white/20 rounded-[23px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center gap-2">
                            <Search className="w-[21px] h-[21px] text-white" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent text-white text-base font-bold tracking-[0.5px] placeholder-white outline-none"
                            />
                        </div>
                        <div className="w-10 h-10 bg-white/20 rounded-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center">
                            <SlidersHorizontal className="w-[21px] h-[21px] text-white" />
                        </div>
                    </div>
                </header>

                {/* Filter Section */}
                <div className="w-full">
                    <div className="w-full py-5 flex items-center bg-gradient-to-b from-[#021313] to-transparent">
                        {/* Filter Button - fixed at left */}
                        <div className="flex-shrink-0 pl-5 pr-3">
                            <button
                                onClick={() => handleFilterChange('filter')}
                                className="flex items-center gap-[10px] bg-[#004342] rounded-[23px] border border-[#14FFEC] px-4 py-2 hover:bg-[#005F57] transition-colors"
                                style={{ width: 'auto', height: '40px', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}
                                data-filter="close"
                            >
                                {/* Filter SVG icon */}
                                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.5 4H16.5M0.5 12H10.5" stroke="white" strokeLinecap="round" />
                                    <path d="M0.5 4C0.5 5.65685 1.84315 7 3.5 7C5.15685 7 6.5 5.65685 6.5 4C6.5 2.34315 5.15685 1 3.5 1C1.84315 1 0.5 2.34315 0.5 4Z" stroke="white" strokeLinecap="round" />
                                    <path d="M10.5 12C10.5 13.6569 11.8431 15 13.5 15C15.1569 15 16.5 13.6569 16.5 12C16.5 10.3431 15.1569 9 13.5 9C11.8431 9 10.5 10.3431 10.5 12Z" stroke="white" strokeLinecap="round" />
                                </svg>
                                <span style={{ color: 'white', fontSize: '14px', fontFamily: 'Manrope', fontWeight: 800, lineHeight: '16px', letterSpacing: '0.5px' }}>Filter</span>
                            </button>
                        </div>
                        {/* Scrollable Filter Options - scroll left, fill remaining width */}
                        <div className="flex-1 overflow-x-auto scrollbar-hide pr-5">
                            <div className="flex items-center gap-2 min-w-max">
                                <button
                                    onClick={() => handleFilterChange('clubs-today')}
                                    className={`h-10 px-4 py-2 rounded-[25px] border flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors ${activeFilter === 'clubs-today'
                                        ? 'bg-[#14FFEC] border-[#004342] text-black font-bold'
                                        : 'bg-[#005F57] border-[#14FFEC] text-white font-bold hover:bg-[#007A6B]'
                                        }`}
                                >
                                    <div className="text-sm tracking-[0.5px]">Clubs Today</div>
                                </button>
                                <button
                                    onClick={() => handleFilterChange('clubs-nearby')}
                                    className={`h-10 px-4 py-2 rounded-[25px] border flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors ${activeFilter === 'clubs-nearby'
                                        ? 'bg-[#14FFEC] border-[#004342] text-black font-bold'
                                        : 'bg-[#004342] border-[#14FFEC] text-white font-bold hover:bg-[#005F57]'
                                        }`}
                                >
                                    <div className="text-sm tracking-[0.5px]">Clubs Nearby</div>
                                </button>
                                <button
                                    onClick={() => handleFilterChange('distance')}
                                    className={`h-10 px-4 py-2 rounded-[25px] border flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors ${activeFilter === 'distance'
                                        ? 'bg-[#14FFEC] border-[#004342] text-black font-bold'
                                        : 'bg-[#004342] border-[#14FFEC] text-white font-bold hover:bg-[#005F57]'
                                        }`}
                                >
                                    <div className="text-sm tracking-[0.5px]">Distance</div>
                                </button>
                                <button
                                    onClick={() => handleFilterChange('previously-visited')}
                                    className={`h-10 px-4 py-2 rounded-[25px] border flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors ${activeFilter === 'previously-visited'
                                        ? 'bg-[#14FFEC] border-[#004342] text-black font-bold'
                                        : 'bg-[#004342] border-[#14FFEC] text-white font-bold hover:bg-[#005F57]'
                                        }`}
                                >
                                    <div className="text-sm tracking-[0.5px]">Previously Visited</div>
                                </button>
                                <button
                                    onClick={() => handleFilterChange('popularity')}
                                    className={`h-10 px-4 py-2 rounded-[25px] border flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors ${activeFilter === 'popularity'
                                        ? 'bg-[#14FFEC] border-[#004342] text-black font-bold'
                                        : 'bg-[#004342] border-[#14FFEC] text-white font-bold hover:bg-[#005F57]'
                                        }`}
                                >
                                    <div className="text-sm tracking-[0.5px]">Popularity</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full px-5 space-y-6">
                    {/* Clubs Nearby Section */}
                    <section className="w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white text-sm font-semibold truncate">Clubs nearby</h2>
                            <Link href="/clubs" className="text-[#14FFEC] text-sm font-medium whitespace-nowrap">View All</Link>
                        </div>
                        <div className="w-full flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {clubsNearbyList.length === 0 ? (
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-white/60 w-full">
                                    No clubs found nearby.
                                </div>
                            ) : (
                                clubsNearbyList.map((club, index) => (
                                    <ClubListCard
                                        key={`nearby-${club.id ?? index}`}
                                        club={club}
                                        href={`/club/${club.name.toLowerCase().replace(/\s+/g, '-')}`}
                                        fallbackImage={getClubFallbackImage(index + 10)}
                                        isFavorite={favorites.includes(club.id)}
                                        onToggleFavorite={toggleFavorite}
                                    />
                                ))
                            )}
                        </div>
                    </section>

                    {/* All Clubs Section */}
                    <section className="w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white text-sm font-semibold truncate">All Clubs</h2>
                        </div>
                        <div className="w-full flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                            {clubs.length === 0 ? (
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-white/60 w-full">
                                    We couldn't find any clubs right now. Check back soon!
                                </div>
                            ) : (
                                <div className="space-y-5 pb-6 w-full">
                                    {clubs.map((club, index) => (
                                        <ClubCard
                                            key={`all-${club.id ?? index}`}
                                            club={club}
                                            href={`/club/${club.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            fallbackImage={getClubFallbackImage(index)}
                                            isFavorite={favorites.includes(club.id)}
                                            onToggleFavorite={toggleFavorite}
                                            className="w-full"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {/* Filter Popup */}
            <FilterPopup
                isOpen={isFilterOpen}
                onClose={handleFilterClose}
                onApply={handleFilterApply}
                sections={CLUB_FILTER_SECTIONS}
            />
        </div>
    );
}