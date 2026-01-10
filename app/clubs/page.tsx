'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, User, SlidersHorizontal, MapPin, Loader2 } from 'lucide-react';
import type { Club } from '@/components/clubs';
import { useToast } from '@/hooks/use-toast';
import { ClubCard } from '@/components/clubs/club-card';
import { ClubListCard } from '@/components/clubs/club-list-card';

import { useSearch } from '@/hooks/use-search';
import { useNearbyClubs } from '@/hooks/use-nearby-clubs';
import { ClubService } from '@/lib/services/club.service';
import { PublicClubService } from '@/lib/services/public.service';
import { isGuestMode } from '@/lib/api-client-public';

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

    // Search functionality
    const {
        isSearching,
        isLoadingNearby,
        clubs: searchClubs,
        nearbyResults,
        currentLocation,
        locationError,
        searchClubs: performClubSearch,
        searchNearby,
        getCurrentLocation,
        clearResults,
        clearError,
    } = useSearch();

    // Nearby clubs functionality
    const {
        clubs: nearbyClubs,
        loading: loadingNearbyClubs,
        error: nearbyClubsError,
        hasLocation,
        fetchNearbyClubs,
        clearClubs: clearNearbyClubs,
        clearError: clearNearbyError,
        refetchWithLocation
    } = useNearbyClubs();

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
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
            try {
                await performClubSearch(searchQuery.trim());
                // Update the local clubs state with search results
                if (searchClubs.length > 0) {
                    // Convert NearbyClub[] to Club[] format for compatibility
                    const convertedClubs: Club[] = searchClubs.map((club, index) => ({
                        id: club.id,
                        name: club.name,
                        openTime: 'Open until 1:30 am', // Default since API doesn't provide this
                        rating: club.rating || 4.0,
                        image: typeof club.images?.[0] === 'string'
                            ? club.images[0]
                            : club.images?.[0]?.url || club.logoUrl || getClubFallbackImage(index),
                        address: club.fullAddress || club.address || club.location,
                        category: club.type || 'Club'
                    }));
                    setClubs(convertedClubs);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Search failed:', error);
                toast({
                    title: 'Search Failed',
                    description: 'Unable to search clubs. Please try again.',
                    variant: 'destructive',
                });
            }
        }
    };

    const handleNearbySearch = async () => {
        if (!hasLocation) {
            toast({
                title: 'Location Required',
                description: 'Please enable location services or select a location to find nearby clubs.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setLoading(true);
            await fetchNearbyClubs();

            if (nearbyClubs && nearbyClubs.length > 0) {
                // Convert nearby clubs to Club[] format
                const convertedClubs: Club[] = nearbyClubs.map((club, index) => ({
                    id: club.id,
                    name: club.name,
                    openTime: 'Open until 1:30 am', // Default since API doesn't provide this
                    rating: 4.0, // Default rating
                    image: club.images?.[0]?.url || club.logoUrl || getClubFallbackImage(index),
                    address: club.locationText?.fullAddress || club.locationText?.address1 || 'Location not specified',
                    category: club.category || 'Club'
                }));
                setClubs(convertedClubs);
                setLoading(false);

                toast({
                    title: 'Nearby Clubs Found',
                    description: `Found ${convertedClubs.length} clubs near you.`,
                });
            }
        } catch (error) {
            console.error('Nearby search failed:', error);
            toast({
                title: 'Nearby Search Failed',
                description: 'Unable to find nearby clubs. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        loadClubs();
        loadFavorites();
    }, []);

    // Auto-fetch nearby clubs when location is available
    useEffect(() => {
        if (hasLocation && nearbyClubs.length === 0 && !loadingNearbyClubs) {
            fetchNearbyClubs();
        }
    }, [hasLocation, fetchNearbyClubs, nearbyClubs.length, loadingNearbyClubs]);

    // Update clubs when nearby clubs are fetched
    useEffect(() => {
        if (nearbyClubs.length > 0) {
            const convertedClubs: Club[] = nearbyClubs.map((club, index) => ({
                id: club.id,
                name: club.name,
                openTime: 'Open until 1:30 am',
                rating: 4.0,
                image: club.images?.[0]?.url || club.logoUrl || getClubFallbackImage(index),
                address: club.locationText?.fullAddress || club.locationText?.address1 || 'Location not specified',
                category: club.category || 'Club'
            }));
            setClubs(convertedClubs);
            setLoading(false);
        }
    }, [nearbyClubs]);

    const loadClubs = async () => {
        setLoading(true);
        try {
            const isGuest = isGuestMode();
            let response;

            if (isGuest) {
                // Use public club service for guests
                response = await PublicClubService.getPublicClubsList({
                    page: 0,
                    size: 20,
                    sortBy: 'name',
                    sortDirection: 'ASC'
                });
            } else {
                // Use regular club service for authenticated users
                response = await ClubService.getClubsList({
                    page: 0,
                    size: 20,
                    sortBy: 'name',
                    sortDirection: 'asc'
                });
            }

            if (response.success && response.data?.content && response.data.content.length > 0) {
                // Convert API response to Club[] format with proper text limits (no truncation)
                const apiClubs: Club[] = response.data.content.map((club: any, index: number) => ({
                    id: club.id,
                    name: club.name || '',
                    openTime: club.openTime || 'Hours not available', // Use API value if available
                    rating: club.rating || 4.0, // Use API rating if available, else default
                    image: getClubFallbackImage(index), // Always use static images
                    address: club.description || club.location || club.address || '',
                    category: club.category || 'Club'
                }));
                setClubs(apiClubs);
            } else if (response.success && (!response.data?.content || response.data.content.length === 0)) {
                // API success but no clubs - show empty state
                console.log('No clubs available from API');
                setClubs([]);
            } else {
                // API failed - show empty state
                console.log('Failed to load clubs from API');
                setClubs([]);
                if (response.message) {
                    console.warn('API returned message:', response.message);
                }
            }
        } catch (error: any) {
            console.error('Error loading clubs:', error);
            // Show empty state on error instead of dummy data
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
                                disabled={isSearching || !searchQuery.trim()}
                                className="disabled:opacity-50 flex-shrink-0"
                            >
                                {isSearching ? (
                                    <Loader2 className="w-[21px] h-[21px] text-white animate-spin" />
                                ) : (
                                    <Search className="w-[21px] h-[21px] text-white" />
                                )}
                            </button>
                            <input
                                type="text"
                                placeholder="Search clubs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                                className="flex-1 bg-transparent text-white text-base font-bold tracking-[0.5px] placeholder-white outline-none min-w-0"
                                disabled={isSearching}
                            />
                        </div>
                        <button
                            onClick={handleNearbySearch}
                            disabled={loadingNearbyClubs || loading}
                            className="w-10 h-10 bg-white/20 rounded-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center disabled:opacity-50 flex-shrink-0"
                            title="Find nearby clubs"
                        >
                            {loadingNearbyClubs || loading ? (
                                <Loader2 className="w-[21px] h-[21px] text-white animate-spin" />
                            ) : (
                                <MapPin className="w-[21px] h-[21px] text-white" />
                            )}
                        </button>
                        <div className="w-10 h-10 bg-white/20 rounded-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center flex-shrink-0">
                            <SlidersHorizontal className="w-[21px] h-[21px] text-white" />
                        </div>
                    </div>
                </header>

                {/* Location & Error Information */}
                {(currentLocation || locationError) && (
                    <div className="fixed top-[15vh] left-0 w-full max-w-[430px] mx-auto z-40 px-5">
                        {currentLocation && (
                            <div className="text-xs text-white/70 text-center mb-1">
                                📍 {currentLocation.label || currentLocation.city || `${currentLocation.latitude.toFixed(2)}, ${currentLocation.longitude.toFixed(2)}`}
                            </div>
                        )}
                        {locationError && (
                            <div className="text-xs text-yellow-300 text-center mb-1">
                                ⚠️ {locationError}
                            </div>
                        )}
                    </div>
                )}



                {/* Main Content */}
                <div className="w-full flex flex-col items-center space-y-6 pt-[18vh] px-0">
                    {/* All Clubs Section */}
                    <section className="w-full max-w-[430px]">
                        <div className="flex items-center justify-between mb-4 px-5">
                            <h2 className="text-white text-sm font-semibold truncate">All Clubs</h2>
                        </div>
                        <div className="flex flex-col gap-4 pb-6 px-5">
                            {loading ? (
                                <div className="flex items-center justify-center w-full py-8">
                                    <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
                                </div>
                            ) : clubs.length === 0 ? (
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-white/60 w-full mr-5">
                                    We couldn't find any clubs right now. Check back soon!
                                </div>
                            ) : (
                                clubs.map((club, index) => {
                                    const fallbackImage = getClubFallbackImage(index);
                                    return (
                                        <div key={club.id} className="w-[336px] h-[201px] relative flex-shrink-0 mr-1">
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