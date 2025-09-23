'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Navigation } from 'lucide-react';

export default function LocationSelectPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('Nagpur');

    const handleGoBack = () => {
        router.back();
    };

    const handleUseCurrentLocation = () => {
        // Request geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Handle success - you can add logic to update location
                    console.log('Current position:', position);
                    router.back();
                },
                (error) => {
                    console.error('Geolocation error:', error);
                }
            );
        }
    };

    const handleLocationSelect = (location: string) => {
        // Update location and go back
        router.back();
    };

    const searchResults = [
        { name: 'Dharampeth', city: 'Nagpur' },
        { name: 'Airport Road', city: 'Nagpur' },
        { name: 'Sadar', city: 'Nagpur' },
    ];

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
                        Enter your Location
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-8 space-y-6">
                {/* Search Input */}
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search location"
                        className="w-full pl-12 pr-12 py-3 bg-[#222831] border border-gray-600 rounded-[25px] text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-all duration-300"
                        >
                            <span className="text-white text-sm">✕</span>
                        </button>
                    )}
                </div>

                {/* Use Current Location */}
                <button
                    onClick={handleUseCurrentLocation}
                    className="w-full flex items-center gap-4 py-4 px-4 hover:bg-white/5 transition-all duration-300"
                >
                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                        <Navigation size={16} className="text-white" />
                    </div>
                    <span className="text-white font-medium">Use your current location</span>
                </button>

                {/* Search Results */}
                <div className="space-y-4">
                    <p className="text-white/70 text-sm">Search result</p>

                    {searchResults.map((location, index) => (
                        <button
                            key={index}
                            onClick={() => handleLocationSelect(location.name)}
                            className="w-full flex items-center gap-4 py-4 px-4 hover:bg-white/5 transition-all duration-300"
                        >
                            <div className="w-8 h-8 bg-teal-600/20 border border-teal-400/40 rounded-full flex items-center justify-center">
                                <MapPin size={16} className="text-teal-400" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-white font-medium">{location.name}</p>
                                <p className="text-white/70 text-sm">{location.city}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}