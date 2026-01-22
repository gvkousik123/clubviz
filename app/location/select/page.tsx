'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation, Check, MapPin, Info, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserLocation } from '@/hooks/use-user-location';
import PageHeader from '@/components/common/page-header';
import { GoogleMapPicker } from '@/components/common/google-map-picker';

export default function LocationSelectPage() {
    const router = useRouter();
    const { toast } = useToast();
    const {
        userLocation,
        hasLocation,
        loading: apiLoading,
        updateUserLocation,
        calculateDistance,
    } = useUserLocation();

    const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [locationName, setLocationName] = useState<string>('');
    const [locationCity, setLocationCity] = useState<string>('');
    const [locationState, setLocationState] = useState<string>('');
    const [locationCountry, setLocationCountry] = useState<string>('');
    const [locationPincode, setLocationPincode] = useState<string>('');
    const [isLoadingGeocode, setIsLoadingGeocode] = useState(false);
    const [distanceInfo, setDistanceInfo] = useState<{ distanceKm: number; distanceMiles: number } | null>(null);
    const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

    // Initialize map center from saved location or default
    const mapCenter = userLocation
        ? { lat: userLocation.latitude, lng: userLocation.longitude }
        : { lat: 19.0760, lng: 72.8777 }; // Mumbai default

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
            setIsLoadingGeocode(true);
            // Use OpenStreetMap's Nominatim API (free, no key required)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();

            if (data.address) {
                const city = data.address.city || data.address.town || data.address.village || '';
                const state = data.address.state || '';
                const country = data.address.country || '';
                const pincode = data.address.postcode || '';
                const road = data.address.road || '';
                const suburb = data.address.suburb || '';

                // Set all location details
                setLocationCity(city);
                setLocationState(state);
                setLocationCountry(country);
                setLocationPincode(pincode);

                // Build full address
                let fullAddress = '';
                if (road && suburb) {
                    fullAddress = `${road}, ${suburb}`;
                } else if (road) {
                    fullAddress = road;
                } else if (suburb) {
                    fullAddress = suburb;
                } else {
                    fullAddress = data.display_name || '';
                }

                let fullName = '';
                if (city && country) {
                    fullName = `${city}, ${country}`;
                } else if (state && country) {
                    fullName = `${state}, ${country}`;
                } else {
                    fullName = data.display_name || '';
                }

                setLocationName(fullAddress || fullName);
                return fullName;
            }
            return '';
        } catch (error) {
            console.error('Error getting location name:', error);
            return '';
        } finally {
            setIsLoadingGeocode(false);
        }
    };

    const handleMapSelect = async (coords: { lat: number; lng: number }) => {
        setSelectedCoords(coords);
        setDistanceInfo(null);
        setShowUpdateConfirm(false);

        // Get location name
        await getLocationName(coords.lat, coords.lng);

        // If user already has a saved location, calculate distance
        if (hasLocation && userLocation) {
            const distance = await calculateDistance(coords.lat, coords.lng);
            if (distance) {
                setDistanceInfo({
                    distanceKm: distance.distanceKm,
                    distanceMiles: distance.distanceMiles
                });
                setShowUpdateConfirm(true);
            }
        }
    };

    const handleConfirmLocation = async () => {
        if (!selectedCoords) {
            toast({
                title: 'No location selected',
                description: 'Please select a location on the map first.',
                variant: 'destructive',
            });
            return;
        }

        try {
            // Call API to update user location with all details
            await updateUserLocation(
                selectedCoords.lat,
                selectedCoords.lng,
                locationName,
                locationCity,
                locationState || null,
                locationCountry || null,
                locationPincode || null
            );

            // Success toast is shown by the hook
            // Navigate after small delay
            setTimeout(() => {
                router.push('/home');
            }, 500);
        } catch (error) {
            console.error('Error saving location:', error);
            // Error toast is shown by the hook
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
                await getLocationName(latitude, longitude);

                // Calculate distance if user has saved location
                if (hasLocation && userLocation) {
                    const distance = await calculateDistance(latitude, longitude);
                    if (distance) {
                        setDistanceInfo({
                            distanceKm: distance.distanceKm,
                            distanceMiles: distance.distanceMiles
                        });
                        setShowUpdateConfirm(true);
                    }
                }

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
        <div className="min-h-screen w-full bg-gradient-to-b from-[#031414] to-[#021313] pb-10">
            {/* Custom Header with better styling */}
            <div className="fixed top-0 left-0 right-0 max-w-[430px] mx-auto bg-gradient-to-b from-[#11B9AB] via-[#0a9589] to-[#031414] px-4 py-6 z-40">
                <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-white" />
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-wide">
                            {hasLocation ? 'Update Location' : 'Choose Location'}
                        </h1>
                        <p className="text-xs text-white/70">
                            {hasLocation ? 'Change your saved location' : 'Select or pin on map'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 pt-28 space-y-5">
                {/* Current Saved Location Info */}
                <div className="rounded-2xl border border-[#14FFEC]/50 bg-gradient-to-br from-[#0a5a57]/60 to-[#14FFEC]/20 p-4 shadow-lg">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">
                                Current Saved Location
                            </p>
                            {hasLocation && userLocation ? (
                                <>
                                    <p className="text-sm font-bold text-[#14FFEC]">
                                        {userLocation.city || 'Saved Location'}
                                    </p>
                                    <p className="text-xs text-white/60 font-mono mt-1">
                                        {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
                                    </p>
                                </>
                            ) : (
                                <p className="text-sm font-bold text-white/60">
                                    N/A
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* No Location Message */}
                {!hasLocation && !apiLoading && (
                    <div className="rounded-2xl border border-yellow-500/50 bg-gradient-to-br from-yellow-900/40 to-yellow-600/10 p-4 shadow-lg">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-yellow-400 mb-1">
                                    No Location Saved
                                </p>
                                <p className="text-xs text-white/70">
                                    Select your location to get personalized club and event recommendations
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Use Current Location Button */}
                <button
                    onClick={handleUseCurrentLocation}
                    disabled={apiLoading}
                    className="w-full flex items-center gap-3 rounded-2xl border border-[#14FFEC]/40 bg-gradient-to-r from-[#0a5a57] to-[#0d7a76] px-4 py-4 text-left text-white hover:from-[#0d7a76] hover:to-[#0a9589] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                            center={mapCenter}
                            radius={5000}
                            onSelect={handleMapSelect}
                            height="350px"
                        />
                    </div>
                </div>

                {/* Distance Information (if exists) */}
                {distanceInfo && showUpdateConfirm && (
                    <div className="rounded-2xl border border-orange-500/50 bg-gradient-to-br from-orange-900/40 to-orange-600/10 p-4 shadow-lg">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">
                                    Distance from Current Location
                                </p>
                                <p className="text-lg font-bold text-orange-400">
                                    {distanceInfo.distanceKm.toFixed(2)} km
                                </p>
                                <p className="text-xs text-white/60">
                                    ({distanceInfo.distanceMiles.toFixed(2)} miles)
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Selected Location Display */}
                {selectedCoords && (
                    <div className="rounded-2xl border border-[#14FFEC]/50 bg-gradient-to-br from-[#0a5a57]/40 to-[#14FFEC]/10 p-5 shadow-lg">
                        <div className="space-y-3">
                            {/* Location Name */}
                            {locationName && (
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-5 h-5 text-[#14FFEC] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                                            New Location
                                        </p>
                                        <p className="text-sm font-bold text-[#14FFEC]">{locationName}</p>
                                    </div>
                                </div>
                            )}

                            {isLoadingGeocode && !locationName && (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border-2 border-[#14FFEC]/30 border-t-[#14FFEC] animate-spin" />
                                    <p className="text-xs text-white/60">Getting location name...</p>
                                </div>
                            )}

                            {/* Coordinates */}
                            <div className="pt-2 border-t border-[#14FFEC]/20">
                                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                                    Coordinates
                                </p>
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
                    disabled={!selectedCoords || apiLoading}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#005D5C] to-[#14FFEC] text-white font-bold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg text-base"
                >
                    {apiLoading ? (
                        <>
                            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            {hasLocation ? 'Updating...' : 'Saving...'}
                        </>
                    ) : (
                        <>
                            <Check className="w-5 h-5" />
                            {hasLocation ? 'Update Location' : 'Confirm Location'}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
