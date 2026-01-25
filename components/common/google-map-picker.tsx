'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CircleF, GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Loader2, MapPin, Maximize2, Minimize2, Search, X } from 'lucide-react';

// Static libraries array to prevent LoadScript reload warning
const GOOGLE_LIBRARIES: ('marker' | 'places')[] = ['marker', 'places'];

// Google Maps API Key - from environment variable (NEXT_PUBLIC_ prefix required for browser access)
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

// Dark theme map styles - comprehensive styling for dark mode
const DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
    { elementType: 'geometry', stylers: [{ color: '#1a2e35' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a2e35' }, { weight: 2 }] },
    { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#2d4a4a' }] },
    { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#64a89a' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#14FFEC' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#243f3f' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a8d' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1e3d34' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#4a8b6e' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d4a4a' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1a3535' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5ab' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3a5858' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#2d4545' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#b0d5cc' }] },
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#344f4f' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2d4545' }] },
    { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#14FFEC' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e2628' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4a7a7a' }] },
];

interface GoogleMapPickerProps {
    center: { lat: number; lng: number };
    currentLocation?: { lat: number; lng: number } | null; // Blue pin - user's saved location
    selectedLocation?: { lat: number; lng: number } | null; // Purple pin - tapped location
    radius?: number;
    onSelect: (coords: { lat: number; lng: number }) => void;
    apiKey?: string;
    height?: number | string;
    showFullscreenButton?: boolean;
}

const baseContainerStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
};

const resolveHeight = (height?: number | string): string => {
    if (typeof height === 'number') {
        return `${height}px`;
    }
    return height || '450px';
};

export function GoogleMapPicker({ center, currentLocation, selectedLocation, radius = 5000, onSelect, apiKey, height, showFullscreenButton = true }: GoogleMapPickerProps) {
    const mapRef = useRef<google.maps.Map | null>(null);
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    // Current location marker (blue)
    const currentMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
    const currentLegacyMarkerRef = useRef<google.maps.Marker | null>(null);
    // Selected location marker (purple)
    const selectedMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
    const selectedLegacyMarkerRef = useRef<google.maps.Marker | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

    // Debug: Log environment variable
    useEffect(() => {
        const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        console.log('🔍 Google Maps API Key check:', {
            hasKey: !!key,
            keyPreview: key ? `${key.substring(0, 10)}...${key.substring(key.length - 10)}` : 'MISSING',
            envVarName: 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'
        });

        // Suppress Google Maps error dialogs globally
        const style = document.createElement('style');
        style.id = 'gm-style-override';
        style.innerHTML = `
            .gm-err-container, .gm-err-content, .gm-err-title, .gm-err-message,
            .dismissButton, .gm-style-cc, div[role="dialog"],
            .gm-style > div > div > div > div > div[style*="z-index"][style*="position: absolute"] {
                display: none !important;
            }
        `;
        if (!document.getElementById('gm-style-override')) {
            document.head.appendChild(style);
        }

        return () => {
            const existingStyle = document.getElementById('gm-style-override');
            if (existingStyle) {
                existingStyle.remove();
            }
        };
    }, []);

    // Handle fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = async () => {
        if (!containerRef.current) return;
        try {
            if (!document.fullscreenElement) {
                await containerRef.current.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.log('Fullscreen not supported:', err);
        }
    };

    // Use hardcoded key or fallback to prop, then to env var
    const finalApiKey = apiKey || GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    const mapContainerStyle = {
        ...baseContainerStyle,
        height: resolveHeight(height),
    } as React.CSSProperties;

    // Call hooks before any conditional returns
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'clubviz-map-picker',
        googleMapsApiKey: finalApiKey,
        libraries: GOOGLE_LIBRARIES,
        preventGoogleFontsLoading: true,
    });

    // Setup current location marker (blue)
    useEffect(() => {
        if (!isLoaded || !mapRef.current || !currentLocation) {
            // Clear current marker if no location
            try {
                if (currentMarkerRef.current) {
                    currentMarkerRef.current.map = null;
                    currentMarkerRef.current = null;
                }
                if (currentLegacyMarkerRef.current) {
                    currentLegacyMarkerRef.current.setMap(null);
                    currentLegacyMarkerRef.current = null;
                }
            } catch (error) { }
            return;
        }

        const mapInstance = mapRef.current;

        try {
            // Remove old marker
            if (currentMarkerRef.current) {
                currentMarkerRef.current.map = null;
                currentMarkerRef.current = null;
            }
            if (currentLegacyMarkerRef.current) {
                currentLegacyMarkerRef.current.setMap(null);
                currentLegacyMarkerRef.current = null;
            }

            // Create blue pin for current location
            if (window.google?.maps?.Marker) {
                const marker = new window.google.maps.Marker({
                    map: mapInstance,
                    position: currentLocation,
                    title: 'Your Saved Location',
                    icon: {
                        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                        fillColor: '#3B82F6',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2,
                        scale: 1.5,
                        anchor: new window.google.maps.Point(12, 22),
                    },
                    zIndex: 100,
                });
                currentLegacyMarkerRef.current = marker;
            }
        } catch (error) {
            console.log('Error creating current location marker:', error);
        }
    }, [isLoaded, currentLocation]);

    // Setup selected location marker (purple)
    useEffect(() => {
        if (!isLoaded || !mapRef.current || !selectedLocation) {
            // Clear selected marker if no location
            try {
                if (selectedMarkerRef.current) {
                    selectedMarkerRef.current.map = null;
                    selectedMarkerRef.current = null;
                }
                if (selectedLegacyMarkerRef.current) {
                    selectedLegacyMarkerRef.current.setMap(null);
                    selectedLegacyMarkerRef.current = null;
                }
            } catch (error) { }
            return;
        }

        const mapInstance = mapRef.current;

        try {
            // Remove old marker
            if (selectedMarkerRef.current) {
                selectedMarkerRef.current.map = null;
                selectedMarkerRef.current = null;
            }
            if (selectedLegacyMarkerRef.current) {
                selectedLegacyMarkerRef.current.setMap(null);
                selectedLegacyMarkerRef.current = null;
            }

            // Create purple/magenta pin for selected location
            if (window.google?.maps?.Marker) {
                const marker = new window.google.maps.Marker({
                    map: mapInstance,
                    position: selectedLocation,
                    title: 'Selected Location',
                    icon: {
                        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                        fillColor: '#A855F7',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2.5,
                        scale: 2,
                        anchor: new window.google.maps.Point(12, 22),
                    },
                    zIndex: 200,
                });
                selectedLegacyMarkerRef.current = marker;
            }
        } catch (error) {
            console.log('Error creating selected location marker:', error);
        }
    }, [isLoaded, selectedLocation]);

    const handleMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    // Setup Google Places Autocomplete
    useEffect(() => {
        if (!isLoaded || !searchInputRef.current || !window.google?.maps?.places) return;

        try {
            // Create autocomplete instance
            const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
                fields: ['geometry', 'name', 'formatted_address'],
                types: ['geocode', 'establishment'],
            });

            // When place is selected
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();

                if (place.geometry?.location) {
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();

                    // Update search display first
                    setSearchValue(place.name || place.formatted_address || '');

                    // Trigger selection callback
                    onSelect({ lat, lng });

                    // Update map center with a small delay to ensure map is ready
                    setTimeout(() => {
                        if (mapRef.current) {
                            mapRef.current.setCenter({ lat, lng });
                            mapRef.current.panTo({ lat, lng });
                            mapRef.current.setZoom(15);
                        }
                    }, 100);
                }
            });

            autocompleteRef.current = autocomplete;
        } catch (error) {
            console.log('Error setting up autocomplete:', error);
        }

        return () => {
            if (autocompleteRef.current) {
                window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
            }
        };
    }, [isLoaded, onSelect]);

    const handleMapUnmount = useCallback(() => {
        mapRef.current = null;
        // Clean up current location marker
        if (currentMarkerRef.current) {
            currentMarkerRef.current.map = null;
            currentMarkerRef.current = null;
        }
        if (currentLegacyMarkerRef.current) {
            currentLegacyMarkerRef.current.setMap(null);
            currentLegacyMarkerRef.current = null;
        }
        // Clean up selected location marker
        if (selectedMarkerRef.current) {
            selectedMarkerRef.current.map = null;
            selectedMarkerRef.current = null;
        }
        if (selectedLegacyMarkerRef.current) {
            selectedLegacyMarkerRef.current.setMap(null);
            selectedLegacyMarkerRef.current = null;
        }
    }, []);

    // Now safe to have early returns (hooks already declared)
    if (!finalApiKey) {
        console.error('❌ Google Maps API key missing! Please check:');
        console.error('   - Env var: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
        console.error('   - File: .env.local');
        console.error('   - Restart dev server after changes');
        return (
            <div className="rounded-2xl border border-dashed border-yellow-500/50 bg-yellow-500/10 p-4 text-center text-sm text-yellow-100">
                <p className="font-semibold">⚠️ Google Maps API Key Missing</p>
                <p className="mt-2 text-xs text-yellow-200">
                    Add to .env.local:<br />
                    <code className="block bg-yellow-900/50 px-2 py-1 mt-1 rounded font-mono">
                        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDW9KJ9rak_A4DNRAFT203Z_40bmVMi4IM
                    </code>
                </p>
                <p className="mt-2 text-xs text-yellow-200">Then restart: <code className="bg-yellow-900/50 px-1 rounded">npm run dev</code></p>
            </div>
        );
    }

    if (loadError) {
        console.error('Google Maps JavaScript API failed to load:', loadError);
        const origin = typeof window !== 'undefined' ? window.location.origin : 'this site';
        return (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                <p className="font-semibold mb-2">⚠️ Google Maps failed to load</p>
                <p className="text-xs mb-2">Error: <code className="bg-red-900/50 px-1 rounded">{loadError.message || 'Unknown error'}</code></p>
                <div className="text-xs space-y-1 text-red-200">
                    <p><strong>Fix: Add authorized referrers</strong></p>
                    <ol className="ml-3 space-y-1">
                        <li>1. Open <a href="https://console.cloud.google.com/google/maps-apis/credentials" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-100">Google Cloud Console</a></li>
                        <li>2. Find your API key and click Edit</li>
                        <li>3. Go to "Application restrictions" → "HTTP referrers"</li>
                        <li>4. Add both lines:</li>
                        <li className="ml-4 font-mono bg-red-900/30 px-2 py-1 rounded">http://localhost:3001/*</li>
                        <li className="ml-4 font-mono bg-red-900/30 px-2 py-1 rounded">https://localhost:3001/*</li>
                        <li>5. Save, then restart: <code className="bg-red-900/50 px-1 rounded">pnpm dev</code></li>
                    </ol>
                </div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
                <Loader2 className="h-5 w-5 animate-spin text-[#14FFEC]" />
                Loading map...
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            style={isFullscreen ? { width: '100%', height: '100vh', borderRadius: 0 } : mapContainerStyle}
            className="relative"
        >
            {/* Search Box - Hidden in fullscreen */}
            {!isFullscreen && (
                <div className="absolute top-3 left-3 right-14 z-10">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#14FFEC]" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search for a place..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0a3a3a]/95 border border-[#14FFEC]/30 text-white text-sm placeholder:text-white/50 focus:outline-none focus:border-[#14FFEC] focus:ring-1 focus:ring-[#14FFEC] shadow-lg"
                        />
                        {searchValue && (
                            <button
                                onClick={() => {
                                    setSearchValue('');
                                    if (searchInputRef.current) {
                                        searchInputRef.current.value = '';
                                    }
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            <GoogleMap
                onLoad={handleMapLoad}
                onUnmount={handleMapUnmount}
                center={mapCenter || center}
                zoom={13}
                mapContainerStyle={{ width: '100%', height: isFullscreen ? '100%' : `calc(100% - 40px)` }}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    fullscreenControl: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                    gestureHandling: 'greedy',
                    styles: DARK_MAP_STYLES,
                    backgroundColor: '#1a2e35',
                    clickableIcons: false,
                }}
                onClick={(event) => {
                    try {
                        if (!event || !event.latLng) return;
                        const lat = event.latLng.lat();
                        const lng = event.latLng.lng();
                        if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
                            // Update internal map center state to stay at this location
                            setMapCenter({ lat, lng });

                            // Trigger selection
                            onSelect({ lat, lng });

                            // Navigate map to selected location
                            if (mapRef.current) {
                                mapRef.current.setCenter({ lat, lng });
                                mapRef.current.panTo({ lat, lng });
                                mapRef.current.setZoom(15);
                            }
                        }
                    } catch (error) {
                        console.log('Error handling map click:', error);
                    }
                }}
            >
                <CircleF
                    center={center}
                    radius={radius}
                    options={{
                        fillColor: '#14ffec33',
                        strokeColor: '#14ffec',
                        strokeOpacity: 0.5,
                        strokeWeight: 1,
                    }}
                />
            </GoogleMap>

            {/* Fullscreen toggle button */}
            {showFullscreenButton && (
                <button
                    onClick={toggleFullscreen}
                    className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-[#0a3a3a]/90 border border-[#14FFEC]/30 text-[#14FFEC] hover:bg-[#0a4a4a] transition-colors shadow-lg"
                    title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                >
                    {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </button>
            )}

            <div className="flex items-center justify-between bg-[#021010]/90 px-4 py-2.5 text-xs text-white/70">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white"></div>
                        <span className="text-[10px]">Saved</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-purple-500 border-2 border-white"></div>
                        <span className="text-[10px]">Selected</span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                        <MapPin className="h-3 w-3 text-[#14FFEC]" /> Tap to pin
                    </span>
                </div>
                {isFullscreen && (
                    <span className="text-[#14FFEC] font-medium">ESC to exit</span>
                )}
            </div>
        </div>
    );
}
