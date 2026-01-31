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
    Tag as TagIcon,
    SquarePercent as SealPercent
} from 'lucide-react';
import { ShareNetwork, BookmarkSimple } from '@phosphor-icons/react';
import { useToast } from '@/hooks/use-toast';
import { useOffers } from '@/hooks/use-offers';
import { PublicClubService, PublicEventService, PublicClubDetails } from '@/lib/services/public.service';
import { isGuestMode } from '@/lib/api-client-public';

// Tag Component for reusability
const TagComponent = ({ icon, label, iconPath }: { icon?: React.ReactNode, label: string, iconPath?: string }) => (
    <div className="px-3 py-2 bg-[rgba(40,60,61,0.30)] rounded-full flex items-center gap-2">
        {iconPath && <img src={iconPath} alt={label} className="w-4 h-4" />}
        {icon && icon}
        <span className="text-white text-xs">{label}</span>
    </div>
);

export default function ClubDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const [club, setClub] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isJoinLoading, setIsJoinLoading] = useState(false);
    const [activeEntryTab, setActiveEntryTab] = useState<'couple' | 'male' | 'female'>('couple');
    const [clubEvents, setClubEvents] = useState<any[]>([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);

    // Get club ID and initialize offers hook
    const clubId = params.id as string;
    const { offers, loading: offersLoading, fetchOffers } = useOffers(clubId);

    // Fetch club details
    const fetchClubDetails = async () => {
        if (!params.id) return;

        setIsLoading(true);
        try {
            const clubId = params.id as string;
            console.log('🔍 Fetching club from /clubs/public/{id}:', clubId);
            console.log('📍 Full params:', params);

            // Always use public endpoint for club details (works for both guest and authenticated users)
            let clubData = await PublicClubService.getPublicClubById(clubId);
            console.log('✅ Club data received:');
            console.log('   - Club ID:', clubData?.id);
            console.log('   - Club Name:', clubData?.name);
            console.log('   - Club images array:', clubData?.images);
            console.log('   - Club logo:', clubData?.logo);
            console.log('   - Club logoUrl:', clubData?.logoUrl);
            console.log('   - Full club data:', clubData);

            if (clubData) {
                setClub(clubData);
                setIsLiked(!!clubData.isJoined);
                setError(null);
            } else {
                setError('Club not found');
            }
        } catch (err: any) {
            console.error("💥 Error fetching club details:", err);
            setError(err.message || 'Failed to load club details');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClubDetails();
    }, [params.id]);

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
            const eventsData = await PublicEventService.getEventsByClub(clubId);
            if (eventsData && eventsData.content) {
                setClubEvents(eventsData.content);
            } else if (Array.isArray(eventsData)) {
                setClubEvents(eventsData);
            }
        } catch (err) {
            console.error('Error fetching club events:', err);
            setClubEvents([]);
        } finally {
            setIsLoadingEvents(false);
        }
    };

    useEffect(() => {
        if (clubId) {
            fetchClubEvents();
        }
    }, [clubId]);

    const handleGoBack = () => {
        console.log('Going back from club page...');
        router.back();
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
        setCurrentImageIndex((prev) => (prev + 1) % club.images.length);
    };

    const prevImage = () => {
        if (!club?.images?.length) return;
        setCurrentImageIndex((prev) => (prev - 1 + club.images.length) % club.images.length);
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
        return (
            <div className="min-h-screen bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        );
    }

    if (error || !club) {
        return (
            <div className="min-h-screen bg-[#021313] flex flex-col items-center justify-center p-4">
                <p className="text-white mb-4">{error || 'Club not found'}</p>
                <button onClick={handleGoBack} className="text-[#14FFEC] flex items-center gap-2 hover:opacity-80">
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
            </div>
        );
    }

    // Get images - Match home page logic
    let heroImages: string[] = [];
    
    // First try to get from images array
    if (club.images?.length > 0) {
        heroImages = club.images
            .map((img: any) => (typeof img === 'string' ? img : img?.url))
            .filter(Boolean);
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

    return (
        <div className="min-h-screen bg-[#021313] relative w-full max-w-[430px] mx-auto">
            {/* Hero Image Carousel */}
            <div className="relative w-[430px] h-[391px] bg-gray-900 overflow-hidden flex justify-center items-center mx-auto">
                <div className="absolute inset-0 flex">
                    {heroImages.map((image, index) => (
                        <img
                            key={`${club.id}-${index}`}
                            className="min-w-full h-full object-cover transition-transform duration-300"
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
                {/* Club Logo Circle - Centered at top, half outside */}
                <div 
                    className="absolute flex items-center gap-2.5 p-1 rounded-[36px] border-2 border-solid border-[#14FFEC] bg-[#021313]"
                    style={{
                        top: '-36px',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}
                >
                    <img
                        src={club.logo || club.logoUrl || heroImages[0]}
                        alt={club.name}
                        className="w-16 h-16 object-cover rounded-[45px]"
                        onError={(e) => (e.currentTarget.src = heroImages[0])}
                    />
                </div>

                {/* Rating Circle - Below the logo */}
                <div 
                    className="absolute w-[38px] h-[38px] bg-[#005d5c] rounded-[30px] flex items-center justify-center"
                    style={{
                        top: '24px',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}
                >
                    <span className="font-bold text-[16px] leading-[21px] text-center text-[#fff4f4]">
                        {club.rating || 4.0}
                    </span>
                </div>

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
                        <ShareNetwork size={20} className="text-[#14ffec]" weight="fill" />
                    </button>

                    {/* Save Button */}
                    <button
                        onClick={() => {
                            setIsBookmarked(!isBookmarked);
                            toast({
                                title: isBookmarked ? 'Removed' : 'Saved',
                                description: `${club.name} has been ${isBookmarked ? 'removed from' : 'added to'} your favorites.`,
                            });
                        }}
                        className="w-10 h-10 flex justify-center items-center rounded-full bg-[rgba(20,255,236,0.15)] hover:bg-[rgba(20,255,236,0.25)] transition"
                    >
                        <BookmarkSimple 
                            size={20} 
                            className="text-[#14ffec]" 
                            weight={isBookmarked ? "fill" : "regular"} 
                        />
                    </button>
                </div>

                {/* Booking Tabs */}
                <div 
                    className="w-[398px] flex justify-center items-center gap-[7px] mx-auto"
                    style={{ paddingTop: '9px', paddingBottom: '16px' }}
                >
                    {/* Reserve your spot Button */}
                    <button className="w-48 flex justify-center items-center gap-2.5 px-6 py-[11px] rounded-[25px] bg-[#005d5c] hover:bg-[#007c7b] transition">
                        <span className="font-bold text-[16px] leading-[16px] text-white">Reserve your spot</span>
                    </button>

                    {/* Book offline Button */}
                    <button className="w-36 flex justify-center items-center gap-2.5 px-6 py-[11px] rounded-[25px] bg-[#005d5c] hover:bg-[#007c7b] transition">
                        <span className="font-bold text-[16px] leading-[16px] text-white">Book offline</span>
                    </button>
                </div>

                {/* Club Details Section */}
                <div className="w-full" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                    <div className="w-full flex flex-col justify-center items-center gap-[11px] bg-[#283c3d] py-[15px] rounded-[15px]" style={{ paddingLeft: '17px', paddingRight: '17px' }}>
                        
                        {/* Now Playing */}
                        <div className="flex flex-col self-stretch">
                            <div className="flex items-center gap-2.5 self-stretch mb-4">
                                <span className="font-semibold text-[16px] leading-[16px] text-[#fffeff]">Now Playing</span>
                            </div>
                                
                                {/* Music Player Card */}
                                <div className="w-full h-[74px] bg-[#202b2b] flex items-center relative p-0 rounded-tl-[38px] rounded-bl-[38px] rounded-tr-[26px] rounded-br-[26px]">
                                    {/* Circle with Play Button and Equalizer */}
                                    <div 
                                        className="w-[60px] h-[60px] bg-[#005d5c] rounded-full flex items-center justify-center relative flex-shrink-0"
                                        style={{ marginLeft: '8px' }}
                                    >
                                        {/* Play Button Icon */}
                                        <svg 
                                            className="w-[25px] h-[25px] text-[#14ffec] absolute z-10" 
                                            fill="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        
                                        {/* Lottie Equalizer Animation */}
                                        <div className="absolute w-[44px] h-[20px] right-0 bottom-0">
                                            <dotlottie-wc
                                                src="https://lottie.host/95803dac-2a7e-46e0-99a5-bc229b9c1370/7JqBdwTfa5.lottie"
                                                style={{ width: '44px', height: '20px' }}
                                                autoplay
                                                loop
                                            ></dotlottie-wc>
                                        </div>
                                    </div>

                                    {/* Right Content - Text and Genre Tabs */}
                                    <div className="flex flex-col gap-2 ml-[13px] justify-center">
                                        {/* Now Playing Text */}
                                        <span className="font-normal text-[13px] leading-[9.230769597567045%] text-white">Now playing</span>
                                        
                                        {/* Genre Tabs Container */}
                                        <div className="flex gap-2 items-center" style={{ marginTop: '6px', marginBottom: '11px' }}>
                                            {/* Chill House Mix Tab */}
                                            <div className="flex justify-center items-center gap-1.5 bg-[#202b2b] px-[10px] py-[5px] rounded-[25px] border border-solid border-[#28d2db]">
                                                <span className="font-normal text-[13px] leading-[9.230769597567045%] text-white">Chill House Mix</span>
                                                <div className="w-[7px] h-[7px] bg-red-500 rounded-full"></div>
                                            </div>
                                            
                                            {/* Techno Vibes Tab */}
                                            <div className="flex justify-center items-center gap-1.5 bg-[#202b2b] px-[10px] py-[5px] rounded-[25px] border border-solid border-[#28d2db]">
                                                <span className="font-normal text-[13px] leading-[9.230769597567045%] text-white">Techno Vibes</span>
                                                <div className="w-[7px] h-[7px] bg-red-500 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>

                        {/* Today's Offers */}
                        <div className="flex flex-col items-center self-stretch">
                            <div className="flex items-center gap-2.5 self-stretch mb-[12px]">
                                <span className="font-semibold text-[16px] leading-[16px] text-[#fffeff]">Today's Offers</span>
                            </div>
                            <div className="self-stretch h-[123px] bg-[#202b2b] rounded-[15px] p-[10px] flex flex-col gap-[13px]">
                                <div className="w-full h-[45px] bg-[#263438] rounded-[10px] border border-dashed border-[#14ffec] flex items-center justify-between px-[10px]">
                                    <span className="font-extrabold text-[13px] leading-[16px] text-white">Buy 1 get 1 on IFML Drinks</span>
                                    <SealPercent size={28} className="text-[#1b726b] shrink-0" />
                                </div>
                                <div className="w-full h-[45px] bg-[#263438] rounded-[10px] border border-dashed border-[#14ffec] flex items-center justify-between px-[10px]">
                                    <span className="font-extrabold text-[13px] leading-[16px] text-white">Free Entry for all before 09:00 PM</span>
                                    <SealPercent size={28} className="text-[#1b726b] shrink-0" />
                                </div>
                            </div>
                        </div>

                        {/* Entry/Booking */}
                        <div className="flex flex-col items-center self-stretch">
                            <div className="flex items-center gap-2.5 self-stretch mb-[12px]">
                                <span className="font-semibold text-[16px] leading-[16px] text-[#fffeff]">Entry/Booking</span>
                            </div>
                            <div className="self-stretch bg-[#202b2b] rounded-[15px] p-[10px] flex flex-col">
                                <div className="bg-[#263438] rounded-[15px] flex flex-col">
                                    <div className="flex justify-between items-center py-[10px] px-[10px]">
                                        <button 
                                            onClick={() => setActiveEntryTab('couple')}
                                            className={`h-[57px] flex flex-col justify-end items-center gap-[5px] bg-[#263438] transition-all duration-300 cursor-pointer rounded-[12px] flex-shrink-0 ${activeEntryTab === 'couple' ? 'w-36' : 'w-[80px]'}`}
                                        >
                                            <span className="font-semibold text-[13px] leading-[20px] text-center text-white">Couple<br/>Entry</span>
                                            <div className={`h-1 transition-all duration-300 ${activeEntryTab === 'couple' ? 'w-36 bg-[#1affec]' : 'w-[80px] bg-[#5f5f5f] h-px'}`}></div>
                                        </button>
                                        <button 
                                            onClick={() => setActiveEntryTab('female')}
                                            className={`h-[57px] flex flex-col justify-end items-center gap-[5px] bg-[#263438] transition-all duration-300 cursor-pointer rounded-[12px] flex-shrink-0 ${activeEntryTab === 'female' ? 'w-36' : 'w-[80px]'}`}
                                        >
                                            <span className="font-semibold text-[13px] leading-[20px] text-center text-white">Female stag<br/>Entry</span>
                                            <div className={`h-1 transition-all duration-300 ${activeEntryTab === 'female' ? 'w-36 bg-[#1affec]' : 'w-[80px] bg-[#5f5f5f] h-px'}`}></div>
                                        </button>
                                        <button 
                                            onClick={() => setActiveEntryTab('male')}
                                            className={`h-[57px] flex flex-col justify-end items-center gap-[5px] bg-[#263438] transition-all duration-300 cursor-pointer rounded-[12px] flex-shrink-0 ${activeEntryTab === 'male' ? 'w-36' : 'w-[80px]'}`}
                                        >
                                            <span className="font-semibold text-[13px] leading-[20px] text-center text-white">Male stag<br/>Entry</span>
                                            <div className={`h-1 transition-all duration-300 ${activeEntryTab === 'male' ? 'w-36 bg-[#1affec]' : 'w-[80px] bg-[#5f5f5f] h-px'}`}></div>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between px-[10px] py-[10px]">
                                        <div>
                                            <span className="font-medium text-[13px] leading-[20px] text-[#14ffec]">Rs 1500 (Cover - 1000)</span><br/>
                                            <span className="font-normal text-[12px] text-gray-400">Redeem cover before 12:00 AM</span>
                                        </div>
                                        <div className="h-[30px] w-[30px] flex justify-center items-center gap-2.5 bg-[#0d7377] py-2 rounded-[18px]">
                                            <svg className="w-[11.945191383361816px] h-[15.000000953674316px] text-[#14ffec]" viewBox="0 0 12 15" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M2 2l8 5.5-8 5.5"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Events In Dabo */}
                        <div className="flex flex-col items-center self-stretch">
                            <div className="flex items-center gap-2.5 self-stretch mb-[16px]">
                                <span className="font-semibold text-[16px] leading-[16px] text-[#fffeff]">Events In Dabo</span>
                            </div>
                            
                            {/* Events Cards */}
                            {isLoadingEvents ? (
                                <div className="flex items-center justify-center w-full py-8">
                                    <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
                                </div>
                            ) : clubEvents.length > 0 ? (
                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide pl-4 pr-4 w-full" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                                    {clubEvents.slice(0, 5).map((event, index) => {
                                        const eventDate = new Date(event.startDateTime);
                                        const monthShort = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                                        const day = eventDate.getDate().toString().padStart(2, '0');
                                        const fallbackImage = getEventFallbackImage(index);

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
                                                            {event.genre || 'TBD'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-full py-8">
                                    <p className="text-gray-400 text-sm">No events available for this club</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
