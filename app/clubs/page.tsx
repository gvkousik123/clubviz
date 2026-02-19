'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, User, SlidersHorizontal, MapPin, Loader2, X, Filter } from 'lucide-react';
import type { Club } from '@/components/clubs';
import { useToast } from '@/hooks/use-toast';
import { ClubCard } from '@/components/clubs/club-card';
import { ClubListCard } from '@/components/clubs/club-list-card';
import { ClubsListSkeleton } from '@/components/ui/skeleton-loaders';
import { LocationPickerModal } from '@/components/common/location-picker-modal';

import { PublicClubService } from '@/lib/services/public.service';
import { ClubService } from '@/lib/services/club.service';
import { SearchService, NearbySearchParamsV2, SearchClubV2 } from '@/lib/services/search.service';
import { usePublicClubs } from '@/hooks/use-public-clubs';
import { STORAGE_KEYS } from '@/lib/constants/storage';
import { getStoredLocation } from '@/lib/location';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [searchingNearby, setSearchingNearby] = useState(false);
    const [currentSearchLocation, setCurrentSearchLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);

    // Filter states
    const [showFilters, setShowFilters] = useState(false);
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
        // Check if we have user coordinates (from stored location or browser)
        const storedLocation = getStoredLocation();
        
        if (!storedLocation || !storedLocation.lat || !storedLocation.lng) {
            // No location available - show location picker
            setShowLocationPicker(true);
            return;
        }

        // We have coordinates - perform nearby search
        await performNearbySearch(storedLocation);
    };

    const performNearbySearch = async (location: { lat: number; lng: number; label?: string }) => {
        setSearchingNearby(true);
        try {
            const nearbyParams: NearbySearchParamsV2 = {
                lat: location.lat,
                lng: location.lng,
                page: 0,
                size: 20,
            };

            const response = await SearchService.nearbySearch(nearbyParams);
            
            if (response && response.clubs && response.clubs.length > 0) {
                const mappedClubs: Club[] = response.clubs.map((club: SearchClubV2, index: number) => ({
                    id: club.id,
                    name: club.name || '',
                    openTime: club.openingHours || 'Hours not available',
                    rating: club.rating || 0,
                    image: club.logoUrl || getClubFallbackImage(index),
                    address: club.address || '',
                    category: club.priceRange || 'Club'
                }));
                setClubs(mappedClubs);
                setTotalPages(response.totalPages || 1);
                setCurrentSearchLocation({
                    lat: location.lat,
                    lng: location.lng,
                    name: location.label || 'Selected Location'
                });
                
                toast({
                    title: 'Search complete',
                    description: `Found ${mappedClubs.length} clubs nearby`,
                });
            } else {
                setClubs([]);
                toast({
                    title: 'No clubs found',
                    description: 'No clubs found in this area. Try expanding your search radius.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('💥 Error performing nearby search:', error);
            toast({
                title: 'Search failed',
                description: 'Could not search nearby clubs. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setSearchingNearby(false);
        }
    };

    const handleLocationSelected = async (coords: { lat: number; lng: number }, locationName: string) => {
        setShowLocationPicker(false);
        setCurrentSearchLocation({
            lat: coords.lat,
            lng: coords.lng,
            name: locationName
        });
        await performNearbySearch(coords);
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
            const [categoriesData, locationsData] = await Promise.all([
                PublicClubService.getClubCategories(),
                PublicClubService.getClubLocations()
            ]);


            // Handle both array and object responses
            const categoriesArray = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.content || []);
            const locationsArray = Array.isArray(locationsData) ? locationsData : (locationsData?.content || []);


            // Filter out empty values and set state
            const filteredCategories = categoriesArray.filter((cat: any) => cat && (typeof cat === 'string' ? cat.trim() : cat));
            const filteredLocations = locationsArray.filter((loc: any) => loc && (typeof loc === 'string' ? loc.trim() : loc));

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
            const response = await PublicClubService.getPublicClubsList(params);

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
                setClubs(apiClubs);
                setTotalPages(response.totalPages || 1);
                setHasMore(response.hasNext || false);
            } else {
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

    const loadFavorites = async () => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.accessToken) : null;
            if (!token) return;

            const response: any = await ClubService.getUserFavoriteClubs({ page: 0, size: 100 });
            const favClubs = response?.clubs || response?.content || response?.data?.clubs || [];
            const favIds = favClubs.map((c: any) => c.id);
            setFavorites(favIds);
        } catch (error) {
            console.error('Error loading favorites:', error);
            // Fallback to localStorage
            try {
                const saved = localStorage.getItem('favoriteClubs');
                if (saved) {
                    setFavorites(JSON.parse(saved));
                }
            } catch {}
        }
    };

    const toggleFavorite = async (clubId: string) => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.accessToken) : null;
            if (!token) {
                toast({
                    title: 'Login Required',
                    description: 'Please login to add clubs to favorites.',
                    variant: 'destructive',
                });
                return;
            }

            const isFav = favorites.includes(clubId);
            if (isFav) {
                await ClubService.removeClubFromFavorites(clubId);
                setFavorites(prev => prev.filter(id => id !== clubId));
            } else {
                await ClubService.addClubToFavorites(clubId);
                setFavorites(prev => [...prev, clubId]);
            }

            toast({
                title: isFav ? 'Removed from favorites' : 'Added to favorites',
                description: isFav
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
            <LocationPickerModal
                isOpen={showLocationPicker}
                onClose={() => setShowLocationPicker(false)}
                onSelectLocation={handleLocationSelected}
            />
            <div className="relative mx-auto max-w-[430px]">
                {/* Fixed Header with Gradient Background */}
                <header className="fixed top-0 left-0 w-full max-w-[430px] mx-auto h-[16vh] bg-gradient-to-b from-[#222831] to-[#11B9AB] rounded-b-[30px] px-5 pb-6 pt-4 z-50 flex flex-col justify-between">
                    {/* Header with Back Arrow and Profile */}
                    <div className="flex items-center justify-between">
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

                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center gap-2 w-full">
                        <div className="flex-1 h-10 px-4 py-2 bg-white/20 rounded-[23px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center gap-2 min-w-0">
                            <button
                                onClick={handleSearch}
                                disabled={loading || searchingNearby || !searchQuery.trim()}
                                className="disabled:opacity-50 flex-shrink-0"
                                title="Search nearby clubs"
                            >
                                {loading || searchingNearby ? (
                                    <Loader2 className="w-[21px] h-[21px] text-white animate-spin" />
                                ) : (
                                    <MapPin className="w-[21px] h-[21px] text-[#14FFEC]" />
                                )}
                            </button>
                            <input
                                type="text"
                                placeholder="Search nearby..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                                className="flex-1 bg-transparent text-white text-base font-bold tracking-[0.5px] placeholder-white outline-none min-w-0"
                                disabled={loading || searchingNearby}
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`w-10 h-10 rounded-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center flex-shrink-0 transition-colors ${showFilters || selectedCategory || selectedLocation
                                ? 'bg-[#14FFEC]'
                                : 'bg-white/20'
                                }`}
                            title="Filter clubs"
                        >
                            <SlidersHorizontal className={`w-[21px] h-[21px] ${showFilters || selectedCategory || selectedLocation
                                ? 'text-black'
                                : 'text-white'
                                }`} />
                        </button>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
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



                {/* Main Content */}
                <div className="w-full flex flex-col items-center space-y-6 pt-[18vh] px-0">
                    {/* Active Filters Display */}
                    {(selectedCategory || selectedLocation || currentSearchLocation) && (
                        <div className="w-full max-w-[430px] px-5">
                            <div className="flex flex-wrap gap-2">
                                {currentSearchLocation && (
                                    <div className="bg-[#14FFEC]/20 border border-[#14FFEC] rounded-full px-3 py-1 flex items-center gap-2">
                                        <MapPin size={14} className="text-[#14FFEC] flex-shrink-0" />
                                        <span className="text-[#14FFEC] text-xs font-semibold">
                                            {currentSearchLocation.name}
                                        </span>
                                    </div>
                                )}
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
                        <div className="flex items-center justify-between mb-4 px-5">
                            <h2 className="text-white text-sm font-semibold truncate">All Clubs</h2>
                        </div>
                        <div className="flex flex-col gap-4 pb-6 px-5">
                            {loading ? (
                                <ClubsListSkeleton count={6} />
                            ) : clubs.length === 0 ? (
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-white/60 w-full mr-5">
                                    We couldn't find any clubs right now. Check back soon!
                                </div>
                            ) : (
                                clubs.map((club, index) => {
                                    const fallbackImage = getClubFallbackImage(index);
                                    return (
                                        <div
                                            key={club.id}
                                            className="w-[336px] h-[201px] relative flex-shrink-0 mr-1 cursor-pointer"
                                            onClick={() => handleClubClick(club.id)}
                                        >
                                            {/* Main image container with rounded top */}
                                            <div className="w-[336px] h-[169px] left-0 top-0 absolute flex-col justify-start items-start flex rounded-[15px] border-[#14FFEC] overflow-hidden">
                                                <img
                                                    src={fallbackImage}
                                                    alt={club.name}
                                                    className="w-full h-full object-cover absolute inset-0"
                                                />
                                                {/* White overlay effect */}
                                                <div className="w-full h-full absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                                                <div className="w-[336px] h-[169px] pl-[281px] pr-4 pt-[17px] pb-[113px] left-0 top-0 absolute justify-end items-center inline-flex bg-gradient-to-b from-black via-black/50 to-black/0 rounded-[10px] overflow-hidden">
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
                                            <div className="w-[320px] h-[85px] left-[8px] top-[125px] absolute bg-[rgba(212.01,212.01,212.01,0.10)] rounded-[15px] border backdrop-blur-[17.50px]"></div>

                                            {/* Rating badge */}
                                            <div className="w-[30px] h-[30px] pl-1 pr-[5px] py-[5px] left-[250px] top-[110px] absolute justify-center items-center inline-flex bg-[#008378] rounded-[17px] overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                                                <div className="text-white text-[13px] font-extrabold font-['Manrope'] leading-5 tracking-[0.01em]">
                                                    {club.rating}
                                                </div>
                                            </div>

                                            {/* Text content */}
                                            <div className="w-32 h-[42px] left-[33px] top-[147px] absolute justify-start items-center gap-[29px] inline-flex">
                                                <div className="w-52 flex-col justify-center items-start gap-1 inline-flex">
                                                    <div className="self-stretch h-4 text-[#14FFEC] text-base font-black font-['Manrope'] leading-4 tracking-[0.02em] truncate overflow-hidden whitespace-nowrap">
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
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>
                </div>
            </div>


        </div>
    );
}