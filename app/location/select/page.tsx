'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Navigation, X } from 'lucide-react';

export default function LocationSelectPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('Nagpur');

    const handleGoBack = () => {
        router.back();
    };

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('Current position:', position);
                    router.back();
                },
                (error) => {
                    console.error('Geolocation error:', error);
                }
            );
        }
    };

    const handleLocationSelect = (location) => {
        router.back();
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const searchResults = [
        { name: 'Dharampeth', city: 'Nagpur' },
        { name: 'Airport Road', city: 'Nagpur' },
        { name: 'Sadar', city: 'Nagpur' },
    ];

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white">
            <div className="flex justify-between items-center px-6 pt-4 pb-2 bg-gradient-to-r from-teal-500 to-cyan-500">
                <div className="text-white text-sm font-semibold">9:41</div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-6 h-3 bg-white border border-white rounded-sm"></div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-b-[30px] pb-8">
                <div className="flex items-center justify-center px-6 pt-4 mb-8 relative">
                    <button
                        onClick={handleGoBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 absolute left-6"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-medium tracking-wide text-center">
                        Enter your Location
                    </h1>
                </div>
            </div>

            <div className="px-6 py-6">
                <div className="relative mb-6">
                    <div className="glassmorphism rounded-full p-4 flex items-center gap-3">
                        <MapPin size={20} className="text-white/60" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-transparent text-white placeholder-white/60 outline-none"
                            placeholder="Search location"
                        />
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <X size={16} className="text-white" />
                            </button>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleUseCurrentLocation}
                    className="w-full flex items-center gap-3 p-4 mb-6 glassmorphism rounded-xl hover:bg-white/10 transition-colors"
                >
                    <Navigation size={20} className="text-cyan-400" />
                    <span className="text-white font-medium">Use your current location</span>
                </button>

                <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-white/80 text-sm">Search result</h3>
                    </div>

                    <div className="space-y-3">
                        {searchResults.map((location, index) => (
                            <button
                                key={index}
                                onClick={() => handleLocationSelect(location.name)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors rounded-lg"
                            >
                                <MapPin size={18} className="text-cyan-400" />
                                <div className="text-left">
                                    <p className="text-white font-medium">{location.name}</p>
                                    <p className="text-white/60 text-sm">{location.city}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-80"></div>
        </div>
    );
}
