'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, Edit, ChevronDown, User } from 'lucide-react';
import Link from 'next/link';
import { useProfile } from '@/hooks/use-profile';

export default function MyAccountPage() {
    const router = useRouter();
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
    }, [loadProfile, loadStats]);

    const handleGoBack = () => {
        router.back();
    };

    const handleEditProfile = () => {
        router.push('/account/edit');
    };

    const handleEditPreferences = (type: string) => {
        console.log('Edit preferences:', type);
        router.push('/account/edit');
    };

    // Use real user data from profile or current user
    const displayName = profile?.fullName || currentUser?.fullName || 'User';
    const displayEmail = profile?.email || currentUser?.email || 'No email';

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
                        <div className="w-[35px]"></div> {/* Spacer for centering */}
                    </div>

                    {/* Profile Section */}
                    <div className="flex items-end justify-between px-4">
                        <div className="flex flex-col items-center gap-8">
                            <div className="flex flex-col items-center gap-2">
                                <div className="text-white text-base font-manrope font-medium tracking-[0.50px]">
                                    {isProfileLoading ? 'Loading...' : `Hi, ${displayName}`}
                                </div>
                                <div className="text-[#C3C2C2] text-[13px] font-manrope font-medium tracking-[0.50px]">
                                    {displayEmail}
                                </div>
                            </div>
                            <button
                                onClick={handleEditProfile}
                                className="px-4 py-2 bg-white/20 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[30px] backdrop-blur-sm"
                            >
                                <span className="text-white text-base font-manrope font-medium tracking-[0.50px]">
                                    Edit Profile
                                </span>
                            </button>
                        </div>
                        <div className="relative">
                            <div className="w-[125px] h-[125px] rounded-full border-2 border-[#14FFEC]"></div>
                            {(profile?.profilePicture || currentUser?.profilePicture) ? (
                                <img
                                    className="absolute top-[11px] left-[11px] w-[103px] h-[103px] bg-[#D9D9D9] rounded-full object-cover"
                                    src={profile?.profilePicture || currentUser?.profilePicture}
                                    alt="Profile"
                                />
                            ) : (
                                <div className="absolute top-[11px] left-[11px] w-[103px] h-[103px] bg-[#D9D9D9] rounded-full flex items-center justify-center">
                                    <User className="w-12 h-12 text-gray-400" />
                                </div>
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
                        <Link href="/favourites/clubs" className="flex items-center gap-4 cursor-pointer">
                            <h3 className="text-white font-semibold text-sm whitespace-nowrap">Favourite Clubs</h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                        </Link>

                        <div className="space-y-3">
                            {/* Dabo Club */}
                            <Link href="/favourites/clubs" className="bg-[#0D1F1F] rounded-xl p-4 flex items-center justify-between hover:bg-[#1a2d2d] transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <img
                                        className="w-10 h-10 rounded-full object-cover"
                                        src="/venue/Screenshot 2024-12-11 002033.png"
                                        alt="Dabo Club"
                                    />
                                    <div>
                                        <p className="text-white font-medium text-sm">Dabo</p>
                                        <p className="text-white/70 text-xs">5.6 km away</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-medium text-xs">Open Now</span>
                                    <ChevronRight className="w-4 h-4 text-[#14FFEC]" />
                                </div>
                            </Link>

                            {/* Raasta Club */}
                            <Link href="/favourites/clubs" className="bg-[#0D1F1F] rounded-xl p-4 flex items-center justify-between hover:bg-[#1a2d2d] transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <img
                                        className="w-10 h-10 rounded-full object-cover border-2 border-[#14FFEC]"
                                        src="/venue/Screenshot 2024-12-11 002328.png"
                                        alt="Raasta Club"
                                    />
                                    <div>
                                        <p className="text-white font-medium text-sm">Raasta</p>
                                        <p className="text-white/70 text-xs">8.2 km away</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-medium text-xs">Open Now</span>
                                    <ChevronRight className="w-4 h-4 text-[#14FFEC]" />
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Favourite Events Section */}
                    <div className="space-y-4">
                        <Link href="/favourites/events" className="flex items-center gap-4 cursor-pointer">
                            <h3 className="text-white font-semibold text-sm whitespace-nowrap">Favourite Events</h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                        </Link>

                        <div className="space-y-3">
                            {/* Tipsy Tuesday Event - Special Styling */}
                            <div className="relative">
                                {/* Live Now background section */}
                                <div className="bg-[#0D9A8F] rounded-[25px] pt-18 pb-2">
                                    <div className="flex items-center justify-center gap-1.5 mt-1">
                                        <span className="text-white text-xs font-bold tracking-wide">
                                            Live Now
                                        </span>
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                    </div>
                                </div>

                                {/* Main card floating over the Live Now section */}
                                <Link href="/event/tipsy-tuesday" className="absolute top-0 left-0 right-0 block bg-[#0D1F1F] rounded-[25px] p-4 hover:bg-[#1a2d2d] transition-colors shadow-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                className="w-10 h-10 rounded-full object-cover border border-white"
                                                src="/event list/Rectangle 1.jpg"
                                                alt="Tipsy Tuesday"
                                            />
                                            <div>
                                                <div className="text-white text-sm font-bold">
                                                    Tipsy Tuesday
                                                </div>
                                                <div className="text-white/80 text-xs">
                                                    Dabo, Airport Rd
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#14FFEC] text-xs font-bold">
                                                24 Dec 2025
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-[#14FFEC]" />
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Boiler Room Event */}
                            <Link href="/event/boiler-room" className="bg-[#0D1F1F] rounded-[25px] p-4 flex items-center justify-between hover:bg-[#1a2d2d] transition-colors shadow-lg">
                                <div className="flex items-center gap-3">
                                    <img
                                        className="w-10 h-10 rounded-full object-cover"
                                        src="/event list/Rectangle 2.jpg"
                                        alt="Boiler Room"
                                    />
                                    <div>
                                        <p className="text-white font-medium text-sm">Boiler Room ft Kratex</p>
                                        <p className="text-white/70 text-xs">Dabo, Airport Rd</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[#14FFEC] font-medium text-xs">30 Dec 2025</span>
                                    <ChevronRight className="w-4 h-4 text-[#14FFEC]" />
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* My Preferences Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-white font-semibold text-sm whitespace-nowrap">My Preferences</h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                            <button
                                onClick={() => handleEditPreferences('all')}
                                className="flex items-center gap-1 text-[#14FFEC] text-xs"
                            >
                                Edit <Edit size={12} />
                            </button>
                        </div>

                        {/* Music Genre */}
                        <div className="bg-[#0D1F1F] rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-white font-medium text-sm">Music Genre</span>
                                <div className="flex items-center gap-2">
                                    <ChevronDown className="w-4 h-4 text-white/70" />
                                    <button
                                        onClick={() => handleEditPreferences('music')}
                                        className="text-[#14FFEC] text-xs flex items-center gap-1"
                                    >
                                        Edit <Edit size={10} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Club Type */}
                        <div className="bg-[#0D1F1F] rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-white font-medium text-sm">Club Type</span>
                                <div className="flex items-center gap-2">
                                    <ChevronDown className="w-4 h-4 text-white/70" />
                                    <button
                                        onClick={() => handleEditPreferences('club')}
                                        className="text-[#14FFEC] text-xs flex items-center gap-1"
                                    >
                                        Edit <Edit size={10} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}