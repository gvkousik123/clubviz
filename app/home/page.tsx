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
    Bookmark,
    Loader2,
    X
} from 'lucide-react';
import Sidebar from '@/components/common/sidebar';
import { useSearch } from '@/hooks/use-search';
import { PublicClubService, PublicEventService } from '@/lib/services/public.service';
import { isGuestMode } from '@/lib/api-client-public';
import { LocationSuggestionList } from '@/components/common/location-suggestion-list';
import { NearbyDetailCard } from '@/components/common/nearby-detail-card';
import { POPULAR_LOCATIONS, selectLocationFromOption, persistCustomLocation } from '@/lib/location';
import type { NearbyResultSummary } from '@/hooks/use-search';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/use-profile';
import { AutocompleteSuggestion } from '@/lib/services/search.service';
import { STORAGE_KEYS } from '@/lib/constants/storage';
import { useStories } from '@/hooks/use-stories';
import { StoriesSection } from '@/components/story';
import { ClubCard } from '@/components/clubs/club-card';

// Dummy data
const heroSlides = [
    { id: 1, image: '/venue/Screenshot 2024-12-10 195651.png', musicBy: 'DJ ALEXXX', hostedBy: 'DABO CLUB', sponsor: 'SPONSERED', bookingLink: '/booking/slot' },
    { id: 2, image: '/venue/Screenshot 2024-12-10 195852.png', musicBy: 'DJ SHADE', hostedBy: 'GARAGE CLUB', sponsor: 'TRENDING', bookingLink: '/booking/slot' },
    { id: 3, image: '/venue/Screenshot 2024-12-10 200154.png', musicBy: 'DJ VIBE', hostedBy: 'ELITE CLUB', sponsor: 'FEATURED', bookingLink: '/booking/slot' },
    { id: 4, image: '/venue/Screenshot 2024-12-10 195651.png', musicBy: 'DJ MARCO', hostedBy: 'ELITE LOUNGE', sponsor: 'POPULAR', bookingLink: '/booking/slot' },
    { id: 5, image: '/venue/Screenshot 2024-12-10 195852.png', musicBy: 'DJ GROOVE', hostedBy: 'RHYTHM CLUB', sponsor: 'HOT', bookingLink: '/booking/slot' },
];

const vibeMeterFallback = [
    { id: 'vibe1', name: 'Sarah', image: '/story/story1.png' },
    { id: 'vibe2', name: 'Michael', image: '/story/Story2.png' },
    { id: 'vibe3', name: 'Jessica', image: '/story/story3.png' },
    { id: 'vibe4', name: 'Alex', image: '/story/story1.png' },
    { id: 'vibe5', name: 'Emma', image: '/story/Story2.png' },
    { id: 'vibe6', name: 'Jason', image: '/story/story3.png' },
    { id: 'vibe7', name: 'Olivia', image: '/story/story1.png' },
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
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [dragThreshold] = useState(50);

    const router = useRouter();

    // Token guard: Check if user is authenticated
    useEffect(() => {
        const token = localStorage.getItem(STORAGE_KEYS.accessToken);
        if (!token) {
            // No token found, redirect to mobile login
            router.replace('/auth/mobile');
        }
    }, [router]);

    // API data state - Using public API responses directly
    const [venues, setVenues] = useState<any[]>([]);
    const [allClubs, setAllClubs] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [isLoadingVenues, setIsLoadingVenues] = useState(false);
    const [isLoadingAllClubs, setIsLoadingAllClubs] = useState(false);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);

    // TODO: Re-enable stories API when ready
    // const { stories, fetchStories, loading: storiesLoading } = useStories();
    const stories = [];
    const storiesLoading = false;

    const { toast } = useToast();

    // Profile data
    const {
        profile,
        currentUser,
        isProfileLoading,
        loadProfile
    } = useProfile();    // Search functionality
    const {
        isSearching,
        isLoadingNearby,
        events: searchEvents,
        clubs: searchClubs,
        balancedResults,
        nearbyResults,
        nearbyDetails,
        currentLocation,
        locationError,
        universalSearch,
        searchNearby,
        fetchNearbyDetails,
        clearResults,
        clearError,
        refreshLocation,
        isLoadingNearbyDetails,
        error: searchError,
        getAutocompleteSuggestions,
        autocompleteSuggestions,
    } = useSearch();

    const [isLocationDropdownOpen, setLocationDropdownOpen] = useState(false);
    const [locationConfirmed, setLocationConfirmed] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const locationButtonRef = useRef<HTMLButtonElement | null>(null);
    const locationDropdownRef = useRef<HTMLDivElement | null>(null);

    const [showingSearchResults, setShowingSearchResults] = useState(false);
    const [isNearbyDropdownOpen, setNearbyDropdownOpen] = useState(false);
    const searchInputWrapperRef = useRef<HTMLDivElement | null>(null);
    const searchDropdownRef = useRef<HTMLDivElement | null>(null);
    const prefetchedCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

    const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(null);
    const [suggestionLoadingId, setSuggestionLoadingId] = useState<string | null>(null);

    // Hydrate location confirmation from currentLocation when it changes
    useEffect(() => {
        setLocationConfirmed(currentLocation?.source !== 'default' ? true : false);
        setIsHydrated(true);
    }, [currentLocation]);

    useEffect(() => {
        if (!isLocationDropdownOpen) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (
                locationDropdownRef.current?.contains(event.target as Node) ||
                locationButtonRef.current?.contains(event.target as Node)
            ) {
                return;
            }
            setLocationDropdownOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isLocationDropdownOpen]);

    // TODO: Re-enable autocomplete suggestions API when ready
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         if (searchQuery.length >= 2) {
    //             getAutocompleteSuggestions(searchQuery);
    //         }
    //     }, 300);
    //     return () => clearTimeout(timer);
    // }, [searchQuery, getAutocompleteSuggestions]);

    useEffect(() => {
        if (!isNearbyDropdownOpen) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchDropdownRef.current?.contains(event.target as Node) ||
                searchInputWrapperRef.current?.contains(event.target as Node)
            ) {
                return;
            }
            setNearbyDropdownOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isNearbyDropdownOpen]);

    useEffect(() => {
        if (!currentLocation) {
            return;
        }

        const { lat, lng } = currentLocation;
        if (
            prefetchedCoordsRef.current?.lat === lat &&
            prefetchedCoordsRef.current?.lng === lng
        ) {
            return;
        }

        prefetchedCoordsRef.current = { lat, lng };
        // TODO: Re-enable nearby search preload when ready
        // (async () => {
        //     try {
        //         await searchNearby({
        //             lat,
        //             lng,
        //             radius: 5000,
        //         });
        //     } catch (error) {
        //         console.error('Failed to preload nearby suggestions:', error);
        //     }
        // })();
    }, [currentLocation, searchNearby]);

    const activePresetId = useMemo(() => {
        if (!currentLocation) {
            return null;
        }
        const match = POPULAR_LOCATIONS.find(
            (location) => location.lat === currentLocation.lat && location.lng === currentLocation.lng
        );
        return match?.id ?? null;
    }, [currentLocation]);

    const locationLabel = isHydrated
        ? (locationConfirmed
            ? (currentLocation?.label || currentLocation?.name || 'Selected Location')
            : 'Select location')
        : 'Select location';

    const handleLocationButtonClick = () => {
        setLocationDropdownOpen((prev) => !prev);
    };

    const handleLocationPresetSelect = async (presetId: string) => {
        selectLocationFromOption(presetId);
        try {
            await refreshLocation();
        } finally {
            setLocationDropdownOpen(false);
        }
    };

    // Helper function to map club data from API response
    const mapClubData = (club: any, index: number) => ({
        id: club.id || '',
        name: club.name ? (club.name.length > 20 ? club.name.substring(0, 20) + '...' : club.name) : '',
        description: club.description ? (club.description.length > 50 ? club.description.substring(0, 50) + '...' : club.description) : '',
        location: club.location ? (club.location.length > 30 ? club.location.substring(0, 30) + '...' : club.location) : '',
        imageUrl: club.logo || venueFallback[index % venueFallback.length]?.image || '/dabo ambience main dabo page/Rectangle 5.jpg',
        isActive: club.isActive !== undefined ? club.isActive : true,
        logo: club.logo || '',
        category: club.category || 'NIGHTCLUB',
        memberCount: club.memberCount || 0,
        maxMembers: club.maxMembers || 200,
        isJoined: club.isJoined || false,
        isFull: club.isFull || false,
        ownerName: club.ownerName || '',
        createdAt: club.createdAt || '',
        capacityPercentage: club.capacityPercentage || 0,
        memberStatus: club.memberStatus || '',
        shortDescription: club.shortDescription || club.description || ''
    });

    useEffect(() => {
        const loadInitialData = async () => {
            const isGuest = isGuestMode();

            // Load profile data (only for authenticated users)
            if (!isGuest) {
                await loadProfile();
                // Load stories for authenticated users
                // fetchStories();
            }

            // Load clubs ONCE - ALWAYS use Public API: /clubs/public/list
            setIsLoadingVenues(true);
            setIsLoadingAllClubs(true);
            try {
                // Use PublicClubService for all users to get data from /clubs/public/list
                const clubData = await PublicClubService.getPublicClubsList({
                    page: 0,
                    size: 20,
                    sortBy: 'createdAt',
                    sortDirection: 'desc'
                });

                console.log('Raw API Clubs Response:', clubData);

                // Handle clubs data based on API response
                if (clubData?.content && clubData.content.length > 0) {
                    console.log('API Clubs Response Content:', clubData.content);
                    console.log('Total clubs received:', clubData.content.length);

                    // Map all clubs data
                    const mappedAllClubs = clubData.content.map((club: any, index: number) => mapClubData(club, index));
                    console.log('Mapped All Clubs:', mappedAllClubs);

                    // Use first 5 for venues section, all for "All Clubs" section
                    setVenues(mappedAllClubs.slice(0, 5));
                    setAllClubs(mappedAllClubs);
                } else {
                    // No clubs available - show empty state
                    console.log('No clubs data from API - content:', clubData?.content);
                    setVenues([]);
                    setAllClubs([]);
                }
            } catch (error: any) {
                console.error('Failed to load clubs:', error);
                console.error('Error details:', error.response?.data || error.message);
                toast({
                    title: "Failed to load clubs",
                    description: error.message || "Could not fetch clubs. No clubs will be shown.",
                    variant: "destructive",
                });
                // Show empty state on error
                setVenues([]);
                setAllClubs([]);
            } finally {
                setIsLoadingVenues(false);
                setIsLoadingAllClubs(false);
            }

            // Load events - ALWAYS use Public API: /event-management/events/list
            setIsLoadingEvents(true);
            try {
                // Use PublicEventService for all users to get data from /event-management/events/list
                const eventData = await PublicEventService.getPublicEvents({
                    page: 0,
                    size: 20,
                    sortBy: 'startDateTime',
                    sortOrder: 'asc'
                });

                console.log('Raw API Events Response:', eventData);

                if (eventData?.content && eventData.content.length > 0) {
                    console.log('API Events Response Content:', eventData.content);
                    console.log('Total events received:', eventData.content.length);

                    // Map API events with proper length limits and use fallback images for null imageUrl
                    const mappedEvents = eventData.content.map((event: any, index: number) => ({
                        id: event.id || '',
                        title: event.title ? (event.title.length > 20 ? event.title.substring(0, 20) + '...' : event.title) : '',
                        shortDescription: event.shortDescription || event.clubName || '',
                        imageUrl: event.imageUrl || eventFallback[index % eventFallback.length]?.image || '/event list/Rectangle 1.jpg',
                        location: event.location && event.location.length > 25 ?
                            event.location.substring(0, 25) + '...' :
                            (event.location || event.clubName || 'TBD'),
                        startDateTime: event.startDateTime || '',
                        endDateTime: event.endDateTime || '',
                        formattedDate: event.formattedDate || '',
                        formattedTime: event.formattedTime || '',
                        timeUntilEvent: event.timeUntilEvent || '',
                        duration: event.duration || '',
                        attendeeCount: event.attendeeCount || 0,
                        maxAttendees: event.maxAttendees || 100,
                        isRegistered: event.isRegistered || false,
                        canRegister: event.canRegister !== undefined ? event.canRegister : true,
                        isFull: event.isFull || false,
                        clubId: event.clubId || '',
                        clubName: event.clubName ? (event.clubName.length > 15 ? event.clubName.substring(0, 15) + '...' : event.clubName) : '',
                        clubLogo: event.clubLogo || '',
                        organizerName: event.organizerName || '',
                        status: event.status || 'UPCOMING',
                        isPublic: event.isPublic !== undefined ? event.isPublic : true,
                        requiresApproval: event.requiresApproval || false,
                        attendeeStatus: event.attendeeStatus || '',
                        eventStatusText: event.eventStatusText || '',
                        pastEvent: event.pastEvent || false,
                        upcoming: event.upcoming !== undefined ? event.upcoming : true,
                        ongoing: event.ongoing || false,
                        capacityPercentage: event.capacityPercentage || 0
                    }));
                    console.log('Mapped Events:', mappedEvents);
                    setEvents(mappedEvents);
                } else {
                    console.log('No events data from API - content:', eventData?.content);
                    setEvents([]);
                }
            } catch (error: any) {
                console.error('Failed to load events:', error);
                console.error('Error details:', error.response?.data || error.message);
                toast({
                    title: "Failed to load events",
                    description: error.message || "Could not fetch events.",
                    variant: "destructive",
                });
                setEvents([]);
            } finally {
                setIsLoadingEvents(false);
            }
        };

        loadInitialData();
    }, [toast, loadProfile]);

    // Show guest mode notification
    useEffect(() => {
        const isGuest = isGuestMode();
        if (isGuest) {
            // Show a toast to inform user they're in guest mode
            setTimeout(() => {
                toast({
                    title: "Browsing as Guest 👋",
                    description: "Sign in to join clubs, RSVP to events, and access more features!",
                    duration: 5000,
                });
            }, 1000); // Delay to avoid overwhelming user on page load
        }
    }, [toast]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isDragging) {
                setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
            }
        }, 4500);
        return () => clearInterval(interval);
    }, [isDragging]);

    const handleDragStart = (clientX: number) => {
        setIsDragging(true);
        setStartX(clientX);
    };

    const handleDragEnd = (clientX: number) => {
        if (!isDragging) return;

        const deltaX = clientX - startX;

        if (Math.abs(deltaX) > dragThreshold) {
            if (deltaX > 0) {
                // Drag right - previous slide
                setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
            } else {
                // Drag left - next slide
                setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
            }
        }

        setIsDragging(false);
        setStartX(0);
    };

    const handleSearch = async () => {
        const trimmedQuery = searchQuery.trim();

        setActiveSuggestionId(null);
        setSuggestionLoadingId(null);

        // If no query, just do nearby search (current behavior)
        if (!trimmedQuery) {
            if (!locationConfirmed) {
                toast({
                    title: 'Select a location',
                    description: 'Please pick one of the preset locations before searching.',
                    variant: 'destructive',
                });
                return;
            }

            // TODO: Re-enable nearby search when ready
            // try {
            //     await searchNearby({
            //         radius: 5000,
            //         lat: currentLocation?.lat,
            //         lng: currentLocation?.lng,
            //     });
            //     setShowingSearchResults(true);
            //     setNearbyDropdownOpen(true);
            // } catch (error: any) {
            //     console.error('Nearby search failed:', error);
            //     toast({
            //         title: 'Nearby search failed',
            //         description: error.message || 'Could not fetch nearby places.',
            //         variant: 'destructive',
            //     });
            // }
            return;
        }

        // TODO: Re-enable universal search when ready
        // If there is a query, use quick search (universalSearch)
        // console.log('Searching for:', trimmedQuery);
        // try {
        //     setShowingSearchResults(true);
        //     setNearbyDropdownOpen(false); // Close suggestions on enter
        //     await universalSearch(trimmedQuery);
        // } catch (error) {
        //     console.error('Search failed:', error);
        //     toast({
        //         title: 'Search failed',
        //         description: 'Could not perform search. Please try again.',
        //         variant: 'destructive',
        //     });
        // }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setShowingSearchResults(false);
        setActiveSuggestionId(null);
        setSuggestionLoadingId(null);
        setNearbyDropdownOpen(false);
        clearResults();
        clearError();
    };

    const handleSuggestionSelect = async (suggestion: NearbyResultSummary) => {
        const suggestionKey = suggestion.id || suggestion.place_id || `${suggestion.lat}-${suggestion.lng}`;
        setActiveSuggestionId(suggestionKey);
        setSuggestionLoadingId(suggestionKey);

        const completeSelection = async (description: string) => {
            await refreshLocation();
            try {
                await searchNearby({
                    lat: suggestion.lat,
                    lng: suggestion.lng,
                    radius: 5000,
                });
            } catch (refreshError) {
                console.error('Failed to refresh nearby suggestions:', refreshError);
            }
            toast({
                title: 'Location updated',
                description,
            });
            setNearbyDropdownOpen(false);
            setShowingSearchResults(false);
            setSearchQuery('');
            setActiveSuggestionId(null);
        };

        if (!suggestion.id && !suggestion.place_id) {
            persistCustomLocation({
                name: suggestion.name,
                lat: suggestion.lat,
                lng: suggestion.lng,
                address: suggestion.address,
            }, 'list');
            await completeSelection(`${suggestion.name} saved as your active search area.`);
            setSuggestionLoadingId(null);
            return;
        }

        // TODO: Re-enable nearby details fetching when ready
        // try {
        //     const detail = await fetchNearbyDetails({ id: suggestion.id, placeId: suggestion.place_id });
        //     if (detail) {
        //         persistCustomLocation({
        //             name: suggestion.name,
        //             lat: suggestion.lat,
        //             lng: suggestion.lng,
        //             address: suggestion.address,
        //         }, 'list');
        //         await completeSelection(`${suggestion.name} set as your active search area.`);
        //     }
        // } catch (error: any) {
        //     console.error('Nearby detail lookup failed:', error);
        //     toast({
        //         title: 'Unable to load place details',
        //         description: error.message || 'Please pick another suggestion.',
        //         variant: 'destructive',
        //     });
        //     setActiveSuggestionId(null);
        // } finally {
        //     setSuggestionLoadingId(null);
        // }
    };

    // Helper function to get fallback images
    const getVenueFallbackImage = (index: number) => {
        const venueImages = [
            '/venue/Screenshot 2024-12-10 195651.png',
            '/venue/Screenshot 2024-12-10 195852.png',
            '/venue/Screenshot 2024-12-10 200154.png'
        ];
        return venueImages[index % venueImages.length];
    };

    const getEventFallbackImage = (index: number) => {
        const eventImages = [
            '/event list/Rectangle 1.jpg',
            '/event list/Rectangle 2.jpg',
            '/event list/Rectangle 3.jpg',
            '/event list/Rectangle 4.jpg',
            '/event list/Rectangle 5.jpg',
            '/event list/Rectangle 12249.jpg'
        ];
        return eventImages[index % eventImages.length];
    };

    const nearbySuggestions = nearbyResults?.results ?? [];
    const nearbyErrorMessage = showingSearchResults && searchError ? searchError : null;

    // Helper function to check if image URL is valid
    const isValidImageUrl = (url: string) => {
        if (!url) return false;
        if (url.includes('example.com')) return false;
        if (url.includes('placeholder')) return false;
        return true;
    };

    const toggleSidebar = () => {
        console.log('Toggling sidebar. Current state:', isSidebarOpen);
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-[#031313] text-white">
            <div className="relative mx-auto max-w-[430px]">
                {/* Fixed Header */}
                <header className="fixed top-0 left-0 w-full max-w-[430px] mx-auto h-[16vh] bg-gradient-to-b from-[#222831] to-[#11B9AB] rounded-b-[30px] px-5 pb-6 pt-4 z-50 flex flex-col justify-between">
                    {/* Location and Profile */}
                    <div className="flex items-center justify-between">
                        <div className="relative">
                            <button
                                ref={locationButtonRef}
                                type="button"
                                onClick={handleLocationButtonClick}
                                aria-haspopup="listbox"
                                aria-expanded={isLocationDropdownOpen}
                                className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-1 transition-colors"
                            >
                                <MapPin className="w-6 h-6 text-[#14FFEC]" />
                                <div className="text-white text-base font-bold tracking-wide">
                                    {locationLabel}
                                </div>
                                <ChevronDown className="w-3 h-3 text-white" />
                            </button>
                            {isLocationDropdownOpen && (
                                <div
                                    ref={locationDropdownRef}
                                    className="absolute top-full mt-2 left-0 w-[260px] rounded-2xl bg-[#031313] border border-[#14FFEC]/20 shadow-[0px_10px_30px_rgba(0,0,0,0.6)] z-50"
                                >
                                    <div className="py-2">
                                        {POPULAR_LOCATIONS.map((location) => {
                                            const isActive = location.id === activePresetId;
                                            return (
                                                <button
                                                    key={location.id}
                                                    type="button"
                                                    onClick={() => handleLocationPresetSelect(location.id)}
                                                    className={`w-full flex flex-col gap-1 px-4 py-3 text-left transition-colors ${isActive ? 'bg-white/10' : 'hover:bg-white/10'
                                                        }`}
                                                >
                                                    <span className="text-sm font-semibold">{location.name}</span>
                                                    {location.address && (
                                                        <span className="text-[11px] text-white/70">{location.address}</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                        <Link
                            href="/account"
                            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <User className="w-5 h-5 text-white" />
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center gap-2 w-full">
                        <div className="flex-1 relative" ref={searchInputWrapperRef}>
                            <div className="h-10 px-4 py-2 bg-white/20 rounded-[23px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center gap-2 min-w-0">
                                <button
                                    onClick={handleSearch}
                                    disabled={isSearching || isLoadingNearby || !locationConfirmed}
                                    className="disabled:opacity-50 flex-shrink-0"
                                >
                                    {isSearching || isLoadingNearby ? (
                                        <Loader2 className="w-[21px] h-[21px] text-white animate-spin" />
                                    ) : (
                                        <Search className="w-[21px] h-[21px] text-white" />
                                    )}
                                </button>
                                <input
                                    type="text"
                                    placeholder="Search clubs, events..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => {
                                        if (locationConfirmed) {
                                            setNearbyDropdownOpen(true);
                                        }
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                    className="flex-1 bg-transparent text-white text-base font-bold tracking-[0.5px] placeholder-white/70 outline-none min-w-0"
                                    disabled={isSearching || isLoadingNearby}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={handleClearSearch}
                                        className="text-white/70 hover:text-white flex-shrink-0"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            {isNearbyDropdownOpen && (
                                <div
                                    ref={searchDropdownRef}
                                    className="absolute left-0 right-0 top-full mt-3 w-full max-h-[85vh] overflow-hidden rounded-[26px] border border-white/20 bg-[#041919] p-4 shadow-[0px_20px_60px_rgba(0,0,0,0.65)] z-50 flex flex-col"
                                >
                                    <div className="flex-1 overflow-y-auto pr-1">
                                        {searchQuery.length >= 2 && autocompleteSuggestions && autocompleteSuggestions.length > 0 ? (
                                            <div className="flex flex-col gap-2">
                                                <h3 className="text-xs text-white/50 px-2 font-bold uppercase tracking-wider mb-2">Suggestions</h3>
                                                {autocompleteSuggestions.map((suggestion, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => {
                                                            setSearchQuery(suggestion.text);
                                                            // Close dropdown and show results
                                                            setNearbyDropdownOpen(false);
                                                            setShowingSearchResults(true);
                                                            // Trigger main search with the suggestion text
                                                            universalSearch(suggestion.text);
                                                        }}
                                                        className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition-colors text-left group w-full"
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#14FFEC] group-hover:bg-[#14FFEC]/10">
                                                            <Search className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-white text-sm font-semibold">{suggestion.text}</p>
                                                            <p className="text-white/50 text-xs capitalize">{suggestion.type.toLowerCase()}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <LocationSuggestionList
                                                suggestions={nearbySuggestions}
                                                onSelect={handleSuggestionSelect}
                                                isLoading={isLoadingNearby}
                                                error={nearbyErrorMessage}
                                                selectedId={activeSuggestionId}
                                                loadingId={suggestionLoadingId}
                                                emptyStateText="No nearby matches yet. Try adjusting the query."
                                            />
                                        )}
                                    </div>
                                    {/* Only show details if NOT showing autocomplete suggestions (i.e. if showing nearby stuff) */}
                                    {!(searchQuery.length >= 2 && autocompleteSuggestions && autocompleteSuggestions.length > 0) && (
                                        <div className="mt-3 pt-3 border-t border-white/10">
                                            <NearbyDetailCard
                                                detail={nearbyDetails}
                                                isLoading={isLoadingNearbyDetails || !!suggestionLoadingId}
                                                title="Place details"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className="w-10 h-10 bg-white/20 rounded-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center gap-[3px] cursor-pointer hover:bg-white/30 transition-colors flex-shrink-0"
                        >
                            <div className="w-[15px] h-[2px] bg-white rounded-[2px]"></div>
                            <div className="w-[19px] h-[2px] bg-white rounded-[6px]"></div>
                            <div className="w-[15px] h-[2px] bg-white rounded-[2px]"></div>
                        </button>
                    </div>
                </header>

                {/* Guest Mode Banner */}
                {isGuestMode() && (
                    <div className="fixed top-[16vh] left-0 w-full max-w-[430px] mx-auto z-40">
                        <div className="mx-4 mt-2 mb-2 p-3 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg shadow-lg border border-teal-400/30">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-white text-sm font-medium">
                                        👋 Browsing as Guest
                                    </p>
                                    <p className="text-white/80 text-xs mt-1">
                                        Sign in to join clubs & RSVP to events
                                    </p>
                                </div>
                                <Link
                                    href="/auth/mobile"
                                    className="px-3 py-1.5 bg-white/20 rounded-md text-white text-xs font-medium hover:bg-white/30 transition-colors"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className={`${isGuestMode() ? 'pt-[20vh]' : 'pt-[16vh]'} px-0 space-y-6`}>


                    {/* Search Results or Normal Content */}
                    {showingSearchResults ? (
                        /* Search Results Section */
                        <section className="px-5 space-y-6 pt-[18vh]">
                            <div className="flex items-center justify-between">
                                <h2 className="text-white text-lg font-bold">
                                    {`Search Results for "${searchQuery}"`}
                                </h2>
                                <button
                                    onClick={handleClearSearch}
                                    className="text-[#14FFEC] text-sm font-medium hover:underline"
                                >
                                    Clear Search
                                </button>
                            </div>

                            {/* Loading State */}
                            {isSearching && (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
                                    <span className="ml-3 text-white">Searching...</span>
                                </div>
                            )}

                            {/* Search Results - Events */}
                            {searchEvents.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-white text-base font-semibold">Events</h3>
                                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                        {searchEvents.slice(0, 5).map((event, index) => {
                                            const eventDate = new Date(event.startDateTime);
                                            const monthShort = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                                            const day = eventDate.getDate().toString().padStart(2, '0');
                                            const fallbackImage = getEventFallbackImage(index);

                                            return (
                                                <div key={event.id} className="w-[222px] h-[305px] flex-shrink-0 relative rounded-[20px] overflow-hidden" style={{ background: 'radial-gradient(ellipse 79.96% 39.73% at 22.30% 70.24%, black 0%, #014A4B 100%)' }}>
                                                    {/* Image */}
                                                    <div className="relative">
                                                        <img
                                                            src={event.imageUrl && isValidImageUrl(event.imageUrl) ? event.imageUrl : fallbackImage}
                                                            alt={event.title}
                                                            className="w-full h-[160px] object-cover"
                                                        />
                                                        {/* Date Badge */}
                                                        <div className="absolute top-4 left-4 bg-[#14FFEC] rounded-lg px-2 py-1 min-w-[40px] text-center">
                                                            <div className="text-black text-xs font-bold">{monthShort}</div>
                                                            <div className="text-black text-lg font-bold leading-none">{day}</div>
                                                        </div>
                                                    </div>
                                                    {/* Content */}
                                                    <div className="p-4 h-[145px] flex flex-col justify-between">
                                                        <div>
                                                            <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">{event.title}</h3>
                                                            <p className="text-gray-300 text-xs mb-1">{event.clubName || event.club?.name || event.location}</p>
                                                        </div>
                                                        <div className="flex justify-between items-center mt-auto">
                                                            <span className="text-[#14FFEC] text-xs">View Details</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Search Results - Clubs */}
                            {searchClubs.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-white text-base font-semibold">Clubs</h3>
                                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                        {searchClubs.slice(0, 5).map((club, index) => {
                                            const img = club.images?.[0];
                                            const imageUrl = (typeof img === 'string' ? img : img?.url) || club.logoUrl;
                                            const fallbackImage = getVenueFallbackImage(index);
                                            return (
                                                <div key={club.id} className="w-[336px] h-[201px] relative flex-shrink-0 mr-1">
                                                    {/* Main image container with rounded top */}
                                                    <div className="w-[336px] h-[169px] left-0 top-0 absolute flex-col justify-start items-start flex rounded-[15px] border-[#14FFEC] overflow-hidden">
                                                        <img
                                                            src={imageUrl && isValidImageUrl(imageUrl) ? imageUrl : fallbackImage}
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
                                                    <div className="w-[320px] h-[85px] left-[8px] top-[125px] absolute bg-[rgba(212.01,212.01,212.01,0.10)] rounded-[15px] border backdrop-blur-[17.50px]"></div>

                                                    {/* Rating badge */}
                                                    <div className="w-[30px] h-[30px] pl-1 pr-[5px] py-[5px] left-[250px] top-[110px] absolute justify-center items-center inline-flex bg-[#008378] rounded-[17px] overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                                                        <div className="text-white text-[13px] font-extrabold font-['Manrope'] leading-5 tracking-[0.01em]">
                                                            4.2
                                                        </div>
                                                    </div>

                                                    {/* Text content */}
                                                    <div className="w-32 h-[50px] left-[33px] top-[144px] absolute justify-start items-center gap-[29px] inline-flex">
                                                        <div className="w-52 flex-col justify-center items-start gap-2 inline-flex">
                                                            <div className="self-stretch h-5 text-[#14FFEC] text-xl font-black font-['Manrope'] leading-5 tracking-[0.02em] truncate overflow-hidden whitespace-nowrap">
                                                                {club.name && club.name.length > 12 ? club.name.substring(0, 12) + '...' : club.name}
                                                            </div>
                                                            <div className="self-stretch h-5 text-white text-[13px] font-semibold font-['Manrope'] leading-5 tracking-[0.01em] truncate overflow-hidden whitespace-nowrap">
                                                                {((club.address || club.locationText?.city || 'Open now').length > 20 ? (club.address || club.locationText?.city || 'Open now').substring(0, 20) + '...' : (club.address || club.locationText?.city || 'Open now'))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Balanced Results */}
                            {balancedResults?.venues && balancedResults.venues.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-white text-base font-semibold">More Venues</h3>
                                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                        {balancedResults.venues.slice(0, 5).map((venue, index) => {
                                            const fallbackImage = getVenueFallbackImage(index);
                                            return (
                                                <div key={venue.id} className="w-[336px] h-[201px] relative flex-shrink-0 mr-1">
                                                    {/* Main image container with rounded top */}
                                                    <div className="w-[336px] h-[169px] left-0 top-0 absolute flex-col justify-start items-start flex rounded-[15px] border-[#14FFEC] overflow-hidden">
                                                        <img
                                                            src={fallbackImage}
                                                            alt={venue.name}
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
                                                    <div className="w-[320px] h-[85px] left-[8px] top-[125px] absolute bg-[rgba(212.01,212.01,212.01,0.10)] rounded-[15px] border backdrop-blur-[17.50px]"></div>

                                                    {/* Rating badge */}
                                                    <div className="w-[30px] h-[30px] pl-1 pr-[5px] py-[5px] left-[250px] top-[110px] absolute justify-center items-center inline-flex bg-[#008378] rounded-[17px] overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                                                        <div className="text-white text-[13px] font-extrabold font-['Manrope'] leading-5 tracking-[0.01em]">
                                                            4.2
                                                        </div>
                                                    </div>

                                                    {/* Text content */}
                                                    <div className="w-32 h-[50px] left-[33px] top-[144px] absolute justify-start items-center gap-[29px] inline-flex">
                                                        <div className="w-52 flex-col justify-center items-start gap-2 inline-flex">
                                                            <div className="self-stretch h-5 text-[#14FFEC] text-xl font-black font-['Manrope'] leading-5 tracking-[0.02em] first-letter:text-2xl first-letter:leading-2">
                                                                {venue.name}
                                                            </div>
                                                            <div className="self-stretch h-5 text-white text-[13px] font-semibold font-['Manrope'] leading-5 tracking-[0.01em]">
                                                                {venue.location || 'Open now'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* No Results */}
                            {!isSearching && searchEvents.length === 0 && searchClubs.length === 0 && (!balancedResults?.venues || balancedResults.venues.length === 0) && searchQuery.trim() && (
                                <div className="text-center py-8">
                                    <p className="text-gray-400">No results found for "{searchQuery}"</p>
                                    <button
                                        onClick={handleClearSearch}
                                        className="mt-4 px-4 py-2 bg-[#14FFEC] text-black rounded-lg font-semibold"
                                    >
                                        Back to Home
                                    </button>
                                </div>
                            )}
                        </section>
                    ) : (
                        /* Normal Home Content */
                        <>
                            {/* Hero Carousel */}
                            <section className="relative w-full">
                                <div data-property-1="Default" className="w-full h-full relative shadow-[0px_4px_5.6px_rgba(20,255,236,0.11)] overflow-hidden rounded-b-[30px]">
                                    {/* Visible slide */}
                                    <div
                                        className="w-[430px] h-[262px] relative cursor-grab active:cursor-grabbing"
                                        onMouseDown={(e) => handleDragStart(e.clientX)}
                                        onMouseUp={(e) => handleDragEnd(e.clientX)}
                                        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                                        onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
                                    >
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
                                            <button
                                                onClick={() => {
                                                    // navigate to slot booking page
                                                    const href = heroSlides[currentSlide]?.bookingLink || '/booking/slot';
                                                    // use window.location to navigate from client component if router isn't desired here
                                                    window.location.href = href;
                                                }}
                                                className="w-[80px] h-[45px] flex items-center bg-[rgba(30,98,102,0.5)] rounded-l-[22px] border border-r-0 border-white backdrop-blur-[25px] shadow-[0px_0px_10px_rgba(233.78,233.78,233.78,0.25)] pl-5 cursor-pointer hover:opacity-95"
                                            >
                                                <div className="text-white text-[11px] font-bold font-['Manrope'] text-left leading-tight tracking-wider whitespace-nowrap ml-[-3px]">
                                                    BOOK<br />NOW
                                                </div>
                                            </button>
                                        </div>

                                        {/* Sponsor badge with exact styling */}
                                        <div className="w-[90px] h-[28px] absolute left-[15px] top-[45px]">
                                            <div className="w-full h-full absolute left-0 top-0 bg-[rgba(212.01,212.01,212.01,0.10)] rounded-[6px] border border-[rgba(255,255,255,0.50)] backdrop-blur-[17.50px]"></div>
                                            <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold font-['Manrope'] leading-[15px] break-words">
                                                {heroSlides[currentSlide].sponsor}
                                            </div>
                                        </div>

                                        <div className="w-[90px] h-[19px] absolute left-[170px] top-[225px] p-[8px] bg-[rgba(255,255,255,0.10)] rounded-[28px] backdrop-blur-[5px] inline-flex justify-center items-center gap-[5px]" style={{ outline: '1px solid white', outlineOffset: '-1px' }}>
                                            {heroSlides.slice(0, 5).map((_, index) => (
                                                <div key={index} className="w-[12px] h-[12px] relative" onClick={() => setCurrentSlide(index)}>
                                                    <div className={`w-[12px] h-[12px] absolute left-0 top-0 rounded-[9999px] ${index === currentSlide ? 'bg-white' : 'border border-white'}`}></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Vibe Meter / Stories */}
                            {!isGuestMode() && (storiesLoading || stories.length > 0) && (
                                <section className="pt-2 mb-2">
                                    {storiesLoading ? (
                                        <div className="px-5 flex items-center gap-2 text-white/50 py-4">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span className="text-sm">Loading stories...</span>
                                        </div>
                                    ) : (
                                        <StoriesSection
                                            className="px-1"
                                            stories={stories.map(s => ({
                                                id: s.id,
                                                image: s.mediaUrl,
                                                title: s.title || s.club?.name || 'Story',
                                                timestamp: new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                                clubName: s.club?.name,
                                                isViewed: false,
                                                duration: s.duration
                                            }))}
                                        />
                                    )}
                                </section>
                            )}

                            {!isGuestMode() && !storiesLoading && stories.length === 0 && (
                                <section className="px-5 pt-2">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-white text-lg font-medium">Vibe Meter</h2>
                                    </div>
                                    <div className="overflow-x-auto scrollbar-hide -mx-5 px-5">
                                        <div className="flex items-center justify-center py-8">
                                            <p className="text-gray-400 text-sm">No stories available right now</p>
                                        </div>
                                    </div>
                                </section>
                            )}



                            {/* All Clubs */}
                            <section>
                                <div className="flex items-center gap-4 mb-6 px-5">
                                    <h2 className="text-white text-base font-semibold whitespace-nowrap">All Clubs</h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                                    <Link href="/clubs" className="text-[#14FFEC] text-base font-medium">View All</Link>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide pl-5">
                                    {isLoadingAllClubs ? (
                                        <div className="flex items-center justify-center w-full py-8">
                                            <Loader2 className="w-6 h-6 text-[#14FFEC] animate-spin" />
                                        </div>
                                    ) : allClubs.length > 0 ? (
                                        allClubs.map((club, index) => {
                                            const fallbackImage = venueFallback[index % venueFallback.length]?.image || '/venue/Screenshot 2024-12-10 195651.png';

                                            return (
                                                <ClubCard
                                                    key={club.id}
                                                    club={{
                                                        id: club.id,
                                                        name: club.name,
                                                        openTime: 'Hours not available',
                                                        rating: 4.0,
                                                        image: club.imageUrl || fallbackImage,
                                                        address: club.location || club.description,
                                                        category: club.category || 'Club'
                                                    }}
                                                    href={`/club/${club.id}`}
                                                    fallbackImage={fallbackImage}
                                                />
                                            );
                                        })
                                    ) : (
                                        <div className="flex items-center justify-center w-full py-8">
                                            <p className="text-gray-400 text-sm">No clubs available</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Event List */}
                            <section>
                                <div className="flex items-center gap-4 mb-6 px-5">
                                    <h2 className="text-white text-base font-semibold whitespace-nowrap">Event List</h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                                    <Link href="/events" className="text-[#14FFEC] text-base font-medium">View All</Link>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide pl-5">
                                    {isLoadingEvents ? (
                                        <div className="flex items-center justify-center w-full py-8">
                                            <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
                                        </div>
                                    ) : events.length > 0 ? (
                                        events.slice(0, 5).map((event, index) => {
                                            const eventDate = new Date(event.startDateTime);
                                            const monthShort = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                                            const day = eventDate.getDate().toString().padStart(2, '0');
                                            const fallbackImage = eventFallback[index % eventFallback.length]?.image || '/event list/Rectangle 1.jpg';

                                            return (
                                                <Link key={event.id} href={`/event/${event.id}`}>
                                                    <div className="w-[222px] h-[305px] flex-shrink-0 relative rounded-[20px] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity" style={{ background: 'radial-gradient(ellipse 79.96% 39.73% at 22.30% 70.24%, black 0%, #014A4B 100%)' }}>
                                                        {/* Image */}
                                                        <div className="relative">
                                                            <img
                                                                src={event.imageUrl && isValidImageUrl(event.imageUrl) ? event.imageUrl : fallbackImage}
                                                                alt={event.title}
                                                                className="w-full h-[180px] object-cover"
                                                                style={{
                                                                    borderWidth: '1.5px',
                                                                    borderStyle: 'solid',
                                                                    borderColor: '#28D2DB',
                                                                    borderBottomRightRadius: '0',
                                                                    borderTopLeftRadius: '20px',
                                                                    borderTopRightRadius: '20px',
                                                                    borderBottomLeftRadius: '20px',
                                                                }}
                                                            />
                                                        </div>

                                                        {/* Date Badge - positioned on the right */}
                                                        <div className="absolute right-4 top-0 w-[36px] h-[45px] px-[2px] py-[10px] bg-gradient-to-b from-black to-[#00C0CA] rounded-b-[28px] border-l border-r border-b border-[#CDCDCD] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
                                                            <div className="w-[31px] text-center text-white text-[14px] font-semibold font-['Manrope'] leading-4">{monthShort}<br />{day}</div>
                                                        </div>

                                                        {/* Content - positioned in the dark area below image */}
                                                        <div className="absolute left-[18px] right-[18px] top-[188px] flex items-center justify-between">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-white text-[13px] font-bold font-['Manrope'] leading-[18px] mb-1 truncate">
                                                                    {event.title}
                                                                </div>
                                                                <div className="text-[#C6C6C6] text-[11px] font-semibold font-['Manrope'] leading-[15px] tracking-[0.01em] truncate">
                                                                    {event.clubName || event.location}
                                                                </div>
                                                            </div>
                                                            <button className="w-[34px] h-[34px] p-[5px] bg-neutral-300/10 rounded-[22px] backdrop-blur-[35px] flex justify-center items-center">
                                                                <Bookmark className="w-5 h-5 text-[#14FFEC]" />
                                                            </button>
                                                        </div>

                                                        <div className="absolute left-[18px] right-[18px] top-[249px]">
                                                            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#14FFEC] to-transparent"></div>
                                                        </div>

                                                        <div className="absolute left-[18px] right-[18px] top-[262px] text-white text-[11px] font-bold font-['Manrope'] leading-[15px] tracking-[0.01em] truncate">
                                                            {event.shortDescription || event.formattedDate}
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    ) : (
                                        <div className="flex items-center justify-center w-full py-8">
                                            <p className="text-gray-400 text-sm">No events available</p>
                                        </div>
                                    )}
                                </div>
                            </section>


                            {/* Footer */}
                            <div className="mt-8">
                                <div className="w-full h-full pt-6 pb-2 bg-gradient-to-t from-[#01413B] to-[#021313] overflow-hidden flex flex-col justify-end items-center gap-4">
                                    <div className="mt-8 flex items-center justify-center gap-1">
                                        <img src="/logo/logo.png" alt="Glass Logo" className="w-16 h-auto" />
                                        <img src="/logo/CLUBWIZ.png" alt="ClubWiz Logo" className="w-40 h-auto" />
                                    </div>
                                    <div className="w-[368px] h-[59px] text-center text-white text-base font-normal leading-5 tracking-[0.5px] break-words">
                                        Dive into the ultimate party scene discover lit club nights, epic events, and non-stop vibes all in one place!
                                    </div>
                                    <div className="w-[175px] h-[21px] flex justify-between items-center">
                                        <img src="/footer-logos/x-logo-fill.svg" alt="X" className="w-6 h-6" />
                                        <img src="/footer-logos/whatsapp-logo-fill.svg" alt="WhatsApp" className="w-6 h-6" />
                                        <img src="/footer-logos/Phone.svg" alt="Phone" className="w-6 h-6" />
                                        <img src="/footer-logos/Envelope.svg" alt="Email" className="w-6 h-6" />
                                    </div>
                                    <div className="h-[139px] px-[57px] py-[22px] bg-gradient-to-r from-[rgba(23.13,69.51,71.11,0.20)] to-[rgba(20,255,236,0.74)] overflow-hidden flex flex-col justify-center items-start gap-[10px]">
                                        <div className="w-[316px] flex flex-col justify-center items-start gap-[14px]">
                                            <div className="self-stretch h-[13px] flex justify-start items-center gap-[11px]">
                                                <img src="/footer-logos/Envelope.svg" alt="Email" className="w-[17px] h-[17px]" />
                                                <div className="w-[231px] h-[14px] flex justify-end flex-col text-white text-base font-medium leading-4 tracking-[0.5px] break-words">
                                                    contact@clubwiz.com
                                                </div>
                                            </div>
                                            <div className="w-[210px] h-[13px] flex justify-start items-center gap-[10px]">
                                                <img src="/footer-logos/MapPin.svg" alt="Location" className="w-[17px] h-[17px]" />
                                                <div className="w-[190px] h-4 text-white text-base font-medium leading-4 tracking-[0.5px] break-words">
                                                    Location Details
                                                </div>
                                            </div>
                                            <div className="self-stretch h-[13px] flex justify-start items-center gap-3">
                                                <img src="/footer-logos/File.svg" alt="Terms" className="w-[17px] h-[17px]" />
                                                <div className="w-[231px] h-[18px] text-white text-base font-medium leading-4 tracking-[0.5px] break-words">
                                                    Terms & Condition
                                                </div>
                                            </div>
                                            <div className="h-[14px] flex justify-center items-center gap-[11px]">
                                                <img src="/footer-logos/File (1).svg" alt="Privacy" className="w-[17px] h-[17px]" />
                                                <div className="w-[118px] h-[17px] text-white text-base font-medium leading-4 tracking-[0.5px] break-words">
                                                    Privacy Policy
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full h-[18px] text-white text-sm font-normal leading-4 tracking-[0.5px] break-words text-center">
                                        Copy rights reserved with clubwiz.com
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                profile={profile}
                currentUser={currentUser}
                isProfileLoading={isProfileLoading}
            />
        </div>
    );
};

export default HomePage;