'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Navigation, Search } from 'lucide-react';
import { setStoredLocation, SavedLocation, DEFAULT_LOCATION } from '@/lib/location';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/common/page-header';

export default function LocationSelectPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('Nagpur');
    const { toast } = useToast();

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    setStoredLocation({
                        latitude,
                        longitude,
                        radius: DEFAULT_LOCATION.radius,
                        label: 'Current Location',
                    });

                    toast({
                        title: 'Location updated',
                        description: 'Using your current location for recommendations.',
                    });
                    router.back();
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    toast({
                        title: 'Unable to access location',
                        description: 'Please enable location access or pick a location manually.',
                        variant: 'destructive',
                    });
                }
            );
        }
    };

    const handleLocationSelect = (location: LocationOption) => {
        setStoredLocation({
            latitude: location.latitude,
            longitude: location.longitude,
            radius: DEFAULT_LOCATION.radius,
            city: location.city,
            label: location.name,
        });

        toast({
            title: 'Location updated',
            description: `${location.name}, ${location.city}`,
        });
        router.back();
    };

    type LocationOption = SavedLocation & { name: string; city: string };

    const searchResults: LocationOption[] = [
        { name: 'Dharampeth', city: 'Nagpur', latitude: 21.1457, longitude: 79.0689 },
        { name: 'Airport Road', city: 'Nagpur', latitude: 21.1059, longitude: 79.0475 },
        { name: 'Sadar', city: 'Nagpur', latitude: 21.1578, longitude: 79.0882 },
    ];

    return (
        <div className="min-h-screen w-full bg-[#031414] overflow-hidden">
            <PageHeader title="Enter your Location" />

            {/* Search Input */}
            <div className="px-4 py-6 pt-[20vh]">
                <div className="w-full h-[51px] px-[15px] py-2 bg-white/20 shadow-md rounded-[23px] flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                        <div className="w-[30px] h-[30px] relative overflow-hidden flex-shrink-0">
                            <MapPin size={25} className="absolute left-[2.47px] top-[2.47px] text-white" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 min-w-0 h-6 text-white text-base font-['Manrope'] font-bold leading-6 tracking-[0.50px] bg-transparent outline-none placeholder-white/60"
                            placeholder="Search location..."
                        />
                    </div>
                    <div className="w-[30px] h-[30px] relative overflow-hidden flex-shrink-0">
                        <Search size={24.38} className="absolute left-[2.81px] top-[2.81px] text-white" />
                    </div>
                </div>
            </div>

            {/* Use Current Location */}
            <div className="px-9 py-2">
                <button
                    onClick={handleUseCurrentLocation}
                    className="flex items-center gap-3 hover:bg-white/5 transition-colors rounded-lg p-2"
                >
                    <div className="w-[30px] h-[30px] relative overflow-hidden">
                        <Navigation size={24.37} className="absolute left-[4.70px] top-[4.69px] text-[#14FFEC]" />
                    </div>
                    <div className="text-white text-base font-['Manrope'] font-bold leading-4 tracking-[0.50px]">
                        Use your current location
                    </div>
                </button>
            </div>

            {/* Divider Line */}
            <div className="w-[368px] h-0 mx-auto my-4 border-[1.50px] border-[#088188]"></div>

            {/* Search Results */}
            <div className="px-9">
                <div className="text-[#DADADA] text-sm font-['Manrope'] font-bold leading-4 tracking-[0.50px] mb-4">
                    Search result
                </div>

                <div className="space-y-6">
                    {searchResults.map((location, index) => (
                        <button
                            key={index}
                            onClick={() => handleLocationSelect(location)}
                            className="w-full flex items-center gap-3 hover:bg-white/5 transition-colors rounded-lg p-2"
                        >
                            <div className="w-5 h-5 relative overflow-hidden">
                                <MapPin size={16.24} className="absolute left-[3.13px] top-[3.13px] text-[#14FFEC]" />
                            </div>
                            <div className="flex flex-col items-start gap-1">
                                <div className="text-white text-base font-['Manrope'] font-bold leading-4 tracking-[0.50px]">
                                    {location.name}
                                </div>
                                <div className="text-[#9D9C9C] text-[13px] font-['Manrope'] font-bold leading-4 tracking-[0.50px]">
                                    {location.city}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
