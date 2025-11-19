'use client';

import React from 'react';
import { CircleF, GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { Loader2, MapPin } from 'lucide-react';

interface GoogleMapPickerProps {
    center: { lat: number; lng: number };
    radius?: number;
    onSelect: (coords: { lat: number; lng: number }) => void;
    apiKey?: string;
}

const containerStyle: React.CSSProperties = {
    width: '100%',
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
};

export function GoogleMapPicker({ center, radius = 5000, onSelect, apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY }: GoogleMapPickerProps) {
    if (!apiKey) {
        return (
            <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-center text-sm text-white/70">
                <p className="font-semibold">Google Maps disabled</p>
                <p className="mt-1 text-white/60">
                    Provide NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable interactive selection.
                </p>
            </div>
        );
    }

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'clubviz-map-picker',
        googleMapsApiKey: apiKey,
    });

    if (loadError) {
        return (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                Unable to load Google Maps. Please verify the API key and billing status.
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
        <div style={containerStyle}>
            <GoogleMap
                center={center}
                zoom={13}
                mapContainerStyle={{ width: '100%', height: '100%' }}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    styles: [
                        {
                            elementType: 'geometry',
                            stylers: [{ color: '#0b2526' }],
                        },
                        {
                            elementType: 'labels.text.fill',
                            stylers: [{ color: '#f0fdfa' }],
                        },
                    ],
                }}
                onClick={(event) => {
                    if (!event.latLng) return;
                    const lat = event.latLng.lat();
                    const lng = event.latLng.lng();
                    onSelect({ lat, lng });
                }}
            >
                <MarkerF
                    position={center}
                    icon={{
                        url: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
                    }}
                />
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
            <div className="flex items-center justify-between bg-[#021010]/80 px-4 py-2 text-xs text-white/70">
                <span className="flex items-center gap-2 font-semibold uppercase tracking-wide">
                    <MapPin className="h-3.5 w-3.5" /> Tap anywhere to pin
                </span>
            </div>
        </div>
    );
}
