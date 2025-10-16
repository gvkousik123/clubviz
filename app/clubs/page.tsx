'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, Bookmark, MapPin, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ClubService } from '@/lib/services/club.service';
import type { Club, ClubListItem } from '@/lib/services/club.service';
import { useToast } from '@/hooks/use-toast';
import { resolveLocation } from '@/lib/location';

type DisplayClub = Club | ClubListItem | Record<string, unknown>;

const unwrapApiData = <T,>(payload: any): T => {
    if (payload && typeof payload === 'object' && 'data' in payload) {
        return (payload as { data: T }).data;
    }
    return payload as T;
};

const getClubImageSrc = (club: DisplayClub) => {
    const data = club as any;
    if (Array.isArray(data?.images) && data.images.length > 0) {
        const first = data.images[0];
        if (typeof first === 'string') {
            return first;
        }
        if (first?.url) {
            return first.url;
        }
    }

    const directImage = data?.logoUrl ?? data?.logo ?? data?.image;
    if (typeof directImage === 'string' && directImage.length > 0) {
        return directImage;
    }

    return '/placeholder-club.jpg';
};

const getClubAddressLabel = (club: DisplayClub) => {
    const data = club as any;
    if (typeof data?.address === 'string' && data.address.length > 0) {
        return data.address;
    }

    if (data?.locationText) {
        const { fullAddress, address1, city, state } = data.locationText as Record<string, string>;
        if (typeof fullAddress === 'string' && fullAddress.length > 0) {
            return fullAddress;
        }
        const parts = [address1, city, state].filter(Boolean);
        if (parts.length > 0) {
            return parts.join(', ');
        }
    }

    if (typeof data?.location === 'string' && data.location.length > 0) {
        return data.location;
    }

    return 'Address unavailable';
};

const getClubCategoryLabel = (club: DisplayClub) => {
    const data = club as any;
    if (Array.isArray(data?.categories) && data.categories.length > 0) {
        return data.categories[0];
    }
    if (typeof data?.category === 'string' && data.category.length > 0) {
        return data.category;
    }
    return undefined;
};

const getClubRatingLabel = (club: DisplayClub) => {
    const data = club as any;
    const rating = typeof data?.rating === 'number' ? data.rating : data?.averageRating;
    return typeof rating === 'number' ? rating.toFixed(1) : 'N/A';
};

const getClubHoursLabel = (club: DisplayClub) => {
    const data = club as any;
    if (Array.isArray(data?.openingHours) && data.openingHours.length > 0) {
        return 'View hours';
    }
    if (typeof data?.openTime === 'string' && data.openTime.length > 0) {
        return data.openTime;
    }
    return 'Hours info unavailable';
};

const getClubId = (club: DisplayClub) => {
    const data = club as any;
    return String(data?.id ?? data?.clubId ?? '');
};

const getClubName = (club: DisplayClub) => {
    const data = club as any;
    return typeof data?.name === 'string' ? data.name : 'Unnamed Club';
};

export default function ClubsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [clubs, setClubs] = useState<DisplayClub[]>([]);
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
            const [listResult, publicResult] = await Promise.allSettled([
                ClubService.getPublicClubsList({
                    page: 0,
                    size: 50,
                    location: location.city,
                }),
                ClubService.getPublicClubs(),
            ]);

            let nextClubs: DisplayClub[] = [];

            if (listResult.status === 'fulfilled') {
                const listResponse = unwrapApiData<any>(listResult.value);
                const content = Array.isArray(listResponse)
                    ? listResponse
                    : listResponse?.content ?? [];
                if (Array.isArray(content) && content.length > 0) {
                    nextClubs = content as DisplayClub[];
                } else {
                    console.warn('Club list request returned empty content.');
                }
            } else {
                console.warn('Club list request failed:', listResult.reason);
            }

            if (!nextClubs.length) {
                if (publicResult.status === 'fulfilled') {
                    const publicResponse = unwrapApiData<any>(publicResult.value);
                    const clubsData = Array.isArray(publicResponse)
                        ? publicResponse
                        : publicResponse?.content ?? publicResponse ?? [];
                    if (Array.isArray(clubsData) && clubsData.length > 0) {
                        nextClubs = clubsData as DisplayClub[];
                    } else {
                        console.warn('Public clubs response did not contain usable data.');
                    }
                } else {
                    console.warn('Public clubs request failed:', publicResult.reason);
                }
            }

            if (!nextClubs.length) {
                throw new Error('No clubs data available from API');
            }

            setClubs(nextClubs);
        } catch (err) {
            console.error('Error fetching clubs:', err);
            setError('Failed to load clubs. Please try again.');
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
                        CLUB LIST
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
                    clubs.map((club, index) => {
                        const clubId = getClubId(club);
                        const clubKey = clubId || `club-${index}`;
                        const clubName = getClubName(club);
                        return (
                            <Link
                                key={clubKey}
                                href={clubId ? `/club/${clubId}` : '#'}
                                className="block bg-[#1a3b3e] rounded-2xl p-4 hover:bg-[#204144] transition-all duration-300"
                            >
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                                        <img
                                            src={getClubImageSrc(club)}
                                            alt={clubName}
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
                                                    {clubName}
                                                </h3>
                                                <div className="flex items-center gap-1 text-white/70 text-sm mb-1">
                                                    <MapPin size={14} />
                                                    <p className="truncate">
                                                        {getClubAddressLabel(club)}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (clubId) {
                                                        toggleFavorite(clubId);
                                                    }
                                                }}
                                                className="p-2"
                                            >
                                                <Bookmark
                                                    className={`w-5 h-5 ${clubId && favorites.includes(clubId)
                                                        ? 'text-cyan-400 fill-cyan-400'
                                                        : 'text-white/60'
                                                        }`}
                                                />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-1 text-white/60 text-sm">
                                                <Clock size={14} />
                                                <p>{getClubHoursLabel(club)}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                <span className="text-white text-sm font-medium">
                                                    {getClubRatingLabel(club)}
                                                </span>
                                            </div>
                                        </div>

                                        {((club as any)?.description || (club as any)?.shortDescription) && (
                                            <p className="text-white/70 text-sm line-clamp-2">
                                                {(club as any).description ?? (club as any).shortDescription}
                                            </p>
                                        )}

                                        {getClubCategoryLabel(club) && (
                                            <div className="mt-2">
                                                <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full text-xs">
                                                    {getClubCategoryLabel(club)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })
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