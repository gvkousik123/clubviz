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
import { UserLocationService } from '@/lib/services/user-location.service';
import { isGuestMode } from '@/lib/api-client-public';
import { LocationSuggestionList } from '@/components/common/location-suggestion-list';
import { NearbyDetailCard } from '@/components/common/nearby-detail-card';
import { POPULAR_LOCATIONS, selectLocationFromOption, persistCustomLocation } from '@/lib/location';
import type { NearbyResultSummary } from '@/hooks/use-search';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/use-profile';
import { AutocompleteSuggestion } from '@/lib/services/search.service';
import { STORAGE_KEYS } from '@/lib/constants/storage';
import { StoriesSection } from '@/components/story';
import { StoryViewer } from '@/components/story/story-viewer';
import { useUserLocation } from '@/hooks/use-user-location';
// Use centralized data store for optimized API calls
import { useData, useClubsData, useEventsData, useStoriesData } from '@/lib/store';
import {
    ClubCardSkeleton,
    EventCardSkeleton,
    StorySkeleton,
    VenueCardSkeleton,
    ClubsSectionSkeleton,
    EventsSectionSkeleton,
    StoriesSectionSkeleton,
    VenuesSectionSkeleton
} from '@/components/ui/skeleton-loaders';

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

    // ==================== CENTRALIZED DATA STORE ====================
    // Use centralized data context for optimized API calls with caching
    const {
        clubs: cachedClubs,
        clubsLoading: isLoadingAllClubs,
        fetchClubs,
        events: cachedEvents,
        eventsLoading: isLoadingEvents,
        fetchEvents,
        stories: cachedStories,
        storiesLoading,
        fetchStories,
        initializeData,
        isInitialized
    } = useData();

    const resolveClubId = (club: any): string => {
        const source = club?.club || club;
        const resolvedId = source?.id || source?.clubId || source?._id || club?.id || club?.clubId || club?._id;
        return resolvedId ? String(resolvedId) : '';
    };

    // Helper function to map club data from API response
    const mapClubData = (club: any, index: number) => ({
        id: resolveClubId(club),
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
    // Derived state from cached data
    const allClubs = useMemo(() => {
        return cachedClubs
            .map((club: any, index: number) => mapClubData(club, index))
            .filter((club: any) => !!club.id);
    }, [cachedClubs]);

    const venues = useMemo(() => {
        return allClubs.slice(0, 5);
    }, [allClubs]);

    const events = useMemo(() => {
        return cachedEvents
            .map((event: any, index: number) => ({
                // prefer explicit id, fall back to common alternatives
                id: String(event.id || event._id || event.eventId || ''),
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
            }))
            .filter((e: any) => e.id);
    }, [cachedEvents]);

    const stories = cachedStories;
    const isLoadingVenues = isLoadingAllClubs;

    // Story viewer state
    const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
    const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

    const { toast } = useToast();

    // Profile data
    const {
        profile,
        currentUser,
        isProfileLoading,
        loadProfile
    } = useProfile();

    // User location data from API
    const {
        userLocation,
        hasLocation,
        loading: locationLoading,
    } = useUserLocation();

    // Search functionality
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
    const homeRecoveryAttemptedRef = useRef(false);

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

    // Autocomplete suggestions with 1.5s debounce
    useEffect(() => {
        if (searchQuery.length >= 2) {
            const timer = setTimeout(() => {
                getAutocompleteSuggestions(searchQuery);
            }, 1500);
            return () => clearTimeout(timer);
        } else {
            getAutocompleteSuggestions('');
        }
    }, [searchQuery, getAutocompleteSuggestions]);

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

    // Location display logic with proper priority
    const getLocationDisplayLabel = () => {
        if (!isHydrated) return 'N/A';

        // For authenticated users, check saved location from API
        if (userLocation) {
            // Priority: City → Address → Coordinates → N/A
            if (userLocation.city) {
                return userLocation.city;
            }
            if (userLocation.address) {
                return userLocation.address;
            }
            if (userLocation.latitude && userLocation.longitude) {
                return `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`;
            }
            return 'N/A';
        }

        // Fallback to currentLocation (from use-search hook)
        if (locationConfirmed && currentLocation) {
            return currentLocation.label || currentLocation.name || 'Selected Location';
        }

        return 'N/A';
    };

    const locationLabel = getLocationDisplayLabel();

    const handleLocationButtonClick = () => {
        setLocationDropdownOpen((prev) => !prev);
    };

    const handleLocationPresetSelect = async (presetId: string) => {
        selectLocationFromOption(presetId);
        try {
            // Get the selected location
            const selectedLocation = POPULAR_LOCATIONS.find(loc => loc.id === presetId);

            // Save location to API if user is authenticated (not guest)
            if (selectedLocation && !isGuestMode()) {
                await UserLocationService.updateUserLocation({
                    latitude: selectedLocation.lat,
                    longitude: selectedLocation.lng,
                    address: selectedLocation.name,
                    city: selectedLocation.name
                });
            }

            await refreshLocation();
        } catch (error) {
            console.error('Failed to save location:', error);
            // Still close dropdown even if API call fails
        } finally {
            setLocationDropdownOpen(false);
        }
    };



    useEffect(() => {
        const loadInitialData = async () => {
            const isGuest = isGuestMode();
            let userCoords: { latitude: number; longitude: number } | undefined;

            // Load user's saved location (for authenticated users)
            if (!isGuest) {
                try {
                    const locationResult = await UserLocationService.getUserLocation();
                    if (locationResult.success && locationResult.data) {
                        // Location loaded successfully - extract coordinates
                        if (locationResult.data.latitude && locationResult.data.longitude) {
                            userCoords = {
                                latitude: locationResult.data.latitude,
                                longitude: locationResult.data.longitude
                            };
                        }
                    }
                } catch (error) {
                    // User hasn't saved a location yet
                }
            }

            // Load profile data (only for authenticated users)
            if (!isGuest) {
                await loadProfile();
            }

            // ==================== OPTIMIZED DATA LOADING ====================
            // Use centralized data store - data is cached and shared across pages
            // This prevents duplicate API calls when navigating between pages
            // Pass coordinates if available for location-based results
            await initializeData(userCoords);
        };

        loadInitialData();
    }, [loadProfile, initializeData]);

    useEffect(() => {
        if (homeRecoveryAttemptedRef.current) {
            return;
        }

        if (!isInitialized || isLoadingAllClubs || isLoadingEvents) {
            return;
        }

        if (allClubs.length > 0 || events.length > 0) {
            return;
        }

        homeRecoveryAttemptedRef.current = true;
        const coords = currentLocation
            ? { latitude: currentLocation.lat, longitude: currentLocation.lng }
            : undefined;

        Promise.all([
            fetchClubs(true, coords),
            fetchEvents(true, coords),
        ]).catch((error) => {
            console.error('Home recovery fetch failed:', error);
        });
    }, [
        isInitialized,
        isLoadingAllClubs,
        isLoadingEvents,
        allClubs.length,
        events.length,
        currentLocation,
        fetchClubs,
        fetchEvents,
    ]);

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
            return;
        }

        // If there is a query, use quick search (universalSearch)
        try {
            setShowingSearchResults(true);
            setNearbyDropdownOpen(false); // Close suggestions on enter
            await universalSearch(trimmedQuery);
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Search failed:', error);
            toast({
                title: 'Search failed',
                description: 'Could not perform search. Please try again.',
                variant: 'destructive',
            });
        }
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
                                        {/* Divider */}
                                        <div className="h-px bg-white/10 mx-2 my-2" />
                                        {/* Custom Location Option */}
                                        <Link
                                            href="/location/select"
                                            onClick={() => setLocationDropdownOpen(false)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors"
                                        >
                                            <div className="w-5 h-5 rounded-full bg-[#14FFEC]/30 flex items-center justify-center flex-shrink-0">
                                                <MapPin className="w-3 h-3 text-[#14FFEC]" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-[#14FFEC]">Select custom location</p>
                                                <p className="text-[11px] text-white/50">Use Google Maps</p>
                                            </div>
                                        </Link>
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
                                        {searchQuery.length >= 2 ? (
                                            autocompleteSuggestions && autocompleteSuggestions.length > 0 ? (
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
                                                <div className="text-center py-8">
                                                    <p className="text-white/50 text-sm">No suggestions</p>
                                                </div>
                                            )
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
                                    {/* Only show details if NOT showing autocomplete (i.e. if showing nearby stuff or no query) */}
                                    {searchQuery.length < 2 && (
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
                {isHydrated && isGuestMode() && (
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
                <main className={`${isHydrated && isGuestMode() ? 'pt-[20vh]' : 'pt-[16vh]'} px-0 space-y-6`}>


                    {/* Search Results or Normal Content */}
                    {showingSearchResults ? (
                        /* Search Results Section */
                        <section className="px-5 space-y-6">
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

                                        {/* Sponsor badge with exact styling - Only show on first slide */}
                                        {currentSlide === 0 && (
                                            <div className="w-[90px] h-[28px] absolute left-[15px] top-[45px]">
                                                <div className="w-full h-full absolute left-0 top-0 bg-[rgba(212.01,212.01,212.01,0.10)] rounded-[6px] border border-[rgba(255,255,255,0.50)] backdrop-blur-[17.50px]"></div>
                                                <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold font-['Manrope'] leading-[15px] break-words">
                                                    {heroSlides[currentSlide].sponsor}
                                                </div>
                                            </div>
                                        )}

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
                            {isHydrated && !isGuestMode() && (storiesLoading || stories.length > 0) && (
                                <section className="pt-2 mb-2">
                                    {storiesLoading ? (
                                        <StoriesSectionSkeleton count={7} />
                                    ) : (
                                        <StoriesSection
                                            className="px-1"
                                            onStoryClick={(index) => {
                                                setSelectedStoryIndex(index);
                                                setIsStoryViewerOpen(true);
                                            }}
                                            stories={stories.map((s: any) => {
                                                const id = s.storyId || s.id;
                                                const mediaUrl = s.mediaUrl || s.mediaBase64 || '';
                                                const clubName = s.club?.name || s.userFullName || 'User Story';
                                                const title = s.title || s.caption || clubName || 'Story';


                                                return {
                                                    id: id,
                                                    image: mediaUrl,
                                                    title: title,
                                                    timestamp: s.createdAt ? new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                                                    clubName: clubName,
                                                    isViewed: false,
                                                    duration: s.duration || 5
                                                };
                                            })}
                                        />
                                    )}
                                </section>
                            )}

                            {isHydrated && !isGuestMode() && !storiesLoading && stories.length === 0 && (
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
                                    <h2 className="text-white text-base font-semibold whitespace-nowrap">Clubs</h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                                    <Link href="/clubs" className="text-[#14FFEC] text-base font-medium">View All</Link>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide pl-5">
                                    {isLoadingAllClubs ? (
                                        Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i} className="w-[336px] h-[201px] relative flex-shrink-0 mr-1">
                                                <div className="w-[336px] h-[169px] left-0 top-0 absolute bg-gradient-to-r from-[#1a2a2a] via-[#2a3a3a] to-[#1a2a2a] animate-pulse rounded-[15px]"></div>
                                                <div className="w-[320px] h-[85px] left-[8px] top-[125px] absolute bg-gradient-to-r from-[#1a2a2a] via-[#2a3a3a] to-[#1a2a2a] animate-pulse rounded-[15px]"></div>
                                            </div>
                                        ))
                                    ) : allClubs.length > 0 ? (
                                        allClubs.map((club, index) => {
                                            const fallbackImage = venueFallback[index % venueFallback.length]?.image || '';

                                            return (
                                                <Link key={club.id} href={`/club/${club.id}`}>
                                                    <div className="w-[336px] h-[201px] relative flex-shrink-0 cursor-pointer">
                                                        <div className="w-[336px] h-[169px] left-0 top-0 absolute flex-col justify-start items-start flex rounded-[15px] border-[#14FFEC] overflow-hidden">
                                                            <img
                                                                src={club.imageUrl || fallbackImage}
                                                                alt={club.name}
                                                                className="w-full h-full object-cover absolute inset-0"
                                                            />
                                                            <div className="w-full h-full absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                                                            <div className="w-full h-[169px] px-4 pt-[17px] pb-[113px] left-0 top-0 absolute justify-end items-center inline-flex bg-gradient-to-b from-black via-black/50 to-black/0 rounded-[10px] overflow-hidden">
                                                                <button
                                                                    className="w-[39px] self-stretch bg-neutral-300/10 rounded-[22px] backdrop-blur-[35px] justify-center items-center inline-flex overflow-hidden"
                                                                    aria-label="Bookmark club"
                                                                >
                                                                    <svg className="w-5 h-5 text-[#14FFEC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="h-[85px] inset-x-2 top-[116px] absolute rounded-[15px] border border-white/25 bg-[rgba(9,32,39,0.78)] backdrop-blur-[30px] backdrop-saturate-150 z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.24),0_12px_26px_rgba(0,0,0,0.42)]"></div>
                                                        <div className="h-[85px] inset-x-2 top-[116px] absolute rounded-[15px] bg-gradient-to-b from-white/[0.16] via-white/[0.06] to-black/25 z-[11] pointer-events-none"></div>

                                                        <div className="w-[40px] h-[40px] right-[50px] top-[95px] absolute z-20 rounded-full bg-white/[0.02] backdrop-blur-[1px] p-[4px]">
                                                            <div className="w-full h-full flex items-center justify-center bg-[#008378] rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                                                                <div className="text-white text-[13px] font-extrabold font-['Manrope'] leading-5 tracking-[0.01em]">
                                                                    {club.capacityPercentage && club.capacityPercentage > 0 ? (club.capacityPercentage / 20).toFixed(1) : '4.0'}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="left-[32px] right-[86px] top-[133px] absolute z-20">
                                                            <div className="w-full flex-col justify-center items-start gap-1 inline-flex">
                                                                <div className="self-stretch text-[#14FFEC] text-[24px] font-black font-['Manrope'] leading-[26px] tracking-[0.02em] truncate overflow-hidden whitespace-nowrap">
                                                                    {club.name}
                                                                </div>
                                                                <div className="self-stretch h-3.5 text-white text-xs font-semibold font-['Manrope'] leading-3.5 tracking-[0.01em] truncate overflow-hidden whitespace-nowrap">
                                                                    Open now
                                                                </div>
                                                                {club.location && (
                                                                    <div className="self-stretch text-[#C3C3C3] text-[10px] font-medium font-['Manrope'] leading-3 tracking-[0.1px] truncate overflow-hidden whitespace-nowrap">
                                                                        {club.location}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
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
                                    <h2 className="text-white text-base font-semibold whitespace-nowrap">Events</h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                                    <Link href="/events" className="text-[#14FFEC] text-base font-medium">View All</Link>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide pl-5">
                                    {isLoadingEvents ? (
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="w-[222px] h-[305px] flex-shrink-0 relative rounded-[20px] overflow-hidden bg-gradient-to-r from-[#1a2a2a] via-[#2a3a3a] to-[#1a2a2a] animate-pulse">
                                                <div className="w-full h-[180px] bg-[#0a1a1a]"></div>
                                                <div className="p-4 space-y-2">
                                                    <div className="h-4 bg-[#0a1a1a] rounded w-3/4"></div>
                                                    <div className="h-3 bg-[#0a1a1a] rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        ))
                                    ) : events.length > 0 ? (
                                        events.slice(0, 5).map((event, index) => {
                                            const eventDate = new Date(event.startDateTime);
                                            const monthShort = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                                            const day = eventDate.getDate().toString().padStart(2, '0');
                                            const fallbackImage = eventFallback[index % eventFallback.length]?.image || '/event list/Rectangle 1.jpg';

                                            return (
                                                <Link key={event.id} href={`/event/${event.id}`}>
                                                        <div className="w-[222px] h-[305px] flex-shrink-0 relative rounded-[20px] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity" style={{ background: 'radial-gradient(ellipse 79.96% 39.73% at 22.30% 70.24%, black 0%, #014A4B 100%)' }}>
                                                            {/* Image with blurred padding */}
                                                            <div className="relative">
                                                                {/* Glass morphism backdrop layer */}
                                                                <div className="absolute inset-0 w-full h-[180px]"
                                                                    style={{
                                                                        backgroundImage: event.imageUrl && isValidImageUrl(event.imageUrl) ? `url(${event.imageUrl})` : `url(${fallbackImage})`,
                                                                        backgroundSize: 'cover',
                                                                        backgroundPosition: 'center',
                                                                        filter: 'blur(8px)',
                                                                        opacity: '0.85',
                                                                        borderTopLeftRadius: '20px',
                                                                        borderTopRightRadius: '20px',
                                                                        borderBottomLeftRadius: '20px'
                                                                    }}
                                                                />
                                                                {/* Actual Image */}
                                                                <img
                                                                    src={event.imageUrl && isValidImageUrl(event.imageUrl) ? event.imageUrl : fallbackImage}
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

                                                            {/* Date Badge - positioned on the right */}
                                                            <div className="absolute right-4 top-0 w-[36px] h-[45px] px-[2px] py-[10px] bg-gradient-to-b from-black to-[#00C0CA] rounded-b-[28px] border-l border-r border-[#00C0CA] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center" style={{ borderBottom: 'none' }}>
                                                                <div className="w-[31px] text-center text-white text-[14px] font-semibold font-['Manrope'] leading-4">{monthShort}<br />{day}</div>
                                                            </div>

                                                            {/* Content - positioned in the dark area below image */}
                                                            <div className="absolute left-[18px] right-[60px] top-[192px] h-[68px] w-36 flex flex-col gap-[3px]">
                                                                <span className="font-bold text-[16px] leading-[22px] text-[#e6e6e6] line-clamp-2">
                                                                    {event.title}
                                                                </span>
                                                                <span className="font-bold text-[12px] leading-[17px] text-[#c3c3c3] line-clamp-1">
                                                                    {event.location || event.clubName || 'TBD'}
                                                                </span>
                                                            </div>

                                                        <button className="absolute top-[226px] right-[18px] flex justify-center items-center">
                                                            <Heart className="w-[27px] h-[23px] text-[#14FFEC]" />
                                                        </button>

                                                        {/* Genre section at bottom */}
                                                        <div className="absolute bottom-0 left-0 w-[222px] h-[34px] rounded-br-[20px] rounded-bl-[20px] border-t border-solid border-[#005F57] bg-[#005F57] flex items-center justify-center">
                                                            <span className="font-bold text-[14px] leading-[17px] text-white truncate px-2">
                                                                {event.genre || 'Techno & Bollytech'}
                                                            </span>
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
                                    <div className="mt-[20px] px-[101px] mb-[20px]">
                                        <span className="font-normal text-[48px] leading-[36px] text-center bg-gradient-to-b from-[#14ffec] to-[#030c24] bg-clip-text text-transparent" style={{ fontFamily: 'Zen Tokyo Zoo', letterSpacing: '9px' }}>CLUBWIZ</span>
                                    </div>
                                    <div className="w-[368px] h-[59px] text-center text-white text-base font-normal leading-5 tracking-[0.5px] break-words">
                                        Dive into the ultimate party scene. Discover lit club nights, epic events, and non-stop vibes all in one place!
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
                                                <Link href="/terms" className="w-[231px] h-[18px] text-white text-base font-medium leading-4 tracking-[0.5px] break-words hover:underline">
                                                    Terms & Condition
                                                </Link>
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

            {/* Story Viewer Modal */}
            {isStoryViewerOpen && stories.length > 0 && (
                <StoryViewer
                    stories={stories.map((s: any) => {
                        const id = s.storyId || s.id;
                        const mediaUrl = s.mediaUrl || s.mediaBase64 || '';
                        const clubName = s.club?.name || s.userFullName || 'User Story';
                        const title = s.title || s.caption || clubName || 'Story';
                        const isVideo = s.mediaType === 'VIDEO';

                        return {
                            id: id,
                            image: mediaUrl,
                            title: title,
                            timestamp: s.createdAt ? new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                            duration: isVideo ? undefined : (s.duration || 5),
                            internalStories: [
                                {
                                    id: id,
                                    image: mediaUrl,
                                    duration: isVideo ? undefined : (s.duration || 5),
                                    type: isVideo ? 'video' : 'image'
                                }
                            ]
                        };
                    })}
                    initialIndex={selectedStoryIndex}
                    onClose={() => setIsStoryViewerOpen(false)}
                />
            )}
        </div>
    );
};

export default HomePage;