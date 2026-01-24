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
    Tag as TagIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useOffers } from '@/hooks/use-offers';
import { isGuestMode } from '@/lib/api-client-public';
// Use centralized data store for cached club details
import { useClubDetail } from '@/lib/store';
import { ClubDetailSkeleton } from '@/components/ui/skeleton-loaders';

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
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isJoinLoading, setIsJoinLoading] = useState(false);

    // Get club ID and initialize offers hook
    const clubId = params.id as string;
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

    // Fetch offers when club is loaded
    useEffect(() => {
        if (clubId) {
            fetchOffers();
        }
    }, [clubId, fetchOffers]);

    const handleGoBack = () => {
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
        setCurrentImageIndex((prev) => (prev + 1) % (club.images?.length || 1));
    };

    const prevImage = () => {
        if (!club?.images?.length) return;
        const len = club.images?.length || 1;
        setCurrentImageIndex((prev) => (prev - 1 + len) % len);
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
        // Use skeleton loading for better UX
        return <ClubDetailSkeleton />;
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

    // Get images
    const heroImages = (club.images && club.images.length > 0)
        ? club.images.map((img: any) => img.url || img)
        : [club.logo || club.logoUrl || ''];

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
            <div className="relative w-full bg-gray-900 overflow-hidden flex justify-center items-center min-h-[300px] max-h-[500px]">
                <div className="absolute inset-0 flex">
                    {heroImages.map((image, index) => (
                        <img
                            key={index}
                            className="min-w-full h-full object-contain transition-transform duration-300"
                            src={image}
                            style={{
                                transform: `translateX(${(index - currentImageIndex) * 100}%)`,
                            }}
                        />
                    ))}
                </div>

                {/* Navigation arrows (only if multiple images) */}
                {heroImages.length > 1 && (
                    <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 flex justify-between items-center w-[calc(100%-28px)]">
                        <button onClick={prevImage} className="w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center hover:bg-white/80 transition">
                            <ChevronLeft className="w-4 h-4 text-black" />
                        </button>
                        <button onClick={nextImage} className="w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center hover:bg-white/80 transition">
                            <ChevronRight className="w-4 h-4 text-black" />
                        </button>
                    </div>
                )}

                {/* Back button */}
                <button
                    onClick={handleGoBack}
                    className="absolute left-4 top-12 w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center hover:bg-white/30 transition"
                >
                    <ArrowLeft className="h-5 w-5 text-white" />
                </button>

                {/* Share and Like buttons */}
                {/* <div className="absolute right-4 top-12 flex gap-2">
                    <button
                        onClick={handleShare}
                        className="w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center hover:bg-white/30 transition"
                    >
                        <Share2 className="h-5 w-5 text-white" />
                    </button>
                    <button
                        onClick={handleToggleLike}
                        disabled={isJoinLoading}
                        className="w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center hover:bg-white/30 transition disabled:opacity-50"
                    >
                        {isJoinLoading ? (
                            <Loader2 className="h-5 w-5 text-[#14FFEC] animate-spin" />
                        ) : (
                            <Heart className={`h-5 w-5 ${isLiked ? 'fill-[#FF3B3B] text-[#FF3B3B]' : 'text-white'}`} />
                        )}
                    </button>
                </div> */}
            </div>

            {/* Profile picture - centered */}
            <div className="absolute left-1/2 transform -translate-x-1/2 z-20" style={{ top: 'calc(40vh - 42.5px)' }}>
                <div className="w-[85px] h-[85px] rounded-full border-4 border-[#08C2B3] overflow-hidden shadow-xl bg-black">
                    <img
                        src={club.logo || ''}
                        alt={club.name}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = heroImages[0])}
                    />
                </div>
            </div>

            {/* Main content */}
            <div className="bg-gradient-to-b from-[#021313] to-[rgba(2,19,19,0)] mt-[-5vh] rounded-t-[40px] relative z-0 px-4 pb-[18px] w-full">
                <div className="flex flex-col items-center w-full" style={{ paddingTop: 'calc(6vh + 30px)' }}>
                    {/* Title */}
                    <h1 className="text-white text-[30px] tracking-[0.36px] text-center font-normal leading-[35px] mb-3 uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>
                        {club.name}
                    </h1>

                    {/* Action Buttons - Reserve a spot */}
                    <div className="w-full mt-6 mb-4 flex justify-center">
                        <button
                            onClick={() => router.push(`/booking/slot?clubId=${clubId}`)}
                            className="py-3 px-8 rounded-[25px] bg-[#14FFEC] text-black font-bold hover:brightness-90 transition flex items-center justify-center gap-2"
                        >
                            Reserve your spot
                        </button>
                    </div>

                    <p className="text-white/70 text-sm text-center mb-4 px-4">{club.description}</p>

                    {/* Rating */}
                    {club.rating && (
                        <div className="flex items-center gap-2 mb-4">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-white text-sm font-semibold">{club.rating}</span>
                        </div>
                    )}

                    {/* Location Section */}
                    <div className="w-full mt-5 mb-5">
                        <h3 className="text-white text-xl font-semibold mb-4">Location</h3>
                        <Link href="/location/select">
                            <div className="w-full bg-[rgba(40,60,61,0.30)] rounded-[20px] p-4 cursor-pointer hover:bg-[rgba(40,60,61,0.40)] transition">
                                <div className="flex items-start gap-3 mb-4">
                                    <MapPin className="w-5 h-5 text-[#FF3B3B] flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-white text-sm mb-1">{getAddress()}</p>
                                        <p className="text-[#14FFEC] text-xs font-medium">Click to select custom location on map</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Facilities Section */}
                    {club.facilities && club.facilities.length > 0 && (
                        <div className="w-full mt-5 mb-5">
                            <h3 className="text-white text-xl font-semibold mb-4">Facilities</h3>
                            <div className="flex flex-wrap gap-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] p-3">
                                {club.facilities.map((facility: any, i: number) => (
                                    <TagComponent key={i} label={facility} icon={<Star className="w-3 h-3" />} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Cuisines Section */}
                    {club.foodCuisines && club.foodCuisines.length > 0 && (
                        <div className="w-full mt-5 mb-5">
                            <h3 className="text-white text-xl font-semibold mb-4">Cuisines</h3>
                            <div className="flex flex-wrap gap-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] p-3">
                                {club.foodCuisines.map((cuisine: any, i: number) => (
                                    <TagComponent key={i} label={cuisine} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Music Genres Section */}
                    {club.music && club.music.length > 0 && (
                        <div className="w-full mt-5 mb-5">
                            <h3 className="text-white text-xl font-semibold mb-4">Music</h3>
                            <div className="flex flex-wrap gap-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] p-3">
                                {club.music.map((genre: any, i: number) => (
                                    <TagComponent key={i} label={genre} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contact Section */}
                    {(club.phone || club.email) && (
                        <div className="w-full mt-5 mb-5">
                            <h3 className="text-white text-xl font-semibold mb-4">Contact</h3>
                            <div className="bg-[rgba(40,60,61,0.30)] rounded-[15px] p-4 space-y-2">
                                {club.phone && <p className="text-white text-sm">📞 {club.phone}</p>}
                                {club.email && <p className="text-white text-sm">✉️ {club.email}</p>}
                            </div>
                        </div>
                    )}


                    {/* Join Button */}
                    <button
                        onClick={handleToggleLike}
                        disabled={isJoinLoading}
                        className="w-full max-w-md mt-2 mb-4 py-3 px-6 rounded-[30px] bg-gradient-to-r from-[#005D5C] to-[#14FFEC] text-white font-bold hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isJoinLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Joining...
                            </>
                        ) : isLiked ? (
                            <>
                                <Heart className="w-5 h-5 fill-current" />
                                Joined
                            </>
                        ) : (
                            'Join Club'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
