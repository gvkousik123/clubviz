'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Heart,
    MapPin,
    Star,
    Loader2,
    Share2,
    Bookmark,
    ArrowRight,
    Tag as TagIcon,
    X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useOffers } from '@/hooks/use-offers';
import { isGuestMode } from '@/lib/api-client-public';
import { getSortedClubImages, filterUpcomingEvents } from '@/lib/utils';
import { ClubService } from '@/lib/services/club.service';
import { EventService as PublicEventService } from '@/lib/services';
import { StoryService } from '@/lib/services/story.service';
import { useStories } from '@/hooks/use-stories';
import { StoriesSection } from '@/components/story';
import { StoryViewer } from '@/components/story/story-viewer';
import { StoryOverlay } from '@/components/story/story-overlay';
import { StoryCard } from '@/components/story/story-card';
// Use centralized data store for cached club details
import { useClubDetail } from '@/lib/store';
import { ClubDetailSkeleton } from '@/components/ui/skeleton-loaders';
import { EventService } from '@/lib/services/event.service';

// Tag Component for reusability
const TagComponent = ({ icon, label, iconPath }: { icon?: React.ReactNode, label: string, iconPath?: string }) => (
    <div className="px-3 py-2 bg-[rgba(40,60,61,0.30)] rounded-full flex items-center gap-2">
        {iconPath && <img src={iconPath} alt={label} className="w-4 h-4" />}
        {icon && icon}
        <span className="text-white text-xs">{label}</span>
    </div>
);

// Helper function to format offer type
const formatOfferType = (offerType: string): string => {
    const typeMap: { [key: string]: string } = {
        'BUY_ONE_GET_ONE': 'Buy 1 Get 1',
        'BOGO': 'Buy 1 Get 1',
        'PERCENTAGE_DISCOUNT': '% Discount',
        'FLAT_DISCOUNT': 'Flat Discount',
        'FREE_DRINK': 'Free Drink',
        'FREE_ENTRY': 'Free Entry',
        'HAPPY_HOUR': 'Happy Hour',
        'OTHER': 'Special Offer'
    };
    return typeMap[offerType] || offerType;
};

export default function ClubDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isJoinLoading, setIsJoinLoading] = useState(false);
    const [activeEntryTab, setActiveEntryTab] = useState<'couple' | 'male' | 'female'>('couple');
    const [clubEvents, setClubEvents] = useState<any[]>([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const [clubStories, setClubStories] = useState<any[]>([]);
    const [isLoadingStories, setIsLoadingStories] = useState(false);
    const [showStoryOverlay, setShowStoryOverlay] = useState(false);
    const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
    const [eventFavorites, setEventFavorites] = useState<string[]>([]);
    const [showBookOfflineDialog, setShowBookOfflineDialog] = useState(false);
    const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
    
    // Get club ID first
    const clubId = params.id as string;
    
    // stories for this club
    const { stories, fetchStories } = useStories();
    const { offers, loading: offersLoading, fetchOffers } = useOffers(clubId);
    // ==================== OPTIMIZED: Use cached club data ====================
    // This prevents duplicate API calls when navigating back and forth
    const { club, loading: isLoading, error, refetch } = useClubDetail(clubId);

    // Update liked state when club data changes
    useEffect(() => {
        if (club) {
            setIsLiked(!!club.isJoined);
        }
    }, [club]);

    // Check if club is bookmarked/favorited when page loads
    useEffect(() => {
        if (!clubId || isGuestMode()) return;
        ClubService.isClubFavorited(clubId)
            .then((res: any) => {
                const favorited = res?.favorited ?? res?.data?.favorited ?? false;
                setIsBookmarked(favorited);
            })
            .catch(() => {
                // Silently ignore — user may not be logged in
            });
    }, [clubId]);

    // Fetch offers when club is loaded
    useEffect(() => {
        if (clubId) {
            fetchOffers();
        }
    }, [clubId, fetchOffers]);

    // Fetch events for the club
    const fetchClubEvents = async () => {
        if (!clubId) return;
        setIsLoadingEvents(true);
        try {
            // Call the club events API endpoint with proper parameters
            const response = await PublicEventService.getEventsByClub(clubId, {
                page: 0,
                size: 20,
                sortBy: 'startDateTime',
                sortOrder: 'asc'
            });

            let events: any[] = [];
            // Handle response format from EventService
            if (response && (response as any)?.content) {
                events = (response as any)?.content;
            } else if (response && (response as any)?.data) {
                events = (response as any)?.data;
            } else if (Array.isArray(response)) {
                events = response;
            }

            console.log('📅 All events from API:', events);
            
            // Filter to only show upcoming events using actual date comparison
            const upcomingEvents = filterUpcomingEvents(events);
            console.log('📅 Filtered upcoming events:', upcomingEvents);
            
            setClubEvents(upcomingEvents);
        } catch (err) {
            console.error('Error fetching club events:', err);
            setClubEvents([]);
        } finally {
            setIsLoadingEvents(false);
        }
    };

    // Fetch stories for the club
    const fetchClubStoriesData = async () => {
        if (!clubId) return;
        setIsLoadingStories(true);
        try {
            const response: any = await StoryService.getStoriesByClub(clubId);
            console.log('📖 Stories API Response:', response);
            
            // Handle different response formats
            let storiesData = [];
            
            // Check if response has a message indicating no stories
            if (response?.message && response.message.includes('No stories')) {
                console.log('📭 No stories found for this club');
                storiesData = [];
            }
            // Handle array response
            else if (Array.isArray(response)) {
                storiesData = response;
            }
            // Handle wrapped response with data property
            else if (response?.data && Array.isArray(response.data)) {
                storiesData = response.data;
            }
            // Handle paginated response
            else if (response?.content && Array.isArray(response.content)) {
                storiesData = response.content;
            }
            // Handle wrapped response with stories property
            else if (response?.stories && Array.isArray(response.stories)) {
                storiesData = response.stories;
            }
            
            console.log(`📊 Stories Data after extraction:`, storiesData);
            setClubStories(Array.isArray(storiesData) ? storiesData : []);
            console.log(`✅ Loaded ${storiesData.length} stories for club ${clubId}`);
        } catch (err: any) {
            console.error('❌ Error fetching club stories:', err);
            setClubStories([]);
        } finally {
            setIsLoadingStories(false);
        }
    };

    useEffect(() => {
        if (clubId) {
            fetchClubEvents();
            fetchClubStoriesData();
            fetchStories(0, 50); // load stories once
        }
    }, [clubId, fetchStories]);

    // Load event favorites
    useEffect(() => {
        if (!isGuestMode()) {
            EventService.getFavoriteEvents({ page: 0, size: 100 })
                .then((res: any) => {
                    const list = res?.content || res?.events || [];
                    setEventFavorites(list.map((e: any) => e.id || e.eventId).filter(Boolean));
                })
                .catch(() => {});
        }
    }, []);

    const handleGoBack = () => {
        router.back();
    };

    const handleStoryCircleClick = (index: number) => {
        setSelectedStoryIndex(index);
        setShowStoryOverlay(true);
    };

    const handleToggleEventFavorite = async (eventId: string) => {
        if (isGuestMode()) {
            toast({ title: 'Sign in', description: 'Please sign in to favorite events.' });
            return;
        }
        const isFav = eventFavorites.includes(eventId);
        try {
            if (isFav) {
                await EventService.removeFromFavorites(eventId);
                setEventFavorites(prev => prev.filter(id => id !== eventId));
                toast({ title: 'Removed from favorites', description: 'Event removed from your favorites.' });
            } else {
                await EventService.addToFavorites(eventId);
                setEventFavorites(prev => [...prev, eventId]);
                toast({ title: 'Added to favorites', description: 'Event added to your favorites.' });
            }
        } catch {
            toast({ title: 'Error', description: 'Failed to update event favorites.', variant: 'destructive' });
        }
    };

    // Transform API stories to StoryOverlay format
    const transformStoriesForViewer = (stories: any[]): any[] => {
        return stories.map(story => ({
            id: story.id,
            image: story.mediaUrl || story.mediaUrl1 || story.mediaUrl2 || '',
            title: story.title || story.description || story.caption || 'Story',
            timestamp: story.createdAt || new Date().toISOString(),
            duration: story.duration || 5,
            internalStories: [{
                id: story.id,
                image: story.mediaUrl || story.mediaUrl1 || story.mediaUrl2 || '',
                duration: story.duration || 5,
                type: story.mediaType || 'image'
            }]
        }));
    };

    const handleHeroImageClick = () => {
        if (clubStories && clubStories.length > 0) {
            setShowStoryOverlay(true);
            setSelectedStoryIndex(0);
        }
    };

    const handleShare = async () => {
        try {
            if (navigator?.share) {
                await navigator.share({
                    title: club?.name || 'Club',
                    text: `Check out ${club?.name || 'this club'}!`,
                    url: window.location.href,
                });
                return;
            }

            await navigator.clipboard?.writeText(window.location.href);
            toast({
                title: 'Link copied',
                description: 'Club link copied to your clipboard.',
            });
        } catch (error) {
            console.error('Share failed', error);
        }
    };

    const handleToggleLike = async () => {
        if (isGuestMode()) {
            toast({ title: 'Sign in', description: 'Please sign in to join clubs.' });
            return;
        }

        setIsJoinLoading(true);
        try {
            setIsLiked(!isLiked);
            // TODO: Call join/leave club API when available
            toast({
                title: isLiked ? 'Left club' : 'Joined club',
                description: `You have ${isLiked ? 'left' : 'joined'} the club.`,
            });
        } catch (error: any) {
            setIsLiked(!isLiked);
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setIsJoinLoading(false);
        }
    };

    const nextImage = () => {
        if (!club?.images?.length) return;
        setCurrentImageIndex((prev) => (prev + 1) % (club.images?.length || 1));
    };

    const prevImage = () => {
        if (!club?.images?.length) return;
        const len = club.images?.length || 1;
        setCurrentImageIndex((prev) => (prev - 1 + len) % len);
    };

    const isValidImageUrl = (url: string): boolean => {
        if (!url || typeof url !== 'string') return false;
        if (url.includes('example.com')) return false;
        if (url.includes('placeholder')) return false;
        return true;
    };

    const getEventFallbackImage = (index: number) => {
        const eventImages = [
            '/event list/Rectangle 1.jpg',
            '/event list/Rectangle 2.jpg',
            '/event list/Rectangle 3.jpg'
        ];
        return eventImages[index % eventImages.length];
    };

    const dummyEvents = [
        {
            id: 'dummy-1',
            title: 'Neon Nights: DJ Live Set',
            location: 'Dabo Main Hall',
            clubName: club?.name || 'Dabo',
            startDateTime: new Date().toISOString(),
            genre: 'EDM',
            imageUrl: ''
        },
        {
            id: 'dummy-2',
            title: 'Bollywood Bash',
            location: 'Dabo Rooftop',
            clubName: club?.name || 'Dabo',
            startDateTime: new Date(Date.now() + 86400000).toISOString(),
            genre: 'Bollywood',
            imageUrl: ''
        },
        {
            id: 'dummy-3',
            title: 'Retro Vibes Night',
            location: 'Dabo Lounge',
            clubName: club?.name || 'Dabo',
            startDateTime: new Date(Date.now() + 2 * 86400000).toISOString(),
            genre: 'Retro',
            imageUrl: ''
        }
    ];

    const handleApplyOffer = (offer: any) => {
        if (offer.promoCode) {
            // Copy promo code to clipboard
            navigator.clipboard.writeText(offer.promoCode);
            toast({
                title: 'Promo code copied',
                description: `Code "${offer.promoCode}" copied to clipboard. Use it during booking!`,
            });
        } else {
            toast({
                title: 'Offer applied',
                description: `${offer.title} has been applied to your booking.`,
            });
        }
    };

    if (isLoading) {
        // Use skeleton loading for better UX
        return <ClubDetailSkeleton />;
    }

    if (error || !club) {
        return (
            <div className="min-h-screen bg-[#021313] flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-[#0D1F1F] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">😕</span>
                    </div>
                    <p className="text-white mb-2 text-lg font-semibold">{error || 'Club not found'}</p>
                    <p className="text-[#B6B6B6] mb-6 text-sm">Unable to load club details. Please try again.</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => refetch()}
                            className="bg-[#14FFEC] text-black px-6 py-2 rounded-full font-medium hover:brightness-90 transition"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={handleGoBack}
                            className="bg-[#0D1F1F] text-[#14FFEC] px-6 py-2 rounded-full font-medium hover:brightness-110 transition flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Get images - Match home page logic
    let heroImages: string[] = [];

    // Extract and sort images with MAIN_IMAGE first
    if (club.images && club.images.length > 0) {
        heroImages = getSortedClubImages(club.images, []);
    }

    // If no images array, try logo/logoUrl (same as home page uses club.logo)
    if (heroImages.length === 0) {
        const logoImage = club.logo || club.logoUrl;
        if (logoImage) {
            heroImages = [logoImage];
        }
    }

    // Final fallback
    if (heroImages.length === 0) {
        heroImages = ['/venue/Screenshot 2024-12-10 195651.png'];
    }

    console.log('🎨 Final heroImages:', heroImages);

    // Format address
    const getAddress = () => {
        if (club.locationText?.fullAddress) return club.locationText.fullAddress;
        const parts = [
            club.locationText?.address1,
            club.locationText?.address2,
            club.locationText?.city,
            club.locationText?.state
        ].filter(Boolean);
        return parts.join(', ') || club.location || 'Address not available';
    };

    const locationLat = club.locationMap?.lat;
    const locationLng = club.locationMap?.lng;
    const addressText = getAddress() === 'Address not available'
        ? 'House 1913/B/1, Yogesham CHS, Wardha Road, Nagpur'
        : getAddress();
    const locationQuery = encodeURIComponent(addressText);
    const mapsHref = locationLat && locationLng
        ? `https://www.google.com/maps?q=${locationLat},${locationLng}`
        : `https://www.google.com/maps/search/?api=1&query=${locationQuery}`;
    const staticMapUrl = locationLat && locationLng
        ? `https://staticmap.openstreetmap.de/staticmap.php?center=${locationLat},${locationLng}&zoom=16&size=600x240&markers=${locationLat},${locationLng},red-pushpin`
        : `/location/location-map-placeholder.svg`;

    return (
        <div className="min-h-screen bg-[#021313] relative w-full max-w-[430px] mx-auto">
            {/* Hero Image Carousel */}
            <div 
                className={`relative w-[430px] h-[391px] bg-gray-900 overflow-hidden flex justify-center items-center mx-auto ${clubStories && clubStories.length > 0 ? 'cursor-pointer' : ''}`}
                onClick={handleHeroImageClick}
            >
                <div className="absolute inset-0 flex">
                    {heroImages.map((image, index) => (
                        <img
                            key={`${club.id}-${index}`}
                            data-fullscreen="true"
                            className="min-w-full h-full object-cover transition-transform duration-300 cursor-pointer"
                            src={image}
                            alt={`${club.name} - Image ${index + 1}`}
                            style={{
                                transform: `translateX(${(index - currentImageIndex) * 100}%)`,
                            }}
                            onError={(e) => {
                                console.error('❌ Image failed to load:', image);
                                e.currentTarget.src = '/venue/Screenshot 2024-12-10 195651.png';
                            }}
                        />
                    ))}
                </div>

                {/* Navigation arrows (only if multiple images) */}
                {heroImages.length > 1 && (
                    <>
                        <button 
                            onClick={prevImage} 
                            className="absolute left-[14px] top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition z-10"
                        >
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <button 
                            onClick={nextImage} 
                            className="absolute right-[14px] top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition z-10"
                        >
                            <ChevronRight className="w-6 h-6 text-black" />
                        </button>
                    </>
                )}

                {/* Stories Indicator Badge */}
                {clubStories && clubStories.length > 0 && (
                    <div className="absolute bottom-4 right-4 z-20 bg-[#14FFEC] text-black px-3 py-1 rounded-full flex items-center gap-2">
                        <span className="text-xs font-bold">{clubStories.length} Stories</span>
                    </div>
                )}

                {/* Back button */}
                <button
                    onClick={handleGoBack}
                    className="absolute left-4 top-4 w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center hover:bg-white/30 transition z-10"
                >
                    <ArrowLeft className="h-5 w-5 text-white" />
                </button>
            </div>

            {/* Main Content Section */}
            <div 
                className="w-full bg-[#021313] rounded-tl-[40px] rounded-tr-[40px] rounded-br-[20px] rounded-bl-[20px] pb-8 relative"
                style={{ marginTop: '-32px', position: 'relative', zIndex: 10 }}
            >
                {/* Club Logo Circle - Centered at top, half outside - ONLY if stories exist */}
                {clubStories && clubStories.length > 0 ? (
                    <div 
                        onClick={() => {
                            setSelectedStoryIndex(0);
                            setShowStoryOverlay(true);
                        }}
                        className="absolute flex items-center gap-2.5 p-1 rounded-[36px] border-2 border-solid border-[#14FFEC] bg-[#021313] cursor-pointer hover:opacity-80 transition"
                        style={{
                            top: '-36px',
                            left: '50%',
                            transform: 'translateX(-50%)'
                        }}
                    >
                        <img
                            src={club.logo || ''}
                            alt={club.name}
                            className="w-16 h-16 object-cover rounded-[45px]"
                            onError={(e) => (e.currentTarget.src = heroImages[0])}
                        />
                    </div>
                ) : (
                    // No colored border if no stories
                    <div 
                        className="absolute flex items-center gap-2.5 p-1 rounded-[36px] bg-[#021313]"
                        style={{
                            top: '-36px',
                            left: '50%',
                            transform: 'translateX(-50%)'
                        }}
                    >
                        <img
                            src={club.logo || ''}
                            alt={club.name}
                            className="w-16 h-16 object-cover rounded-[45px]"
                            onError={(e) => (e.currentTarget.src = heroImages[0])}
                        />
                    </div>
                )}
                {/* Rating Circle - Below the logo */}
                {/* <div 
                    className="absolute w-[38px] h-[38px] bg-[#005d5c] rounded-[30px] flex items-center justify-center"
                    style={{
                        top: '24px',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}
                >
                   <span className="font-bold text-[16px] leading-[21px] text-center text-[#fff4f4]">
                        {clubStories && clubStories.length > 0 ? clubStories.length : (club.rating || 0)}
                    </span>
                </div> */}

                {/* Club Name */}
                <div 
                    className="px-[29px] text-center"
                    style={{ paddingTop: '79px' }}
                >
                    <span className="font-extrabold text-[36px] leading-[20px] text-center text-white" style={{ fontFamily: "'Anton SC', sans-serif" }}>
                        {club.name}
                    </span>
                </div>
                {/* Share and Save Buttons */}
                <div 
                    className="flex justify-center items-center gap-3 w-full"
                    style={{ paddingTop: '25px', paddingBottom: '9px' }}
                >
                    {/* Share Button */}
                    <button
                        onClick={handleShare}
                        className="w-10 h-10 flex justify-center items-center rounded-full bg-[rgba(20,255,236,0.15)] hover:bg-[rgba(20,255,236,0.25)] transition"
                    >
                        <Share2 size={20} className="text-[#14ffec]" />
                    </button>

                    {/* Save Button */}
                    <button
                        onClick={async () => {
                            if (isGuestMode()) {
                                toast({ title: 'Sign in', description: 'Please sign in to save clubs.' });
                                return;
                            }
                            setIsBookmarked(!isBookmarked);
                            try {
                                if (isBookmarked) {
                                    // Remove from favorites
                                    await ClubService.removeClubFromFavorites(clubId);
                                    toast({
                                        title: 'Removed',
                                        description: `${club.name} has been removed from your favorites.`,
                                    });
                                } else {
                                    // Add to favorites
                                    await ClubService.addClubToFavorites(clubId);
                                    toast({
                                        title: 'Saved',
                                        description: `${club.name} has been added to your favorites.`,
                                    });
                                }
                            } catch (error: any) {
                                setIsBookmarked(!isBookmarked);
                                toast({ 
                                    title: 'Error', 
                                    description: error.message || 'Failed to update favorites',
                                    variant: 'destructive'
                                });
                            }
                        }}
                        className="w-10 h-10 flex justify-center items-center rounded-full bg-[rgba(20,255,236,0.15)] hover:bg-[rgba(20,255,236,0.25)] transition"
                    >
                        <Bookmark 
                            size={20} 
                            className={`text-[#14ffec] ${isBookmarked ? 'fill-current' : ''}`}
                        />
                    </button>
                </div>

                {/* Booking Tabs */}
                <div 
                    className="w-[398px] flex justify-center items-center gap-[7px] mx-auto"
                    style={{ paddingTop: '9px', paddingBottom: '16px' }}
                >
                    {/* Reserve your spot Button */}
                    <button 
                        onClick={() => {
                            sessionStorage.setItem('currentClubData', JSON.stringify(club));
                            router.push(`/booking/slot?clubId=${clubId}`);
                        }}
                        className="w-48 flex justify-center items-center gap-2.5 px-6 py-[11px] rounded-[25px] bg-[#005d5c] hover:bg-[#007c7b] transition"
                    >
                        <span className="font-bold text-[16px] leading-[16px] text-white">Reserve your spot</span>
                    </button>

                    {/* Book offline Button */}
                    <button 
                        onClick={() => setShowBookOfflineDialog(true)}
                        className="w-36 flex justify-center items-center gap-2.5 px-6 py-[11px] rounded-[25px] bg-[#005d5c] hover:bg-[#007c7b] transition"
                    >
                        <span className="font-bold text-[16px] leading-[16px] text-white">Book offline</span>
                    </button>
                </div>
                <div className="w-full" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                    <div className="w-full flex flex-col justify-center items-center gap-[11px] bg-[rgba(40,60,61,0.3)] py-[15px] rounded-[15px]" style={{ paddingLeft: '17px', paddingRight: '17px' }}>
                        
                        {/* Now Playing section removed implementation pending (BUG-U07) */}

                        {/* Today's Offers */}
                        <div className="flex flex-col items-center self-stretch">
                            <div className="flex items-center gap-2.5 self-stretch mb-[12px]">
                                <TagIcon className="w-4 h-4 text-[#14FFEC]" />
                                <span className="font-semibold text-[14px] leading-[16px] text-white">Today's Offers</span>
                            </div>
                            {offers && offers.length > 0 ? (
                                <div className="self-stretch h-auto bg-[#202b2b] rounded-[15px] p-[10px] flex flex-col gap-[10px]">
                                    {offers.slice(0, 3).map((offer: any, i: number) => (
                                        <div key={i} className="bg-gradient-to-r from-[rgba(20,255,236,0.08)] to-[rgba(20,255,236,0.04)] border border-[#14FFEC]/40 rounded-[12px] p-3 flex flex-col gap-2 hover:border-[#14FFEC]/60 transition">
                                            {/* Offer Header - Type and Title */}
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <div className="inline-block bg-[#14FFEC]/20 text-[#14FFEC] text-[10px] font-bold px-2 py-1 rounded-full mb-1.5">
                                                        {formatOfferType(offer.offerType)}
                                                    </div>
                                                    <p className="text-white text-xs font-semibold leading-tight">
                                                        {offer.title}
                                                    </p>
                                                </div>
                                                {offer.discountPercentage > 0 && (
                                                    <div className="flex-shrink-0 text-right">
                                                        <p className="text-[#14FFEC] text-sm font-bold">
                                                            {offer.discountPercentage}%
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Offer Description */}
                                            {offer.description && (
                                                <p className="text-[#B6B6B6] text-[11px] leading-tight line-clamp-2">
                                                    {offer.description}
                                                </p>
                                            )}

                                            {/* Offer Details Footer */}
                                            {(offer.minimumAmount || offer.promoCode) && (
                                                <div className="flex items-center justify-between text-[10px] text-[#9B9B9B] pt-1.5 border-t border-[#14FFEC]/20">
                                                    {offer.minimumAmount && (
                                                        <span>Min: ₹{offer.minimumAmount}</span>
                                                    )}
                                                    {offer.promoCode && (
                                                        <span className="text-[#14FFEC] font-semibold">Code: {offer.promoCode}</span>
                                                    )}
                                                </div>
                                            )}


                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="self-stretch h-[74px] bg-[#202b2b] rounded-[15px] p-[10px] flex items-center justify-center">
                                    <span className="text-white text-sm">No offers available today</span>
                                </div>
                            )}
                        </div>

                        {/* Entry/Booking - Only show if club has events */}
                        {clubEvents && clubEvents.length > 0 && (
                        <div className="flex flex-col items-center self-stretch">
                            <div className="flex items-center gap-2.5 self-stretch mb-[12px]">
                                <TagIcon className="w-4 h-4 text-[#14FFEC]" />
                                <span className="font-semibold text-[14px] leading-[16px] text-white">Entry Charges</span>
                            </div>
                            <div className="self-stretch bg-[#202b2b] rounded-[15px] p-[10px] flex flex-col">
                                {/* Tabs */}
                                <div className="flex gap-2 mb-3">
                                    {['couple', 'male', 'female'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveEntryTab(tab as 'couple' | 'male' | 'female')}
                                            className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                                                activeEntryTab === tab
                                                    ? 'bg-[#14FFEC] text-black'
                                                    : 'bg-[#0D2C2C] text-white hover:bg-[#0D3C3C]'
                                            }`}
                                        >
                                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        </button>
                                    ))}
                                </div>
                                {/* Entry Details */}
                                {club.entryCharges && club.entryCharges[activeEntryTab] && (
                                    <div className="bg-[#263438] rounded-[10px] p-2">
                                        <p className="text-white text-sm font-semibold">₹{club.entryCharges[activeEntryTab]}</p>
                                    </div>
                                )}
                                
                                {/* Redeemable Cover Display */}
                                {club.entryPricing && (
                                    <div className="mt-3 pt-3 border-t border-[#14FFEC]/30">
                                        {(() => {
                                            let redeemDetails = '';
                                            if (activeEntryTab === 'couple') {
                                                redeemDetails = club.entryPricing.coupleRedeemDetails || club.entryPricing.redeemDetails || '';
                                            } else if (activeEntryTab === 'male') {
                                                redeemDetails = club.entryPricing.maleStagRedeemDetails || club.entryPricing.redeemDetails || '';
                                            } else {
                                                redeemDetails = club.entryPricing.femaleStagRedeemDetails || club.entryPricing.redeemDetails || '';
                                            }
                                            
                                            if (!redeemDetails) return null;
                                            
                                            return (
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white text-xs font-semibold">Redeemable Cover:</span>
                                                        <span className="text-[#14FFEC] text-xs font-bold">{redeemDetails}</span>
                                                    </div>
                                                    {club.entryPricing.timeRestriction && (
                                                        <p className="text-[#B6B6B6] text-xs">{club.entryPricing.timeRestriction}</p>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        </div>
                        )}

                    </div>
                </div>

                {/* Events In Club */}
                <div className="w-full" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '16px' }}>
                    <div className="flex flex-col items-center self-stretch">
                        <div className="flex items-center gap-2.5 self-stretch mb-[16px]">
                            <span className="font-semibold text-[16px] leading-[16px] text-[#fffeff]">Events In {club.name}</span>
                        </div>

                        {/* Events Cards */}
                        {isLoadingEvents ? (
                            <div className="flex items-center justify-center w-full py-8">
                                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
                            </div>
                        ) : clubEvents && clubEvents.length > 0 ? (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide w-full">
                                {filterUpcomingEvents(clubEvents).slice(0, 5).map((event, index) => {
                                    const eventDate = new Date(event.startDateTime);
                                    const monthShort = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                                    const day = eventDate.getDate().toString().padStart(2, '0');
                                    const fallbackImage = getEventFallbackImage(index);

                                    return (
                                        <Link key={event.id || index} href={`/event/${event.id}`}>
                                            <div className="w-[222px] h-[305px] flex-shrink-0 relative rounded-[20px] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity" style={{ background: 'radial-gradient(ellipse 79.96% 39.73% at 22.30% 70.24%, black 0%, #014A4B 100%)' }}>
                                                {/* Image */}
                                                <div className="relative">
                                                    <img
                                                        src={event.imageUrl || fallbackImage}
                                                        alt={event.title}
                                                        className="w-full h-[180px] object-contain bg-gray-900"
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
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleToggleEventFavorite(event.id);
                                                        }}
                                                        className="w-[34px] h-[34px] p-[5px] bg-neutral-300/10 rounded-[22px] backdrop-blur-[35px] flex justify-center items-center flex-shrink-0"
                                                    >
                                                        <Heart className={`w-5 h-5 ${eventFavorites.includes(event.id) ? 'fill-[#14FFEC] text-[#14FFEC]' : 'text-[#14FFEC]'}`} />
                                                    </button>
                                                </div>

                                                <div className="absolute left-[18px] right-[18px] top-[249px]">
                                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#14FFEC] to-transparent"></div>
                                                </div>

                                                <div className="absolute left-[18px] right-[18px] top-[262px] text-white text-[11px] font-bold font-['Manrope'] leading-[15px] tracking-[0.01em] truncate">
                                                    {event.formattedDate || 'Event'}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="w-full h-[150px] bg-[rgba(40,60,61,0.3)] rounded-[15px] flex items-center justify-center">
                                <span className="text-white text-sm">No upcoming events</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Photos */}
                <div className="w-full" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '16px' }}>
                    <div className="flex flex-col items-center self-stretch">
                        <div className="flex items-center gap-2.5 self-stretch mb-[16px]">
                            <span className="font-semibold text-[16px] leading-[16px] text-[#fffeff]">Photos</span>
                        </div>

                        {heroImages && heroImages.length > 0 ? (
                            <div className="w-full max-w-[398px] mx-auto bg-[rgba(40,60,61,0.3)] p-4 rounded-[15px]">
                                <div className="flex flex-col gap-3 w-full">
                                    {heroImages.slice(0, 5).map((img, i) => (
                                        <div
                                            key={i}
                                            className={`${i === 0 ? 'w-full h-40' : 'w-full h-24'} bg-gray-700 rounded-[15px] relative overflow-hidden cursor-pointer`}
                                            onClick={() => { setSelectedPhotoIndex(i); setPhotoViewerOpen(true); }}
                                        >
                                            <img
                                                src={img}
                                                alt={`Gallery ${i + 1}`}
                                                data-fullscreen="true"
                                                className="w-full h-full object-cover rounded-[15px] hover:scale-105 transition-transform duration-300"
                                            />
                                            {i === 4 && heroImages.length > 5 && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[15px]">
                                                    <span className="text-white text-lg font-bold">+{heroImages.length - 5}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full max-w-[398px] mx-auto bg-[rgba(40,60,61,0.3)] p-4 rounded-[15px] flex items-center justify-center h-[150px]">
                                <span className="text-white text-sm">No photos available</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Location */}
                <div className="w-full" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '16px' }}>
                    <div className="flex flex-col items-center self-stretch">
                        <div className="flex items-center gap-2.5 self-stretch mb-[16px]">
                            <span className="font-semibold text-[16px] leading-[16px] text-[#fffeff]">Location</span>
                        </div>

                        <div className="w-full max-w-[398px] mx-auto bg-[rgba(40,60,61,0.3)] rounded-[15px] overflow-hidden">
                            {/* Map Container */}
                            <div className="relative w-full h-[200px] bg-gray-700 overflow-hidden">
                                {/* Map Pin - Positioned above center */}
                                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
                                    <div className="flex flex-col items-center">
                                        <MapPin className="w-8 h-8 text-[#FF3B3B] drop-shadow-lg" fill="#FF3B3B" />
                                    </div>
                                </div>
                                
                                {/* Map Image */}
                                <img
                                    src="https://staticmapmaker.com/img/google-placeholder.png"
                                    alt="Club Location Map"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Address Info Below Map */}
                            <div className="p-4 flex flex-col gap-3">
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-5 h-5 text-[#FF3B3B] flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-white text-sm font-semibold">Address</p>
                                        <a 
                                            href={mapsHref} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-[#14FFEC] text-xs hover:underline break-words"
                                        >
                                            {addressText}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Facilities */}
                <div className="w-full" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '16px' }}>
                    <div className="flex flex-col items-center self-stretch">
                        <div className="flex items-center gap-2.5 self-stretch mb-[16px]">
                            <span className="font-semibold text-[16px] leading-[16px] text-[#fffeff]">Facilities</span>
                        </div>

                        {club.facilities && club.facilities.length > 0 ? (
                            <div className="flex flex-col justify-end gap-3.5 self-stretch bg-[rgba(40,60,61,0.3)] pl-5 pr-[22px] pt-3 pb-[18px] rounded-[17px]">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-[9px] self-stretch">
                                    {club.facilities.map((facility: any, i: number) => (
                                        <TagComponent key={i} label={facility} icon={<Star className="w-3 h-3" />} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full bg-[rgba(40,60,61,0.3)] rounded-[15px] p-4 flex items-center justify-center h-[100px]">
                                <span className="text-white text-sm">No facilities information available</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Food */}
                <div className="w-full" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '16px' }}>
                    <div className="flex flex-col items-center self-stretch">
                        <div className="flex items-center gap-2.5 self-stretch mb-[16px]">
                            <span className="font-semibold text-[16px] leading-[16px] text-[#fffeff]">Food</span>
                        </div>

                        {club.foodCuisines && club.foodCuisines.length > 0 ? (
                            <div className="flex flex-col gap-3.5 self-stretch bg-[rgba(40,60,61,0.3)] pl-[21px] pr-3.5 pt-3 pb-3 rounded-[17px]">
                                <div className="flex flex-wrap gap-x-3 gap-y-[9px] self-stretch">
                                    {club.foodCuisines.map((food: any, i: number) => (
                                        <TagComponent key={i} label={food} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full bg-[rgba(40,60,61,0.3)] rounded-[15px] p-4 flex items-center justify-center h-[100px]">
                                <span className="text-white text-sm">No food/cuisine information available</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Music */}
                <div className="w-full" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '16px' }}>
                    <div className="flex flex-col items-center self-stretch">
                        <div className="flex items-center gap-2.5 self-stretch mb-[16px]">
                            <span className="font-semibold text-[16px] leading-[16px] text-[#fffeff]">Music</span>
                        </div>

                        {club.music && club.music.length > 0 ? (
                            <div className="flex flex-col gap-3.5 self-stretch bg-[rgba(40,60,61,0.3)] pl-[21px] pr-[22px] pt-3 pb-3 rounded-[17px]">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-[9px] self-stretch">
                                    {club.music.map((genre: any, i: number) => (
                                        <TagComponent key={i} label={genre} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full bg-[rgba(40,60,61,0.3)] rounded-[15px] p-4 flex items-center justify-center h-[100px]">
                                <span className="text-white text-sm">No music genres information available</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bar */}
                <div className="w-full" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '16px' }}>
                    <div className="flex flex-col items-center self-stretch">
                        <div className="flex items-center gap-2.5 self-stretch mb-[16px]">
                            <span className="font-semibold text-[16px] leading-[16px] text-[#fffeff]">Bar</span>
                        </div>

                        {club.barOptions && club.barOptions.length > 0 ? (
                            <div className="flex flex-col gap-3.5 self-stretch bg-[rgba(40,60,61,0.3)] pl-[21px] pr-[22px] pt-3 pb-3 rounded-[17px]">
                                <div className="flex flex-wrap gap-x-3 gap-y-[9px] self-stretch">
                                    {club.barOptions.map((option: any, i: number) => (
                                        <TagComponent key={i} label={option} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full bg-[rgba(40,60,61,0.3)] rounded-[15px] p-4 flex items-center justify-center h-[100px]">
                                <span className="text-white text-sm">No bar information available</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Leave a review */}
                <div className="w-full" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '16px', paddingBottom: '32px' }}>
                    <Link
                        href={`/review/write?clubId=${encodeURIComponent(clubId)}`}
                        className="w-full max-w-[398px] h-12 relative flex items-center bg-[#283c3d] px-4 rounded-2xl mx-auto hover:bg-[#2f4647] transition-colors"
                        aria-label="Write a review"
                    >
                        <span className="font-medium text-[16px] leading-[21px] text-white whitespace-nowrap">Leave a review</span>
                        <div className="absolute right-[14.25px] w-6 h-6 rounded-full bg-[#14ffec] flex items-center justify-center pointer-events-none">
                            <ArrowRight className="w-[19.500003814697266px] h-[19.500003814697266px] text-black" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Story Overlay Modal */}
            <StoryOverlay
                isOpen={showStoryOverlay}
                stories={transformStoriesForViewer(clubStories || [])}
                initialIndex={selectedStoryIndex}
                onClose={() => setShowStoryOverlay(false)}
            />

            {/* Book Offline Dialog */}
            {showBookOfflineDialog && (
                <div className="fixed inset-0 z-50 flex items-end justify-center">
                    <div className="absolute inset-0 bg-black/70" onClick={() => setShowBookOfflineDialog(false)} />
                    <div className="relative w-full bg-[#0D1F1F] rounded-t-3xl p-6 z-10 border-t border-[#14FFEC]/30">
                        <h2 className="text-white text-xl font-bold font-['Manrope'] text-center mb-2">Book Offline</h2>
                        <p className="text-white/60 text-sm text-center mb-6">Choose how you'd like to get in touch</p>
                        <div className="flex flex-col gap-3">
                            <a
                                href="https://wa.me/917972343009"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-[50px] rounded-full bg-[#25D366] flex items-center justify-center gap-2 hover:bg-[#1ebe5d] transition"
                                onClick={() => setShowBookOfflineDialog(false)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                <span className="text-white font-bold text-sm">Chat on WhatsApp</span>
                            </a>
                            <a
                                href="tel:7972343009"
                                className="w-full h-[50px] rounded-full bg-[#005D5C] border border-[#14FFEC]/50 flex items-center justify-center gap-2 hover:bg-[#007c7b] transition"
                                onClick={() => setShowBookOfflineDialog(false)}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63 19.79 19.79 0 01.07 2 2 2 0 012.06 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.28-.84a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                                <span className="text-white font-bold text-sm">Call Now</span>
                            </a>
                        </div>
                        <button
                            onClick={() => setShowBookOfflineDialog(false)}
                            className="mt-4 w-full h-[44px] rounded-full border border-white/20 text-white/60 text-sm hover:bg-white/5 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Full-size Photo Viewer */}
            {photoViewerOpen && heroImages.length > 0 && (
                <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                    <button
                        onClick={() => setPhotoViewerOpen(false)}
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    <button
                        onClick={() => setSelectedPhotoIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>

                    <img
                        src={heroImages[selectedPhotoIndex]}
                        alt={`Photo ${selectedPhotoIndex + 1}`}
                        className="max-w-full max-h-full w-auto h-auto object-contain"
                    />

                    <button
                        onClick={() => setSelectedPhotoIndex((prev) => (prev + 1) % heroImages.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                        {selectedPhotoIndex + 1} / {heroImages.length}
                    </div>
                </div>
            )}
        </div>
    );
}
