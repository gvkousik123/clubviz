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
    Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ClubService, Club, PublicClubByCategory } from '@/lib/services/club.service';
import { PublicClubService, PublicClubDetails } from '@/lib/services/public.service';
import { isGuestMode } from '@/lib/api-client-public';

// Helper to render tags with icons
const TagComponent = ({ icon, label, iconPath }: { icon?: React.ReactNode, label: string, iconPath?: string }) => (
    <div className="px-3 py-2 bg-[rgba(40,60,61,0.30)] rounded-full flex items-center gap-2">
        {iconPath && <img src={iconPath} alt={label} className="w-4 h-4" />}
        {icon && icon}
        <span className="text-white text-xs">{label}</span>
    </div>
);

// Icon components
const UtensilsIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>
);

const MusicIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
);

export default function ClubDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const [club, setClub] = useState<Club | PublicClubByCategory | PublicClubDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isJoinLoading, setIsJoinLoading] = useState(false);

    // Fetch club details
    const fetchClubDetails = async () => {
        if (!params.id) return;

        setIsLoading(true);
        try {
            const isGuest = isGuestMode();
            const clubId = params.id as string;

            if (isGuest) {
                // Use public club service for guests
                const clubData = await PublicClubService.getPublicClubById(clubId);
                setClub(clubData);
                setIsLiked(!!clubData.isJoined);
            } else {
                // Use regular club service for authenticated users
                const response = await ClubService.getClubById(clubId);
                if (response.success && response.data) {
                    setClub(response.data);
                    if ('isJoined' in response.data) {
                        setIsLiked(!!response.data.isJoined);
                    }
                } else {
                    setError('Club not found');
                }
            }
        } catch (err: any) {
            console.error("Error fetching club details:", err);
            setError(err.message || 'Failed to load club details');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClubDetails();
    }, [params.id]);

    const handleGoBack = () => {
        router.back();
    };

    const nextImage = () => {
        if (!club?.images?.length) return;
        setCurrentImageIndex((prev) => (prev + 1) % club.images!.length);
    };

    const prevImage = () => {
        if (!club?.images?.length) return;
        setCurrentImageIndex((prev) => (prev - 1 + club.images!.length) % club.images!.length);
    };

    const handleShare = async () => {
        try {
            if (navigator?.share) {
                await navigator.share({
                    title: club?.name || 'Club Viz',
                    text: `Check out ${club?.name}!`,
                    url: window.location.href,
                });
                return;
            }
            await navigator.clipboard?.writeText(window.location.href);
            toast({ title: 'Link copied', description: 'Club link copied to clipboard.' });
        } catch (error) {
            console.error('Share failed', error);
        }
    };

    const handleToggleLike = async () => {
        if (!club || !params.id || isGuestMode()) {
            if (isGuestMode()) {
                toast({ title: 'Sign in to Join', description: 'Please sign in to join or favorite clubs.' });
            }
            return;
        }

        setIsJoinLoading(true);
        try {
            const clubId = params.id as string;
            if (isLiked) {
                await ClubService.leaveClub(clubId);
                setIsLiked(false);
                toast({ title: 'Left Club', description: 'You have left the club.' });
            } else {
                await ClubService.joinClub(clubId);
                setIsLiked(true);
                toast({ title: 'Joined Club', description: 'You have successfully joined the club!' });
            }
            // Refresh to get updated status
            fetchClubDetails();
        } catch (error: any) {
            toast({
                title: isLiked ? 'Failed to leave' : 'Failed to join',
                description: error.message,
                variant: 'destructive'
            });
        } finally {
            setIsJoinLoading(false);
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
                <button onClick={handleGoBack} className="text-[#14FFEC] flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
            </div>
        );
    }

    // Prepare images
    const heroImageUrls = club.images && club.images.length > 0
        ? club.images.map(img => img.url)
        : [(club as any).logo || (club as any).logoUrl || '/venue/Screenshot 2024-12-10 195651.png'];

    const getAddress = () => {
        if (club.locationText?.fullAddress) return club.locationText.fullAddress;
        const parts = [
            club.locationText?.address1,
            club.locationText?.address2,
            club.locationText?.city,
            club.locationText?.state
        ].filter(Boolean);
        return parts.join(', ') || 'Address not available';
    };

    return (
        <div className="min-h-screen bg-[#021313] relative w-full max-w-[430px] mx-auto">
            {/* Hero Image Carousel */}
            <div className="relative w-full h-[40vh] overflow-hidden">
                <div className="absolute inset-0 flex">
                    {heroImageUrls.map((image, index) => (
                        <img
                            key={index}
                            className="min-w-full h-full object-cover transition-transform duration-300"
                            src={image}
                            alt={`Hero ${index + 1}`}
                            style={{
                                transform: `translateX(${(index - currentImageIndex) * 100}%)`,
                            }}
                        />
                    ))}
                </div>

                {/* Navigation arrows (only if multiple images) */}
                {heroImageUrls.length > 1 && (
                    <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 flex justify-between items-center w-[calc(100%-28px)]">
                        <button onClick={prevImage} className="w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center">
                            <ChevronLeft className="w-4 h-4 text-black" />
                        </button>
                        <button onClick={nextImage} className="w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center">
                            <ChevronRight className="w-4 h-4 text-black" />
                        </button>
                    </div>
                )}

                {/* Back button */}
                <button
                    onClick={handleGoBack}
                    className="absolute left-4 top-12 w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center"
                >
                    <ArrowLeft className="h-5 w-5 text-white" />
                </button>
            </div>

            {/* Profile picture - centered */}
            <div className="absolute left-1/2 transform -translate-x-1/2 z-20" style={{ top: 'calc(35vh - 42.5px)' }}>
                <div className="w-[85px] h-[85px] rounded-full border-4 border-[#08C2B3] overflow-hidden shadow-xl bg-black">
                    <img
                        src={(club as any).logo || (club as any).logoUrl || heroImageUrls[0]}
                        alt={club.name}
                        className="w-full h-full object-cover"
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
                    <p className="text-white/70 text-sm text-center mb-4 px-4">{club.description}</p>

                    {/* Action buttons */}
                    <div className="w-full flex flex-col items-center gap-3 mb-4">
                        <div className="flex justify-center items-center gap-3">
                            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10" onClick={handleShare}>
                                <img src="/club/ShareNetwork (1).svg" alt="Share" className="w-5 h-5" onError={(e) => (e.currentTarget.src = "")} />
                            </button>
                            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10" onClick={handleToggleLike} disabled={isJoinLoading}>
                                {isJoinLoading ? (
                                    <Loader2 className="w-5 h-5 text-[#14FFEC] animate-spin" />
                                ) : isLiked ? (
                                    <Heart className="w-5 h-5 fill-[#14FFEC] text-[#14FFEC]" />
                                ) : (
                                    <img src="/club/BookmarkSimple (1).svg" alt="Bookmark" className="w-5 h-5" onError={(e) => (e.currentTarget.src = "")} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="w-full mt-5 mb-5">
                        <h3 className="text-white text-xl font-semibold mb-4">Location</h3>
                        <div className="w-full bg-[rgba(40,60,61,0.30)] rounded-[20px] p-4">
                            <div className="flex items-start gap-3 mb-4">
                                <MapPin className="w-5 h-5 text-[#FF3B3B] flex-shrink-0" />
                                <p className="text-white text-sm">{getAddress()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Facilities Section */}
                    {club.facilities && club.facilities.length > 0 && (
                        <div className="w-full mt-5 mb-5">
                            <h3 className="text-white text-xl font-semibold mb-4">Facilities</h3>
                            <div className="flex flex-wrap gap-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] p-3">
                                {club.facilities.map((facility, i) => (
                                    <TagComponent key={i} label={facility} icon={<Star className="w-3 h-3" />} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Food Section */}
                    {club.foodCuisines && club.foodCuisines.length > 0 && (
                        <div className="w-full mt-5 mb-5">
                            <h3 className="text-white text-xl font-semibold mb-4">Cuisines</h3>
                            <div className="flex flex-wrap gap-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] p-3">
                                {club.foodCuisines.map((item, i) => (
                                    <TagComponent key={i} label={item} icon={<UtensilsIcon className="w-3 h-3" />} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Music Section */}
                    {club.music && club.music.length > 0 && (
                        <div className="w-full mt-5 mb-5">
                            <h3 className="text-white text-xl font-semibold mb-4">Music</h3>
                            <div className="flex flex-wrap gap-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] p-3">
                                {club.music.map((item, i) => (
                                    <TagComponent key={i} label={item} icon={<MusicIcon className="w-3 h-3" />} />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
