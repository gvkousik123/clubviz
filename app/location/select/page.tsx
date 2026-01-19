'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation, Check, MapPin } from 'lucide-react';
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
    const [locationName, setLocationName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    // Suppress Google Maps iframe errors
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            if (event.message?.includes('Cannot read property') ||
                event.filename?.includes('maps') ||
                event.message?.includes('iframe')) {
                event.preventDefault();
                return false;
            }
        };

        window.addEventListener('error', handleError, true);

        return () => {
            window.removeEventListener('error', handleError, true);
        };
    }, []);

    // Reverse geocode to get location name from coordinates
    const getLocationName = async (lat: number, lng: number) => {
        try {
            // Use OpenStreetMap's Nominatim API (free, no key required)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();

            if (data.address) {
                const city = data.address.city || data.address.town || data.address.village;
                const country = data.address.country;
                if (city && country) {
                    return `${city}, ${country}`;
                }
                return data.address.road || data.display_name || '';
            }
            return '';
        } catch (error) {
            console.error('Error getting location name:', error);
            return '';
        }
    };

    const handleMapSelect = async (coords: { lat: number; lng: number }) => {
        setSelectedCoords(coords);
        setSelectedLocation({
            ...selectedLocation,
            lat: coords.lat,
            lng: coords.lng,
        });

        // Get location name
        setIsLoading(true);
        const name = await getLocationName(coords.lat, coords.lng);
        setLocationName(name);
        setIsLoading(false);
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

        try {
            const updated = persistCustomLocation({
                name: locationName || `Location (${selectedCoords.lat.toFixed(4)}, ${selectedCoords.lng.toFixed(4)})`,
                lat: selectedCoords.lat,
                lng: selectedCoords.lng,
            }, 'map');

            toast({
                title: 'Location saved',
                description: locationName || 'Custom location saved.',
            });

            // Use small delay to ensure toast is visible before navigation
            setTimeout(() => {
                router.push('/home');
            }, 500);
        } catch (error) {
            console.error('Error saving location:', error);
            toast({
                title: 'Error',
                description: 'Failed to save location. Please try again.',
                variant: 'destructive',
            });
        }
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
            async (position) => {
                const { latitude, longitude } = position.coords;
                const coords = { lat: latitude, lng: longitude };
                setSelectedCoords(coords);
                setSelectedLocation({
                    ...selectedLocation,
                    lat: latitude,
                    lng: longitude,
                });

                // Get location name
                setIsLoading(true);
                const name = await getLocationName(latitude, longitude);
                setLocationName(name);
                setIsLoading(false);

                toast({
                    title: 'Location detected',
                    description: name || 'Your current location has been set.',
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
        <div className="min-h-screen w-full bg-gradient-to-b from-[#031414] to-[#021313] pb-10">
            {/* Custom Header with better styling */}
            <div className="fixed top-0 left-0 right-0 max-w-[430px] mx-auto bg-gradient-to-b from-[#11B9AB] via-[#0a9589] to-[#031414] px-4 py-6 z-40">
                <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-white" />
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-wide">Choose Location</h1>
                        <p className="text-xs text-white/70">Select or pin on map</p>
                    </div>
                </div>
            </div>

            <div className="px-4 pt-28 space-y-5">
                {/* Use Current Location Button */}
                <button
                    onClick={handleUseCurrentLocation}
                    className="w-full flex items-center gap-3 rounded-2xl border border-[#14FFEC]/40 bg-gradient-to-r from-[#0a5a57] to-[#0d7a76] px-4 py-4 text-left text-white hover:from-[#0d7a76] hover:to-[#0a9589] transition-all shadow-lg"
                >
                    <Navigation className="h-6 w-6 text-[#14FFEC] flex-shrink-0" />
                    <div>
                        <p className="text-sm font-bold">Use Current Location</p>
                        <p className="text-xs text-white/70">Browser permission required</p>
                    </div>
                </button>

                {/* Google Maps Picker with better styling */}
                <div className="space-y-2">
                    <p className="text-sm font-bold text-[#14FFEC] uppercase tracking-widest">Or Select on Map</p>
                    <div className="rounded-3xl overflow-hidden shadow-2xl border border-[#14FFEC]/20">
                        <GoogleMapPicker
                            center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                            radius={5000}
                            onSelect={handleMapSelect}
                            height="350px"
                        />
                    </div>
                </div>

                {/* Selected Location Display */}
                {selectedCoords && (
                    <div className="rounded-2xl border border-[#14FFEC]/50 bg-gradient-to-br from-[#0a5a57]/40 to-[#14FFEC]/10 p-5 shadow-lg">
                        <div className="space-y-3">
                            {/* Location Name */}
                            {locationName && (
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Location</p>
                                        <p className="text-sm font-bold text-[#14FFEC]">{locationName}</p>
                                    </div>
                                </div>
                            )}

                            {isLoading && !locationName && (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border-2 border-[#14FFEC]/30 border-t-[#14FFEC] animate-spin" />
                                    <p className="text-xs text-white/60">Getting location name...</p>
                                </div>
                            )}

                            {/* Coordinates */}
                            <div className="pt-2 border-t border-[#14FFEC]/20">
                                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Coordinates</p>
                                <div className="space-y-1 text-xs font-mono text-white/80">
                                    <p>
                                        <span className="text-[#14FFEC]">LAT:</span> {selectedCoords.lat.toFixed(6)}
                                    </p>
                                    <p>
                                        <span className="text-[#14FFEC]">LNG:</span> {selectedCoords.lng.toFixed(6)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirm Button */}
                <button
                    onClick={handleConfirmLocation}
                    disabled={!selectedCoords}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#005D5C] to-[#14FFEC] text-white font-bold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg text-base"
                >
                    <Check className="w-5 h-5" />
                    Confirm Location
                </button>
            </div>
        </div>
    );
}
