'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { ClubService } from '@/lib/services/club.service';
import { Club } from '@/lib/api-types';
import { toast } from '@/hooks/use-toast';

export default function FavoriteClubsPage() {
    const router = useRouter();
    const [favoriteClubs, setFavoriteClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch favorite clubs on component mount
    useEffect(() => {
        const fetchFavoriteClubs = async () => {
            setLoading(true);
            try {
                const response = await ClubService.getFavoriteClubs();

                if (response.success && response.data) {
                    setFavoriteClubs(response.data);
                } else {
                    throw new Error(response.message || 'Failed to fetch favorite clubs');
                }
            } catch (error) {
                console.error('Error fetching favorite clubs:', error);
                toast({
                    title: "Error",
                    description: "Failed to load favorite clubs. Please try again.",
                    variant: "destructive",
                });
                setFavoriteClubs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteClubs();
    }, []);

    const handleGoBack = () => {
        router.back();
    };

    const handleBookmark = async (clubId: string) => {
        try {
            await ClubService.removeFromFavorites(clubId);
            // Remove from local state
            setFavoriteClubs(prev => prev.filter(club => club.id !== clubId));
            toast({
                title: "Success",
                description: "Club removed from favorites.",
            });
        } catch (error) {
            console.error('Error removing favorite:', error);
            toast({
                title: "Error",
                description: "Failed to remove from favorites. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleOpenNow = (clubId: string) => {
        router.push(`/club/${clubId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0d7377] to-[#222831] text-white">
            {/* Header with Gradient Background */}
            <div className="header-gradient rounded-b-[30px] pb-8 pt-4">
                <div className="flex items-center justify-between px-6 pt-4 mb-6">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide text-center flex-1 mr-10">
                        FAVOURITE CLUBS
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-6 space-y-8">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
                        <span className="ml-3 text-white">Loading your favorite clubs...</span>
                    </div>
                ) : favoriteClubs.length > 0 ? (
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-4 pb-16" style={{ width: 'max-content' }}>
                            {favoriteClubs.map((club) => (
                                <Link key={club.id} href={`/club/${club.id}`}>
                                    <div className="flex-shrink-0 w-[336px] relative cursor-pointer transform transition-all duration-300 hover:scale-105">
                                        <div className="relative h-[197px] rounded-[20px] border border-[#0c898b] bg-[#1a2f32]">
                                            <div className="rounded-[20px] overflow-hidden h-full">
                                                <img
                                                    src={club.images?.[0] || '/placeholder-logo.png'}
                                                    alt={club.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/placeholder-logo.png';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                            </div>

                                            {/* Glass effect card that extends beyond main card */}
                                            <div className="absolute -bottom-8 left-2 right-2 glassmorphism-strong border border-white/20 p-5 rounded-2xl h-20 z-10">
                                                <h3 className="text-white font-bold text-xl mb-2">{club.name}</h3>
                                                <p className="text-white/90 text-sm">
                                                    {club.openingHours ? 'Open until 2:00 AM' : 'Hours not available'}
                                                </p>
                                            </div>

                                            <div className="absolute bottom-4 right-4 z-20">
                                                <div className="glassmorphism text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                                                    {club.rating || '4.5'}
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleBookmark(club.id);
                                                }}
                                                className="absolute top-4 right-4 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition-all duration-300 z-20"
                                            >
                                                <Bookmark className="w-4 h-4 text-white fill-white" />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-white text-xl font-semibold mb-2">No Favorite Clubs</h3>
                        <p className="text-gray-400">You haven't added any clubs to your favorites yet.</p>
                        <Link href="/clubs" className="inline-block mt-4 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                            Explore Clubs
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}