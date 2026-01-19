'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation, Check } from 'lucide-react';
import {
    persistCustomLocation,
    resolveLocation,
} from '@/lib/location';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/common/page-header';
import { GoogleMapPicker } from '@/components/common/google-map-picker';

export default function LocationSelectPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [selectedLocation, setSelectedLocation] = useState(() => resolveLocation());
    const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

    const handleMapSelect = (coords: { lat: number; lng: number }) => {
        setSelectedCoords(coords);
        setSelectedLocation({
            ...selectedLocation,
            lat: coords.lat,
            lng: coords.lng,
        });
    };

    const handleConfirmLocation = () => {
        if (!selectedCoords) {
            toast({
                title: 'No location selected',
                description: 'Please select a location on the map first.',
                variant: 'destructive',
            });
            return;
        }

        const updated = persistCustomLocation({
            name: `Location (${selectedCoords.lat.toFixed(4)}, ${selectedCoords.lng.toFixed(4)})`,
            lat: selectedCoords.lat,
            lng: selectedCoords.lng,
        }, 'map');

        toast({
            title: 'Location saved',
            description: 'Your custom location has been saved.',
        });
        router.push('/home');
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast({
                title: 'Location not supported',
                description: 'Your device does not support location services.',
                variant: 'destructive',
            });
            return;
        }

        toast({
            title: 'Requesting location',
            description: 'Please allow location access in your browser.',
        });

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const coords = { lat: latitude, lng: longitude };
                setSelectedCoords(coords);
                setSelectedLocation({
                    ...selectedLocation,
                    lat: latitude,
                    lng: longitude,
                });

                toast({
                    title: 'Location detected',
                    description: 'Your current location has been set.',
                });
            },
            (error) => {
                console.error('Geolocation error:', error);
                let errorMessage = 'Please enable location access or select manually on the map.';

                if (error.code === error.PERMISSION_DENIED) {
                    errorMessage = 'Location permission denied. Please enable it in your browser settings.';
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    errorMessage = 'Location information unavailable. Please try again.';
                } else if (error.code === error.TIMEOUT) {
                    errorMessage = 'Location request timed out. Please try again.';
                }

                toast({
                    title: 'Unable to access location',
                    description: errorMessage,
                    variant: 'destructive',
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    return (
        <div className="min-h-screen w-full bg-[#031414] pb-10">
            <PageHeader title="Choose your location" />

            <div className="px-4 pt-[16vh] space-y-6">
                {/* Use Current Location Button */}
                <button
                    onClick={handleUseCurrentLocation}
                    className="w-full flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white hover:bg-white/10 transition-colors"
                >
                    <Navigation className="h-5 w-5 text-[#14FFEC] flex-shrink-0" />
                    <div>
                        <p className="text-sm font-semibold">Use your current location</p>
                        <p className="text-xs text-white/60">Click to allow browser permission</p>
                    </div>
                </button>

                {/* Google Maps Picker */}
                <div>
                    <p className="text-sm font-semibold text-white mb-3">Or select on map</p>
                    <GoogleMapPicker
                        center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                        radius={5000}
                        onSelect={handleMapSelect}
                        height="calc(100vh - 380px)"
                    />
                </div>

                {/* Selected Coordinates Display */}
                {selectedCoords && (
                    <div className="rounded-2xl border border-[#14FFEC]/30 bg-[#14FFEC]/10 p-4">
                        <p className="text-sm font-semibold text-white mb-2">Selected Coordinates</p>
                        <div className="space-y-1 text-xs text-white/80 font-mono">
                            <p>Latitude: {selectedCoords.lat.toFixed(6)}</p>
                            <p>Longitude: {selectedCoords.lng.toFixed(6)}</p>
                        </div>
                    </div>
                )}

                {/* Confirm Button */}
                <button
                    onClick={handleConfirmLocation}
                    disabled={!selectedCoords}
                    className="w-full py-3 px-6 rounded-[30px] bg-gradient-to-r from-[#005D5C] to-[#14FFEC] text-white font-bold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Check className="w-5 h-5" />
                    Confirm Location
                </button>
            </div>
        </div>
    );
}
