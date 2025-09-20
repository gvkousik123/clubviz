'use client';

import React, { useState } from 'react';
import { ChevronLeft, Search, MapPin, Navigation } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LocationPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('Nagpur');
    const [selectedLocation, setSelectedLocation] = useState('');

    const searchResults = [
        {
            name: 'Dharampeth',
            city: 'Nagpur',
            type: 'area'
        },
        {
            name: 'Airport Road',
            city: 'Nagpur',
            type: 'road'
        },
        {
            name: 'Sadar',
            city: 'Nagpur',
            type: 'area'
        }
    ];

    const handleLocationSelect = (location: string) => {
        setSelectedLocation(location);
        // Navigate back or update location
        router.back();
    };

    const handleCurrentLocation = () => {
        // Request geolocation and set current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('Current location:', position.coords);
                    router.back();
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-6">
                <div className="flex items-center">
                    <button onClick={() => router.back()} className="mr-4">
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <h1 className="text-xl font-bold text-white">Enter your Location</h1>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search location"
                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent text-lg"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
                        >
                            <span className="text-white text-sm">×</span>
                        </button>
                    )}
                </div>

                {/* Current Location */}
                <button
                    onClick={handleCurrentLocation}
                    className="w-full flex items-center space-x-4 p-4 mb-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-colors"
                >
                    <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                        <Navigation className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-white font-medium">Use your current location</p>
                    </div>
                </button>

                {/* Search Results */}
                {searchQuery && (
                    <div>
                        <h3 className="text-white/80 text-sm font-medium mb-4">Search result</h3>
                        <div className="space-y-3">
                            {searchResults
                                .filter(result =>
                                    result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    result.city.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((result, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleLocationSelect(`${result.name}, ${result.city}`)}
                                        className="w-full flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors text-left"
                                    >
                                        <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-teal-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium">{result.name}</p>
                                            <p className="text-white/60 text-sm">{result.city}</p>
                                        </div>
                                    </button>
                                ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Keyboard placeholder for mobile design */}
            <div className="h-64 bg-gray-600/20 p-4">
                <div className="grid grid-cols-10 gap-1 h-full">
                    {/* Top row */}
                    <div className="col-span-10 flex justify-center space-x-2 mb-2">
                        <div className="bg-white/20 rounded px-4 py-2 text-white/60 text-sm">"The"</div>
                        <div className="bg-white/20 rounded px-4 py-2 text-white/60 text-sm">the</div>
                        <div className="bg-white/20 rounded px-4 py-2 text-white/60 text-sm">to</div>
                    </div>

                    {/* QWERTY keyboard layout */}
                    <div className="col-span-10 grid grid-cols-10 gap-1 text-white text-center">
                        {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map((key) => (
                            <div key={key} className="bg-white/20 rounded py-2 text-sm">{key}</div>
                        ))}
                        {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ''].map((key, index) => (
                            <div key={`middle-${index}`} className={`bg-white/20 rounded py-2 text-sm ${index === 9 ? 'opacity-0' : ''}`}>
                                {key}
                            </div>
                        ))}
                        {['', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '', ''].map((key, index) => (
                            <div key={`bottom-${index}`} className={`bg-white/20 rounded py-2 text-sm ${index === 0 || index === 8 || index === 9 ? 'opacity-0' : ''}`}>
                                {key}
                            </div>
                        ))}
                    </div>

                    {/* Space bar and controls */}
                    <div className="col-span-10 flex justify-center space-x-2 mt-2">
                        <div className="bg-white/20 rounded px-4 py-2 text-white/60 text-sm">ABC</div>
                        <div className="flex-1 bg-white/20 rounded py-2"></div>
                        <div className="bg-blue-500 rounded px-4 py-2 text-white text-sm">↵</div>
                    </div>
                </div>
            </div>
        </div>
    );
}