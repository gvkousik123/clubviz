'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, User, SlidersHorizontal, MapPin, Loader2, X, Filter, Heart } from 'lucide-react';
import type { Club } from '@/components/clubs';
import { useToast } from '@/hooks/use-toast';
import { ClubsListSkeleton } from '@/components/ui/skeleton-loaders';
import { LocationPickerModal } from '@/components/common/location-picker-modal';

import { PublicClubService } from '@/lib/services/public.service';
import { ClubService } from '@/lib/services/club.service';
import { SearchService } from '@/lib/services/search.service';
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
    const [currentSearchLocation, setCurrentSearchLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);

    // Filter states
    const [showFilters, setShowFilters] = useState(false);
    const [locations, setLocations] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [loadingFilters, setLoadingFilters] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(false);

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
        setLoading(true);
        try {
            // Get location from stored location or current search location
            const location = currentSearchLocation || getStoredLocation();
            
            if (!location || !location.lat || !location.lng) {
                setShowLocationPicker(true);
                setLoading(false);
                return;
            }

            // Use advanced search with all filters
            const searchParams = {
                query: searchQuery.trim() || undefined,
                latitude: location.lat,
                longitude: location.lng,
                radiusKm: 50,
                searchType: 'CLUBS_ONLY' as const,
                page: 0,
                size: 100,
                // Add filter parameters if selected
                ...(selectedLocation && { cuisines: [selectedLocation] })
            };

            const response = await SearchService.advancedSearch(searchParams);
            
            if (response && response.clubs && response.clubs.length > 0) {
                const searchedClubs: Club[] = response.clubs.map((club: any, index: number) => ({
                    id: club.id,
                    name: club.name || '',
                    openTime: 'Hours not available',
                    rating: club.rating || 4.0,
                    image: club.logoUrl || getClubFallbackImage(index),
                    address: club.address || '',
                    category: club.category || 'Club'
                }));
                
                setClubs(searchedClubs);
                toast({
                    title: 'Search complete',
                    description: `Found ${searchedClubs.length} clubs matching your criteria`,
                });
            } else {
                setClubs([]);
                toast({
                    title: 'No clubs found',
                    description: 'No clubs match your search criteria. Try adjusting your filters.',
                    variant: 'destructive',
                });
            }
        } catch (error: any) {
            console.error('💥 Search error:', error);
            toast({
                title: 'Search failed',
                description: error.message || 'Could not perform search. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLocationSelected = async (coords: { lat: number; lng: number }, locationName: string) => {
        setShowLocationPicker(false);
        setCurrentSearchLocation({
            lat: coords.lat,
            lng: coords.lng,
            name: locationName
        });
    };



    useEffect(() => {
        loadClubs();
        loadFavorites();
        loadFilterOptions();
    }, []);

    // Reload clubs when filters change
    useEffect(() => {
        if (selectedLocation) {
            loadClubs(true);
        }
    }, [selectedLocation]);

    const loadFilterOptions = async () => {
        setLoadingFilters(true);
        try {
            const locationsData = await PublicClubService.getClubLocations();

            // Handle both array and object responses
            const locationsArray = Array.isArray(locationsData) ? locationsData : ((locationsData as any)?.content || []);

            // Filter out empty values and convert to strings
            const filteredLocations = locationsArray
                .filter((loc: any) => loc)
                .map((loc: any) => typeof loc === 'string' ? loc : (loc?.name || loc?.label || String(loc)))
                .filter((loc: string) => loc && loc.trim());

            setLocations(filteredLocations);
        } catch (error) {
            console.error('💥 Failed to load filter options:', error);
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
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
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
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
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
                                disabled={loading}
                                className="disabled:opacity-50 flex-shrink-0"
                                title="Search nearby clubs"
                            >
                                {loading ? (
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
                                disabled={loading}
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`w-10 h-10 rounded-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center flex-shrink-0 transition-colors ${showFilters || selectedLocation
                                ? 'bg-[#14FFEC]'
                                : 'bg-white/20'
                                }`}
                            title="Filter clubs"
                        >
                            <SlidersHorizontal className={`w-[21px] h-[21px] ${showFilters || selectedLocation
                                ? 'text-black'
                                : 'text-white'
                                }`} />
                        </button>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 space-y-3">
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
                            {selectedLocation && (
                                <button
                                    onClick={() => {
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
                    {(selectedLocation || currentSearchLocation) && (
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
                        <div className="flex flex-col gap-4 pb-20 px-5">
                            {loading ? (
                                <ClubsListSkeleton count={6} />
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
                                            className="w-full h-[214px] relative flex-shrink-0 cursor-pointer"
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
                                                        <Heart className="w-5 h-5 text-[#14FFEC]" fill={favorites.includes(club.id) ? "currentColor" : "none"} />
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
                                                    <div className="self-stretch text-[#14FFEC] text-[24px] font-black font-['Manrope'] leading-[26px] tracking-[0.02em] truncate overflow-hidden whitespace-nowrap">
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