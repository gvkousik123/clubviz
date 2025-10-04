'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Share2, Heart, Music } from 'lucide-react';
import Link from 'next/link';

export default function BoilerRoomPage() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-[#1e2328] text-white">
            {/* Hero Section */}
            <div className="relative h-80 bg-black">
                <img
                    src="/night-party-event-poster-with-purple-and-pink-neon.jpg"
                    alt="Boiler Room Event"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

                {/* Header Icons */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                    <button
                        onClick={handleGoBack}
                        className="p-2 glassmorphism-light rounded-full hover:bg-white/10 transition-all duration-300"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <div className="flex gap-3">
                        <button className="p-2 glassmorphism-light rounded-full hover:bg-white/10 transition-all duration-300">
                            <Share2 size={20} className="text-white" />
                        </button>
                        <button className="p-2 glassmorphism-light rounded-full hover:bg-white/10 transition-all duration-300">
                            <Heart size={20} className="text-red-500 fill-red-500" />
                        </button>
                    </div>
                </div>

                {/* Event Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center border-4 border-white/20">
                            <span className="text-white font-bold text-2xl">B</span>
                        </div>
                    </div>

                    <div className="text-center mb-4">
                        <h1 className="text-white font-bold text-2xl mb-1">BOILER ROOM</h1>
                        <p className="text-white/80 text-sm">Dabo, Airport Road, Nagpur</p>
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="glassmorphism px-4 py-2 rounded-full">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="glassmorphism px-4 py-2 rounded-full">
                            <Clock className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="glassmorphism px-4 py-2 rounded-full">
                            <Users className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="glassmorphism px-4 py-2 rounded-full">
                            <MapPin className="w-4 h-4 text-cyan-400" />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Link href="/booking/event" className="flex-1">
                            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-xl hover:brightness-110 transition-all">
                                Book Tickets Now
                            </button>
                        </Link>
                        <button className="flex-1 glassmorphism text-white font-bold py-3 px-6 rounded-xl hover:bg-white/10 transition-all">
                            Get Directions
                        </button>
                    </div>
                </div>
            </div>

            {/* Now Playing Section */}
            <div className="px-6 py-4 bg-[#2d343a]">
                <h3 className="text-white font-semibold text-sm mb-3">Now Playing</h3>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <Music className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex gap-2 mb-2">
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full">Electronic House</span>
                            <span className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs px-2 py-1 rounded-full">Progressive</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Details Section */}
            <div className="px-6 py-6 space-y-6">
                {/* Event Details */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-white font-bold text-2xl mb-2">Event Details</h2>
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
                    <div className="glassmorphism px-4 py-2 rounded-xl text-center w-fit">
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
                    <div className="grid grid-cols-2 gap-3">
                        <button className="glassmorphism text-white font-medium py-3 rounded-xl hover:bg-white/5 transition-all duration-300">
                            View Gallery
                        </button>
                        <button className="glassmorphism text-white font-medium py-3 rounded-xl hover:bg-white/5 transition-all duration-300">
                            Share Event
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}