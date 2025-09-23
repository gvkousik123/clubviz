'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit2, ChevronRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function MyAccountPage() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    const handleEditPreferences = (type: string) => {
        console.log('Edit preferences:', type);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0d7377] to-[#222831] text-white">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-b-[30px] pb-8">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 pt-4 pb-2">
                    <div className="text-white text-sm font-semibold">9:41</div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-3 bg-white/60 rounded-sm"></div>
                        <div className="w-4 h-3 bg-white/60 rounded-sm"></div>
                        <div className="w-6 h-3 bg-white border border-white/60 rounded-sm"></div>
                    </div>
                </div>

                <div className="flex items-center justify-between px-6 pt-4 mb-8">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide text-center flex-1 mr-10">
                        MY ACCOUNT
                    </h1>
                </div>

                {/* Profile Section */}
                <div className="px-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-white font-bold text-lg mb-1">Hi, DAVID SIMON</h2>
                        <p className="text-white/80 text-sm">davidsimon12@test.com</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/profile/edit">
                            <button className="bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-[20px] transition-all duration-300">
                                Edit Profile
                            </button>
                        </Link>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 border-4 border-teal-400/30 flex items-center justify-center">
                            <span className="text-2xl">🐻</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6 space-y-6">
                {/* My Bookings */}
                <div className="flex items-center justify-between py-4 border-b border-white/10">
                    <span className="text-white font-medium text-base">My Bookings</span>
                    <ChevronRight className="w-5 h-5 text-white/70" />
                </div>

                {/* Favourite Clubs Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h3 className="text-white font-semibold text-base whitespace-nowrap">Favourite Clubs</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
                    </div>

                    <div className="space-y-3">
                        {/* Dabo Club */}
                        <Link href="/club/dabo" className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">D</span>
                                </div>
                                <div>
                                    <p className="text-white font-medium">Dabo</p>
                                    <p className="text-white/70 text-sm">5.6 km away</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-medium">Open Now</span>
                                <ChevronRight className="w-5 h-5 text-white/70" />
                            </div>
                        </Link>

                        {/* Raasta Club */}
                        <Link href="/club/raasta" className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center border-2 border-yellow-400">
                                    <span className="text-white font-bold text-sm">R</span>
                                </div>
                                <div>
                                    <p className="text-white font-medium">Raasta</p>
                                    <p className="text-white/70 text-sm">8.2 km away</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-medium">Open Now</span>
                                <ChevronRight className="w-5 h-5 text-white/70" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Favourite Events Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h3 className="text-white font-semibold text-base whitespace-nowrap">Favourite Events</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
                    </div>

                    <div className="space-y-3">
                        {/* Tipsy Tuesday Event */}
                        <Link href="/event/tipsy-tuesday" className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">TT</span>
                                </div>
                                <div>
                                    <p className="text-white font-medium">Tipsy Tuesday</p>
                                    <p className="text-white/70 text-sm">Dabo, Airport Rd</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-cyan-400 font-medium">24 Dec 2025</span>
                                <ChevronRight className="w-5 h-5 text-white/70" />
                            </div>
                        </Link>

                        {/* Live Now Banner */}
                        <div className="bg-gradient-to-r from-teal-600 to-cyan-500 rounded-lg p-3 my-2">
                            <p className="text-white font-bold text-center tracking-wide">L i v e   N o w  🔴</p>
                        </div>

                        {/* Boiler Room Event */}
                        <Link href="/event/boiler-room" className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">BR</span>
                                </div>
                                <div>
                                    <p className="text-white font-medium">Boiler Room ft Kratex</p>
                                    <p className="text-white/70 text-sm">Dabo, Airport Rd</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-cyan-400 font-medium">30 Dec 2025</span>
                                <ChevronRight className="w-5 h-5 text-white/70" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* My Preferences Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h3 className="text-white font-semibold text-base whitespace-nowrap">My Preferences</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
                        <button
                            onClick={() => handleEditPreferences('all')}
                            className="flex items-center gap-1 text-cyan-400 text-sm"
                        >
                            Edit <Edit2 size={14} />
                        </button>
                    </div>

                    {/* Music Genre */}
                    <div className="bg-[#222831] rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-white font-medium">Music Genre</span>
                            <div className="flex items-center gap-2">
                                <ChevronDown className="w-5 h-5 text-white/70" />
                                <button
                                    onClick={() => handleEditPreferences('music')}
                                    className="text-cyan-400 text-sm flex items-center gap-1"
                                >
                                    Edit <Edit2 size={12} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Club Type */}
                    <div className="bg-[#222831] rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-white font-medium">Club Type</span>
                            <div className="flex items-center gap-2">
                                <ChevronDown className="w-5 h-5 text-white/70" />
                                <button
                                    onClick={() => handleEditPreferences('club')}
                                    className="text-cyan-400 text-sm flex items-center gap-1"
                                >
                                    Edit <Edit2 size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}