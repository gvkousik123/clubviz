'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import {
    Share2,
    MapPin,
    Star,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    Edit3,
    Trash2,
    Loader2
} from 'lucide-react';
import { ClubService } from '@/lib/services/club.service';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Tag Component
const TagComponent = ({ icon, label }: { icon?: React.ReactNode, label: string }) => (
    <div className="px-3 py-2 bg-[rgba(40,60,61,0.30)] rounded-full flex items-center gap-2">
        {icon && icon}
        <span className="text-white text-xs">{label}</span>
    </div>
);

function ClubPreviewContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const clubId = searchParams.get('clubId');
    const { toast } = useToast();

    const [clubData, setClubData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const loadClubData = async () => {
            try {
                if (!clubId) {
                    setError('No club ID provided');
                    setIsLoading(false);
                    return;
                }

                const response = await ClubService.getClubById(clubId);

                let clubDetails: any;
                if (response.success && response.data) {
                    clubDetails = response.data;
                } else if ((response as any).id) {
                    clubDetails = response;
                } else {
                    throw new Error('Invalid response format');
                }

                setClubData(clubDetails);
                setError(null);
            } catch (err) {
                console.error('Error loading club:', err);
                setError('Failed to load club data');
            } finally {
                setIsLoading(false);
            }
        };

        loadClubData();
    }, [clubId]);

    const handleGoBack = () => router.push('/admin');

    const handleEdit = () => router.push(`/admin/club-preview?clubId=${clubId}&edit=true`);

    const handleShare = async () => {
        try {
            if (navigator?.share) {
                await navigator.share({
                    title: clubData?.name || 'Club',
                    text: `Check out ${clubData?.name || 'this club'}!`,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast({ title: 'Link copied!', description: 'Club link copied to clipboard.' });
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const nextImage = () => {
        const heroImages = clubData?.images?.length > 0
            ? clubData.images.map((img: any) => img.url || img)
            : [clubData?.logo || clubData?.logoUrl || '/venue/Screenshot 2024-12-10 195651.png'];
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    };

    const prevImage = () => {
        const heroImages = clubData?.images?.length > 0
            ? clubData.images.map((img: any) => img.url || img)
            : [clubData?.logo || clubData?.logoUrl || '/venue/Screenshot 2024-12-10 195651.png'];
        setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    };

    const handleDeleteClub = async () => {
        if (!clubId) return;

        try {
            setIsDeleting(true);
            await ClubService.deleteClub(clubId);
            toast({ title: 'Success', description: 'Club deleted successfully', variant: 'success' });
            router.push('/admin');
        } catch (err) {
            console.error('Error deleting club:', err);
            toast({
                title: 'Delete Failed',
                description: err instanceof Error ? err.message : 'Failed to delete club',
                variant: 'destructive',
            });
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        );
    }

    if (error || !clubData) {
        return (
            <div className="min-h-screen bg-[#021313] flex flex-col items-center justify-center p-4">
                <p className="text-white mb-4">{error || 'Club not found'}</p>
                <button onClick={handleGoBack} className="text-[#14FFEC] flex items-center gap-2 hover:opacity-80">
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
            </div>
        );
    }

    const heroImages = clubData.images?.length > 0
        ? clubData.images.map((img: any) => img.url || img)
        : [clubData.logo || clubData.logoUrl || '/venue/Screenshot 2024-12-10 195651.png'];

    const getAddress = () => {
        if (clubData.locationText?.fullAddress) return clubData.locationText.fullAddress;
        const parts = [
            clubData.locationText?.address1,
            clubData.locationText?.address2,
            clubData.locationText?.city,
            clubData.locationText?.state
        ].filter(Boolean);
        return parts.join(', ') || clubData.location || '';
    };

    return (
        <div className="min-h-screen bg-[#021313] relative w-full max-w-[430px] mx-auto">
            {/* Hero Image Carousel */}
            <div className="relative w-full h-[40vh] overflow-hidden">
                <div className="absolute inset-0 flex">
                    {heroImages.map((image, index) => (
                        <img
                            key={index}
                            className="min-w-full h-full object-cover transition-transform duration-300"
                            src={image}
                            alt={`Hero ${index + 1}`}
                            style={{ transform: `translateX(${(index - currentImageIndex) * 100}%)` }}
                        />
                    ))}
                </div>

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

                <button onClick={handleGoBack} className="absolute left-4 top-12 w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center hover:bg-white/30 transition">
                    <ArrowLeft className="h-5 w-5 text-white" />
                </button>

                <div className="absolute right-4 top-12 flex gap-2">
                    <button onClick={handleShare} className="w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center hover:bg-white/30 transition">
                        <Share2 className="h-5 w-5 text-white" />
                    </button>
                    <button onClick={handleEdit} className="w-[35px] h-[35px] bg-[#14FFEC]/20 rounded-[18px] flex items-center justify-center hover:bg-[#14FFEC]/30 transition">
                        <Edit3 className="h-5 w-5 text-[#14FFEC]" />
                    </button>
                    <button onClick={() => setShowDeleteDialog(true)} className="w-[35px] h-[35px] bg-red-500/20 rounded-[18px] flex items-center justify-center hover:bg-red-500/30 transition">
                        <Trash2 className="h-5 w-5 text-red-500" />
                    </button>
                </div>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2 z-20" style={{ top: 'calc(40vh - 42.5px)' }}>
                <div className="w-[85px] h-[85px] rounded-full border-4 border-[#08C2B3] overflow-hidden shadow-xl bg-black">
                    <img
                        src={clubData.logo || clubData.logoUrl || heroImages[0]}
                        alt={clubData.name}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = heroImages[0])}
                    />
                </div>
            </div>

            <div className="bg-gradient-to-b from-[#021313] to-[rgba(2,19,19,0)] mt-[-5vh] rounded-t-[40px] relative z-0 px-4 pb-[18px] w-full">
                <div className="flex flex-col items-center w-full" style={{ paddingTop: 'calc(6vh + 30px)' }}>
                    <h1 className="text-white text-[30px] tracking-[0.36px] text-center font-normal leading-[35px] mb-3 uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>
                        {clubData.name}
                    </h1>
                    {clubData.description && <p className="text-white/70 text-sm text-center mb-4 px-4">{clubData.description}</p>}

                    {clubData.rating && (
                        <div className="flex items-center gap-2 mb-4">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-white text-sm font-semibold">{clubData.rating}</span>
                        </div>
                    )}

                    {getAddress() && (
                        <div className="w-full mt-5 mb-5">
                            <h3 className="text-white text-xl font-semibold mb-4">Location</h3>
                            <div className="w-full bg-[rgba(40,60,61,0.30)] rounded-[20px] p-4">
                                <div className="flex items-start gap-3 mb-4">
                                    <MapPin className="w-5 h-5 text-[#FF3B3B] flex-shrink-0" />
                                    <p className="text-white text-sm">{getAddress()}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {clubData.facilities && clubData.facilities.length > 0 && (
                        <div className="w-full mt-5 mb-5">
                            <h3 className="text-white text-xl font-semibold mb-4">Facilities</h3>
                            <div className="flex flex-wrap gap-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] p-3">
                                {clubData.facilities.map((facility: any, i: number) => (
                                    <TagComponent key={i} label={facility} icon={<Star className="w-3 h-3" />} />
                                ))}
                            </div>
                        </div>
                    )}

                    {clubData.foodCuisines && clubData.foodCuisines.length > 0 && (
                        <div className="w-full mt-5 mb-5">
                            <h3 className="text-white text-xl font-semibold mb-4">Cuisines</h3>
                            <div className="flex flex-wrap gap-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] p-3">
                                {clubData.foodCuisines.map((cuisine: any, i: number) => (
                                    <TagComponent key={i} label={cuisine} />
                                ))}
                            </div>
                        </div>
                    )}

                    {clubData.musicGenres && clubData.musicGenres.length > 0 && (
                        <div className="w-full mt-5 mb-5">
                            <h3 className="text-white text-xl font-semibold mb-4">Music</h3>
                            <div className="flex flex-wrap gap-2 bg-[rgba(40,60,61,0.30)] rounded-[15px] p-3">
                                {clubData.musicGenres.map((genre: any, i: number) => (
                                    <TagComponent key={i} label={genre} />
                                ))}
                            </div>
                        </div>
                    )}

                    {(clubData.phone || clubData.email || clubData.contactPhone || clubData.contactEmail) && (
                        <div className="w-full mt-5 mb-5">
                            <h3 className="text-white text-xl font-semibold mb-4">Contact</h3>
                            <div className="bg-[rgba(40,60,61,0.30)] rounded-[15px] p-4 space-y-2">
                                {(clubData.phone || clubData.contactPhone) && <p className="text-white text-sm">📞 {clubData.phone || clubData.contactPhone}</p>}
                                {(clubData.email || clubData.contactEmail) && <p className="text-white text-sm">✉️ {clubData.email || clubData.contactEmail}</p>}
                            </div>
                        </div>
                    )}

                    <div className="w-full mt-6 flex gap-4">
                        <button onClick={() => router.push(`/admin/new-event?clubId=${clubId}`)} className="flex-1 py-3 px-6 rounded-[30px] bg-gradient-to-r from-[#005D5C] to-[#14FFEC] text-white font-bold hover:brightness-110 transition">
                            Create Event
                        </button>
                        <button onClick={() => router.push(`/club/${clubId}`)} className="flex-1 py-3 px-6 rounded-[30px] border-2 border-[#14FFEC] text-[#14FFEC] font-bold hover:bg-[#14FFEC]/10 transition">
                            View Public
                        </button>
                    </div>
                </div>
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogOverlay />
                <DialogContent className="p-0 border-none bg-transparent max-w-[420px]" showCloseButton={false}>
                    <div className="w-full p-[20px_21px_20px_22px] bg-[#0D1F1F] overflow-hidden rounded-[17px] flex flex-col items-center gap-[26px]">
                        <div className="w-[74px] h-[74px] bg-red-500/20 rounded-full flex items-center justify-center">
                            <Trash2 className="w-10 h-10 text-red-400" />
                        </div>

                        <div className="text-center">
                            <h3 className="text-white text-lg font-semibold mb-2">Delete Club</h3>
                            <p className="text-gray-400 text-sm">Are you sure you want to delete "{clubData?.name}"? This action cannot be undone.</p>
                        </div>

                        <div className="flex gap-3 w-full">
                            <button onClick={() => setShowDeleteDialog(false)} disabled={isDeleting} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50">
                                Cancel
                            </button>
                            <button onClick={handleDeleteClub} disabled={isDeleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function ClubPreview() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#021313] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        }>
            <ClubPreviewContent />
        </Suspense>
    );
}
