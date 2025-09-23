'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, MapPin, Clock, Phone, Share2, Heart } from 'lucide-react';
import Link from 'next/link';

export default function RaastaClubPage() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
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

                <div className="flex items-center justify-between px-6 pt-4">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide text-center flex-1 mr-10">
                        RAASTA
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6 space-y-6">
                {/* Club Image */}
                <div className="relative h-48 rounded-2xl overflow-hidden">
                    <img
                        src="/upscale-club-interior-with-blue-lighting.jpg"
                        alt="Raasta Club"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center">
                            <Heart size={20} className="text-white" />
                        </button>
                        <button className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center">
                            <Share2 size={20} className="text-white" />
                        </button>
                    </div>
                    <div className="absolute bottom-4 right-4">
                        <div className="bg-cyan-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                            4.5 ⭐
                        </div>
                    </div>
                </div>

                {/* Club Details */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-white font-bold text-2xl mb-2">RAASTA</h2>
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin size={16} className="text-teal-400" />
                            <p className="text-white/80 text-sm">Central Avenue, Nagpur</p>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <Clock size={16} className="text-teal-400" />
                            <p className="text-white/80 text-sm">Open until 2:00 am</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={16} className="text-teal-400" />
                            <p className="text-white/80 text-sm">+91 XXXXXXXXX</p>
                        </div>
                    </div>

                    {/* Current Event */}
                    <div className="bg-[#222831] rounded-lg p-4">
                        <h3 className="text-white font-bold text-lg mb-2">Current Event</h3>
                        <p className="text-teal-400 font-medium">Weekend Vibes with DJ Zara</p>
                        <p className="text-white/70 text-sm mt-1">Starting at 9:00 PM</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/gallery">
                            <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg transition-all duration-300">
                                View Gallery
                            </button>
                        </Link>
                        <Link href="/review">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-300">
                                Reviews
                            </button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/booking/form">
                            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 rounded-lg transition-all duration-300">
                                Book Now
                            </button>
                        </Link>

                        <button className="w-full bg-[#222831] border border-teal-400/30 text-white font-medium py-3 rounded-lg transition-all duration-300">
                            Get Directions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}