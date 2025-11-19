'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Navigation, RefreshCcw, Search, WifiOff } from 'lucide-react';
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
import { LocationSuggestionList } from '@/components/common/location-suggestion-list';
import { NearbyDetailCard } from '@/components/common/nearby-detail-card';
import { GoogleMapPicker } from '@/components/common/google-map-picker';
import { NearbyDetailsResponse, NearbyResultSummary, SearchService } from '@/lib/services/search.service';

const getSuggestionKey = (suggestion: NearbyResultSummary) => suggestion.id || suggestion.place_id || `${suggestion.lat}-${suggestion.lng}`;

export default function LocationSelectPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
    const [selectedLocation, setSelectedLocation] = useState<SavedLocation>(() => resolveLocation());
    const [radius, setRadius] = useState(selectedLocation.radius ?? DEFAULT_RADIUS);
    const [suggestions, setSuggestions] = useState<NearbyResultSummary[]>([]);
    const [suggestionError, setSuggestionError] = useState<string | null>(null);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null);
    const [loadingSuggestionId, setLoadingSuggestionId] = useState<string | null>(null);
    const [details, setDetails] = useState<NearbyDetailsResponse | null>(null);
    const [isOffline, setIsOffline] = useState<boolean>(typeof navigator !== 'undefined' ? !navigator.onLine : false);

    const presetMatchId = useMemo(() => {
        const match = POPULAR_LOCATIONS.find((preset) =>
            Math.abs(preset.lat - selectedLocation.lat) < 0.001 &&
            Math.abs(preset.lng - selectedLocation.lng) < 0.001
        );
        return match?.id ?? POPULAR_LOCATIONS[0].id;
    }, [selectedLocation.lat, selectedLocation.lng]);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const fetchNearbySuggestions = useCallback(async (
        overrideCoords?: { lat: number; lng: number },
        categoryOverride?: string | undefined,
    ) => {
        if (isOffline) {
            setSuggestionError('You appear to be offline. Showing cached location only.');
            setSuggestions([]);
            return;
        }

        setIsLoadingSuggestions(true);
        setSuggestionError(null);

        try {
            const response = await SearchService.findNearbyAll({
                lat: overrideCoords?.lat ?? selectedLocation.lat,
                lng: overrideCoords?.lng ?? selectedLocation.lng,
                radius,
                category: categoryOverride ?? activeCategory,
            });

            if (response.success && response.data) {
                const nextSuggestions = response.data.results ?? [];
                setSuggestions(nextSuggestions);
                if (nextSuggestions.length === 0) {
                    setSuggestionError('No nearby suggestions found within the selected radius.');
                }
            } else {
                setSuggestions([]);
                setSuggestionError(response.message || 'Unable to load nearby suggestions.');
            }
        } catch (error: any) {
            console.error('Nearby search error:', error);
            setSuggestions([]);
            setSuggestionError(error.message || 'Failed to search nearby locations.');
        } finally {
            setIsLoadingSuggestions(false);
        }
    }, [activeCategory, isOffline, radius, selectedLocation.lat, selectedLocation.lng]);

    useEffect(() => {
        fetchNearbySuggestions();
    }, [fetchNearbySuggestions]);

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
                    description: 'Using your current location for recommendations.',
                });
                fetchNearbySuggestions({ lat: latitude, lng: longitude });
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

    const handlePresetSelect = (presetId: string) => {
        const updated = selectLocationFromOption(presetId, 'list');
        setSelectedLocation(updated);
        toast({
            title: 'Location updated',
            description: updated.label || updated.name,
        });
        fetchNearbySuggestions({ lat: updated.lat, lng: updated.lng });
    };

    const handleMapSelect = (coords: { lat: number; lng: number }) => {
        const updated = persistCustomLocation({
            name: `Pinned ${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)}`,
            lat: coords.lat,
            lng: coords.lng,
        }, 'map');
        setSelectedLocation(updated);
        toast({
            title: 'Pinned location saved',
            description: 'Running a fresh nearby search with your custom pin.',
        });
        fetchNearbySuggestions(coords);
    };

    const handleSuggestionSelect = async (suggestion: NearbyResultSummary) => {
        const suggestionKey = getSuggestionKey(suggestion);
        setSelectedSuggestionId(suggestionKey);
        setLoadingSuggestionId(suggestionKey);

        if (!suggestion.id && !suggestion.place_id) {
            const updated = persistCustomLocation({
                name: suggestion.name,
                lat: suggestion.lat,
                lng: suggestion.lng,
                address: suggestion.address,
            }, 'list');
            setSelectedLocation(updated);
            toast({
                title: 'Location saved',
                description: `${suggestion.name} set without extra details.`,
            });
            setLoadingSuggestionId(null);
            router.back();
            return;
        }

        try {
            const response = await SearchService.getNearbyDetails({
                id: suggestion.id,
                place_id: suggestion.place_id,
            });

            if (response.success && response.data) {
                setDetails(response.data);
                const updated = persistCustomLocation({
                    name: suggestion.name,
                    lat: suggestion.lat,
                    lng: suggestion.lng,
                    address: suggestion.address,
                }, 'list');
                setSelectedLocation(updated);
                toast({
                    title: 'Location locked in',
                    description: `${suggestion.name} saved as your active area.`,
                });
                router.back();
            } else {
                setDetails(null);
                toast({
                    title: 'Details unavailable',
                    description: response.message || 'Unable to load place details.',
                    variant: 'destructive',
                });
            }
        } catch (error: any) {
            console.error('Details fetch error:', error);
            setDetails(null);
            toast({
                title: 'Unable to load details',
                description: error.message || 'Please try another suggestion.',
                variant: 'destructive',
            });
        } finally {
            setLoadingSuggestionId(null);
        }
    };

    const handleSearchSubmit = () => {
        const trimmed = searchTerm.trim();
        setActiveCategory(trimmed || undefined);
        fetchNearbySuggestions(undefined, trimmed || undefined);
    };

    return (
        <div className="min-h-screen w-full bg-[#031414] pb-10">
            <PageHeader title="Choose your location" />

            <div className="px-4 pt-[16vh] space-y-6">
                {isOffline && (
                    <div className="flex items-center gap-2 rounded-2xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-50">
                        <WifiOff className="h-4 w-4" />
                        Offline mode enabled. You can still view your saved location.
                    </div>
                )}

                <div className="flex items-center gap-3 rounded-[23px] bg-white/10 px-4 py-2">
                    <MapPin className="h-5 w-5 text-[#14FFEC]" />
                    <input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search by area, category, vibe..."
                        className="flex-1 bg-transparent text-base font-semibold text-white placeholder-white/60 outline-none"
                    />
                    <button
                        onClick={handleSearchSubmit}
                        className="rounded-full bg-[#14FFEC]/20 p-2 text-white"
                        aria-label="Search nearby"
                    >
                        <Search className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/60">
                        <span>Quick picks</span>
                        <button
                            className="inline-flex items-center gap-1 text-[#14FFEC]"
                            onClick={() => fetchNearbySuggestions()}
                        >
                            <RefreshCcw className="h-3.5 w-3.5" /> Refresh
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {POPULAR_LOCATIONS.map((location) => (
                            <button
                                key={location.id}
                                onClick={() => handlePresetSelect(location.id)}
                                className={`rounded-full px-4 py-2 text-xs font-semibold ${presetMatchId === location.id ? 'bg-[#14FFEC] text-black' : 'bg-white/5 text-white/80'}`}
                            >
                                {location.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between text-sm text-white/80">
                            <span>Search radius</span>
                            <span>{Math.round(radius / 1000)} km</span>
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

                <button
                    onClick={handleUseCurrentLocation}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white"
                >
                    <Navigation className="h-5 w-5 text-[#14FFEC]" />
                    <div>
                        <p className="text-sm font-semibold">Use your current location</p>
                        <p className="text-xs text-white/60">Requires browser permission</p>
                    </div>
                </button>

                <GoogleMapPicker
                    center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                    radius={radius}
                    onSelect={handleMapSelect}
                />

                <div className="space-y-3">
                    <div className="text-sm font-semibold text-white">Nearby suggestions</div>
                    <LocationSuggestionList
                        suggestions={suggestions}
                        onSelect={handleSuggestionSelect}
                        isLoading={isLoadingSuggestions}
                        error={suggestionError}
                        selectedId={selectedSuggestionId}
                        loadingId={loadingSuggestionId}
                        emptyStateText="No nearby suggestions found yet. Try increasing the radius."
                    />
                </div>

                <NearbyDetailCard detail={details} title="Selected place" isLoading={!!loadingSuggestionId} />
            </div>
        </div>
    );
}
