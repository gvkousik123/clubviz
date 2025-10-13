'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Star, MapPin, Clock, Loader2 } from 'lucide-react';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import { ClubService } from '@/lib/services';
import { Club } from '@/lib/api-types';
import { toast } from '@/hooks/use-toast';

export default function ClubsListPage() {
    const router = useRouter();
    const [clubs, setClubs] = useState<Club[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const handleGoBack = () => {
        router.back();
    };

    // Fetch clubs from API
    const fetchClubs = async (pageNum: number = 1, reset: boolean = false) => {
        try {
            setLoading(true);
            setError(null);

            const response = await ClubService.getClubs({
                sortBy: 'popularity',
                sortOrder: 'desc',
                page: pageNum,
                limit: 10
            });

            if (response.success) {
                if (reset) {
                    setClubs(response.data.clubs);
                } else {
                    setClubs(prev => [...prev, ...response.data.clubs]);
                }
                setHasMore(response.data.pagination.hasNext);
            } else {
                setError('Failed to load clubs');
                toast({
                    title: "Error",
                    description: "Failed to load clubs. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (err) {
            setError('Failed to load clubs');
            console.error('Error fetching clubs:', err);
            toast({
                title: "Error",
                description: "Failed to load clubs. Please check your connection.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch user's favorite clubs
    const fetchFavorites = async () => {
        try {
            const response = await ClubService.getFavoriteClubs();
            if (response.success) {
                setFavorites(response.data.map(club => club.id));
            }
        } catch (err) {
            console.error('Error fetching favorites:', err);
        }
    };

    // Toggle favorite status
    const toggleFavorite = async (clubId: string) => {
        try {
            const isFavorite = favorites.includes(clubId);

            if (isFavorite) {
                await ClubService.removeFromFavorites(clubId);
                setFavorites(prev => prev.filter(id => id !== clubId));
                toast({
                    title: "Removed from favorites",
                    description: "Club removed from your favorites.",
                });
            } else {
                await ClubService.addToFavorites(clubId);
                setFavorites(prev => [...prev, clubId]);
                toast({
                    title: "Added to favorites",
                    description: "Club added to your favorites.",
                });
            }
        } catch (err) {
            console.error('Error toggling favorite:', err);
            toast({
                title: "Error",
                description: "Failed to update favorites. Please try again.",
                variant: "destructive",
            });
        }
    };

    // Load more clubs
    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchClubs(nextPage, false);
        }
    };

    // Initialize data
    useEffect(() => {
        fetchClubs(1, true);
        fetchFavorites();
    }, []);

    // Format opening hours
    const formatOpeningHours = (openingHours: any[]) => {
        if (!openingHours || openingHours.length === 0) return 'Hours not available';

        const today = new Date().getDay();
        const todayHours = openingHours.find(h => h.dayOfWeek === today);

        if (!todayHours || todayHours.isClosed) {
            return 'Closed today';
        }

        return `Open until ${todayHours.closeTime}`;
    };

    // Check if club is currently open
    const isClubOpen = (openingHours: any[]) => {
        if (!openingHours || openingHours.length === 0) return false;

        const now = new Date();
        const today = now.getDay();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const todayHours = openingHours.find(h => h.dayOfWeek === today);

        if (!todayHours || todayHours.isClosed) return false;

        return currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime;
    };

    if (error && clubs.length === 0) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] text-white">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={handleGoBack} className="p-2">
                            <ArrowLeft className="w-6 h-6 text-white" />
                        </button>
                        <h1 className="text-lg font-semibold">Clubs</h1>
                        <div className="w-10" />
                    </div>

                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="text-white/70 mb-4">Failed to load clubs</p>
                        <button
                            onClick={() => fetchClubs(1, true)}
                            className="bg-teal-600 text-white px-6 py-2 rounded-lg"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white">
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button onClick={handleGoBack} className="p-2">
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </button>
                    <h1 className="text-lg font-semibold">Clubs</h1>
                    <div className="w-10" />
                </div>

                {/* Clubs List */}
                <div className="space-y-4">
                    {clubs.map((club) => (
                        <Link
                            key={club.id}
                            href={`/club/${club.id}`}
                            className="block bg-[#222831] rounded-2xl p-4 hover:bg-[#2a3037] transition-colors"
                        >
                            <div className="flex gap-4">
                                {/* Club Image */}
                                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                    <img
                                        src={club.images[0] || '/placeholder-logo.png'}
                                        alt={club.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Club Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-white text-lg truncate">
                                                {club.name}
                                            </h3>
                                            <div className="flex items-center gap-1 text-white/60 text-sm">
                                                <MapPin className="w-3 h-3" />
                                                <span className="truncate">{club.address}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleFavorite(club.id);
                                            }}
                                            className="p-2"
                                        >
                                            <Bookmark
                                                className={`w-5 h-5 ${favorites.includes(club.id)
                                                        ? 'text-teal-400 fill-teal-400'
                                                        : 'text-white/60'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Hours and Rating */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-1 text-white/60 text-sm">
                                            <Clock className="w-3 h-3" />
                                            <span>{formatOpeningHours(club.openingHours)}</span>
                                            {isClubOpen(club.openingHours) && (
                                                <span className="text-green-400 ml-1">• Open</span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            <span className="text-white text-sm font-medium">
                                                {club.rating.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price Range and Categories */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-teal-400 text-sm font-medium">
                                                {club.priceRange}
                                            </span>
                                            {club.categories.slice(0, 2).map((category, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full"
                                                >
                                                    {category}
                                                </span>
                                            ))}
                                        </div>

                                        {club.featured && (
                                            <span className="bg-gradient-to-r from-teal-600 to-teal-500 text-white text-xs px-2 py-1 rounded-full">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Loading indicator */}
                {loading && clubs.length > 0 && (
                    <div className="flex justify-center py-6">
                        <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
                    </div>
                )}

                {/* Load more button */}
                {!loading && hasMore && clubs.length > 0 && (
                    <div className="flex justify-center py-6">
                        <button
                            onClick={loadMore}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            Load More Clubs
                        </button>
                    </div>
                )}

                {/* No more clubs message */}
                {!loading && !hasMore && clubs.length > 0 && (
                    <div className="text-center py-6">
                        <p className="text-white/60">No more clubs to load</p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && clubs.length === 0 && !error && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="text-white/70 mb-4">No clubs found</p>
                        <button
                            onClick={() => fetchClubs(1, true)}
                            className="bg-teal-600 text-white px-6 py-2 rounded-lg"
                        >
                            Refresh
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}