'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, Loader2 } from 'lucide-react';
import PageHeader from '@/components/common/page-header';
import { toast } from '@/hooks/use-toast';
import { ClubsListSkeleton } from '@/components/ui/skeleton-loaders';
import { ClubService } from '@/lib/services/club.service';

export default function FavoriteClubsPage() {
    const router = useRouter();
    const [favoriteClubs, setFavoriteClubs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const clubImages = [
        '/venue/Screenshot 2024-12-10 195651.png',
        '/venue/Screenshot 2024-12-10 195852.png',
        '/venue/Screenshot 2024-12-10 200154.png'
    ];

    const getClubFallbackImage = (index: number) => {
        return clubImages[index % clubImages.length];
    };

    const loadFavoriteClubs = async () => {
        setLoading(true);
        try {
            const response: any = await ClubService.getUserFavoriteClubs({ page: 0, size: 50 });
            // Handle response - may be wrapped or direct
            const clubs = response?.clubs || response?.content || response?.data?.clubs || response?.data?.content || [];
            setFavoriteClubs(clubs);
        } catch (error: any) {
            console.error('Error loading favorite clubs:', error);
            setFavoriteClubs([]);
            if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
                toast({
                    title: 'Login Required',
                    description: 'Please login to see your favorite clubs.',
                    variant: 'destructive',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFavoriteClubs();
    }, []);

    const handleRemoveFavorite = async (clubId: string) => {
        try {
            await ClubService.removeClubFromFavorites(clubId);
            setFavoriteClubs(prev => prev.filter(c => c.id !== clubId));
            toast({
                title: "Removed from favorites",
                description: "Club removed from your favorites.",
            });
        } catch (error: any) {
            console.error('Error removing favorite:', error);
            toast({
                title: 'Error',
                description: 'Failed to remove from favorites.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#031414] overflow-hidden">
            <PageHeader title="FAVOURITE CLUBS" />

            {/* Club Cards */}
            <div className="px-6 space-y-4 pt-[20vh]">
                {loading ? (
                    <ClubsListSkeleton count={4} />
                ) : favoriteClubs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Bookmark className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-white text-lg font-semibold mb-2">No Favorite Clubs</h3>
                        <p className="text-gray-400 text-sm">Start adding clubs to your favorites to see them here.</p>
                    </div>
                ) : favoriteClubs.map((club, index) => (
                    <div key={club.id} className="w-full" onClick={() => router.push(`/club/${club.id}`)}>
                        {/* Main club card structure */}
                        <div className="relative">
                            {/* Main club card */}
                            <div className="w-full h-[201px] relative">
                                {/* Main image container with border on all sides */}
                                <div className="w-full h-[169px] left-0 top-0 absolute flex-col justify-start items-start flex rounded-[15px] overflow-hidden border-[1.2px] border-[#14FFEC]">
                                    <img
                                        src={club.logo || club.logoUrl || club.image || getClubFallbackImage(index)}
                                        alt={club.name}
                                        className="w-full h-full object-cover absolute inset-0 rounded-[15px]"
                                    />
                                    {/* White overlay effect */}
                                    <div className="w-full h-full absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                                    <div className="w-full h-[169px] pl-[281px] pr-4 pt-[17px] pb-[113px] left-0 top-0 absolute justify-end items-center inline-flex bg-gradient-to-b from-black via-black/50 to-black/0 rounded-[10px] overflow-hidden">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFavorite(club.id);
                                            }}
                                            className="w-[39px] self-stretch bg-neutral-300/10 rounded-[22px] backdrop-blur-[35px] justify-center items-center inline-flex overflow-hidden hover:bg-neutral-300/20 transition-colors"
                                        >
                                            <Bookmark className="w-5 h-5 text-[#14FFEC] fill-[#14FFEC]" />
                                        </button>
                                    </div>
                                </div>

                                {/* Glassmorphism bottom section */}
                                <div className="w-[calc(100%-16px)] h-[85px] left-[8px] top-[125px] absolute rounded-[20px] border border-white/50 z-10 overflow-hidden" style={{ background: 'rgba(212.01, 212.01, 212.01, 0.10)', backdropFilter: 'blur(17.50px)' }}></div>

                                {/* Rating badge */}
                                <div className="w-[30px] h-[30px] pl-1 pr-[5px] py-[5px] right-[24px] top-[110px] absolute justify-center items-center inline-flex bg-[#008378] rounded-[17px] overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),inset_0_-1px_2px_rgba(255,255,255,0.1)] z-20">
                                    <div className="text-white text-[13px] font-extrabold font-['Manrope'] leading-5 tracking-[0.01em]">
                                        {club.rating || '4.0'}
                                    </div>
                                </div>

                                {/* Text content */}
                                <div className="w-32 h-[50px] left-[33px] top-[144px] absolute justify-start items-center gap-[29px] inline-flex z-20">
                                    <div className="w-52 flex-col justify-center items-start gap-0.5 inline-flex">
                                        <div className="self-stretch h-5 text-[#14FFEC] text-xl font-black font-['Manrope'] leading-5 tracking-[0.02em] first-letter:text-2xl first-letter:leading-2 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {club.name}
                                        </div>
                                        <div className="self-stretch h-5 text-white text-[13px] font-semibold font-['Manrope'] leading-5 tracking-[0.01em] whitespace-nowrap overflow-hidden text-ellipsis">
                                            {club.location || club.locationText?.fullAddress || club.description || ''}
                                        </div>
                                        <div className="self-stretch h-5 text-white text-[13px] font-semibold font-['Manrope'] leading-5 tracking-[0.01em] whitespace-nowrap overflow-hidden text-ellipsis">
                                            {club.category || ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}