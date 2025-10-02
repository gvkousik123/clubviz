'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Share2, Heart } from 'lucide-react';
import Link from 'next/link';

export default function BoilerRoomPage() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0d7377] to-[#222831] text-white">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-b-[30px] pb-8">

                <div className="flex items-center justify-between px-6 pt-4">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold tracking-wide text-center flex-1 mr-10">
                        BOILER ROOM
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6 space-y-6">
                {/* Event Image */}
                <div className="relative h-64 rounded-2xl overflow-hidden">
                    <img
                        src="/night-party-event-poster-with-purple-and-pink-neon.jpg"
                        alt="Boiler Room Event"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button className="glassmorphism-light w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all">
                            <Heart size={20} className="text-red-500 fill-red-500" />
                        </button>
                        <button className="glassmorphism-light w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all">
                            <Share2 size={20} className="text-white" />
                        </button>
                    </div>
                    <div className="absolute top-4 left-4">
                        <div className="bg-gradient-to-b from-black to-[#00c0ca] text-white text-xs font-bold px-3 py-2 rounded-lg">
                            <div className="text-center">
                                <div className="text-xs opacity-70">DEC</div>
                                <div className="text-lg">30</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event Details */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-white font-bold text-2xl mb-2">Boiler Room ft Kratex</h2>
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin size={16} className="text-teal-400" />
                            <p className="text-white/80 text-sm">Dabo, Airport Road, Nagpur</p>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar size={16} className="text-teal-400" />
                            <p className="text-white/80 text-sm">December 30, 2025</p>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <Clock size={16} className="text-teal-400" />
                            <p className="text-white/80 text-sm">10:00 PM - 3:00 AM</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-teal-400" />
                            <p className="text-white/80 text-sm">500+ attending</p>
                        </div>
                    </div>

                    {/* Event Category */}
                    <div className="glassmorphism px-4 py-2 rounded-full text-center w-fit">
                        <span className="text-cyan-400 text-sm font-medium">Electronic & Progressive House</span>
                    </div>

                    {/* Description */}
                    <div className="glassmorphism rounded-xl p-4">
                        <h3 className="text-white font-bold text-lg mb-2">About Event</h3>
                        <p className="text-white/80 text-sm leading-relaxed">
                            Experience the underground vibe with Kratex spinning exclusive electronic and progressive house tracks.
                            This special Boiler Room session promises to deliver an intimate yet explosive atmosphere.
                            Join us for a night of pure electronic bliss!
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link href="/booking/event">
                            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-lg transition-all duration-300">
                                Book Tickets Now
                            </button>
                        </Link>

                        <div className="grid grid-cols-2 gap-3">
                            <button className="glassmorphism text-white font-medium py-3 rounded-xl hover:bg-white/5 transition-all duration-300">
                                View Gallery
                            </button>
                            <button className="glassmorphism text-white font-medium py-3 rounded-xl hover:bg-white/5 transition-all duration-300">
                                Get Directions
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}