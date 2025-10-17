'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { setStoredLocation, DEFAULT_LOCATION } from '@/lib/location';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Link from 'next/link';
import '../location.css';

export default function LocationAllowPage() {
    const router = useRouter();
    const { toast } = useToast();

    const handleAllowLocation = () => {
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
                        title: 'Location access granted',
                        description: 'Now showing venues and events near you.',
                    });

                    // Navigate to home page
                    router.push('/home');
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    toast({
                        title: 'Unable to access location',
                        description: 'Please enable location access or enter location manually.',
                        variant: 'destructive',
                    });
                }
            );
        } else {
            toast({
                title: 'Location not supported',
                description: 'Your device doesn\'t support location services.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#021313] relative">
            {/* Back Button */}
            <div className="absolute left-4 top-24">
                <Link href="/auth/login" className="w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center transform rotate-90">
                    <ArrowLeft className="w-4 h-4 text-white transform -rotate-90" />
                </Link>
            </div>

            {/* Location Icon */}
            <div className="flex flex-col items-center justify-center mt-[130px]">
                <div className="w-[174px] h-[174px] bg-[#014A4B] rounded-full flex items-center justify-center">
                    <div className="relative w-[118px] h-[117px] location-pin">
                        <div className="absolute w-[59px] h-[76px] bg-[#14FFEC] left-1/2 top-1 -translate-x-1/2"></div>
                        <div className="absolute w-[20px] h-[7px] bg-[#014A4B] rounded-full left-1/2 bottom-8 -translate-x-1/2"></div>
                    </div>
                </div>
            </div>

            {/* Text Content */}
            <div className="flex flex-col items-center px-4 mt-16">
                <h1 className="text-white text-[23px] font-semibold text-center">What is your location?</h1>

                <p className="text-[#14FFEC] text-[16px] font-semibold text-center mt-4">
                    We need your location to show<br />
                    amazing Venues and Events
                </p>
            </div>

            {/* Allow Location Button */}
            <div className="flex justify-center px-4 mt-16">
                <button
                    onClick={handleAllowLocation}
                    className="w-full max-w-[342px] h-[56px] bg-[#074344] rounded-[44px] border-2 border-[#00C3C1] flex items-center justify-center location-btn"
                >
                    <span className="text-white text-[18px] font-bold tracking-[1.8px]">
                        ALLOW LOCATION ACCESS
                    </span>
                </button>
            </div>            {/* Manual Entry Link */}
            <div className="flex justify-center mt-12">
                <Link
                    href="/location/select"
                    className="text-[#14FFEC] text-[16px] font-semibold"
                >
                    Enter location manually
                </Link>
            </div>
        </div>
    );
}