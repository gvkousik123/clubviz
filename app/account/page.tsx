'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, Edit, ChevronDown, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useProfile } from '@/hooks/use-profile';
import { ClubService } from '@/lib/services/club.service';
import { EventService } from '@/lib/services/event.service';
import { ClubCard } from '@/components/clubs/club-card';
import { EventCard } from '@/components/events/event-card';
import { formatEventDateBadge, filterUpcomingEvents } from '@/lib/utils';

export default function MyAccountPage() {
    const router = useRouter();
    const [favoriteClubs, setFavoriteClubs] = useState<any[]>([]);
    const [favoriteEvents, setFavoriteEvents] = useState<any[]>([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);
    const [clubFavoritesIds, setClubFavoritesIds] = useState<string[]>([]);
    const [eventFavoritesIds, setEventFavoritesIds] = useState<string[]>([]);
    
    const {
        profile,
        stats,
        currentUser,
        isProfileLoading,
        isStatsLoading,
        loadProfile,
        loadStats,
    } = useProfile();

    // Load profile data on mount
    useEffect(() => {
        loadProfile();
        loadStats();
        loadFavorites();
    }, [loadProfile, loadStats]);

    const loadFavorites = async () => {
        setLoadingFavorites(true);
        try {
            const clubsResponse: any = await ClubService.getUserFavoriteClubs({ page: 0, size: 2 });
            const clubs = clubsResponse?.clubs || clubsResponse?.content || clubsResponse?.data?.clubs || [];
            setFavoriteClubs(clubs.slice(0, 2));
            setClubFavoritesIds(clubs.map((c: any) => c.id).filter(Boolean));

            const eventsResponse: any = await EventService.getFavoriteEvents({ page: 0, size: 10 });
            const events = eventsResponse?.events || eventsResponse?.content || eventsResponse?.data?.events || [];
            const upcomingEvents = filterUpcomingEvents(events);
            setFavoriteEvents(upcomingEvents.slice(0, 2));
            setEventFavoritesIds(events.map((e: any) => e.id).filter(Boolean));
        } catch (error) {
            console.error('Error loading favorites:', error);
        } finally {
            setLoadingFavorites(false);
        }
    };

    const handleToggleClubFavorite = async (clubId: string) => {
        const isFav = clubFavoritesIds.includes(clubId);
        try {
            if (isFav) {
                await ClubService.removeClubFromFavorites(clubId);
                setClubFavoritesIds(prev => prev.filter(id => id !== clubId));
                setFavoriteClubs(prev => prev.filter(c => c.id !== clubId));
            } else {
                await ClubService.addClubToFavorites(clubId);
                setClubFavoritesIds(prev => [...prev, clubId]);
            }
        } catch (error) {
            console.error('Failed to update club favorite:', error);
        }
    };

    const handleToggleEventFavorite = async (eventId: string) => {
        const isFav = eventFavoritesIds.includes(eventId);
        try {
            if (isFav) {
                await EventService.removeFromFavorites(eventId);
                setEventFavoritesIds(prev => prev.filter(id => id !== eventId));
                setFavoriteEvents(prev => prev.filter(e => e.id !== eventId));
            } else {
                await EventService.addToFavorites(eventId);
                setEventFavoritesIds(prev => [...prev, eventId]);
            }
        } catch (error) {
            console.error('Failed to update event favorite:', error);
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    const handleEditPreferences = (type: string) => {
        router.push('/account/edit');
    };

    // Use real user data from API
    const displayFullName = currentUser?.fullName || currentUser?.username || 'User';
    const displayUsername = currentUser?.username || currentUser?.email || 'User';
    const displayEmail = currentUser?.email || 'No email';
    const displayPhone = currentUser?.mobileNumber || currentUser?.phoneNumber || 'Not provided';
    const displayPicture = currentUser?.profilePicture || '/placeholder/image.png';

    return (
        <div className="min-h-screen bg-[#021313] text-white">
            <div className="relative mx-auto max-w-[430px] min-h-screen overflow-auto">
                {/* Header Section with Gradient Background */}
                <div className="relative bg-gradient-to-t from-[#11B9AB] to-[#222831] rounded-bl-[30px] rounded-br-[30px] px-4 pt-4 pb-8">


                    {/* Back Button and Title */}
                    <div className="flex items-center justify-between px-4 mb-6">
                        <button
                            onClick={handleGoBack}
                            className="w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center"
                        >
                            <span className="text-white text-lg font-bold">&lt;</span>
                        </button>
                        <h1 className="text-white text-xl font-manrope font-bold tracking-[0.50px] absolute left-1/2 transform -translate-x-1/2">MY ACCOUNT</h1>
                        <button
                            onClick={() => router.push('/account/edit')}
                            className="w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <Edit size={18} className="text-white" />
                        </button>
                    </div>

                    {/* Profile Section */}
                    <div className="flex items-center justify-between px-4 gap-4 w-full">
                        <div className="flex-1 flex flex-col gap-3">
                            {/* Full Name */}
                            <div className="text-white text-base font-manrope font-semibold tracking-[0.50px]">
                                {displayFullName}
                            </div>
                            {/* Username / ID */}
                            <div className="text-[#C3C2C2] text-xs font-manrope font-medium tracking-[0.50px] break-words">
                                {displayUsername}
                            </div>
                            {/* Phone Number - Left Aligned with more text */}
                            <div className="text-[#C3C2C2] text-sm font-manrope font-medium tracking-[0.50px] mt-2">
                                {displayPhone && displayPhone !== 'Not provided' ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#14FFEC]">📱</span>
                                        <span>{displayPhone}</span>
                                    </div>
                                ) : displayEmail && displayEmail !== 'No email' ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#14FFEC]">✉️</span>
                                        <span>{displayEmail}</span>
                                    </div>
                                ) : (
                                    <span>Contact info not available</span>
                                )}
                            </div>
                        </div>
                        {/* Profile Picture */}
                        <div className="relative flex-shrink-0">
                            <div className="w-[125px] h-[125px] rounded-full border-2 border-[#14FFEC]"></div>
                            {displayPicture && displayPicture !== '/placeholder/image.png' ? (
                                <img
                                    className="absolute top-[11px] left-[11px] w-[103px] h-[103px] bg-[#D9D9D9] rounded-full object-cover"
                                    src={displayPicture}
                                    alt="Profile"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/placeholder/image.png';
                                    }}
                                />
                            ) : (
                                <img
                                    className="absolute top-[11px] left-[11px] w-[103px] h-[103px] bg-[#D9D9D9] rounded-full object-cover"
                                    src="/placeholder/image.png"
                                    alt="Profile Placeholder"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-6 py-6 space-y-6">
                    {/* My Bookings */}
                    <Link href="/booking" className="bg-[#0D1F1F] rounded-xl p-4 flex items-center justify-between hover:bg-[#1a2d2d] transition-colors cursor-pointer">
                        <span className="text-white font-medium text-sm">My Bookings</span>
                        <ChevronRight className="w-5 h-5 text-[#14FFEC]" />
                    </Link>

                    {/* Favourite Clubs Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-white font-semibold text-sm whitespace-nowrap">Favourite Clubs</h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                            {favoriteClubs.length > 0 && (
                                <Link href="/favourites/clubs" className="text-[#14FFEC] text-xs font-medium hover:text-[#11B9AB] transition">
                                    View All
                                </Link>
                            )}
                        </div>
                        {loadingFavorites ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="w-5 h-5 text-[#14FFEC] animate-spin" />
                            </div>
                        ) : favoriteClubs.length > 0 ? (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {favoriteClubs.map(club => (
                                    <div key={club.id} className="flex-shrink-0 w-[270px]">
                                        <ClubCard
                                            club={club}
                                            href={`/club/${club.id}`}
                                            fallbackImage="/placeholder/image.png"
                                            isFavorite={clubFavoritesIds.includes(club.id)}
                                            onToggleFavorite={handleToggleClubFavorite}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[#9D9C9C] text-xs">No favorite clubs yet</p>
                        )}
                    </div>

                    {/* Favourite Events Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-white font-semibold text-sm whitespace-nowrap">Favourite Events</h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                            {favoriteEvents.length > 0 && (
                                <Link href="/favourites/events" className="text-[#14FFEC] text-xs font-medium hover:text-[#11B9AB] transition">
                                    View All
                                </Link>
                            )}
                        </div>
                        {loadingFavorites ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="w-5 h-5 text-[#14FFEC] animate-spin" />
                            </div>
                        ) : favoriteEvents.length > 0 ? (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {favoriteEvents.map(event => (
                                    <div key={event.id} className="flex-shrink-0 w-[270px]">
                                        <EventCard
                                            event={event}
                                            href={`/event/${event.id}`}
                                            fallbackImage="/placeholder/image.png"
                                            formattedDate={formatEventDateBadge(event.startDateTime)}
                                            isFavorite={eventFavoritesIds.includes(event.id)}
                                            onToggleFavorite={handleToggleEventFavorite}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[#9D9C9C] text-xs">No favorite events yet</p>
                        )}
                    </div>

                    {/* My Preferences Section - Empty State */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-white font-semibold text-sm whitespace-nowrap">My Preferences</h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                        </div>

                        {/* Empty State */}
                        <div className="bg-[#0D1F1F] rounded-lg p-6 text-center">
                            <p className="text-gray-400 text-sm">No preferences set yet</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}