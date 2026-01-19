'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Navigation } from 'lucide-react';
import {
    DEFAULT_RADIUS,
    POPULAR_LOCATIONS,
    SavedLocation,
    persistCustomLocation,
    resolveLocation,
    selectLocationFromOption,
} from '@/lib/location';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/common/page-header';
import { GoogleMapPicker } from '@/components/common/google-map-picker';

export default function LocationSelectPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [selectedLocation, setSelectedLocation] = useState<SavedLocation>(() => resolveLocation());
    const [radius, setRadius] = useState(selectedLocation.radius ?? DEFAULT_RADIUS);

    const presetMatchId = useMemo(() => {
        const match = POPULAR_LOCATIONS.find((preset) =>
            Math.abs(preset.lat - selectedLocation.lat) < 0.001 &&
            Math.abs(preset.lng - selectedLocation.lng) < 0.001
        );
        return match?.id ?? POPULAR_LOCATIONS[0].id;
    }, [selectedLocation.lat, selectedLocation.lng]);

    const handlePresetSelect = (presetId: string) => {
        const updated = selectLocationFromOption(presetId, 'list');
        setSelectedLocation(updated);
        toast({
            title: 'Location updated',
            description: updated.label || updated.name,
        });
        router.push('/home');
    };

    const handleMapSelect = (coords: { lat: number; lng: number }) => {
        const updated = persistCustomLocation({
            name: `Pinned ${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)}`,
            lat: coords.lat,
            lng: coords.lng,
        }, 'map');
        setSelectedLocation(updated);
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

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const updated = persistCustomLocation({
                    name: 'Current Location',
                    lat: latitude,
                    lng: longitude,
                }, 'geo');
                setSelectedLocation(updated);
                toast({
                    title: 'Location updated',
                    description: 'Using your current location.',
                });
                router.push('/home');
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
    };

    return (
        <div className="min-h-screen w-full bg-[#031414] pb-10">
            <PageHeader title="Choose your location" />

            <div className="px-4 pt-[16vh] space-y-6">
                {/* Quick Preset Locations */}
                <div className="space-y-3">
                    <div className="text-xs uppercase tracking-wide text-white/60 font-semibold">
                        Quick Picks
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {POPULAR_LOCATIONS.map((location) => (
                            <button
                                key={location.id}
                                onClick={() => handlePresetSelect(location.id)}
                                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${presetMatchId === location.id ? 'bg-[#14FFEC] text-black' : 'bg-white/5 text-white/80 hover:bg-white/10'}`}
                            >
                                {location.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Radius Slider */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between text-sm text-white/80">
                            <span>Search radius</span>
                            <span className="font-semibold text-[#14FFEC]">{Math.round(radius / 1000)} km</span>
                        </div>
                        <input
                            type="range"
                            min={1000}
                            max={15000}
                            step={500}
                            value={radius}
                            onChange={(event) => setRadius(Number(event.target.value))}
                            className="w-full accent-[#14FFEC]"
                        />
                    </div>
                </div>

                {/* Use Current Location Button */}
                <button
                    onClick={handleUseCurrentLocation}
                    className="w-full flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white hover:bg-white/10 transition-colors"
                >
                    <Navigation className="h-5 w-5 text-[#14FFEC] flex-shrink-0" />
                    <div>
                        <p className="text-sm font-semibold">Use your current location</p>
                        <p className="text-xs text-white/60">Requires browser permission</p>
                    </div>
                </button>

                {/* Google Maps Picker */}
                <div>
                    <p className="text-sm font-semibold text-white mb-3">Or select on map</p>
                    <GoogleMapPicker
                        center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                        radius={radius}
                        onSelect={handleMapSelect}
                        height="400px"
                    />
                </div>
            </div>
        </div>
    );
}
