'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, Bookmark, MapPin, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ClubService } from '@/lib/services/club.service';
import type { Club } from '@/lib/api-types';
import { useToast } from '@/hooks/use-toast';
import { resolveLocation } from '@/lib/location';

export default function ClubsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);

    const handleGoBack = () => {
        router.back();
    };

    useEffect(() => {
        fetchClubs();
        loadFavorites();
    }, []);

    const fetchClubs = async () => {
        try {
            setLoading(true);
            setError(null);
            const location = resolveLocation();
            const response = await ClubService.getClubs({
                page: 1,
                limit: 50,
                location: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    radius: location.radius ?? 15,
                },
            });
            setClubs(response.data.clubs);
        } catch (err) {
            setError('Failed to load clubs. Please try again.');
            console.error('Error fetching clubs:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadFavorites = () => {
        try {
            const saved = localStorage.getItem('favoriteClubs');
            if (saved) {
                setFavorites(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    };

    const toggleFavorite = (clubId: string) => {
        try {
            const newFavorites = favorites.includes(clubId)
                ? favorites.filter(id => id !== clubId)
                : [...favorites, clubId];

            setFavorites(newFavorites);
            localStorage.setItem('favoriteClubs', JSON.stringify(newFavorites));

            toast({
                title: favorites.includes(clubId) ? 'Removed from favorites' : 'Added to favorites',
                description: favorites.includes(clubId)
                    ? 'Club removed from your favorites'
                    : 'Club added to your favorites',
            });
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast({
                title: 'Error',
                description: 'Failed to update favorites',
                variant: 'destructive',
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a2e30] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto"></div>
                    <p className="mt-4 text-lg">Loading clubs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0a2e30] text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 text-lg mb-4">{error}</p>
                    <button
                        onClick={fetchClubs}
                        className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a2e30] text-white">
            <div className="header-gradient rounded-b-[30px] pb-8 pt-4">
                <div className="flex items-center justify-between px-6 pt-4 mb-6">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide text-center flex-1">
                        CLUBS
                    </h1>
                </div>

                <div className="horizontal-scroll-container px-6">
                    <div className="flex gap-3 text-sm">
                        <button className="bg-cyan-500/30 text-cyan-300 px-6 py-2 rounded-full font-medium whitespace-nowrap">
                            All
                        </button>
                        <button className="bg-white/10 text-white/80 px-6 py-2 rounded-full whitespace-nowrap">
                            Nightclub
                        </button>
                        <button className="bg-white/10 text-white/80 px-6 py-2 rounded-full whitespace-nowrap">
                            Sports Bar
                        </button>
                        <button className="bg-white/10 text-white/80 px-6 py-2 rounded-full whitespace-nowrap">
                            Lounge
                        </button>
                        <button className="bg-white/10 text-white/80 px-6 py-2 rounded-full whitespace-nowrap">
                            Rooftop
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6 space-y-4">
                {clubs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-white/60 text-lg">No clubs found</p>
                    </div>
                ) : (
                    clubs.map((club) => (
                        <Link
                            key={club.id}
                            href={`/club/${club.id}`}
                            className="block bg-[#1a3b3e] rounded-2xl p-4 hover:bg-[#204144] transition-all duration-300"
                        >
                            <div className="flex gap-4">
                                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                                    <img
                                        src={club.images?.[0] || club.logo || '/placeholder-club.jpg'}
                                        alt={club.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/placeholder-club.jpg';
                                        }}
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-bold text-white text-lg mb-1 truncate">
                                                {club.name}
                                            </h3>
                                            <div className="flex items-center gap-1 text-white/70 text-sm mb-1">
                                                <MapPin size={14} />
                                                <p className="truncate">
                                                    {club.address}
                                                </p>
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
                                                    ? 'text-cyan-400 fill-cyan-400'
                                                    : 'text-white/60'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-1 text-white/60 text-sm">
                                            <Clock size={14} />
                                            <p>{club.openingHours?.length > 0 ? 'View hours' : 'Hours not available'}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            <span className="text-white text-sm font-medium">
                                                {club.rating || 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    {club.description && (
                                        <p className="text-white/70 text-sm line-clamp-2">
                                            {club.description}
                                        </p>
                                    )}

                                    {club.categories && club.categories.length > 0 && (
                                        <div className="mt-2">
                                            <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full text-xs">
                                                {club.categories[0]}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Fixed Filter Button - Bottom Right */}
            <Link href="/filter">
                <button className="fixed bottom-6 right-6 bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                    </svg>
                </button>
            </Link>
        </div>
    );
}