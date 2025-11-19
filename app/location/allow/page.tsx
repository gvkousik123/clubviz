'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { persistCustomLocation, resolveLocation } from '@/lib/location';
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

                    persistCustomLocation({
                        name: 'Current Location',
                        lat: latitude,
                        lng: longitude,
                        city: 'Detected nearby area',
                    }, 'geo');

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
            const fallback = resolveLocation();
            toast({
                title: 'Location not supported',
                description: `Using default location ${fallback.label} (${fallback.city ?? ''}).`,
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#021313] relative flex flex-col">
            {/* Background blur effects - subtle accents */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[12vh] left-1/2 -translate-x-1/2 w-[20rem] h-[20rem] bg-teal-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[12vh] left-1/3 w-[15rem] h-[15rem] bg-cyan-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Back Button - styled like mobile screens */}
                <div className="p-[1rem] pt-[1.5rem]">
                    <Link
                        href="/auth/details"
                        className="w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-full border border-teal-400/30 text-teal-300 hover:bg-teal-500/10 transition-colors"
                    >
                        <ArrowLeft className="w-[1.25rem] h-[1.25rem]" />
                    </Link>
                </div>

                {/* Main content - properly centered */}
                <div className="flex-1 flex flex-col items-center justify-center px-[1rem] pb-[4rem] -mt-[2.5rem]">
                    {/* Location icon - modern style matching screenshot */}
                    <div className="mb-[2.5rem]">
                        <div className="w-[8.75rem] h-[8.75rem] rounded-full bg-[#014A4B] flex items-center justify-center">
                            <div className="w-[5rem] h-[5rem] relative">
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
                    <h1 className="text-white text-[1.5rem] font-semibold text-center mb-[1rem]">
                        What is your location ?
                    </h1>

                    <p className="text-[#14FFEC] text-[1rem] font-semibold text-center mb-[2.5rem]">
                        We need your location to show<br />
                        amazing Venues and Events
                    </p>

                    {/* Button - styled to match screenshot */}
                    <button
                        onClick={handleAllowLocation}
                        className="w-full max-w-[21.375rem] h-[3.5rem] bg-transparent rounded-full border-2 border-[#14FFEC]/80 flex items-center justify-center text-white text-[1.125rem] font-bold tracking-[0.075rem] mb-[2.5rem] hover:bg-[#14FFEC]/10 transition-all"
                    >
                        ALLOW LOCATION ACCESS
                    </button>

                    {/* Manual entry link */}
                    <Link
                        href="/location/select"
                        className="text-[#14FFEC] text-[1rem] font-semibold text-center"
                    >
                        Enter location manually
                    </Link>
                </div>
            </div>
        </div>
    );
}