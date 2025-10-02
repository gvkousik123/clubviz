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
        <div className="min-h-screen bg-[#1e2328] text-white">
            {/* Status Bar */}
            <div className="flex justify-between items-center px-6 pt-4 pb-2 bg-gradient-to-r from-teal-600 to-teal-500">
                <div className="text-white text-sm font-semibold">9:41</div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-6 h-3 bg-white border border-white rounded-sm"></div>
                </div>
            </div>

            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-b-[30px] pb-8">
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
                    <div className="text-center">
                        <h2 className="text-white font-bold text-xl mb-1">Hi, DAVID SIMON</h2>
                        <p className="text-white/90 text-sm mb-4">davidsimon12@test.com</p>
                        <Link href="/profile/edit">
                            <button className="glassmorphism-light text-white font-medium py-3 px-6 rounded-[20px] transition-all duration-300 hover:bg-white/10">
                                Edit Profile
                            </button>
                        </Link>
                    </div>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-600 to-teal-500 border-4 border-cyan-400 flex items-center justify-center">
                        <span className="text-3xl">🐻</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6 space-y-6">
                {/* My Bookings */}
                <div className="bg-[#222831] rounded-xl p-4 flex items-center justify-between hover:bg-[#2a3037] transition-colors">
                    <span className="text-white font-medium text-base">My Bookings</span>
                    <ChevronRight className="w-5 h-5 text-cyan-400" />
                </div>

                {/* Favourite Clubs Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h3 className="text-white font-semibold text-base whitespace-nowrap">Favourite Clubs</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
                    </div>

                    <div className="space-y-3">
                        {/* Dabo Club */}
                        <Link href="/event/dabo" className="bg-[#222831] rounded-xl p-4 flex items-center justify-between hover:bg-[#2a3037] transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-600 to-teal-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">D</span>
                                </div>
                                <div>
                                    <p className="text-white font-medium">Dabo</p>
                                    <p className="text-white/70 text-sm">5.6 km away</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-medium">Open Now</span>
                                <ChevronRight className="w-5 h-5 text-cyan-400" />
                            </div>
                        </Link>

                        {/* Raasta Club */}
                        <Link href="/event/raasta" className="bg-[#222831] rounded-xl p-4 flex items-center justify-between hover:bg-[#2a3037] transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-600 to-teal-500 flex items-center justify-center border-2 border-cyan-400">
                                    <span className="text-white font-bold text-sm">R</span>
                                </div>
                                <div>
                                    <p className="text-white font-medium">Raasta</p>
                                    <p className="text-white/70 text-sm">8.2 km away</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-medium">Open Now</span>
                                <ChevronRight className="w-5 h-5 text-cyan-400" />
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
                        <Link href="/event/tipsy-tuesday" className="bg-[#222831] rounded-xl p-4 flex items-center justify-between hover:bg-[#2a3037] transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-600 to-teal-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">TT</span>
                                </div>
                                <div>
                                    <p className="text-white font-medium">Tipsy Tuesday</p>
                                    <p className="text-white/70 text-sm">Dabo, Airport Rd</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-cyan-400 font-medium">24 Dec 2025</span>
                                <ChevronRight className="w-5 h-5 text-cyan-400" />
                            </div>
                        </Link>

                        {/* Boiler Room Event */}
                        <Link href="/event/boiler-room" className="bg-[#222831] rounded-xl p-4 flex items-center justify-between hover:bg-[#2a3037] transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-600 to-teal-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">BR</span>
                                </div>
                                <div>
                                    <p className="text-white font-medium">Boiler Room ft Kratex</p>
                                    <p className="text-white/70 text-sm">Dabo, Airport Rd</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-cyan-400 font-medium">30 Dec 2025</span>
                                <ChevronRight className="w-5 h-5 text-cyan-400" />
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