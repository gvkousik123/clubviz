'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, User, SlidersHorizontal, MapPin, Loader2, X, Filter } from 'lucide-react';
import { SealPercent } from '@phosphor-icons/react';
import type { Club } from '@/components/clubs';
import { useToast } from '@/hooks/use-toast';
import { ClubCard } from '@/components/clubs/club-card';
import { ClubListCard } from '@/components/clubs/club-list-card';
import Sidebar from '@/components/common/sidebar';

import { PublicClubService } from '@/lib/services/public.service';
import { usePublicClubs } from '@/hooks/use-public-clubs';

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
    const { toast } = useToast() ;
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Sidebar state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Active filter tab state
    const [activeFilterTab, setActiveFilterTab] = useState<string>('all');

    // Filter states
    const [categories, setCategories] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [loadingFilters, setLoadingFilters] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    // Public clubs hook - uses only public APIs from API-DOCUMENTATION.json
    const publicClubs = usePublicClubs();

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

    const handleSearch = async () => {
        // Use public API for search
        loadClubs(true);
    };



    useEffect(() => {
        loadClubs();
        loadFavorites();
        loadFilterOptions();
    }, []);

    // Reload clubs when filters change
    useEffect(() => {
        if (selectedCategory || selectedLocation) {
            loadClubs(true);
        }
    }, [selectedCategory, selectedLocation]);

    const loadFilterOptions = async () => {
        setLoadingFilters(true);
        try {
            console.log('📥 Loading filter options...');
            const [categoriesData, locationsData] = await Promise.all([
                PublicClubService.getClubCategories(),
                PublicClubService.getClubLocations()
            ]);

            console.log('📊 Raw categories response:', categoriesData);
            console.log('📊 Raw locations response:', locationsData);

            // Handle both array and object responses
            const categoriesArray = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.content || []);
            const locationsArray = Array.isArray(locationsData) ? locationsData : (locationsData?.content || []);

            console.log('✅ Processed categories:', categoriesArray);
            console.log('✅ Processed locations:', locationsArray);

            // Filter out empty values and set state
            const filteredCategories = categoriesArray.filter((cat: any) => cat && (typeof cat === 'string' ? cat.trim() : cat));
            const filteredLocations = locationsArray.filter((loc: any) => loc && (typeof loc === 'string' ? loc.trim() : loc));

            console.log('✅ Filtered categories count:', filteredCategories.length);
            console.log('✅ Filtered locations count:', filteredLocations.length);

            setCategories(filteredCategories);
            setLocations(filteredLocations);
        } catch (error) {
            console.error('💥 Failed to load filter options:', error);
            setCategories([]);
            setLocations([]);
        } finally {
            setLoadingFilters(false);
        }
    };

    const loadClubs = async (resetPage = false) => {
        setLoading(true);
        try {
            const page = resetPage ? 0 : currentPage;

            const params: any = {
                page,
                size: 20,
                sortBy: 'createdAt',
                sortDirection: 'desc'
            };

            // Add filters if selected
            if (selectedCategory) {
                params.category = selectedCategory;
            }
            if (selectedLocation) {
                params.location = selectedLocation;
            }
            if (searchQuery.trim()) {
                params.query = searchQuery.trim();
            }

            if (resetPage) {
                setCurrentPage(0);
            }

            // ONLY use Public API - defined in API-DOCUMENTATION.json
            // Endpoint: GET /clubs/public/list
            console.log('🔍 Fetching clubs with params:', params);
            const response = await PublicClubService.getPublicClubsList(params);
            console.log('✅ Clubs API Response:', response);

            if (response && response.content && response.content.length > 0) {
                const apiClubs: Club[] = response.content.map((club: any, index: number) => ({
                    id: club.id,
                    name: club.name || '',
                    openTime: 'Hours not available',
                    rating: 4.0,
                    image: club.logo || getClubFallbackImage(index),
                    address: club.location || club.description || '',
                    category: club.category || 'Club'
                }));
                console.log('📊 Mapped clubs:', apiClubs.length, apiClubs);
                setClubs(apiClubs);
                setTotalPages(response.totalPages || 1);
                setHasMore(response.hasNext || false);
            } else {
                console.log('❌ No clubs available from API');
                setClubs([]);
                setTotalPages(1);
                setHasMore(false);
            }
        } catch (error: any) {
            console.error('💥 Error loading clubs:', error);
            setClubs([]);
            toast({
                title: 'Failed to load clubs',
                description: error.message || 'Could not fetch clubs. Please try again later.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
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

    const handleClubClick = (clubId: string) => {
        router.push(`/club/${clubId}`);
    };



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
                                disabled={loading || !searchQuery.trim()}
                                className="disabled:opacity-50 flex-shrink-0"
                            >
                                {loading ? (
                                    <Loader2 className="w-[21px] h-[21px] text-white animate-spin" />
                                ) : (
                                    <Search className="w-[21px] h-[21px] text-white" />
                                )}
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
                                disabled={loading}
                            />
                        </div>

                        {/* Hamburger Menu Button */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="w-10 h-10 bg-white/20 rounded-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center gap-[3px] hover:bg-white/30 transition-colors flex-shrink-0"
                        >
                            <div className="w-[15px] h-[2px] bg-white rounded-[2px]"></div>
                            <div className="w-[19px] h-[2px] bg-white rounded-[6px]"></div>
                            <div className="w-[15px] h-[2px] bg-white rounded-[2px]"></div>
                        </button>
                    </div>

                    {/* Filter Panel - Keeping for potential future use */}
                    {false && (
                        <div className="mt-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 space-y-3">
                            {/* Category Filter */}
                            <div>
                                <label className="text-white text-xs font-semibold mb-2 block">Category</label>
                                <div className="relative">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full bg-white/10 text-white rounded-lg px-3 py-2 text-sm outline-none border border-white/20 focus:border-[#14FFEC]"
                                        disabled={loadingFilters}
                                    >
                                        <option value="" className="bg-[#222831]">All Categories</option>
                                        {Array.isArray(categories) && categories.map((cat) => (
                                            <option key={cat} value={cat} className="bg-[#222831]">
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Location Filter */}
                            <div>
                                <label className="text-white text-xs font-semibold mb-2 block">Location</label>
                                <div className="relative">
                                    <select
                                        value={selectedLocation}
                                        onChange={(e) => setSelectedLocation(e.target.value)}
                                        className="w-full bg-white/10 text-white rounded-lg px-3 py-2 text-sm outline-none border border-white/20 focus:border-[#14FFEC]"
                                        disabled={loadingFilters}
                                    >
                                        <option value="" className="bg-[#222831]">All Locations</option>
                                        {Array.isArray(locations) && locations.map((loc) => (
                                            <option key={loc} value={loc} className="bg-[#222831]">
                                                {loc}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Clear Filters Button */}
                            {(selectedCategory || selectedLocation) && (
                                <button
                                    onClick={() => {
                                        console.log('🔄 Clearing filters and reloading clubs...');
                                        setSelectedCategory('');
                                        setSelectedLocation('');
                                        setCurrentPage(0);
                                    }}
                                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                                >
                                    <X size={16} />
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </header>

                {/* Main Content Container */}
                <div className="w-full flex flex-col items-center pt-[206px] relative">
                    {/* Filter Tabs Section */}
                    <div className="w-full max-w-[430px] bg-[#031313] pt-0 pb-[21px] relative z-0 pointer-events-auto">
                        <div className="flex items-center">
                            {/* Fixed Filters Tab */}
                            <div className="flex-shrink-0 pl-4">
                                <button
                                    onClick={() => {
                                        console.log('Filters tab clicked');
                                        setActiveFilterTab('filters');
                                    }}
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
                                        { id: 'today', label: 'Events Today' },
                                        { id: 'week', label: 'Events This Week' },
                                        { id: 'distance', label: 'Distance' },
                                        { id: 'visited', label: 'Previously Visited' },
                                        { id: 'popularity', label: 'Popularity' }
                                    ].map((tab, index, arr) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                console.log(`${tab.label} tab clicked`);
                                                setActiveFilterTab(tab.id);
                                            }}
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

                    {/* Content Section */}
                    <div className="w-full flex flex-col items-center space-y-6 px-0 relative z-10">
                    {/* Active Filters Display */}
                    {(selectedCategory || selectedLocation) && (
                        <div className="w-full max-w-[430px] px-5">
                            <div className="flex flex-wrap gap-2">
                                {selectedCategory && (
                                    <div className="bg-[#14FFEC]/20 border border-[#14FFEC] rounded-full px-3 py-1 flex items-center gap-2">
                                        <span className="text-[#14FFEC] text-xs font-semibold">
                                            {selectedCategory}
                                        </span>
                                        <button
                                            onClick={() => setSelectedCategory('')}
                                            className="text-[#14FFEC] hover:text-white"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                                {selectedLocation && (
                                    <div className="bg-[#14FFEC]/20 border border-[#14FFEC] rounded-full px-3 py-1 flex items-center gap-2">
                                        <span className="text-[#14FFEC] text-xs font-semibold">
                                            📍 {selectedLocation}
                                        </span>
                                        <button
                                            onClick={() => setSelectedLocation('')}
                                            className="text-[#14FFEC] hover:text-white"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* All Clubs Section */}
                    <section className="w-full max-w-[430px]">
                        <div className="flex items-center justify-between mb-4 px-4">
                            <h2 className="text-white text-sm font-semibold truncate">All Clubs</h2>
                        </div>
                        <div className="flex flex-col items-center gap-4 pb-6 px-4">
                            {loading ? (
                                <div className="flex items-center justify-center w-full py-8">
                                    <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
                                </div>
                            ) : clubs.length === 0 ? (
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-white/60 w-full">
                                    We couldn't find any clubs right now. Check back soon!
                                </div>
                            ) : (
                                clubs.map((club, index) => {
                                    const fallbackImage = getClubFallbackImage(index);
                                    return (
                                        <div
                                            key={club.id}
                                            className={`w-full ${index === 0 ? 'h-[247px]' : 'h-[214px]'} relative flex-shrink-0 cursor-pointer`}
                                            onClick={() => handleClubClick(club.id)}
                                        >
                                            {/* Main image container with rounded top */}
                                            <div className="w-full h-[169px] left-0 top-0 absolute flex-col justify-start items-start flex rounded-[15px] border-[#14FFEC] overflow-hidden">
                                                <img
                                                    src={fallbackImage}
                                                    alt={club.name}
                                                    className="w-full h-full object-cover absolute inset-0"
                                                />
                                                {/* White overlay effect */}
                                                <div className="w-full h-full absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                                                <div className="w-full h-[169px] px-4 pt-[17px] pb-[113px] left-0 top-0 absolute justify-end items-center inline-flex bg-gradient-to-b from-black via-black/50 to-black/0 rounded-[10px] overflow-hidden">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            toggleFavorite(club.id);
                                                        }}
                                                        className="w-[39px] self-stretch bg-neutral-300/10 rounded-[22px] backdrop-blur-[35px] justify-center items-center inline-flex overflow-hidden"
                                                    >
                                                        <svg className="w-5 h-5 text-[#14FFEC]" fill={favorites.includes(club.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Glassmorphism bottom section */}
                                            <div className="h-[85px] inset-x-2 top-[125px] absolute rounded-[15px] border border-white/25 bg-[rgba(9,32,39,0.78)] backdrop-blur-[30px] backdrop-saturate-150 z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.24),0_12px_26px_rgba(0,0,0,0.42)]"></div>
                                            <div className="h-[85px] inset-x-2 top-[125px] absolute rounded-[15px] bg-gradient-to-b from-white/[0.16] via-white/[0.06] to-black/25 z-[11] pointer-events-none"></div>

                                            {/* Rating badge */}
                                            <div className="w-[40px] h-[40px] right-[50px] top-[104px] absolute z-20 rounded-full bg-white/[0.02] backdrop-blur-[1px] p-[4px]">
                                                <div className="w-full h-full flex items-center justify-center bg-[#008378] rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                                                    <div className="text-white text-[13px] font-extrabold font-['Manrope'] leading-5 tracking-[0.01em]">
                                                        {club.rating}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Text content */}
                                            <div className="left-[32px] right-[86px] top-[142px] absolute z-20">
                                                <div className="w-full flex-col justify-center items-start gap-1 inline-flex">
                                                    <div className="self-stretch text-[#14FFEC] text-[15px] font-extrabold font-['Manrope'] leading-5 tracking-[0.02em] truncate overflow-hidden whitespace-nowrap">
                                                        {club.name}
                                                    </div>
                                                    <div className="self-stretch h-3.5 text-white text-xs font-semibold font-['Manrope'] leading-3.5 tracking-[0.01em] truncate overflow-hidden whitespace-nowrap">
                                                        {club.openTime}
                                                    </div>
                                                    {club.address && (
                                                        <div className="self-stretch text-[#C3C3C3] text-[10px] font-medium font-['Manrope'] leading-3 tracking-[0.1px] truncate overflow-hidden whitespace-nowrap">
                                                            {club.address}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {index === 0 && (
                                                <div className="absolute inset-x-[10px] top-[168px] h-[83px] bg-[#008378] rounded-[20px] z-0 shadow-[inset_0_20px_22px_rgba(0,0,0,0.52)]">
                                                    <div className="absolute inset-x-0 top-0 h-[76px] bg-gradient-to-b from-black/70 via-black/42 to-transparent rounded-t-[20px] pointer-events-none"></div>
                                                    <div className="absolute inset-x-0 bottom-0 h-[42px] flex items-center pl-[29px] pr-6">
                                                        <span className="font-normal text-[14px] leading-[21px] text-center text-white truncate">
                                                            Timeless Tuesdays Ft. DJ Xpensive
                                                        </span>
                                                        <span className="ml-3 inline-block h-2 w-2 rounded-full bg-red-500" aria-hidden="true"></span>
                                                    </div>
                                                </div>
                                            )}

                                            {index === 1 && (
                                                <>
                                                    <div className="absolute inset-x-[10px] top-[168px] h-[83px] bg-[#008378] rounded-[20px] z-[1] shadow-[inset_0_20px_22px_rgba(0,0,0,0.52)]">
                                                        <div className="absolute inset-x-0 top-0 h-[76px] bg-gradient-to-b from-black/70 via-black/42 to-transparent rounded-t-[20px] pointer-events-none"></div>
                                                        <div className="absolute inset-x-0 bottom-0 h-[42px] flex items-center pl-[29px] pr-6">
                                                            <span className="font-normal text-[14px] leading-[21px] text-center text-white truncate">
                                                                Typical Tuesdays Ft. DJ Xeroo
                                                            </span>
                                                            <span className="ml-3 inline-block h-2 w-2 rounded-full bg-red-500" aria-hidden="true"></span>
                                                        </div>
                                                    </div>

                                                    <div className="absolute inset-x-[10px] top-[213px] h-[83px] bg-[rgba(0,131,120,0.62)] rounded-[20px] overflow-hidden z-0 shadow-[inset_0_8px_10px_rgba(0,0,0,0.38)]">
                                                        <div className="absolute inset-x-0 bottom-0 h-[45px] flex items-center pl-[29px] pr-0 overflow-hidden">
                                                            <span className="font-extrabold text-[13px] leading-[16px] text-white truncate pr-16">Buy 1 get 1 on IFML Drinks</span>
                                                            <SealPercent
                                                                className="w-[86.73780059814453px] h-[86.49639892578125px] text-[#1b726b] shrink-0 absolute right-[-6px]"
                                                                weight="fill"
                                                            />
                                                        </div>
                                                        <div className="absolute inset-x-0 top-0 h-[62px] bg-gradient-to-b from-black/55 via-black/28 to-transparent rounded-t-[20px] pointer-events-none"></div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
        </div>
    );
}