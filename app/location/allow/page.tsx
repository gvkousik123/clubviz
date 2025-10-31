'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { setStoredLocation, DEFAULT_LOCATION } from '@/lib/location';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';
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
        <div className="min-h-screen bg-[#021313] relative flex flex-col">
            {/* Background blur effects - subtle accents */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-1/3 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Back Button - styled like mobile screens */}
                <div className="p-4 pt-6">
                    <Link
                        href="/auth/email"
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-teal-400/30 text-teal-300 hover:bg-teal-500/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </div>

                {/* Main content - properly centered */}
                <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16 -mt-10">
                    {/* Location icon - modern style matching screenshot */}
                    <div className="mb-10">
                        <div className="w-[140px] h-[140px] rounded-full bg-[#014A4B] flex items-center justify-center">
                            <div className="w-[80px] h-[80px] relative">
                                <Image
                                    src="/location/location-icon.png"
                                    alt="Location icon"
                                    width={80}
                                    height={80}
                                    className="object-contain location-pin"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Text content */}
                    <h1 className="text-white text-[24px] font-semibold text-center mb-4">
                        What is your location ?
                    </h1>

                    <p className="text-[#14FFEC] text-[16px] font-semibold text-center mb-10">
                        We need your location to show<br />
                        amazing Venues and Events
                    </p>

                    {/* Button - styled to match screenshot */}
                    <button
                        onClick={handleAllowLocation}
                        className="w-full max-w-[342px] h-[56px] bg-transparent rounded-full border-2 border-[#14FFEC]/80 flex items-center justify-center text-white text-[18px] font-bold tracking-[1.2px] mb-10 hover:bg-[#14FFEC]/10 transition-all"
                    >
                        ALLOW LOCATION ACCESS
                    </button>

                    {/* Manual entry link */}
                    <Link
                        href="/location/select"
                        className="text-[#14FFEC] text-[16px] font-semibold text-center"
                    >
                        Enter location manually
                    </Link>
                </div>
            </div>
        </div>
    );
}